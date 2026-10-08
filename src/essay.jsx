import EssayPage from "./components/EssayPage.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import { essaySources } from "./lib/essays.js";
import { mount } from "./lib/mount.jsx";
import "./styles.css";

// Every essay page loads this script; the address says which essay it is:
// /essays/<slug>/ reads content/essays/<slug>.md.
const slug = window.location.pathname.split("/").filter(Boolean)[1] ?? "";
const source = essaySources[slug];

mount(source ? <EssayPage slug={slug} source={source} /> : <NotFoundPage />);
