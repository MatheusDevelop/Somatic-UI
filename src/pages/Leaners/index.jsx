import { Grid } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import Items from "../../layout/Main";
import LeanerInsertModal from "./LeanerInsert";
import LeanerCard from "./LeanerItems/LeanerCard";

function Leaners() {
  const [leaners, setLeaners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentSelectedLeaner, setCurrentSelectedLeaner] = useState(null);
  const getLeaners = async (term = "") => {
    setLoading(true);
    const { data } = await api.get("users/leaners", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 15,
        page: currentPage,
      },
    });
    setLeaners(data);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getLeaners(t), 400),
    []
  );
  useEffect(() => {
    getLeaners();
  }, [currentPage]);
  const handleCreateLeaner = async (teacher) => {
    setLoading(true);
    if (!teacher.id) {
      await api.post("users/leaners", {
        ...teacher,
      });
    } else
      await api.put(`users/leaners/${teacher.id}`, {
        ...teacher,
      });
    setLoading(false);
    getLeaners();
  };
  const handleDeleteLeaner = async () => {
    setLoading(true);
    await api.delete(`users/leaners/${currentSelectedLeaner.id}`);
    getLeaners();
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
        labelAdd="aluno"
        items={leaners.map((leaner) => (
          <Grid item>
            <LeanerCard
              onClick={() => {
                setOpenCreateModal(true);
                setCurrentSelectedLeaner(leaner);
              }}
              {...leaner}
            />
          </Grid>
        ))}
      />
      <LeanerInsertModal
        onDelete={handleDeleteLeaner}
        createdLeaner={currentSelectedLeaner}
        onCreate={handleCreateLeaner}
        open={openCreateModal}
        setOpen={(opn) => {
          if (!opn) {
            setCurrentSelectedLeaner(null);
            setOpenCreateModal(false);
          } else setOpenCreateModal(opn);
        }}
      />
    </>
  );
}

export default Leaners;
