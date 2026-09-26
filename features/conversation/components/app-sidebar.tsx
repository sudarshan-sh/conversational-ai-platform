"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MoonIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useConversations,
  useDeleteConversation,
  useUpdateConversation,
} from "@/features/conversation/hooks/use-conversation";
import { cn } from "@/lib/utils";

type Conversation = NonNullable<
  ReturnType<typeof useConversations>["data"]
>[number];

/**
 * Main application sidebar — logo, new chat, conversation list, theme toggle, and account.
 */
export function AppSidebar() {
  const pathname = usePathname();
  const { data: conversations, isLoading } = useConversations();

  // Get the active conversation id from the pathname (e.g. /c/123)
  // pathname.split("/")[2] is the third part of the pathname (the conversation id)
  //  firstparam = / , secondparam = c , thirdparam = 123
  const activeId = pathname.startsWith("/c/")
    ? pathname.split("/")[2]
    : undefined;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-2 border-b border-sidebar-border/60 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="font-semibold tracking-tight"
              tooltip="Conversational AI Platform"
              render={<Link href="/" />}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                C
              </span>
              <span className="truncate">Conversational AI Platform</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New chat"
              render={<Link href="/" />}
              className="border border-sidebar-border/60 bg-sidebar-accent/40 font-medium hover:bg-sidebar-accent"
            >
              <PlusIcon />
              <span>New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ChatList
                conversations={conversations}
                isLoading={isLoading}
                activeId={activeId}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 pt-2">
        <SidebarFooterMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/** Renders the conversation list with loading skeletons or an empty-state message. */
function ChatList({
  conversations,
  isLoading,
  activeId,
}: {
  conversations: Conversation[] | undefined;
  isLoading: boolean;
  activeId: string | undefined;
}) {
  if (isLoading) {
    const widths = ["w-full", "w-5/6", "w-full", "w-2/3", "w-4/5"];
    return (
      <>
        {widths.map((width, index) => (
          <SidebarMenuItem key={index} className="mb-1 last:mb-0">
            <Skeleton className={cn("h-8 rounded-md", width)} />
          </SidebarMenuItem>
        ))}
      </>
    );
  }

  if (!conversations?.length) {
    return (
      <p className="px-2 py-1.5 text-xs text-muted-foreground">No chats yet</p>
    );
  }

  return (
    <>
      {conversations.map((conversation) => (
        <ChatItem
          key={conversation.id}
          conversation={conversation}
          isActive={activeId === conversation.id}
        />
      ))}
    </>
  );
}

/** Single sidebar row for a conversation with rename, pin, and delete actions. */
function ChatItem({
  conversation,
  isActive,
}: {
  conversation: Conversation;
  isActive: boolean;
}) {
  const updateConversation = useUpdateConversation();
  const deleteConversation = useDeleteConversation(
    isActive ? conversation.id : undefined,
  );

  /** Prompts the user to rename the conversation and persists the new title. */
  function handleRename() {
    const next = window.prompt("Rename chat", conversation.title);
    if (!next || next.trim() === conversation.title) return;
    updateConversation.mutate({ id: conversation.id, title: next });
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={conversation.title}
        render={<Link href={`/c/${conversation.id}`} />}
        className={cn(isActive && "font-medium")}
      >
        <span className="truncate">{conversation.title}</span>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuAction
              showOnHover
              className="data-popup-open:bg-sidebar-accent"
            />
          }
        >
          <MoreHorizontalIcon />
          <span className="sr-only">Chat actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={handleRename}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateConversation.mutate({
                id: conversation.id,
                isPinned: !conversation.isPinned,
              })
            }
          >
            {conversation.isPinned ? <PinOffIcon /> : <PinIcon />}
            {conversation.isPinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteConversation.mutate(conversation.id)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

/**
 * Footer account button — Clerk's `UserButton` (keeps "Manage account", security,
 * sessions, etc. built in) with the full name shown and a custom "Toggle theme"
 * action merged into its menu via `UserButton.MenuItems`.
 */
function SidebarFooterMenu() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center rounded-md px-1 py-1 hover:bg-sidebar-accent/60">
          <UserButton
            showName
            appearance={{
              elements: {
                rootBox: "w-full",
                userButtonTrigger:
                  "w-full flex items-center gap-2 rounded-md focus:shadow-none",
                userButtonBox: "w-full flex-row-reverse gap-2",
                userButtonOuterIdentifier:
                  "truncate text-sm text-sidebar-foreground group-data-[collapsible=icon]:hidden",
                avatarBox: "size-8",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                labelIcon={
                  resolvedTheme === "dark" ? (
                    <SunIcon className="size-4" />
                  ) : (
                    <MoonIcon className="size-4" />
                  )
                }
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
