import { Stack } from "@mui/system";
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LayoutDrawer from "../../components/Drawer";
import LeanerAppBar from "../../components/LeanerAppbar";
import useUserStore from "../../store/userStore";

export default function Drawer() {
  const userRole = useUserStore((s) => s.role);
  return (
    <>
      {userRole === "Leaner" ? (
        <Stack container sx={{ flex: 1 }}>
          <Stack item sx={{ height: 70 }}>
            <LeanerAppBar />
          </Stack>
          <Stack item xs sx={{ flex: 1 }}>
            <Outlet />
          </Stack>
        </Stack>
      ) : (
        <LayoutDrawer>
          <Outlet />
        </LayoutDrawer>
      )}
    </>
  );
}
