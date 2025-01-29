import { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function SidebarLayout({ children }) {
  

  return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
  );
}