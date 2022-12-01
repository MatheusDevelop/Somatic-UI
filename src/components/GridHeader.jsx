import { Add, Search } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

export default function GridHeader({
  onSearchChange,
  loading,
  labelAdd,
  onCreateButtonClick,
}) {
  const userRole = useUserStore((s) => s.role);
  const navigate = useNavigate();
  return (
    <Grid
      container
      alignItems={"center"}
      flexWrap="wrap"
      sx={{
        px: {
          lg: 0,
          sm: 2,
          xs: 2,
        },
      }}
    >
      <Grid
        item
        sx={{
          flex: {
            xs: userRole === "Teacher" ? false : 1,
            sm: true,
          },
        }}
      >
        <TextField
          sx={{
            width: {
              sm: "100%",
              md: "100%",
              lg: 400,
            },
          }}
          placeholder="Pesquisar"
          size="small"
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ pr: 2 }}>
                {loading ? (
                  <CircularProgress color="primary" size={24} />
                ) : (
                  <Search />
                )}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      {userRole === "Teacher" && (
        <Grid
          item
          xs
          container
          justifyContent="flex-end"
          sx={{
            marginTop: {
              xs: 2,
              lg: 0,
              sm: 2,
            },
          }}
        >
          <Button
            variant="contained"
            sx={{
              color: "white",
              width: {
                sm: "100%",
                xs: "100%",
                lg: "auto",
              },
            }}
            endIcon={<Add />}
            onClick={() =>
              onCreateButtonClick ? onCreateButtonClick() : navigate("insert")
            }
          >
            Criar {labelAdd}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
