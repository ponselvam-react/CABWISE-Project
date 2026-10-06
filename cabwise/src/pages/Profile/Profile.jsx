import { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import "./Profile.css";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem("cabwiseUser");

        if (!storedUser) {
            console.error("User not found in local storage");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        console.log("Profile current user:", currentUser);

        setUser(currentUser);

    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-main">
                <DashboardHeader
                    title="User Profile"
                    subtitle="View and manage your account information."
                />

                <div className="dashboard-content">
                    <section className="dashboard-section">
                        <div className="dashboard-section-header">
                            <div>
                                <p className="dashboard-section-eyebrow">
                                    ACCOUNT
                                </p>

                                <h3>User Profile</h3>

                                <p>
                                    Your personal and account information.
                                </p>
                            </div>
                        </div>

                        <div className="profile-card">
                            <div className="profile-avatar">
                                {user?.full_name?.charAt(0) || "U"}
                            </div>

                            <div className="profile-info">
                                <div className="profile-field">
                                    <span>Full Name</span>
                                    <strong>
                                        {user?.full_name || "Loading..."}
                                    </strong>
                                </div>

                                <div className="profile-field">
                                    <span>Email</span>
                                    <strong>
                                        {user?.email || "Loading..."}
                                    </strong>
                                </div>

                                <div className="profile-field">
                                    <span>Phone Number</span>
                                    <strong>
                                        {user?.phone || "Loading..."}
                                    </strong>
                                </div>

                                <div className="profile-field">
                                    <span>Account Type</span>
                                    <strong>
                                        {user?.account_type || "Loading..."}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Profile;