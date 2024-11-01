import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="w-full max-w-[456px] mx-auto mt-20">{children}</div>;
};

export default AuthLayout;
