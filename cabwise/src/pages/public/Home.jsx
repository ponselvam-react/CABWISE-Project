import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="container navbar-content">

          <div className="brand">
            <div className="brand-mark">C</div>
            <span>CABWISE</span>
          </div>

          <div className="nav-links">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
          </div>

          <div className="nav-actions">

            <Button
              variant="secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>

          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="container hero-content">

          <div className="hero-text fade-up">

            <span className="hero-label">
              AI-POWERED FLEET OPERATIONS
            </span>

            <h1>
              Prevent Fleet Downtime
              <span> Before It Happens.</span>
            </h1>

            <p>
              CABWISE helps small and medium-sized fleet operators
              detect vehicle issues early, understand risks and take
              action before problems become costly downtime.
            </p>

            <div className="hero-actions">

              <Button
                variant="primary"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See How It Works
              </Button>

            </div>

          </div>


          {/* ================= DASHBOARD PREVIEW ================= */}

          <div className="hero-visual">

            <div className="dashboard-card float">

              <div className="dashboard-header">

                <div>
                  <small>Fleet Overview</small>
                  <h3>Today's Status</h3>
                </div>

                <span className="status-online">
                  ● Live
                </span>

              </div>


              <div className="dashboard-stats">

                <div className="mini-card">
                  <span>Total Vehicles</span>
                  <strong>30</strong>
                </div>

                <div className="mini-card">
                  <span>Available</span>
                  <strong>18</strong>
                </div>

                <div className="mini-card warning-card">
                  <span>Attention</span>
                  <strong>03</strong>
                </div>

              </div>


              <div className="attention-box">

                <div>

                  <div className="attention-dot"></div>

                  <div>
                    <strong>
                      TN57 AB 1234
                    </strong>

                    <p>
                      Service attention required
                    </p>
                  </div>

                </div>

                <span className="arrow">
                  →
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= PROBLEM ================= */}

      <section
        className="problem-section"
        id="problem"
      >

        <div className="container">

          <div className="section-heading">

            <span>
              THE PROBLEM
            </span>

            <h2>
              Fleet problems often become visible
              <br />
              only after they become expensive.
            </h2>

            <p>
              Important vehicle information is often scattered
              across maintenance records, driver messages and
              manual tracking.
            </p>

          </div>


          <div className="problem-grid">

            <div className="problem-card">

              <div className="problem-number">
                01
              </div>

              <h3>
                Scattered Information
              </h3>

              <p>
                Vehicle details, service history and driver-reported
                issues may exist in different places.
              </p>

            </div>


            <div className="problem-card">

              <div className="problem-number">
                02
              </div>

              <h3>
                Late Detection
              </h3>

              <p>
                Small vehicle issues can remain unnoticed until
                they affect vehicle availability.
              </p>

            </div>


            <div className="problem-card">

              <div className="problem-number">
                03
              </div>

              <h3>
                Reactive Decisions
              </h3>

              <p>
                Fleet managers may have to react to problems
                instead of preparing for them early.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SOLUTION ================= */}

      <section
        className="solution-section"
        id="solution"
      >

        <div className="container solution-content">

          <div className="solution-text">

            <span className="section-label">
              THE CABWISE APPROACH
            </span>

            <h2>
              From vehicle data to
              <br />
              meaningful action.
            </h2>

            <p>
              CABWISE connects information from vehicles,
              drivers and maintenance activities to help
              fleet managers make timely decisions.
            </p>

          </div>


          <div className="solution-flow">

            <div className="flow-item">

              <span>01</span>

              <strong>
                Collect
              </strong>

              <p>
                Vehicle data, odometer readings,
                maintenance history and driver reports.
              </p>

            </div>


            <div className="flow-line"></div>


            <div className="flow-item">

              <span>02</span>

              <strong>
                Understand
              </strong>

              <p>
                AI helps structure and classify
                driver-reported vehicle issues.
              </p>

            </div>


            <div className="flow-line"></div>


            <div className="flow-item">

              <span>03</span>

              <strong>
                Act
              </strong>

              <p>
                Managers can create maintenance
                tasks and assign required actions.
              </p>

            </div>


            <div className="flow-line"></div>


            <div className="flow-item">

              <span>04</span>

              <strong>
                Resolve
              </strong>

              <p>
                Track the issue until the vehicle
                is verified and available again.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="container">

          <div className="section-heading center">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              A simple operational workflow.
            </h2>

          </div>


          <div className="workflow-grid">

            <div className="workflow-card">

              <span>
                01
              </span>

              <h3>
                Driver Reports
              </h3>

              <p>
                A driver reports an unusual vehicle issue.
              </p>

            </div>


            <div className="workflow-card">

              <span>
                02
              </span>

              <h3>
                AI Understands
              </h3>

              <p>
                The system structures the reported issue.
              </p>

            </div>


            <div className="workflow-card">

              <span>
                03
              </span>

              <h3>
                Manager Acts
              </h3>

              <p>
                The fleet manager reviews and creates an action.
              </p>

            </div>


            <div className="workflow-card">

              <span>
                04
              </span>

              <h3>
                Issue Resolves
              </h3>

              <p>
                Maintenance is completed and the vehicle status
                is updated.
              </p>

            </div>

          </div>

        </div>

      </section>


      <section className="home-features" id="features">
        <div className="home-section-heading">
          <span>FLEET OPERATIONS</span>
          <h2>Everything you need to keep your fleet moving.</h2>
          <p>
            CABWISE brings vehicles, maintenance, drivers and reported
            issues into one connected fleet operations system.
          </p>
        </div>

        <div className="home-features-grid">

          <div className="home-feature-card">
            <span>01</span>
            <h3>Vehicle Management</h3>
            <p>
              Monitor vehicle details, status and odometer information
              from one place.
            </p>
          </div>

          <div className="home-feature-card">
            <span>02</span>
            <h3>Maintenance Tracking</h3>
            <p>
              Track service requirements and identify vehicles that
              need maintenance attention.
            </p>
          </div>

          <div className="home-feature-card">
            <span>03</span>
            <h3>Driver Issue Reporting</h3>
            <p>
              Allow drivers to report unusual vehicle problems and
              operational issues.
            </p>
          </div>

          <div className="home-feature-card">
            <span>04</span>
            <h3>AI Issue Understanding</h3>
            <p>
              Structure and classify driver-reported vehicle issues
              to support faster decisions.
            </p>
          </div>

          <div className="home-feature-card">
            <span>05</span>
            <h3>Fleet Attention</h3>
            <p>
              Highlight vehicles and issues that require the fleet
              manager's attention.
            </p>
          </div>

          <div className="home-feature-card">
            <span>06</span>
            <h3>Reports</h3>
            <p>
              Review maintenance and issue history to understand
              fleet operations over time.
            </p>
          </div>

        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta-content">
          <span>GET STARTED</span>

          <h2>
            Take control of your fleet operations.
          </h2>

          <p>
            Bring vehicle information, maintenance, drivers and
            reported issues into one connected system with CABWISE.
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="home-cta-button"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div className="container footer-content">

          <div className="footer-brand">
            <div className="brand">
              <div className="brand-mark">C</div>
              <span>CABWISE</span>
            </div>

            <p>AI-Powered Fleet Downtime Prevention System</p>
          </div>

          <div className="footer-links">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
          </div>

          <p className="footer-copy">
            © 2026 CABWISE
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;