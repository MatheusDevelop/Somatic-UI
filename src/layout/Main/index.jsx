import React from "react";
import { Divider, Grid } from "@mui/material";
import GridHeader from "../../components/GridHeader";

export default function Items({
  items,
  onSearchChange,
  loading,
  labelAdd,
  onCreateButtonClick,
}) {
  return (
    <>
      <GridHeader
        onCreateButtonClick={onCreateButtonClick}
        onSearchChange={onSearchChange}
        loading={loading}
        labelAdd={labelAdd}
      />
      <Divider sx={{ my: 2 }} />
      <Grid
        container
        sx={{
          justifyContent: {
            sm: "center",
            xs: "center",
            lg:"start"
          },
        }}
        spacing={2}
      >
        {items}
      </Grid>
    </>
  );
}
