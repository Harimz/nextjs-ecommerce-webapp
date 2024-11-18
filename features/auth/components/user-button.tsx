"use client";

import { Loader, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiUserSettingsLine } from "react-icons/ri";

import { signOut } from "next-auth/react";
import { useCurrent } from "../api/use-current";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const UserButton = ({ role }: { role: string }) => {
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email, image } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <div className="flex gap-4 items-center md:w-[14rem]">
          <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
            <AvatarImage src={image} />
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="md:flex items-center gap-4 hidden">
            <div className="flex flex-col items-start">
              <p className="text-muted-foreground font-extralight text-sm">
                Welcome Back!
              </p>
              <h1 className="font-semibold text-lg">{name}</h1>
            </div>
            <FaChevronDown size={12} />
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] transition border border-neutral-300">
            <AvatarImage src={image} />
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-nuetral-900">
              {name || "User"}
            </p>

            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>

        <DottedSeparator className="mb-1" />

        <ul className="space-y-4">
          <li>
            <Link passHref href="/profile">
              <Button
                variant="ghost"
                className="flex gap-2 w-full justify-start"
              >
                <RiUserSettingsLine />
                <p>User Profile</p>
              </Button>
            </Link>
          </li>
          {role === "ADMIN" && (
            <li>
              <Link passHref href="/admin">
                <Button
                  variant="ghost"
                  className="flex gap-2 w-full justify-start"
                >
                  <MdOutlineAdminPanelSettings />
                  <p>Admin</p>
                </Button>
              </Link>
            </li>
          )}
        </ul>

        <DropdownMenuItem
          onClick={() => signOut({ redirectTo: "/" })}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
