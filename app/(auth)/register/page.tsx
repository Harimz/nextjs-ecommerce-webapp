import React from "react";
import { RegisterCard } from "@/features/auth/components/register-card";
import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

const RegisterPage = async () => {
  const session = await getCurrent();

  if (session) redirect("/");

  return <RegisterCard />;
};

export default RegisterPage;
