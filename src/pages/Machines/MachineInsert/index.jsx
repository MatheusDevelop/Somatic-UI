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

export default function MachineInsertModal({
  open,
  setOpen,
  onCreate,
  onDelete,
  createdMachine,
}) {
  const [currentMachine, setCurrentMachine] = useState({});
  const [currentSelectedMachine, setCurrentSelectedMachine] = useState({});
  const [openInputs, setOpenInputs] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    clearAll();
    if (createdMachine) {
      setOpenInputs(false);
      setCurrentMachine({
        id: createdMachine.id,
        name: createdMachine.name,
      });
      setCurrentSelectedMachine({
        id: createdMachine.machineId,
      });
      setCurrentMediaUrls(createdMachine.mediaUrls);
    } else setOpenInputs(true);
  }, [createdMachine, open]);

  const [currentAddUrl, setCurrentAddUrl] = useState("");
  const [currentMediaUrls, setCurrentMediaUrls] = useState([]);
  const handleCreateClick = () => {
    handleClose();
    onCreate({
      id: currentMachine.id,
      name: currentMachine.name,
      mediaUrls: currentMediaUrls,
    });
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container>
          <Grid item xs>
            {createdMachine ? createdMachine.name : "Criar aparelho"}
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
          value={currentMachine.name}
          label="Nome do aparelho / máquina"
          onChange={(e) => {
            setCurrentMachine((s) => ({ ...s, name: e.target.value }));
          }}
        />
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
                      alt="Machine"
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
              !currentMachine.name ||
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
    setCurrentMachine({});
    setCurrentSelectedMachine({});
    setCurrentMediaUrls([]);
  }
}
