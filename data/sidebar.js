import {
  LayoutDashboard,
  Building2,
  Users,
  WalletCards,
  Settings,
  UserRound,
  UserCheck,
  Target,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Buildings",
    href: "/dashboard/buildings",
    icon: Building2,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: UserRound,
  },
  {
    title: "Employees",
    href: "/dashboard/employees",
    icon: UserCheck,
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: Target,
  },
  {
    title: "Revenue",
    href: "/dashboard/revenue",
    icon: WalletCards,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];