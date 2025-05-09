import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { alertService } from '../Service/api';

const AlertsPage = () => {
  const [searchParams] = useSearchParams();
  const initialAlertType = searchParams.get('type') || 'all';
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertType, setAlertType] = useState(initialAlertType);
  
  useEffect(() => {
    fetchAlerts();
  }, [alertType]);
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (alertType) {
        case 'lowStock':
          response = await alertService.getLowStockAlerts();
          break;
        case 'expiry':
          response = await alertService.getExpiryAlerts();
          break;
        default:
          response = await alertService.getAllAlerts();
          break;
      }
      
      if (response.data.success) {
        setAlerts(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch alerts');
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAlertTypeChange = (type) => {
    setAlertType(type);
  };
  
  if (loading) {
    return <div className="loading">Loading alerts...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="alerts-page">
      <h2>Alerts</h2>
      
      <div className="alert-filters">
        <button 
          className={`btn ${alertType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleAlertTypeChange('all')}
        >
          All Alerts
        </button>
        <button 
          className={`btn ${alertType === 'lowStock' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleAlertTypeChange('lowStock')}
        >
          Low Stock
        </button>
        <button 
          className={`btn ${alertType === 'expiry' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleAlertTypeChange('expiry')}
        >
          Expiry Alerts
        </button>
      </div>
      
      {alerts.length === 0 ? (
        <div className="no-alerts">
          <p>No alerts found.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-card ${alert.alertType.toLowerCase()}`}>
              <div className="alert-header">
                <h3>{alert.productName}</h3>
                <span className="alert-badge">{alert.alertType}</span>
              </div>
              
              <div className="alert-body">
                <p className="alert-message">{alert.message}</p>
                
                {alert.alertType === 'LOW_STOCK' && (
                  <div className="alert-details">
                    <p>Current Stock: {alert.currentStock}</p>
                    <p>Minimum Level: {alert.minimumLevel}</p>
                  </div>
                )}
                
                {alert.alertType === 'EXPIRY' && (
                  <div className="alert-details">
                    <p>Expires on: {new Date(alert.expiryDate).toLocaleDateString()}</p>
                    <p>Days remaining: {alert.daysRemaining}</p>
                  </div>
                )}
              </div>
              
              <div className="alert-actions">
                <Link to={`/products/edit/${alert.productId}`} className="btn btn-primary">
                  Manage Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;