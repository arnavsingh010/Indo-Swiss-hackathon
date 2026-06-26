import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import './Dashboard.css'; // Importing the CSS file you just made!

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [expandedCard, setExpandedCard] = useState(null); 

  useEffect(() => {
    // Fetches your local JSON file directly from the public folder
    fetch('./master_dashboard_data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Filter out completely empty rows 
          const validData = data.filter(item => item.item_id);
          setInventory(validData.slice(0, 50)); 
        } else {
          throw new Error("Invalid data format received.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError("Could not load data. Ensure master_dashboard_data.json is in your frontend/public/ folder.");
        setLoading(false);
      });
  }, []);

  // Safe parsing function for the recommendations
  const parseActions = (actionData) => {
    if (!actionData) return ["Review manually"];
    
    // If it's already an array from the JSON, use it directly
    if (Array.isArray(actionData)) {
      return actionData;
    }

    try {
      const str = String(actionData).trim();
      const stripped = str.replace(/^\[|\]$/g, '').trim();
      if (!stripped) return ["Review manually"];
      
      const matches = stripped.match(/['"](.*?)['"]/g);
      if (matches && matches.length > 0) {
        return matches.map(m => m.replace(/^['"]|['"]$/g, ''));
      }
      return [str];
    } catch (e) {
      return ["Review manually"];
    }
  };

  const toggleExpand = (index, e) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === index ? null : index);
  };

  if (loading) return <div style={{padding: '2rem', fontSize: '1.2rem'}}>Loading ML Pipeline Data...</div>;
  if (error) return <div style={{padding: '2rem', fontSize: '1.2rem', color: 'red'}}>⚠️ {error}</div>;
  if (!inventory || inventory.length === 0) return <div style={{padding: '2rem', fontSize: '1.2rem'}}>No inventory data available to display.</div>;

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Conformal Risk Triage Dashboard</h1>
        <p style={{color: 'var(--text-muted)', margin: '0.5rem 0 0 0'}}>
          Click any SKU to view the Explainable AI (SHAP) risk breakdown and manager recommendations.
        </p>
      </div>

      <div className="grid-layout">
        {inventory.map((item, index) => {
          const isExpanded = expandedCard === index;
          const riskLevel = item.risk_level?.toUpperCase() || 'UNKNOWN';
          const isHighRisk = riskLevel === 'CRITICAL' || riskLevel === 'HIGH';
          
          const actionArray = parseActions(item.recommended_actions);
          const topAction = actionArray[0] || 'Manual Review'; 

          const primaryDriverStr = item.primary_risk_driver || 'Unknown';

          const chartData = [
            { name: 'Volatility', risk: parseFloat(item.risk_driver_demand_volatility || 0) },
            { name: 'Seasonality', risk: parseFloat(item.risk_driver_seasonality_and_events || 0) },
            { name: 'Reliability', risk: parseFloat(item.risk_driver_data_reliability || 0) }
          ];

          return (
            <div 
              className={`card ${isExpanded ? 'expanded' : ''}`} 
              key={index}
              onClick={(e) => toggleExpand(index, e)}
            >
              <div className="card-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="item-id">{item.item_id ? String(item.item_id).split('_validation')[0] : 'UNKNOWN_SKU'}</span>
                  
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
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
                    {isHighRisk ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                    RISK: {riskLevel}
                  </span>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'}}>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Day {item.day_index || 'N/A'}</span>
                  <div style={{color: 'var(--text-muted)'}}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              <div className="metric-group">
                <div className="metric">
                  <span className="metric-label">Median Forecast</span>
                  <span className="metric-value">{Number(item.median_q50 || 0).toFixed(2)}</span>
                </div>
                <div className="metric" style={{alignItems: 'flex-end'}}>
                  <span className="metric-label">Safe Upper Bound</span>
                  <span className="metric-value">{Number(item.conformal_upper_q90 || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="metric-group" style={{ background: isExpanded ? 'var(--bg-color)' : 'var(--card-bg)', border: '1px solid var(--primary)'}}>
                <div className="metric">
                  <span className="metric-label" style={{color: 'var(--primary)'}}>Recommended Order Qty</span>
                  <span className="metric-value" style={{color: 'var(--primary)'}}>{item.recommended_order_qty || 0} units</span>
                </div>
              </div>

              {!isExpanded && (
                <div className={`action-pill ${isHighRisk ? 'action-urgent' : riskLevel === 'MEDIUM' ? 'action-warning' : 'action-safe'}`}>
                  <span style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>
                    Primary Recommendation
                  </span>
                  {topAction}
                </div>
              )}

              {isExpanded && (
                <div className="expanded-content">
                  <div>
                    <h3 style={{fontSize: '1.05rem', marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-main)'}}>
                      Pure Risk Decomposition (SHAP)
                    </h3>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                      Primary Driver: <strong style={{color: 'var(--danger)'}}>{primaryDriverStr}</strong>
                    </p>
                    
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                          <XAxis type="number" unit="%" domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
                          <YAxis dataKey="name" type="category" width={85} tick={{fontSize: 12, fill: 'var(--text-main)'}} axisLine={false} tickLine={false} />
                          <Tooltip 
                            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Contribution']} 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="risk" radius={[0, 4, 4, 0]} barSize={30}>
                            {chartData.map((entry, i) => {
                              const isPrimary = primaryDriverStr.toLowerCase().includes(entry.name.toLowerCase());
                              return <Cell key={`cell-${i}`} fill={isPrimary ? '#e53e3e' : '#3182ce'} />
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="recommendations-box">
                    <h3 style={{fontSize: '1.05rem', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <CheckCircle size={20} color="var(--success)" />
                      Manager Action Plan
                    </h3>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}>
                      AI-generated next steps based on risk analysis:
                    </p>
                    <ul className="recommendations-list">
                      {actionArray.map((act, i) => (
                        <li key={i}>
                          <Info size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;