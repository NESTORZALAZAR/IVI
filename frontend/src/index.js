import React from "react";
import ReactDOM from "react-dom/client";
import App from "./js/App";
import { AccessibilityProvider } from "./js/context/AccessibilityContext";
import "./css/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AccessibilityProvider>
    <App />
  </AccessibilityProvider>
);
