import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/admin/billboards/images", {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        const errorData = await response.json().catch(() => ({
          error: "Unknown error",
        }));
        console.error("Server Error:", errorData);
        throw new Error(errorData.error || "Failed to upload files");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast.success("Files uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["billboard"] });
    },
    onError: (error) => {
      console.error("Error uploading files:", error);
      toast.error(error.message || "Failed to upload files");
    },
  });

  return mutation;
};
