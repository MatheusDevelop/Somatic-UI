import { Grid } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import Items from "../../layout/Main";
import useUserStore from "../../store/userStore";
import ExerciseInsertModal from "./ExercisesInsert";
import ExerciseCard from "./ExercisesItems/ExerciseCard";

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentSelectedExercise, setCurrentSelectedExercise] = useState(null);
  const getExercises = async (term = "") => {
    setLoading(true);
    const { data } = await api.get("exercises", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 15,
        page: currentPage,
      },
    });
    setExercises(data);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getExercises(t), 400),
    []
  );
  const currentUserId = useUserStore((s) => s.id);
  useEffect(() => {
    getExercises();
  }, [currentPage]);
  const handleCreateExercise = async (exercise) => {
    setLoading(true);
    if (!exercise.id) {
      await api.post("exercises", {
        ...exercise,
        userId: currentUserId,
      });
    } else
      await api.put(`exercises/${exercise.id}`, {
        ...exercise,
        userId: currentUserId,
      });
    setLoading(false);
    getExercises();
  };
  const handleDeleteExercise = async () => {
    setLoading(true);
    await api.delete(`exercises/${currentSelectedExercise.id}`);
    getExercises();
    setLoading(false);
  };

  return (
    <>
      <Items
        loading={loading}
        onCreateButtonClick={() => setOpenCreateModal(true)}
        onSearchChange={(t) => {
          setLoading(true);
          searchTermCallback(t);
        }}
        labelAdd="exercício"
        items={exercises.map((exercise) => (
          <Grid item>
            <ExerciseCard
              onClick={() => {
                setOpenCreateModal(true);
                setCurrentSelectedExercise(exercise);
              }}
              {...exercise}
            />
          </Grid>
        ))}
      />
      <ExerciseInsertModal
        onDelete={handleDeleteExercise}
        createdExercise={currentSelectedExercise}
        onCreate={handleCreateExercise}
        open={openCreateModal}
        setOpen={(opn) => {
          if (!opn) {
            setCurrentSelectedExercise(null);
            setOpenCreateModal(false);
          } else setOpenCreateModal(opn);
        }}
      />
    </>
  );
}

export default Exercises;
