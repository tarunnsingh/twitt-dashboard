import React from "react";
import HomePage from "./components/Homepage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Dashboard} />
      </div>
    </Router>
  );
};
