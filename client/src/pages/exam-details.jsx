import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import "../assets/styles/ExamRoutes.css";
import ReturnDashboard from "../components/ReturnDashboard";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

function ExamDetailsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [examList, setExamList] = useState(exams);

  useEffect(() => {
    getExams().then((response) => {});
  }, []);

  const getExams = async () => {
    axios
      .get("http://localhost:3001/exam/content/exam-title")
      .then((response) => {
        if (response.data !== undefined) {
          setExams(response.data);
          setExamList(response.data);
        }
      });
  };

  const selectedExam = examList.find((exam) => exam._id === examId);

  const handleReviewClick = () => {
    navigate(`/dashboard/exams/${examId}/review`, {
      state: { details: selectedExam },
    });
  };

  const handleTakeExamClick = () => {
    navigate(`/dashboard/exams/${examId}/take-exam`, {
      state: { examId: examId },
    });
  };

  const handleDeleteExam = () => {
    ``;
    const updatedExams = examList.filter((exams) => exams._id !== examId);
    setExamList(updatedExams);
    navigate("/dashboard");
  };

  const handleCreateContentClick = () => {
    navigate(`/dashboard/exams/${examId}/create-content`, {
      state: { examId: examId },
    });
  };

  if (!selectedExam) {
    return (
      <p>
        Loading exam {examId} and {exams._id}
      </p>
    );
  }

  return (
    <>
      <div className="exam-details--wrapper">
        <Card sx={{ m: 2 }}>
          <CardContent>
            <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <ReturnDashboard />
              <div>
                {/* <Button
                  variant="contained"
                  className="exam-details--button"
                  sx={{
                    textTransform: "capitalize",
                    mr: 2,
                    borderRadius: "0rem",
                  }}
                  onClick={handleDeleteExam}
                >
                  <RiDeleteBin6Line /> &nbsp; Delete
                </Button> */}
                {/* <Button
                  variant="contained"
                  className="exam-details--button"
                  sx={{ textTransform: "capitalize", borderRadius: "0rem" }}
                  onClick={handleEditExam}
                >
                  <FaEdit /> &nbsp; Edit
                </Button> */}
              </div>
            </Box>

            <Typography variant="h5" sx={{ mt: 2 }}>
              {selectedExam.title}
            </Typography>

            <Typography variant="body1" sx={{ my: 3 }}>
              {selectedExam.description}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* Status */}
              {/* <Typography variant="body2">
                Status: {selectedExam.status}
              </Typography> */}
              {/* Created Date */}
              {/* <Typography variant="body2">
                Created: {selectedExam.createdAt}
              </Typography> */}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", py: 2 }}>
            <Button
  className="brand-red-bg"
  sx={{ textTransform: "capitalize", px: 3, py: 2, mx: 0.5 }}
  onClick={handleReviewClick}
  startIcon={<PlagiarismIcon />} 
>
  Start Reviewing
</Button>

<Button
  className="brand-red-bg"
  sx={{ textTransform: "capitalize", px: 3, py: 2, mx: 0.5 }}
  onClick={handleTakeExamClick}
  startIcon={<QuizIcon/>}
>
  Take Exam
</Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ExamDetailsPage;
