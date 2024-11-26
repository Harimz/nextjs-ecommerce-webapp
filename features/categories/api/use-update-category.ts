import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.admin.categories)[":categoryId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.admin.categories)[":categoryId"]["$patch"]
>;

export const useUpdateCategory = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.admin.categories[":categoryId"][
        "$patch"
      ]({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category updated");
      router.push("/admin/categories");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });

  return mutation;
};
