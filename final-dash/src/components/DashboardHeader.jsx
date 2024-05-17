import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ toggleTheme, toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear login flag
    localStorage.removeItem('employeeID'); // Clear employeeID
    navigate("/");
    window.location.reload();
  };
  

  return (
    <Navbar bg="primary" variant="dark" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="#home" onClick={toggleSidebar}>
          Dashboard
        </Navbar.Brand>
        <div className="d-flex ms-auto">
          <Button variant="outline-light" onClick={toggleTheme}>
            Toggle Theme
          </Button>
          <Button
            variant="outline-light"
            className="ms-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default DashboardHeader;
