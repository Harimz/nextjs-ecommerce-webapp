import { getCurrent } from "@/features/auth/queries";
import { BillboardForm } from "@/features/billboards/components/billboard-form";
import { CategoriesForm } from "@/features/categories/components/categories-form";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const user = await getCurrent();
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return <CategoriesForm initialData={category} />;
};

export default CategoryPage;
