import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { privateRoutes, publicRoutes } from '@/common/routes';

import { URL_PATH } from './common/url';
import { PrivateLayout } from './layouts/PrivateLayout';
import { NotFoundPage } from './pages/Notfound';

function App() {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path as string}
          {...route}
          element={<MainLayout>{route.element}</MainLayout>}
        />
      ))}

      <Route element={<PrivateLayout />}>
        {privateRoutes.map((route) => (
          <Route
            key={route.path as string}
            {...route}
            element={route.element}
          />
        ))}
        <Route
          key="not-found-page"
          path="*"
          element={<NotFoundPage path={URL_PATH.LOGIN} />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage path={URL_PATH.LOGIN} />} />
    </Routes>
  );
}

export default App;
