type Role = "client" | "employee" | "admin";

interface SidebarItem {
  label: string;
  path: string;
  exact?: boolean;
}

type SidebarConfig = {
  [key in Role]: SidebarItem[];
};

export const sidebarConfig: SidebarConfig = {
  client: [
    { label: "Dashboard", path: "/dashboard/client", exact: true },
    { label: "Projects", path: "/dashboard/client/projects" },
    { label: "Invoices", path: "/dashboard/client/invoices" },
  ],

  employee: [
    { label: "Dashboard", path: "/dashboard/employee", exact: true },
    { label: "My Tasks", path: "/dashboard/employee/tasks" },
    { label: "Reports", path: "/dashboard/employee/reports" },
  ],

  admin: [
    { label: "Dashboard", path: "/dashboard/admin", exact: true },
    { label: "Users", path: "/dashboard/admin/users" },
    { label: "Projects", path: "/dashboard/admin/projects" },
    { label: "Reports", path: "/dashboard/admin/reports" },
  ],
};