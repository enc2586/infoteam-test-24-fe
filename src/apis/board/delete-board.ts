import axios from "../api-instance";

type DeleteBoardInputs = { boardId: string };

export const deleteBoard = async ({ boardId }: DeleteBoardInputs) => {
  await axios.delete(`/boards/${boardId}`);

  return;
};
