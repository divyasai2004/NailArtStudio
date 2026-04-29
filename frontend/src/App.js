import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { AppProviders } from "./context/AppProviders";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AppProviders>
      <Router>
        <AppRoutes />
      </Router>
    </AppProviders>
  );
}

export default App;