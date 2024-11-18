import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";

const AdminPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return <div>AdminPage</div>;
};

export default AdminPage;
