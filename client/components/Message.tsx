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

interface messageSchema {
    role: string;
    content: string;
}

const Message = ({ role, content }: messageSchema) => {
    return (
        <Item variant="outline" className="mt-5">
            <ItemMedia>
                <Avatar className="size-10 bg-gray-300 rounded-full flex justify-center items-center font-bold">
                    {/* <AvatarImage src="https://github.com/evilrabbit.png" /> */}
                    <AvatarFallback>ER</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                {/* <ItemTitle>Evil Rabbit</ItemTitle> */}
                <ItemDescription>{content}</ItemDescription>
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
