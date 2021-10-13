const ConsoleLogger = (message, componentName, lineNum) => {
  if (process.env.RACK_ENV === 'production' || process.env.REACT_APP_RACK_ENV === 'production') return; 

  const stackTrace = (componentName && lineNum) ? `Inside: ${componentName} Component on line #${lineNum}` : 
    (componentName) ? `Inside: ${componentName} Component` : '';
    
  if (typeof message === 'object' && message !== null) {
    if (stackTrace !== '') console.log(stackTrace);
    console.log(message);
  } else {
    console.log(`${stackTrace} - ${message}`)
  }
}

export default ConsoleLogger;