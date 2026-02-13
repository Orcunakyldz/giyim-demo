import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useShop();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (!currentUser || currentUser?.profile?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
