import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PassphraseGate } from "./PassphraseGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PassphraseGate>
      <App />
    </PassphraseGate>
  </StrictMode>,
);
