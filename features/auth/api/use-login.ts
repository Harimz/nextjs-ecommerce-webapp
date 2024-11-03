import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { signIn, SignInResponse } from "next-auth/react";

type RequestType = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SignInResponse, Error, RequestType>({
    mutationFn: async ({ email, password }) => {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!response || response.error) {
        throw new Error(response?.error || "Failed to login");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (e) => {
      console.error(e.message);
      toast.error("Failed to login");
    },
  });

  return mutation;
};
