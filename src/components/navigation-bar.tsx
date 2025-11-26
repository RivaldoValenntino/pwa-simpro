import { Link, useRouterState } from "@tanstack/react-router";
import IcHome from "../assets/nav/ic_home.svg?react";
// import IcUser from "../assets/nav/ic_user.svg?react";
import { Calendar1Icon, ClockFading, FlaskConical } from "lucide-react";
import { UserIcon } from "@heroicons/react/20/solid";
import IcMagnifying from "../assets/magnifying.svg?react";
const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: IcHome,
    matchPaths: [
      "/dashboard",
      "/form",
      "/jam",
      "/list-data",
      "/pages",
      "/pencatatan-harian",
    ],
    excludePaths: ["/form/anomali", "/form/penggunaan-bahan-kimia"],
  },
  {
    to: "/bahan-kimia",
    label: "Berita Acara",
    icon: FlaskConical,
    matchPaths: ["/bahan-kimia", "/form/penggunaan-bahan-kimia"],
  },
  {
    to: "/anomali",
    label: "Anomali",
    icon: IcMagnifying,
    matchPaths: ["/anomali", "/form/anomali"],
  },
  {
    to: "/jadwal",
    label: "Jadwal",
    icon: Calendar1Icon,
    matchPaths: ["/jadwal"],
  },
  {
    to: "/log-aktivitas",
    label: "Log",
    icon: ClockFading,
    matchPaths: ["/log-aktivitas"],
  },
  {
    to: "/profil",
    label: "Akun",
    icon: UserIcon,
    matchPaths: ["/profil", "/ganti-password"],
  },
];

export default function NavigationBar() {
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-3xl mx-auto bg-white border-t shadow-md z-5">
      <div className="flex justify-between px-2 py-2">
        {navItems.map(
          ({ to, label, icon: Icon, matchPaths = [], excludePaths = [] }) => {
            const isMatch = matchPaths.some((path) =>
              currentPath.startsWith(path)
            );
            const isExcluded = excludePaths.some((path) =>
              currentPath.startsWith(path)
            );
            const isActive = isMatch && !isExcluded;

            const textClass = isActive ? "text-primary" : "text-gray-500";

            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center text-[10px] ${textClass}`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 ${textClass}`}
                  color="currentColor"
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {label}
              </Link>
            );
          }
        )}
      </div>
    </nav>
  );
}
