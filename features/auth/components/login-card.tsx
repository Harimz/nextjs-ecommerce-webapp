"use client";

import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FcGoogle } from "react-icons/fc";
import { useLogin } from "../api/use-login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LoginCard = () => {
  const { mutate, isPending } = useLogin();
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate(values);

    router.refresh();

    router.push("/");
  };

  const onSocial = (provider: "google") => {
    signIn(provider, {
      redirectTo: "/",
    });
  };

  return (
    <Card className="rounded-sm">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl font-light">Login</CardTitle>

        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/privacy">
            <span className="text-primary">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-primary">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent className="">
        <Button
          disabled={false}
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => onSocial("google")}
        >
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
      </CardContent>

      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Label>Password</Label>
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button size="lg" className="w-full" disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register">
            <span className="text-primary">Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
