import { Navbar } from "@/components/navbar";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
};

export default HomeLayout;
