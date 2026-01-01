import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Script src="/runtime-config.js" strategy="beforeInteractive" />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
