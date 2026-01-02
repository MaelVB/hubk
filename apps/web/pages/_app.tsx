import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import "@mantine/core/styles.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Script src="/runtime-config.js" strategy="beforeInteractive" />
      <MantineProvider defaultColorScheme="auto">
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}
