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

export default function Home() {
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
                <div className="conversations max-h-[68vh] overflow-y-scroll"></div>
            </div>

            <InputGroup>
                <InputGroupTextarea placeholder="Ask, Search or Chat..." />
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
                        disabled
                    >
                        <ArrowUpIcon />
                        <span className="sr-only">Send</span>
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}
