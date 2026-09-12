import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GATE CE 70+ // SUMANVOLT",
  description: "Mission 70+ IIT Bombay Civil Engineering Command Center",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GATE CE",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2545",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then((reg) => {
                    reg.onupdatefound = () => {
                      const installingWorker = reg.installing;
                      if (installingWorker) {
                        installingWorker.onstatechange = () => {
                          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            window.location.reload();
                          }
                        };
                      }
                    };
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}