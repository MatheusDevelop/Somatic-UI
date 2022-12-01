import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Assignment,
  BadgeRounded,
  FitnessCenterRounded,
  LocalFireDepartmentRounded,
  LogoutOutlined,
  Person,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { passStoredConst, userStoredConst } from "../pages/Login";
import { Grid } from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function LayoutDrawer({ children }) {
  const theme = useTheme();
  const logoutUser = useUserStore((s) => s.logout);
  const [open, setOpen] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState("/");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem(userStoredConst);
    localStorage.removeItem(passStoredConst);
    navigate("/login");
  };
  React.useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);
  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Grid container alignItems={"center"}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {currentLocation.substring(0, "/exercises".length) ===
                "/exercises" && "Exercicios"}
              {currentLocation.substring(0, "/workouts".length) ===
                "/workouts" && "Treinos"}
              {currentLocation.substring(0, "/machines".length) ===
                "/machines" && "Aparelhos / Máquinas"}
              {currentLocation.substring(0, "/teachers".length) ===
                "/teachers" && "Professores"}
              {currentLocation.substring(0, "/leaners".length) === "/leaners" &&
                "Alunos"}
            </Typography>
          </Grid>

          <IconButton onClick={handleLogout}>
            <LogoutOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              icon: <LocalFireDepartmentRounded />,
              name: "Treinos",
              to: "/workouts",
            },
            {
              icon: <Assignment />,
              name: "Exercícios",
              to: "/exercises",
            },
            {
              icon: <FitnessCenterRounded />,
              name: "Máquinas",
              to: "/machines",
            },
          ].map((item, index) => (
            <ListItem key={item} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={
                  currentLocation.substring(0, item.to.length) === item.to
                }
                onClick={() => navigate(item.to)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  "&.Mui-selected": {
                    background: "#ffffff20",
                    ":hover": {
                      background: "#ffffff20",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[
            {
              icon: <BadgeRounded />,
              name: "Professores",
              to: "/teachers",
            },
            {
              icon: <Person />,
              name: "Alunos",
              to: "/leaners",
            },
          ].map((item) => (
            <ListItem key={item} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate(item.to)}
                selected={
                  currentLocation.substring(0, item.to.length) === item.to
                }
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  "&.Mui-selected": {
                    background: "#ffffff20",
                    ":hover": {
                      background: "#ffffff20",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
