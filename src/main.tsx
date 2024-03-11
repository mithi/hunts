import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import "./globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="main-container flex flex-col gap-2 p-4 w-full">
      <App />
    </div>
  </React.StrictMode>
)
