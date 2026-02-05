import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

function LogOut() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handelLogOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Log Out Error:", error);
    }
  };
  return (
    <Button onClick={handelLogOut} variant="destructive">
      Log Out
    </Button>
  );
}

export default LogOut;
