// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/style.css";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  <Router>
    <Toaster position="top-center" reverseOrder={false} />
    <App />
  </Router>,
  document.getElementById("root")
);
