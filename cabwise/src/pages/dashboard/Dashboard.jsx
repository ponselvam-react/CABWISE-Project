import { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [issues, setIssues] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            setError("User not found. Please login again.");
            setLoading(false);
            return;
        }

        const currentUser = JSON.parse(storedUser);

        console.log("Dashboard current user:", currentUser);

        setUser(currentUser);

        const loadDashboardData = async () => {
            try {
                const [
                    vehiclesResponse,
                    issuesResponse,
                    maintenanceResponse
                ] = await Promise.all([
                    fetch(
                        `http://localhost:3000/vehicles?userId=${currentUser.id}`
                    ),
                    fetch(
                        `http://localhost:3000/issues?userId=${currentUser.id}`
                    ),
                    fetch(
                        `http://localhost:3000/maintenance?userId=${currentUser.id}`
                    )
                ]);

                const vehiclesData = await vehiclesResponse.json();
                const issuesData = await issuesResponse.json();
                const maintenanceData = await maintenanceResponse.json();

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

                if (!maintenanceResponse.ok) {
                    throw new Error(
                        maintenanceData.error || "Unable to load maintenance"
                    );
                }

                console.log("Dashboard vehicles:", vehiclesData);
                console.log("Dashboard issues:", issuesData);

                const formattedVehicles = vehiclesData.map((vehicle) => ({
                    id: vehicle.id,
                    registrationNumber: vehicle.registration_number,
                    model: vehicle.model,
                    driver: vehicle.driver,
                    odometer: vehicle.odometer,
                    status: vehicle.status,
                    maintenance: vehicle.maintenance,
                    maintenanceType: vehicle.maintenance_type
                }));

                const formattedIssues = issuesData.map((issue) => ({
                    id: issue.id,
                    vehicleId: issue.vehicle_id,
                    driverId: issue.driver_id,
                    title: issue.title,
                    description: issue.description,
                    category: issue.category,
                    priority: issue.priority,
                    status: issue.status,
                    reportedDate: issue.created_at
                        ? issue.created_at.split("T")[0]
                        : ""
                }));

                const formattedMaintenance = maintenanceData.map((record) => ({
                    id: record.id,
                    vehicleId: record.vehicle_id,
                    serviceType: record.service_type,
                    lastServiceOdometer: record.last_service_odometer,
                    currentOdometer: record.current_odometer,
                    serviceInterval: record.service_interval,
                    workflowStatus: record.workflow_status,
                    scheduledDate: record.scheduled_date,
                    notes: record.notes
                }));

                setVehicles(formattedVehicles);
                setIssues(formattedIssues);
                setMaintenance(formattedMaintenance);
            } catch (error) {
                console.error("Dashboard data error:", error);
                setError("Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const navigate = useNavigate();
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(
        (vehicle) => vehicle.status === "Available"
    ).length;
    const onTripVehicles = vehicles.filter(
        (vehicle) => vehicle.status === "On Trip"
    ).length;
    const maintenanceVehicles = vehicles.filter(
        (vehicle) => vehicle.status === "Maintenance"
    ).length;
    const totalIssues = issues.length;
    const availablePercentage =
        totalVehicles > 0
            ? Math.round((availableVehicles / totalVehicles) * 100)
            : 0;

    const onTripPercentage =
        totalVehicles > 0
            ? Math.round((onTripVehicles / totalVehicles) * 100)
            : 0;

    const maintenancePercentage =
        totalVehicles > 0
            ? Math.round((maintenanceVehicles / totalVehicles) * 100)
            : 0;
    const maintenanceDue = maintenance.length;
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-main">
                <DashboardHeader />

                <div className="dashboard-content">

                    {error && (
                        <div className="dashboard-error">
                            {error}
                        </div>
                    )}
                    {loading && !error && (
                        <div className="dashboard-loading">
                            Loading dashboard data...
                        </div>
                    )}

                    {/* INTRODUCTION */}
                    <section className="dashboard-introduction" id="overview">
                        <div>
                            <p className="dashboard-eyebrow">FLEET OVERVIEW</p>

                            <h2>
                                Good morning, {user?.full_name || "Fleet Owner"}.
                            </h2>
                            <p>
                                Here's what's happening across your fleet today.
                            </p>
                        </div>
                    </section>


                    {/* OVERVIEW CARDS */}
                    <section className="overview-cards">

                        <div className="overview-card">
                            <div className="overview-card-top">
                                <span className="overview-card-label">
                                    Total Vehicles
                                </span>

                                <span className="overview-card-icon">
                                    ▣
                                </span>
                            </div>

                            <strong>{totalVehicles}</strong>
                            <p>Vehicles registered</p>
                        </div>


                        <div className="overview-card">
                            <div className="overview-card-top">
                                <span className="overview-card-label">
                                    Available
                                </span>

                                <span className="overview-card-icon">
                                    ✓
                                </span>
                            </div>

                            <strong>{availableVehicles}</strong>
                            <p>Ready for operation</p>
                        </div>


                        <div className="overview-card">
                            <div className="overview-card-top">
                                <span className="overview-card-label">
                                    Total Issues
                                </span>

                                <span className="overview-card-icon warning">
                                    !
                                </span>
                            </div>

                            <strong>{totalIssues}</strong>
                            <p>
                                {issues.filter((issue) => issue.status === "Open").length} open issues
                            </p>                        </div>


                        <div className="overview-card">
                            <div className="overview-card-top">
                                <span className="overview-card-label">
                                    Maintenance Due
                                </span>

                                <span className="overview-card-icon">
                                    ⚙
                                </span>
                            </div>

                            <strong>{maintenanceDue}</strong>
                            <p>Upcoming maintenance</p>
                        </div>

                    </section>


                    {/* FLEET STATUS */}
                    <section className="dashboard-section" id="vehicles">

                        <div className="dashboard-section-header">
                            <div>
                                <p className="dashboard-section-eyebrow">
                                    LIVE FLEET STATUS
                                </p>

                                <h3>Vehicle Operations</h3>

                                <p>
                                    Monitor the current operational state of your vehicles.
                                </p>
                            </div>

                            <button
                                className="dashboard-section-action"
                                type="button"
                                onClick={() => navigate("/vehicles")}
                            >                                View all vehicles
                            </button>
                        </div>


                        <div className="fleet-status-grid">

                            {/* AVAILABLE */}
                            <div className="fleet-status-card">

                                <div className="fleet-status-top">
                                    <div className="fleet-status-icon available">
                                        ✓
                                    </div>

                                    <span className="fleet-status-badge available">
                                        Operational
                                    </span>
                                </div>

                                <strong>{availableVehicles}</strong>

                                <h4>Available</h4>

                                <p>
                                    Vehicles ready for scheduled operations.
                                </p>

                                <div className="fleet-progress">
                                    <div
                                        className="fleet-progress-bar available"
                                        style={{ width: `${availablePercentage}%` }}                                    ></div>
                                </div>

                                <span className="fleet-progress-label">
                                    {availablePercentage}% of total fleet                                </span>

                            </div>


                            {/* ON TRIP */}
                            <div className="fleet-status-card">

                                <div className="fleet-status-top">
                                    <div className="fleet-status-icon on-trip">
                                        →
                                    </div>

                                    <span className="fleet-status-badge on-trip">
                                        In operation
                                    </span>
                                </div>

                                <strong>{onTripVehicles}</strong>
                                <h4>On Trip</h4>

                                <p>
                                    Vehicles currently assigned to active trips.
                                </p>

                                <div className="fleet-progress">
                                    <div
                                        className="fleet-progress-bar on-trip"
                                        style={{ width: `${onTripPercentage}%` }}                                    ></div>
                                </div>

                                <span className="fleet-progress-label">
                                    {onTripPercentage}% of total fleet                                </span>

                            </div>


                            {/* MAINTENANCE */}
                            <div className="fleet-status-card">

                                <div className="fleet-status-top">
                                    <div className="fleet-status-icon maintenance">
                                        ⚙
                                    </div>

                                    <span className="fleet-status-badge maintenance">
                                        Service
                                    </span>
                                </div>

                                <strong>{maintenanceVehicles}</strong>
                                <h4>Maintenance</h4>

                                <p>
                                    Vehicles currently unavailable for service.
                                </p>

                                <div className="fleet-progress">
                                    <div
                                        className="fleet-progress-bar maintenance"
                                        style={{ width: `${maintenancePercentage}%` }}
                                    ></div>
                                </div>

                                <span className="fleet-progress-label">
                                    {maintenancePercentage}% of total fleet
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ATTENTION REQUIRED */}
                    <section className="dashboard-section" id="issues">

                        <div className="dashboard-section-header">

                            <div>
                                <p className="dashboard-section-eyebrow">
                                    ISSUE CENTER
                                </p>

                                <h3>Recent Issues</h3>

                                <p>
                                    Review the latest issues reported across your fleet.
                                </p>
                            </div>

                            <button
                                className="dashboard-section-action"
                                type="button"
                                onClick={() => navigate("/issues")}
                            >
                                View all issues
                            </button>

                        </div>


                        <div className="attention-list">

                            {issues.length === 0 ? (
                                <div className="dashboard-empty">
                                    No issues reported yet.
                                </div>
                            ) : (
                                [...issues]
                                    .sort((a, b) => b.id - a.id)
                                    .slice(0, 5)
                                    .map((issue) => {

                                        const vehicle = vehicles.find(
                                            (vehicle) => vehicle.id === issue.vehicleId
                                        );

                                        return (
                                            <div
                                                className="attention-item"
                                                key={issue.id}
                                            >

                                                <div className="attention-item-left">

                                                    <div
                                                        className={`attention-vehicle-icon ${issue.priority === "Medium"
                                                            ? "warning"
                                                            : ""
                                                            }`}
                                                    >
                                                        !
                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {vehicle?.registrationNumber}
                                                        </strong>

                                                        <p>
                                                            {issue.description}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="attention-item-right">

                                                    <span
                                                        className={`attention-priority ${issue.priority === "High"
                                                            ? "high"
                                                            : issue.priority === "Medium"
                                                                ? "medium"
                                                                : "low"
                                                            }`}
                                                    >
                                                        {issue.priority} priority
                                                    </span>

                                                    <span className="attention-time">
                                                        {issue.reportedDate}
                                                    </span>

                                                </div>

                                            </div>
                                        );

                                    })
                            )}
                        </div>

                    </section>

                    {/* MAINTENANCE OVERVIEW */}
                    <section className="dashboard-section" id="maintenance">

                        <div className="dashboard-section-header">
                            <div>
                                <p className="dashboard-section-eyebrow">
                                    MAINTENANCE OVERVIEW
                                </p>

                                <h3>Upcoming Maintenance</h3>

                                <p>
                                    Keep track of vehicles approaching their next service point.
                                </p>
                            </div>

                            <button
                                className="dashboard-section-action"
                                type="button"
                                onClick={() => navigate("/maintenance")}
                            >
                                View maintenance
                            </button>
                        </div>


                        <div className="maintenance-table-wrapper">

                            <div className="maintenance-table">

                                {/* TABLE HEADER */}
                                <div className="maintenance-row maintenance-header">
                                    <span>Vehicle</span>
                                    <span>Maintenance</span>
                                    <span>Odometer</span>
                                    <span>Due</span>
                                </div>

                                <div className="maintenance-table-body">

                                    {maintenance.length === 0 ? (
                                        <div className="dashboard-empty">
                                            No upcoming maintenance.
                                        </div>
                                    ) : (
                                        maintenance
                                            .slice(0, 4)
                                            .map((record) => {

                                                const vehicle = vehicles.find(
                                                    (vehicle) => vehicle.id === record.vehicleId
                                                );

                                                return (
                                                    <div
                                                        className="maintenance-row"
                                                        key={record.id}
                                                    >

                                                        <div>
                                                            <strong>
                                                                {vehicle?.registrationNumber || "Vehicle"}
                                                            </strong>

                                                            <span>
                                                                {vehicle?.model || ""}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                {record.serviceType}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                {record.currentOdometer} km
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span className="maintenance-status upcoming">
                                                                {record.workflowStatus}
                                                            </span>
                                                        </div>

                                                    </div>
                                                );

                                            })
                                    )}

                                </div>

                            </div>
                        </div>
                    </section>

                    {/* RECENT FLEET ACTIVITY */}
                    <section className="dashboard-section" id="activity">

                        <div className="dashboard-section-header">
                            <div>
                                <p className="dashboard-section-eyebrow">
                                    RECENT ACTIVITY
                                </p>

                                <h3>Fleet Activity</h3>

                                <p>
                                    A recent view of important events across your fleet.
                                </p>
                            </div>
                        </div>


                        <div className="activity-card">

                            <div className="activity-table-wrapper">

                                <div className="activity-table">

                                    {/* TABLE HEADER */}
                                    <div className="activity-row activity-header">
                                        <span>Activity</span>
                                        <span>Vehicle</span>
                                        <span>Issue</span>
                                        <span>Status</span>
                                        <span>Date</span>
                                    </div>

                                    {issues.length === 0 ? (
                                        <div className="dashboard-empty">
                                            No recent fleet activity.
                                        </div>
                                    ) : (
                                        [...issues]
                                            .sort((a, b) => b.id - a.id)
                                            .slice(0, 4)
                                            .map((issue) => {

                                                const vehicle = vehicles.find(
                                                    (vehicle) => vehicle.id === issue.vehicleId
                                                );

                                                return (
                                                    <div
                                                        className="activity-row"
                                                        key={issue.id}
                                                    >

                                                        <div>
                                                            <strong>
                                                                {issue.status === "Resolved"
                                                                    ? "Issue Resolved"
                                                                    : issue.status === "Acknowledged"
                                                                        ? "Issue Acknowledged"
                                                                        : "Vehicle Issue"}
                                                            </strong>

                                                            <span>
                                                                {issue.status === "Resolved"
                                                                    ? "Completed"
                                                                    : issue.status === "Acknowledged"
                                                                        ? "Reviewed"
                                                                        : "Reported"}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {vehicle?.registrationNumber}
                                                            </strong>
                                                            <span>
                                                                {vehicle?.model}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                {issue.title}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span
                                                                className={`activity-status ${issue.status.toLowerCase()}`}
                                                            >
                                                                {issue.status}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span>{issue.reportedDate}</span>
                                                        </div>

                                                    </div>
                                                );
                                            })
                                    )}
                                </div>

                            </div>

                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;