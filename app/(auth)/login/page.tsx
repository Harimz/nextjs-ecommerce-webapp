import React from "react";
import { LoginCard } from "@/features/auth/components/login-card";
import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

const LoginPage = async () => {
  const session = await getCurrent();

  if (session) redirect("/");

  return <LoginCard />;
};

export default LoginPage;
