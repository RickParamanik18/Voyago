import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import ReactMarkdown from "react-markdown";

interface messageSchema {
    sender: string;
    content: string;
}
const getAvatarName = (str: string) => {
    return str
        .split(" ")
        .map((s: string) => s.charAt(0).toUpperCase())
        .join("");
};
const Message = ({ sender, content }: messageSchema) => {
    return (
        <Item variant="outline" className="mt-5">
            <ItemMedia>
                <Avatar className="size-10 bg-gray-300 rounded-full flex justify-center items-center font-bold">
                    {/* <AvatarImage src="https://github.com/evilrabbit.png" /> */}
                    <AvatarFallback>{getAvatarName(sender)}</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                {/* <ItemTitle>Evil Rabbit</ItemTitle> */}
                <ItemDescription>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button
                    size="icon-sm"
                    variant="outline"
                    className="rounded-full"
                    aria-label="Invite"
                >
                    <Copy />
                </Button>
            </ItemActions>
        </Item>
    );
};

export default Message;
