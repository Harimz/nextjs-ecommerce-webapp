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
