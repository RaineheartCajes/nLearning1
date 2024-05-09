import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useParams } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoIosPeople } from "react-icons/io";
import { SlFolderAlt, SlGraph } from "react-icons/sl";
import { CiSettings } from "react-icons/ci";
import "../assets/styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [selectedItem, setSelectedItem] = React.useState(""); // Initial selected item

  const handleSidebarClick = (text) => {
    setSelectedItem(text); // Update selected item state
    switch (text) {
      case "Overview":
        navigate("/dashboard/overview");
        break;
      case "Create Content":
        navigate("/dashboard/create-content");
        break;
      case "Examinations":
        navigate("/dashboard");
        break;
      case "Employees":
        navigate("/dashboard/employees");
        break;
      case "Settings":
        navigate(`/dashboard/settings`, { state: { userId: userId } });
        break;
      default:
        break;
    }
  };

  return (
    <Box className="test">
      <Drawer variant="permanent" className="draw">
        <Box className="sidebar-box-wrapper">
          <List>
            {[
              "Overview",
              "Create Content",
              "Examinations",
              "Employees",
              "Settings",
            ].map((text, index) => (
              <ListItem
                key={text}
                className={
                  selectedItem === text ? "sidebar-list-item-active" : "sidebar-list-item"
                }
              >
                <ListItemButton onClick={() => handleSidebarClick(text)}>
                  <ListItemIcon className="sidebar-icons">
                    {index === 0 && <SlGraph />}
                    {index === 1 && <SlFolderAlt />}
                    {index === 2 && <MdDashboard />}
                    {index === 3 && <IoIosPeople />}
                    {index === 4 && <CiSettings />}
                  </ListItemIcon>
                  <ListItemText primary={text} className="sidebar-text"/>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
