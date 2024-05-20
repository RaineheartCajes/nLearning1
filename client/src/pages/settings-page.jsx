import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/auth-context"; // Adjust the import path as necessary
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ReturnDashboard from "../components/ReturnDashboard";
import "../assets/styles/settings.css";

export default function Settings() {
  const { token, user, setUser, setUserType } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [userData, setUserData] = useState({
    username: user?.username || "",
    user_type: user?.user_type || "",
    user_role: user?.user_role || "",
    email: user?.email || "",
    department: user?.department || "",
    imageUrl: user?.imageUrl || "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error("Token not found");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:3001/settings/profile",
          {
            headers: { Authorization: token },
          }
        );
        setUserData(response.data);

        setUser(response.data);
        setUserType(response.data.user_type);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [token, setUser, setUserType]);

  const handleSubmit = async () => {
    if (!token) {
      console.error("Token not found");
      return;
    }
    try {
      await axios.put(
        "http://localhost:3001/settings/updateUserData",
        userData,
        {
          headers: { Authorization: token },
        }
      );
      setOpenSnackbar(true);

      setUser(userData);
      setUserType(userData.user_type);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && token) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `http://localhost:3001/settings/uploadProfileImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          }
        );
        console.log("File uploaded successfully:", response.data);

        // Update user data with new image URL
        const updatedUserData = {
          ...userData,
          imageUrl: response.data.imageUrl,
        };
        setUserData(updatedUserData);
        setUser((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      className="settings-container"
      sx={{ width: "100%", height: "50vh", marginTop: "8rem" }}
    >
      <Stack
        className="settings-stack"
        spacing={4}
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          my: 4,
        }}
      >
        <Card
          sx={{
            width: "60vw",
            height: "100vh",
            display: "flex",
          }}
        >
          <Box>
            <ReturnDashboard />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography
              level="title-md"
              style={{ fontWeight: "bold" }}
              size="lg"
            >
              Personal Information
            </Typography>
            <Typography level="body-sm">
              Customize how your profile information will appear to the
              networks.
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
              >
                {userData.imageUrl && (
                  <img src={userData.imageUrl} loading="lazy" alt="Profile" />
                )}
              </AspectRatio>
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                  bgcolor: "background.body",
                  position: "absolute",
                  zIndex: 2,
                  borderRadius: "50%",
                  left: 100,
                  top: 170,
                  boxShadow: "sm",
                }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <EditRoundedIcon />
              </IconButton>
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormControl sx={{ display: { sm: "contents" } }}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    size="lg"
                    type="text"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    sx={{
                      color: "black",
                    }}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input
                    size="lg"
                    type="text"
                    value={userData.user_role}
                    onChange={(e) =>
                      setUserData({ ...userData, user_role: e.target.value })
                    }
                    sx={{
                      color: "black",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    size="lg"
                    type="email"
                    startDecorator={<EmailRoundedIcon />}
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                </FormControl>
              </Stack>
              <div>
                <FormControl sx={{ display: { sm: "contents" } }}>
                  <FormLabel>User Type</FormLabel>
                  <Input
                    size="lg"
                    type="text"
                    readOnly
                    value={userData.user_type}
                    sx={{
                      color: "black",
                    }}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ display: { sm: "contents" } }}>
                  <FormLabel>Department</FormLabel>
                  <Input
                    size="lg"
                    type="text"
                    readOnly
                    value={userData.department}
                    sx={{
                      color: "black",
                    }}
                  />
                </FormControl>
              </div>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
          ></Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button
                size="sm"
                sx={{ bgcolor: "#e11d48" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          User data updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
