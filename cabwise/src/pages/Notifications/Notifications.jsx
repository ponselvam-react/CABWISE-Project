import { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { calculateMaintenance } from "../../utils/maintenance";

function Notifications() {

    const [issues, setIssues] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [maintenance, setMaintenance] = useState([]);

    const issueNotifications = issues
        .filter((issue) => issue.status === "Open")
        .map((issue) => {
            const vehicle = vehicles.find(
                (vehicle) => vehicle.id === issue.vehicle_id
            );

            return {
                id: `issue-${issue.id}`,
                title:
                    issue.priority === "High"
                        ? "High Priority Issue Reported"
                        : "Vehicle Issue Reported",
                message: `${issue.title} reported for ${vehicle?.registration_number || "vehicle"
                    }.`,
                type:
                    issue.priority === "High"
                        ? "danger"
                        : issue.priority === "Medium"
                            ? "warning"
                            : "info",
                time: issue.status
            };
        });

    const maintenanceNotifications = maintenance
        .map((record) => {

            const vehicle = vehicles.find(
                (vehicle) => vehicle.id === record.vehicle_id
            );

            const calculation = calculateMaintenance({
                vehicleId: record.vehicle_id,
                lastServiceOdometer: record.last_service_odometer,
                currentOdometer: record.current_odometer,
                serviceInterval: record.service_interval,
                workflowStatus: record.workflow_status
            });

            return {
                record,
                vehicle,
                calculation
            };

        })
        .filter(
            ({ calculation }) =>
                calculation.status === "Attention" ||
                calculation.status === "Overdue"
        )
        .map(({ record, vehicle, calculation }) => ({
            id: `maintenance-${record.id}`,

            title:
                calculation.status === "Overdue"
                    ? "Maintenance Overdue"
                    : "Maintenance Attention Required",

            message:
                calculation.status === "Overdue"
                    ? `${vehicle?.registration_number || "Vehicle"} is overdue for ${record.service_type}.`
                    : `${vehicle?.registration_number || "Vehicle"} requires maintenance attention for ${record.service_type}.`,

            type:
                calculation.status === "Overdue"
                    ? "danger"
                    : "warning",

            time: calculation.status
        }));

    const notifications = [
        ...maintenanceNotifications,
        ...issueNotifications
    ];
    useEffect(() => {
        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        console.log("Notifications current user:", currentUser);

        fetch(
            `http://localhost:3000/issues?userId=${currentUser.id}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Notifications issues:", data);
                setIssues(data);
            })
            .catch((error) => {
                console.error(
                    "Notifications issue API error:",
                    error
                );
            });
    }, []);
    useEffect(() => {

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        fetch(
            `http://localhost:3000/vehicles?userId=${currentUser.id}`
        )
            .then((response) => response.json())
            .then((data) => {

                console.log(
                    "Notifications vehicles:",
                    data
                );

                setVehicles(data);

            })
            .catch((error) => {

                console.error(
                    "Notifications vehicle API error:",
                    error
                );

            });

    }, []);

    useEffect(() => {

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        fetch(
            `http://localhost:3000/maintenance?userId=${currentUser.id}`
        )
            .then((response) => response.json())
            .then((data) => {

                console.log(
                    "Notifications maintenance:",
                    data
                );

                setMaintenance(data);

            })
            .catch((error) => {

                console.error(
                    "Notifications maintenance API error:",
                    error
                );

            });

    }, []);
    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">

                <DashboardHeader
                    title="Notifications"
                    subtitle="Stay updated with important fleet activities and alerts."
                />

                <section className="dashboard-section">

                    <div className="dashboard-section-header">
                        <div>
                            <p className="dashboard-section-eyebrow">
                                FLEET ALERTS
                            </p>

                            <div className="notifications-title-row">
                                <h3>Recent Notifications</h3>
                            </div>
                            <p>
                                Review important updates and alerts across your fleet.
                            </p>
                        </div>
                    </div>

                    <div className="notifications-list">

                        <div className="notifications-list">

                            {notifications.length === 0 ? (
                                <div className="notifications-empty">
                                    <div className="notifications-empty-icon">
                                        🔔
                                    </div>

                                    <h4>No notifications yet</h4>

                                    <p>
                                        You're all caught up. New fleet alerts and updates
                                        will appear here.
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        className={`notification-card ${notification.type}`}
                                        key={notification.id}
                                    >

                                        <div className="notification-indicator"></div>

                                        <div className="notification-content">

                                            <div className="notification-top">
                                                <h4>{notification.title}</h4>

                                                <span className="notification-time">
                                                    {notification.time}
                                                </span>
                                            </div>

                                            <p>
                                                {notification.message}
                                            </p>

                                        </div>

                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Notifications;