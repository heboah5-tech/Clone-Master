import { createRoot } from "react-dom/client";
import { setSessionIdGetter } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

const SESSION_KEY = "dkhoon_session_id";
let cachedSessionId = localStorage.getItem(SESSION_KEY);
if (!cachedSessionId) {
  cachedSessionId =
    Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
  localStorage.setItem(SESSION_KEY, cachedSessionId);
}
setSessionIdGetter(() => cachedSessionId);

createRoot(document.getElementById("root")!).render(<App />);
