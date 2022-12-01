import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import Items from "../../layout/Main";
import useUserStore from "../../store/userStore";
import WorkoutCard from "./WorkoutsItems/WorkoutCard";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { role: userRole, id: userId } = useUserStore((s) => s);
  const getWorkouts = async (term = "") => {
    setLoading(true);
    const { data } = await api.get("workouts", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 15,
        page: currentPage,
        leanerId: userRole === "Leaner" ? userId : null,
      },
    });
    setWorkouts(data);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getWorkouts(t), 400),
    []
  );
  useEffect(() => {
    getWorkouts();
  }, [currentPage]);

  return (
    <>
      <Items
        loading={loading}
        onSearchChange={(t) => {
          setLoading(true);
          searchTermCallback(t);
        }}
        labelAdd="treino"
        items={workouts.map((workout) => (
          <Grid item>
            <WorkoutCard {...workout} />
          </Grid>
        ))}
      />
    </>
  );
}

export default Workouts;
