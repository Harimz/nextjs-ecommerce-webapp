import { db } from "@/lib/db";

import { headers as nextHeaders } from "next/headers";

export const getCurrent = async () => {
  const session = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/user/current`,
    {
      credentials: "include",
      headers: typeof window === "undefined" ? nextHeaders() : undefined,
    }
  );

  if (session.status === 401) {
    return null;
  }

  const sessionData = await session.json();

  return sessionData.data;
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
