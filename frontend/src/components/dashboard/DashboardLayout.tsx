import { ReactNode } from "react";
import { navConfig } from "@/lib/navConfig";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";

import { NavLink } from "@/components/NavLink";
import Navbar from "@/components/dashboard/Navbar";
import PageTransition from "@/components/ui/PageTransition";

interface Props {
  children: ReactNode;
  role: "client" | "employee" | "admin";
}

export default function DashboardLayout({ children, role }: Props) {
  const navItems = navConfig?.[role] ?? [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        {/* SIDEBAR (NAV ONLY) */}
        <Sidebar className="border-r border-white/10 bg-white/5 backdrop-blur-xl">
          <SidebarContent className="pt-6 px-3">
        
            <SidebarMenu className="space-y-1">
        
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
        
                    <NavLink
                      to={item.href}
                      end={item.href.split("/").length === 3}
                      className="w-full"
                      activeClassName="
                        bg-gradient-to-r from-[#7F77DD] to-[#1D9E75]
                        text-white shadow-[0_0_20px_rgba(127,119,221,0.25)]
                      "
                    >
                      <span className="
                        block w-full px-3 py-2.5 rounded-xl text-sm
                        transition-all duration-200
                        hover:bg-white/10 hover:text-white
                      ">
                        {item.label}
                      </span>
        
                    </NavLink>
        
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
        
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* MAIN AREA */}
        <SidebarInset className="flex flex-col flex-1">

          {/* NAVBAR */}
          <Navbar />

          {/* PAGE CONTENT */}
          <main className="p-6 flex-1">
            <PageTransition>
              {children}
            </PageTransition>
          </main>

        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}