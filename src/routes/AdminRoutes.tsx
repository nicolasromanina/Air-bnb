import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import AdminReservationDetail from '@/pages/Admin/AdminReservationDetail';
import AdminLogin from '@/pages/Admin/AdminLogin';
import UsersPage from '@/pages/Admin/UsersPage';
import BookingsPage from '@/pages/Admin/BookingsPage';
import PaymentsPage from '@/pages/Admin/PaymentsPage';
import HomeEditor from '@/pages/Admin/HomeEditor';
import SettingsPage from '@/pages/Admin/SettingsPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ServicesEditor from '@/pages/Admin/ServicesEditor';
import ContactEditor from '@/pages/Admin/ContactEditor';
import Appartment from '@/pages/Appartment';
import AppartmentEditor from '@/pages/Admin/AppartmentEditor';
import AppartmentDetailEditor from '@/pages/Admin/AppartmentDetailEditor';
import FooterEditor from '@/pages/Admin/FooterEditor';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="home" element={<HomeEditor/>} />
        <Route path="services" element={<ServicesEditor />} />
        <Route path="apartments/:id" element={<AppartmentDetailEditor />} />
        <Route path="apartment-details" element={<AppartmentDetailEditor />} />
        <Route path="apartments" element={<AppartmentEditor />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="reservations/:id" element={<AdminReservationDetail />} />
        <Route path="contact" element={<ContactEditor />} />
        <Route path="footer" element={<FooterEditor />} />

      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;