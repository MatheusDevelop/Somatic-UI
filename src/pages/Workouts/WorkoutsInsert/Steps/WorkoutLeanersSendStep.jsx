import { Search } from "@mui/icons-material";
import {
  Avatar,
  Checkbox,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../../../api";

export function WorkoutLeanersSendStep({
  currentWorkout,
  setCurrentWorkout,
  setIsAbleToProceed,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const getUsers = async (term = "") => {
    setLoading(true);
    const { data } = await api.get("users/leaners", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 5,
        page: 1,
      },
    });
    setUsers(data);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getUsers(t), 400),
    []
  );
  useEffect(() => {
    if (currentWorkout.leanersIds && currentWorkout.leanersIds.length > 0)
      setIsAbleToProceed(true);
    else setIsAbleToProceed(false);
  }, [currentWorkout, setIsAbleToProceed]);

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <Stack item xs sx={{ mt: 4, flex: 1, position: "relative" }}>
      <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.6 }}>
        Destine o treino para seus alunos
      </Typography>
      <TextField
        placeholder="Pesquisar alunos"
        size="small"
        onChange={(e) => {
          setLoading(true);
          setUsers([]);
          searchTermCallback(e.target.value);
        }}
        sx={{ width: 350, mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" />
        </div>
      )}

      <Grid
        container
        flexWrap="nowrap"
        spacing={2}
        sx={{
          overflowX: "overlay",
          maxWidth: "80.5vw",
          pb: 2,
        }}
      >
        {users.map((user) => (
          <Grid item>
            <UserCard
              {...user}
              checked={(() => {
                if (!currentWorkout.leanersIds) return false;
                return currentWorkout.leanersIds.includes(user.id);
              })()}
              onCheck={() => {
                if (currentWorkout.leanersIds) {
                  if (currentWorkout.leanersIds.includes(user.id))
                    setCurrentWorkout((s) => ({
                      ...s,
                      leanersIds: s.leanersIds.filter((id) => id !== user.id),
                    }));
                  else
                    setCurrentWorkout((s) => ({
                      ...s,
                      leanersIds: [...s.leanersIds, user.id],
                    }));
                } else
                  setCurrentWorkout((s) => ({
                    ...s,
                    leanersIds: [user.id],
                  }));
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
function UserCard({ checked, onCheck, profilePictureUrl, name, email }) {
  return (
    <Paper sx={{ p: 4, width: 450 }} elevation={4}>
      <Grid container alignItems={"center"}>
        <Grid item sx={{ mr: 2 }}>
          <Checkbox checked={checked} onChange={onCheck} />
        </Grid>
        <Grid item sx={{ mr: 2 }}>
          <Avatar src={profilePictureUrl} />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
            {email}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
