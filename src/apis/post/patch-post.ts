import axios from "../api-instance";
import { CreatePostInputs } from "./create-post";
import { PostType, RawPostType } from "./types";
import { transformRawPost } from "./utils";

type PatchPostInputs = {
  postId: PostType["id"];
  post: CreatePostInputs;
};

export const patchPost = async ({ postId, post }: PatchPostInputs) => {
  const { data } = await axios.patch<RawPostType>(`/posts/${postId}`, post);

  return transformRawPost(data);
};
