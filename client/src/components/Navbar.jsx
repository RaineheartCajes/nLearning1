import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import NTS_Logo from "../assets/images/NTS_Logo.png";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { useAuth } from "../contexts/auth-context";
import axios from "axios"; 
import Swal from 'sweetalert2';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout, token } = useAuth(); 
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isAuthenticated && token) {
      axios
        .get("http://localhost:3001/auth/username", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error("Fetching username failed:", error);
        });
    }
  }, [isAuthenticated, token]); 

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    setAnchorEl(null);
    navigate("/dashboard/settings");
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          icon: 'success',
          title: 'Logout Success',
          showConfirmButton: false,
          timer: 1500 // Auto close the success message after 1.5 seconds
        });
        navigate("/"); // Assuming you are using navigate from react-router-dom to redirect
      }
    });
  };

  return (
    <Box sx={{ width: "4rem", marginBottom: "3rem" }}>
      <AppBar
        className="navbar--wrapper"
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <img src={NTS_Logo} className="logo" alt="NTS Logo" />
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, ml: "1rem" }}
          >
            nLearning
          </Typography>
          {isAuthenticated && (
            <div>
              <div className="user-details--wrapper" onClick={handleMenu}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <MdAccountCircle />
                </IconButton>
                {/* <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    ml: "1rem",
                    display: "flex",
                    alignSelf: "center",
                  }}
                >
                  {username || "User Name"} 
                </Typography> */}
              </div>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    borderRadius: 8, 
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", 
                    minWidth: 180,
                  },
                }}
              >
                <div style={{ padding: "8px 16px", fontWeight: "bold", pointerEvents: "none" }}>
                  {username}
                </div>
                <hr style={{ margin: 0 }} />
                <MenuItem
                  component={Link}
                  to="/dashboard/settings"
                  style={{ padding: "8px 16px" }}
                >
                  My account
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  style={{
                    padding: "8px 16px",
                    color: "#f44336", 
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
