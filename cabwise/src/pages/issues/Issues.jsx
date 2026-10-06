import { useEffect, useMemo, useState } from "react"; import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { getIssuePriorityLabel } from "../../utils/issue";
import { classifyIssue } from "../../utils/aiIssueClassifier";

function Issues() {
    const [issues, setIssues] = useState([]); 
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    useEffect(() => {

        const storedUser = localStorage.getItem("cabwiseUser");
        const currentUser = storedUser
            ? JSON.parse(storedUser)
            : null;

        if (!currentUser) {
            console.error("User not found in local storage");
            return;
        }

        fetch(`http://localhost:3000/issues?userId=${currentUser.id}`)
            .then((response) => response.json())
            .then((data) => {

                console.log("Issues from backend:", data);

                const formattedIssues = data.map((issue) => ({
                    id: issue.id,
                    vehicleId: issue.vehicle_id,
                    driverId: issue.driver_id,
                    title: issue.title,
                    description: issue.description,
                    category: issue.category,
                    priority: issue.priority,
                    status: issue.status,
                    attention: issue.attention,
                    reason: issue.ai_reason,
                    reportedBy: issue.reported_by,
                    reportedDate: issue.created_at
                        ? issue.created_at.split("T")[0]
                        : "",
                    resolvedDate: issue.resolved_date
                        ? issue.resolved_date.split("T")[0]
                        : ""
                }));

                setIssues(formattedIssues);

            })
            .catch((error) => {

                console.error(
                    "Issues API error:",
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
                    "Vehicles from backend:",
                    data
                );

                const formattedVehicles = data.map(
                    (vehicle) => ({
                        id: vehicle.id,
                        registrationNumber:
                            vehicle.registration_number,
                        model: vehicle.model,
                        driver: vehicle.driver,
                        odometer: vehicle.odometer,
                        status: vehicle.status
                    })
                );

                setVehicles(formattedVehicles);

            })
            .catch((error) => {

                console.error(
                    "Vehicle API error:",
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
            `http://localhost:3000/drivers?userId=${currentUser.id}`
        )
            .then((response) => response.json())
            .then((data) => {

                console.log(
                    "Drivers from backend:",
                    data
                );

                const formattedDrivers = data.map(
                    (driver) => ({
                        id: driver.id,
                        name: driver.name,
                        phone: driver.phone,
                        licenseNumber:
                            driver.license_number,
                        licenseExpiry:
                            driver.license_expiry,
                        assignedVehicleId:
                            driver.assigned_vehicle_id,
                        status: driver.status
                    })
                );

                setDrivers(formattedDrivers);

            })
            .catch((error) => {

                console.error(
                    "Driver API error:",
                    error
                );

            });

    }, []);
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [showReportIssue, setShowReportIssue] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [aiResult, setAiResult] = useState(null);

    const [issueForm, setIssueForm] = useState({
        driverId: "",
        vehicleId: "",
        title: "",
        description: "",
        category: "Other"
    });

    const issueData = useMemo(() => {
        return issues.map((issue) => {
            const vehicle = vehicles.find(
                (vehicle) => vehicle.id === issue.vehicleId
            );

            const driver = drivers.find(
                (driver) => driver.id === issue.driverId
            );

            return {
                ...issue,
                vehicle,
                driver
            };
        });
    }, [issues]);

    const handleIssueFormChange = (event) => {
        const { name, value } = event.target;

        setIssueForm((previousForm) => {
            const updatedForm = {
                ...previousForm,
                [name]: value
            };

            if (
                (name === "title" || name === "description") &&
                (updatedForm.title.trim() || updatedForm.description.trim())
            ) {
                const result = classifyIssue(
                    updatedForm.title,
                    updatedForm.description
                );

                setAiResult(result);
            }

            return updatedForm;
        });
    };

    const handleReportIssue = async (event) => {

        event.preventDefault();

        if (!issueForm.driverId) {
            alert("Please select driver.");
            return;
        }

        if (!issueForm.vehicleId) {
            alert("Please select vehicle.");
            return;
        }

        if (!issueForm.title.trim()) {
            alert("Please enter issue title.");
            return;
        }

        if (!issueForm.description.trim()) {
            alert("Please describe the issue.");
            return;
        }

        const storedUser = localStorage.getItem("cabwiseUser");
        const currentUser = storedUser
            ? JSON.parse(storedUser)
            : null;

        if (!currentUser) {
            alert("User not found. Please login again.");
            return;
        }

        const classificationResult = classifyIssue(
            issueForm.title,
            issueForm.description
        );

        const newIssueData = {
            vehicleId: Number(issueForm.vehicleId),
            driverId: Number(issueForm.driverId),
            userId: currentUser.id,
            title: issueForm.title.trim(),
            description: issueForm.description.trim(),
            category: classificationResult.category,
            priority: classificationResult.priority,
            status: "Open",
            reportedBy: issueForm.driverId,
            attention: classificationResult.attention,
            aiReason: classificationResult.reason
        };

        try {

            const response = await fetch(
                "http://localhost:3000/issues",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newIssueData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to report issue"
                );
            }

            console.log("Issue reported:", data);

            const newIssue = {
                id: data.issueId,
                vehicleId: newIssueData.vehicleId,
                driverId: newIssueData.driverId,
                title: newIssueData.title,
                description: newIssueData.description,
                category: classificationResult.category,
                priority: classificationResult.priority,
                attention: classificationResult.attention,
                reason: classificationResult.reason,
                status: "Open",
                reportedDate: new Date()
                    .toISOString()
                    .split("T")[0]
            };

            setIssues((previousIssues) => [
                ...previousIssues,
                newIssue
            ]);

            setIssueForm({
                driverId: "",
                vehicleId: "",
                title: "",
                description: "",
                category: "Other"
            });

            setAiResult(null);
            setShowReportIssue(false);

            alert("Issue report submitted successfully.");

        } catch (error) {

            console.error(
                "Report issue error:",
                error
            );

            alert(
                "Failed to report issue. Please try again."
            );

        }
    };

    const handleAcknowledgeIssue = async (issueId) => {

        try {

            const storedUser = localStorage.getItem("cabwiseUser");

            if (!storedUser) {
                alert("User not found. Please login again.");
                return;
            }

            const currentUser = JSON.parse(storedUser);

            const response = await fetch(
                `http://localhost:3000/issues/${issueId}/acknowledge`,
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
                throw new Error(
                    data.error || "Failed to acknowledge issue"
                );
            }

            console.log(
                "Issue acknowledged:",
                data
            );

            setIssues((previousIssues) =>
                previousIssues.map((issue) =>
                    issue.id === issueId
                        ? {
                            ...issue,
                            status: "Acknowledged"
                        }
                        : issue
                )
            );

            setSelectedIssue((previousIssue) =>
                previousIssue
                    ? {
                        ...previousIssue,
                        status: "Acknowledged"
                    }
                    : null
            );

        } catch (error) {

            console.error(
                "Acknowledge issue error:",
                error
            );

            alert(
                "Failed to acknowledge issue. Please try again."
            );

        }
    };

    const handleResolveIssue = async (issueId) => {

        try {

            const storedUser = localStorage.getItem("cabwiseUser");

            if (!storedUser) {
                alert("User not found. Please login again.");
                return;
            }

            const currentUser = JSON.parse(storedUser);

            const response = await fetch(
                `http://localhost:3000/issues/${issueId}/resolve`,
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
                throw new Error(
                    data.error || "Failed to resolve issue"
                );
            }

            console.log(
                "Issue resolved:",
                data
            );

            setIssues((previousIssues) =>
                previousIssues.map((issue) =>
                    issue.id === issueId
                        ? {
                            ...issue,
                            status: "Resolved",
                            resolvedDate: data.resolvedDate
                        }
                        : issue
                )
            );

            setSelectedIssue((previousIssue) =>
                previousIssue
                    ? {
                        ...previousIssue,
                        status: "Resolved",
                        resolvedDate: data.resolvedDate
                    }
                    : null
            );

        } catch (error) {

            console.error(
                "Resolve issue error:",
                error
            );

            alert(
                "Failed to resolve issue. Please try again."
            );

        }
    };

    const filteredIssues = issueData.filter((issue) => {
        const searchValue = searchTerm.trim().toLowerCase();

        const searchMatches =
            searchValue === "" ||
            issue.title.toLowerCase().includes(searchValue) ||
            issue.category.toLowerCase().includes(searchValue) ||
            issue.vehicle?.registrationNumber
                ?.toLowerCase()
                .includes(searchValue) ||
            issue.driver?.name.toLowerCase().includes(searchValue);

        const priorityMatches =
            priorityFilter === "all" ||
            issue.priority === priorityFilter;

        const statusMatches =
            statusFilter === "all" ||
            issue.status === statusFilter;

        return searchMatches && priorityMatches && statusMatches;
    });

    const openIssues = issueData.filter(
        (issue) => issue.status === "Open"
    ).length;

    const acknowledgedIssues = issueData.filter(
        (issue) => issue.status === "Acknowledged"
    ).length;

    const resolvedIssues = issueData.filter(
        (issue) => issue.status === "Resolved"
    ).length;



    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-main">

                <DashboardHeader />

                <main className="issues-page">

                    <div className="issues-page-header">

                        <div>
                            <p className="dashboard-breadcrumb">
                                Fleet Operations
                            </p>

                            <h2>Issues</h2>

                            <p>
                                Monitor and manage vehicle issues reported by drivers.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="issue-report-button"
                            onClick={() => {
                                setAiResult(null);
                                setShowReportIssue(true);
                            }}                        >
                            + Report Issue
                        </button>

                    </div>


                    <section className="issues-summary">

                        <div className="issue-summary-card">
                            <span>Total Issues</span>
                            <strong>{issueData.length}</strong>
                        </div>

                        <div className="issue-summary-card">
                            <span>Open</span>
                            <strong>{openIssues}</strong>
                        </div>

                        <div className="issue-summary-card">
                            <span>Acknowledged</span>
                            <strong>{acknowledgedIssues}</strong>
                        </div>

                        <div className="issue-summary-card">
                            <span>Resolved</span>
                            <strong>{resolvedIssues}</strong>
                        </div>

                    </section>


                    <section className="issues-content-section">

                        <div className="issues-section-header">

                            <div>
                                <h3>Issue Management</h3>

                                <p>
                                    Review reported vehicle issues and their current status.
                                </p>
                            </div>

                            <div className="issues-controls">

                                <div className="issues-search">

                                    <input
                                        type="text"
                                        placeholder="Search issue, vehicle or driver..."
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(event.target.value)
                                        }
                                    />

                                </div>

                                <select
                                    className="issues-filter"
                                    value={priorityFilter}
                                    onChange={(event) =>
                                        setPriorityFilter(event.target.value)
                                    }
                                >
                                    <option value="all">All Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>

                                <select
                                    className="issues-filter"
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                >
                                    <option value="all">All Status</option>
                                    <option value="Open">Open</option>
                                    <option value="Acknowledged">Acknowledged</option>
                                    <option value="Resolved">Resolved</option>
                                </select>

                            </div>

                        </div>


                        <div className="issues-table-wrapper">

                            <table className="issues-table">

                                <thead>
                                    <tr>
                                        <th>Issue</th>
                                        <th>Vehicle</th>
                                        <th>Driver</th>
                                        <th>Category</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Reported</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredIssues.map((issue) => (

                                        <tr key={issue.id}>

                                            <td>
                                                <div className="issue-title-cell">

                                                    <strong>
                                                        {issue.title}
                                                    </strong>

                                                    <span>
                                                        {issue.description}
                                                    </span>

                                                </div>
                                            </td>

                                            <td>
                                                {issue.vehicle
                                                    ? issue.vehicle.registrationNumber
                                                    : "Not assigned"}
                                            </td>

                                            <td>
                                                {issue.driver
                                                    ? issue.driver.name
                                                    : "Unknown"}
                                            </td>

                                            <td>
                                                <span className="issue-category">
                                                    {issue.category}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`issue-priority-badge ${issue.priority.toLowerCase()}`}
                                                >
                                                    {getIssuePriorityLabel(issue.priority)}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`issue-status-badge ${issue.status.toLowerCase()}`}
                                                >
                                                    {issue.status}
                                                </span>
                                            </td>

                                            <td>
                                                {issue.reportedDate}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="issue-view-button"
                                                    onClick={() => setSelectedIssue(issue)}
                                                >
                                                    View
                                                </button>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>


                        {filteredIssues.length === 0 && (
                            <div className="issues-empty-state">
                                <h3>No issues found</h3>

                                <p>
                                    Try changing your search.
                                </p>
                            </div>
                        )}

                    </section>

                </main>

                {showReportIssue && (
                    <div className="maintenance-modal-overlay">

                        <div className="maintenance-modal driver-form-modal">

                            <div className="maintenance-modal-header">

                                <div>
                                    <p className="maintenance-modal-label">
                                        Driver Operations
                                    </p>

                                    <h2>Report Vehicle Issue</h2>
                                </div>

                                <button
                                    type="button"
                                    className="maintenance-modal-close"
                                    onClick={() => setShowReportIssue(false)}
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                onSubmit={handleReportIssue}
                                className="driver-form"
                            >

                                <div className="driver-form-grid">

                                    <div className="driver-form-group">

                                        <label>Driver</label>

                                        <select
                                            name="driverId"
                                            value={issueForm.driverId}
                                            onChange={handleIssueFormChange}
                                        >
                                            <option value="">
                                                Select Driver
                                            </option>

                                            {drivers.map((driver) => (
                                                <option
                                                    key={driver.id}
                                                    value={driver.id}
                                                >
                                                    {driver.name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>


                                    <div className="driver-form-group">

                                        <label>Vehicle</label>

                                        <select
                                            name="vehicleId"
                                            value={issueForm.vehicleId}
                                            onChange={handleIssueFormChange}
                                        >
                                            <option value="">
                                                Select Vehicle
                                            </option>

                                            {vehicles.map((vehicle) => (
                                                <option
                                                    key={vehicle.id}
                                                    value={vehicle.id}
                                                >
                                                    {vehicle.registrationNumber}
                                                </option>
                                            ))}

                                        </select>

                                    </div>


                                    <div className="driver-form-group">

                                        <label>Issue Category</label>

                                        <select
                                            name="category"
                                            value={issueForm.category}
                                            onChange={handleIssueFormChange}
                                        >
                                            <option value="Brake">Brake</option>
                                            <option value="Engine">Engine</option>
                                            <option value="Tyre">Tyre</option>
                                            <option value="AC">AC</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Other">Other</option>
                                        </select>

                                    </div>


                                    <div className="driver-form-group">

                                        <label>Issue Title</label>

                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Example: Unusual brake noise"
                                            value={issueForm.title}
                                            onChange={handleIssueFormChange}
                                        />

                                    </div>


                                    <div className="driver-form-group driver-form-full">

                                        <label>Describe the Issue</label>

                                        <textarea
                                            name="description"
                                            placeholder="Describe what happened..."
                                            value={issueForm.description}
                                            onChange={handleIssueFormChange}
                                            rows="5"
                                        />

                                        {aiResult && (
                                            <div className="issue-ai-result">
                                                <div className="issue-ai-result-header">
                                                    <span>AI Classification</span>
                                                    <span>Analyzed</span>
                                                </div>

                                                <div className="issue-ai-result-grid">
                                                    <div>
                                                        <span>Category</span>
                                                        <strong>{aiResult.category}</strong>
                                                    </div>

                                                    <div>
                                                        <span>Priority</span>
                                                        <strong>{aiResult.priority}</strong>
                                                    </div>

                                                    <div className="issue-ai-result-full">
                                                        <span>Attention</span>
                                                        <strong>{aiResult.attention}</strong>
                                                    </div>

                                                    <div className="issue-ai-result-full">
                                                        <span>AI Reason</span>
                                                        <strong>{aiResult.reason}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                </div>


                                <div className="maintenance-form-actions">

                                    <button
                                        type="button"
                                        className="maintenance-cancel-button"
                                        onClick={() => setShowReportIssue(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="maintenance-submit-button"
                                    >
                                        Submit Issue
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )}

                {selectedIssue && (
                    <div className="maintenance-modal-overlay">

                        <div className="maintenance-modal issue-details-modal">

                            <div className="maintenance-modal-header">

                                <div>
                                    <p className="maintenance-modal-label">
                                        Issue Details
                                    </p>

                                    <h2>{selectedIssue.title}</h2>
                                </div>

                                <button
                                    type="button"
                                    className="maintenance-modal-close"
                                    onClick={() => setSelectedIssue(null)}
                                >
                                    ×
                                </button>

                            </div>

                            <div className="issue-details-content">

                                <div className="issue-detail-grid">

                                    <div className="issue-detail-item">
                                        <span>Vehicle</span>
                                        <strong>
                                            {vehicles.find(
                                                (vehicle) =>
                                                    vehicle.id === selectedIssue.vehicleId
                                            )?.registrationNumber || "Unknown"}
                                        </strong>
                                    </div>

                                    <div className="issue-detail-item">
                                        <span>Driver</span>
                                        <strong>
                                            {drivers.find(
                                                (driver) =>
                                                    driver.id === selectedIssue.driverId
                                            )?.name || "Unknown"}
                                        </strong>
                                    </div>

                                    <div className="issue-detail-item">
                                        <span>Category</span>
                                        <strong>{selectedIssue.category}</strong>
                                    </div>

                                    <div className="issue-detail-item">
                                        <span>Priority</span>
                                        <strong>
                                            {getIssuePriorityLabel(
                                                selectedIssue.priority
                                            )}
                                        </strong>
                                    </div>

                                    <div className="issue-detail-item">
                                        <span>Status</span>
                                        <strong>{selectedIssue.status}</strong>
                                    </div>

                                    <div className="issue-detail-item">
                                        <span>Reported Date</span>
                                        <strong>{selectedIssue.reportedDate}</strong>
                                    </div>

                                    {selectedIssue.resolvedDate && (
                                        <div className="issue-detail-item">
                                            <span>Resolved Date</span>
                                            <strong>{selectedIssue.resolvedDate}</strong>
                                        </div>
                                    )}

                                </div>

                                <div className="issue-description-box">

                                    <span>Description</span>

                                    <p>
                                        {selectedIssue.description}
                                    </p>

                                </div>

                                {selectedIssue.attention && (
                                    <div className="issue-ai-attention">
                                        <span>AI Attention</span>
                                        <strong>{selectedIssue.attention}</strong>
                                    </div>
                                )}
                                {selectedIssue.reason && (
                                    <div className="issue-ai-reason">
                                        <span>Why this attention?</span>
                                        <p>{selectedIssue.reason}</p>
                                    </div>
                                )}

                            </div>

                            <div className="maintenance-form-actions">

                                {selectedIssue.status === "Open" && (
                                    <button
                                        type="button"
                                        className="maintenance-submit-button"
                                        onClick={() =>
                                            handleAcknowledgeIssue(selectedIssue.id)
                                        }
                                    >
                                        Acknowledge Issue
                                    </button>
                                )}

                                {selectedIssue.status === "Acknowledged" && (
                                    <button
                                        type="button"
                                        className="maintenance-submit-button"
                                        onClick={() =>
                                            handleResolveIssue(selectedIssue.id)
                                        }
                                    >
                                        Resolve Issue
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="maintenance-cancel-button"
                                    onClick={() => setSelectedIssue(null)}
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Issues;