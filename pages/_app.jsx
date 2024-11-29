import { Fragment } from "react";
import "../styles/main.scss";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CommonMeta, AlertModal } from "@/components";
import { AlertProvider } from "@/contexts/AlertContext";
import PulseKeeper from "@/utils/pulseKeeper";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Fragment>
      <SessionProvider session={session}>
        <PulseKeeper />
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
