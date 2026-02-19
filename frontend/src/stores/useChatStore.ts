import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatState } from "@/types/store";
import { chatService } from "@/services/chatService";

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      loading: false,
      convoLoading: false,
      messageLoading: false,

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
        });
      },
      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversations();

          set({ conversations, convoLoading: false });
        } catch (error) {
          console.error("Erro when fetchConvertation", error);
          set({ convoLoading: false });
        }
      },
      // fetchMessages: async (id) => {},
      // addConversation: (conversation) => {},
      // addMessage: (conversationId, message) => {},
      // updateConversation: (id, conversation) => {},
      // updateMessage: (conversationId, messageId, message) => {},
      // deleteConversation: (id) => {},
      // deleteMessage: (conversationId, messageId) => {},
      // clearMessages: (conversationId) => {},
      // setLoading: (loading) => set({ loading }),
      // setConvoLoading: (convoLoading) => set({ convoLoading }),
      // setMessageLoading: (messageLoading) => set({ messageLoading }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    }
  )
);
