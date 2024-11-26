import { getCurrent } from "@/features/auth/queries";
import { BillboardForm } from "@/features/billboards/components/billboard-form";
import { redirect } from "next/navigation";
import React from "react";

const BillboardPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return <BillboardForm initialData={null} />;
};

export default BillboardPage;
