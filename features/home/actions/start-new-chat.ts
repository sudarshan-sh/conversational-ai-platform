"use server";

import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db";

/**
 * Server action for the home route — reuses an existing, untouched "New Chat"
 * conversation if one exists, otherwise creates a fresh one. Prevents every
 * visit to "/" from spawning a new empty conversation.
 *
 * @returns The ID of the (reused or newly created) conversation.
 */
export async function startNewChat() {
  const user = await requireUser();

  const existing = await prisma.conversation.findFirst({
    where: {
      userId: user.id,
      title: "New Chat",
      messages: { none: {} },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: "New Chat",
    },
  });

  return conversation.id;
}
