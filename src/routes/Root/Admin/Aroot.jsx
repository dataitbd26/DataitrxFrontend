// src/layouts/ARoot.js

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "../../../components/Header";
import useThemeMode from "../../../Hook/useThemeMode"; 

const ARoot = () => {

  const { mode } = useThemeMode(); 

  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // EFFECT: Handle window resizing to show/hide sidebar automatically
  useEffect(() => {
    const handleResize = () => {
      // Open on desktop, close on mobile
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // 💡 Define theme-dependent classes for the main wrapper
  // We use the dark: prefix to leverage tailwind's class-based dark mode
  const mainWrapperClasses = `
    ${mode === 'dark' ? 'dark' : ''}
    flex h-screen transition-colors duration-300
    bg-concrete dark:bg-casual-black font-primary text-casual-black dark:text-concrete
  `;

  const contentMainClasses = `
    flex-1 flex flex-col overflow-hidden transition-all duration-300
    ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}
  `;
  
  // 💡 Apply the theme classes to the top-level div
  return (
    <div className={mainWrapperClasses}>
      {/* Sidebar is now passed the 'mode' for internal styling */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        mode={mode} // 💡 Pass mode to the Sidebar
      />

      <div className={contentMainClasses}>
 
        <Header 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* The main content area also needs theme-dependent styling */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 transition-colors duration-300 bg-concrete dark:bg-casual-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ARoot;