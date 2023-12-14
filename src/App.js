import "./App.css";
import { Route, Routes, Link } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import AppointmentBooking from "./components/AppointmentBooking";
import Indicators from "./components/Indicators";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/appointment-booking" element={<AppointmentBooking />} />
        <Route path="/indicators" element={<Indicators />} />
      </Routes>
    </>
  );
}

export default App;
