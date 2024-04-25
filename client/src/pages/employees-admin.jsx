import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  DialogContentText,
  TableSortLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../assets/styles/ExamRoutes.css";
import AddEmployeeModal from "../components/AddEmployeeModal";
import { Pagination } from "@mui/material";
import { useAuth } from "../contexts/auth-context";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const EmployeesAdmin = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("fullname");
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction
  const [isModalOpen, setModalOpen] = useState(false);
  const [departments, setDepartments] = useState(["HR", "Tech", "Sales"]); // Example departments
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUserId, setMenuUserId] = useState(null);
  const [isAccessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { accessFeatures, updateAccessFeatures } = useAuth();
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3001/table/users");
        setData(usersResponse.data);
  
        const departmentsResponse = await axios.get('http://localhost:3001/table/departments');
        setDepartments(departmentsResponse.data); // Assuming this API returns an array of strings
        console.log('Fetched departments:', departmentsResponse.data); // Debug line
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);


  const handleDelete = (userId) => {
    setDeleteUserId(userId);
    setDeleteDialogOpen(true);
    handleClose();
  };

  const handleOpenModal = () => setModalOpen(true); // Opens the modal
  const handleCloseModal = () => setModalOpen(false); // Closes the modal
  

  // Sorting function
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Function to sort data
  const sortData = (data) => {
    if (!Array.isArray(data)) return []; // Safety check to ensure `data` is an array
    return data.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  
  const handleDeleteConfirm = () => {
    axios
      .delete(`http://localhost:3001/table/users/${deleteUserId}`)
      .then((response) => {
        if (response.status === 200) {
          setData(data.filter((item) => item._id !== deleteUserId));
        }
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setDeleteDialogOpen(false);
      });
  };

  const handleSavePermissions = () => {
    const permissionsToUpdate = {
      allowEditContent: accessFeatures.allowEditContent,
      allowDeleteExam: accessFeatures.allowDeleteExam,
      allowAddCreateExam: accessFeatures.allowAddCreateExam,
      allowCreateContent: accessFeatures.allowCreateContent,
    };

    axios
      .put(`http://localhost:3001/auth/users/${selectedUserId}/update`, {
        user_type: "co-admin",
        permissions: permissionsToUpdate,
      })
      .then((response) => {
        console.log("User and permissions updated:", response.data);

        setData(
          data.map((user) =>
            user._id === selectedUserId
              ? {
                  ...user,
                  user_type: "co-admin",
                  permissions: permissionsToUpdate,
                }
              : user
          )
        );
        setAccessModalOpen(false);
        setSelectedUserId(null);
        setAnchorEl(null);
      })
      .catch((error) => {
        console.error("Error updating user and permissions:", error);
      });
  };

  const handleOpenAccessModal = (userId) => {
    setSelectedUserId(userId);
    setAccessModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteUserId(null);
    setDeleteDialogOpen(false);
  };

  const handleClick = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const filteredData = sortData(
    data.filter((row) => 
      row.username && row.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="exam-details--wrapper">
      {/* <Container sx={{ alignItems: "center", maxWidth:"900px", minWidth:"1000px", minHeight: "70vh" }}></Container> */}
     
     <Toolbar sx={{ justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h4" component="div">
          Employees
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleOpenModal} 
          sx={{ bgcolor: "#e11d48", marginLeft:"10px", height: 50}}>
         + Add employee
        </Button>
      </Toolbar>
      
      <hr></hr>
      <Grid container direction="column" spacing={2} style={{marginTop: "5px"}}> 
        <Grid item container justifyContent="right">
          { <TextField
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            style={{ width: 200 }} // Ensure some spacing between the search bar and the button on smaller screens
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
         /> }
            
          {/* <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal} // This is where handleOpenModal is used
            style={{ height: 50}}
          >
            Add Employee
          </Button> */}
         
        </Grid>
        <Grid item style={{ overflow: "hidden" }}>
          <TableContainer
            component={Paper}
            style={{
              maxHeight: "calc(100vh - 128px)",
              overflowY: "auto",
            }}
          >
            <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: "#e71e4a" }}>
                {/* Sortable Table Headers */}
                <TableCell style={{ color: "white" }}>Employee ID</TableCell>
                <TableCell style={{ color: "white" }}>
  <TableSortLabel
    active={sortField === "fullname"} // Updated to "fullname"
    direction={sortField === "fullname" ? sortDirection : 'asc'} // Updated to "fullname"
    onClick={() => handleSort('fullname')} // Updated to "fullname"
  >
    Full Name
  </TableSortLabel>
</TableCell>
                <TableCell align="left" style={{ color: "white" }}>
                  <TableSortLabel
                    active={sortField === "email"}
                    direction={sortField === "email" ? sortDirection : 'asc'}
                    onClick={() => handleSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  <TableSortLabel
                    active={sortField === "user_role"}
                    direction={sortField === "user_role" ? sortDirection : 'asc'}
                    onClick={() => handleSort('user_role')}
                  >
                    User Role
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ color: "white" }}>User Type</TableCell>
                <TableCell align="center" style={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {currentRows.map((row) => (
                  <TableRow key={row.empID}>
                    <TableCell component="th" scope="row">
                      {row.empID}
                    </TableCell>
                    <TableCell>{row.fullname}</TableCell> 
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell>{row.user_role}</TableCell>
                    <TableCell>{row.user_type}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        aria-controls="action-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, row._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`action-menu-${row._id}`}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl && menuUserId === row._id)}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={() => handleOpenAccessModal(row._id)}
                        >
                          Set to Co-admin
                        </MenuItem>
                        <MenuItem onClick={() => handleDelete(menuUserId)}>
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Grid>

        <Dialog
          open={isDeleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isAccessModalOpen}
          onClose={() => setAccessModalOpen(false)}
        >
          <DialogTitle>Set Co-Admin Access Features</DialogTitle>
          <DialogContent>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={accessFeatures.allowEditContent}
                    onChange={(event) => {
                      updateAccessFeatures({
                        ...accessFeatures,
                        allowEditContent: event.target.checked,
                      });
                    }}
                  />
                }
                label="Allow edit content"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={accessFeatures.allowDeleteExam}
                    onChange={(event) => {
                      updateAccessFeatures({
                        ...accessFeatures,
                        allowDeleteExam: event.target.checked,
                      });
                    }}
                  />
                }
                label="Allow delete exam"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={accessFeatures.allowAddCreateExam}
                    onChange={(event) => {
                      updateAccessFeatures({
                        ...accessFeatures,
                        allowAddCreateExam: event.target.checked,
                      });
                    }}
                  />
                }
                label="Allow add/create exam"
              />
              <FormControlLabel
                control={
                  <Switch
                  
                    checked={accessFeatures.allowCreateContent}
                     onChange={(event) => {
                      updateAccessFeatures({
                        ...accessFeatures,
                        allowCreateContent: event.target.checked,
                      });
                    }}
                  />
                }
                label="Allow create content"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
           <Button onClick={() => setAccessModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePermissions}>Save</Button>
          </DialogActions>
        </Dialog>
        <AddEmployeeModal
  isOpen={isModalOpen} // Corrected from `isOpen={i sOpen}`
  handleClose={handleCloseModal}
  departments={departments}
/>
      </Grid>
    </div>
  );
};

export default EmployeesAdmin;
