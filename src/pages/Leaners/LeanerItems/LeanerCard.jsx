import React from "react";
import { East } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";

export default function LeanerCard({ name, onClick }) {
  const handleButtonClick = () => {
    onClick();
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
          </Grid>
        </Stack>
        <Stack item xs>
          <Grid container justifyContent="flex-end">
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
