import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; // Assuming you're using lucide-react for the Menu icon
import {
  FaUsers,
  FaTh,
  FaUserShield,
  FaDesktop,
  FaVial,
  FaCapsules,
  FaUserClock,
  FaListOl,
  FaBed,
} from "react-icons/fa";

const modules = [
  { name: "Frontdesk", icon: FaDesktop },
  { name: "Admin", icon: FaUserShield },
  { name: "NewToken", icon: FaUserClock },
  { name: "DisplayToken", icon: FaListOl },
  { name: "QueueStatus", icon: FaUsers },
  { name: "BedManagement", icon: FaBed },
];

// ModulesMenu.jsx
export default function ModulesMenu({ user, onModuleSelect }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clickOutside = (e) => !menuRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const basePath =
    user?.userType?.toLowerCase() === "doctor"
      ? "/doctordashboard"
      : user?.userType?.toLowerCase() === "hospital"
        ? "/hospitaldashboard"
        : "";

  const routes = {
    Admin: "/dr-admin",
    DisplayToken: "/tokendisplay",
    NewToken: "/queuetoken",
    Pharmacy: "/pharmacymodule",
    Laboratory: "/labmodule",
    Frontdesk: "/frontdesk",
    QueueStatus: "/queuemanagement",
    BedManagement: "/bedroommanagement",
    Reports: "/reports",
  };

  const handleClick = (name) => {
    navigate(`${basePath}${routes[name] || ""}`);
    setOpen(false);
    if (onModuleSelect) {
      onModuleSelect();
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex flex-row items-center gap-3 p-2 rounded-lg hover:bg-gray-100 w-full"
      >
        <div className="w-12 h-12 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
          <FaTh className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 xl:hidden">Modules</span>
      </button>
      {open && (
  <div className="absolute top-16 right-0 bg-white rounded-xl shadow-xl p-4 w-100 xl:w-auto">
    <div className="grid grid-cols-3 xl:flex xl:flex-row xl:space-x-2">
      {modules.map(({ name, icon: Icon }, i) => (
        <button
          key={name}
          onClick={() => handleClick(name)}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-50"
        >
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full
            bg-gradient-to-br from-[#1CA4AC]/20 to-[#68C723]/20 text-[var(--primary-color)]
            group-hover:from-[#1CA4AC] group-hover:to-[#68C723] group-hover:text-white
            shadow-md group-hover:scale-110 transition duration-300"
          >
            <Icon className="text-xl" />
          </div>
          <span
            className="mt-2 text-sm font-medium text-[var(--primary-color)] group-hover:text-[var(--accent-color)]"
          >
            {name}
          </span>
        </button>
      ))}
    </div>
  </div>
)}

    </div>
  );
}