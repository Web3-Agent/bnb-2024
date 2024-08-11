import { Router } from "next/router";
import React, { useEffect, useState } from "react";

import "bootstrap/scss/bootstrap.scss";
import '../styles/globals.css'; // If you have global styles

import '../components/PromptList/PromptList.module.css'; // Import the CSS module if it contains any global styles


// ========= Plugins CSS START =========
import "../public/css/plugins/feature.css";
import "../public/css/plugins/animation.css";
import "../node_modules/sal.js/dist/sal.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-tooltip/dist/react-tooltip.css";
// ========= Plugins CSS END =========

import "../public/scss/style.scss";
import Loading from "@/components/Loading/Loading";
import ChatComponentHandlerProvider from "@/context/ChatComponentHandler";

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

    const handleStart = (url) => url !== Router.asPath && setLoading(true);
    const handleComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  return <>
    <ChatComponentHandlerProvider>
      {loading ? <Loading /> : <Component {...pageProps} />}
    </ChatComponentHandlerProvider>

  </>;
}
