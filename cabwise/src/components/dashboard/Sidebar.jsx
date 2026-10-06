import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mobile-sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "×" : "☰"}
      </button>

      <aside
        className={`dashboard-sidebar ${isSidebarOpen ? "sidebar-open" : ""
          }`}
      >

        <div className="dashboard-brand">
          <div className="brand-mark">C</div>
          <span>CABWISE</span>
        </div>


        <nav className="sidebar-navigation">

          <p className="sidebar-label">
            MAIN MENU
          </p>


          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-icon">◉</span>
            <span>Overview</span>
          </NavLink>


          <NavLink
            to="/vehicles"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-icon">▣</span>
            <span>Vehicles</span>
          </NavLink>


          <NavLink
            to="/maintenance"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-icon">⚙</span>
            <span>Maintenance</span>
          </NavLink>


          <NavLink
            to="/drivers"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-icon">◉</span>
            <span>Drivers</span>
          </NavLink>


          <NavLink
            to="/issues"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-icon">!</span>
            <span>Issues</span>
          </NavLink>


          <p className="sidebar-label sidebar-label-space">
            MANAGEMENT
          </p>


          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-icon">▤</span>
            <span>Reports</span>
          </NavLink>

        </nav>


        <div className="sidebar-bottom">

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-icon">⚙</span>
            <span>Settings</span>
          </NavLink>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;