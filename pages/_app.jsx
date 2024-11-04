import { Fragment } from "react";
import "../styles/main.scss";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CommonMeta } from "@/components";
import { AlertProvider } from "@/contexts/AlertContext";
import { AlertModal } from "@/components";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Fragment>
      <SessionProvider session={session}>
        <AlertProvider>
          <Component {...pageProps} />
          <AlertModal />
          <Analytics />
          <SpeedInsights />
          <CommonMeta />
        </AlertProvider>
      </SessionProvider>
    </Fragment>
  );
}
