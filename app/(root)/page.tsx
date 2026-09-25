import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2 font-semibold">
          <MessageCircle className="size-5" />
          <span>Conversational AI Platform</span>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <UserButton />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your AI, ready to talk.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Ask questions, brainstorm ideas, or just have a conversation —
          powered by a fast, friendly AI assistant.
        </p>
        <Button size="lg">Start a conversation</Button>
      </main>
    </div>
  );
}
