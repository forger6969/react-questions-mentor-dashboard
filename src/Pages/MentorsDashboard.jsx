import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "../Components/SideBar";
import Dashboard from "../Components/Dashboard";
import TestsHistory from "./TestsHistory";

const MentorsDashboard = () => {
    return (
        <div className="flex bg-gray-100">
            <SideBar />

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="TestsHistory" element={<TestsHistory />} />
                </Routes>

            </div>
        </div>
    );
};

export default MentorsDashboard;
