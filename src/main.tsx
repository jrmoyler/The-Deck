import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { App } from "./App";
import { useDeckStore } from "./lib/deck/store";
import "./styles.css";

function Root() {
  const hydrate = useDeckStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return (
    <HashRouter>
      <App />
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "#161814",
            border: "1px solid #2a2d27",
            color: "#f2eadb",
            fontFamily: "Figtree, sans-serif",
          },
        }}
      />
    </HashRouter>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");
createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
