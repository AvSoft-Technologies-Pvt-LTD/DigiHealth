import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderWithNotifications from "./Header";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

const DashboardLayout = () => {
  const user = useSelector((state) => state.auth?.user);
  const role = user?.role || "patient";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        role={role}
        isMobileDrawerOpen={sidebarOpen}
        closeMobileDrawer={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderWithNotifications toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-2 relative">
          {loading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-70">
              <Loader />
            </div>
          )}
          <div
            className={`transition-opacity duration-500 ${
              loading ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
