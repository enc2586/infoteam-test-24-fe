import axios from "../api-instance";
import { BoardType } from "../board/types";
import { PostType, RawPostType } from "./types";
import { transformRawPost } from "./utils";

export type CreatePostInputs = Pick<PostType, "title" | "body" | "tags"> & {
  boardId: BoardType["id"];
};

export const createPost = async ({ boardId, ...post }: CreatePostInputs) => {
  const { data } = await axios.post<RawPostType>("/posts", post, {
    params: {
      boardUuid: boardId,
    },
  });
  return transformRawPost(data);
};
