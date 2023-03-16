//? Since Typescript always types thrown errors as "unknown", I can enforce typing more easily with the following helpers
//? But why is the type "unknown"? Because Javascript lets you throw just about anything, not just "new Error('Your error message')"
//? As a result, "throw 'Foobar'", "throw 12", "throw { foo: 'bar' }", "throw () => 1.2", and "throw undefined" are all equally valid

//! Firstly, setup a type that provides us with the needed properties
type ErrorWithMessage = {
  message: string //* in particular, a message prop that the user and I can use to understand what went wrong
}

//! Now enforce the typing through narrowing
//? Using "is" in the return ensures Typescript can set the type of the obj to ErrorWithMessage after using this func
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" && error !== null &&  //? "new Error()" is definitely an object AND it is not null!
    "message" in error && typeof error.message === "string" //* AND also be sure the error has a message prop AND it is a string
  )
} //? Could write "error.message" as "(error as Record<string, unknown>).message" to ensure that
//? error is some object with string based properties (e.g. error['message']) BUT the usage feels incorrect given
//? Record<Key, Value> is similar to saying "interface Foo { [key: string]: unknown }" w/out actually writing an interface
//? Which commonly is used to make switch cases exhaustive due to its limiting nature in that particular scope

//! Return an error with a message property
function newErrorWithMessage(possibleErrorObj: unknown): ErrorWithMessage {
  if (isErrorWithMessage(possibleErrorObj)) return possibleErrorObj

  try { //* If no error message found, then just turn the error obj found into a string!
    return new Error(JSON.stringify(possibleErrorObj)) //* via stringify!
  } 
  catch { //* In case stringify fails, catch the error and try using String() on the error
    return new Error(String(possibleErrorObj))
  }
}

//! If we only care about the message, use this function to just get that string
export default function getErrorMessage(error: unknown) {
  return newErrorWithMessage(error).message
}