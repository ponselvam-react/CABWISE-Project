import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { calculateMaintenance } from "../../utils/maintenance";

function Maintenance() {

    const [vehicles, setVehicles] = useState([]);

    /* =====================================================
       MAINTENANCE RECORD STATE
       ===================================================== */

    const [records, setRecords] = useState([]);
    useEffect(() => {

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        console.log("Maintenance current user:", currentUser);

        fetch(
            `http://localhost:3000/vehicles?userId=${currentUser.id}`
        )
            .then((response) => response.json())
            .then((data) => {

                console.log("Maintenance vehicles:", data);

                const formattedVehicles = data.map((vehicle) => ({
                    id: vehicle.id,
                    registrationNumber: vehicle.registration_number,
                    model: vehicle.model,
                    odometer: vehicle.odometer,
                    status: vehicle.status
                }));

                setVehicles(formattedVehicles);

                fetch(`http://localhost:3000/maintenance?userId=${currentUser.id}`)
                    .then((response) => response.json())
                    .then((data) => {

                        console.log("Maintenance records:", data);

                        const formattedMaintenance = data.map((record) => ({
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

                        setRecords(formattedMaintenance);
                    })
                    .catch((error) => {
                        console.error(
                            "Maintenance API error:",
                            error
                        );
                    });

            })
            .catch((error) => {

                console.error(
                    "Maintenance vehicle API error:",
                    error
                );

            });

    }, []);

    /* =====================================================
       SCHEDULE MAINTENANCE MODAL STATE
       ===================================================== */

    const [showScheduleModal, setShowScheduleModal] = useState(false);

    const [scheduleForm, setScheduleForm] = useState({
        vehicleId: "",
        serviceType: "General Service",
        currentOdometer: "",
        scheduledDate: "",
        notes: ""
    });

    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [editForm, setEditForm] = useState({
        serviceType: "General Service",
        scheduledDate: "",
        notes: ""
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [deletingRecord, setDeletingRecord] = useState(null);

    const [vehicleFilter, setVehicleFilter] = useState("all");

    const [statusFilter, setStatusFilter] = useState("all");

    const [sortBy, setSortBy] = useState("default");

    const [workflowFilter, setWorkflowFilter] = useState("all");

    const [searchTerm, setSearchTerm] = useState("");

    const [historySearchTerm, setHistorySearchTerm] = useState("");

    const [showCompleteModal, setShowCompleteModal] = useState(false);

    const [completingRecord, setCompletingRecord] = useState(null);


    /* =====================================================
       PREPARE MAINTENANCE DATA
       ===================================================== */

    const maintenanceData = useMemo(() => {

    return records
        .filter((record) =>
            vehicles.some(
                (vehicle) => vehicle.id === record.vehicleId
            )
        )
        .map((record) => {

            const vehicle = vehicles.find(
                (vehicle) => vehicle.id === record.vehicleId
            );

            const calculation = calculateMaintenance(record);

            return {
                ...record,
                vehicle,
                ...calculation
            };

        });

}, [records, vehicles]);

    const filteredMaintenanceData = maintenanceData
        .filter((record) => {
            const searchMatches =
                searchTerm.trim() === "" ||
                record.vehicle?.registrationNumber
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                record.vehicle?.model
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                record.serviceType
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const vehicleMatches =
                vehicleFilter === "all" ||
                record.vehicleId === Number(vehicleFilter);

            const statusMatches =
                statusFilter === "all" ||
                record.status === statusFilter;

            const workflowMatches =
                workflowFilter === "all" ||
                record.workflowStatus === workflowFilter;

            return (
                searchMatches &&
                vehicleMatches &&
                statusMatches &&
                workflowMatches
            );
        })
        .sort((a, b) => {
            if (sortBy === "remaining-low") {
                return a.remainingKm - b.remainingKm;
            }

            if (sortBy === "remaining-high") {
                return b.remainingKm - a.remainingKm;
            }

            return 0;
        });

    /* =====================================================
       SUMMARY COUNTS
       ===================================================== */

    const totalRecords = maintenanceData.length;

    const attentionCount = maintenanceData.filter(
        (record) =>
            record.status === "Attention" ||
            record.status === "Overdue"
    ).length;

    const scheduledCount = maintenanceData.filter(
        (record) => record.workflowStatus === "Scheduled"
    ).length;

    const inProgressCount = maintenanceData.filter(
        (record) => record.workflowStatus === "In Progress"
    ).length;

    const completedRecords = maintenanceData.filter(
        (record) => record.workflowStatus === "Completed"
    );

    const filteredCompletedRecords = completedRecords.filter((record) => {
        const search = historySearchTerm.toLowerCase().trim();

        if (!search) {
            return true;
        }

        return (
            record.vehicle?.registrationNumber
                ?.toLowerCase()
                .includes(search) ||
            record.vehicle?.model
                ?.toLowerCase()
                .includes(search) ||
            record.serviceType
                ?.toLowerCase()
                .includes(search)
        );
    });



    /* =====================================================
       FORM INPUT HANDLER
       ===================================================== */

    const handleScheduleInputChange = (event) => {

        const { name, value } = event.target;

        setScheduleForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    /* =====================================================
       SCHEDULE MAINTENANCE
       ===================================================== */

    const handleScheduleMaintenance = async (event) => {

        event.preventDefault();

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        const selectedVehicle = vehicles.find(
            (vehicle) =>
                vehicle.id === Number(scheduleForm.vehicleId)
        );

        if (!selectedVehicle) {
            alert("Please select a vehicle.");
            return;
        }

        const vehicleOdometer = Number(
            String(selectedVehicle.odometer)
                .replace(/,/g, "")
                .replace(" km", "")
        );

        const currentOdometer = Number(
            String(scheduleForm.currentOdometer)
                .replace(/,/g, "")
                .replace(" km", "")
        );

        const maintenanceData = {
            vehicleId: selectedVehicle.id,
            userId: currentUser.id,
            serviceType: scheduleForm.serviceType,
            lastServiceOdometer: vehicleOdometer,
            currentOdometer: currentOdometer,
            serviceInterval: 5000,
            workflowStatus: "Scheduled",
            scheduledDate: scheduleForm.scheduledDate,
            notes:
                scheduleForm.notes ||
                "Scheduled maintenance"
        };

        try {

            const response = await fetch(
                "http://localhost:3000/maintenance",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(maintenanceData)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.error(
                    "Maintenance API error:",
                    data
                );

                alert(
                    data.error ||
                    "Failed to schedule maintenance."
                );

                return;
            }

            console.log(
                "Maintenance created:",
                data
            );

            const newRecord = {
                id: data.maintenanceId,
                vehicleId: selectedVehicle.id,
                serviceType: scheduleForm.serviceType,
                lastServiceOdometer: vehicleOdometer,
                currentOdometer: currentOdometer,
                serviceInterval: 5000,
                workflowStatus: "Scheduled",
                scheduledDate: scheduleForm.scheduledDate,
                notes:
                    scheduleForm.notes ||
                    "Scheduled maintenance"
            };

            setRecords((previous) => [
                ...previous,
                newRecord
            ]);

            setScheduleForm({
                vehicleId: "",
                serviceType: "General Service",
                scheduledDate: "",
                notes: ""
            });

            setShowScheduleModal(false);

        } catch (error) {

            console.error(
                "Schedule maintenance error:",
                error
            );

            alert(
                "Unable to connect to maintenance server."
            );
        }
    };

    const handleStartMaintenance = async (recordId) => {

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        try {

            const response = await fetch(
                `http://localhost:3000/maintenance/${recordId}/start`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: currentUser.id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.error(
                    "Start maintenance API error:",
                    data
                );

                alert(
                    data.error ||
                    "Failed to start maintenance."
                );

                return;
            }

            console.log(
                "Maintenance started:",
                data
            );

            setRecords((previous) =>
                previous.map((record) =>
                    record.id === recordId
                        ? {
                            ...record,
                            workflowStatus: "In Progress"
                        }
                        : record
                )
            );

        } catch (error) {

            console.error(
                "Start maintenance error:",
                error
            );

            alert(
                "Unable to connect to maintenance server."
            );
        }
    };

    const handleCompleteClick = (record) => {
        setCompletingRecord(record);
        setShowCompleteModal(true);
    };

    const handleCompleteMaintenance = async (recordId) => {

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        if (!recordId) {
            alert("Maintenance record not found.");
            return;
        }

        const recordToComplete = records.find(
            (record) => record.id === recordId
        );

        if (!recordToComplete) {
            alert("Maintenance record not found.");
            return;
        }

        const completedOdometer = Number(
            String(recordToComplete.currentOdometer || "")
                .replace(/,/g, "")
                .replace(" km", "")
        );

        if (!completedOdometer) {
            alert("Completed odometer is not available.");
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:3000/maintenance/${recordId}/complete`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: currentUser.id,
                        completedOdometer: completedOdometer
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.error(
                    "Complete maintenance API error:",
                    data
                );

                alert(
                    data.error ||
                    "Failed to complete maintenance."
                );

                return;
            }

            console.log(
                "Maintenance completed:",
                data
            );

            setRecords((previous) =>
                previous.map((record) =>
                    record.id === recordId
                        ? {
                            ...record,
                            workflowStatus: "Completed",
                            currentOdometer: completedOdometer,
                            lastServiceOdometer: completedOdometer
                        }
                        : record
                )
            );

            setShowCompleteModal(false);
            setCompletingRecord(null);

        } catch (error) {

            console.error(
                "Complete maintenance error:",
                error
            );

            alert(
                "Unable to connect to maintenance server."
            );
        }
    };

    const handleViewMaintenance = (record) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleEditMaintenance = (record) => {
        setEditForm({
            serviceType: record.serviceType,
            scheduledDate: record.scheduledDate || "",
            notes: record.notes || ""
        });

        setSelectedRecord(record);
        setShowEditModal(true);
    };

    const handleSaveEditMaintenance = async (event) => {

        event.preventDefault();

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        const maintenanceId = selectedRecord?.id;

        if (!maintenanceId) {
            alert("Maintenance record not found.");
            return;
        }

        const updateData = {
            userId: currentUser.id,
            serviceType: editForm.serviceType,
            scheduledDate: editForm.scheduledDate,
            notes: editForm.notes
        };

        try {

            const response = await fetch(
                `http://localhost:3000/maintenance/${maintenanceId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(updateData)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.error(
                    "Update maintenance API error:",
                    data
                );

                alert(
                    data.error ||
                    "Failed to update maintenance."
                );

                return;
            }

            console.log(
                "Maintenance updated:",
                data
            );

            setRecords((previous) =>
                previous.map((record) =>
                    record.id === maintenanceId
                        ? {
                            ...record,
                            serviceType:
                                editForm.serviceType,
                            scheduledDate:
                                editForm.scheduledDate,
                            notes:
                                editForm.notes
                        }
                        : record
                )
            );

            setShowEditModal(false);

            setSelectedRecord(null);

        } catch (error) {

            console.error(
                "Update maintenance error:",
                error
            );

            alert(
                "Unable to connect to maintenance server."
            );
        }
    };

    const handleDeleteMaintenance = (record) => {
        setDeletingRecord(record);
        setShowDeleteModal(true);
    };

    const handleConfirmDeleteMaintenance = async () => {

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        if (!deletingRecord?.id) {
            alert("Maintenance record not found.");
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:3000/maintenance/${deletingRecord.id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: currentUser.id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.error(
                    "Delete maintenance API error:",
                    data
                );

                alert(
                    data.error ||
                    "Failed to delete maintenance."
                );

                return;
            }

            console.log(
                "Maintenance deleted:",
                data
            );

            setRecords((previousRecords) =>
                previousRecords.filter(
                    (record) =>
                        record.id !== deletingRecord.id
                )
            );

            setShowDeleteModal(false);
            setDeletingRecord(null);

        } catch (error) {

            console.error(
                "Delete maintenance error:",
                error
            );

            alert(
                "Unable to connect to maintenance server."
            );
        }
    };

    /* =====================================================
       PAGE
       ===================================================== */

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">

                <DashboardHeader />

                <section className="maintenance-page">

                    {/* PAGE HEADER */}

                    <div className="maintenance-page-header">

                        <div>

                            <p className="page-eyebrow">
                                FLEET MANAGEMENT
                            </p>

                            <h2>
                                Maintenance
                            </h2>

                            <p>
                                Monitor vehicle maintenance and upcoming
                                service requirements.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="maintenance-primary-button"
                            onClick={() =>
                                setShowScheduleModal(true)
                            }
                        >
                            + Schedule Maintenance
                        </button>

                    </div>


                    {/* SUMMARY */}

                    <div className="maintenance-summary-grid">

                        {/* TOTAL */}

                        <div className="maintenance-summary-card">

                            <span>
                                Total Records
                            </span>

                            <strong>
                                {totalRecords}
                            </strong>

                        </div>


                        {/* ATTENTION */}

                        <div className="maintenance-summary-card">

                            <span>
                                Attention Required
                            </span>

                            <strong>
                                {attentionCount}
                            </strong>

                        </div>


                        {/* SCHEDULED */}

                        <div className="maintenance-summary-card">

                            <span>
                                Scheduled
                            </span>

                            <strong>
                                {scheduledCount}
                            </strong>

                        </div>


                        {/* IN PROGRESS */}

                        <div className="maintenance-summary-card">

                            <span>
                                In Progress
                            </span>

                            <strong>
                                {inProgressCount}
                            </strong>

                        </div>

                    </div>


                    {/* MAINTENANCE RECORDS */}

                    <section className="maintenance-records-section">

                        <div className="maintenance-section-header">

                            <div>

                                <h3>
                                    Maintenance Records
                                </h3>

                                <p>
                                    Current maintenance status across your fleet.
                                </p>

                            </div>

                            <span>
                                {filteredMaintenanceData.length}{" "}
                                {filteredMaintenanceData.length === 1
                                    ? "record"
                                    : "records"}
                            </span>

                        </div>

                        <div className="maintenance-filter">
                            <div className="maintenance-search">

                                <input
                                    type="text"
                                    placeholder="Search vehicle, model or service..."
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                />

                            </div>
                            <label htmlFor="vehicle-filter">
                                Vehicle
                            </label>

                            <select
                                id="vehicle-filter"
                                value={vehicleFilter}
                                onChange={(event) =>
                                    setVehicleFilter(event.target.value)
                                }
                            >
                                <option value="all">All Vehicles</option>

                                {vehicles.map((vehicle) => (
                                    <option
                                        key={vehicle.id}
                                        value={vehicle.id}
                                    >
                                        {vehicle.registrationNumber}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="status-filter">
                                Status
                            </label>

                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <option value="all">All Status</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Attention">Attention</option>
                                <option value="Overdue">Overdue</option>
                            </select>

                            <div className="maintenance-filter">
                                <label htmlFor="workflow-filter">
                                    Workflow
                                </label>

                                <select
                                    id="workflow-filter"
                                    value={workflowFilter}
                                    onChange={(event) =>
                                        setWorkflowFilter(event.target.value)
                                    }
                                >
                                    <option value="all">All Workflow</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <label htmlFor="sort-filter">
                                Sort By
                            </label>

                            <select
                                id="sort-filter"
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(event.target.value)
                                }
                            >
                                <option value="default">Default</option>
                                <option value="remaining-low">
                                    Remaining KM — Low to High
                                </option>
                                <option value="remaining-high">
                                    Remaining KM — High to Low
                                </option>
                            </select>

                            {vehicleFilter !== "all" ||
                                statusFilter !== "all" ||
                                workflowFilter !== "all" ||
                                sortBy !== "default" ? (<button
                                    type="button"
                                    className="maintenance-clear-filter"
                                    onClick={() => {
                                        setVehicleFilter("all");
                                        setStatusFilter("all");
                                        setWorkflowFilter("all");
                                        setSortBy("default");
                                    }}
                                >
                                    Clear Filter
                                </button>
                            ) : null}

                        </div>

                        {vehicleFilter !== "all" ||
                            statusFilter !== "all" ||
                            workflowFilter !== "all" ||
                            sortBy !== "default" ? (
                            <div className="maintenance-active-filters">
                                <span>Active Filters:</span>

                                {vehicleFilter !== "all" && (
                                    <span className="active-filter-badge">
                                        Vehicle
                                    </span>
                                )}

                                {statusFilter !== "all" && (
                                    <span className="active-filter-badge">
                                        Status
                                    </span>
                                )}

                                {workflowFilter !== "all" && (
                                    <span className="active-filter-badge">
                                        Workflow
                                    </span>
                                )}

                                {sortBy !== "default" && (
                                    <span className="active-filter-badge">
                                        Sorted
                                    </span>
                                )}
                            </div>
                        ) : null}


                        <div className="maintenance-filter-summary">
                            Showing{" "}
                            <strong>{filteredMaintenanceData.length}</strong>{" "}
                            of <strong>{totalRecords}</strong> maintenance records
                        </div>


                        <div className="maintenance-table-wrapper">

                            <table className="maintenance-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Vehicle
                                        </th>

                                        <th>
                                            Service
                                        </th>

                                        <th>
                                            Maintenance State
                                        </th>

                                        <th>
                                            Current KM
                                        </th>

                                        <th>
                                            Next Service
                                        </th>

                                        <th>
                                            Remaining
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Priority
                                        </th>

                                        <th>
                                            Workflow
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredMaintenanceData.length > 0 ? (
                                        filteredMaintenanceData.map((record) => (

                                            <tr key={record.id}>

                                                <td>

                                                    <div className="maintenance-vehicle">

                                                        <strong>
                                                            {record.vehicle?.registrationNumber}
                                                        </strong>

                                                        <span>
                                                            {record.vehicle?.model}
                                                        </span>

                                                    </div>

                                                </td>


                                                <td>

                                                    <div className="maintenance-service">

                                                        <strong>
                                                            {record.serviceType}
                                                        </strong>

                                                        <span>
                                                            {record.notes}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* MAINTENANCE STATE */}

                                                <td>

                                                    <span
                                                        className={`maintenance-state ${record.maintenanceState.toLowerCase()}`}
                                                    >
                                                        {record.maintenanceState}
                                                    </span>

                                                </td>


                                                <td>

                                                    {record.currentOdometer.toLocaleString()} km

                                                </td>


                                                <td>

                                                    {record.nextServiceOdometer.toLocaleString()} km

                                                </td>


                                                <td>
                                                    <span
                                                        className={`maintenance-remaining ${record.remainingKm <= 0
                                                            ? "critical"
                                                            : record.remainingKm <= 500
                                                                ? "high"
                                                                : record.remainingKm <= 1000
                                                                    ? "normal"
                                                                    : "low"
                                                            }`}
                                                    >
                                                        {record.remainingKm <= 0
                                                            ? "Overdue"
                                                            : `${record.remainingKm.toLocaleString()} km`}
                                                    </span>
                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`maintenance-status ${record.status.toLowerCase()}`}
                                                    >
                                                        {record.status}
                                                    </span>

                                                </td>


                                                {/* PRIORITY */}

                                                <td>

                                                    <span
                                                        className={`maintenance-priority ${record.priority.toLowerCase()}`}
                                                    >
                                                        {record.priority}
                                                    </span>

                                                </td>


                                                {/* WORKFLOW */}

                                                <td>

                                                    <span
                                                        className={`maintenance-workflow ${record.workflowStatus
                                                            .toLowerCase()
                                                            .replace(/\s+/g, "-")}`}
                                                    >
                                                        {record.workflowStatus}
                                                    </span>

                                                </td>

                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="maintenance-actions">

                                                        <button
                                                            type="button"
                                                            className="maintenance-action-button delete"
                                                            onClick={() => handleDeleteMaintenance(record)}
                                                        >
                                                            Delete
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="maintenance-action-button edit"
                                                            onClick={() => handleEditMaintenance(record)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="maintenance-action-button view"
                                                            onClick={() => handleViewMaintenance(record)}
                                                        >
                                                            View
                                                        </button>

                                                        {record.workflowStatus === "Scheduled" && (
                                                            <button
                                                                type="button"
                                                                className="maintenance-action-button start"
                                                                onClick={() => handleStartMaintenance(record.id)}
                                                            >
                                                                Start
                                                            </button>
                                                        )}

                                                        {record.workflowStatus === "In Progress" && (
                                                            <button
                                                                type="button"
                                                                className="maintenance-action-button complete"
                                                                onClick={() => handleCompleteClick(record)}                                                            >
                                                                Complete
                                                            </button>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>

                                        ))) : (
                                        <tr>
                                            <td
                                                colSpan="10"
                                                className="maintenance-empty-state"
                                            >
                                                <div className="maintenance-empty-content">
                                                    <div className="maintenance-empty-icon">
                                                        🔍
                                                    </div>

                                                    <h3>No maintenance records found</h3>

                                                    <p>
                                                        No records match the selected filters.
                                                        Try changing or clearing the filters.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="maintenance-empty-button"
                                                        onClick={() => {
                                                            setVehicleFilter("all");
                                                            setStatusFilter("all");
                                                            setWorkflowFilter("all");
                                                            setSortBy("default");
                                                        }}
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>

                        </div>

                    </section>

                    {/* =================================================
    MAINTENANCE HISTORY
    ================================================= */}

                    <section className="maintenance-records-section maintenance-history-section">

                        <div className="maintenance-section-header">

                            <div>

                                <h3>
                                    Maintenance History
                                </h3>

                                <p>
                                    Completed maintenance services across your fleet.
                                </p>

                            </div>

                            <span>
                                {completedRecords.length} completed
                            </span>

                            <div className="maintenance-history-search">

                                <input
                                    type="text"
                                    placeholder="Search history..."
                                    value={historySearchTerm}
                                    onChange={(event) =>
                                        setHistorySearchTerm(event.target.value)
                                    }
                                />

                            </div>

                        </div>


                        <div className="maintenance-table-wrapper">

                            <table className="maintenance-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Vehicle
                                        </th>

                                        <th>
                                            Service
                                        </th>

                                        <th>
                                            Service KM
                                        </th>

                                        <th>
                                            Completed Date
                                        </th>

                                        <th>
                                            Notes
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {completedRecords.length > 0 ? (

                                        filteredCompletedRecords.map((record) => (

                                            <tr key={`history-${record.id}`}>

                                                <td>

                                                    <div className="maintenance-vehicle">

                                                        <strong>
                                                            {record.vehicle?.registrationNumber}
                                                        </strong>

                                                        <span>
                                                            {record.vehicle?.model}
                                                        </span>

                                                    </div>

                                                </td>


                                                <td>

                                                    <div className="maintenance-service">

                                                        <strong>
                                                            {record.serviceType}
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                    {record.serviceCompletedOdometer
                                                        ? `${record.serviceCompletedOdometer.toLocaleString()} km`
                                                        : "—"}

                                                </td>


                                                <td>

                                                    {record.completedDate
                                                        ? new Date(record.completedDate).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        })
                                                        : "—"}

                                                </td>


                                                <td>

                                                    <div className="maintenance-service">

                                                        <span>
                                                            {record.notes || "No notes available."}
                                                        </span>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="maintenance-history-empty"
                                            >
                                                No completed maintenance records yet.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>


                    {/* =================================================
              SCHEDULE MAINTENANCE MODAL
              ================================================= */}

                    {showScheduleModal && (

                        <div className="maintenance-modal-overlay">

                            <div className="maintenance-modal">

                                <div className="maintenance-modal-header">

                                    <div>

                                        <p className="page-eyebrow">
                                            MAINTENANCE
                                        </p>

                                        <h2>
                                            Schedule Maintenance
                                        </h2>

                                        <p>
                                            Create a maintenance schedule for a vehicle.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="maintenance-modal-close"
                                        onClick={() =>
                                            setShowScheduleModal(false)
                                        }
                                    >
                                        ×
                                    </button>

                                </div>


                                <form
                                    className="maintenance-form"
                                    onSubmit={handleScheduleMaintenance}
                                >

                                    {/* VEHICLE */}

                                    <div className="maintenance-form-group">

                                        <label htmlFor="vehicleId">
                                            Vehicle
                                        </label>

                                        <select
                                            id="vehicleId"
                                            name="vehicleId"
                                            value={scheduleForm.vehicleId}
                                            onChange={handleScheduleInputChange}
                                            required
                                        >

                                            <option value="">
                                                Select vehicle
                                            </option>

                                            {vehicles.map((vehicle) => (

                                                <option
                                                    key={vehicle.id}
                                                    value={vehicle.id}
                                                >
                                                    {vehicle.registrationNumber} - {vehicle.model}
                                                </option>

                                            ))}

                                        </select>

                                    </div>


                                    {/* SERVICE TYPE */}

                                    <div className="maintenance-form-group">

                                        <label htmlFor="serviceType">
                                            Service Type
                                        </label>

                                        <select
                                            id="serviceType"
                                            name="serviceType"
                                            value={scheduleForm.serviceType}
                                            onChange={handleScheduleInputChange}
                                        >

                                            <option value="General Service">
                                                General Service
                                            </option>

                                            <option value="Engine Oil Service">
                                                Engine Oil Service
                                            </option>

                                            <option value="Brake Inspection">
                                                Brake Inspection
                                            </option>

                                            <option value="Tyre Inspection">
                                                Tyre Inspection
                                            </option>

                                            <option value="Battery Inspection">
                                                Battery Inspection
                                            </option>

                                        </select>

                                    </div>

                                    <div className="form-group">
                                        <label>Current Odometer</label>

                                        <input
                                            type="number"
                                            value={scheduleForm.currentOdometer}
                                            onChange={(event) =>
                                                setScheduleForm({
                                                    ...scheduleForm,
                                                    currentOdometer: event.target.value
                                                })
                                            }
                                            placeholder="Enter current odometer"
                                            required
                                        />
                                    </div>


                                    {/* DATE */}

                                    <div className="maintenance-form-group">

                                        <label htmlFor="scheduledDate">
                                            Scheduled Date
                                        </label>

                                        <input
                                            id="scheduledDate"
                                            name="scheduledDate"
                                            type="date"
                                            value={scheduleForm.scheduledDate}
                                            onChange={handleScheduleInputChange}
                                            required
                                        />

                                    </div>


                                    {/* NOTES */}

                                    <div className="maintenance-form-group">

                                        <label htmlFor="notes">
                                            Notes
                                        </label>

                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows="4"
                                            placeholder="Add maintenance notes..."
                                            value={scheduleForm.notes}
                                            onChange={handleScheduleInputChange}
                                        />

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="maintenance-form-actions">

                                        <button
                                            type="button"
                                            className="maintenance-cancel-button"
                                            onClick={() =>
                                                setShowScheduleModal(false)
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="maintenance-submit-button"
                                        >
                                            Schedule Maintenance
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    )}

                </section>

                {/* =================================================
    MAINTENANCE DETAILS MODAL
    ================================================= */}

                {/* =================================================
    EDIT MAINTENANCE MODAL
    ================================================= */}

                {showEditModal && selectedRecord && (

                    <div className="maintenance-modal-overlay">

                        <div className="maintenance-modal">

                            <div className="maintenance-modal-header">

                                <div>

                                    <p className="page-eyebrow">
                                        MAINTENANCE
                                    </p>

                                    <h2>
                                        Edit Maintenance
                                    </h2>

                                    <p>
                                        Update the maintenance schedule details.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="maintenance-modal-close"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedRecord(null);
                                    }}
                                >
                                    ×
                                </button>

                            </div>


                            <form className="maintenance-form">

                                {/* VEHICLE */}

                                <div className="maintenance-form-group">

                                    <label>
                                        Vehicle
                                    </label>

                                    <input
                                        type="text"
                                        value={`${selectedRecord.vehicle?.registrationNumber} - ${selectedRecord.vehicle?.model}`}
                                        disabled
                                    />

                                </div>


                                {/* SERVICE TYPE */}

                                <div className="maintenance-form-group">

                                    <label htmlFor="edit-serviceType">
                                        Service Type
                                    </label>

                                    <select
                                        id="edit-serviceType"
                                        value={editForm.serviceType}
                                        onChange={(event) =>
                                            setEditForm((previous) => ({
                                                ...previous,
                                                serviceType: event.target.value
                                            }))
                                        }
                                    >

                                        <option value="General Service">
                                            General Service
                                        </option>

                                        <option value="Engine Oil Service">
                                            Engine Oil Service
                                        </option>

                                        <option value="Brake Inspection">
                                            Brake Inspection
                                        </option>

                                        <option value="Tyre Inspection">
                                            Tyre Inspection
                                        </option>

                                        <option value="Battery Inspection">
                                            Battery Inspection
                                        </option>

                                    </select>

                                </div>


                                {/* SCHEDULED DATE */}

                                <div className="maintenance-form-group">

                                    <label htmlFor="edit-scheduledDate">
                                        Scheduled Date
                                    </label>

                                    <input
                                        id="edit-scheduledDate"
                                        type="date"
                                        value={editForm.scheduledDate}
                                        onChange={(event) =>
                                            setEditForm((previous) => ({
                                                ...previous,
                                                scheduledDate: event.target.value
                                            }))
                                        }
                                    />

                                </div>


                                {/* NOTES */}

                                <div className="maintenance-form-group">

                                    <label htmlFor="edit-notes">
                                        Notes
                                    </label>

                                    <textarea
                                        id="edit-notes"
                                        rows="4"
                                        placeholder="Add maintenance notes..."
                                        value={editForm.notes}
                                        onChange={(event) =>
                                            setEditForm((previous) => ({
                                                ...previous,
                                                notes: event.target.value
                                            }))
                                        }
                                    />

                                </div>


                                {/* ACTIONS */}

                                <div className="maintenance-form-actions">

                                    <button
                                        type="button"
                                        className="maintenance-cancel-button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedRecord(null);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="maintenance-submit-button"
                                        onClick={handleSaveEditMaintenance}
                                    >
                                        Save Changes
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                {/* =================================================
    DELETE MAINTENANCE MODAL
    ================================================= */}

                {showDeleteModal && deletingRecord && (

                    <div className="maintenance-modal-overlay">

                        <div className="maintenance-modal maintenance-delete-modal">

                            <div className="maintenance-modal-header">

                                <div>

                                    <p className="page-eyebrow">
                                        MAINTENANCE
                                    </p>

                                    <h2>
                                        Delete Maintenance
                                    </h2>

                                    <p>
                                        Are you sure you want to delete this maintenance record?
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="maintenance-modal-close"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletingRecord(null);
                                    }}
                                >
                                    ×
                                </button>

                            </div>

                            <div className="maintenance-delete-content">

                                <div className="maintenance-delete-info">

                                    <strong>
                                        {deletingRecord.vehicle?.registrationNumber}
                                    </strong>

                                    <span>
                                        {deletingRecord.serviceType}
                                    </span>

                                </div>

                                <p className="maintenance-delete-warning">
                                    This action cannot be undone.
                                </p>

                            </div>

                            <div className="maintenance-form-actions">

                                <button
                                    type="button"
                                    className="maintenance-cancel-button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletingRecord(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="maintenance-delete-confirm-button"
                                    onClick={handleConfirmDeleteMaintenance}
                                >
                                    Delete Record
                                </button>

                            </div>

                        </div>

                    </div>

                )}

                {showDetailsModal && selectedRecord && (

                    <div className="maintenance-modal-overlay">

                        <div className="maintenance-modal maintenance-details-modal">

                            <div className="maintenance-modal-header">

                                <div>

                                    <p className="page-eyebrow">
                                        MAINTENANCE RECORD
                                    </p>

                                    <h2>
                                        Maintenance Details
                                    </h2>

                                    <p>
                                        Detailed information about this maintenance record.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="maintenance-modal-close"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedRecord(null);
                                    }}
                                >
                                    ×
                                </button>

                            </div>


                            <div className="maintenance-details-content">

                                {/* VEHICLE */}

                                <div className="maintenance-details-section">

                                    <h3>
                                        Vehicle Information
                                    </h3>

                                    <div className="maintenance-details-grid">

                                        <div>
                                            <span>Registration Number</span>
                                            <strong>
                                                {selectedRecord.vehicle?.registrationNumber}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Vehicle Model</span>
                                            <strong>
                                                {selectedRecord.vehicle?.model}
                                            </strong>
                                        </div>

                                        <div className="maintenance-detail-item">
                                            <span>Workflow Status</span>

                                            <strong
                                                className={`maintenance-workflow-badge ${selectedRecord.workflowStatus
                                                    ?.toLowerCase()
                                                    .replace(/\s+/g, "-")
                                                    }`}
                                            >
                                                {selectedRecord.workflowStatus}
                                            </strong>
                                        </div>

                                        <div className="maintenance-detail-item">
                                            <span>Priority</span>

                                            <strong
                                                className={`maintenance-priority-badge ${selectedRecord.priority?.toLowerCase()
                                                    }`}
                                            >
                                                {selectedRecord.priority}
                                            </strong>
                                        </div>

                                        <div className="maintenance-detail-item">
                                            <span>Next Service</span>

                                            <strong>
                                                {selectedRecord.nextServiceOdometer?.toLocaleString()} km
                                            </strong>
                                        </div>

                                        <div className="maintenance-detail-item">
                                            <span>Remaining Distance</span>

                                            <strong>
                                                {selectedRecord.remainingKm < 0
                                                    ? `${Math.abs(selectedRecord.remainingKm).toLocaleString()} km overdue`
                                                    : `${selectedRecord.remainingKm.toLocaleString()} km remaining`}
                                            </strong>
                                        </div>

                                        <div className="maintenance-detail-item">
                                            <span>Scheduled Date</span>

                                            <strong>
                                                {selectedRecord.scheduledDate
                                                    ? new Date(
                                                        selectedRecord.scheduledDate
                                                    ).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })
                                                    : "Not scheduled"}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="maintenance-detail-notes">

                                        <span>Maintenance Notes</span>

                                        <p>
                                            {selectedRecord.notes || "No maintenance notes available."}
                                        </p>

                                    </div>

                                </div>


                                {/* SERVICE */}

                                <div className="maintenance-details-section">

                                    <h3>
                                        Service Information
                                    </h3>

                                    <div className="maintenance-details-grid">

                                        <div>
                                            <span>Service Type</span>
                                            <strong>
                                                {selectedRecord.serviceType}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Current Odometer</span>
                                            <strong>
                                                {selectedRecord.currentOdometer.toLocaleString()} km
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Last Service</span>
                                            <strong>
                                                {selectedRecord.lastServiceOdometer.toLocaleString()} km
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Service Completed At</span>
                                            <strong>
                                                {selectedRecord.serviceCompletedOdometer
                                                    ? `${selectedRecord.serviceCompletedOdometer.toLocaleString()} km`
                                                    : "Not completed"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Next Service</span>
                                            <strong>
                                                {selectedRecord.nextServiceOdometer.toLocaleString()} km
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="maintenance-details-section">

                                    <h3>
                                        Maintenance Status
                                    </h3>

                                    <div className="maintenance-details-status-row">

                                        <div>

                                            <span>
                                                Risk Status
                                            </span>

                                            <span
                                                className={`maintenance-status ${selectedRecord.status.toLowerCase()}`}
                                            >
                                                {selectedRecord.status}
                                            </span>

                                        </div>


                                        <div>

                                            <span>
                                                Priority
                                            </span>

                                            <span
                                                className={`maintenance-priority ${selectedRecord.priority.toLowerCase()}`}
                                            >
                                                {selectedRecord.priority}
                                            </span>

                                        </div>


                                        <div>

                                            <span>
                                                Workflow
                                            </span>

                                            <span
                                                className={`maintenance-workflow ${selectedRecord.workflowStatus
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`}
                                            >
                                                {selectedRecord.workflowStatus}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* SCHEDULE */}

                                <div className="maintenance-details-section">

                                    <h3>
                                        Schedule & Notes
                                    </h3>

                                    <div className="maintenance-details-grid">

                                        <div>
                                            <span>Scheduled Dat</span>
                                            <strong>
                                                {selectedRecord.scheduledDate
                                                    ? new Date(
                                                        selectedRecord.scheduledDate
                                                    ).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })
                                                    : "Not scheduled"}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="maintenance-details-notes">

                                        <span>
                                            Notes
                                        </span>

                                        <p>
                                            {selectedRecord.notes || "No notes available."}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="maintenance-details-footer">

                                <button
                                    type="button"
                                    className="maintenance-cancel-button"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedRecord(null);
                                    }}
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

                {showCompleteModal && completingRecord && (
                    <div className="maintenance-modal-overlay">
                        <div className="maintenance-modal maintenance-complete-modal">

                            <div className="maintenance-modal-header">
                                <div>
                                    <p className="maintenance-modal-label">
                                        Maintenance
                                    </p>

                                    <h2>Complete Maintenance</h2>
                                </div>

                                <button
                                    type="button"
                                    className="maintenance-modal-close"
                                    onClick={() => {
                                        setShowCompleteModal(false);
                                        setCompletingRecord(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="maintenance-complete-content">

                                <div className="maintenance-complete-info">
                                    <strong>
                                        {completingRecord.vehicle?.registrationNumber}
                                    </strong>

                                    <span>
                                        {completingRecord.serviceType}
                                    </span>
                                </div>

                                <p className="maintenance-complete-message">
                                    Are you sure you want to mark this maintenance
                                    as completed?
                                </p>

                            </div>

                            <div className="maintenance-form-actions">

                                <button
                                    type="button"
                                    className="maintenance-cancel-button"
                                    onClick={() => {
                                        setShowCompleteModal(false);
                                        setCompletingRecord(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="maintenance-submit-button"
                                    onClick={() =>
                                        handleCompleteMaintenance(completingRecord.id)
                                    }
                                >
                                    Complete
                                </button>

                            </div>

                        </div>
                    </div>
                )}

            </main>

        </div>

    );

}

export default Maintenance;
