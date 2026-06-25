import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching directly from the public folder
    fetch('/master_dashboard_data.json')
      .then(res => res.json())
      .then(data => {
        // Load the first 50 items for UI performance
        setInventory(data.slice(0, 50)); 
        setLoading(false);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  // Helper function to safely parse the Python string array "['Action 1', 'Action 2']"
  const getTopAction = (actionString) => {
    if (!actionString) return "Review manually";
    try {
      const formattedStr = actionString.replace(/'/g, '"');
      const parsedArray = JSON.parse(formattedStr);
      return parsedArray[0]; // Return the first, highest-priority action
    } catch (e) {
      return actionString; // Fallback to raw text if parsing fails
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading ML Pipeline Data...</div>;

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Conformal Risk Triage Dashboard</h1>
      </div>

      <div className="grid-layout">
        {inventory.map((item, index) => {
          const riskLevel = item.risk_level?.toUpperCase() || 'UNKNOWN';
          const isHighRisk = riskLevel === 'CRITICAL' || riskLevel === 'HIGH';
          const topAction = getTopAction(item.recommended_actions);

          return (
            <div className="card" key={index}>
              
              {/* HEADER WITH EXPLICIT RISK TAG */}
              <div className="card-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="item-id">{item.item_id.split('_validation')[0]}</span>
                  
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    width: 'max-content',
                    background: isHighRisk ? '#fde8e8' : riskLevel === 'MEDIUM' ? '#fef08a' : '#def7ec',
                    color: isHighRisk ? '#9b1c1c' : riskLevel === 'MEDIUM' ? '#713f12' : '#03543f',
                    border: '1px solid currentColor'
                  }}>
                    RISK: {riskLevel}
                  </span>
                </div>
                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Day {item.day_index}</span>
              </div>

              {/* CORE FORECAST METRICS */}
              <div className="metric-group">
                <div className="metric">
                  <span className="metric-label">Median Forecast</span>
                  <span className="metric-value">{Number(item.median_q50).toFixed(2)}</span>
                </div>
                <div className="metric" style={{alignItems: 'flex-end'}}>
                  <span className="metric-label">Safe Upper Bound</span>
                  <span className="metric-value">{Number(item.conformal_upper_q90).toFixed(2)}</span>
                </div>
              </div>

              <div className="metric-group" style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)'}}>
                <div className="metric">
                  <span className="metric-label" style={{color: 'var(--primary)'}}>Recommended Order Qty</span>
                  <span className="metric-value" style={{color: 'var(--primary)'}}>{item.recommended_order_qty} units</span>
                </div>
              </div>

              {/* PURE RISK DECOMPOSITION */}
              <div className="risk-section">
                <div className="risk-title">Pure Risk Breakdown</div>
                <div className="risk-row">
                  <span>Volatility:</span>
                  <span style={{fontWeight: '600'}}>{item.risk_driver_demand_volatility}%</span>
                </div>
                <div className="risk-row">
                  <span>Seasonality:</span>
                  <span style={{fontWeight: '600'}}>{item.risk_driver_seasonality_and_events}%</span>
                </div>
                <div className="risk-row">
                  <span>Data Reliability:</span>
                  <span style={{fontWeight: '600'}}>{item.risk_driver_data_reliability}%</span>
                </div>
              </div>

              {/* ACTIONABLE MEASURE PILL */}
              <div className={`action-pill ${isHighRisk ? 'action-urgent' : 'action-safe'}`}>
                <span style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>
                  AI Recommendation
                </span>
                {topAction}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;