import React from 'react';
import PropTypes from 'prop-types';
import './CasesCommon.css';

// Dummy resolved cases data
const dummyCases = [
  {
    id: 'RC-1001',
    title: 'Burglary at Central Market',
    resolvedDate: '2023-05-15T10:30:00',
    location: 'Dhaka-Mirpur',
    status: 'Closed'
  },
  {
    id: 'RC-1002',
    title: 'Vehicle Theft Case',
    resolvedDate: '2023-06-22T14:45:00',
    location: 'Dhaka-Gulshan',
    status: 'Closed'
  },
  {
    id: 'RC-1002',
    title: 'Vehicle Theft Case',
    resolvedDate: '2023-06-22T14:45:00',
    location: 'Dhaka-Gulshan',
    status: 'Closed'
  },
  {
    id: 'RC-1003',
    title: 'Cyber Fraud Investigation',
    resolvedDate: '2023-07-10T09:15:00',
    location: 'Dhaka-Dhanmondi',
    status: 'Closed'
  },
  {
    id: 'RC-1002',
    title: 'Vehicle Theft Case',
    resolvedDate: '2023-06-22T14:45:00',
    location: 'Dhaka-Gulshan',
    status: 'Closed'
  },
  {
    id: 'RC-1002',
    title: 'Vehicle Theft Case',
    resolvedDate: '2023-06-22T14:45:00',
    location: 'Dhaka-Gulshan',
    status: 'Closed'
  },
  {
    id: 'RC-1004',
    title: 'Public Disturbance Complaint',
    resolvedDate: '2023-08-05T16:20:00',
    location: 'Dhaka-Uttara',
    status: 'Closed'
  }
];

const ResolvedCases = ({ cases = dummyCases }) => {
  return (
    <div className="cases-container resolved-cases">
      <h2 className="cases-header">Resolved Cases</h2>
      <div className="cases-list">
        {cases && cases.length > 0 ? (
          cases.map((caseItem) => (
            <div key={caseItem.id} className="case-card resolved">
              <h3 className="case-title">{caseItem.title || 'Untitled Case'}</h3>
              <p className="case-detail"><strong>Case ID:</strong> {caseItem.id || 'N/A'}</p>
              <p className="case-detail">
                <strong>Resolved On:</strong> {caseItem.resolvedDate ? new Date(caseItem.resolvedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Date not available'}
              </p>
              <p className="case-detail"><strong>Location:</strong> {caseItem.location || 'Location not specified'}</p>
              <p className="case-detail"><strong>Status:</strong> 
                <span className="status-badge">{caseItem.status || 'Closed'}</span>
              </p>
              <div className="case-actions">
                <button className="action-btn view-btn">View Case Details</button>
                <button className="action-btn reopen-btn">Reopen Case</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-cases">No resolved cases found</p>
        )}
      </div>
    </div>
  );
};

ResolvedCases.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      resolvedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      location: PropTypes.string,
      status: PropTypes.string
    })
  )
};

ResolvedCases.defaultProps = {
  cases: dummyCases // Default to our dummy data
};

export default ResolvedCases;