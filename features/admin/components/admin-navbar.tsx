import React from "react";
import { MainNav } from "./main-nav";
import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";

export const AdminNavbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 flex-col-reverse md:flex-row">
        <div className="relative h-[2.5rem] w-[3rem] hidden md:block">
          <Link href="/">
            <Image src="/images/logo.png" fill alt="logo" />
          </Link>
        </div>

        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <UserButton role="ADMIN" />
        </div>
      </div>
    </div>
  );
};
