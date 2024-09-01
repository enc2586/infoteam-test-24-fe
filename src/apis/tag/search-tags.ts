import axios from "../api-instance";
import { GetTagsResponse } from "./get-tags";

type SearchTagsInputs = {
  query: string;
};

type SearchTagsResponse = GetTagsResponse;

export const searchTags = async ({ query }: SearchTagsInputs) => {
  const { data } = await axios.get<SearchTagsResponse>(`/tag/search`, {
    params: {
      keyword: query,
    },
  });

  return data;
};
