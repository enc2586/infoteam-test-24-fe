import { RawUserType, UserType } from "../auth/types";

export type BoardType = {
  id: string;
  title: string;
  createdAt: Date;
  creator: UserType;
};

export type RawBoardType = Omit<BoardType, "createdAt" | "creator"> & {
  createdAt: string;
  creator: RawUserType;
};
