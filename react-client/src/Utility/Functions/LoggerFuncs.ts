
const ConsoleLogger = (message: string | object, componentName?: string, lineNum?: number) => {
  if (process.env.RACK_ENV === "production" || process.env.REACT_APP_RACK_ENV === "production") return;

  //* Make your own stack trace by passing a short component name and the line num from your editor
  const stackTrace = (componentName && lineNum) ? `Inside: ${componentName} Component on line #${lineNum}` :
    (componentName) ? `Inside: ${componentName} Component` : "";

  if (typeof message === "object" && message !== null) {
    if (stackTrace !== "") { console.log(stackTrace); return; } //* If made a stack trace, log here only
    console.log(message);
  } else {
    console.log(`${stackTrace} - ${message}`);
  }
};

export default ConsoleLogger;