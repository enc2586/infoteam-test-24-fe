import axios from "../api-instance";
import { BoardType, RawBoardType } from "./types";
import { transformRawBoard } from "./utils";

export type CreateBoardInputs = Pick<BoardType, "title">;

export const createBoard = async (inputs: CreateBoardInputs) => {
  const { data } = await axios.post<RawBoardType>("/boards", inputs);

  return transformRawBoard(data);
};
