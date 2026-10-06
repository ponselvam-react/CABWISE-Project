export function calculateMaintenance(record) {

    const nextServiceOdometer =
        record.lastServiceOdometer + record.serviceInterval;

    const remainingKm =
        nextServiceOdometer - record.currentOdometer;

    let status = "Upcoming";
    let priority = "Low";

    if (remainingKm <= 0) {

        status = "Overdue";
        priority = "Critical";

    } else if (remainingKm <= 500) {

        status = "Attention";
        priority = "High";

    } else if (remainingKm <= 1000) {

        status = "Upcoming";
        priority = "Normal";

    } else {

        status = "Upcoming";
        priority = "Low";

    }

    let maintenanceState = "Healthy";

    if (status === "Attention") {
        maintenanceState = "Attention";
    }

    if (status === "Overdue") {
        maintenanceState = "Critical";
    }

    return {

        nextServiceOdometer,

        remainingKm,

        status,

        priority,

        maintenanceState

    };
}