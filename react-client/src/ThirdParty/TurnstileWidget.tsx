import { useEffect } from "react";
import TurnstileWidgetCss from "./TurnstileWidget.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

export interface TurnstileWidgetProps {
  action: string, compact: boolean, successCB: Function, className?: string
}
const defaultProps = { //? Ensures props get defaults when placed in layout when using ".defaultProps"
  compact: false
}

const TurnstileWidget = ({ action, compact, successCB, className }: TurnstileWidgetProps & typeof defaultProps) => {
  const turnstileSize = (compact) ? "compact" : "normal"
  useEffect(() => {
    const turnstileRenderTimeoutID = setTimeout(() => {
      //? Config Options - https://developers.cloudflare.com/turnstile/get-started/client-side-rendering
      window.turnstile.render("#turnstile-widget-container", {
        sitekey: process.env.REACT_APP_TURNSTILE_SITE_KEY ?? "",
        action: action, //? 0-32 chars that describes the widget's purpose
        callback: function(token: string) {
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
      }); //? Until Cloudflare provides a retry/refresh-callback, intricate styling (like via document.query) can be
      //? reset by the widget's Refresh Button, so stick to basic height/width changes via this parent-div for now
    }, 750) //? A timeout w/ a delay helps when rendering a Widget in a Component entering via Routing Nav Animation

    return () => { clearTimeout(turnstileRenderTimeoutID) }

  }, [action, turnstileSize, successCB]);

  return (<div id="turnstile-widget-container" className={`${className || ""} ${TurnstileWidgetCss.turnstileContainer}`}></div>)
} //todo Could render a placeholder labeled "Initializing Turnstile Verification Widget" while timeout is waiting

TurnstileWidget.defaultProps = defaultProps;
export default TurnstileWidget;