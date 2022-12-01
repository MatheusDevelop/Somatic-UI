import { DragIndicator, Search } from "@mui/icons-material";
import {
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../../../api";

export function WorkoutExercisesStep({
  setIsAbleToProceed,
  currentWorkout,
  setCurrentWorkout,
}) {
  const [exercises, setExercises] = useState([]);
  useEffect(() => {
    if (currentWorkout.sequences && currentWorkout.sequences.length > 0)
      setIsAbleToProceed(true);
    else setIsAbleToProceed(false);
  }, [currentWorkout, setIsAbleToProceed]);

  const [draggingIndex, setDraggingIndex] = useState(null);
  const currentDrag = useRef(null);
  const currentOverDrag = useRef(null);
  const handleSort = () => {
    let currentSequences = [...currentWorkout.sequences];
    const draggedItemContent = currentSequences.splice(
      currentDrag.current,
      1
    )[0];
    currentSequences.splice(currentOverDrag.current, 0, draggedItemContent);
    currentDrag.current = null;
    currentOverDrag.current = null;
    setDraggingIndex(null);
    setCurrentWorkout((s) => ({ ...s, sequences: currentSequences }));
  };
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const getExercises = async (term = "") => {
    setExercisesLoading(true);
    const { data } = await api.get("exercises", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 5,
        page: 1,
      },
    });
    setExercises(data);
    setExercisesLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getExercises(t), 400),
    []
  );
  useEffect(() => {
    getExercises();
  }, []);

  return (
    <Stack item xs sx={{ flex: 1 }}>
      <Grid container sx={{ mb: 1, opacity: 0.6 }}>
        <Grid item xs={4.2}>
          <Typography variant="subtitle2">
            Selecione os exercícios do treino
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle2">
            Organize os exercícios selecionados
          </Typography>
        </Grid>
      </Grid>
      <Stack item container sx={{ flex: 1 }}>
        <Grid container sx={{ flex: 1 }}>
          <Grid
            item
            xs={4}
            component={Paper}
            elevation={12}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <TextField
              fullWidth
              placeholder="Pesquisar exercícios"
              size="small"
              onChange={(e) => {
                setExercisesLoading(true);
                setExercises([]);
                searchTermCallback(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <List
              sx={{
                overflowY: "overlay",
                flex: "1 1 0",
                height: "100%",
                mt: 2,
              }}
            >
              {exercisesLoading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  <CircularProgress color="primary" />
                </div>
              )}
              {exercises.map((exercise) => {
                const labelId = `ex-label-${exercise.id}`;
                return (
                  <ListItem key={exercise.id} disablePadding>
                    <ListItemButton role={undefined} dense>
                      <ListItemIcon>
                        <Checkbox
                          checked={(() => {
                            if (!currentWorkout.sequences) return false;
                            return (
                              currentWorkout.sequences.findIndex(
                                (e) => e.id === exercise.id
                              ) !== -1
                            );
                          })()}
                          onClick={() => {
                            if (currentWorkout.sequences) {
                              const insertedIndex =
                                currentWorkout.sequences.findIndex(
                                  (e) => e.id === exercise.id
                                );
                              if (insertedIndex === -1)
                                setCurrentWorkout((s) => ({
                                  ...s,
                                  sequences: [...s.sequences, exercise],
                                }));
                              else
                                setCurrentWorkout((s) => {
                                  const curr = { ...s };
                                  curr.sequences = curr.sequences.filter(
                                    (s) => s.id !== exercise.id
                                  );
                                  return curr;
                                });
                            } else {
                              setCurrentWorkout((s) => ({
                                ...s,
                                sequences: [exercise],
                              }));
                            }
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={exercise.name}
                        secondary={`${exercise.machineName} ${
                          exercise.machineNumber
                            ? `- Nº ${exercise.machineNumber}`
                            : ""
                        }`}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mx: 2 }}
          />
          <Grid item xs sx={{ display: "flex", flexDirection: "column" }}>
            <List
              sx={{
                width: "100%",
                flex: "1 1 0",
                height: "100%",
                overflowY: "overlay",
              }}
            >
              {currentWorkout.sequences &&
                currentWorkout.sequences.map((sequence, idx) => {
                  const labelId = `wk-label-${sequence.id}`;
                  return (
                    <>
                      <ListItem
                        key={sequence.id}
                        disablePadding
                        sx={{
                          mb: 2,
                          backgroundColor:
                            draggingIndex === idx ? "#2b2b2b" : "transparent",
                        }}
                        draggable
                        onDragStart={() => {
                          setDraggingIndex(idx);
                          return (currentDrag.current = idx);
                        }}
                        onDragEnter={() => (currentOverDrag.current = idx)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => {
                          setDraggingIndex(null);
                          e.preventDefault();
                        }}
                      >
                        <ListItemIcon sx={{ cursor: "grab" }}>
                          <DragIndicator />
                        </ListItemIcon>
                        <ListItemText
                          id={labelId}
                          primary={sequence.name}
                          secondary={`${sequence.machineName} ${
                            sequence.machineNumber
                              ? `- Nº ${sequence.machineNumber}`
                              : ""
                          }`}
                        />
                        <Switch
                          checked={currentWorkout.sequences[idx].untilFail}
                          onChange={() => {
                            setCurrentWorkout((s) => {
                              const curr = { ...s };
                              curr.sequences[idx].untilFail =
                                !curr.sequences[idx].untilFail;
                              return curr;
                            });
                          }}
                          sx={{ mr: 2 }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                        <small>Até a falha</small>
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{ mx: 4 }}
                        />
                        <TextField
                          type="number"
                          label=""
                          size="small"
                          value={currentWorkout.sequences[idx].series}
                          onChange={(e) => {
                            setCurrentWorkout((s) => {
                              const curr = { ...s };
                              curr.sequences[idx].series = +e.target.value;
                              return curr;
                            });
                          }}
                          sx={{ mr: 2, width: 60 }}
                        />
                        <small>de</small>
                        <TextField
                          type="number"
                          size="small"
                          value={currentWorkout.sequences[idx].repetitions}
                          onChange={(e) => {
                            setCurrentWorkout((s) => {
                              const curr = { ...s };
                              curr.sequences[idx].repetitions = +e.target.value;
                              return curr;
                            });
                          }}
                          sx={{ ml: 2, width: 60 }}
                        />
                      </ListItem>
                    </>
                  );
                })}
            </List>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
