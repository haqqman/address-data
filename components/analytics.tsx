'use client'
import Script from 'next/script'
import React from 'react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'

const Analytics = () => {
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL

  return (
    <>
      <VercelAnalytics />

      {/* Facebook Pixel */}
      {FB_PIXEL_ID && (
        <Script strategy='afterInteractive' id='facebook-pixel'>
          {`
            !function(f,b,e,v,n,t,s) {
              if(f.fbq) return;
              n = f.fbq = function() {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
              };
              if(!f._fbq) f._fbq = n;
              n.push = n;
              n.loaded = true;
              n.version = '2.0';
              n.queue = [];
              t = b.createElement(e);
              t.async = true;
              t.src = v;
              s = b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t, s);
            }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Google Analytics */}
      {GA_ID && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script strategy='afterInteractive' id='google-analytics'>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </>
  )
}

export default Analytics
