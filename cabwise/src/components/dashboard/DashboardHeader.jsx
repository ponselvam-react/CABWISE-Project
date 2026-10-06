import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function DashboardHeader() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {

    const storedUser = localStorage.getItem("cabwiseUser");

    if (!storedUser) {
      console.error("User not found in local storage");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    console.log("Dashboard header current user:", currentUser);

    setUser(currentUser);

  }, []);

  useEffect(() => {

    const storedUser = localStorage.getItem("cabwiseUser");

    if (!storedUser) {
      console.error("User not found in local storage");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    fetch(
      `http://localhost:3000/issues?userId=${currentUser.id}`
    )
      .then((response) => response.json())
      .then((data) => {

        console.log(
          "Dashboard header notifications:",
          data
        );

        const openIssues = data.filter(
          (issue) => issue.status === "Open"
        );

        setNotificationCount(openIssues.length);

      })
      .catch((error) => {

        console.error(
          "Notification count API error:",
          error
        );

      });

  }, [location.pathname]);

  const pageDetails = {
    "/dashboard": {
      section: "Fleet Operations",
      title: "Overview"
    },
    "/vehicles": {
      section: "Fleet Management",
      title: "Vehicles"
    }
  };

  const currentPage =
    pageDetails[location.pathname] || pageDetails["/dashboard"];

  return (
    <header className="dashboard-header">

      <div className="dashboard-header-left">

        <button
          className="mobile-menu-button"
          type="button"
        >
          ☰
        </button>

        <div>
          <p className="dashboard-breadcrumb">
            {currentPage.section}
          </p>

          <h1>{currentPage.title}</h1>
        </div>

      </div>


      <div className="dashboard-header-right">

        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          🔔

          {notificationCount > 0 && (
            <span className="notification-badge">
              {notificationCount}
            </span>
          )}
        </button>

        <div
          className="dashboard-profile"
          onClick={() => navigate("/profile")}
        >

          <div className="profile-avatar">
            {user?.full_name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="profile-details">
            <strong>{user?.full_name || "Loading..."}</strong>
            <span>{user?.account_type || "Loading..."}</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default DashboardHeader;