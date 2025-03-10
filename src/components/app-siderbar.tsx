"use client";

import * as React from "react";
import { House, LogOut, CircleDollarSign } from "lucide-react";
import { MdOutlineSupportAgent, MdBusinessCenter } from "react-icons/md";
import { IoIosGift } from "react-icons/io";
import { FaUsers } from "react-icons/fa6";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

// This is sample data.
const data = {
  user: {
    name: "San Bin Hoque",
    email: "epti060@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  shortNavigation: [
    {
      action: () => redirect("/"),
      label: "Home",
      icon: House,
    },
    {
      action: () => redirect("/"),
      label: "Home",
      icon: House,
    },
    {
      action: () => redirect("/"),
      label: "Logout",
      icon: LogOut,
    },
  ],
  navMain: [
    {
      title: "Payment",
      url: "#",
      icon: CircleDollarSign,
      isActive: true,
      items: [
        {
          title: "Deposit",
          url: "#",
        },
        {
          title: "Withdraw",
          url: "#",
        },
        {
          title: "Methods",
          url: "#",
        },
      ],
    },
    {
      title: "Agent",
      url: "#",
      icon: MdOutlineSupportAgent,
      items: [
        {
          title: "Explor",
          url: "#",
        },

        {
          title: "Update Agents",
          url: "#",
        },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: FaUsers,
      items: [
        {
          title: "Exlpor",
          url: "#",
        },
        {
          title: "Update Users",
          url: "#",
        },
      ],
    },
    {
      title: "Site Center",
      url: "#",
      icon: MdBusinessCenter,
      items: [
        {
          title: "Features",
          url: "#",
        },
        {
          title: "Contact",
          url: "#",
        },
      ],
    },
    {
      title: "Promo",
      url: "#",
      icon: IoIosGift,
      items: [
        {
          title: "Promo Codes",
          url: "#",
        },
        {
          title: "Bonus",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher navigations={data.shortNavigation} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
