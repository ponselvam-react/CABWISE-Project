import { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

function Reports() {
    const [vehicles, setVehicles] = useState([]);
    const [issues, setIssues] = useState([]);
    useEffect(() => {
        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        console.log("Reports current user:", currentUser);

        const loadReportsData = async () => {
            try {
                const [vehiclesResponse, issuesResponse] = await Promise.all([
                    fetch(
                        `http://localhost:3000/vehicles?userId=${currentUser.id}`
                    ),
                    fetch(
                        `http://localhost:3000/issues?userId=${currentUser.id}`
                    )
                ]);

                const vehiclesData = await vehiclesResponse.json();
                const issuesData = await issuesResponse.json();

                if (!vehiclesResponse.ok) {
                    throw new Error(
                        vehiclesData.error || "Unable to load vehicles"
                    );
                }

                if (!issuesResponse.ok) {
                    throw new Error(
                        issuesData.error || "Unable to load issues"
                    );
                }

                console.log("Reports vehicles:", vehiclesData);
                console.log("Reports issues:", issuesData);

                setVehicles(vehiclesData);
                setIssues(issuesData);
            } catch (error) {
                console.error("Reports data API error:", error);
            }
        };

        loadReportsData();
    }, []);
    const totalVehicles = vehicles.length;

    const totalIssues = issues.length;

    const resolvedIssues = issues.filter(
        (issue) => issue.status === "Resolved"
    ).length;

    const maintenanceDue = vehicles.filter(
        (vehicle) =>
            vehicle.maintenance_type === "attention" ||
            vehicle.status === "Maintenance"
    ).length;
    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">

                <DashboardHeader
                    title="Reports"
                    subtitle="Review fleet performance and operational insights."
                />

                <section className="dashboard-section">

                    {/* Fleet Overview Header */}
                    <div className="dashboard-section-header2">
                        <div>
                            <p className="dashboard-section-eyebrow">
                                FLEET REPORTS
                            </p>

                            <h3>Fleet Overview</h3>

                            <p>
                                Monitor important fleet information and
                                operational activity from one place.
                            </p>
                        </div>
                    </div>


                    {/* Summary Cards */}
                    <div className="reports-summary-grid">

                        <div className="report-summary-card">
                            <span>Total Vehicles</span>
                            <strong>{totalVehicles}</strong>
                            <p>Vehicles in fleet</p>
                        </div>

                        <div className="report-summary-card">
                            <span>Total Issues</span>
                            <strong>{totalIssues}</strong>
                            <p>Issues reported</p>
                        </div>

                        <div className="report-summary-card">
                            <span>Resolved Issues</span>
                            <strong>{resolvedIssues}</strong>
                            <p>Issues resolved</p>
                        </div>

                        <div className="report-summary-card">
                            <span>Maintenance Due</span>
                            <strong>{maintenanceDue}</strong>
                            <p>Vehicles need attention</p>
                        </div>

                    </div>


                    {/* Maintenance Report */}
                    <div className="reports-table-section">

                        <div className="dashboard-section-header2">
                            <div>
                                <p className="dashboard-section-eyebrow">
                                    MAINTENANCE REPORT
                                </p>

                                <h3>Vehicle Maintenance Status</h3>

                                <p>
                                    Review current maintenance requirements
                                    across the fleet.
                                </p>
                            </div>
                        </div>


                        {/* Maintenance Table */}
                        <div className="reports-table-wrapper">

                            <div className="reports-table">

                                {/* Table Header */}
                                <div className="reports-table-row reports-table-header">

                                    <span>Vehicle</span>
                                    <span>Model</span>
                                    <span>Odometer</span>
                                    <span>Maintenance</span>
                                    <span>Status</span>

                                </div>


                                {vehicles.map((vehicle) => (
                                    <div
                                        className="reports-table-row"
                                        key={vehicle.id}
                                    >
                                        <div>
                                            <strong>
                                                {vehicle.registration_number}
                                            </strong>
                                        </div>

                                        <span>
                                            {vehicle.model}
                                        </span>

                                        <span>
                                            {vehicle.odometer?.toLocaleString()} km
                                        </span>

                                        <span>
                                            {vehicle.maintenance}
                                        </span>

                                        <span
                                            className={`report-status ${vehicle.maintenance_type}`}
                                        >
                                            {vehicle.maintenance_type === "attention"
                                                ? "Attention"
                                                : vehicle.maintenance_type === "upcoming"
                                                    ? "Upcoming"
                                                    : vehicle.maintenance_type === "scheduled"
                                                        ? "Scheduled"
                                                        : "Normal"}
                                        </span>
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Reports;