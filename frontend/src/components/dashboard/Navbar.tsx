import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserMenu from "@/components/dashboard/UserMenu";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="sticky top-0 z-40 border-b border-border"
      style={{
        background: "rgba(12,12,18,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* Sidebar toggle (mobile + collapsed desktop) */}
          <SidebarTrigger />

          {/* Logo */}
          <button
            onClick={() => navigate("/dashboard/client")}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7F77DD, #1D9E75)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="5" rx="1.5" fill="white" opacity="0.9" />
                <rect x="3" y="10" width="18" height="5" rx="1.5" fill="white" opacity="0.6" />
                <rect x="3" y="17" width="18" height="4" rx="1.5" fill="white" opacity="0.35" />
              </svg>
            </div>

            <span className="text-lg font-bold tracking-tight hidden sm:block">
              IBO<span style={{ color: "#7F77DD" }}>S</span>
            </span>
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* User dropdown (profile + logout inside) */}
          <UserMenu />

          {/* Optional: remove this if UserMenu already has logout */}
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block px-4 py-2 rounded-lg bg-gradient-to-r from-[#7F77DD] to-[#1D9E75] text-sm"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}