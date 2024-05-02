import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import NTS_Logo from "../../assets/images/NTS_Logo.png";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../contexts/auth-context";

const LoginSchema = Yup.object().shape({
  Username: Yup.string().required("Username is required"),
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
        username: data.Username,
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
    <div className="auth-container-wrapper">
      <div className="auth-container">
        <form onSubmit={handleSubmit(loginEvent)} className="login-form">
          <img src={NTS_Logo} alt="Company Logo" className="logo" />
          <div className="signin--header">Sign In</div>
          {loginSuccess && (
            <p style={{ color: "green", textAlign: "center" }}>
              Login successful!
            </p>
          )}
          <div className="fields-wrapper">
            <div className="form-label">Username</div>
            <input
              {...register("Username")}
              placeholder="Please enter Username"
              className={`form-field ${errors.Username && "error"}`}
            />
            <div className="error-message">{errors.Username?.message}</div>
            <div className="form-label">Password</div>
            <input
              {...register("password")}
              type="password"
              placeholder="Please enter Password"
              className={`form-field ${errors.password && "error"}`}
            />
            <div className="error-message">{errors.password?.message}</div>
          </div>
          <Button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <div className="end-footer">
            <p className="forgot-password">
              Forgot your password? <a href="/forgot">Reset it here</a>
            </p>
            <hr />
            <p className="signup-text">
              Don't have an account? <a href="/register">Sign Up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
