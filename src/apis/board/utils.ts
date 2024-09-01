import { transformRawUser } from "../auth/utils";
import { BoardType, RawBoardType } from "./types";

export function transformRawBoard({
  createdAt,
  creator,
  ...rest
}: RawBoardType): BoardType {
  return {
    ...rest,
    createdAt: new Date(createdAt),
    creator: transformRawUser(creator),
  };
}
