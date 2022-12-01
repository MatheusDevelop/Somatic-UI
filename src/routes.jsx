import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/DrawerLayout";
import Exercises from "./pages/Exercises";
import Leaners from "./pages/Leaners";
import Login from "./pages/Login";
import Machines from "./pages/Machines";
import Teachers from "./pages/Teachers";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/Workouts/WorkoutDetail";
import WorkoutsInsert from "./pages/Workouts/WorkoutsInsert";
import WorkoutUpdate from "./pages/Workouts/WorkoutUpdate";
import useUserStore from "./store/userStore";

export default function AppRoutes() {
  const isAuthenticated = useUserStore((s) => s.auth);
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Workouts />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="workouts/:id" element={<WorkoutDetail />} />
          <Route path="workouts/insert" element={<WorkoutsInsert />} />
          <Route path="workouts/update/:id" element={<WorkoutUpdate />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="machines" element={<Machines />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="leaners" element={<Leaners />} />
        </Route>
      </Routes>
  );
}
