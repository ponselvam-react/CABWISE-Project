import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        // Password must be exactly 8 characters
        if (password.length !== 8) {
            setError("Password must be exactly 8 characters");
            return;
        }

        // Account type must be selected
        if (!accountType) {
            setError("Please select an account type");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:3000/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        fullName: fullName,
                        phone: phone,
                        email: email,
                        password: password,
                        accountType: accountType
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Registration failed"
                );
                return;
            }

            console.log(
                "Registration successful:",
                data.user
            );

            navigate("/login");

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                "Unable to connect to server. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-container">

                <div className="auth-card">

                    <div className="auth-brand">
                        <div className="brand-mark">C</div>
                        <span>CABWISE</span>
                    </div>


                    <div className="auth-heading">

                        <h1>Create your account</h1>

                        <p>
                            Start managing your fleet with CABWISE.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleRegister}
                    >

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                id="phone"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                maxLength={10}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your Gmail address"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                                title="Please enter a valid Gmail address ending with @gmail.com"
                                required
                            />

                        </div>



                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                placeholder="Create an 8-character password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                maxLength={8}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="role">
                                Account Type
                            </label>

                            <select
                                id="role"
                                value={accountType}
                                onChange={(e) =>
                                    setAccountType(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Select account type
                                </option>

                                <option value="Fleet Owner">
                                    Fleet Owner
                                </option>

                                <option value="Driver">
                                    Driver
                                </option>

                            </select>

                        </div>


                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}


                        <Button>
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </Button>

                    </form>


                    <p className="auth-footer">

                        Already have an account?{" "}

                        <Link to="/login">
                            Sign in
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}

export default Register;
