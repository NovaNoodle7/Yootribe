import { Outlet } from 'react-router-dom';

import AppHeader from '../components/AppHeader';

export const CompanyLayout = () => {
  return <>
    <AppHeader />
    <Outlet />
  </>;
};
