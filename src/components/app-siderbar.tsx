"use client";

import * as React from "react";
import { House, LogOut } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { PiHandWithdrawFill } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import useCurrentUser from "@/hooks/useCurrentUser";
import { logout } from "@/action/logout";
import { toast } from "sonner";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const agent = useCurrentUser();

  const hanldeLogout = () => {
    logout().then((res) => {
      if (res.success) {
        location.reload();
      } else if (res.error) {
        toast.error(res.error);
      }
    });
  };

  const data = {
    user: {
      name: agent?.fullName || "",
      email: agent?.email || "",
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
        action: () => hanldeLogout(),
        label: "Logout",
        icon: LogOut,
      },
    ],
    navMain: [
      {
        title: "Deposit",
        url: "/deposit",
        icon: MdOutlineAccountBalanceWallet,
      },
      {
        title: "Withdraw",
        url: "/withdraws",
        icon: PiHandWithdrawFill,
      },

      {
        title: "Transaction",
        url: "/transaction-records",
        icon: GrTransaction,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
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
