import {
  LayoutDashboard,
  Building2,
  Users,
  WalletCards,
  Settings,
  UserRound,
  UserCheck,
  UserPlus,
  Shield,
  FileText, 
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["super_admin", "admin", "lead_manager", "moderator", "employee"],
  },
  {
    title: "Buildings",
    href: "/dashboard/buildings",
    icon: Building2,
    allowedRoles: ["super_admin", "admin", "lead_manager", "moderator"],
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: UserRound,
    allowedRoles: ["super_admin", "admin", "lead_manager", "moderator"],
  },
  {
    title: "Employees",
    href: "/dashboard/employees",
    icon: UserCheck,
    allowedRoles: ["super_admin", "admin"],
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: UserPlus,
    allowedRoles: ["super_admin", "admin", "lead_manager", "moderator"],
  },
  {
    title: "Revenue",
    href: "/dashboard/revenue",
    icon: WalletCards,
    allowedRoles: ["super_admin", "admin", "lead_manager", "moderator"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    allowedRoles: ["super_admin", "admin", "moderator"],
  },
  {
    title: "Users",  // ✅ New Users item
    href: "/dashboard/users",
    icon: Shield,
    allowedRoles: ["super_admin", "admin"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["super_admin", "admin"],
  },
];