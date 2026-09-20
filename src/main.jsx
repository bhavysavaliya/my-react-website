import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/style.css";
import "./styles/home.css";
import "./styles/about.css";
import "./styles/products.css";
import "./styles/services.css";
import "./styles/gallery.css";
import "./styles/contact.css";
import "./styles/admin.css";
import "./migration.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
