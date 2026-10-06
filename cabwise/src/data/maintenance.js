const maintenanceRecords = [
  {
    id: 1,
    vehicleId: 1,
    serviceType: "Engine Oil Service",
    lastServiceOdometer: 45000,
    currentOdometer: 48620,
    serviceInterval: 5000,
    workflowStatus: "Scheduled",
    scheduledDate: "2026-09-30",
    notes: "Engine oil and oil filter replacement"
  },

  {
    id: 2,
    vehicleId: 2,
    serviceType: "Brake Inspection",
    lastServiceOdometer: 55000,
    currentOdometer: 61650,
    serviceInterval: 7000,
    workflowStatus: "In Progress",
    scheduledDate: "2026-09-27",
    notes: "Brake system inspection recommended"
  },

  {
    id: 3,
    vehicleId: 3,
    serviceType: "General Service",
    lastServiceOdometer: 70000,
    currentOdometer: 75080,
    serviceInterval: 5000,
    workflowStatus: "Scheduled",
    scheduledDate: "2026-09-29",
    notes: "General inspection and scheduled service"
  },

  {
    id: 4,
    vehicleId: 4,
    serviceType: "Tyre Inspection",
    lastServiceOdometer: 36000,
    currentOdometer: 38410,
    serviceInterval: 5000,
    workflowStatus: "Completed",
    scheduledDate: "2026-09-20",
    notes: "Check tyre condition, pressure and tread"
  },
  {
    id: 5,
    vehicleId: 5,
    serviceType: "General Service",
    lastServiceOdometer: 50000,
    currentOdometer: 52180,
    serviceInterval: 5000,
    workflowStatus: "Scheduled",
    scheduledDate: "2026-10-02",
    notes: "Routine general service"
  },

  {
    id: 6,
    vehicleId: 6,
    serviceType: "Engine Inspection",
    lastServiceOdometer: 65000,
    currentOdometer: 67430,
    serviceInterval: 5000,
    workflowStatus: "Scheduled",
    scheduledDate: "2026-10-03",
    notes: "Engine inspection and routine check"
  }

];

export default maintenanceRecords;