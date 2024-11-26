"use client";

import React from "react";
import { Category } from "@prisma/client";
import { categoryFormSchema } from "../schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCategory } from "../api/use-create-category";
import { useUpdateCategory } from "../api/use-update-category";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteCategory } from "../api/use-delete-category";

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData: Category | null;
}

export const CategoriesForm: React.FC<CategoryFormProps> = ({
  initialData,
}) => {
  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Category",
    "This action cannot be undone",
    "destructive"
  );

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add a new Category";
  const toastMessage = initialData ? "Category Updated" : "Category Created";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    if (!initialData) {
      createCategory(values);
    } else {
      updateCategory({
        param: { categoryId: initialData.id },
        form: values,
      });
    }
  };

  const onDelete = async () => {
    const confirmed = await confirmDelete();

    if (confirmed && initialData) {
      deleteCategory({
        param: { categoryId: initialData.id },
      });
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto mt-10">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DottedSeparator className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={false}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={false} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>{" "}
      <DeleteDialog />
    </div>
  );
};
