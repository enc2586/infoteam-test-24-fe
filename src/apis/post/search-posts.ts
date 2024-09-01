import axios from "../api-instance";
import { GetPostListResponse } from "./get-post-list";
import { transformRawPost } from "./utils";

type SearchPostsInputs = {
  query: string;
};

type SearchPostsResponse = GetPostListResponse;

export const searchPosts = async ({ query }: SearchPostsInputs) => {
  const {
    data: { list, ...rest },
  } = await axios.get<SearchPostsResponse>(`/posts/search`, {
    params: {
      keyword: query,
    },
  });

  return {
    ...rest,
    list: list.map(transformRawPost),
  };
};
