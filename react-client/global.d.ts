declare module '*.css';
declare module '*.svg';

//todo Move the following types into TurnstileWidget?
//? Found via Turnstile-Types (https://github.com/Le0Developer/turnstile-types/blob/master/index.d.ts)
//* Recommended by Cloudflare's Community Resources Client-side Rendering
type WidgetId = string;
type Container = ElementId | HTMLElement;

interface Window {
    turnstile: TurnstileObject;
}

interface TurnstileObject {
    ready: () => void;
    implicitRender: () => void;
    execute: (container?: Container, options?: TurnstileOptions) => void;
    render: (container: Container, options: TurnstileOptions) => WidgetId;
    reset: (widget?: Container | WidgetId) => void;
    remove: (widget?: Container | WidgetId) => void;
    getResponse: (widget?: Container | WidgetId) => string | undefined;
}

interface TurnstileOptions {
    sitekey: string;
    action?: string;
    cData?: string;
    callback?: (token: string) => void;
    "error-callback"?: () => void;
    "expired-callback"?: (token: string) => void;
    "timeout-callback"?: () => void;
    theme?: "light" | "dark" | "auto"; //* Defaults to "auto"
    language?: SupportedLanguages | "auto"; //* Defaults to "auto"
    tabindex?: number; //* Defaults to 0
    "response-field"?: boolean; //* Defaults to true
    "response-field-name"?: string; //* Defaults to "cf-turnstile-response"
    size?: "normal" | "invisible" | "compact"; //* Defaults to "normal"
    retry?: "auto" | "never"; //* Defaults to "auto"
    "retry-interval"?: number; //* Can wait up to 15 mins, i.e. 900,000 milliseconds, defaults to 8 seconds
    "refresh-expired"?: "auto" | "manual" | "never"; //* Defaults to "auto"
    appearance?: "always" | "execute" | "interaction-only";
    execution?: "render" |  "execute";
}

type SupportedLanguages = "ar-eg" | "de" | "en" | "es" | "fa" | "fr" | "id" | "it" | "ja" | "ko" | "nl" | "pl" | "pt-br" | "ru" | "tr" | "zh-cn" | "zh-tw"
