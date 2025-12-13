
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./styles/globals.css";
  import "./index.css";
  // CRITICAL: Load contrast enforcer LAST for maximum priority
  import "./styles/critical-contrast-enforcer.css";

  // POLICY: Unreadable text = CRITICAL BUG
  // Global contrast enforcement prevents ANY component from breaking accessibility

  createRoot(document.getElementById("root")!).render(<App />);
  