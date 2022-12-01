import React from "react";
import { East } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../store/userStore";

export default function WorkoutCard({
  name,
  assignedUserName,
  assignedUserProfilePictureUrl,
  leaners,
  id,
}) {
  const navigate = useNavigate();
  const userRole = useUserStore((s) => s.role);

  const handleButtonClick = () => {
    navigate(`/workouts/${id}`);
  };
  return (
    <Paper sx={{ width: 300, height: 200, display: "flex", p: 2 }}>
      <Stack container sx={{ flex: 1 }} justifyContent="space-between">
        <Stack item xs>
          <Grid container>
            <Grid item xs>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {name}
              </Typography>
            </Grid>
            <Grid item xs container justifyContent="flex-end">
              <Avatar
                alt={assignedUserName}
                src={assignedUserProfilePictureUrl}
                sx={{ width: 32, height: 32 }}
              >
                {assignedUserName && assignedUserName[0]}
              </Avatar>
            </Grid>
          </Grid>
        </Stack>
        <Stack item xs>
          <Grid
            container
            justifyContent={
              userRole === "Teacher" ? "space-between" : "flex-end"
            }
          >
            {userRole === "Teacher" && (
              <AvatarGroup
                max={4}
                sx={{
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    fontSize: 16,
                  },
                }}
              >
                {leaners.map((leaner) => (
                  <Avatar alt={leaner.name}>{leaner.name[0]}</Avatar>
                ))}
              </AvatarGroup>
            )}

            <IconButton
              color="primary"
              sx={{ width: 40, height: 40 }}
              onClick={handleButtonClick}
            >
              <East />
            </IconButton>
          </Grid>
        </Stack>
      </Stack>
    </Paper>
  );
}
