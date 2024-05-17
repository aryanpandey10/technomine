// src/components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = ({ isCollapsed }) => (
  <Nav
    className={`col-md-3 col-lg-2 d-md-block sidebar ${isCollapsed ? 'collapsed' : ''}`}
    id="sidebar"
  >
    <div className="position-sticky">
      <div className="sidebar-logo">
        <Link to="/dashboard">Technomine</Link>
      </div>
      <ul className="sidebar-nav flex-column">
        <li className="sidebar-header">Admin Elements</li>
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link">
            <i className="fa-solid fa-list pe-2"></i>
            Dashboard
          </Link>
        </li>
        <li className="sidebar-item">
          <a
            href="#pages"
            className="sidebar-link"
            data-bs-toggle="collapse"
            aria-expanded="false"
            aria-controls="pages"
          >
            <i className="fa-solid fa-file-lines pe-2"></i>
            Pages
          </a>
          <ul id="pages" className="collapse sidebar-dropdown list-unstyled">
            <li className="sidebar-item">
              <Link to="/dashboard/page1" className="sidebar-link">
                Page 1
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/dashboard/page2" className="sidebar-link">
                Page 2
              </Link>
            </li>
          </ul>
        </li>
        {/* More sidebar items */}
      </ul>
    </div>
  </Nav>
);

export default Sidebar;
