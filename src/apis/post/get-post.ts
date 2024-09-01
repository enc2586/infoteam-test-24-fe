import axios from "../api-instance";
import { PostType, RawPostType } from "./types";
import { transformRawPost } from "./utils";

type GetPostInputs = {
  postId: PostType["id"];
};

export const getPost = async ({ postId }: GetPostInputs) => {
  const { data } = await axios.get<RawPostType>(`/posts/${postId}`);

  return transformRawPost(data);
};
