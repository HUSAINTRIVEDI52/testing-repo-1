import { Route, Routes, useLocation } from 'react-router-dom';
import routes, { RouteInterface } from './routes';
import PublicLayout from './PublicLayout';
import PrivateLayout from './Layout';
import AuthHandler from './components/AuthHandler/AuthHandler';
import GlobalProvider from './Context';
import React, { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import useGlobalButtonTracker from './utils/buttonClickEvent';
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const useGTMPageView = () => {
  const location = useLocation();

  // useEffect(() => {
  //   TagManager.dataLayer({
  //     dataLayer: {
  //       event: 'pageview',
  //       page: location.pathname
  //     }
  //   });
  // }, [location]); // Runs every time location changes
};

function App() {
  const tagManagerArgs = {
    gtmId: String(process.env.REACT_APP_GTM_ID)
  };

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
    const handleBeforeUnload = (event: any) => {
      // Check if the user is navigating away (not a reload)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigationEntry) {
      } else {
        console.log('Navigation Type not available');
      }
      setTimeout(() => {}, 5000);
      return;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  useGTMPageView();
  useGlobalButtonTracker();

  return (
    <div>
      <GlobalProvider>
        {/* routes for public routes and private routes. Wrape in public layout if public otherwise wrap in private wrapper */}
        <Routes>
          <Route path='/auth-callback' element={<AuthHandler />} />
          {routes.map((route: RouteInterface, index: number) => {
            if (route.layout === 'public') {
              return <Route key={route.id} path={route.path} element={<PublicLayout>{route.element}</PublicLayout>} />;
            } else {
              return (
                <Route key={route.id} path={route.path} element={<PrivateLayout>{route.element}</PrivateLayout>} />
              );
            }
          })}
        </Routes>
      </GlobalProvider>
    </div>
  );
}

export default App;
