"use client";

import { UserButton } from "@/features/auth/components/user-button";
import React from "react";
import { Input } from "./ui/input";
import { LuShoppingCart } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { Button } from "./ui/button";
import Image from "next/image";
import { useCurrent } from "@/features/auth/api/use-current";
import Link from "next/link";

export const Navbar = () => {
  const { data: user, isLoading } = useCurrent();
  const shoppingCartItems = 3;
  const likes = 1;

  return (
    <nav className="p-4">
      <div className="mx-auto max-w-screen-2xl flex flex-col-reverse md:flex-row items-center">
        <div className="relative h-[2.5rem] w-[3rem] hidden md:block">
          <Image src="/images/logo.png" fill alt="logo" />
        </div>

        <div className="relative md:ml-4 w-full mt-4 md:mt-0 sm:mr-4">
          <CiSearch className="size-4 absolute top-[10px] left-[0.5rem]" />
          <Input
            className="pl-[2rem] max-w-[35rem]"
            placeholder="Enter search"
          />
        </div>

        <div className="flex gap-x-4 items-center justify-between w-full md:w-auto">
          <div className="flex gap-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <div className="relative">
                <div className="absolute bg-red-600 text-white w-[1.3rem] h-[1.3rem] -top-[1rem] -right-4 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-xs">
                    {shoppingCartItems}
                  </span>
                </div>
                <LuShoppingCart className="size-6" />
              </div>
            </Button>

            <Button variant="outline" size="icon" className="rounded-full">
              <div className="relative">
                <div className="absolute bg-red-600 text-white w-[1.3rem] h-[1.3rem] -top-[1rem] -right-4 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-xs">{likes}</span>
                </div>
                <FaRegHeart className="size-6" />
              </div>
            </Button>
          </div>

          <div className="h-[2rem] w-[1px] bg-gray-300 hidden md:block" />

          {user && !isLoading && <UserButton role={user.role} />}
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
