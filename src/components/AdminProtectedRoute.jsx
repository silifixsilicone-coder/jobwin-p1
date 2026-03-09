import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    // Check for admin session/token in sessionStorage
    const adminToken = sessionStorage.getItem('adminToken');
    const adminId = sessionStorage.getItem('adminId');

    if (!adminToken || adminId !== 'admin_pramod') {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
