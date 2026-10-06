export function getIssuePriorityLabel(priority) {
    if (priority === "High") {
        return "High Attention";
    }

    if (priority === "Medium") {
        return "Monitor";
    }

    return "Low Attention";
}