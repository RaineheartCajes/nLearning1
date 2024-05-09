import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";
import "../assets/styles/ExamResultPage.css";

const ExamResultPage = () => {
  const { score, examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultPosted, setResultPosted] = useState(false);
  const postAttempted = useRef(false);

  useEffect(() => {
    setLoading(true);
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/result/${examId}/questions`
        );
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  useEffect(() => {
    const postResult = async () => {
      if (parseFloat(score) >= 80 && !postAttempted.current) {
        postAttempted.current = true;
        try {
          const response = await axios.post(
            "http://localhost:3001/user/examResult",
            {
              examId: examId,
              status: "Completed",
              score: score,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Result posted successfully:", response.data);
          setResultPosted(true);
        } catch (error) {
          console.error("Error posting exam result:", error);
        }
      }
    };
    postResult();
  }, [score]);

  const getResultLabel = () => (parseFloat(score) >= 80 ? "PASSED" : "FAIL");

  const handleRetakeExam = () => {
    navigate(`/dashboard`);
  };

  const handleReturnDashboard = () => {
    navigate("/dashboard");
  };

  const postExamResult = async () => {
    const examResult = {
      examId: examId,
      status: "Completed",
      score: score,
    };

    const token = localStorage.getItem("token");

    if (token && !resultPosted) {
      try {
        const response = await axios.post(
          "http://localhost:3001/user/examResult",
          examResult,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Result posted successfully:", response.data);
        setResultPosted(true);
      } catch (error) {
        console.error("Error posting exam result:", error);
      }
    }
  };

  return (
    <div
      className="exam-result-container"
      style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
    >
      <Card
        sx={{
          maxWidth: "800px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontSize: "2.5rem", color: "#333" }}
          >
            Exam Result
          </Typography>
          <div
            style={{
              border: "1px solid black",
              opacity: "0.2",
              marginBlock: "20px",
            }}
          ></div>
          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            fontSize="2rem"
            sx={{ marginBottom: "10px", color: "#666" }}
          >
            Your Score: {score !== undefined ? `${score}%` : "Calculating..."}
          </Typography>

          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            fontSize="2rem"
            className={`result-label ${getResultLabel().toLowerCase()}`}
            sx={{
              marginBottom: "30px",
              color: getResultLabel() === "PASSED" ? "#00796b" : "#d32f2f",
            }}
          >
            {getResultLabel()}
          </Typography>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color={getResultLabel() === "PASSED" ? "primary" : "secondary"}
              onClick={
                getResultLabel() === "PASSED"
                  ? handleReturnDashboard
                  : handleRetakeExam
              }
              sx={{
                marginRight: "10px",
                textTransform: "none",
                fontSize: "1rem",
                padding: "10px 20px",
              }}
            >
              {getResultLabel() === "PASSED"
                ? "Return to Dashboard"
                : "Retake Exam"}
            </Button>

            {/* <Button variant="outlined" onClick={handleViewAnswers} sx={{ textTransform: "none", fontSize: "1rem", padding: "10px 20px", borderColor: "#999" }}>
          View Answers
        </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamResultPage;
