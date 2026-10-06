import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:3000/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            console.log("Login successful:", data.user);

            localStorage.setItem(
                "cabwiseUser",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

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
                        <h1>Welcome back</h1>

                        <p>
                            Sign in to manage your fleet operations.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleLogin}
                    >

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="auth-options">

                            <label className="remember-me">

                                <input type="checkbox" />

                                <span>
                                    Remember me
                                </span>

                            </label>

                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>

                        </div>


                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}


                        <Button>
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </Button>

                    </form>


                    <p className="auth-footer">

                        Don't have an account?{" "}

                        <Link to="/register">
                            Create account
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}

export default Login;