import { TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect } from "react";

export function WorkoutDetailsStep({
  setIsAbleToProceed,
  currentWorkout,
  setCurrentWorkout,
}) {
  useEffect(() => {
    if (currentWorkout.name && currentWorkout.name.length > 0)
      setIsAbleToProceed(true);
    else setIsAbleToProceed(false);
  }, [currentWorkout, setIsAbleToProceed]);

  return (
    <Stack item xs sx={{ mt: 4, flex: 1 }} alignItems="center" container>
      <Stack item sx={{ width: "35vw" }}>
        <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.6 }}>
          Descreva o treino
        </Typography>
        <TextField
          size="medium"
          required
          InputLabelProps={{ shrink: currentWorkout.name }}
          value={currentWorkout.name}
          label="Qual nome do treino?"
          onChange={(e) => {
            setCurrentWorkout((s) => ({ ...s, name: e.target.value }));
          }}
        />
        <TextField
          value={currentWorkout.description}
          onChange={(e) => {
            setCurrentWorkout((s) => ({ ...s, description: e.target.value }));
          }}
          InputLabelProps={{ shrink: currentWorkout.description }}
          size="medium"
          sx={{ mt: 2 }}
          label="Descrição do treino"
          multiline
          rows={5}
        />
      </Stack>
    </Stack>
  );
}
