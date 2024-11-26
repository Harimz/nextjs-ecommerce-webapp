import { getCurrent } from "@/features/auth/queries";
import { BillboardClient } from "@/features/billboards/components/client";
import { redirect } from "next/navigation";
import React from "react";

const BillboardsPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="fkex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={[]} />
      </div>
    </div>
  );
};

export default BillboardsPage;
