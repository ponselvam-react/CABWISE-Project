import { useNavigate } from "react-router-dom";
import VehicleStatusBadge from "./VehicleStatusBadge";

function VehicleCard({
  vehicle,
  maintenance,
  onEdit,
  onDelete
}) {
  const navigate = useNavigate();

  return (
    <article className="vehicle-card">

      <div className="vehicle-card-header">
        <div className="vehicle-icon">
          🚗
        </div>

        <VehicleStatusBadge status={vehicle.status} />

        {maintenance?.priority === "High" && (
          <span className="vehicle-attention-indicator">
            Attention
          </span>
        )}

        {maintenance?.priority === "Critical" && (
          <span className="vehicle-critical-indicator">
            Critical
          </span>
        )}
      </div>

      <div className="vehicle-card-title">
        <h3>{vehicle.registrationNumber}</h3>
        <p>{vehicle.model}</p>
      </div>

      <div className="vehicle-card-details">

        <div className="vehicle-detail">
          <span>Driver</span>
          <strong>{vehicle.driver}</strong>
        </div>

        <div className="vehicle-detail">
          <span>Odometer</span>
          <strong>{vehicle.odometer}</strong>
        </div>

      </div>

      <div className="vehicle-maintenance-state">

        <span>
          Maintenance State
        </span>

        <strong
          className={`vehicle-maintenance-badge ${maintenance?.maintenanceState?.toLowerCase() || "healthy"
            }`}
        >
          <span className="maintenance-status-dot"></span>

          {maintenance?.maintenanceState || "Healthy"}
        </strong>

      </div>

      <div className="vehicle-priority-info">

        <span>Priority</span>

        <strong
          className={`vehicle-priority-badge ${maintenance?.priority?.toLowerCase() || "low"
            }`}
        >
          {maintenance?.priority || "Low"}
        </strong>

      </div>

      <div className="vehicle-service-info">

        <div>
          <span>Next Service</span>

          <strong>
            {maintenance?.serviceType || "Not scheduled"}
          </strong>
        </div>

        <strong className="vehicle-service-km">
          {!maintenance
            ? "Not scheduled"
            : maintenance.remainingKm <= 0
              ? "Overdue"
              : `${maintenance.remainingKm.toLocaleString()} km`}
        </strong>

      </div>

      <div className="vehicle-scheduled-date">

        <span>Scheduled Date</span>

        <strong>
          {maintenance?.scheduledDate
            ? new Date(
              maintenance.scheduledDate
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
            : "Not scheduled"}
        </strong>

      </div>

      <div className="vehicle-last-service">

        <span>Last Service</span>

        <strong>
          {maintenance?.lastServiceOdometer
            ? `${maintenance.lastServiceOdometer.toLocaleString()} km`
            : "Not available"}
        </strong>

      </div>

      <div className="vehicle-service-progress">

        <div className="vehicle-service-progress-header">

          <span>Service Progress</span>

          <strong>
            {maintenance?.serviceInterval
              ? `${Math.min(
                100,
                Math.max(
                  0,
                  Math.round(
                    ((maintenance.serviceInterval -
                      maintenance.remainingKm) /
                      maintenance.serviceInterval) *
                    100
                  )
                )
              )}%`
              : "0%"}
          </strong>

        </div>

        <div className="vehicle-progress-track">

          <div
            className={`vehicle-progress-fill ${maintenance?.maintenanceState?.toLowerCase() || "healthy"
              }`}
            style={{
              width: `${maintenance?.serviceInterval
                ? Math.min(
                  100,
                  Math.max(
                    0,
                    ((maintenance.serviceInterval -
                      maintenance.remainingKm) /
                      maintenance.serviceInterval) *
                    100
                  )
                )
                : 0
                }%`
            }}
          ></div>

        </div>

        <p
          className={`vehicle-progress-message ${maintenance?.maintenanceState?.toLowerCase() || "healthy"
            }`}
        >
          {maintenance?.maintenanceState === "Critical"
            ? "Immediate maintenance attention required"
            : maintenance?.maintenanceState === "Attention"
              ? "Maintenance check recommended soon"
              : "Vehicle maintenance is on track"}
        </p>

      </div>

      {maintenance && (
        <button
          type="button"
          className="vehicle-maintenance-button"
          onClick={() => navigate("/maintenance")}
        >
          View Maintenance
        </button>
      )}

      <div className="vehicle-card-footer">

        <span
          className={`maintenance-indicator ${maintenance
              ? maintenance.maintenanceState?.toLowerCase()
              : "healthy"
            }`}
        >
          {maintenance
            ? maintenance.remainingKm <= 0
              ? "Overdue"
              : `Service in ${maintenance.remainingKm.toLocaleString()} km`
            : "Not scheduled"}
        </span>

        <div className="vehicle-card-actions">

          <button
            type="button"
            className="vehicle-edit-button"
            onClick={() => onEdit(vehicle)}
          >
            Edit
          </button>

          <button
            type="button"
            className="vehicle-delete-button"
            onClick={() => onDelete(vehicle)}
          >
            Delete
          </button>

          <button
            type="button"
            className="vehicle-view-button"
            onClick={() =>
              navigate(`/vehicles/${vehicle.id}`)
            }
          >
            View details
          </button>

        </div>

      </div>

    </article>
  );
}

export default VehicleCard;
