import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <div
            className="
              mx-auto flex h-12 w-12
              items-center justify-center
              rounded-xl bg-primary text-2xl
            "
          >
            🌿
          </div>

          <p className="mt-3 font-bold text-primary">GreenBridge Marketplace</p>

          <h1 className="mt-7 text-2xl font-bold text-text-primary">
            मोबाइल नंबर से लॉगिन करें
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Login with your mobile number
          </p>
        </div>

        <div className="mt-7">
          <LoginForm />
        </div>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
