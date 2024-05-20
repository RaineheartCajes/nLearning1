import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  TextField,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const AddEmployeeModal = ({ isOpen, handleClose, departments }) => {
  const [employeeDetails, setEmployeeDetails] = useState({
    empID: "",
    fullname: "",
    username: "",
    email: "",
    user_role: "",
    department: "",
    newDepartment: "",
  });

  useEffect(() => {
    // Make sure the state reset matches your state structure
    if (!isOpen) {
      setEmployeeDetails({
        empID: "",
        fullname: "",
        username: "",
        email: "",
        user_role: "",
        department: "",
        newDepartment: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const {
      empID,
      fullname,
      username,
      email,
      user_role,
      department,
      newDepartment,
    } = employeeDetails;

    if (
      !empID ||
      !fullname ||
      !username ||
      !email ||
      !user_role ||
      (!department && !newDepartment)
    ) {
      console.error("Missing required fields");
      // Handle error: show user a message or mark fields as required
      return;
    }

    // Include empID in the submissionData
    const submissionData = {
      empID, // Added this line
      fullname,
      username,
      email,
      user_role,
      department: newDepartment || department,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/table/addEmp",
        submissionData
      );

      handleClose();
      // Update the employee list in the parent component if needed
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const isFormValid =
    employeeDetails.empID &&
    employeeDetails.fullname &&
    employeeDetails.username &&
    employeeDetails.email &&
    employeeDetails.user_role &&
    (employeeDetails.department || employeeDetails.newDepartment);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent>
        <FormGroup>
          <TextField
            margin="dense"
            label="Employee ID"
            type="text"
            fullWidth
            variant="outlined"
            name="empID" // Corrected to match the state key
            value={employeeDetails.empID}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            name="fullname" // make sure this matches the state key
            value={employeeDetails.fullname}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            name="username"
            value={employeeDetails.username}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            value={employeeDetails.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Role"
            type="text"
            fullWidth
            variant="outlined"
            name="user_role"
            value={employeeDetails.user_role}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              label="Department"
              name="department"
              value={employeeDetails.department}
              onChange={handleChange}
              // You might want to add this property if not already present
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "50%", // Adjust as needed
                  },
                },
              }}
            >
              {departments.map((dept, index) => (
                <MenuItem key={index} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {employeeDetails.department === "" && (
            <TextField
              margin="dense"
              label="New Department"
              type="text"
              fullWidth
              variant="outlined"
              name="newDepartment"
              value={employeeDetails.newDepartment}
              onChange={handleChange}
            />
          )}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!isFormValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeModal;
