import { ViewWidthProvider } from "./ContextProviders/ViewWidthProvider";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App/App";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
const root = createRoot(container); //? createRoot(container!) if using TypeScript
root.render(<BrowserRouter> <ViewWidthProvider> <App/> </ViewWidthProvider> </BrowserRouter>); 
//? React-Router works via 3 components, 'Router', 'Routes', & 'Route'. Without the Router wrapper here, router hooks don't work in <App />

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
