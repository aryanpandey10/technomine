import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function UpdatePasswordForm() {
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      if (password.toLowerCase() === "password") {
        toast.error("Please choose a different password.");
        return; // Prevent further execution
      }

      try {
        await axios.post("http://localhost:3001/update-password", { employeeID, password });
        toast.success("Password updated successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <h2>Update Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="employeeID">Employee ID</label>
            <input
              type="text"
              className="form-control"
              id="employeeID"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePasswordForm;
