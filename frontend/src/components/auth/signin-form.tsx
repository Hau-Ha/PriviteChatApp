import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const SignInSchema = z.object({
  userName: z.string().min(1, "User name is required"),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignIpFormValue = z.infer<typeof SignInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignIpFormValue>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignIpFormValue) => {
    const { userName, password } = data;
    try {
      await signIn(userName, password);
      // Redirect or show success message after sign in
      navigate("/");
    } catch (error) {
      console.error("Sign In Error:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="max-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" className="max-w-20" />
                </a>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>
              {/* User Name */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="userName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  User Name
                </Label>
                <Input
                  id="userName"
                  placeholder="Your user name"
                  {...register("userName")}
                  disabled={isSubmitting}
                />
                {errors.userName && (
                  <p className="text-sm text-red-600">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Your password"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
