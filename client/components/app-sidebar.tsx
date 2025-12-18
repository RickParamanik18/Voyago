import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { IconPlus } from "@tabler/icons-react";

const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

export function AppSidebar({
    setThreadId,
    newChatHandler,
    threads,
}: {
    setThreadId: (threadId: string) => void;
    newChatHandler: () => void;
    threads: string[];
}) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="text-center my-3">
                            <Button
                                variant={"outline"}
                                onClick={newChatHandler}
                            >
                                New Chat <IconPlus />
                            </Button>
                        </div>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>Chat History</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {threads.map((thread_id, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        {/* <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a> */}
                                        <span
                                            onClick={() =>
                                                setThreadId(thread_id)
                                            }
                                        >
                                            {thread_id.substring(0, 10)}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
