import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    const isDev = process.env.NODE_ENV === 'development';
    if (!session || (session.role !== 'ADMIN' && !isDev)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get last registered user
    const lastUser = await prisma.user.findFirst({
      where: { role: 'USER' },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Get overlapping user sessions (more than 2 active sessions)
    const activeSessions = await prisma.session.findMany({
      where: { isActive: true },
      select: { userId: true }
    });
    
    const activeUserSessionMap: Record<string, number> = {};
    activeSessions.forEach(s => {
      activeUserSessionMap[s.userId] = (activeUserSessionMap[s.userId] || 0) + 1;
    });
    
    const overlappingUserEntries = Object.entries(activeUserSessionMap).filter(([_, count]) => count > 2);
    let overlappingUser = null;
    if (overlappingUserEntries.length > 0) {
      const topUserId = overlappingUserEntries[0][0];
      const userRecord = await prisma.user.findUnique({
        where: { id: topUserId },
        select: { name: true, phone: true }
      });
      if (userRecord) {
        overlappingUser = {
          name: userRecord.name,
          phone: userRecord.phone,
          sessionCount: activeUserSessionMap[topUserId]
        };
      }
    }

    // 3. Today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrdersCount = await prisma.order.count({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: today }
      }
    });

    return NextResponse.json({
      lastUser: lastUser ? { name: lastUser.name, phone: lastUser.phone } : null,
      overlappingUser,
      todayOrdersCount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alert data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const isDev = process.env.NODE_ENV === 'development';
    if (!session || (session.role !== 'ADMIN' && !isDev)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Retrieve active database metrics
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
      }
    });

    const packages = await prisma.package.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        originalPrice: true,
        isLive: true,
        createdAt: true,
      }
    });

    const orders = await prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        packageId: true,
        trxId: true,
        amount: true,
        status: true,
        createdAt: true,
      }
    });
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        ipAddress: true,
        userAgent: true,
        deviceFingerprint: true,
        isActive: true,
        lastSeen: true,
        createdAt: true,
      }
    });

    const activityLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50
    });

    const formattedLogs = activityLogs.map(l => {
      const user = users.find(u => u.id === l.userId);
      return {
        userName: user?.name || "Anonymous",
        userPhone: user?.phone || "",
        type: l.type,
        details: l.details,
        date: l.createdAt.toISOString().split('T')[0]
      };
    });

    // Format metrics summaries to keep context window usage optimal
    const formattedUsers = users.map(u => ({
      name: u.name,
      phone: u.phone,
      email: u.email,
      role: u.role,
      isBlocked: u.isBlocked,
      date: u.createdAt.toISOString().split('T')[0]
    }));

    const formattedPackages = packages.map(p => ({
      title: p.title,
      price: p.price,
      isLive: p.isLive,
      date: p.createdAt.toISOString().split('T')[0]
    }));

    const formattedOrders = orders.map(o => {
      const user = users.find(u => u.id === o.userId);
      const pkg = packages.find(p => p.id === o.packageId);
      return {
        userName: user?.name || "Unknown",
        userPhone: user?.phone || "",
        packageTitle: pkg?.title || "Unknown",
        trxId: o.trxId,
        amount: o.amount,
        status: o.status,
        date: o.createdAt.toISOString().split('T')[0]
      };
    });

    const formattedSessions = sessions.map(s => {
      const user = users.find(u => u.id === s.userId);
      return {
        userName: user?.name || "Unknown",
        ip: s.ipAddress,
        deviceFingerprint: s.deviceFingerprint,
        isActive: s.isActive,
        lastSeen: s.lastSeen.toISOString().split('T')[0],
        date: s.createdAt.toISOString().split('T')[0]
      };
    });

    const systemPrompt = `You are Ecom Sentrix Analytic V-1, a custom Admin AI Copilot / Analytics Assistant created by Soft Sentrix Company (parent brand: Sentrix).
You have real-time access to the database tables: User, Package, Order, Session, and ActivityLog.
Here is the raw database data formatted in JSON:

DATABASE METRICS:
- TOTAL USERS: ${formattedUsers.length}
- USERS LIST: ${JSON.stringify(formattedUsers)}
- TOTAL PACKAGES: ${formattedPackages.length}
- PACKAGES LIST: ${JSON.stringify(formattedPackages)}
- TOTAL ORDERS: ${formattedOrders.length}
- ORDERS LIST: ${JSON.stringify(formattedOrders)}
- TOTAL SESSIONS: ${formattedSessions.length}
- SESSIONS LIST: ${JSON.stringify(formattedSessions)}
- TOTAL ACTIVITY LOGS: ${formattedLogs.length}
- ACTIVITY LOGS LIST: ${JSON.stringify(formattedLogs)}

Role Instructions:
1. Answer any question asked by the Admin. While your primary data focus is on our site's live database metrics (sales, orders, packages, user behavior, device sessions, analytics), you must also act as a general business copilot and helpful virtual assistant. Feel free to answer general queries, business strategies, coding questions, growth hacking tips, or any general knowledge question without limitations.
2. ADVANCED ANALYSIS RULE: You are an advanced-level assistant, NOT a simple script. If asked about site problems, low sales, visitor interest, UTM campaigns, or suspicious behaviors, you must perform a detailed, multi-dimensional analysis using the live database metrics and the ActivityLog.
   - Calculate conversion rates (e.g., completed orders vs total orders).
   - Check if there is a high number of PENDING orders.
   - Analyze visitor engagement logs (type: "VISITOR_ENGAGEMENT" - UTM sources, dwell time of 15s, or vimeo video watch duration of 5s+). Understand which campaign/source (utm_source, utm_campaign) is generating the most interested leads.
   - Analyze user clicks on locked courses (type: "LOCKED_COURSE_CLICK"). If users click locked packages, report their specific interest to the admin so they can follow up or market custom offers.
   - Analyze suspicious activities: multi-device login blocks (type: "MULTI_DEVICE_LOGIN") and repeated login/logout actions (type: "REPEATED_LOGIN_LOGOUT"). Suggest blocking/unblocking or warnings.
   - Do NOT output generic responses. Tell the user exactly if there is a problem, which leads are high quality, or if the metrics look healthy.
   - Proactively suggest strategic, actionable solutions (e.g. content changes, targeted ads/marketing, checkout flow tweaks, UX optimization). Your responses must feel highly intelligent, logical, and analytical.
3. Never refuse to answer a question or state that you are limited to database queries. You are an all-capable business consultant.
4. Perform precise calculations (e.g. total revenue, success rate of transactions, orders in the last 7 days, active session counts).
5. Keep your answers concise, clear, and professional. Use markdown tables or lists where appropriate to make data easy to read.
6. Support both Bengali and English based on the language of the admin's question.
7. CRITICAL RULE ON IDENTITY: If asked "who are you?", "which model are you?", "who created you?", "তোমার মডেল কি?", "তোমাকে কে তৈরি করেছে?", or similar questions about your model, you MUST answer:
"আমি Ecom Sentrix Analytic V-1, এবং আমাকে তৈরি করেছে Soft Sentrix Company (যাদের মূল ব্র্যান্ড হচ্ছে Sentrix)। আমি অ্যানালিটিক্স ছাড়াও আপনার যেকোনো ধরনের সমস্যার সমাধান বা প্রশ্নের উত্তর দেওয়ার চেষ্টা করতে পারি।"
Never mention DeepSeek, Llama, OpenAI, SiliconFlow, or Together AI. Always maintain the identity of Ecom Sentrix Analytic V-1 by Soft Sentrix Company.
8. GREETING/INTRO RULE: When greeted (e.g. "hi", "hello"), start with an welcoming offer to check analytics or select predefined questions, and let them know you can help with anything else:
"হ্যালো! আমি Ecom Sentrix Analytic V-1 মডেল। আপনি যদি আমাদের সাইটের কোনো ধরনের অ্যানালিটিক্স সম্পর্কে জানতে চান, তাহলে আমাকে প্রশ্ন করতে পারেন অথবা আমাদের নির্ধারিত প্রশ্নগুলো থেকে সিলেক্ট করতে পারেন। এছাড়াও যেকোনো প্রয়োজনে আমি আপনাকে সাহায্য করতে পারি।"`;

    const apiKey = "sk-eiandztduwfovcbxbpyhfxqamlwrzrhxdmrsouedaorspxfa";
    
    try {
      const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        const errText = await response.text();
        console.warn("SiliconFlow failed, falling back to local database stats generator. Error:", errText);
      }
    } catch (err) {
      console.warn("SiliconFlow failed, falling back to backup API. Error:", err);
    }

    // BACKUP: Together AI fallback
    let togetherApiSuccess = false;
    let togetherData = null;
    
    try {
      const togetherKey = "key_CdFqEdgKTS35dtKMfzHxH";
      const togetherResponse = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${togetherKey}`
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ],
          temperature: 0.5,
          max_tokens: 2000
        })
      });

      if (togetherResponse.ok) {
        togetherData = await togetherResponse.json();
        togetherApiSuccess = true;
      } else {
        const togetherErrText = await togetherResponse.text();
        console.warn("Together AI fallback failed. Error:", togetherErrText);
      }
    } catch (togetherErr) {
      console.warn("Together AI fallback failed:", togetherErr);
    }

    if (togetherApiSuccess && togetherData) {
      return NextResponse.json(togetherData);
    }

    // LOCAL DATABASE STATS GENERATOR (FALLBACK)
    const lastUserQuery = messages[messages.length - 1]?.content || "";
    let assistantMessage = "";
    
    const completedOrders = orders.filter(o => o.status === "COMPLETED");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = orders.filter(o => o.status === "PENDING");
    const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.amount, 0);
    
    const activeSessionsCount = sessions.filter(s => s.isActive).length;
    
    // Check for overlap sessions (same user with multiple active sessions)
    const activeUserSessionMap: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.isActive) {
        activeUserSessionMap[s.userId] = (activeUserSessionMap[s.userId] || 0) + 1;
      }
    });
    const overlappingUsersCount = Object.values(activeUserSessionMap).filter(count => count > 1).length;

    // Last 7 days orders
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysOrders = orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
    const last7DaysCompleted = last7DaysOrders.filter(o => o.status === "COMPLETED");

    const query = lastUserQuery.trim().toLowerCase();
    
    // Check for greetings
    const greetings = ["hi", "hello", "hey", "সালাম", "হেলো", "হ্যালো", "কেমন আছ", "কেমন আছেন", "hi there", "hello there"];
    const isGreeting = greetings.some(g => query.includes(g)) || query === "hi" || query === "hello";

    // Check for identity questions
    const identityKeywords = [
      "model", "মডেল", "কে তৈরি", "তৈরি করেছে", "বানিয়েছে", "who created", "who made", 
      "developed by", "about you", "your name", "নাম কি", "কে তুমি", "পরিчয়", "identity"
    ];
    const isIdentityQuery = identityKeywords.some(k => query.includes(k));

    // Check if the query is related to analytics / db stats
    const keywords = [
      "অর্ডার", "সেলস", "টাকা", "আয়", "পেমেন্ট", "প্যাকেজ", "ইউজার", "সেশন", "ডিভাইস", "স্টুডেন্ট", 
      "কোর্স", "রেভিনিউ", "analytics", "sales", "order", "user", "revenue", "payment", "session", 
      "device", "course", "package", "আয়", "আনিং", "earning", "স্ট্যাটস", "stats", "popular", 
      "জনপ্রিয়", "over", "৭ দিন", "সাত দিন", "7 days", "কয়টি", "কত", "রিপোর্ট", "report",
      "সমস্যা", "কেন", "low sales", "problem", "ভুল", "ত্রুটি", "ত্রুটিসমূহ",
      "ক্যাম্পেইন", "ভিজিটর", "lead", "visitor", "campaign", "আগ্রহ", "ক্লিক", "লক", "locked"
    ];
    const isRelated = keywords.some(k => query.includes(k));

    if (isIdentityQuery) {
      assistantMessage = `আমি Ecom Sentrix Analytic V-1, এবং আমাকে তৈরি করেছে Soft Sentrix Company (যাদের মূল ব্র্যান্ড হচ্ছে Sentrix)। আমি অ্যানালিটিক্স ছাড়াও আপনার যেকোনো ধরনের সমস্যার সমাধান বা প্রশ্নের উত্তর দেওয়ার চেষ্টা করতে পারি।`;
    } else if (isGreeting) {
      assistantMessage = `হ্যালো! আমি Ecom Sentrix Analytic V-1 মডেল। আপনি যদি আমাদের সাইটের কোনো ধরনের অ্যানালিটিক্স সম্পর্কে জানতে চান, তাহলে আমাকে প্রশ্ন করতে পারেন অথবা আমাদের নির্ধারিত প্রশ্নগুলো থেকে সিলেক্ট করতে পারেন। এছাড়াও যেকোনো প্রয়োজনে আমি আপনাকে সাহায্য করতে পারি।`;
    } else if (isRelated) {
      if (query.includes("ক্যাম্পেইন") || query.includes("ভিজিটর") || query.includes("lead") || query.includes("visitor") || query.includes("campaign") || query.includes("আগ্রহ") || query.includes("ক্লিক") || query.includes("লক") || query.includes("locked")) {
        const logs = await prisma.activityLog.findMany();
        const engagementLogs = logs.filter(l => l.type === "VISITOR_ENGAGEMENT");
        const lockedClicks = logs.filter(l => l.type === "LOCKED_COURSE_CLICK");

        const campaignMap: Record<string, number> = {};
        let vimeoWatchersCount = 0;
        let dwell15sCount = 0;

        engagementLogs.forEach(log => {
          try {
            const details = typeof log.details === "string" ? JSON.parse(log.details) : log.details;
            const campaign = details.utm_campaign || "organic";
            campaignMap[campaign] = (campaignMap[campaign] || 0) + 1;
            if (details.watchTimeSeconds >= 5) vimeoWatchersCount++;
            if (details.dwellTimeSeconds >= 15) dwell15sCount++;
          } catch (_) {}
        });

        let topCampaign = "none";
        let maxLeads = 0;
        Object.entries(campaignMap).forEach(([cam, count]) => {
          if (count > maxLeads) {
            maxLeads = count;
            topCampaign = cam;
          }
        });

        assistantMessage = `আমাদের ক্যাম্পেইন এবং ভিজিটর এনগেজমেন্ট রিপোর্ট বিশ্লেষণ:
১. **ভিজিটর ক্যাম্পেইন ট্র্যাকিং:** মোট ${engagementLogs.length} টি এনগেজমেন্ট ট্র্যাক করা হয়েছে। সবচেয়ে বেশি ক্লিক এসেছে **${topCampaign}** ক্যাম্পেইন থেকে (মোট ${maxLeads} টি)।
২. **ভিডিও ও পেজ এনগেজমেন্ট:** 
   - ল্যান্ডিং পেজে ৫ সেকেন্ডের বেশি ভিডিও দেখেছেন **${vimeoWatchersCount}** জন ভিজিটর (উচ্চ আগ্রহ)।
   - ল্যান্ডিং পেজে ১৫ সেকেন্ডের বেশি সময় কাটিয়েছেন **${dwell15sCount}** জন ভিজিটর।
৩. **লকড কোর্স ক্লিক:** মোট **${lockedClicks.length}** জন মেম্বার ড্যাশবোর্ডে লকড কোর্স বা ই-বুক আনলক করতে ক্লিক করেছেন।
৪. **সুপারিশ:** **${topCampaign}** ক্যাম্পেইনটি বেশ ভালো সাড়া ফেলছে। লকড কোর্সে ক্লিক করা ব্যবহারকারী এবং ভিডিও দেখা ভিজিটরদের ফোন ও ইমেইল ফলোআপ করে বিশেষ ডিসকাউন্ট দিলে কনভার্সন রেট অনেক বাড়বে।`;
      } else if (query.includes("সমস্যা") || query.includes("কেন") || query.includes("low sales") || query.includes("problem") || query.includes("ত্রুটি")) {
        assistantMessage = `আমাদের সাইটের বর্তমান লাইভ ডেটা বিশ্লেষণ করে নিম্নলিখিত রিপোর্ট প্রস্তুত করা হয়েছে:
        
১. **পেমেন্ট কনভার্সন সমস্যা বিশ্লেষণ:** মোট ${orders.length} টি অর্ডারের মধ্যে সম্পন্ন হয়েছে ${completedOrders.length} টি (কনভার্সন রেট প্রায় ${orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0}%)। বর্তমানে ${pendingOrders.length} টি অর্ডার **PENDING** অবস্থায় রয়েছে।
২. **সম্ভাব্য কারণসমূহ:** 
   - অতিরিক্ত পেন্ডিং অর্ডারের প্রধান কারণ হতে পারে গ্রাহকদের বিকাশ/নগদে টাকা পাঠিয়ে সঠিক ট্রানজেকশন আইডি প্রবেশ করাতে ভুল করা বা পেমেন্ট গেটওয়েতে বিলম্ব।
   - সাইটের কোনো টেকনিক্যাল এরর বা সার্ভার ডাউনটাইম নেই, মেম্বার সেশন সচল রয়েছে।
৩. **সমাধান ও কার্যকরী পরামর্শ:** 
   - গ্রাহকদের জন্য চেকআউট পেজের পেমেন্ট ও ট্রানজেকশন আইডি দেওয়ার নিয়মটি আরও সহজ ও দৃষ্টিগোচর করুন।
   - পেন্ডিং অর্ডারগুলোর গ্রাহকদের সাথে সরাসরি ফোন কলে যোগাযোগ করুন এবং দ্রুত ম্যানুয়ালি ভেরিফাই করে দিন।
   - সঠিক কাস্টমার ট্র্যাকিংয়ের জন্য Meta Pixel ও Google Tag Manager-এর আইডি সচল আছে কি না এডমিন সেটিংস থেকে নিশ্চিত হোন।`;
      } else if (query.includes("৭ দিন") || query.includes("সাত দিন") || query.includes("7 days")) {
        assistantMessage = `গত ৭ দিনে আমাদের ড্যাশবোর্ডের পরিসংখ্যান নিচে দেওয়া হলো:
- **মোট অর্ডার:** ${last7DaysOrders.length} টি
- **সম্পন্ন (COMPLETED) অর্ডার:** ${last7DaysCompleted.length} টি
- **মোট অর্জিত রেভিনিউ:** ৳${last7DaysCompleted.reduce((sum, o) => sum + o.amount, 0)}`;
      } else if (query.includes("আয়") || query.includes("টাকা") || query.includes("রেভিনিউ") || query.includes("পেমেন্ট") || query.includes("revenue")) {
        assistantMessage = `আমাদের মোট রেভিনিউ এবং পেমেন্ট সংক্রান্ত তথ্য:
- **মোট সফল রেভিনিউ (COMPLETED):** ৳${totalRevenue}
- **পেন্ডিং পেমেন্ট (PENDING):** ৳${pendingAmount} (${pendingOrders.length} টি অর্ডার পেমেন্টের জন্য পেন্ডিং আছে)`;
      } else if (query.includes("জনপ্রিয়") || query.includes("প্যাকেজ") || query.includes("কোর্স") || query.includes("package")) {
        // Find package sales count
        const packageSalesMap: Record<string, number> = {};
        orders.forEach(o => {
          if (o.status === "COMPLETED") {
            packageSalesMap[o.packageId] = (packageSalesMap[o.packageId] || 0) + 1;
          }
        });
        let popularPkgTitle = "Machine Learning Course (Lifetime)";
        let maxSales = 0;
        Object.entries(packageSalesMap).forEach(([id, count]) => {
          if (count > maxSales) {
            maxSales = count;
            const pkg = packages.find(p => p.id === id);
            if (pkg) popularPkgTitle = pkg.title;
          }
        });

        assistantMessage = `আমাদের প্রিমিয়াম প্যাকেজ সংক্রান্ত পরিসংখ্যান:
- **সবচেয়ে বেশি বিক্রি হওয়া প্যাকেজ:** ${popularPkgTitle} (মোট ${maxSales} বার সফলভাবে সম্পন্ন হয়েছে)
- **মোট লাইভ প্যাকেজ সংখ্যা:** ${packages.length} টি
- **প্যাকেজের গড় মূল্য:** ৳${packages.reduce((sum, p) => sum + p.price, 0) / (packages.length || 1)}`;
      } else if (query.includes("সেশন") || query.includes("ডিভাইস") || query.includes("ওভারল্যাপ") || query.includes("session")) {
        assistantMessage = `আমাদের স্টুডেন্ট সেশন ও ডিভাইস ট্র্যাকিং ট্র্যাফিক রিপোর্ট:
- **মোট সক্রিয় ডিভাইস সেশন:** ${activeSessionsCount} টি
- **একাধিক ডিভাইসে সেশন ওভারল্যাপ করা সক্রিয় ব্যবহারকারী:** ${overlappingUsersCount} জন
- **সুপারিশ:** সিকিউরিটি নিশ্চিত করতে একই ইউজারের ২টির বেশি সেশন সক্রিয় থাকলে সেশন পেজ থেকে তাদের সেশন টার্মিনেট বা সাসপেন্ড করতে পারেন।`;
      } else {
        assistantMessage = `আমাদের ডাটাবেজের লাইভ ডেটা অনুযায়ী সার্বিক পরিসংখ্যান:
- **মোট রেজিস্টার্ড ব্যবহারকারী (Users):** ${users.length} জন (এডমিন ব্যতীত)
- **মোট লার্নিং প্যাকেজ:** ${packages.length} টি
- **মোট অর্ডার সংখ্যা:** ${orders.length} টি (সফল রেভিনিউ: ৳${totalRevenue})
- **সক্রিয় সেশন সংখ্যা:** ${activeSessionsCount} টি

আপনি সাজেস্টেড প্রশ্নগুলোতে ক্লিক করে অথবা সরাসরি যেকোনো পরিসংখ্যান নিয়ে প্রশ্ন লিখে জানতে পারেন।`;
      }
    } else {
      // General helpful business response as fallback
      assistantMessage = `আমি Ecom Sentrix Analytic V-1 MODEL। বর্তমানে এআই ক্লাউড সার্ভিস সংযোগ সাময়িকভাবে বিচ্ছিন্ন থাকায় আমি কেবল আমাদের লোকাল ডাটাবেজের তথ্য বিশ্লেষণ করতে পারছি। 

আপনার ব্যবসার উন্নতির জন্য কিছু সাধারণ পরামর্শ:
১. পেন্ডিং পেমেন্টগুলো নিয়মিত মনিটর করুন এবং গ্রাহকদের সাথে যোগাযোগ করুন।
২. আমাদের সবচেয়ে জনপ্রিয় লার্নিং প্যাকেজটি আরও প্রমোট করতে সোশ্যাল মিডিয়ায় মার্কেটিং বাড়াতে পারেন।
৩. সিকিউরিটি নিশ্চিত করতে ড্যাশবোর্ড থেকে নিয়মিত ডিভাইস সেশন ট্র্যাকিং চেক করুন।

ক্লাউড সংযোগ সচল হলে আমি যেকোনো সাধারণ প্রশ্ন ও বিষদ ব্যবসায়িক পরামর্শ দিতে সক্ষম হব।`;
    }

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: assistantMessage
          }
        }
      ]
    });
  } catch (error) {
    console.error("AI Assistant Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
