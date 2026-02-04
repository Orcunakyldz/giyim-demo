import React from 'react';
import Navbar from './Navbar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <AnnouncementBar />
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
