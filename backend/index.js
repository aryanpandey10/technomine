const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const EmployeeService = require("./services/EmployeeService/EmployeeService");
const UpdatePasswordService = require("./services/UpdatePasswordService/UpdatePasswordService");
const GetEmployeeBasicDetailService = require("./services/GetEmployeeBasicDetailService/GetEmployeeBasicDetailService");
const GetFoodMenuService = require("./services/FoodCoupon/GetFoodMenu");
const BookCouponService = require("./services/FoodCoupon/BookCoupon");
const ShowMyCouponsService = require("./services/FoodCoupon/ShowMyCoupons");
const CancelCouponService = require("./services/FoodCoupon/CancelCoupon");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const _dirname=path.dirname("")
const buildpath = path.join(_dirname, "../final-dash/build")

app.use (express.static(buildpath))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Endpoint for login
app.post("/login", async (req, res) => {
  const { employeeID, password } = req.body;

  try {
    const response = await EmployeeService.login(employeeID, password);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for updating password
app.post("/update-password", async (req, res) => {
  const { employeeID, password } = req.body;

  try {
    const response = await UpdatePasswordService.updatePassword(
      employeeID,
      password
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for getting employee basic details
app.post("/get-employee-basic-detail", async (req, res) => {
  const { employeeID } = req.body;

  try {
    const response = await GetEmployeeBasicDetailService.getEmployeeBasicDetail(
      employeeID
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for getting food menu
app.post("/get-food-menu", async (req, res) => {
  const { date } = req.body;

  try {
    const response = await GetFoodMenuService.getFoodMenu(date);
    // console.log(response)
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/book-coupon", async (req, res) => {
  const { employeeID, date, mealType } = req.body;

  try {
    const response = await BookCouponService.bookCoupon(
      employeeID,
      date,
      mealType
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to show coupons
app.post("/show-my-coupons", async (req, res) => {
  const { employeeID, fromDate, toDate } = req.body;

  try {
    const response = await ShowMyCouponsService.getCoupons(
      employeeID,
      fromDate,
      toDate
    );
    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint for canceling a coupon
app.post("/cancel-coupon", async (req, res) => {
  const { couponCode } = req.body;

  try {
    const cancelResult = await CancelCouponService.cancelCoupon(couponCode);
    res.send(cancelResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
