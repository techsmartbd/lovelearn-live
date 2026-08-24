import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "ADMIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Tutorials",
        icon: Icons.PieChart,
        items: [
          {
            title: "Tutorial Videos",
            url: "/admin/videos/tutorial",
          },
          {
            title: "E-Books",
            url: "/admin/ebooks",
          },
        ],
      },
      {
        title: "Packages",
        url: "/admin/packages",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "User Management",
        icon: Icons.User,
        items: [
          {
            title: "Premium Users",
            url: "/admin/sessions",
          },
          {
            title: "Pending Users",
            url: "/admin/pending-users",
          },
          {
            title: "Visitor Info",
            url: "/admin/visitor-info",
          },
        ],
      },
      {
        title: "Tracking System",
        url: "/admin/tracking",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "AI Assistant",
        url: "/admin/ai-assistant",
        icon: Icons.Authentication,
        items: [],
      },
      {
        title: "Marketing Dashboard",
        url: "/admin/marketing-dashboard",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "Settings",
        url: "/admin/general-settings",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Landing Page CMS",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Page Content",
            url: "/admin/settings",
          },
          {
            title: "Landing Videos",
            url: "/admin/videos/landing",
          },
        ],
      },
    ],
  },
];

