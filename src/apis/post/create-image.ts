import axios from "../api-instance";
import { PostType } from "./types";

type PostImageInputs = {
  postId: PostType["id"];
  image: File;
};

export const postImage = async ({ postId, image }: PostImageInputs) => {
  const { data } = await axios.post(`/posts/${postId}/image`, image);

  return data;
};
