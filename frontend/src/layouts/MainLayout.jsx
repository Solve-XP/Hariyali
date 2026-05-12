import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ToastStack from "../components/ToastStack";

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`app-shell${open ? " app-shell--open" : ""}`}>
      <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      <div className="app-shell__sidebar">
        <Sidebar onNavigate={() => setOpen(false)} />
      </div>
      <header className="app-shell__topbar">
        <Topbar onMenuClick={() => setOpen((o) => !o)} />
      </header>
      <main className="app-shell__main">
        <Outlet />
      </main>
      <ToastStack />
    </div>
  );
}
