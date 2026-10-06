import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

function ForgotPassword() {
    return (
        <main className="auth-page">

            <div className="auth-container">

                <div className="auth-card">

                    <div className="auth-brand">
                        <div className="brand-mark">C</div>
                        <span>CABWISE</span>
                    </div>


                    <div className="auth-heading">

                        <h1>Forgot password?</h1>

                        <p>
                            Enter your email address and we will help
                            you reset your password.
                        </p>

                    </div>


                    <form className="auth-form">

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                            />

                        </div>


                        <Button>
                            Send Reset Link
                        </Button>

                    </form>


                    <p className="auth-footer">

                        Remember your password?{" "}

                        <Link to="/login">
                            Back to Sign In
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}

export default ForgotPassword;