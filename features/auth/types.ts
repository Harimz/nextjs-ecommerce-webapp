import { UserRole } from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface SessionData {
  session: {
    expires: string;
    user: SessionUser;
  };
  status: "success" | "error";
}

// types/user.ts
export interface CurrentUserData {
  id: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
}

export interface CurrentUserResponse {
  data: CurrentUserData;
}
