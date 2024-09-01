import { RawUserType, UserType } from "../auth/types";
import { BoardType, RawBoardType } from "../board/types";

export type PostType = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  board: BoardType;
  createdAt: Date;
  createdBy: UserType;
  images: {
    image: string;
    id: string;
  }[];
};

export type RawPostType = Omit<
  PostType,
  "createdAt" | "createdBy" | "board"
> & {
  createdAt: string;
  createdBy: RawUserType;
  board: RawBoardType;
};
