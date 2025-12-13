
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./styles/globals.css";
  import "./styles/auto-contrast-enforcer.css";
  import "./index.css";
  import { initializeContrastEnforcer } from "./utils/contrastEnforcer";

  // Initialize automatic contrast enforcement
  initializeContrastEnforcer();

  createRoot(document.getElementById("root")!).render(<App />);
  