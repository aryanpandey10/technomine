// src/pages/Page1.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Page1 = () => (
  <Container fluid>
    <Row>
      <Col md={12}>
        <Card className="border-0">
          <Card.Body>
            <h4>Page 1 Content</h4>
            <p>This is the content for Page 1.</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Page1;
