import {
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  Done,
} from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = ({ steps, onDoneButtonClick, updateScreen }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAbleToProceed, setIsAbleToProceed] = useState(false);
  return (
    <Stack container sx={{ flex: 1 }}>
      <Stack item sx={{ width: "100%" }}>
        <Grid container alignItems="center">
          <Grid item>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid item sx={{ ml: 4 }}>
            <Typography variant="h6">
              {updateScreen ? "Atualizar" : "Novo"} treino
            </Typography>
          </Grid>
        </Grid>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack item component={Paper} sx={{ p: 4, flex: 1 }}>
        <Stack container sx={{ flex: 1 }}>
          <Stack item>
            <Stepper activeStep={currentStep} alternativeLabel>
              <Step>
                <StepLabel>Descrição do treino</StepLabel>
              </Step>
              <Step>
                <StepLabel>Exercícios</StepLabel>
              </Step>
              <Step>
                <StepLabel>Destinar treino</StepLabel>
              </Step>
            </Stepper>
            <Divider sx={{ my: 4 }} />
          </Stack>
          {steps.map(
            (i, idx) => idx === currentStep && i.component(setIsAbleToProceed)
          )}
          <Stack item alignItems="center" container sx={{ mt: 2 }}>
            <Grid container justifyContent="flex-end">
              <Button
                startIcon={<ChevronLeft />}
                sx={{ mr: 5 }}
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
              >
                Voltar
              </Button>
              {currentStep + 1 === steps.length ? (
                <Button
                  endIcon={<Done />}
                  disabled={!isAbleToProceed}
                  onClick={onDoneButtonClick}
                  sx={{ color: "white" }}
                  variant="contained"
                >
                  Concluir
                </Button>
              ) : (
                <Button
                  endIcon={<ChevronRight />}
                  disabled={!isAbleToProceed}
                  onClick={() => {
                    setCurrentStep((s) => s + 1);
                    setIsAbleToProceed(false);
                  }}
                >
                  Próximo
                </Button>
              )}
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Form;
