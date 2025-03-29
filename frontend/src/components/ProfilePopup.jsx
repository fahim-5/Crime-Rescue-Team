// import React, { forwardRef } from "react";
// import { useAuth } from "../c";
// import "./ProfilePopup.css";

// const ProfilePopup = forwardRef(({ isOpen, onClose }, ref) => {
//   const { user, logout } = useAuth();
//   const handlePopupClick = (e) => e.stopPropagation();

//   const handleLogout = (e) => {
//     e.stopPropagation();
//     logout();
//     onClose();
//   };

//   if (!user) return null;

//   return (
//     <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
//       <div 
//         className={`profile-popup ${isOpen ? 'active' : ''}`} 
//         ref={ref}
//         onClick={handlePopupClick}
//       >
//         <div className="profile-header">
//           <h2>{user.name}</h2>
//           <span className="rank">{user.status}</span>
//         </div>
//         <div className="profile-details">
//           <div className="detail-item">
//             <span className="detail-label">Username:</span>
//             <span className="detail-value">{user.username}</span>
//           </div>
//           <div className="detail-item">
//             <span className="detail-label">Status:</span>
//             <span className="detail-value">{user.status}</span>
//           </div>
//           <div className="detail-item">
//             <span className="detail-label">Earned Points:</span>
//             <span className="detail-value">{user.points}</span>
//           </div>
//         </div>
//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// });

// export default ProfilePopup;