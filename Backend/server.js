const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const bcrypt = require("bcryptjs");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
    res.send("CABWISE Backend Running");
});


// ==========================================
// VEHICLES
// ==========================================

// GET VEHICLES - USER WISE

app.get("/vehicles", (req, res) => {

    const userId = req.query.userId;

    const sql = `
        SELECT *
        FROM vehicles
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });
});


// ADD VEHICLE

app.post("/vehicles", (req, res) => {

    const {
        registrationNumber,
        model,
        driver,
        odometer,
        status,
        userId
    } = req.body;

    const sql = `
        INSERT INTO vehicles
        (
            registration_number,
            model,
            driver,
            odometer,
            status,
            maintenance,
            maintenance_type,
            user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        registrationNumber,
        model,
        driver,
        odometer,
        status,
        "New vehicle",
        "scheduled",
        userId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Vehicle added successfully",
            vehicleId: result.insertId
        });

    });
});


// UPDATE VEHICLE - USER OWNERSHIP CHECK

app.put("/vehicles/:id", (req, res) => {

    const vehicleId = req.params.id;

    const {
        registrationNumber,
        model,
        driver,
        odometer,
        status,
        userId
    } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        UPDATE vehicles
        SET
            registration_number = ?,
            model = ?,
            driver = ?,
            odometer = ?,
            status = ?
        WHERE id = ? AND user_id = ?
    `;

    const values = [
        registrationNumber,
        model,
        driver,
        odometer,
        status,
        vehicleId,
        userId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Vehicle not found or does not belong to this user"
            });
        }

        res.json({
            message: "Vehicle updated successfully"
        });

    });
});


// DELETE VEHICLE - USER OWNERSHIP CHECK

app.delete("/vehicles/:id", (req, res) => {

    const vehicleId = req.params.id;

    const userId = req.body?.userId;

    console.log("Delete vehicle request:", {
        vehicleId,
        userId
    });

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        DELETE FROM vehicles
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [vehicleId, userId],
        (err, result) => {

            if (err) {

                console.log(
                    "DELETE VEHICLE ERROR:",
                    err.message
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Vehicle not found or does not belong to this user"
                });
            }

            res.json({
                message: "Vehicle deleted successfully"
            });

        }
    );

});


// ==========================================
// DRIVERS
// ==========================================

// GET DRIVERS - USER WISE

app.get("/drivers", (req, res) => {

    const userId = req.query.userId;

    const sql = `
        SELECT *
        FROM drivers
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });
});


// ADD DRIVER

app.post("/drivers", (req, res) => {

    const {
        name,
        phone,
        licenseNumber,
        licenseExpiry,
        assignedVehicleId,
        status,
        userId
    } = req.body;

    const sql = `
        INSERT INTO drivers
        (
            name,
            phone,
            license_number,
            license_expiry,
            assigned_vehicle_id,
            status,
            user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        phone,
        licenseNumber,
        licenseExpiry,
        assignedVehicleId || null,
        status,
        userId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Driver added successfully",
            driverId: result.insertId
        });

    });
});


// UPDATE DRIVER

app.put("/drivers/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        phone,
        licenseNumber,
        licenseExpiry,
        assignedVehicleId,
        status,
        userId
    } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        UPDATE drivers
        SET name = ?,
            phone = ?,
            license_number = ?,
            license_expiry = ?,
            assigned_vehicle_id = ?,
            status = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [
            name,
            phone,
            licenseNumber,
            licenseExpiry,
            assignedVehicleId,
            status,
            id,
            userId
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Update driver error:",
                    err
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Driver not found"
                });
            }

            res.json({
                message: "Driver updated successfully"
            });
        }
    );
});


// DELETE DRIVER

app.delete("/drivers/:id", (req, res) => {

    const id = req.params.id;

    const userId = req.body?.userId;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        DELETE FROM drivers
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [id, userId],
        (err, result) => {

            if (err) {
                console.error(
                    "Delete driver error:",
                    err
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Driver not found"
                });
            }

            res.json({
                message: "Driver deleted successfully"
            });
        }
    );
});


// ==========================================
// MAINTENANCE
// ==========================================

// GET MAINTENANCE - USER WISE

app.get("/maintenance", (req, res) => {

    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        SELECT *
        FROM maintenance
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error(
                "Get maintenance error:",
                err
            );

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });
});

// ADD MAINTENANCE

app.post("/maintenance", (req, res) => {

    const {
        vehicleId,
        userId,
        serviceType,
        lastServiceOdometer,
        currentOdometer,
        serviceInterval,
        workflowStatus,
        scheduledDate,
        notes
    } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    if (!vehicleId) {
        return res.status(400).json({
            error: "Vehicle ID is required"
        });
    }

    // Check whether this vehicle belongs to this user
    const checkVehicleSql = `
        SELECT id
        FROM vehicles
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        checkVehicleSql,
        [vehicleId, userId],
        (err, vehicleResult) => {

            if (err) {
                console.error(
                    "Vehicle ownership check error:",
                    err
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            if (vehicleResult.length === 0) {
                return res.status(403).json({
                    error: "Vehicle does not belong to this user"
                });
            }

            // Vehicle belongs to user, so create maintenance
            const sql = `
                INSERT INTO maintenance
                (
                    vehicle_id,
                    user_id,
                    service_type,
                    last_service_odometer,
                    current_odometer,
                    service_interval,
                    workflow_status,
                    scheduled_date,
                    notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                vehicleId,
                userId,
                serviceType,
                lastServiceOdometer || 0,
                currentOdometer || 0,
                serviceInterval || 5000,
                workflowStatus || "Scheduled",
                scheduledDate || null,
                notes || "Scheduled maintenance"
            ];

            db.query(sql, values, (err, result) => {

                if (err) {
                    console.error(
                        "Create maintenance error:",
                        err
                    );

                    return res.status(500).json({
                        error: err.message
                    });
                }

                res.status(201).json({
                    message: "Maintenance scheduled successfully",
                    maintenanceId: result.insertId
                });

            });

        }
    );

});
// UPDATE MAINTENANCE

app.put("/maintenance/:id", (req, res) => {

    const maintenanceId = req.params.id;

    const {
        userId,
        serviceType,
        scheduledDate,
        notes
    } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        UPDATE maintenance
        SET
            service_type = ?,
            scheduled_date = ?,
            notes = ?
        WHERE id = ?
        AND user_id = ?
    `;

    const values = [
        serviceType,
        scheduledDate || null,
        notes || null,
        maintenanceId,
        userId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(
                "Update maintenance error:",
                err
            );

            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                error: "Maintenance record not found"
            });
        }

        res.json({
            message: "Maintenance updated successfully"
        });

    });

});

// START MAINTENANCE

app.put("/maintenance/:id/start", (req, res) => {

    const maintenanceId = req.params.id;
    const userId = req.body?.userId;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        UPDATE maintenance
        SET workflow_status = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        ["In Progress", maintenanceId, userId],
        (err, result) => {

            if (err) {

                console.error(
                    "Start maintenance error:",
                    err
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    error: "Maintenance record not found"
                });
            }

            res.json({
                message: "Maintenance started successfully"
            });

        }
    );

});

// COMPLETE MAINTENANCE

app.put("/maintenance/:id/complete", (req, res) => {

    const maintenanceId = req.params.id;

    const {
        userId,
        completedOdometer
    } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        UPDATE maintenance
        SET
            workflow_status = ?,
            current_odometer = ?,
            last_service_odometer = ?
        WHERE id = ?
        AND user_id = ?
    `;

    const odometer = Number(completedOdometer) || 0;

    const values = [
        "Completed",
        odometer,
        odometer,
        maintenanceId,
        userId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(
                "Complete maintenance error:",
                err
            );

            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                error: "Maintenance record not found"
            });
        }

        res.json({
            message: "Maintenance completed successfully"
        });

    });

});

app.delete("/vehicles/:id", (req, res) => {

    const vehicleId = req.params.id;
    const userId = req.body?.userId;

    console.log("Delete vehicle request:", {
        vehicleId,
        userId
    });

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    // Start MySQL transaction
    db.beginTransaction((transactionError) => {

        if (transactionError) {
            console.log(
                "TRANSACTION START ERROR:",
                transactionError.message
            );

            return res.status(500).json({
                error: transactionError.message
            });
        }

        // 1. Clear driver assignment
        const clearDriverSql = `
            UPDATE drivers
            SET assigned_vehicle_id = NULL
            WHERE assigned_vehicle_id = ?
            AND user_id = ?
        `;

        db.query(
            clearDriverSql,
            [vehicleId, userId],
            (driverError) => {

                if (driverError) {
                    return db.rollback(() => {
                        console.log(
                            "DRIVER UPDATE ERROR:",
                            driverError.message
                        );

                        res.status(500).json({
                            error: driverError.message
                        });
                    });
                }

                // 2. Delete maintenance records
                const deleteMaintenanceSql = `
                    DELETE FROM maintenance
                    WHERE vehicle_id = ?
                    AND user_id = ?
                `;

                db.query(
                    deleteMaintenanceSql,
                    [vehicleId, userId],
                    (maintenanceError) => {

                        if (maintenanceError) {
                            return db.rollback(() => {
                                console.log(
                                    "MAINTENANCE DELETE ERROR:",
                                    maintenanceError.message
                                );

                                res.status(500).json({
                                    error: maintenanceError.message
                                });
                            });
                        }

                        // 3. Delete issues related to vehicle
                        const deleteIssuesSql = `
                            DELETE FROM issues
                            WHERE vehicle_id = ?
                            AND user_id = ?
                        `;

                        db.query(
                            deleteIssuesSql,
                            [vehicleId, userId],
                            (issueError) => {

                                if (issueError) {
                                    return db.rollback(() => {
                                        console.log(
                                            "ISSUE DELETE ERROR:",
                                            issueError.message
                                        );

                                        res.status(500).json({
                                            error: issueError.message
                                        });
                                    });
                                }

                                // 4. Finally delete vehicle
                                const deleteVehicleSql = `
                                    DELETE FROM vehicles
                                    WHERE id = ?
                                    AND user_id = ?
                                `;

                                db.query(
                                    deleteVehicleSql,
                                    [vehicleId, userId],
                                    (vehicleError, result) => {

                                        if (vehicleError) {
                                            return db.rollback(() => {
                                                console.log(
                                                    "VEHICLE DELETE ERROR:",
                                                    vehicleError.message
                                                );

                                                res.status(500).json({
                                                    error: vehicleError.message
                                                });
                                            });
                                        }

                                        if (result.affectedRows === 0) {
                                            return db.rollback(() => {
                                                res.status(404).json({
                                                    error:
                                                        "Vehicle not found or does not belong to this user"
                                                });
                                            });
                                        }

                                        // 5. Everything successful
                                        db.commit((commitError) => {

                                            if (commitError) {
                                                return db.rollback(() => {
                                                    console.log(
                                                        "COMMIT ERROR:",
                                                        commitError.message
                                                    );

                                                    res.status(500).json({
                                                        error: commitError.message
                                                    });
                                                });
                                            }

                                            console.log(
                                                "Vehicle and related data deleted successfully"
                                            );

                                            res.json({
                                                message:
                                                    "Vehicle and related data deleted successfully"
                                            });

                                        });

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    });

});

// ==========================================
// ISSUES
// ==========================================

// GET ISSUES

app.get("/issues", (req, res) => {

    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        SELECT *
        FROM issues
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error("Get issues error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });
});


// ADD ISSUE

app.post("/issues", (req, res) => {

    const {
        title,
        description,
        category,
        priority,
        status,
        vehicleId,
        driverId,
        userId,
        reportedBy,
        attention,
        aiReason
    } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        INSERT INTO issues
        (
            title,
            description,
            category,
            priority,
            status,
            vehicle_id,
            driver_id,
            user_id,
            reported_by,
            attention,
            ai_reason
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        description,
        category,
        priority,
        status || "Open",
        vehicleId || null,
        driverId || null,
        userId,
        reportedBy || null,
        attention || null,
        aiReason || null
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error("Create issue error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Issue reported successfully",
            issueId: result.insertId
        });

    });

});


// ACKNOWLEDGE ISSUE

// ACKNOWLEDGE ISSUE - USER OWNERSHIP CHECK

app.put("/issues/:id/acknowledge", (req, res) => {

    const issueId = req.params.id;
    const userId = req.body?.userId;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const sql = `
        UPDATE issues
        SET status = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        ["Acknowledged", issueId, userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Issue not found or does not belong to this user"
                });
            }

            res.json({
                message: "Issue acknowledged successfully"
            });

        }
    );

});


// RESOLVE ISSUE

// RESOLVE ISSUE - USER OWNERSHIP CHECK

app.put("/issues/:id/resolve", (req, res) => {

    const issueId = req.params.id;
    const userId = req.body?.userId;

    if (!userId) {
        return res.status(400).json({
            error: "User ID is required"
        });
    }

    const resolvedDate = new Date()
        .toISOString()
        .split("T")[0];

    const sql = `
        UPDATE issues
        SET
            status = ?,
            resolved_date = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        ["Resolved", resolvedDate, issueId, userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Issue not found or does not belong to this user"
                });
            }

            res.json({
                message: "Issue resolved successfully",
                resolvedDate: resolvedDate
            });

        }
    );

});


// ==========================================
// USERS
// ==========================================

app.get("/users", (req, res) => {

    const sql = `
        SELECT *
        FROM users
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });

});


// ==========================================
// LOGIN
// ==========================================

app.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = result[0];

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            res.json({

                message: "Login successful",

                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone,
                    account_type: user.account_type
                }

            });

        }
    );

});


// ==========================================
// REGISTER
// ==========================================

app.post("/register", async (req, res) => {

    const {
        fullName,
        phone,
        email,
        password,
        accountType
    } = req.body;

    if (
        !fullName ||
        !phone ||
        !email ||
        !password ||
        !accountType
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (password.length !== 8) {
        return res.status(400).json({
            message: "Password must be exactly 8 characters"
        });
    }

    const allowedAccountTypes = [
        "Fleet Owner",
        "Driver",
        "Workshop Staff"
    ];

    if (!allowedAccountTypes.includes(accountType)) {
        return res.status(400).json({
            message: "Invalid account type"
        });
    }

    try {

        const checkSql = `
            SELECT *
            FROM users
            WHERE email = ?
        `;

        db.query(
            checkSql,
            [email],
            async (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });
                }

                if (result.length > 0) {
                    return res.status(409).json({
                        message: "Email already registered"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );

                const insertSql = `
                    INSERT INTO users
                    (
                        full_name,
                        email,
                        phone,
                        account_type,
                        password
                    )
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        fullName,
                        email,
                        phone,
                        accountType,
                        hashedPassword
                    ],
                    (err, result) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Registration failed",
                                error: err.message
                            });
                        }

                        res.status(201).json({

                            message:
                                "Registration successful",

                            user: {
                                id: result.insertId,
                                full_name: fullName,
                                email: email,
                                phone: phone,
                                account_type: accountType
                            }

                        });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});