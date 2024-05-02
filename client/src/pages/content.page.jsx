import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Toolbar,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import ContentCard from "../components/ContentCard";
import AddIcon from '@mui/icons-material/Add';

const apiUrl = "http://localhost:3001/exam";

function CreateContentPage() {
  const [openModal, setOpenModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/content/exam-title`);
      setExams(response.data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/exam-title`, {
        title: formData.title,
        description: formData.description,
        id: uuidv4(),
      });
      if (response.status === 201) {
        setSuccessMessage("Topic added successfully.");
        setExams([...exams, response.data]);
        setFormData({ title: "", description: "" });
      }
    } catch (error) {
      setError("Failed to add new topic. Please try again later.");
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <Container maxWidth="lg">
      <Toolbar sx={{ justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h4" component="div">
          Topics
        </Typography>
        <Button
  variant="contained"
  onClick={handleOpenModal}
  sx={{ bgcolor: "#e11d48", height: 50 }}
  startIcon={<AddIcon />} // Adding the AddIcon as the startIcon
>
Add Topic
</Button>
      </Toolbar>
      <hr></hr>
      <Grid container spacing={3} mt={2}>
        {loading ? (
          <CircularProgress color="primary" size={50} />
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : (
          exams.map((exam) => (
            <Grid item key={exam._id} xs={12} sm={6} md={4} lg={3}>
              <ContentCard exam={exam} updatedAt={exam.updatedAt} />
            </Grid>
          ))
        )}
      </Grid>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained" disabled={loading} sx={{ bgcolor: "#e11d48" }}>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Container>
  );
}

export default CreateContentPage;
