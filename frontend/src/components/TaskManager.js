import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import ActionDialog from "./ActionDialog";
import TaskRow from "./TaskRow";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileBar from "./ProfileBar";

export default function TaskManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("priority");
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState();
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleSort = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (isIncreasing) {
        return a[sortCriteria] > b[sortCriteria] ? 1 : -1;
      } else {
        return a[sortCriteria] < b[sortCriteria] ? 1 : -1;
      }
    });

    setTasks(sortedTasks);
  };

  const handleHeaderClick = (criteria) => {
    if (sortCriteria !== criteria) {
      setSortCriteria(criteria);
      setIsIncreasing(false);
    } else {
      setIsIncreasing(!isIncreasing);
    }

    handleSort();
  };

  const emptyTask = {
    title: "",
    description: "",
    priority: 3,
    status: 1,
    createdAt: null,
    dueDate: null,
  };

  // Add sorting logic for tasks based on sortCriteria and isIncreasing

  useEffect(() => {
    async function fetchTasks() {
      const taskRequest = await fetch(`${process.env.REACT_SERVER}/task`, {
        method: "GET",
        credentials: "include",
      });
      const taskResponse = await taskRequest.json();
      setTasks(taskResponse.tasks);
    }

    async function checkAuthentication() {
      const request = await fetch(`${process.env.REACT_SERVER}/validate`, {
        method: "GET",
        credentials: "include",
      });

      if (request.status !== 200) {
        navigate("/login");
        return;
      }

      setIsAuthenticated(true);

      fetchTasks();
    }

    checkAuthentication();
  }, []);

  return (
    <>
      {isAuthenticated && state && (
        <>
          <ProfileBar profile={state} />
          <TableContainer sx={{ maxWidth: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography>Title</Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      disableRipple
                      startIcon={
                        sortCriteria === "priority" ? (
                          isIncreasing ? (
                            <KeyboardDoubleArrowDown />
                          ) : (
                            <KeyboardDoubleArrowUp />
                          )
                        ) : null
                      }
                      onClick={() => handleHeaderClick("priority")}
                    >
                      Priority
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disableRipple
                      startIcon={
                        sortCriteria === "status" ? (
                          isIncreasing ? (
                            <KeyboardDoubleArrowDown />
                          ) : (
                            <KeyboardDoubleArrowUp />
                          )
                        ) : null
                      }
                      onClick={() => handleHeaderClick("status")}
                    >
                      Status
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disableRipple
                      startIcon={
                        sortCriteria === "createdAt" ? (
                          isIncreasing ? (
                            <KeyboardDoubleArrowDown />
                          ) : (
                            <KeyboardDoubleArrowUp />
                          )
                        ) : null
                      }
                      onClick={() => handleHeaderClick("createdAt")}
                    >
                      Created At
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disableRipple
                      startIcon={
                        sortCriteria === "dueDate" ? (
                          isIncreasing ? (
                            <KeyboardDoubleArrowDown />
                          ) : (
                            <KeyboardDoubleArrowUp />
                          )
                        ) : null
                      }
                      onClick={() => handleHeaderClick("dueDate")}
                    >
                      Due Date
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Typography>Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks &&
                  tasks.map((task, index) => (
                    <TaskRow
                      key={index}
                      task={task}
                      tasks={tasks}
                      setTasks={setTasks}
                    />
                  ))}
              </TableBody>
            </Table>
            <Button
              sx={{ width: "100%", height: "5em", border: "3px dotted grey" }}
              onClick={() => setIsDialogOpen(true)}
              aria-label="Create Task"
            >
              Create Task
            </Button>
          </TableContainer>
          <ActionDialog
            actionType="create"
            task={emptyTask}
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
            setTasks={setTasks}
            tasks={tasks}
          />
        </>
      )}
    </>
  );
}
