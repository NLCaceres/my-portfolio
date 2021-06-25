const ConsoleLogger = (message) => {
  if (process.env.RACK_ENV === 'production' || process.env.REACT_APP_RACK_ENV === 'production') return; 
  console.log(message);
}

export default ConsoleLogger;