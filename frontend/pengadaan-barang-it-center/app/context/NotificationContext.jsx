"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import permintaanService from '../../lib/permintaanService';


const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notificationCounts, setNotificationCounts] = useState({
    permintaan: 0,
    draft: 0,
    riwayat: 0
  });
  
  const [pendingChanges, setPendingChanges] = useState({
    hasPendingStatusChange: false,
    lastUpdated: null
  });

  const fetchCounts = async () => {
    try {
      // Fetch draft count
      const draftRes = await permintaanService.getDraftPermintaan({
        page: 1,
        limit: 1
      });
      
      // Fetch permintaan count
      const permintaanRes = await permintaanService.getPermintaan({
        page: 1,
        limit: 1,
        status: "" // Get all
      });
      
      // Count pending/processing requests
      const pendingRes = await permintaanService.getPermintaan({
        status: "menunggu,diproses"
      });
      
      setNotificationCounts({
        draft: draftRes.pagination?.totalItems || 0,
        permintaan: permintaanRes.pagination?.totalItems || 0,
        riwayat: 0 // Will be calculated below
      });
      
      // Set pending status change notification
      setPendingChanges(prev => ({
        ...prev,
        hasPendingStatusChange: (pendingRes.data?.length || 0) > 0
      }));
      
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  };

  const markAsRead = () => {
    setPendingChanges(prev => ({
      ...prev,
      hasPendingStatusChange: false
    }));
  };

  useEffect(() => {
    fetchCounts();
    
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notificationCounts,
      pendingChanges,
      fetchCounts,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};