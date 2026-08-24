import Link from "next/link";
import { CheckCircle2, PlayCircle, LogIn, ArrowRight, Star, HelpCircle } from "lucide-react";
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Ensure fresh data on reload

export default async function LandingPage() {
  
  // Fetch settings from DB
  const dbSettings = await prisma.setting.findMany();
  const settingsMap = dbSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // Fallback defaults if not set in DB
  const t = {
    headline: settingsMap.HERO_HEADLINE || "Python, Pandas, Numpy এ কি আপনার দুর্বলতা আছে?",
    subheadline: settingsMap.HERO_SUBHEADLINE || "Learn Machine Learning through 15+ real-world projects! ১০ জনের মধ্যে ৮ জন স্টুডেন্টই বেসিক শেখার পর আটকে যায়।",
    videoText: settingsMap.VIDEO_TEXT || "৯৯% স্টুডেন্ট এই ভুলটি করেন!",
    videoSub: settingsMap.VIDEO_SUBTEXT || "ভিডিওটি শেষ পর্যন্ত মনোযোগ দিয়ে দেখুন, স্পেশাল অফার আছে!",
    ctaSub: settingsMap.CTA_SUBTEXT || "অর্ডার করতে নিচের বাটনে ক্লিক করুন",
    ctaBtn: settingsMap.CTA_BUTTON_TEXT || "অর্ডার করতে চাই",
    problemTitle: settingsMap.PROBLEM_TITLE || "আপনার বর্তমান স্কিল নিয়ে কি আপনি সত্যিই খুশি?",
    problemSub: settingsMap.PROBLEM_SUBTITLE || "দিন দিন কি ক্যারিয়ার নিয়ে হতাশা বাড়ছে? জবের ইন্টারভিউতে আটকে যাচ্ছেন?",
    problemPoints: [
      settingsMap.PROBLEM_POINT_1 || "No idea about Model Deployment?",
      settingsMap.PROBLEM_POINT_2 || "Never worked with real-world datasets?",
      settingsMap.PROBLEM_POINT_3 || "Only know the basics but can't build projects?"
    ],
    midBanner: settingsMap.MID_BANNER || "ক্যারিয়ার গড়তে আজই এনরোল করুন, Machine Learning Course!",
    testimonialsTitle: settingsMap.TESTIMONIALS_TITLE || "৩,২৫০+ স্টুডেন্ট কি বলছে?",
    testimonialsSub: settingsMap.TESTIMONIALS_SUB || "আমাদের কোর্স সম্পর্কে স্টুডেন্টদের রিভিউ।",
    offerBadge: settingsMap.OFFER_BADGE || "আজকের এক্সক্লুসিভ অফার!",
    offerPoints: [
      settingsMap.OFFER_POINT_1 || "60+ Premium Video Lessons",
      settingsMap.OFFER_POINT_2 || "15+ Real World Project Source Code",
      settingsMap.OFFER_POINT_3 || "Private Support Group Access",
      settingsMap.OFFER_POINT_4 || "Lifetime Access & Updates"
    ],
    regularPrice: settingsMap.REGULAR_PRICE || "৫,০০০ টাকা",
    offerPrice: settingsMap.OFFER_PRICE || "৯৯০৳",
    faqTitle: settingsMap.FAQ_TITLE || "কোর্স সম্পর্কে তথ্য ও জিজ্ঞাসা",
    faqPoints: [
      settingsMap.FAQ_POINT_1 || "কোর্সটি কাদের জন্য?",
      settingsMap.FAQ_POINT_2 || "আমি কি ভিডিওগুলো ডাউনলোড করতে পারব?",
      settingsMap.FAQ_POINT_3 || "পেমেন্ট করার পর কিভাবে এক্সেস পাব?"
    ],
    copyright: settingsMap.FOOTER_COPYRIGHT || "Copyright © 2026 | All Rights Reserved by Night Syllabus."
  };
  
  const whatsappNumber = settingsMap.WHATSAPP_NUMBER || "8801700000000"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  
  const videoUrl = settingsMap.LANDING_VIDEO_URL || "#";
  const videoThumbnail = settingsMap.LANDING_VIDEO_THUMBNAIL || "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 pb-0 relative">
      
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-extrabold text-black tracking-tight">
              Night<span className="text-[#ff0000]">Syllabus</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন করুন</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="w-full mx-auto text-center pt-24">
        
        {/* Main Headline */}
        <div className="px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4 tracking-tight" dangerouslySetInnerHTML={{ __html: t.headline }} />
          <p className="text-sm md:text-base text-gray-800 font-bold mb-6 max-w-2xl mx-auto leading-relaxed">
            {t.subheadline}
          </p>

          {/* Video Placeholder */}
          <div className="relative w-full max-w-3xl mx-auto aspect-video bg-black border-[6px] border-black rounded overflow-hidden shadow-2xl mb-6 group cursor-pointer">
            <a href={videoUrl} target="_blank" rel="noreferrer">
              <img src={videoThumbnail} alt="Video Thumbnail" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-[#ff0000] w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.8)] group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mt-4 bg-black/70 px-4 py-2 rounded">
                  {t.videoText}
                </h3>
              </div>
            </a>
          </div>

          {/* Black Box under video */}
          <div className="bg-black text-white p-5 rounded-md mb-8 border border-[#ff0000] mx-auto max-w-3xl shadow-xl">
            <p className="font-bold text-sm md:text-base text-[#ffba00] mb-2">{t.videoSub}</p>
            <p className="text-xs text-gray-300 mb-5">{t.ctaSub}</p>
            <Link href="/checkout" className="inline-block bg-[#ff0000] text-white font-extrabold py-3 px-12 rounded shadow-lg hover:bg-[#cc0000] transition-colors animate-pulse-btn text-base md:text-lg">
              {t.ctaBtn}
            </Link>
          </div>
        </div>

        {/* Problem Section */}
        <div className="mt-16 mb-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-4">
            {t.problemTitle}
          </h2>
          <p className="text-sm font-bold text-gray-600 mb-8 max-w-2xl mx-auto">
            {t.problemSub}
          </p>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto text-left">
            {t.problemPoints.map((text, i) => (
              text && (
                <div key={i} className="border-l-4 border-l-[#ff0000] border border-gray-300 rounded p-4 flex items-center gap-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#ff0000]"><ArrowRight className="w-5 h-5"/></div>
                  <div className="text-sm md:text-base font-bold text-gray-800 text-left">{text}</div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Black banner & Button */}
        <div className="mb-16 px-4">
          <div className="bg-black text-white font-bold py-5 px-6 rounded-md inline-block shadow-xl mx-auto max-w-2xl text-sm md:text-base border border-gray-800">
            {t.midBanner}
          </div>
          
          <div className="mt-8">
            <Link href="/checkout" className="inline-block bg-[#ff0000] text-white font-extrabold py-3 px-12 rounded-md shadow-lg hover:bg-[#cc0000] transition-colors animate-pulse-btn text-lg">
              {t.ctaBtn}
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 bg-white py-14 border-t border-b border-gray-200 px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-2">
            {t.testimonialsTitle}
          </h2>
          <p className="text-sm font-bold text-gray-600 mb-10">{t.testimonialsSub}</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Review 1 */}
            <div className="bg-gradient-to-b from-[#660000] to-[#220000] p-6 rounded-lg text-center shadow-[0_0_15px_rgba(255,0,0,0.15)] border border-[#ff0000]">
               <div className="flex justify-center text-[#ffba00] mb-4">
                 <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
               </div>
               <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">অনেক কিছু ট্রাই করেছি কিন্তু এটার মত ভালো রেজাল্ট পাইনি।</p>
               <div className="text-white font-bold text-sm">- কাস্টমার রিভিউ</div>
            </div>
            {/* Review 2 */}
            <div className="bg-gradient-to-b from-[#660000] to-[#220000] p-6 rounded-lg text-center shadow-[0_0_15px_rgba(255,0,0,0.15)] border border-[#ff0000]">
               <div className="flex justify-center text-[#ffba00] mb-4">
                 <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
               </div>
               <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">প্রোডাক্টটি সত্যিই কাজ করে। কোন সাইড ইফেক্ট বুঝতে পারিনি।</p>
               <div className="text-white font-bold text-sm">- কাস্টমার রিভিউ</div>
            </div>
            {/* Review 3 */}
            <div className="bg-gradient-to-b from-[#660000] to-[#220000] p-6 rounded-lg text-center shadow-[0_0_15px_rgba(255,0,0,0.15)] border border-[#ff0000]">
               <div className="flex justify-center text-[#ffba00] mb-4">
                 <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
               </div>
               <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">প্রথমবার অর্ডার করেছিলাম, এখন আবার অর্ডার করছি। রেকমেন্ডেড!</p>
               <div className="text-white font-bold text-sm">- কাস্টমার রিভিউ</div>
            </div>
          </div>
          
          <div className="mt-10">
            <Link href="/checkout" className="inline-block bg-[#ff0000] text-white font-extrabold py-3 px-12 rounded shadow-lg hover:bg-[#cc0000] transition-colors animate-pulse-btn text-lg">
              {t.ctaBtn}
            </Link>
          </div>
        </div>

        {/* Exclusive Offer Section */}
        <div className="px-4">
          <div className="bg-black border-[3px] border-[#ff0000] rounded-xl max-w-2xl mx-auto p-1 mb-20 relative mt-16 shadow-2xl">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#ff0000] text-white font-bold px-8 py-2.5 rounded-full border-2 border-black whitespace-nowrap shadow-md text-lg">
              {t.offerBadge}
            </div>
            
            <div className="bg-black p-6 md:p-10 pt-12 rounded-lg text-left">
              <div className="space-y-3 mb-10">
                {t.offerPoints.map((point, i) => (
                  point && (
                    <div key={i} className="flex items-center gap-4 bg-[#1a1a1a] p-3.5 rounded border border-gray-800">
                      <div className="bg-[#ff0000] p-1.5 rounded text-white"><CheckCircle2 className="w-5 h-5" /></div>
                      <div className="text-white text-sm md:text-base font-bold">{point}</div>
                    </div>
                  )
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium mb-1">
                  রেগুলার প্রাইজ: <span className="line-through">{t.regularPrice}</span>
                </p>
                <h3 className="text-4xl md:text-5xl font-black text-[#ff0000] mb-8 drop-shadow-md">
                  আজকের অফার: {t.offerPrice}
                </h3>
                
                <Link href="/checkout" className="inline-block bg-[#ff0000] text-white font-extrabold py-4 px-10 rounded-md shadow-lg hover:bg-[#cc0000] transition-colors animate-pulse-btn w-full text-xl md:text-2xl">
                  {t.ctaBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20 px-4">
          <h2 className="text-2xl font-extrabold text-black mb-8">
            {t.faqTitle}
          </h2>
          <div className="max-w-2xl mx-auto space-y-3 text-left">
            {t.faqPoints.map((q, i) => (
              q && (
                <div key={i} className="border border-gray-300 rounded p-4 bg-white cursor-pointer hover:bg-gray-50 flex justify-between items-center shadow-sm">
                  <span className="font-bold text-gray-800 text-sm md:text-base">{q}</span>
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </div>
              )
            ))}
          </div>
        </div>

      </main>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappLink}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-all z-50 flex items-center justify-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-10 text-center text-xs border-t-4 border-[#ff0000]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-medium">{t.copyright}</p>
          <div className="flex gap-6 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
