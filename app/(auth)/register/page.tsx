import React from "react";
import { RegisterCard } from "@/features/auth/components/register-card";
import { getCurrent } from "@/features/user/queries";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await getCurrent();

  if (session) redirect("/");

  return <RegisterCard />;
};

export default RegisterPage;
