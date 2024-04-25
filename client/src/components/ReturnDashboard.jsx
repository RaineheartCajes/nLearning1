import { Button } from "@mui/material";
import React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

function ReturnDashboard() {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      onClick={() => navigate("/dashboard")}
      sx={{ textTransform: "capitalize", px: 2, py: 0.5, borderRadius: "5px", bgcolor: "#e11d48"}}
    >
      <SlArrowLeft /> &nbsp; Return to Dashboard
    </Button>
  );
}

export default ReturnDashboard;
