import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import ReturnDashboard from "../components/ReturnDashboard";
import "../assets/styles/ExamRoutes.css";
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';


const ContentDetailsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [examList, setExamList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState("");

  useEffect(() => {
    getExams();
  }, []);

  const getExams = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/exam/content/exam-title`);
      if (response.data !== undefined) {
        setExams(response.data);
        setExamList(response.data);
      }
    } catch (error) {
      console.error("Error getting exams:", error.response ? error.response.data.error : error.message);
    }
  };

  const handleAssignExam = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3001/content/assign-exam/${examId}`, {
        assignedDepartment: selectedDepartment,
        numberOfParticipants: numberOfParticipants,
      });

      handleCloseModal();
      navigate(`/dashboard/create-content/${examId}`);
    } catch (error) {
      console.error("Error assigning exam:", error.response ? error.response.data.error : error.message);
    }
  };

  const selectedExam = examList.find((exam) => exam._id === examId);

  const handleReviewClick = () => {
    navigate(`/dashboard/exams/${examId}/review`, {
      state: { details: selectedExam },
    });
  };

  const handleCreateAssignClick = () => {
    setOpenModal(true);
  };

  const handleTakeExamClick = () => {
    navigate(`/dashboard/create-content/${examId}/create-exam`, {
      state: { examId: examId },
    });
  };

  const handleDeleteExam = async () => {
    try {
      await axios.delete(`http://localhost:3001/exam/delete-exam/${examId}`);
      navigate("/dashboard/create-content");
    } catch (error) {
      console.error("Error deleting exam:", error.response ? error.response.data.error : error.message);
    }
  };

  const handleEditExam = () => {
    navigate(`/dashboard/exams/${examId}/edit`);
  };

  const handleCreateContentClick = () => {
    navigate(`/dashboard/create-content/${examId}/create-review`, {
      state: { examId: examId },
    });
  };

  if (!selectedExam) {
    return <p>Loading exam {examId}</p>;
  }

  return (
    <>
      <div className="exam-details--wrapper">
        <Card sx={{ m: 3, height: "50vh"}}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <ReturnDashboard />
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  className="exam-details--button"
                  onClick={handleDeleteExam}
                  startIcon={<RiDeleteBin6Line />}
                >
                  Delete
                </Button>
                {/* <Button
                  variant="contained"
                  className="exam-details--button"
                  onClick={handleEditExam}
                  startIcon={<FaEdit />}
                >
                  Edit
                </Button> */}
              </Box>
            </Box>

            <Typography variant="h5" sx={{ mt: 2 }}>
              {selectedExam.title}
            </Typography>

            <Typography variant="body1" sx={{ my: 3 }}>
              {selectedExam.description}
            </Typography>

            <Divider />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ bgcolor: "#e11d48", height:"50px", width:"200px"}}
        onClick={handleCreateContentClick}
    >
        Create Review
    </Button>

    <Button
        variant="contained"
        color="primary"
        startIcon={<AssessmentIcon />}
        sx={{ bgcolor: "#e11d48", marginLeft:"50px", height:"50px", width:"200px"}}
        onClick={handleTakeExamClick}
    >
        Create Exam
    </Button>

    <Button
        variant="contained"
        color="primary"
        startIcon={<AssignmentIcon />}
        sx={{ bgcolor: "#e11d48", marginLeft:"50px", height:"50px", width:"200px"}}
        onClick={handleCreateAssignClick}
    >
        Assign Exam
    </Button>
            </Box>
          </CardContent>
        </Card>

        <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{ style: { width: '70%' } }}>
          <form onSubmit={handleAssignExam}>
            <DialogTitle>Assign Exam</DialogTitle>
            <DialogContent>
              Department
              <Select
                label=""
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                fullWidth
              >
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="General">General</MenuItem>
              </Select>
            </DialogContent>
            <DialogContent>
              <TextField
                label="Number of Participants"
                type="number"
                value={numberOfParticipants}
                onChange={(e) => setNumberOfParticipants(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" color="primary">Submit</Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
};

export default ContentDetailsPage;
