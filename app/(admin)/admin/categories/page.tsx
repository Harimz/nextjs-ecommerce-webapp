import React, { Suspense } from "react";
import { format } from "date-fns";
import { getCurrent } from "@/features/auth/queries";
import { CategoriesClient } from "@/features/categories/components/client";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getCategories } from "@/features/categories/queries";
import { CategorySkeleton } from "@/features/categories/components/categories-skeleton";

const CategoriesPage = async () => {
  const user = await getCurrent();
  const categories = await getCategories();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const formattedCategories = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "yyyy-MM-dd"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<CategorySkeleton />}>
          <CategoriesClient data={formattedCategories} />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoriesPage;
