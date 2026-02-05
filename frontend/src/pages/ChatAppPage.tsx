import LogOut from "@/components/auth/logOut";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      {user?.username}
      ChatAppPage <LogOut />{" "}
    </div>
  );
};

export default ChatAppPage;
