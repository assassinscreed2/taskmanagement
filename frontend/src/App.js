import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/tasks" element={<TaskManager />} />
      </Routes>
    </Router>
  );
}
