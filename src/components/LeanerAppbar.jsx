import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Logo from "../assets/Logo.svg";
import { LogoutOutlined } from "@mui/icons-material";
import useUserStore from "../store/userStore";
import { passStoredConst, userStoredConst } from "../pages/Login";
import { useNavigate } from "react-router-dom";

export default function LeanerAppBar() {
  const logoutUser = useUserStore((s) => s.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem(userStoredConst);
    localStorage.removeItem(passStoredConst);
    navigate("/login");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img src={Logo} width={60} alt="Centauro logo" />
          <IconButton onClick={handleLogout}>
            <LogoutOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
