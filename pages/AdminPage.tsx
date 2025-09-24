
import React, { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    return (
        <div>
            {isLoggedIn ? (
                <AdminDashboard />
            ) : (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default AdminPage;
