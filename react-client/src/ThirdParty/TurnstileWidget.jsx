import React, { useEffect } from "react";
import TurnstileWidgetCss from "./TurnstileWidget.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

const TurnstileWidget = ({ action, compact, successCB, className }) => {
  const turnstileSize = (compact) ? "compact" : "normal"
  useEffect(() => {
    const turnstileRenderTimeoutID = setTimeout(() => {
      //? Config Options - https://developers.cloudflare.com/turnstile/get-started/client-side-rendering
      window.turnstile.render("#turnstile-widget-container", {
        sitekey: process.env.REACT_APP_TURNSTILE_SITE_KEY,
        action: action, //? 0-32 chars that describes the widget's purpose
        callback: function(token) {
          ConsoleLogger(`Challenge Success - ${token}`);
          successCB(token);
        },
        size: turnstileSize,
        retry: "never", //? If error-callback fires, retry happens anyway!
        "refresh-expired": "manual",
        "expired-callback": function() { //? Token expires 300 seconds after issue. Manual refresh requires user button click
          ConsoleLogger("Challenge Expired");
        },
        "timeout-callback": function() { //? Fires when interactive challenge issued BUT user DOESN'T interact
          ConsoleLogger("Challenge Timed Out"); //? It does auto-reset the widget upon interaction
        },
        "error-callback": function() { //? Only fires if network issue occurs for some reason
          ConsoleLogger("Challenge Error Occurred!");
        }
      }); //? Running setTimeout w/out a delay param passed in like this makes the callback run IMMEDIATELY (so ASAP)
    }) //? Until Cloudflare provides a retry/refresh-callback, best to hold off on styling it, especially via document.query(),
    //? because the widget's style resets if the user taps the refresh button to restart the challenge

    return () => { clearTimeout(turnstileRenderTimeoutID) }

  }, [action, turnstileSize, successCB]);

  return (<div id="turnstile-widget-container" className={`${className || ""} ${TurnstileWidgetCss.turnstileContainer}`}></div>)
}

export default TurnstileWidget;