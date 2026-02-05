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

const SignUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userName: z.string().min(1, "User name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormValue = z.infer<typeof SignUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValue>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignupFormValue) => {
    const { firstName, lastName, userName, email, password } = data;
    try {
      await signUp(userName, password, email, firstName, lastName);
      navigate("/signin");
    } catch (error) {
      console.error("Sign Up Error:", error);
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
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your details to create your account
                </p>
              </div>
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    {...register("firstName")}
                    required
                  />

                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName")}
                    required
                  />

                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* user Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="userName"
                  className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  User Name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="User Name"
                  {...register("userName")}
                  required
                />
                {errors.userName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  required
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* register butom */}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Create Account
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/signin" className="underline hover:text-primary">
                  Sign In
                </a>
              </div>
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
      <div className="px-6 text-center *:[a]:hover:text-primary text-sx text-balance text-muted-foreground md:px-0 *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
