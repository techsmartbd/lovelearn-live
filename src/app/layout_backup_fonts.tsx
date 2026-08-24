import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { Providers } from "@/app/providers";

const hindSiliguri = Hind_Siliguri({ 
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "ML Educational Video Course",
  description: "Learn and master ML with our comprehensive video course.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch tracking IDs from DB settings
  let pixelId = "";
  let gtmId = "";
  let customHeader = "";
  let customFooter = "";

  try {
    const dbSettings = await prisma.setting.findMany();
    const settingsMap = dbSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    pixelId = settingsMap.META_PIXEL_ID || "";
    gtmId = settingsMap.GOOGLE_TAG_ID || "";
    customHeader = settingsMap.CUSTOM_SCRIPT_HEADER || "";
    customFooter = settingsMap.CUSTOM_SCRIPT_FOOTER || "";
  } catch (error) {
    console.error("Failed to load layout settings:", error);
  }

  return (
    <html lang="bn" translate="no" className="notranslate" suppressHydrationWarning>
      <head>
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
        {pixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        {customHeader && (
          <script
            dangerouslySetInnerHTML={{
              __html: customHeader
            }}
          />
        )}
      </head>
      <body className={`${hindSiliguri.className} bg-slate-50 text-slate-900 antialiased`} suppressHydrationWarning>
        {gtmId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `,
            }}
          />
        )}
        {pixelId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <img height="1" width="1" style="display:none"
                src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />
              `,
            }}
          />
        )}
        <Providers>
          {children}
        </Providers>
        {customFooter && (
          <script
            dangerouslySetInnerHTML={{
              __html: customFooter
            }}
          />
        )}
      </body>
    </html>
  );
}
