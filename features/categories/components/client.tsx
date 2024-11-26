"use client";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoriesColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/heading";

interface CategegoriesClient {
  data: CategoriesColumn[];
}

export const CategoriesClient: React.FC<CategegoriesClient> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-light text-4xl">Categories</h1>

        <Button onClick={() => router.push(`/admin/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <DottedSeparator />

      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
