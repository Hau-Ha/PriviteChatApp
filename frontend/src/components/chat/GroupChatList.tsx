import { useChatStore } from '@/stores/useChatStore';
import React from 'react'

const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) {
    return <div>Loading...</div>;
  }

  const directConversations = conversations.filter(
    (conv) => conv.type === "group"
  );

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {directConversations.map((convo) => (
        <GroupChatList convo={convo} />
      ))}
    </div>
  );
};
}

export default GroupChatList