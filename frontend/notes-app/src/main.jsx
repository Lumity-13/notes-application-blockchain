// Polyfill Buffer globally for Blaze SDK
import { Buffer } from "buffer/";
window.Buffer = Buffer;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);