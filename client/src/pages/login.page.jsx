import React from "react";
import HeroTypewriter from "../components/HeroTypewriter";
import LoginForm from "../components/Forms/LoginForm";
import "../assets/styles/authentication.css";
import "../assets/styles/login.css"; // New CSS file for login page styles

function Login() {
  return (
    <div className="login-page-wrapper">
      <div className="login-page--hero brand-red-bg">
        <HeroTypewriter />
      </div>
      <div className="login-form-wrapper">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
