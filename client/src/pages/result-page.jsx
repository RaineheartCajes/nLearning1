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
    <div className="exam-result-container">
      <Card
        style={{
          marginTop: "40px",
          maxWidth: "800px",
          width: "80%",
          margin: "auto",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            style={{ textAlign: "center", fontSize: "3.5rem" }}
          >
            Exam Result
          </Typography>

          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              fontSize: "3.5rem",
              fontWeight: "bold",
            }}
          >
            Your Score: {score !== undefined ? `${score}%` : "Calculating..."}
          </Typography>
          <Typography
            style={{
              textAlign: "center",
              fontSize: "3.5rem",
              fontWeight: "bold",
            }}
            variant="h6"
            className={`result-label ${getResultLabel().toLowerCase()}`}
          >
            {getResultLabel()}
          </Typography>

          {getResultLabel() === "PASSED" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleReturnDashboard}
              style={{ marginTop: "20px" }}
            >
              Return to Dashboard
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRetakeExam}
              style={{ marginTop: "20px" }}
            >
              Retake Exam
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamResultPage;
