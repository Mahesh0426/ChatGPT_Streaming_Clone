import { SignUp } from "@clerk/nextjs";

const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

export default function Page() {
  return (
    <>
      <SignUp forceRedirectUrl={"/"} />
      {demoEmail && demoPassword && (
        <div className="mt-6 rounded-lg border p-4 text-sm">
          <p className="font-medium">Demo account</p>
          <p className="mt-1">
            Email: <span className="font-mono">{demoEmail}</span>
          </p>
          <p>
            Password: <span className="font-mono">{demoPassword}</span>
          </p>
          <p className="mt-2 text-xs opacity-70">
            Sign in with these credentials instead of creating an account.
          </p>
        </div>
      )}
    </>
  );
}
