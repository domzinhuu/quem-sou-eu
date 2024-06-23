import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hoooks/auth";
import { backToLobby } from "@/data/services";
import { closeRoomWS } from "@/data/websocket";

interface Props {
  roomId?: string;
}
export function Navbar({ roomId }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (roomId) {
      await backToLobby(roomId, user!.id);
      closeRoomWS(roomId);
      navigate("/home");
      return;
    }

    logout();
    navigate("/");
  };
  return (
    <div className="flex items-center gap-2 px-4 py-2 justify-end">
      <p className="font-normal">
        Olá, <span className="font-bold">{user?.name}</span>
      </p>
      <Button variant="link" size="sm" onClick={handleLogout}>
        <LogOut size={16} className="mr-2 " /> Sair
      </Button>
    </div>
  );
}
