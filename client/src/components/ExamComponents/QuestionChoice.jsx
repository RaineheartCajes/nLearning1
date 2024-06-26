import React from "react";
import { Box, Typography, IconButton } from "@mui/material";

const QuestionChoice = ({ choiceText, isSelected, onSelect, index }) => {
  
  const letter = String.fromCharCode(65 + index);

  return (
    <Box
      onClick={onSelect}
      sx={{
        padding: 1,
        backgroundColor: isSelected ? "primary.main" : "#E4E4E4",
        boxShadow: 2,
        color: isSelected ? "white" : "gray.700",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        marginBottom: "8px",
      }}
    >
      <Typography variant="h6" sx={{ marginRight: "16px" }}>
        {letter}.
      </Typography>
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        {choiceText}
      </Typography>
    </Box>
  );
};

export default QuestionChoice;
