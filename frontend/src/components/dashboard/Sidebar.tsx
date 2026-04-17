import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ role }) {
  const location = useLocation();

  const menu = {
    client: ["Projects", "Invoices"],
    employee: ["Tasks", "Reports"],
    admin: ["Users", "Projects", "Analytics"],
  };

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-white/10 bg-white/[0.03] backdrop-blur-xl">

      {/* MENU */}
      <div className="flex-1 px-3 py-6 space-y-1">

        {menu[role].map((item) => {
          const path = `/dashboard/${role}/${item.toLowerCase()}`;
          const isActive = location.pathname.includes(item.toLowerCase());

          return (
            <Link
              key={item}
              to={path}
              className={`
                relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                transition-all duration-200
                ${
                  isActive
                    ? "bg-white/10 text-white border border-white/10 shadow-[0_0_25px_rgba(127,119,221,0.12)]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {/* active indicator bar */}
              <span
                className={`
                  absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full transition-all
                  ${isActive ? "bg-[#7F77DD]" : "bg-transparent"}
                `}
              />

              <span className="truncate">{item}</span>
            </Link>
          );
        })}

      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="text-xs text-white/30">
          IBOS Dashboard
        </div>
      </div>

    </aside>
  );
}