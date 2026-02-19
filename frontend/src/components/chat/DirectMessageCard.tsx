import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages } =
    useChatStore();

  if (!user) return null;

  const otherUser = convo.participants.find((p) => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCount = convo.unreadCounts[user._id] || 0;
  const lastMessage = convo.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      // await fetchMessages(id);
    }
  };
  return (
    <div>
      <ChatCard
        convoId={convo._id}
        name={otherUser.displayName ?? ""}
        timestamp={
          convo.lastMessage?.createdAt
            ? new Date(convo.lastMessage.createdAt)
            : undefined
        }
        isActive={activeConversationId === convo._id}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={<>{/* Todo: useravata */}</>}
        subtitle={
          <p
            className={cn(
              "text-sm truncate",
              unreadCount > 0
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {lastMessage}
          </p>
        }
      />
    </div>
  );
};

export default DirectMessageCard;
