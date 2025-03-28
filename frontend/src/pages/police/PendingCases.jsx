import React from 'react';
import PropTypes from 'prop-types';
import './CasesCommon.css';

// Dummy pending cases data
const dummyCases = [
  {
    id: 'PC-2023-001',
    title: 'Armed Robbery at City Bank',
    reportedDate: '2023-10-15T08:30:00',
    location: 'Dhaka-Motijheel',
    status: 'Under Investigation',
    priority: 'High'
  },
  {
    id: 'PC-2023-002',
    title: 'Hit and Run Accident',
    reportedDate: '2023-10-16T14:20:00',
    location: 'Dhaka-Gulshan Avenue',
    status: 'Evidence Collection',
    priority: 'Medium'
  },
  {
    id: 'PC-2023-003',
    title: 'Shop Burglary Report',
    reportedDate: '2023-10-17T22:45:00',
    location: 'Dhaka-Dhanmondi Rd 8',
    status: 'Initial Review',
    priority: 'Medium'
  },
  {
    id: 'PC-2023-004',
    title: 'Cyber Crime Complaint',
    reportedDate: '2023-10-18T11:15:00',
    location: 'Online',
    status: 'Digital Forensics',
    priority: 'High'
  },
  {
    id: 'PC-2023-005',
    title: 'Domestic Violence Case',
    reportedDate: '2023-10-19T09:30:00',
    location: 'Dhaka-Mirpur Sec 12',
    status: 'Witness Interviews',
    priority: 'Urgent'
  },
  {
    id: 'PC-2023-006',
    title: 'Drug Possession Arrest',
    reportedDate: '2023-10-20T16:50:00',
    location: 'Dhaka-Kamalapur Station',
    status: 'Evidence Processing',
    priority: 'High'
  },
  {
    id: 'PC-2023-007',
    title: 'Public Property Vandalism',
    reportedDate: '2023-10-21T13:10:00',
    location: 'Dhaka-Shahbagh Park',
    status: 'Suspect Identification',
    priority: 'Low'
  }
];

const PendingCases = ({ cases = dummyCases }) => {
  return (
    <div className="cases-container pending-cases">
      <h2 className="cases-header">Pending Cases ({cases.length})</h2>
      <div className="cases-list">
        {cases && cases.length > 0 ? (
          cases.map((caseItem) => (
            <div key={caseItem.id} className="case-card pending">
              <div className="case-header">
                <h3 className="case-title">{caseItem.title}</h3>
                <span className={`priority-badge ${caseItem.priority.toLowerCase()}`}>
                  {caseItem.priority}
                </span>
              </div>
              <p className="case-detail">
                <strong>Case ID:</strong> {caseItem.id}
              </p>
              <p className="case-detail">
                <strong>Reported:</strong> 
                {new Date(caseItem.reportedDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="case-detail">
                <strong>Location:</strong> {caseItem.location}
              </p>
              <div className="status-container">
                <p className="case-detail">
                  <strong>Status:</strong>
                  <span className="status-badge">{caseItem.status}</span>
                </p>
              </div>
              <div className="case-actions">
                <button className="action-btn view-btn">
                  <i className="fas fa-file-alt"></i> View Details
                </button>
                <button className="action-btn resolve-btn">
                  <i className="fas fa-check-circle"></i> Mark Resolved
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-cases">No pending cases found</p>
        )}
      </div>
    </div>
  );
};

PendingCases.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      reportedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      location: PropTypes.string,
      status: PropTypes.string,
      priority: PropTypes.oneOf(['Low', 'Medium', 'High', 'Urgent'])
    })
  )
};

PendingCases.defaultProps = {
  cases: dummyCases
};

export default PendingCases;