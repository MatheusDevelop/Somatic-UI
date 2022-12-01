import { Grid } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import Items from "../../layout/Main";
import useUserStore from "../../store/userStore";
import MachineInsertModal from "./MachineInsert";
import MachineCard from "./MachinesItems/MachineCard";

function Machines() {
  const [machines, setMachines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentSelectedMachine, setCurrentSelectedMachine] = useState(null);
  const getMachines = async (term = "") => {
    setLoading(true);
    const { data } = await api.get("machines", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 15,
        page: currentPage,
      },
    });
    setMachines(data);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getMachines(t), 400),
    []
  );
  const currentUserId = useUserStore((s) => s.id);
  useEffect(() => {
    getMachines();
  }, [currentPage]);
  const handleCreateMachine = async (machine) => {
    setLoading(true);
    if (!machine.id) {
      await api.post("machines", {
        ...machine,
        userId: currentUserId,
      });
    } else
      await api.put(`machines/${machine.id}`, {
        ...machine,
        userId: currentUserId,
      });
    setLoading(false);
    getMachines();
  };
  const handleDeleteMachine = async () => {
    setLoading(true);
    await api.delete(`machines/${currentSelectedMachine.id}`);
    getMachines();
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
        labelAdd="aparelho"
        items={machines.map((machine) => (
          <Grid item>
            <MachineCard
              onClick={() => {
                setOpenCreateModal(true);
                setCurrentSelectedMachine(machine);
              }}
              {...machine}
            />
          </Grid>
        ))}
      />
      <MachineInsertModal
        onDelete={handleDeleteMachine}
        createdMachine={currentSelectedMachine}
        onCreate={handleCreateMachine}
        open={openCreateModal}
        setOpen={(opn) => {
          if (!opn) {
            setCurrentSelectedMachine(null);
            setOpenCreateModal(false);
          } else setOpenCreateModal(opn);
        }}
      />
    </>
  );
}

export default Machines;
