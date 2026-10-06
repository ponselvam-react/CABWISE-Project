function VehicleStatusBadge({ status }) {
  const statusClass = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`vehicle-status-badge ${statusClass}`}>
      {status}
    </span>
  );
}

export default VehicleStatusBadge;