import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth-context"; // Ensure the path is correct

function Dashboard() {
  const { isAdmin } = useAuth(); // Use isAdmin method

  return (
    <>

      <div className="dashboard-content">
        <Navbar />

        {isAdmin() && <Sidebar />}

        <div className={isAdmin() ? "dashboard__admin" : "dashboard__user"}>
          <Outlet
            className={
              isAdmin() ? "outlet--with-sidebar" : "outlet--full-width"
            }
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
