import { LoginOutlined } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Logo from "../../assets/Logo.svg";
import useUserStore from "../../store/userStore";
export const passStoredConst = "centauro-pass";
export const userStoredConst = "centauro-user";
function Login() {
  const navigate = useNavigate();
  const loginUser = useUserStore((s) => s.login);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    setLoading(true);
    await makeLogin(user, pass);
    setLoading(false);
  };
  const makeLogin = async (username, password) => {
    const { data } = await api.post("users/login", {
      user: username,
      pass: password,
    });
    if (!data.auth) {
      alert("Login invalido");
      return;
    }
    localStorage.setItem(userStoredConst, username);
    localStorage.setItem(passStoredConst, password);
    loginUser(data.id, data.role);
    navigate("/workouts");
  };
  return (
    <>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://d1a3v8txm37nbo.cloudfront.net/image/filename/514076/x_lg_WhatsApp_Image_2017-08-22_at_19.16.26.jpeg)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            top: 0,
            right: 0,
            position: "fixed",
            backgroundColor: "#000000dc",
            backdropFilter: "blur(5px)",
          }}
        ></div>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            height: {
              lg: 400,
              sm: "60vh",
              xs: "60vh",
            },
            width: {
              lg: 400,
              sm: "60vw",
              xs: "90vw",
            },
            zIndex: 999,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img src={Logo} alt="Logo" width={100} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <TextField
              size="small"
              label="Usuario"
              fullWidth
              autoComplete="false"
              margin="normal"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <TextField
              size="small"
              label="Senha"
              type="password"
              fullWidth
              autoComplete="false"
              margin="normal"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Button
              onClick={handleLoginClick}
              variant="contained"
              size="large"
              endIcon={<LoginOutlined />}
              disableElevation
              sx={{ color: "white", width: "100%", mt: 4 }}
            >
              Entrar
            </Button>
          </Box>
        </Paper>
      </div>
    </>
  );
}

export default Login;
