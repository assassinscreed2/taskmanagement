import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Collapse,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Adjust,
  RotateRight,
  CheckCircle,
  DonutLarge,
  Delete,
  Edit,
} from "@mui/icons-material";
import ActionDialog from "./ActionDialog";

const statusColors = {
  1: { color: "grey", icon: <Adjust sx={{ color: "grey" }} /> },
  2: {
    color: "orange",
    icon: <RotateRight sx={{ color: "orange" }} />,
  },
  3: { color: "green", icon: <CheckCircle sx={{ color: "green" }} /> },
};

function convertDateFormat(dateString) {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function TaskRow({ task, tasks, setTasks }) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { color, icon } = statusColors[task.status] || statusColors[1];

  const handleDelete = async () => {
    const deleteRequest = await fetch(
      `${process.env.REACT_APP_SERVER}/task/delete?publish_id=${task._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const deleteResponse = await deleteRequest.json();

    const updatedTasks = tasks.filter(
      (singleTask) => singleTask._id !== task._id
    );

    setTasks(updatedTasks);
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: "30em" }}>{task.title}</TableCell>
        <TableCell>
          <DonutLarge
            sx={{
              color:
                task.priority === 1
                  ? "red"
                  : task.priority === 2
                  ? "orange"
                  : "grey",
            }}
          />
        </TableCell>
        <TableCell>
          <Grid
            container
            direction="row"
            sx={{
              border: `2px solid ${color}`,
              borderRadius: "8px",
              height: "3em",
            }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item sx={{ paddingLeft: "0.5em" }}>
              {icon}
            </Grid>
            <Grid item sx={{ paddingRight: "0.5em" }}>
              <Typography>
                {task.status === 1
                  ? "TODO"
                  : task.status === 2
                  ? "Progressing"
                  : "Completed"}
              </Typography>
            </Grid>
          </Grid>
        </TableCell>
        <TableCell>
          <Typography>{convertDateFormat(task.createdAt)}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{convertDateFormat(task.dueDate)}</Typography>
        </TableCell>
        <TableCell>
          <Grid container direction="row" justifyContent="space-around">
            <IconButton
              aria-label="toggle description"
              size="small"
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            >
              {isDescriptionOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
            <IconButton
              aria-label="delete task"
              size="small"
              sx={{ color: "red" }}
              onClick={() => handleDelete()}
            >
              <Delete />
            </IconButton>
            <IconButton
              aria-label="edit task"
              size="small"
              sx={{ color: "blue" }}
              onClick={() => setIsDialogOpen(true)}
            >
              <Edit />
            </IconButton>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={isDescriptionOpen} timeout="auto" unmountOnExit>
            <Typography>Description: {task.description}</Typography>
          </Collapse>
        </TableCell>
      </TableRow>
      <ActionDialog
        tasks={tasks}
        actionType="update"
        setTasks={setTasks}
        task={task}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
      />
    </>
  );
}

export default React.memo(TaskRow);
