import { Grid } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import Items from "../../layout/Main";
import TeacherInsertModal from "./TeacherInsert";
import TeacherCard from "./TeacherItems/TeacherCard";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentSelectedTeacher, setCurrentSelectedTeacher] = useState(null);
  const getTeachers = async (term = "") => {
    setLoading(true);
    const { data } = await api.get("users/teachers", {
      params: {
        term: term.length > 0 ? term : null,
        itemsPerPage: 15,
        page: currentPage,
      },
    });
    setTeachers(data);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTermCallback = useCallback(
    debounce((t) => getTeachers(t), 400),
    []
  );
  useEffect(() => {
    getTeachers();
  }, [currentPage]);
  const handleCreateTeacher = async (teacher) => {
    setLoading(true);
    if (!teacher.id) {
      await api.post("users/teachers", {
        ...teacher,
      });
    } else
      await api.put(`users/teachers/${teacher.id}`, {
        ...teacher,
      });
    setLoading(false);
    getTeachers();
  };
  const handleDeleteTeacher = async () => {
    setLoading(true);
    await api.delete(`users/teachers/${currentSelectedTeacher.id}`);
    getTeachers();
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
        labelAdd="professor"
        items={teachers.map((teacher) => (
          <Grid item>
            <TeacherCard
              onClick={() => {
                setOpenCreateModal(true);
                setCurrentSelectedTeacher(teacher);
              }}
              {...teacher}
            />
          </Grid>
        ))}
      />
      <TeacherInsertModal
        onDelete={handleDeleteTeacher}
        createdTeacher={currentSelectedTeacher}
        onCreate={handleCreateTeacher}
        open={openCreateModal}
        setOpen={(opn) => {
          if (!opn) {
            setCurrentSelectedTeacher(null);
            setOpenCreateModal(false);
          } else setOpenCreateModal(opn);
        }}
      />
    </>
  );
}

export default Teachers;
