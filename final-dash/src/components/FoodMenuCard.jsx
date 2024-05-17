import React, { useState, useEffect } from 'react';
import { Card, Col, Form, Button, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './FoodMenuCard.css';
import toast from 'react-hot-toast';

const FoodMenuCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [menu, setMenu] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  useEffect(() => {
    const fetchMenu = async (date) => {
      try {
        const formattedDate = date.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"
        const response = await axios.post('http://localhost:3001/get-food-menu', { date: formattedDate });
        
        // Parse the response to set the menu
        const newMenu = response.data.reduce((acc, item) => {
          if (item.mealType.toLowerCase() === 'breakfast') {
            acc.breakfast = item.menu;
          } else if (item.mealType.toLowerCase() === 'lunch') {
            acc.lunch = item.menu;
          } else if (item.mealType.toLowerCase() === 'dinner') {
            acc.dinner = item.menu;
          }
          return acc;
        }, { breakfast: '', lunch: '', dinner: '' });

        setMenu(newMenu);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMealChange = (meal) => {
    setSelectedMeal(meal);
  };

  const handleBook = async () => {
    const employeeID = localStorage.getItem('employeeID');
    if (!employeeID) {
      console.error('Employee ID not found in local storage');
      return;
    }
  
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const mealType = selectedMeal.toUpperCase();
  
    try {
      const response = await axios.post('http://localhost:3001/book-coupon', {
        employeeID,
        date: formattedDate,
        mealType
      });
  
      // Access the specific field that contains the result
      const result = response.data.BookCouponResult || response.data;
  
      if (result === 'TIMEOUT') {
        toast('Trying to book Food Coupon for the same day which is not allowed', {
          icon : "🕛"
        });
      } else if (result === 'LIMITEXCEED') {
        toast.error('Already booked 1 coupon for that day either of Breakfast, Lunch or Dinner');
      } else if (result === 'SUCCESS') {
        toast.success('Coupon booked successfully');
      } else {
        toast.error(`An error occurred: ${result}`);
      }
  
      // Refresh the page after showing the alert
      window.location.reload();
    } catch (error) {
      console.error('Error booking coupon:', error);
      alert('An error occurred while booking the coupon. Please try again.');
      // Refresh the page after showing the alert
      window.location.reload();
    }
  };
  

  return (
    <Card className="border-0">
      <Card.Body>
        <h2>Food Menu</h2>
        <Form.Group>
          <Form.Label>Select Date</Form.Label>
          <DatePicker 
            selected={selectedDate} 
            onChange={handleDateChange} 
            className="form-control" 
          />
        </Form.Group>
        <Row>
          <Col>
            <div className={`meal-section ${selectedMeal === 'breakfast' ? 'selected' : ''}`}>
              <Form.Check 
                type="radio" 
                name="mealType" 
                id="breakfast" 
                label="BREAKFAST" 
                onChange={() => handleMealChange('breakfast')} 
                checked={selectedMeal === 'breakfast'}
              />
              <p className={selectedMeal !== 'breakfast' ? 'text-muted' : ''}>
                {menu.breakfast}
              </p>
            </div>
          </Col>
          <Col>
            <div className={`meal-section ${selectedMeal === 'lunch' ? 'selected' : ''}`}>
              <Form.Check 
                type="radio" 
                name="mealType" 
                id="lunch" 
                label="LUNCH" 
                onChange={() => handleMealChange('lunch')} 
                checked={selectedMeal === 'lunch'}
              />
              <p className={selectedMeal !== 'lunch' ? 'text-muted' : ''}>
                {menu.lunch}
              </p>
            </div>
          </Col>
          <Col>
            <div className={`meal-section ${selectedMeal === 'dinner' ? 'selected' : ''}`}>
              <Form.Check 
                type="radio" 
                name="mealType" 
                id="dinner" 
                label="DINNER" 
                onChange={() => handleMealChange('dinner')} 
                checked={selectedMeal === 'dinner'}
              />
              <p className={selectedMeal !== 'dinner' ? 'text-muted' : ''}>
                {menu.dinner}
              </p>
            </div>
          </Col>
        </Row>
        <Button 
          variant="primary" 
          onClick={handleBook} 
          disabled={!selectedMeal}
          className="mt-3 book-button"
        >
          Book
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FoodMenuCard;
