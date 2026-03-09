import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    // Check for admin session/token in sessionStorage or Firebase user email
    const adminToken = sessionStorage.getItem('adminToken');
    const adminId = sessionStorage.getItem('adminId');

    const isHardcodedAdmin = adminToken && adminId === 'admin_pramod';
    const isFirebaseAdmin = user?.email === 'winsizer.com@gmail.com';

    if (!isHardcodedAdmin && !isFirebaseAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
