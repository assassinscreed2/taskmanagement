import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Collapse,
  IconButton,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
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

function TaskRow({ task, tasks, setTasks }) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

  const statusColors = {
    1: { color: "grey", icon: <Adjust sx={{ color: "grey" }} /> },
    2: {
      color: "orange",
      icon: <RotateRight sx={{ color: "orange" }} />,
    },
    3: { color: "green", icon: <CheckCircle sx={{ color: "green" }} /> },
  };

  //function to convert the date format
  function convertDateFormat(dateString) {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const { color, icon } = statusColors[task.status] || statusColors[1];

  // functio to handle delete operation
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
          <div
            title={
              task.priority === 1
                ? "High"
                : task.priority === 2
                ? "Medium"
                : "Low"
            }
          >
            <DonutLarge
              sx={{
                color:
                  task.priority === 1
                    ? "red"
                    : task.priority === 2
                    ? "orange"
                    : "grey",
              }}
              title={
                task.priority === 1
                  ? "High"
                  : task.priority === 2
                  ? "Medium"
                  : "Low"
              }
            />
          </div>
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
            justifyContent={matchesLG ? "center" : "space-between"}
            alignItems="center"
          >
            <Grid item sx={{ paddingLeft: matchesLG ? "0em" : "0.7em" }}>
              {icon}
            </Grid>
            {!matchesLG && (
              <Grid item sx={{ paddingRight: "0.5em" }}>
                <Typography>
                  {task.status === 1
                    ? "TODO"
                    : task.status === 2
                    ? "Progressing"
                    : "Completed"}
                </Typography>
              </Grid>
            )}
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
            <div title="Open Description">
              <IconButton
                aria-label="toggle description"
                size="small"
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              >
                {isDescriptionOpen ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )}
              </IconButton>
            </div>
            <div title="Delete Task">
              <IconButton
                aria-label="delete task"
                size="small"
                sx={{ color: "red" }}
                onClick={() => handleDelete()}
              >
                <Delete />
              </IconButton>
            </div>
            <div title="Edit Task">
              <IconButton
                aria-label="edit task"
                size="small"
                sx={{ color: "blue" }}
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit />
              </IconButton>
            </div>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, maxWidth: "50em" }}
          colSpan={8}
        >
          <Collapse in={isDescriptionOpen} timeout="auto" unmountOnExit>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                padding: "1em 0 1em 0",
              }}
            >
              Description: {task.description}
            </Typography>
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
