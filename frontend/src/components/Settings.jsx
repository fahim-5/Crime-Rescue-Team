import React, { useState } from 'react';
import { FiUser, FiShield, FiAlertTriangle, FiEdit2, FiX, FiCheck, FiLock, FiMail, FiPhone, FiMapPin, FiCreditCard } from 'react-icons/fi';
import styles from './Settings.module.css';

const Settings = () => {
  const [userData, setUserData] = useState({
    id: 'USR-2023-001',
    username: 'crimefighter123',
    email: 'user@crime-rescue-bd.com',
    fullName: 'Abdul Rahman',
    phone: '+8801712345678',
    nid: '1990123456789',
    address: '123 Mirpur Road, Dhaka',
    joinDate: '15 Jan 2022',
    lastLogin: '2 hours ago'
  });

  const [editMode, setEditMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempUserData, setTempUserData] = useState({...userData});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUserData({
      ...tempUserData,
      [name]: value
    });
  };

  const handleSaveChanges = () => {
    setUserData(tempUserData);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setTempUserData({...userData});
    setEditMode(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to permanently delete your account? All data will be irreversibly removed.')) {
      alert('Account deletion request received');
    }
  };

  return (
    <div className={styles.fullScreenContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>Manage your profile and security preferences</p>
        </header>
        
        <div className={styles.mainGrid}>
          {/* Left Column - Profile Overview */}
          <section className={`${styles.section} ${styles.profileSection}`}>
            <div className={styles.sectionHeader}>
              <FiUser className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Profile Overview</h2>
            </div>
            
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {userData.fullName.charAt(0)}
              </div>
              
              <div className={styles.profileInfo}>
                <h3>{userData.fullName}</h3>
                <p className={styles.profileMeta}>@{userData.username}</p>
                <p className={styles.profileMeta}>Member since {userData.joinDate}</p>
                <p className={styles.profileMeta}>Last active {userData.lastLogin}</p>
                
                <button 
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => setShowProfileModal(true)}
                >
                  <FiEdit2 /> Edit Profile
                </button>
              </div>
            </div>
          </section>

          {/* Right Column - Security and Danger Zone */}
          <div className={styles.rightColumn}>
            <section className={`${styles.section} ${styles.securitySection}`}>
              <div className={styles.sectionHeader}>
                <FiShield className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Account Security</h2>
              </div>
              
              <div className={styles.securityGrid}>
                <div className={styles.securityItem}>
                  <div className={styles.securityIcon}>
                    <FiLock />
                  </div>
                  <div>
                    <h3>Password</h3>
                    <p className={styles.securityStatus}>Last changed 3 months ago</p>
                  </div>
                  <button className={`${styles.button} ${styles.primaryButton} ${styles.smallButton}`}>
                    Change
                  </button>
                </div>
                
                <div className={styles.securityItem}>
                  <div className={styles.securityIcon}>
                    <FiShield />
                  </div>
                  <div>
                    <h3>Two-Factor Authentication</h3>
                    <p className={styles.securityStatus}>Currently disabled</p>
                  </div>
                  <button className={`${styles.button} ${styles.primaryButton} ${styles.smallButton}`}>
                    Enable
                  </button>
                </div>
              </div>
            </section>

            <section className={`${styles.section} ${styles.dangerZone}`}>
              <div className={styles.sectionHeader}>
                <FiAlertTriangle className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Danger Zone</h2>
              </div>
              <p className={styles.warningText}>Permanent actions that cannot be undone</p>
              <button 
                className={`${styles.button} ${styles.dangerButton}`}
                onClick={handleDeleteAccount}
              >
                <FiAlertTriangle /> Delete Account
              </button>
            </section>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Edit Profile</h2>
                <button 
                  className={styles.closeButton}
                  onClick={() => {
                    setShowProfileModal(false);
                    setEditMode(false);
                  }}
                >
                  <FiX />
                </button>
              </div>
              
              <div className={styles.modalBody}>
                {editMode ? (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={tempUserData.fullName}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={tempUserData.email}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={tempUserData.phone}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Address</label>
                      <textarea
                        name="address"
                        value={tempUserData.address}
                        onChange={handleInputChange}
                        className={`${styles.input} ${styles.textarea}`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>Full Name:</span>
                      <span className={styles.fieldValue}>{userData.fullName}</span>
                    </div>
                    
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>Username:</span>
                      <span className={styles.fieldValue}>{userData.username}</span>
                    </div>
                    
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>Email:</span>
                      <span className={styles.fieldValue}>{userData.email}</span>
                    </div>
                    
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>Phone:</span>
                      <span className={styles.fieldValue}>{userData.phone}</span>
                    </div>
                    
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>NID:</span>
                      <span className={styles.fieldValue}>{userData.nid}</span>
                    </div>
                    
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>Address:</span>
                      <span className={styles.fieldValue}>{userData.address}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className={styles.modalFooter}>
                {editMode ? (
                  <>
                    <button 
                      className={`${styles.button} ${styles.primaryButton}`}
                      onClick={handleSaveChanges}
                    >
                      <FiCheck /> Save Changes
                    </button>
                    <button 
                      className={`${styles.button} ${styles.secondaryButton}`}
                      onClick={handleCancelEdit}
                    >
                      <FiX /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className={`${styles.button} ${styles.primaryButton}`}
                      onClick={() => setEditMode(true)}
                    >
                      <FiEdit2 /> Edit Profile
                    </button>
                    <button 
                      className={`${styles.button} ${styles.secondaryButton}`}
                      onClick={() => setShowProfileModal(false)}
                    >
                      <FiX /> Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;