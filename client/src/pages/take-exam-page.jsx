import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import QuestionChoice from "../components/ExamComponents/QuestionChoice.jsx";
import axios from "axios";
import { useCustomContext } from "../main.jsx";
import "../assets/styles/take-exam.css"; // Import CSS file

const TakeExamPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answerConfirmed, setAnswerConfirmed] = useState(false);
  const [feedback, setFeedback] = useState({ isCorrect: null, message: "" });
  const { setExamId } = useCustomContext();
  const [farthestQuestionReached, setFarthestQuestionReached] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/exam/${examId}/take-exam/${examId}`)
      .then((response) => {
        setExamData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching exam data:", error);
      });

    setExamId(examId);

    // Prevent back navigation
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [examId]);

  const handleBackNavigation = (event) => {
    event.preventDefault();
    setOpenDialog(true);
    window.history.pushState(null, document.title, window.location.href);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  if (!examData) return <div>Loading...</div>;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerConfirmed(false);

      setFarthestQuestionReached(
        Math.max(farthestQuestionReached, currentQuestionIndex + 1)
      );
    }
  };

  const handlePrevQuestion = () => {
    if (
      currentQuestionIndex > 0 &&
      currentQuestionIndex <= farthestQuestionReached
    ) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswerConfirmed(false);
    }
  };

  const handleAnswerSelect = (choiceIndex) => {
    if (answerConfirmed) {
      return;
    }
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = choiceIndex;
    setUserAnswers(newAnswers);
  };

  const handleConfirmAnswer = () => {
    const currentQuestion = examData.questions[currentQuestionIndex];
    const isCorrect =
      userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;
    const feedbackMessage = isCorrect
      ? "Correct answer!"
      : `Incorrect! The correct answer is: ${
          currentQuestion.choices[currentQuestion.correctAnswer].text
        }`;

    setFeedback({
      isCorrect,
      message: feedbackMessage,
    });
    setAnswerConfirmed(true);
  };

  const handleSubmitExam = () => {
    const correctAnswersCount = userAnswers.reduce((acc, userAnswer, index) => {
      const question = examData.questions[index];
      return acc + (userAnswer === question.correctAnswer ? 1 : 0);
    }, 0);
    const score = (correctAnswersCount / examData.questions.length) * 100;
    navigate(`/dashboard/exams/${examId}/take-exam/result/${score.toFixed(2)}`);
  };

  const { title, instructions, questions } = examData;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box className="take-exam-content--wrapper">
      <div className="exam-question--header">
        <h3>{title}</h3>
        <span>Question: {instructions}</span>
      </div>
      <Card className="exam-card">
        <CardContent>
          <Typography className="question--header"
          style={{
            marginBottom: "30px",
            
          }}>
            
            {currentQuestionIndex + 1}. {currentQuestion.question}

            <div style={{ 
              border: "0.1px solid rgba(0, 0, 0, 0.5)",
              marginTop: "25px", }}></div>
          </Typography>
          <div>
            {currentQuestion.choices.map((choice, index) => (
              <QuestionChoice
                key={choice._id}
                index={index}
                choiceText={choice.text}
                isSelected={userAnswers[currentQuestionIndex] === index}
                onSelect={() => handleAnswerSelect(index)}
              />
            ))}
            {answerConfirmed && (
              <Typography className={`feedback ${feedback.isCorrect ? "correct" : "incorrect"}`}>
                {feedback.message}
              </Typography>
            )}
          </div>
          <div className="question--footnote">
            <Button
              variant="outlined"
              onClick={handlePrevQuestion}
              disabled={
                currentQuestionIndex === 0 ||
                currentQuestionIndex >= farthestQuestionReached
              }
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmAnswer}
              disabled={answerConfirmed}
            >
              Confirm Answer
            </Button>
            <Button
              variant="outlined"
              onClick={handleNextQuestion}
              disabled={
                currentQuestionIndex === questions.length - 1 ||
                !answerConfirmed
              }
              endIcon={<ArrowForwardIosIcon />}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubmitExam}
              disabled={currentQuestionIndex !== questions.length - 1}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{"Notice"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You cannot go back during the exam. Please finish the exam.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeExamPage;
