import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import AppHeader from '../components/AppHeader';

export const CompanyLayout = () => {
  const user = useSelector((state) => state?.auth?.value?.user);

  if (!user.is_superadmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};
