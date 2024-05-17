import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import axios from "axios";
import FoodMenuCard from "./FoodMenuCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from 'react-icons/fa';
import toast from "react-hot-toast";

const DashboardContent = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [coupons, setCoupons] = useState([]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    const fetchEmployeeBasicDetail = async () => {
      try {
        const employeeID = localStorage.getItem("employeeID");
        const response = await axios.post(
          "https://technomine-server.vercel.app/get-employee-basic-detail",
          { employeeID }
        );
        setEmployeeName(response.data);
      } catch (error) {
        console.error("Error:", error); 
      }
    };

    fetchEmployeeBasicDetail();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const employeeID = localStorage.getItem("employeeID");
        const fromDate = startDate.toISOString().split("T")[0];
        const toDate = endDate.toISOString().split("T")[0];
        const response = await axios.post(
          "https://technomine-server.vercel.app/show-my-coupons",
          { employeeID, fromDate, toDate }
        );
        setCoupons(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCoupons();
  }, [startDate, endDate]);

  const cancelCoupon = async (couponCode) => {
    try {
      const response = await axios.post(
        "https://technomine-server.vercel.app/cancel-coupon",
        { couponCode }
      );
      if (response.data === "TIMEOUT") {
        toast("Trying to cancel the coupon of the same day which is not allowed.", {
          icon : "🕛"
        });
      } else if (response.data === "SUCCESS") {
        // If coupon is cancelled successfully, remove it from the list
        setCoupons(coupons.filter(coupon => coupon.couponCode !== couponCode));
        toast.success("Coupon Cancelled Successfully");
      } else {
        alert("Failed to cancel coupon");
      }
    } catch (error) {
      console.error('Error cancelling coupon:', error);
      toast.error('An error occurred while cancelling the coupon');
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h4>Admin Dashboard</h4>
          <Row>
            <Col md={6}>
              <Card className="border-0 illustration">
                <Card.Body>
                  <h4>Welcome Back, {employeeName}</h4>
                  <p>Technomine Dashboard, aryan_inzy</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <FoodMenuCard />
            </Col>
          </Row>
          <Card className="border-0 mt-4">
            <Card.Header>
              <h5 className="card-title">All Bookings</h5>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Starting Date</Form.Label>
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Ending Date</Form.Label>
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <table className="table">
                <thead>
                  <tr>
                    <th>CouponCode</th>
                    <th>Date</th>
                    <th>MealType</th>
                    <th>Menu</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon, index) => (
                    <tr key={index}>
                      <td>{coupon.couponCode}</td>
                      <td>{coupon.date}</td>
                      <td>{coupon.mealType}</td>
                      <td>{coupon.menu}</td>
                      <td>
                        <FaTimes
                          color="red"
                          onClick={() => cancelCoupon(coupon.couponCode)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardContent;
