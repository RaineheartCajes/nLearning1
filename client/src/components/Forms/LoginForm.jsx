import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Link, Grid, Avatar, Container, CircularProgress } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import NTS_Logo from "../../assets/images/NTS_Logo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useAuth } from "../../contexts/auth-context";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

const LoginForm = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (loginAttempts >= 5) {
      setLocked(true);
      const timer = setTimeout(() => {
        setLocked(false);
        setLoginAttempts(0);
      }, 300000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const loginEvent = async (data) => {
    if (locked) {
      showLockedAlert();
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/signin", {
        username: data.username,
        password: data.password,
      });

      login(response.data, response.data.token);
      navigate("/dashboard");
      setLoginSuccess(true);

      // Display SweetAlert success message without OK button
      Swal.fire({
        title: "Success!",
        text: "Login successful!",
        icon: "success",
        timer: 2000, // Set the duration of the message
        timerProgressBar: true,
        showConfirmButton: false, // Remove the OK button
        onClose: () => {
          setLoginSuccess(false); // Reset login success state after message closes
        }
      });
    } catch (error) {
      console.error("Login error:", error.message);
      setLoginAttempts((prevAttempts) => prevAttempts + 1);
      showLoginErrorAlert();
    }
  };

  const showLockedAlert = () => {
    let timerInterval;
  
    Swal.fire({
      title: "Incorrect Password",
      html: "Please try again in <b></b> seconds.",
      icon: "error",
      timer: 300000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Math.ceil(Swal.getTimerLeft() / 1000)}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
        const button = document.querySelector(".auth-button");
        button.disabled = true;
        button.classList.add("disabled");
        setTimeout(() => {
          button.disabled = false;
          button.classList.remove("disabled");
        }, 300000);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  };
   

  const showLoginErrorAlert = () => {
    Swal.fire({
      title: "Error",
      text: "Invalid username or password. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Avatar style={{ backgroundColor: 'red' }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <img src={NTS_Logo} alt="Company Logo" className="logo" />
        <Typography component="h1" variant="h5" style={{ marginTop: 10 }}>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit(loginEvent)} style={{ width: '100%', marginTop: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            style={{ margin: '20px 0 10px' }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default LoginForm;
