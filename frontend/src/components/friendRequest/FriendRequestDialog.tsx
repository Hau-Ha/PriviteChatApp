import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { useFriendStore } from "@/stores/useFriendStore";
import SentRequests from "./SentRequests.tsx";
import ReceivedRequests from "./ReceivedRequests.tsx";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState("received");
  const { getAllFriendRequests, receivedList, sentList } = useFriendStore();

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const data = await getAllFriendRequests();
        console.log("FRIEND REQUEST DATA:", data);
      } catch (error) {
        console.error("Error loading requests", error);
      }
    };

    loadRequest();
  }, []);

  useEffect(() => {
    console.log("Received list updated:", receivedList);
    console.log("Sent list updated:", sentList);
  }, [receivedList, sentList]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <ReceivedRequests />
          </TabsContent>

          <TabsContent value="sent">
            <SentRequests />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
