import { useCallback } from "react";
import ConsoleLogger from "../Functions/LoggerFuncs";
import UseOnMount from "../Hooks/UseOnMount";
import TurnstileWidgetCss from "./TurnstileWidget.module.css";

const TurnstileWidget = ({ action, successCB, className }) => {
  const memoizedRenderer = useCallback(() => { 
    const turnstileRenderTimeoutID = setTimeout(() => {
      //? Config Options - https://developers.cloudflare.com/turnstile/get-started/client-side-rendering
      window.turnstile.render("#turnstile-widget-container", {
        sitekey: process.env.REACT_APP_TURNSTILE_SITE_KEY,
        action: action, //? 0-32 chars that describes the widget's purpose
        callback: function(token) {
          ConsoleLogger(`Challenge Success - ${token}`);
          successCB(token);
        },
        retry: 'never', //? If error-callback fires, retry happens anyway!
        'refresh-expired': 'manual',
        "expired-callback": function() { //? Token expires 300 seconds after issue. Manual refresh requires user button click
          ConsoleLogger(`Challenge Expired`);
        },
        "timeout-callback": function() { //? Fires when interactive challenge issued BUT user DOESN'T interact
          ConsoleLogger(`Challenge Timed Out`); //? It does auto-reset the widget upon interaction
        },
        "error-callback": function() { //? Only fires if network issue occurs for some reason
          ConsoleLogger(`Challenge Error Occurred!`);
        }
      }); // Running setTimeout w/out a delay param makes it called IMMEDIATELY (so ASAP)
    })
    //? Until Cloudflare provides a retry/refresh-callback, the widget's style resets if the user taps the 
    //? refresh button to restart the challenge. SO best to hold off on styling it
    // const turnstileWidgetStyleTimeoutID = setTimeout(() => {
    //   const turnstileFrame = document.querySelector('[id^="cf-chl-widget-"]');
    //   turnstileFrame.style = "height: 67px; width: 227px;" // Loses border if at height less than 64px
    // }, 250); // 250ms is about enough time to ensure our style is the final rendered result
    
     //* Prevent calling either func if user quickly taps modal closed, or a "missing HTMLElement error" is thrown
    return () => { clearTimeout(turnstileRenderTimeoutID) }

  }, [action, successCB]);

  UseOnMount(memoizedRenderer); //* Call the memoized renderer only onMount and its unMount function on unmount

  return (<div id="turnstile-widget-container" className={`${className || ''} ${TurnstileWidgetCss.turnstileContainer}`}></div>)
}

export default TurnstileWidget;