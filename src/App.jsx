import {
  Backdrop,
  CircularProgress,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { passStoredConst, userStoredConst } from "./pages/Login";
import AppRoutes from "./routes";
import useUserStore from "./store/userStore";
import "./style.css";
function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const userStored = localStorage.getItem(userStoredConst);
    const passStored = localStorage.getItem(passStoredConst);
    if (userStored && passStored) {
      makeLogin(userStored, passStored);
    }
  }, []);
  const navigate = useNavigate();
  const loginUser = useUserStore((s) => s.login);
  const makeLogin = async (username, password) => {
    setLoading(true);
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
    setLoading(false);
  };
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#da6600",
      },
    },
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
