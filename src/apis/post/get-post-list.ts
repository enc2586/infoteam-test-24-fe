import axios from "../api-instance";
import { RawPostType } from "./types";
import { transformRawPost } from "./utils";

export type GetPostListsInputs = {
  boardId?: string;
  tag?: string;
};

export type GetPostListResponse = {
  count: number;
  list: RawPostType[];
};

export const getPostList = async ({ boardId, tag }: GetPostListsInputs) => {
  const {
    data: { list, ...rest },
  } = await axios.get<GetPostListResponse>("/posts", {
    params: {
      boardUuid: boardId,
      tag,
    },
  });

  return { ...rest, list: list.map(transformRawPost) };
};
