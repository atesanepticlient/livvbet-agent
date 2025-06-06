import { db } from "@/lib/db";

export const createMessage = async (data: {
  title: string;
  description?: string;
  userId: string;
}) => {
  const { title, description, userId } = data;

  await db.message.create({
    data: {
      title,
      description,
      user: { connect: { id: userId } },
    },
  });
};
