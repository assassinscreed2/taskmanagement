import { useState } from "react";
import dayjs from "dayjs";
import React from "react";
import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function ActionDialog({
  actionType,
  task,
  open,
  setOpen,
  setTasks,
  tasks,
}) {
  const [newTask, setNewTask] = useState(task);
  const [errorMessage, setErrorMessage] = useState("");
  const MAX_TITLE_CHARS = 50;
  const MAX_DESCRIPTION_CHARS = 300;

  // function to handler changes in input
  const handleChange = (eventType, value) => {
    const tempTask = { ...newTask };

    if (eventType === "title" && value.length > MAX_TITLE_CHARS) {
      value = value.substring(0, MAX_TITLE_CHARS);
    }

    if (eventType === "description" && value.length > MAX_DESCRIPTION_CHARS) {
      value = value.substring(0, MAX_DESCRIPTION_CHARS);
    }

    if (eventType === "priority") {
      if (value === "High") {
        tempTask[eventType] = 1;
      } else if (value === "Medium") {
        tempTask[eventType] = 2;
      } else {
        tempTask[eventType] = 3;
      }
    } else if (eventType === "status") {
      if (value === "TODO") {
        tempTask[eventType] = 1;
      } else if (value === "Progressing") {
        tempTask[eventType] = 2;
      } else {
        tempTask[eventType] = 3;
      }
    } else {
      tempTask[eventType] = value;
    }

    setNewTask(tempTask);
    setErrorMessage(""); // Clear error message when valid input is entered
  };

  const handleClose = () => {
    setNewTask(task);
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (
      newTask.title.length === 0 ||
      newTask.description.length === 0 ||
      newTask.priority === 0 ||
      newTask.status === 0 ||
      !newTask.dueDate
    ) {
      setErrorMessage("Fill all required fields");
      return;
    }

    if (actionType === "update") {
      const updateRequest = await fetch(
        `${process.env.REACT_APP_SERVER}/task/update?publish_id=${task._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newTask),
        }
      );
      const updatedTaskResponse = await updateRequest.json();
      const updatedTasks = tasks.map((singleTask) => {
        if (singleTask._id === task._id) {
          return { ...singleTask, ...updatedTaskResponse };
        }
        return singleTask;
      });
      setTasks(updatedTasks);
    }

    if (actionType === "create") {
      newTask["createdAt"] = Date.now();
      const createRequest = await fetch(
        `${process.env.REACT_APP_SERVER}/task/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newTask),
        }
      );

      const createResponse = await createRequest.json();
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      setNewTask(task);
    }

    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setErrorMessage("");
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {actionType === "update" ? "Edit Task" : "Create Task"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please make sure to fill all the fields. Description is not
            required, but providing a description is a good idea.
          </DialogContentText>
          <Grid container direction="column">
            <Grid item>
              <TextField
                required
                name="title"
                label="Title"
                fullWidth
                defaultValue={actionType === "update" ? task.title : ""}
                onChange={(e) => {
                  handleChange("title", e.target.value);
                }}
                variant="standard"
                inputProps={{ maxLength: MAX_TITLE_CHARS }}
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ minWidth: "100%", marginTop: "2em" }}
                label="Description"
                name="description"
                required
                defaultValue={actionType === "update" ? task.description : ""}
                onChange={(e) => {
                  handleChange("description", e.target.value);
                }}
                multiline
                rows={4}
                inputProps={{ maxLength: MAX_DESCRIPTION_CHARS }}
              />
            </Grid>
            <Grid item container direction="row">
              <Grid item container direction="column" sm>
                <Grid item sx={{ marginTop: "0.5em" }}>
                  <FormControl
                    required
                    sx={{ m: 1, width: "80%" }}
                    size="small"
                  >
                    <InputLabel id="select-small-label">Priority</InputLabel>
                    <Select
                      labelId="select-small-label"
                      id="select-small"
                      defaultValue={
                        actionType === "update"
                          ? task.priority === 1
                            ? "High"
                            : task.priority === 2
                            ? "Medium"
                            : "Low"
                          : "Low"
                      }
                      label="Priority"
                      sx={{ height: "3.5em" }}
                      onChange={(e) => handleChange("priority", e.target.value)}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    required
                    sx={{ m: 1, width: "80%" }}
                    size="small"
                  >
                    <InputLabel id="select-small-status">Status</InputLabel>
                    <Select
                      labelId="select-small-status"
                      id="select-small-status"
                      defaultValue={
                        actionType === "update"
                          ? task.status === 1
                            ? "TODO"
                            : task.status === 2
                            ? "Progressing"
                            : "Completed"
                          : "TODO"
                      }
                      label="Status"
                      sx={{ height: "3.5em" }}
                      onChange={(e) => {
                        handleChange("status", e.target.value);
                      }}
                    >
                      <MenuItem value="TODO">TODO</MenuItem>
                      <MenuItem value="Progressing">Progressing</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item container direction="column" sm>
                <Grid item sx={{ marginTop: "1em" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      defaultValue={dayjs(task.dueDate)}
                      disablePast
                      label="Due Date"
                      name="startDate"
                      onChange={(value) =>
                        handleChange("dueDate", new String(value))
                      }
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!errorMessage}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={errorMessage}
        key={"bottom" + "center"}
      />
    </>
  );
}
