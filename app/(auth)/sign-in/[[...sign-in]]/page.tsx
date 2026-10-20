import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignIn forceRedirectUrl={"/"} />
      <div className="mt-4 rounded-lg border p-4 text-sm">
        <p className="mb-2 font-medium">Test credential</p>
        <p>
          Email: <span className="font-mono">mahesh@gmail.com</span>
        </p>
        <p>
          Password: <span className="font-mono">TryMyChat2026</span>
        </p>
      </div>
    </>
  );
}
