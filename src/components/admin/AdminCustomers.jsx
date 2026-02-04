import React, { useEffect } from 'react';
import { Users, Mail, User, ShieldCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminCustomers = ({ allProfiles, fetchCustomers }) => {
    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className="admin-customers">
            <div className="admin-stats-grid">
                <div className="admin-stat-card glass">
                    <div className="stat-icon"><Users color="#000" /></div>
                    <div className="stat-info">
                        <h3>Toplam Müşteri</h3>
                        <p>{allProfiles.length}</p>
                    </div>
                </div>
            </div>

            <div className="admin-table-container glass">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Müşteri</th>
                            <th>E-Posta</th>
                            <th>Rol</th>
                            <th>Kayıt Tarihi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProfiles.length > 0 ? (
                            allProfiles.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div className="customer-cell">
                                            <div className="customer-avatar">
                                                {customer.full_name ? customer.full_name[0].toUpperCase() : <User size={16} />}
                                            </div>
                                            <span>{customer.full_name || 'İsimsiz Müşteri'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="email-cell">
                                            <Mail size={14} />
                                            <span>{customer.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${customer.role}`}>
                                            {customer.role === 'admin' ? 'Yönetici' : 'Müşteri'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            <Calendar size={14} />
                                            <span>{new Date(customer.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                                    Henüz kayıtlı müşteri bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCustomers;
