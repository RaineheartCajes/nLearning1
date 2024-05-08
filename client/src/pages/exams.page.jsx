import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import axios from "axios";
import {
  Container,
  Grid,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { v4 as uuidv4 } from "uuid";
import ExamCard from "../components/ExamCard";
import "../assets/styles/dashboard.css";

function ExamPage() {
  const { token } = useAuth(); 
  const [page, setPage] = useState(1);
  const examsPerPage = 4;
  const [openModal, setOpenModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    _id: "",
  });

  useEffect(() => {
    if (token) {
      getExams(token).then((data) => {
        if (data) {
          setExams(data.availableExams);
          setCompletedExams(data.passedExams);
        }
      });
    }
  }, [token]);

  const displayedExams = exams.slice(
    (page - 1) * examsPerPage,
    page * examsPerPage
  );

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  async function getExams(authToken) {
    try {
      const response = await axios.get(
        "http://localhost:3001/exam/exam-title",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:3001/exam/exam-title",
          {
            title: formData.title,
            description: formData.description,
            id: uuidv4(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.statusText === "Created") {
          console.log("Exam added successfully");
        }
        const newExam = response.data;
        setExams([...exams, newExam]);
        setFormData({ title: "", description: "", _id: "" });
      } catch (error) {
        console.error("Error adding new exam:", error);
      } finally {
        setOpenModal(false);
      }
    }
  };

  return (
    <div className="exam-details--wrapper">
    <Toolbar sx={{ justifyContent: "space-between", mt: 2}}>
    <Typography variant="h4" component="div">
      Examination
    </Typography>
  </Toolbar>
  <hr></hr>
  {exams.length === 0 && (
    <Typography variant="h6" align="center" style={{ marginTop: 20, fontWeight: "bold", fontSize: "30px" }}>
      No Exams Available
    </Typography>
  )}

  <Grid
    container
    spacing={1} 
    alignItems="center"
    justifyContent="center"
    sx={{mt: 1}}
  >
    {displayedExams.map((exam, index) => (
      <Grid
        className="grid-card-content"
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        key={`${exam.id}-${index}`}
      >
        <div className="grid-item--wrapper">
          <ExamCard
            key={`${exam.id}-${index}`}
            exam={exam}
            updatedAt={exam.updatedAt}
            style={{ minHeight: "300px" }}
          />
        </div>
      </Grid>
    ))}
  </Grid>
  <TableContainer
    component={Paper}
    style={{ marginTop: "10px", marginBottom: "10px" }}
  >
    <Table>
      <TableHead>
        <TableRow style={{ backgroundColor: "#e71e4a" }}>
          <TableCell style={{ color: "white" }}>Exam Title</TableCell>
          <TableCell style={{ color: "white" }}>Deparment</TableCell>
          <TableCell style={{ color: "white" }}>Score</TableCell>
          <TableCell style={{ color: "white" }}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {completedExams.map((exam) => (
          <TableRow key={exam._id}>
            <TableCell>{exam.title}</TableCell>
            <TableCell>{exam.assignedDepartment}</TableCell>
            <TableCell>{exam.score}</TableCell>
            <TableCell>{exam.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</div>
    
  );
}

export default ExamPage;
