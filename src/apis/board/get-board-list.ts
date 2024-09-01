import axios from "../api-instance";
import { RawBoardType } from "./types";
import { transformRawBoard } from "./utils";

export type GetBoardsListResponse = {
  count: number;
  list: RawBoardType[];
};

export const getBoardList = async () => {
  const {
    data: { list, ...rest },
  } = await axios.get<GetBoardsListResponse>("/boards");

  return { ...rest, list: list.map(transformRawBoard) };
};
