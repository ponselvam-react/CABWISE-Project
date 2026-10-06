import { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

function Settings() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        console.log("Settings current user:", currentUser);

        setUser(currentUser);
    }, []);

    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">

                <DashboardHeader
                    title="Settings"
                    subtitle="Manage your account and application preferences."
                />

                <section className="dashboard-section">

                    <div className="dashboard-section-header">
                        <div>
                            <p className="dashboard-section-eyebrow">
                                ACCOUNT SETTINGS
                            </p>

                            <h3>Profile & Preferences</h3>

                            <p>
                                Manage your profile information, notifications,
                                and account security.
                            </p>
                        </div>
                    </div>


                    {/* Profile */}
                    <div className="settings-card">

                        <div className="settings-card-header">
                            <div>
                                <p className="settings-card-eyebrow">
                                    PROFILE
                                </p>

                                <h4>Personal Information</h4>

                                <p>
                                    Your basic account information.
                                </p>
                            </div>
                        </div>

                        <div className="settings-grid">

                            <div className="settings-field">
                                <span>Full Name</span>
                                <strong>{user?.full_name || "Loading..."}</strong>
                            </div>

                            <div className="settings-field">
                                <span>Email Address</span>
                                <strong>{user?.email || "Loading..."}</strong>
                            </div>

                            <div className="settings-field">
                                <span>Phone Number</span>
                                <strong>{user?.phone || "Loading..."}</strong>
                            </div>

                            <div className="settings-field">
                                <span>Account Type</span>
                                <strong>{user?.account_type || "Loading..."}</strong>
                            </div>

                        </div>

                    </div>


                    {/* Notification Preferences */}
                    <div className="settings-card">

                        <div className="settings-card-header">
                            <div>
                                <p className="settings-card-eyebrow">
                                    NOTIFICATIONS
                                </p>

                                <h4>Notification Preferences</h4>

                                <p>
                                    Choose the fleet updates you want to receive.
                                </p>
                            </div>
                        </div>

                        <div className="settings-options">

                            <div className="settings-option">
                                <div>
                                    <strong>Maintenance Alerts</strong>

                                    <p>
                                        Receive alerts when vehicles require maintenance.
                                    </p>
                                </div>

                                <span className="settings-status active">
                                    Enabled
                                </span>
                            </div>

                            <div className="settings-option">
                                <div>
                                    <strong>Issue Alerts</strong>

                                    <p>
                                        Receive notifications for reported vehicle issues.
                                    </p>
                                </div>

                                <span className="settings-status active">
                                    Enabled
                                </span>
                            </div>

                            <div className="settings-option">
                                <div>
                                    <strong>Fleet Activity</strong>

                                    <p>
                                        Receive important updates about fleet activity.
                                    </p>
                                </div>

                                <span className="settings-status active">
                                    Enabled
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* Security */}
                    <div className="settings-card">

                        <div className="settings-card-header">
                            <div>
                                <p className="settings-card-eyebrow">
                                    SECURITY
                                </p>

                                <h4>Account Security</h4>

                                <p>
                                    Manage your account security information.
                                </p>
                            </div>
                        </div>

                        <div className="settings-security">

                            <div>
                                <strong>Password</strong>

                                <p>
                                    Your account password is protected.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="settings-action-button"
                            >
                                Change Password
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Settings;