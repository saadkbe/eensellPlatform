import { ChatInterface } from "@/components/dashboard/chat/ChatInterface";

export const metadata = {
  title: "Nexus AI | Eensell University",
  description: "Chat with Nexus, your personal AI mentor.",
};

export default function ChatPage() {
  return (
    <div className="h-full">
      <ChatInterface />
    </div>
  );
}
