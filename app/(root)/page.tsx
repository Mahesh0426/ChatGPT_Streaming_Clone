import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <h1>Welcome to My AI Chat App</h1>
        <ModeToggle />
        <UserButton />
      </main>
    </div>
  );
}
