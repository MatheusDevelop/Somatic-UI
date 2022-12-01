import React from "react";
import { useParams } from "react-router-dom";
import WorkoutsInsert from "../WorkoutsInsert";

function WorkoutUpdate() {
  const { id } = useParams();
  return <WorkoutsInsert updateId={id} />;
}

export default WorkoutUpdate;
