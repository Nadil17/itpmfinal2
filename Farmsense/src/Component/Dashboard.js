import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, alertService } from '../Service/api';
import ProductTypeChart from '../Component/ProductTypeChart';

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiryCount, setExpiryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, alertsRes, lowStockRes, expiryRes] = await Promise.all([
          productService.getAllProducts(),
          alertService.getAllAlerts(),
          alertService.getLowStockAlerts(),
          alertService.getExpiryAlerts()
        ]);
        
        setProductCount(productsRes.data.data.length);
        setAlertCount(alertsRes.data.data.length);
        setLowStockCount(lowStockRes.data.data.length);
        setExpiryCount(expiryRes.data.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }
  
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stat-cards">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{productCount}</p>
          <Link to="/products" className="stat-link">View all products</Link>
        </div>
        
        <div className="stat-card">
          <h3>All Alerts</h3>
          <p className="stat-value">{alertCount}</p>
          <Link to="/alerts" className="stat-link">View all alerts</Link>
        </div>
        
        <div className="stat-card alert-card">
          <h3>Low Stock Alerts</h3>
          <p className="stat-value">{lowStockCount}</p>
          <Link to="/alerts?type=lowStock" className="stat-link">View low stock alerts</Link>
        </div>
        
        <div className="stat-card alert-card">
          <h3>Expiry Alerts</h3>
          <p className="stat-value">{expiryCount}</p>
          <Link to="/alerts?type=expiry" className="stat-link">View expiry alerts</Link>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Products by Type</h3>
          <ProductTypeChart />
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/products/new" className="btn btn-primary">Add New Product</Link>
          <Link to="/alerts" className="btn btn-secondary">Check Alerts</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;