import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    window.scrollTo(0, 0);
    
    // Optional: Re-enable auto scroll restoration when unmounting if needed,
    // but for a SPA it is usually better to keep it manual and handle it ourselves.
    // return () => {
    //   if ('scrollRestoration' in window.history) {
    //     window.history.scrollRestoration = 'auto';
    //   }
    // };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
