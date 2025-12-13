
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./styles/globals.css";
  import "./styles/auto-contrast-enforcer.css";
  import "./index.css";

  // CSS-based automatic contrast enforcement is sufficient
  // JavaScript enforcer available if needed: import { initializeContrastEnforcer } from "./utils/contrastEnforcer";

  createRoot(document.getElementById("root")!).render(<App />);
  