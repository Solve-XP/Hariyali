
import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import "./MainLayout.css";

import Sidebar
from "../components/Sidebar";

import Topbar
from "../components/Topbar";

import ToastStack
from "../components/ToastStack";

import Footer
from "../components/Footer";

export default function MainLayout() {

  const [
    open,
    setOpen,
  ] = useState(
    false
  );

  return (

    <div
      className={`
        app-shell
        ${
          open
            ? " app-shell--open"
            : ""
        }
      `}
    >

      {/* OVERLAY */}

      <div
        className="
          sidebar-overlay
        "
        onClick={() =>
          setOpen(
            false
          )
        }
      />

      {/* SIDEBAR */}

      <aside className="
        app-shell__sidebar
      ">

        <Sidebar
          onNavigate={() =>
            setOpen(
              false
            )
          }
        />

      </aside>

      {/* TOPBAR */}

      <header className="
        app-shell__topbar
      ">

        <Topbar
          onMenuClick={() =>
            setOpen(
              (
                o
              ) => !o
            )
          }
        />

      </header>

      {/* MAIN */}

      <main className="
        app-shell__main
      ">

        <div className="
          app-shell__page
        ">

          <Outlet />

        </div>

        <Footer />

      </main>

      {/* TOAST */}

      <ToastStack />

    </div>
  );
}
