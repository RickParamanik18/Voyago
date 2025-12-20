"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IconCheck, IconInfoCircle, IconPlus } from "@tabler/icons-react";
import { ArrowUpIcon, Search } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import Message from "@/components/Message";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { getSocket } from "@/lib/socket";

interface messageSchema {
    sender: string;
    content: string;
}

export default function Home() {
    const [threadId, setThreadId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const query_input = useRef(null);
    const [chats, setChats] = useState<messageSchema[]>([]);
    const [userData, setUserData] = useState<any>({ threads: [] });
    const router = useRouter();

    const newChatHandler = () => {
        const thread_id = uuidv4();
        setThreadId(thread_id);
        //add this thread_id to the user DB
        return thread_id;
    };
    const submitHandler = () => {
        (query_input.current as any).value = "";
        console.log(query);
        //if its a new chat then create a new thread id
        let newThreadId = threadId;
        if (!threadId) newThreadId = newChatHandler();
        const socket = getSocket();
        socket.emit("send-message", {
            roomId: newThreadId,
            message: query,
            sender: userData?.name,
        });

        setChats((prev) => [
            ...prev,
            { sender: userData.name, content: query },
            // { role: "ai", content: "how can i help you" },
        ]);

        fetch("http://localhost:5000/api/thread/add-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                threadId,
                message: { sender: userData.name, content: query },
            }),
        }).then(async (res) => {
            const temp = await res.json();
        });

        setQuery("");
    };

    const getAvatarName = () => {
        return userData?.name
            ? userData.name
                  .split(" ")
                  .map((s: string) => s.charAt(0).toUpperCase())
                  .join("")
            : "*";
    };

    useEffect(() => {
        if (!threadId) return;
        console.log("Thread ID Changed:", threadId);
        //update DB it is a  new thread id
        if (!userData.threads.includes(threadId)) {
            console.log("Thread IDDD:", threadId);
            fetch("http://localhost:5000/api/user/add_thread", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ thread_id: threadId }),
            }).then(async (res) => {
                const result = await res.json();
                console.log("Add Thread Result:", result);
                setUserData(result.data);

                if (!result.success) {
                    toast.error("Failed to create new Chat:" + result.message);
                    return;
                }
                toast.success("New Chat Created");
            });
        }
        // Load chat history based on threadId
        fetch("http://localhost:5000/api/thread/get-messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ threadId }),
        }).then(async (res) => {
            const temp = await res.json();
            setChats(temp.data?.chats || []);
        });

        const socket = getSocket();
        socket.emit("join-room", { roomId: threadId, name: userData?.name });
    }, [threadId]);

    useEffect(() => {
        fetch("http://localhost:5000/api/me", {
            method: "GET",
            credentials: "include",
        }).then(async (res) => {
            const temp = await res.json();
            setUserData(temp.data);
            if (!temp.success) router.push("/auth");
        });

        const socket = getSocket();
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });
        socket.on("new-message", ({ message, sender }) => {
            console.log(`New message from ${sender}: ${message}`);
            setChats((prev) => [...prev, { sender, content: message }]);
        });
        socket.on("disconnect", () => {
            console.log("Disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar
                setThreadId={setThreadId}
                newChatHandler={newChatHandler}
                threads={userData?.threads || []}
            />
            <SidebarTrigger />
            <div className="pb-3 px-10 w-screen md:w-[78vw] h-[92vh] flex flex-col justify-between">
                <div className="">
                    <div className="nav flex justify-between">
                        <span className="text-xl font-semibold">VoyaGo</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarFallback>
                                        {getAvatarName()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-20" align="start">
                                <DropdownMenuItem>Log Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Separator className="my-4" />
                    <div className="conversations max-h-[68vh] overflow-y-scroll">
                        {chats.map((msg: messageSchema, index: number) => (
                            <Message {...msg} key={index} />
                        ))}
                    </div>
                </div>

                <InputGroup>
                    <InputGroupTextarea
                        placeholder="Ask, Search or Chat..."
                        onChange={(e) => setQuery(e.target.value)}
                        ref={query_input}
                    />
                    <InputGroupAddon align="block-end">
                        <InputGroupButton
                            variant="outline"
                            className="rounded-full"
                            size="icon-xs"
                        >
                            <IconPlus />
                        </InputGroupButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <InputGroupButton variant="ghost">
                                    Auto
                                </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="[--radius:0.95rem]"
                            >
                                <DropdownMenuItem>Auto</DropdownMenuItem>
                                <DropdownMenuItem>Agent</DropdownMenuItem>
                                <DropdownMenuItem>Manual</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <InputGroupText className="ml-auto">
                            52% used
                        </InputGroupText>
                        <Separator orientation="vertical" className="h-1" />
                        <InputGroupButton
                            variant="default"
                            className="rounded-full"
                            size="icon-xs"
                            disabled={query.length == 0}
                            onClick={submitHandler}
                        >
                            <ArrowUpIcon />
                            <span className="sr-only">Send</span>
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <Toaster />
        </SidebarProvider>
    );
}
