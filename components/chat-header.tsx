import { Cross1Icon } from "@radix-ui/react-icons";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ChatHeader({ toggleChatbot }) {
    return (
        <div className="flex flex-row items-center p-3">
            <div className="flex items-center space-x-4">
                <Avatar>
                    <Image src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" fill={true} alt="User avatar" />
                </Avatar>
                <div>
                    <p className="text-sm font-medium leading-none">Vishal Meena</p>
                    <p className="text-sm text-muted-foreground">meenavishal2211@gmail.com</p>
                </div>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="outline" className="ml-auto rounded-full" onClick={toggleChatbot}>
                            <Cross1Icon className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
