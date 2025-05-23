import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaUserCog,
  FaFileAlt,
  FaSearch,
  FaDatabase,
  FaCheckCircle,
  FaChevronRight,
  FaBell,
  FaTrash,
  FaEye,
  FaTimes,
  FaRegFileAlt,
} from "react-icons/fa";
import "./Management.css";
import api, { endpoints } from "../../utils/api";

function Management() {
  const [activeItem, setActiveItem] = useState("Account Validation");
  const [criminals, setCriminals] = useState([]);
  const [newCriminal, setNewCriminal] = useState({
    name: "",
    address: "",
    cases: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("public");
  const [users, setUsers] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmationUsername, setConfirmationUsername] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showRegulationsModal, setShowRegulationsModal] = useState(false);


  const menuItems = [
    { name: "Account Validation", icon: <FaShieldAlt /> },
    { name: "User Management", icon: <FaUserCog /> },
    { name: "Analytics Dashboard", icon: <FaCheckCircle /> },
    { name: "Database Management", icon: <FaDatabase /> },
    { name: "Protocol Guideline", icon: <FaRegFileAlt /> },
  ];

  // Fetch users when the component mounts or when selectedRole changes
  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the admin users endpoint with role query parameter
      const response = await api.get(
        `${endpoints.admin.users}?role=${selectedRole}`
      );

      if (response.data && response.data.success) {
        setUsers(response.data.users);
      } else {
        throw new Error(response.data?.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
      // Fallback to sample data for demo purposes
      setUsers(
        [
          {
            id: 1,
            role: "public",
            username: "john_doe",
            email: "john@example.com",
            phone: "123-456-7890",
            address: "123 Main St",
          },
          {
            id: 2,
            role: "public",
            username: "jane_smith",
            email: "jane@example.com",
            phone: "987-654-3210",
            address: "456 Oak Ave",
          },
          {
            id: 3,
            role: "police",
            policeId: "P1001",
            username: "officer_brown",
            email: "brown@police.gov",
            phone: "555-123-4567",
            department: "Traffic",
          },
          {
            id: 4,
            role: "police",
            policeId: "P1002",
            username: "detective_miller",
            email: "miller@police.gov",
            phone: "555-987-6543",
            department: "Criminal Investigation",
          },
        ].filter((user) => user.role === selectedRole)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (itemName) => {
    setActiveItem(itemName);
    if (itemName === "Analytics Dashboard") navigate("/admin/analytics");
    if (itemName === "Database Management") navigate("/admin/database");
  };

  const handleAddCriminal = (e) => {
    e.preventDefault();
    setCriminals([...criminals, newCriminal]);
    setNewCriminal({ name: "", address: "", cases: "" });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setSearchTerm("");
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
  };

  const handleCloseModal = () => {
    setViewingUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      if (confirmationUsername !== viewingUser.username) {
        setDeleteError("Username does not match");
        return;
      }

      const response = await api.delete(
        endpoints.admin.deleteUser(viewingUser.id)
      );

      if (response.data && response.data.success) {
        setUsers(users.filter((user) => user.id !== viewingUser.id));
        setViewingUser(null);
        setShowDeleteConfirmation(false);
        alert("User deleted successfully");
      } else {
        throw new Error(response.data?.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    } finally {
      setConfirmationUsername("");
      setDeleteError("");
    }
  };

  const filteredUsers = users.filter((user) => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="management-container">
      <aside className={`sidebar expanded`}>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={activeItem === item.name ? "active" : ""}
              onClick={() => handleNavigation(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
              <FaChevronRight className="menu-arrow" />
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        {activeItem === "Account Validation" && (
          <div className="validation-container">
            <div className="validation-header">
              <h3>Officer Verification Protocol</h3>
              <span className="badge">Priority</span>
            </div>

            <ul className="instructions-list">
              <li>
                <div className="instruction-icon">
                  <FaShieldAlt />
                </div>
                <div>
                  <strong>Verify Official Police ID</strong>
                  <p>Check authenticity against government databases.</p>
                </div>
              </li>
              <li>
                <div className="instruction-icon">
                  <FaDatabase />
                </div>
                <div>
                  <strong>Backend Data Cross-Matching</strong>
                  <p>
                    Cross-reference officer details with our secure backend
                    records for consistency.
                  </p>
                </div>
              </li>

              <button
                className="view-request-btn"
                onClick={() => navigate("/admin/validations")}
              >
                <FaFileAlt /> View Pending Requests
              </button>
            </ul>
          </div>
        )}

{activeItem === "Protocol Guideline" && (
  <div className="protocol-container">
    <h3>Admin Protocol Guidelines</h3>
    <ul className="protocol-list">
      <li>
        <strong> User Data Privacy:</strong> Admins must ensure no user data is misused or shared without proper authorization.
      </li>
      <li>
        <strong>Officer Verification:</strong> Every police officer must be authenticated using NID and official department credentials.
      </li>
      <li>
        <strong> Real-Time Monitoring:</strong> Admins should periodically monitor flagged reports and high-risk zones.
      </li>
      <li>
        <strong> Deletion Protocol:</strong> Deletion of any user must go through confirmation and logging procedures.
      </li>
      <li>
        <strong> Geo-Fencing Compliance:</strong> Ensure geo-alert triggers are accurately aligned with map-based coordinates.
      </li>
    </ul>

    <button
      className="view-regulations-btn"
      onClick={() => setShowRegulationsModal(true)}
    >
      📜 All Rules and Regulations
    </button>

    {showRegulationsModal && (
      <div className="user-modal-overlay">
        <div className="user-modal">
          <div className="modal-header-protocal">
            <h2>All Rules & Regulations</h2>
            <button
              className="close-btn"
              onClick={() => setShowRegulationsModal(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="modal-content-mng">
            <ul className="rules-list">
              <li>✅ Maintain system integrity and prevent unauthorized access.</li>
              <li>✅ Regularly audit crime data reports for inconsistencies.</li>
              <li>✅ Notify local police when user-validated alerts hit the threshold.</li>
              <li>✅ Do not hard-delete crime records; use soft-delete for traceability.</li>
              <li>✅ Escalate issues involving sensitive crimes to the central authority.</li>
              <li>✅ Be fair, impartial, and data-driven in all decision-making.</li>
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="close-modal-btn"
              onClick={() => setShowRegulationsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}


        {showDeleteConfirmation && (
          <div className="user-modal-overlay">
            <div className="confirmation-modal">
              <div className="modal-header">
                <h3>Confirm Deletion</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-content-mng">
                <p className="warning-text">
                  <FaBell className="warning-icon" />
                  This action cannot be undone. Please type the username to
                  confirm.
                </p>
                <div className="confirmation-input">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={confirmationUsername}
                    onChange={(e) => {
                      setConfirmationUsername(e.target.value);
                      setDeleteError("");
                    }}
                    placeholder="Enter username to confirm"
                  />
                  {deleteError && (
                    <span className="error-text">{deleteError}</span>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="confirm-delete-btn"
                  onClick={handleDeleteUser}
                  disabled={!confirmationUsername}
                >
                  <FaTrash /> Confirm Deletion
                </button>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeItem === "User Management" && (
          <div className="user-management-container">
            <h3>User Management</h3>

            <div className="role-selector">
              <label
                className={`role-option ${
                  selectedRole === "public" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={selectedRole === "public"}
                  onChange={() => handleRoleChange("public")}
                />
                Public Users
              </label>
              <label
                className={`role-option ${
                  selectedRole === "police" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={selectedRole === "police"}
                  onChange={() => handleRoleChange("police")}
                />
                Police Officers
              </label>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <div className="user-list">
              {loading ? (
                <div className="loading-indicator">Loading users...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div className="user-item" key={user.id}>
                    <span>
                      {selectedRole === "public"
                        ? `${user.username} (${user.email})`
                        : `${user.username} (${user.email})${
                            user.policeId ? ` - ID: ${user.policeId}` : ""
                          }`}
                    </span>
                    <div className="user-actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewUser(user)}
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  No users found matching your search criteria
                </div>
              )}
            </div>

            {viewingUser && (
              <div className="user-modal-overlay">
                <div className="user-modal">
                  <div className="modal-header">
                    <h3>User Details</h3>
                    <button className="close-btn" onClick={handleCloseModal}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="modal-content-mng">
                    <div className="user-details">
                      <div className="detail-row">
                        <span className="label">Username:</span>
                        <span className="value">{viewingUser.username}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Email:</span>
                        <span className="value">{viewingUser.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Phone:</span>
                        <span className="value">
                          {viewingUser.phone || viewingUser.mobile_no}
                        </span>
                      </div>

                      {viewingUser.role === "public" ? (
                        <div className="detail-row">
                          <span className="label">Address:</span>
                          <span className="value">{viewingUser.address}</span>
                        </div>
                      ) : (
                        <>
                          <div className="detail-row">
                            <span className="label">Police ID:</span>
                            <span className="value">
                              {viewingUser.policeId}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Department:</span>
                            <span className="value">
                              {viewingUser.department || viewingUser.station}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setViewingUser(null);
                        setShowDeleteConfirmation(true);
                        setConfirmationUsername("");
                        setDeleteError("");
                      }}
                    >
                      <FaTrash /> Delete Account
                    </button>
                    <button
                      className="close-modal-btn"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Management;
