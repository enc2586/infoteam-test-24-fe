import axios from "../api-instance";

type DeleteBoardInputs = { postId: string };

export const deletePost = async ({ postId }: DeleteBoardInputs) => {
  await axios.delete(`/posts/${postId}`);

  return;
};
