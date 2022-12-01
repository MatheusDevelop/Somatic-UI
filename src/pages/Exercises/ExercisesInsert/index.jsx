import React, { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Add,
  Close,
  DeleteOutlined,
  Done,
  EditOutlined,
  Search,
} from "@mui/icons-material";
import screenfull from "screenfull";

import {
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { Stack } from "@mui/system";
import { debounce } from "lodash";
import api from "../../../api";
import { ImageButton, isImage } from "../../../layout/Details";
import ReactPlayer from "react-player";

export default function ExerciseInsertModal({
  open,
  setOpen,
  onCreate,
  onDelete,
  createdExercise,
}) {
  const [currentExercise, setCurrentExercise] = useState({});
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSelectedMachine, setCurrentSelectedMachine] = useState({});
  const [openInputs, setOpenInputs] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getMachines(t), 400),
    []
  );
  useEffect(() => {
    clearAll();
    if (createdExercise) {
      setOpenInputs(false);
      setCurrentExercise({
        id: createdExercise.id,
        name: createdExercise.name,
      });
      setCurrentSelectedMachine({
        id: createdExercise.machineId,
      });
      setTypedValue(createdExercise.machineName);
      setCurrentMediaUrls(createdExercise.mediaUrls);
    } else setOpenInputs(true);
  }, [createdExercise, open]);

  const [typedValue, setTypedValue] = useState("");
  const getMachines = async (term = "") => {
    setLoading(true);
    const { data } = await api.get("machines", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 5,
        page: 1,
      },
    });
    setMachines(data);
    setLoading(false);
  };
  const [currentAddUrl, setCurrentAddUrl] = useState("");
  const [currentMediaUrls, setCurrentMediaUrls] = useState([]);
  const handleCreateClick = () => {
    handleClose();
    onCreate({
      id: currentExercise.id,
      name: currentExercise.name,
      machineId: currentSelectedMachine.id,
      mediaUrls: currentMediaUrls,
    });
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container>
          <Grid item xs>
            {createdExercise ? createdExercise.name : "Criar exercício"}
          </Grid>
          {!openInputs && (
            <Grid item>
              <IconButton
                sx={{ mr: 1 }}
                color="primary"
                onClick={() => {
                  handleClose();
                  onDelete();
                }}
              >
                <DeleteOutlined />
              </IconButton>
              <IconButton color="primary" onClick={() => setOpenInputs(true)}>
                <EditOutlined />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          size="small"
          fullWidth
          disabled={!openInputs}
          InputLabelProps={{ shrink: true }}
          value={currentExercise.name}
          label="Nome do exercício"
          onChange={(e) => {
            setCurrentExercise((s) => ({ ...s, name: e.target.value }));
          }}
        />

        <TextField
          size="small"
          fullWidth
          disabled={!openInputs}
          sx={{ mt: 2 }}
          label="Máquina / Aparelho do exercício"
          value={typedValue}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            setLoading(true);
            setMachines([]);
            searchTermCallback(e.target.value);
            setTypedValue(e.target.value);
          }}
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
        <Stack container sx={{ position: "relative" }}>
          {machines.length > 0 && typedValue.length > 0 && (
            <Stack
              item
              component={Paper}
              sx={{
                mt: 1,
                position: "absolute",
                width: "100%",
                zIndex: 1500,
              }}
            >
              <List
                sx={{
                  overflowY: "overlay",
                  zIndex: 99,
                }}
              >
                {machines.map((machine) => {
                  const labelId = `ex-label-${machine.id}`;
                  return (
                    <ListItem key={machine.id} disablePadding>
                      <ListItemButton
                        role={undefined}
                        dense
                        onClick={() => {
                          setMachines([]);
                          setTypedValue(machine.name);
                          console.log(machine);
                          setCurrentSelectedMachine(machine);
                        }}
                      >
                        <ListItemText
                          id={labelId}
                          primary={`${
                            machine.number
                              ? `${machine.name} - Nº ${machine.number}`
                              : machine.name
                          }`}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          )}
        </Stack>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs>
            <TextField
              size="small"
              fullWidth
              disabled={!openInputs}
              InputLabelProps={{ shrink: true }}
              value={currentAddUrl}
              label="URL de imagens / videos"
              onChange={(e) => {
                setCurrentAddUrl(e.target.value);
              }}
            />
          </Grid>
          <Grid item sx={{ ml: 2 }}>
            <IconButton
              disabled={!openInputs}
              onClick={() => {
                setCurrentAddUrl("");
                setCurrentMediaUrls((s) => [currentAddUrl, ...s]);
              }}
            >
              <Add />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          container
          sx={{ height: 300, overflowY: "overlay", mt: 2 }}
          spacing={1}
          justifyContent={"center"}
        >
          {currentMediaUrls.map((url, idx) => (
            <Grid item key={url}>
              <Paper
                sx={{
                  width: 200,
                  height: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
                elevation={3}
              >
                <IconButton
                  disabled={!openInputs}
                  onClick={() => {
                    setCurrentMediaUrls((s) => s.filter((r) => r !== url));
                  }}
                  sx={{ position: "absolute", top: 5, right: 5, zIndex: 99 }}
                >
                  <Close />
                </IconButton>
                <ImageButton
                  color="inherit"
                  onClick={() => {
                    const element = document.getElementById(url);
                    if (element) screenfull.request(element);
                  }}
                >
                  {isImage(url) ? (
                    <img
                      id={url}
                      src={url}
                      alt="Exercise"
                      style={{
                        width: 200,
                        height: "100%",
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <ReactPlayer width={"100%"} height="100%" url={url} />
                  )}
                </ImageButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      {openInputs && (
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleCreateClick}
            disabled={
              !currentExercise.name ||
              currentMediaUrls.length === 0 ||
              !currentSelectedMachine
            }
            variant="contained"
            endIcon={<Done />}
          >
            Concluido
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );

  function clearAll() {
    setCurrentExercise({});
    setCurrentSelectedMachine({});
    setTypedValue("");
    setCurrentMediaUrls([]);
  }
}
