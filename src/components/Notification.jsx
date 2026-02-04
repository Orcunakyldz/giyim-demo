import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Notification = () => {
    const { notification } = useShop();

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: 50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -50, x: 50 }}
                    className="notification-toast"
                >
                    {notification.type === 'success' ? (
                        <CheckCircle size={24} color="#27ae60" />
                    ) : (
                        <AlertCircle size={24} color="#e74c3c" />
                    )}
                    <span className="message">{notification.message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
