import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import OfflineBanner from '../components/common/OfflineBanner';

const MainLayout = () => {
  return (
    <div className="app-container">
      <OfflineBanner />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
