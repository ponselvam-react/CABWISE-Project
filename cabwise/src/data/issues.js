const issues = [
  {
    id: 1,
    vehicleId: 1,
    driverId: 1,
    title: "Unusual brake noise",
    description:
      "Brake apply pannumbothu unusual sound varudhu. Please check the brake system.",
    category: "Brake",
    priority: "High",
    status: "Open",
    reportedDate: "2026-09-27"
  },
  {
    id: 2,
    vehicleId: 2,
    driverId: 2,
    title: "Engine vibration",
    description:
      "While driving, vehicle has noticeable vibration from the engine side.",
    category: "Engine",
    priority: "Medium",
    status: "Acknowledged",
    reportedDate: "2026-09-26"
  },
  {
    id: 3,
    vehicleId: 3,
    driverId: 3,
    title: "Tyre pressure warning",
    description:
      "Front tyre pressure appears lower than normal.",
    category: "Tyre",
    priority: "Medium",
    status: "Open",
    reportedDate: "2026-09-25"
  },
  {
    id: 4,
    vehicleId: 4,
    driverId: 4,
    title: "AC cooling issue",
    description:
      "AC cooling is lower than usual during the trip.",
    category: "AC",
    priority: "Low",
    status: "Resolved",
    reportedDate: "2026-09-23",
    resolvedDate: "2026-09-24"
  },
  {
    id: 5,
    vehicleId: 5,
    driverId: 5,
    title: "Dashboard warning light",
    description:
      "A warning light appeared on the dashboard while driving.",
    category: "Electrical",
    priority: "High",
    status: "Open",
    reportedDate: "2026-09-27"
  }
];

export default issues;