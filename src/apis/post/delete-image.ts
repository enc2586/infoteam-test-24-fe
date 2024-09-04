import axios from "../api-instance";

type DeleteImageInputs = {
  postId: string;
  imageId: string;
};

export const deleteImage = async ({ postId, imageId }: DeleteImageInputs) => {
  await axios.delete(`/posts/${postId}/image/${imageId}`);

  return;
};
