import { ChatInterface } from "@/components/dashboard/chat/ChatInterface";

export const metadata = {
  title: "SkyClaw Chat | Eensell University",
  description: "Chat with SkyClaw, your AI assistant.",
};

export default function ChatPage() {
  return (
    <div className="h-full bg-background rounded-2xl overflow-hidden border border-border shadow-sm">
      <ChatInterface />
    </div>
  );
}
