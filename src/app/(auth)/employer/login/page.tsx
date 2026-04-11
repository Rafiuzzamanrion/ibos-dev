"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginSchema, LoginFormData } from "@/schemas/authSchema";
import { AppFooter } from "@/components/shared/AppFooter";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function EmployerLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: "employer",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        router.push("/employer/dashboard");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#1e1b4b] px-6 md:px-8">
        <Image
          src="/Resource Logo 1 (1).png"
          alt="Akij Resource"
          width={120}
          height={32}
          className="brightness-0 invert"
        />
        <h1 className="text-base font-semibold text-white">Akij Resource</h1>
        <div />
      </header>

      <div className="flex flex-1 items-center justify-center bg-[#f8f8fc] px-4 py-12">
        <div className="w-full max-w-[420px]">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            Sign In
          </h2>

          <Card>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email/ User ID</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email/User ID"
                    {...register("email")}
                    className="mt-1.5"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}

                  <p className="mt-2 text-right text-xs text-muted-foreground hover:text-primary cursor-pointer">
                    Forget Password?
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary py-5 text-sm font-medium text-white hover:bg-primary/90"
                  id="employer-login-button"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
