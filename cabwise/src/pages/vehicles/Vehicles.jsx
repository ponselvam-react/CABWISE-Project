import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import VehicleCard from "../../components/vehicles/VehicleCard";

function Vehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  useEffect(() => {

    const storedUser = localStorage.getItem("cabwiseUser");

    const currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;

    if (!currentUser) {
      console.error("User not found in local storage");
      return;
    }

    fetch(
      `http://localhost:3000/vehicles?userId=${currentUser.id}`
    )
      .then((response) => response.json())
      .then((data) => {

        console.log(
          "Vehicles from backend:",
          data
        );

        const formattedVehicles = data.map((vehicle) => ({
          id: vehicle.id,
          registrationNumber: vehicle.registration_number,
          model: vehicle.model,
          driver: vehicle.driver,
          odometer: `${vehicle.odometer} km`,
          status: vehicle.status,
          maintenance: vehicle.maintenance,
          maintenanceType: vehicle.maintenance_type
        }));

        setVehicles(formattedVehicles);

      })
      .catch((error) => {

        console.error(
          "Vehicle API error:",
          error
        );

      });

    fetch(
      `http://localhost:3000/maintenance?userId=${currentUser.id}`
    )
      .then((response) => response.json())
      .then((data) => {

        console.log(
          "Maintenance from backend:",
          data
        );

        const formattedMaintenance = data.map((record) => ({
          vehicleId: Number(record.vehicle_id),
          serviceType: record.service_type,
          scheduledDate: record.scheduled_date,
          lastServiceOdometer: Number(
            record.last_service_odometer
          ),
          currentOdometer: Number(
            record.current_odometer
          ),
          serviceInterval: Number(
            record.service_interval
          ),
          workflowStatus: record.workflow_status
        }));

        setMaintenanceRecords(formattedMaintenance);

      })
      .catch((error) => {

        console.error(
          "Maintenance API error:",
          error
        );

      });

  }, []);

  const vehicleMaintenance = maintenanceRecords.map((record) => {

    const nextServiceOdometer =
      record.lastServiceOdometer +
      record.serviceInterval;

    const remainingKm =
      nextServiceOdometer -
      record.currentOdometer;

    let status = "Upcoming";
    let priority = "Low";

    if (remainingKm <= 0) {

      status = "Overdue";
      priority = "Critical";

    } else if (remainingKm <= 500) {

      status = "Attention";
      priority = "High";

    } else if (remainingKm <= 1000) {

      status = "Upcoming";
      priority = "Normal";

    }

    let maintenanceState = "Healthy";

    if (status === "Attention") {
      maintenanceState = "Attention";
    }

    if (status === "Overdue") {
      maintenanceState = "Critical";
    }

    return {
      vehicleId: record.vehicleId,
      serviceType: record.serviceType,
      scheduledDate: record.scheduledDate,
      lastServiceOdometer:
        record.lastServiceOdometer,
      serviceInterval:
        record.serviceInterval,
      remainingKm,
      status,
      priority,
      maintenanceState
    };

  });

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [showDeleteVehicle, setShowDeleteVehicle] = useState(false);
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    registrationNumber: "",
    model: "",
    driver: "",
    odometer: "",
    status: "Available"
  });

  const filteredVehicles = useMemo(() => {

    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return vehicles.filter((vehicle) => {

      const matchesSearch =
        vehicle.registrationNumber
          .toLowerCase()
          .includes(normalizedSearch) ||

        vehicle.model
          .toLowerCase()
          .includes(normalizedSearch) ||

        vehicle.driver
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        vehicle.status
          .toLowerCase()
          .replace(/\s+/g, "-") === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [vehicles, searchTerm, statusFilter]);

  function handleInputChange(event) {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  }

  async function handleAddVehicle(event) {

    event.preventDefault();

    const storedUser = localStorage.getItem("cabwiseUser");

    const currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;

    if (!currentUser) {
      console.error("User not found in local storage");
      return;
    }

    const vehicleData = {
      registrationNumber:
        formData.registrationNumber.toUpperCase(),

      model:
        formData.model,

      driver:
        formData.driver,

      odometer:
        Number(formData.odometer),

      status:
        formData.status,

      userId:
        currentUser.id
    };

    try {

      const response = await fetch(
        "http://localhost:3000/vehicles",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(vehicleData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add vehicle"
        );
      }

      console.log(
        "Vehicle added:",
        data
      );

      const newVehicle = {
        id: data.vehicleId,

        registrationNumber:
          vehicleData.registrationNumber,

        model:
          vehicleData.model,

        driver:
          vehicleData.driver,

        odometer:
          `${vehicleData.odometer} km`,

        status:
          vehicleData.status,

        maintenance:
          "New vehicle",

        maintenanceType:
          "scheduled"
      };

      setVehicles((previous) => [
        ...previous,
        newVehicle
      ]);

      setFormData({
        registrationNumber: "",
        model: "",
        driver: "",
        odometer: "",
        status: "Available"
      });

      setShowAddVehicle(false);

    } catch (error) {

      console.error(
        "Add vehicle error:",
        error
      );

    }
  }

  const handleEditClick = (vehicle) => {

    setEditingVehicle({
      ...vehicle,
      odometer:
        vehicle.odometer.replace(" km", "")
    });

    setShowEditVehicle(true);

  };

  const handleDeleteClick = (vehicle) => {

    setDeletingVehicle(vehicle);
    setShowDeleteVehicle(true);

  };

  const handleConfirmDelete = async () => {

    const storedUser =
      localStorage.getItem("cabwiseUser");

    const currentUser =
      storedUser
        ? JSON.parse(storedUser)
        : null;

    if (!currentUser) {

      console.error(
        "User not found in local storage"
      );

      return;
    }

    try {

      const response = await fetch(
        `http://localhost:3000/vehicles/${deletingVehicle.id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            userId: currentUser.id
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to delete vehicle"
        );

      }

      console.log(
        "Vehicle deleted:",
        data
      );

      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (vehicle) =>
            vehicle.id !== deletingVehicle.id
        )
      );

      setShowDeleteVehicle(false);

      setDeletingVehicle(null);

    } catch (error) {

      console.error(
        "Delete vehicle error:",
        error
      );

    }
  };

  function closeModal() {

    setShowAddVehicle(false);

  }

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        <DashboardHeader />

        <div className="dashboard-content">

          {/* PAGE INTRODUCTION */}

          <section className="vehicles-introduction">

            <div>

              <p className="dashboard-eyebrow">
                FLEET MANAGEMENT
              </p>

              <h2>
                Vehicles
              </h2>

              <p>
                Manage your fleet, monitor vehicle status,
                and keep track of maintenance requirements.
              </p>

            </div>

            <button
              type="button"
              className="vehicle-add-button"
              onClick={() =>
                setShowAddVehicle(true)
              }
            >
              + Add Vehicle
            </button>

          </section>

          {/* VEHICLE SUMMARY */}

          <section className="vehicle-summary">

            <div className="vehicle-summary-card">

              <span>
                Total Vehicles
              </span>

              <strong>
                {vehicles.length}
              </strong>

            </div>

            <div className="vehicle-summary-card">

              <span>
                Available
              </span>

              <strong>
                {
                  vehicles.filter(
                    (vehicle) =>
                      vehicle.status === "Available"
                  ).length
                }
              </strong>

            </div>

            <div className="vehicle-summary-card">

              <span>
                On Trip
              </span>

              <strong>
                {
                  vehicles.filter(
                    (vehicle) =>
                      vehicle.status === "On Trip"
                  ).length
                }
              </strong>

            </div>

            <div className="vehicle-summary-card">

              <span>
                Maintenance
              </span>

              <strong>
                {
                  vehicles.filter(
                    (vehicle) =>
                      vehicle.status === "Maintenance"
                  ).length
                }
              </strong>

            </div>

          </section>

          {/* SEARCH & FILTER */}

          <section className="vehicle-toolbar">

            <div className="vehicle-search">

              <span>
                ⌕
              </span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search vehicle number, model or driver..."
                aria-label="Search vehicles"
              />

            </div>

            <select
              className="vehicle-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              aria-label="Filter vehicles by status"
            >

              <option value="all">
                All Status
              </option>

              <option value="available">
                Available
              </option>

              <option value="on-trip">
                On Trip
              </option>

              <option value="maintenance">
                Maintenance
              </option>

            </select>

          </section>

          {/* RESULT COUNT */}

          <div className="vehicle-result-info">

            Showing{" "}

            <strong>
              {filteredVehicles.length}
            </strong>{" "}

            of {vehicles.length} vehicles

          </div>

          {/* VEHICLE GRID */}

          <section className="vehicle-grid">

            {filteredVehicles.length > 0 ? (

              filteredVehicles.map((vehicle) => (

                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}

                  maintenance={vehicleMaintenance.find(
                    (item) =>
                      item.vehicleId === Number(vehicle.id)
                  )}

                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />

              ))

            ) : (

              <div className="vehicle-empty-state">

                <div className="vehicle-empty-icon">
                  ⌕
                </div>

                <h3>
                  No vehicles found
                </h3>

                <p>
                  Try changing your search term
                  or status filter.
                </p>

                <button
                  type="button"
                  className="vehicle-reset-button"
                  onClick={() => {

                    setSearchTerm("");
                    setStatusFilter("all");

                  }}
                >
                  Clear filters
                </button>

              </div>

            )}

          </section>

        </div>

      </main>

      {/* ADD VEHICLE MODAL */}

      {showAddVehicle && (

        <div
          className="vehicle-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeModal();

            }

          }}
        >

          <div className="vehicle-modal">

            <div className="vehicle-modal-header">

              <div>

                <p className="dashboard-eyebrow">
                  FLEET MANAGEMENT
                </p>

                <h2>
                  Add Vehicle
                </h2>

                <p>
                  Add a new vehicle to your fleet.
                </p>

              </div>

              <button
                type="button"
                className="vehicle-modal-close"
                onClick={closeModal}
                aria-label="Close add vehicle form"
              >
                ×
              </button>

            </div>

            <form
              className="vehicle-form"
              onSubmit={handleAddVehicle}
            >

              <div className="vehicle-form-grid">

                <div className="vehicle-form-group">

                  <label htmlFor="registrationNumber">
                    Registration Number
                  </label>

                  <input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    value={
                      formData.registrationNumber
                    }
                    onChange={handleInputChange}
                    placeholder="TN 57 XY 1234"
                    required
                  />

                </div>

                <div className="vehicle-form-group">

                  <label htmlFor="model">
                    Vehicle Model
                  </label>

                  <input
                    id="model"
                    name="model"
                    type="text"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Maruti Swift Dzire"
                    required
                  />

                </div>

                <div className="vehicle-form-group">

                  <label htmlFor="driver">
                    Driver Name
                  </label>

                  <input
                    id="driver"
                    name="driver"
                    type="text"
                    value={formData.driver}
                    onChange={handleInputChange}
                    placeholder="Driver name"
                    required
                  />

                </div>

                <div className="vehicle-form-group">

                  <label htmlFor="odometer">
                    Current Odometer
                  </label>

                  <div className="vehicle-input-with-unit">

                    <input
                      id="odometer"
                      name="odometer"
                      type="number"
                      min="0"
                      value={formData.odometer}
                      onChange={handleInputChange}
                      placeholder="45200"
                      required
                    />

                    <span>
                      km
                    </span>

                  </div>

                </div>

                <div className="vehicle-form-group vehicle-form-full">

                  <label htmlFor="status">
                    Vehicle Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="On Trip">
                      On Trip
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                  </select>

                </div>

              </div>

              <div className="vehicle-form-actions">

                <button
                  type="button"
                  className="vehicle-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="vehicle-submit-button"
                >
                  Add Vehicle
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* EDIT VEHICLE MODAL */}

      {showEditVehicle &&
        editingVehicle && (

          <div className="vehicle-modal-overlay">

            <div className="vehicle-modal">

              <div className="vehicle-modal-header">

                <div>

                  <p className="vehicle-modal-label">
                    FLEET MANAGEMENT
                  </p>

                  <h2>
                    Edit Vehicle
                  </h2>

                </div>

                <button
                  type="button"
                  className="vehicle-modal-close"
                  onClick={() => {

                    setShowEditVehicle(false);
                    setEditingVehicle(null);

                  }}
                >
                  ×
                </button>

              </div>

              <form
                className="vehicle-form"
                onSubmit={(event) =>
                  event.preventDefault()
                }
              >

                <div className="vehicle-form-group">

                  <label>
                    Registration Number
                  </label>

                  <input
                    type="text"
                    value={
                      editingVehicle.registrationNumber
                    }
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        registrationNumber:
                          e.target.value.toUpperCase()
                      })
                    }
                  />

                </div>

                <div className="vehicle-form-group">

                  <label>
                    Vehicle Model
                  </label>

                  <input
                    type="text"
                    value={
                      editingVehicle.model
                    }
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        model: e.target.value
                      })
                    }
                  />

                </div>

                <div className="vehicle-form-group">

                  <label>
                    Driver
                  </label>

                  <input
                    type="text"
                    value={
                      editingVehicle.driver
                    }
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        driver: e.target.value
                      })
                    }
                  />

                </div>

                <div className="vehicle-form-group">

                  <label>
                    Current Odometer
                  </label>

                  <div className="vehicle-input-with-unit">

                    <input
                      type="text"
                      value={
                        editingVehicle.odometer
                      }
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          odometer:
                            e.target.value
                        })
                      }
                    />

                    <span>
                      km
                    </span>

                  </div>

                </div>

                <div className="vehicle-form-group vehicle-form-full">

                  <label>
                    Status
                  </label>

                  <select
                    value={
                      editingVehicle.status
                    }
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        status: e.target.value
                      })
                    }
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="On Trip">
                      On Trip
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                  </select>

                </div>

                <div className="vehicle-modal-actions">

                  <button
                    type="button"
                    className="vehicle-secondary-action"
                    onClick={() => {

                      setShowEditVehicle(false);
                      setEditingVehicle(null);

                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="vehicle-primary-action"
                    onClick={async () => {

                      const storedUser =
                        localStorage.getItem(
                          "cabwiseUser"
                        );

                      const currentUser =
                        storedUser
                          ? JSON.parse(storedUser)
                          : null;

                      if (!currentUser) {

                        console.error(
                          "User not found in local storage"
                        );

                        return;
                      }

                      const updatedVehicle = {

                        registrationNumber:
                          editingVehicle.registrationNumber
                            .toUpperCase(),

                        model:
                          editingVehicle.model,

                        driver:
                          editingVehicle.driver,

                        odometer:
                          Number(
                            editingVehicle.odometer
                          ),

                        status:
                          editingVehicle.status,

                        userId:
                          currentUser.id
                      };

                      try {

                        const response =
                          await fetch(
                            `http://localhost:3000/vehicles/${editingVehicle.id}`,
                            {
                              method: "PUT",

                              headers: {
                                "Content-Type":
                                  "application/json"
                              },

                              body: JSON.stringify(
                                updatedVehicle
                              )
                            }
                          );

                        const data =
                          await response.json();

                        if (!response.ok) {

                          throw new Error(
                            data.error ||
                            "Failed to update vehicle"
                          );

                        }

                        console.log(
                          "Vehicle updated:",
                          data
                        );

                        setVehicles(
                          (currentVehicles) =>
                            currentVehicles.map(
                              (vehicle) =>
                                vehicle.id ===
                                  editingVehicle.id
                                  ? {
                                    ...editingVehicle,

                                    registrationNumber:
                                      updatedVehicle.registrationNumber,

                                    model:
                                      updatedVehicle.model,

                                    driver:
                                      updatedVehicle.driver,

                                    odometer:
                                      `${updatedVehicle.odometer} km`,

                                    status:
                                      updatedVehicle.status
                                  }

                                  : vehicle
                            )
                        );

                        setShowEditVehicle(false);

                        setEditingVehicle(null);

                      } catch (error) {

                        console.error(
                          "Update vehicle error:",
                          error
                        );

                      }

                    }}
                  >
                    Save Changes
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      {/* DELETE VEHICLE MODAL */}

      {showDeleteVehicle &&
        deletingVehicle && (

          <div className="vehicle-modal-overlay">

            <div className="vehicle-delete-modal">

              <div className="vehicle-delete-icon">
                !
              </div>

              <div className="vehicle-delete-content">

                <h2>
                  Delete Vehicle?
                </h2>

                <p>

                  Are you sure you want to delete{" "}

                  <strong>
                    {
                      deletingVehicle.registrationNumber
                    }
                  </strong>

                  ?

                </p>

                <span>
                  This action will remove the vehicle
                  from your fleet list.
                </span>

              </div>

              <div className="vehicle-delete-actions">

                <button
                  type="button"
                  className="vehicle-secondary-action"
                  onClick={() => {

                    setShowDeleteVehicle(false);
                    setDeletingVehicle(null);

                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="vehicle-delete-confirm-button"
                  onClick={handleConfirmDelete}
                >
                  Delete Vehicle
                </button>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}

export default Vehicles;