import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import BarChartCustom from "../components/Overview/Bar";
import PieChartCustom from "../components/Overview/Pie";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const OverviewAdmin = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBar, setSelectedBar] = useState(null);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/overview/barchart");
        setExams(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exams data:", error);
      }
    };
    fetchData();
  }, [statusUpdated]);

  const updateStatus = () => {
    setStatusUpdated(true);
  };

  const fetchUsersByExam = async (examId, assignedDepartment) => {
    try {
      const { data: users } = await axios.get(`http://localhost:3001/overview/usersByExam/${examId}`);
      const departmentFilteredUsers = assignedDepartment === "General"
        ? users
        : users.filter(({ department }) => department === assignedDepartment);

      setFilteredUsers(departmentFilteredUsers);
    } catch (error) {
      console.error("Error fetching users for exam", error);
    }
  };

  const onExamBarClick = async (data) => {
    if (data && data.activeLabel) {
      const clickedExam = exams.find(({ examTitle }) => examTitle === data.activeLabel);

      setSelectedExam(clickedExam);
      if (clickedExam && clickedExam._id) {
        await fetchUsersByExam(clickedExam._id, clickedExam.assignedDepartment);
      } else {
        console.error("Clicked exam does not have a MongoDB _id:", clickedExam);
      }
    }
  };

  const rowsPerPage = 6;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const displayedUsers = searchTerm
    ? filteredUsers.filter(({ username }) => username.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredUsers;

  const handleBarHover = (data) => {
    setSelectedBar(data);
  };

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 2, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography variant="h6" align="center">Distribution by Department</Typography>
              {loading ? (
                <CircularProgress sx={{ mt: 2 }} />
              ) : (
                <PieChartCustom selectedBar={selectedBar} />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 2, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography variant="h6" align="center">Exam Overview</Typography>
              <BarChartCustom data={exams} onBarHover={handleBarHover} onBarClick={onExamBarClick} />
            </Paper>
          </Grid>
        </Grid>

        <TextField
          placeholder="Search Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 4, width: "100%", maxWidth: 300, mx: "auto" }}
        />

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#e71e4a" }}>
                <TableCell style={{ color: "white" }}>Username</TableCell>
                <TableCell style={{ color: "white" }}>User Role</TableCell>
                <TableCell style={{ color: "white" }}>Department</TableCell>
                <TableCell style={{ color: "white" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedUsers.slice(startIndex, endIndex).map(({ _id, username, user_role, department, usersExams }) => (
                <TableRow key={_id}>
                  <TableCell>{username}</TableCell>
                  <TableCell>{user_role}</TableCell>
                  <TableCell>{department}</TableCell>
                  <TableCell>{usersExams.find(({ examId }) => examId === selectedExam?._id)?.status || "Incomplete"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={Math.ceil(filteredUsers.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          sx={{ mt: 2, justifyContent: "center" }}
        />
      </CardContent>
    </Card>
  );
};

export default OverviewAdmin;
