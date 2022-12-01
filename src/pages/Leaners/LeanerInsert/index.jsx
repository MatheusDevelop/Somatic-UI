import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DeleteOutlined, Done, EditOutlined } from "@mui/icons-material";
import { Divider, Grid, IconButton } from "@mui/material";

export default function LeanerInsertModal({
  open,
  setOpen,
  onCreate,
  onDelete,
  createdLeaner,
}) {
  const [currentTeacher, setCurrentTeacher] = useState({});
  const [openInputs, setOpenInputs] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    clearAll();
    if (createdLeaner) {
      setOpenInputs(false);
      setCurrentTeacher({
        id: createdLeaner.id,
        name: createdLeaner.name,
        pass: createdLeaner.pass,
        user: createdLeaner.user,
      });
    } else setOpenInputs(true);
  }, [createdLeaner, open]);

  const handleCreateClick = () => {
    handleClose();
    onCreate({
      id: currentTeacher.id,
      name: currentTeacher.name,
      pass: currentTeacher.pass,
      user: currentTeacher.user,
    });
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container>
          <Grid item xs>
            {createdLeaner ? createdLeaner.name : "Criar professor"}
          </Grid>
          {!openInputs && (
            <Grid item>
              {/* <IconButton
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
              </IconButton> */}
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
          value={currentTeacher.name}
          label="Nome"
          onChange={(e) => {
            setCurrentTeacher((s) => ({ ...s, name: e.target.value }));
          }}
        />
        <TextField
          sx={{ mt: 2 }}
          size="small"
          fullWidth
          disabled={!openInputs}
          InputLabelProps={{ shrink: true }}
          value={currentTeacher.user}
          label="Usuario"
          onChange={(e) => {
            setCurrentTeacher((s) => ({ ...s, user: e.target.value }));
          }}
        />
        <TextField
          sx={{ mt: 2 }}
          size="small"
          fullWidth
          disabled={!openInputs}
          InputLabelProps={{ shrink: true }}
          value={currentTeacher.pass}
          label="Senha"
          onChange={(e) => {
            setCurrentTeacher((s) => ({ ...s, pass: e.target.value }));
          }}
        />
      </DialogContent>
      {openInputs && (
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleCreateClick}
            disabled={
              !currentTeacher.name ||
              !currentTeacher.pass ||
              !currentTeacher.user
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
    setCurrentTeacher({});
  }
}
