import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import Form from "../../../layout/Form";
import useUserStore from "../../../store/userStore";
import { WorkoutDetailsStep } from "./Steps/WorkoutDetailsStep";
import { WorkoutExercisesStep } from "./Steps/WorkoutExercisesStep";
import { WorkoutLeanersSendStep } from "./Steps/WorkoutLeanersSendStep";

export default function WorkoutsInsert({ updateId }) {
  const [currentWorkout, setCurrentWorkout] = useState({});
  const [loading, setLoading] = useState(false);
  const currentUserId = useUserStore((s) => s.id);
  const navigate = useNavigate();
  const handleCreateWorkout = async () => {
    setLoading(true);
    if (updateId) {
      await api.put(`workouts/${updateId}`, {
        ...currentWorkout,
        userId: currentUserId,
      });
      setLoading(false);
      navigate(`/workouts/${updateId}`);
      return;
    }
    await api.post("workouts", {
      ...currentWorkout,
      userId: currentUserId,
    });
    setLoading(false);
    navigate("/workouts");
  };
  useEffect(() => {
    if (updateId) getWorkoutToUpdate();
  }, [updateId]);
  const getWorkoutToUpdate = async () => {
    setLoading(true);
    const { data } = await api.get(`workouts/${updateId}`);
    setCurrentWorkout({
      name: data.name,
      description: data.description,
      leanersIds: data.leaners.map((l) => l.id),
      sequences: data.sequences.map((s) => ({
        ...s,
      })),
    });
    setLoading(false);
  };
  return (
    <>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <Form
        onDoneButtonClick={handleCreateWorkout}
        updateScreen={updateId}
        steps={[
          {
            component: (setter) => (
              <WorkoutDetailsStep
                setIsAbleToProceed={setter}
                currentWorkout={currentWorkout}
                setCurrentWorkout={setCurrentWorkout}
              />
            ),
          },
          {
            component: (setter) => (
              <WorkoutExercisesStep
                setIsAbleToProceed={setter}
                currentWorkout={currentWorkout}
                setCurrentWorkout={setCurrentWorkout}
              />
            ),
          },
          {
            component: (setter) => (
              <WorkoutLeanersSendStep
                setIsAbleToProceed={setter}
                currentWorkout={currentWorkout}
                setCurrentWorkout={setCurrentWorkout}
              />
            ),
          },
        ]}
      />
    </>
  );
}
