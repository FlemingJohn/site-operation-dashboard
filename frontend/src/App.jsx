import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const SitesPage = lazy(() => import('./pages/SitesPage'));
const SiteFormPage = lazy(() => import('./pages/SiteFormPage'));
const InstallationsPage = lazy(() => import('./pages/InstallationsPage'));
const InstallationFormPage = lazy(() => import('./pages/InstallationFormPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<OverviewPage />} />
      <Route path="sites" element={<SitesPage />} />
      <Route path="sites/new" element={<SiteFormPage />} />
      <Route path="sites/:id/edit" element={<SiteFormPage />} />
      <Route path="installations" element={<InstallationsPage />} />
      <Route path="installations/new" element={<InstallationFormPage />} />
      <Route path="installations/:id/edit" element={<InstallationFormPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
