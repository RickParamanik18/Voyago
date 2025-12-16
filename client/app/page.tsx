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
import { useRef, useState } from "react";
import Message from "@/components/Message";

interface messageSchema {
    role: string;
    content: string;
}

export default function Home() {
    const [query, setQuery] = useState("");
    const query_input = useRef(null);
    const [chats, setChats] = useState<messageSchema[]>([]);
    const submitHandler = () => {
        (query_input.current as any).value = "";
        console.log(query);
        setChats((prev) => [
            ...prev,
            { role: "me", content: query },
            { role: "ai", content: "how can i help you" },
        ]);

        setQuery("");
    };

    return (
        <div className="pb-3 px-10 w-[78vw] h-[92vh] flex flex-col justify-between">
            <div className="">
                <div className="nav flex justify-between">
                    <span className="text-xl font-semibold">VoyaGo</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarFallback>CN</AvatarFallback>
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
    );
}
