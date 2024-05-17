import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import toast from "react-hot-toast";

const Login = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', {
        employeeID,
        password,
      });

      switch (response.data.LoginResult) {
        case 'EMPRES':
          toast.error('Employee Resigned');
          break;
        case 'EMPINACTIVE':
          toast('Employee ID disabled for some reason by authority');
          break;
        case 'WRONGPASSWORD':
          toast.error('Password is wrong');
          break;
        case 'NOEMPLOYEE':
          toast.error("EmployeeID doesn't exist");
          break;
        case 'SUCCESS':
          toast.success('Login Successful');
          localStorage.setItem('isLoggedIn', true); // Set login flag
          localStorage.setItem('employeeID', employeeID);
          navigate('/dashboard');
          break;
        case 'NEWUSER':
          toast('First time User, must change password', {
            icon : "🔥"
          });
          navigate('/update-password');
          break;
        default:
          toast.error('Unexpected response from server');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>EmployeeID</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="employeeID"
                    value={employeeID}
                    onChange={(e) => setEmployeeID(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4 w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
