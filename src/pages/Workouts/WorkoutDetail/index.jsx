import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import Details from "../../../layout/Details";

// import { Container } from './styles';

function WorkoutDetail() {
  const { id } = useParams();
  const [workout, setWorkout] = useState({
    sequences: [],
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getWorkout();
  }, []);
  const getWorkout = async () => {
    setLoading(true);
    const { data } = await api.get(`workouts/${id}`);
    setWorkout(data);
    setLoading(false);
  };
  const deleteWorkout = async () => {
    setLoading(true);
    await api.delete(`workouts/${id}`);
    setLoading(false);
    navigate("/workouts");
  };
  return (
    <>
      <Details
        handleDeleteButtonClick={deleteWorkout}
        loading={loading}
        workout={workout}
      />
    </>
  );
}

export default WorkoutDetail;
