// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import DashboardContent from "../components/DashboardContent";
import Page1 from "../components/Page1";
import Page2 from "../components/Page2";
import "../css/style.css";


const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("light");
    if (storedTheme) {
      setTheme("light");
      document.documentElement.setAttribute("data-bs-theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.setAttribute("data-bs-theme", "dark");
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);

    if (newTheme === "light") {
      localStorage.setItem("light", "set");
    } else {
      localStorage.removeItem("light");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`main ${isCollapsed ? "collapsed" : ""}`}>
        <DashboardHeader
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
        />
        <main className="content">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="page1" element={<Page1 />} />
            <Route path="page2" element={<Page2 />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
