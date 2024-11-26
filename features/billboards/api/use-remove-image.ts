import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.admin.billboards.images)[":imageUrl"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.admin.billboards.images)[":imageUrl"]["$delete"]
>;

export const useRemoveImage = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.admin.billboards.images[":imageUrl"][
        "$delete"
      ]({
        param,
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast.success("Image deleted");
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
      toast.error(error.message || "Failed to delete image");
    },
  });

  return mutation;
};
