import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EssayPage from "./components/EssayPage.jsx";
import kavach from "../content/essays/kavach.md?raw";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EssayPage source={kavach} plate="kavach" />
  </StrictMode>
);
