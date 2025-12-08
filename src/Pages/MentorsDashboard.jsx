import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "../Components/SideBar";
import Dashboard from "../Components/Dashboard";
import TestsHistory from "./TestsHistory";
import AdminPanel from "./AdminPanel";

const MentorsDashboard = () => {
    return (
        <div className="flex">
            <SideBar />

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="TestsHistory" element={<TestsHistory />} />
                    <Route path="AdminPanel" element={<AdminPanel />} />
                </Routes>

            </div>
        </div>
    );
};

export default MentorsDashboard;
