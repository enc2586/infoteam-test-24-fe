import { RawUserType, UserType } from "./types";

export function transformRawUser({
  createdAt,
  ...rest
}: RawUserType): UserType {
  return {
    ...rest,
    createdAt: new Date(createdAt),
  };
}
