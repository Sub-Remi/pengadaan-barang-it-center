"use client";
import { NotificationProvider } from '../../app/context/NotificationContext';
import '../globals.css';

export default function DivisiLayout({ children }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}