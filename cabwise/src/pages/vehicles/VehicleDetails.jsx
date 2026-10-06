import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import VehicleStatusBadge from "../../components/vehicles/VehicleStatusBadge";

const vehicles = [
  {
    id: 1,
    registrationNumber: "TN 57 AB 2846",
    model: "Maruti Swift Dzire",
    driver: "Arun Kumar",
    odometer: "48,620 km",
    status: "Available",
    maintenance: "Service in 380 km",
    maintenanceType: "upcoming"
  },
  {
    id: 2,
    registrationNumber: "TN 57 CD 9132",
    model: "Maruti Ertiga",
    driver: "Suresh Kumar",
    odometer: "61,240 km",
    status: "On Trip",
    maintenance: "Attention required",
    maintenanceType: "attention"
  },
  {
    id: 3,
    registrationNumber: "TN 57 EF 6418",
    model: "Toyota Etios",
    driver: "Vijay Raj",
    odometer: "72,850 km",
    status: "Maintenance",
    maintenance: "Service in 920 km",
    maintenanceType: "upcoming"
  },
  {
    id: 4,
    registrationNumber: "TN 57 GH 3187",
    model: "Hyundai Aura",
    driver: "Prakash",
    odometer: "38,410 km",
    status: "Available",
    maintenance: "Scheduled",
    maintenanceType: "scheduled"
  },
  {
    id: 5,
    registrationNumber: "TN 57 JK 5204",
    model: "Maruti Baleno",
    driver: "Dinesh",
    odometer: "52,180 km",
    status: "Available",
    maintenance: "Service in 1,120 km",
    maintenanceType: "upcoming"
  },
  {
    id: 6,
    registrationNumber: "TN 57 LM 7461",
    model: "Hyundai Xcent",
    driver: "Karthik",
    odometer: "67,430 km",
    status: "On Trip",
    maintenance: "Service in 540 km",
    maintenanceType: "upcoming"
  }
];

function VehicleDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const vehicle = vehicles.find(
    (item) => item.id === Number(id)
  );


  if (!vehicle) {
    return (
      <div className="dashboard-layout">

        <Sidebar />

        <main className="dashboard-main">

          <DashboardHeader />

          <div className="dashboard-content">

            <div className="vehicle-not-found">

              <div className="vehicle-not-found-icon">
                !
              </div>

              <h2>
                Vehicle Not Found
              </h2>

              <p>
                The vehicle you are looking for does not exist.
              </p>

              <button
                type="button"
                onClick={() => navigate("/vehicles")}
                className="vehicle-back-button"
              >
                ← Back to Vehicles
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }


  return (
    <div className="dashboard-layout">

      <Sidebar />


      <main className="dashboard-main">

        <DashboardHeader />


        <div className="dashboard-content">


          {/* PAGE HEADER */}

          <section className="vehicle-details-introduction">

            <div>

              <button
                type="button"
                className="vehicle-details-back"
                onClick={() => navigate("/vehicles")}
              >
                ← Back to Vehicles
              </button>

              <p className="dashboard-eyebrow">
                VEHICLE MANAGEMENT
              </p>

              <h2>
                {vehicle.registrationNumber}
              </h2>

              <p>
                Detailed vehicle information and
                maintenance overview.
              </p>

            </div>


            <VehicleStatusBadge
              status={vehicle.status}
            />

          </section>



          {/* VEHICLE OVERVIEW */}

          <section className="vehicle-details-grid">


            <article className="vehicle-details-card">

              <div className="vehicle-details-card-header">

                <div className="vehicle-details-icon">
                  🚗
                </div>

                <div>
                  <span>Vehicle</span>

                  <h3>
                    Vehicle Information
                  </h3>
                </div>

              </div>


              <div className="vehicle-information-list">

                <div className="vehicle-information-item">
                  <span>Registration Number</span>
                  <strong>
                    {vehicle.registrationNumber}
                  </strong>
                </div>


                <div className="vehicle-information-item">
                  <span>Vehicle Model</span>
                  <strong>
                    {vehicle.model}
                  </strong>
                </div>


                <div className="vehicle-information-item">
                  <span>Assigned Driver</span>
                  <strong>
                    {vehicle.driver}
                  </strong>
                </div>


                <div className="vehicle-information-item">
                  <span>Current Odometer</span>
                  <strong>
                    {vehicle.odometer}
                  </strong>
                </div>

              </div>

            </article>



            {/* MAINTENANCE */}

            <article className="vehicle-details-card">

              <div className="vehicle-details-card-header">

                <div className="vehicle-details-icon maintenance-icon">
                  ⚙
                </div>

                <div>
                  <span>Maintenance</span>

                  <h3>
                    Maintenance Status
                  </h3>
                </div>

              </div>


              <div className="vehicle-maintenance-highlight">

                <span>
                  Current Status
                </span>

                <strong className={`maintenance-text ${vehicle.maintenanceType}`}>
                  {vehicle.maintenance}
                </strong>

              </div>


              <div className="vehicle-information-list">

                <div className="vehicle-information-item">
                  <span>Last Service</span>
                  <strong>
                    45,000 km
                  </strong>
                </div>


                <div className="vehicle-information-item">
                  <span>Next Service</span>
                  <strong>
                    49,000 km
                  </strong>
                </div>


                <div className="vehicle-information-item">
                  <span>Remaining</span>
                  <strong>
                    380 km
                  </strong>
                </div>

              </div>

            </article>

          </section>



          {/* VEHICLE ACTIVITY */}

          <section className="vehicle-details-card vehicle-activity-card">

            <div className="vehicle-details-section-header">

              <div>

                <span>RECENT ACTIVITY</span>

                <h3>
                  Vehicle Activity
                </h3>

              </div>

            </div>


            <div className="vehicle-detail-activity-list">


              <div className="vehicle-detail-activity-item">

                <div className="vehicle-detail-activity-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Vehicle inspection completed
                  </strong>

                  <span>
                    Today · 09:30 AM
                  </span>
                </div>

              </div>


              <div className="vehicle-detail-activity-item">

                <div className="vehicle-detail-activity-icon">
                  ⚙
                </div>

                <div>
                  <strong>
                    Maintenance reminder generated
                  </strong>

                  <span>
                    Yesterday · 04:20 PM
                  </span>
                </div>

              </div>


              <div className="vehicle-detail-activity-item">

                <div className="vehicle-detail-activity-icon">
                  🚗
                </div>

                <div>
                  <strong>
                    Vehicle trip completed
                  </strong>

                  <span>
                    Yesterday · 01:15 PM
                  </span>
                </div>

              </div>


            </div>

          </section>



          {/* ACTIONS */}

          <section className="vehicle-detail-actions">

            <button
              type="button"
              className="vehicle-secondary-action"
              onClick={() => navigate("/vehicles")}
            >
              ← Back to Vehicles
            </button>


            <button
              type="button"
              className="vehicle-primary-action"
            >
              Schedule Maintenance
            </button>

          </section>


        </div>

      </main>

    </div>
  );
}

export default VehicleDetails;