// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.console.warn = jest.fn(); //* Ignores ReactRouter basename warning (May hide other issues!)
process.env = {
  REACT_APP_RACK_ENV: "",
  REACT_APP_CONTACTABLE: "true",
  REACT_APP_ABOUT_ME_ID: "1"
}
