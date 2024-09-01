import { transformRawUser } from "../auth/utils";
import { transformRawBoard } from "../board/utils";
import { PostType, RawPostType } from "./types";

export function transformRawPost({
  createdAt,
  createdBy,
  board,
  ...rest
}: RawPostType): PostType {
  return {
    ...rest,
    createdAt: new Date(createdAt),
    createdBy: transformRawUser(createdBy),
    board: transformRawBoard(board),
  };
}
