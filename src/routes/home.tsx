import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { AppWindowMac } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Navbar } from "@/components/navbar";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Room } from "@/models/room";
import { useAuth } from "@/hoooks/auth";
import { createNewRoom, enterRoom, getRoomList } from "@/data/services";
import { newPlayJoinedWS, newRoomCreatedWS } from "@/data/websocket";
import { socketIo } from "@/ws/socket.io";
import { useToast } from "@/components/ui/use-toast";

const createRoomSchema = z.object({
  roomName: z
    .string({ required_error: "Este campo é obrigatório" })
    .min(4, { message: "Informe um nome com pelo menos 4 caracter" }),
  capacity: z.array(
    z
      .number({ coerce: true, required_error: "Este campo é obrigatório" })
      .min(2, { message: "O valor mínimo é 2" })
      .max(30, { message: "O valor máximo é 30" })
  ),
  isSecure: z.boolean(),
  password: z.string(),
});

const enterInRoomSchema = z.object({
  room: z.string({ required_error: "Este campo é obrigatório" }),
  password: z.string().optional(),
});

type CreateRoom = z.infer<typeof createRoomSchema>;
type EnterInRoom = z.infer<typeof enterInRoomSchema>;

export function Home() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setRoom] = useState<Room | undefined>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createRoomForm = useForm<CreateRoom>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      capacity: [2],
      roomName: "",
      isSecure: false,
      password: "",
    },
  });

  const enterInRoomForm = useForm<EnterInRoom>({
    resolver: zodResolver(enterInRoomSchema),
    defaultValues: {
      room: "sala1",
      password: "",
    },
  });

  const handleCreateNewRoom = async (data: CreateRoom) => {
    const result = await createNewRoom(data, user!);

    if (result.ok) {
      newRoomCreatedWS();
      newPlayJoinedWS(result.roomId, user!);
      navigate(`/game?room=${data.roomName}`);
    }
  };

  const handleEnterRoom = async (data: EnterInRoom) => {
    const response = await enterRoom({
      room: data.room,
      password: data.password || "",
    });

    if (response.ok) {
      newPlayJoinedWS(data.room, user!);
      navigate(`/game?room=${selectedRoom?.name}`);
    }

    if (response.error) {
      toast({
        title: "Ops...",
        description: response.error,
        variant: "destructive",
      });
    }
  };

  const watchIsSecure = createRoomForm.watch("isSecure");
  const watchRoom = enterInRoomForm.watch("room");

  useEffect(() => {
    const room = rooms.find((r) => r.id === watchRoom);
    setRoom(room as Room);
  }, [watchRoom]);

  useEffect(() => {
    getRoomList().then((res) => setRooms(res));
    socketIo.on("list_room_updated", ({ list }) => setRooms(list));

    return () => {
      socketIo.off("list_room_updated");
    };
  }, []);
  return (
    <div className="space-y-4 h-full">
      <div className="gap-2">
        <Navbar />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 p-6 rounded-lg ">
          <Form {...createRoomForm}>
            <form
              onSubmit={createRoomForm.handleSubmit(handleCreateNewRoom)}
              className="flex-1 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <p className="font-bold text-xl">Criar uma nova sala:</p>
                <FormField
                  control={createRoomForm.control}
                  name="roomName"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel htmlFor="roomName">Nome da sala</FormLabel>
                      <FormControl>
                        <Input
                          id="roomName"
                          placeholder="ex: Mindera happy hour"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createRoomForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel htmlFor="capacity">
                        Qnt. participantes
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Slider
                            value={field.value}
                            max={30}
                            min={2}
                            step={1}
                            onValueChange={(vl) => {
                              field.onChange(vl);
                            }}
                          />
                          <Input
                            type="number"
                            id="capacity"
                            max={30}
                            min={2}
                            className="w-16 text-center"
                            value={field.value[0]}
                            onChange={(val) =>
                              field.onChange([Number(val.target.value)])
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col lg:flex-row lg:gap-0  gap-4 lg:items-center justify-between">
                  <FormField
                    control={createRoomForm.control}
                    name="isSecure"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Criar sala com senha?</FormLabel>
                      </FormItem>
                    )}
                  />
                  {watchIsSecure && (
                    <FormField
                      control={createRoomForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                          <FormControl>
                            <Input
                              disabled={!watchIsSecure}
                              id="password"
                              placeholder="Senha"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Button type="submit" className="flex items-center gap-2">
                <AppWindowMac /> Criar sala
              </Button>
            </form>
          </Form>

          <div className="px-0 lg:px-6">
            <Separator className="hidden lg:block" orientation="vertical" />
            <Separator className="lg:hidden" orientation="horizontal" />
          </div>

          <Form {...enterInRoomForm}>
            <form
              onSubmit={enterInRoomForm.handleSubmit(handleEnterRoom)}
              className="w-full flex-1 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <p className="font-bold text-xl">Entrar em uma partida:</p>

                <FormField
                  control={enterInRoomForm.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel htmlFor="roomName">Selecione a sala</FormLabel>

                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {selectedRoom?.isSecure && (
                  <FormField
                    control={enterInRoomForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <FormControl>
                          <Input id="password" placeholder="Senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" className="flex items-center gap-2">
                <AppWindowMac /> Entrar
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
