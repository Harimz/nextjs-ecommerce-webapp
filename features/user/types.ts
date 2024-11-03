// types/user.ts
export interface CurrentUserData {
  id: string;
  name: string;
  email: string;
}

export interface CurrentUserResponse {
  data: CurrentUserData;
}
