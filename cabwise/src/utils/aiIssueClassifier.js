export function classifyIssue(title, description) {
    const text = `${title} ${description}`.toLowerCase();

    if (
        text.includes("brake") ||
        text.includes("braking") ||
        text.includes("brake sound")
    ) {
        return {
            category: "Brake",
            priority: "High",
            attention: "Immediate inspection recommended",
            reason: "Brake-related issue detected. Unusual brake sounds may require prompt inspection."
        };
    }

    if (
        text.includes("engine") ||
        text.includes("vibration") ||
        text.includes("overheat") ||
        text.includes("smoke")
    ) {
        return {
            category: "Engine",
            priority: "High",
            attention: "Vehicle should be inspected soon",
            reason: "Engine-related symptoms detected. Vibration, overheating, or smoke may require inspection."
        };
    }

    if (
        text.includes("tyre") ||
        text.includes("tire") ||
        text.includes("puncture") ||
        text.includes("pressure")
    ) {
        return {
            category: "Tyre",
            priority: "Medium",
            attention: "Check tyre condition and pressure",
            reason: "Tyre-related symptoms detected. Pressure or tyre condition should be checked."
        };
    }

    if (
        text.includes("ac") ||
        text.includes("air conditioning") ||
        text.includes("cooling")
    ) {
        return {
            category: "AC",
            priority: "Low",
            attention: "Inspection recommended",
            reason: "AC or cooling-related issue detected."
        };
    }

    if (
        text.includes("battery") ||
        text.includes("warning light") ||
        text.includes("electrical") ||
        text.includes("dashboard")
    ) {
        return {
            category: "Electrical",
            priority: "Medium",
            attention: "Electrical system inspection recommended",
            reason: "Electrical or dashboard warning symptoms detected."
        };
    }

    return {
        category: "Other",
        priority: "Low",
        attention: "Further inspection required",
        reason: "The reported symptoms did not match a specific issue category."
    };
}