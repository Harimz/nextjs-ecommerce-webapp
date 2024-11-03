"use client";

import { UserButton } from "@/features/user/components/user-button";
import React from "react";
import { Input } from "./ui/input";
import { LuShoppingCart } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { Button } from "./ui/button";
import Image from "next/image";
import { useCurrent } from "@/features/user/api/use-current";
import Link from "next/link";

export const Navbar = () => {
  const { data: user, isLoading } = useCurrent();

  return (
    <nav className="p-4">
      <div className="mx-auto max-w-screen-2xl flex items-center">
        <div className="relative h-[2.5rem] w-[4.5rem]">
          <Image src="/images/logo.png" fill alt="logo" />
        </div>

        <div className="relative ml-4">
          <CiSearch className="size-4 absolute top-[10px] left-[0.5rem]" />
          <Input className="pl-[2rem] w-[25rem]" placeholder="Enter search" />
        </div>

        <div className="w-full" />

        <div className="flex gap-x-4 items-center">
          <Button variant="outline" size="icon" className="rounded-full">
            <LuShoppingCart className="size-6" />
          </Button>

          <Button variant="outline" size="icon" className="rounded-full">
            <FaRegHeart className="size-6" />
          </Button>

          <div className="h-[2rem] w-[1px] bg-gray-300" />

          {user && !isLoading && <UserButton />}
          {!user && !isLoading && (
            <Button variant="primary" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
