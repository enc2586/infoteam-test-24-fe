import axios from "../api-instance";
import { TagType } from "./types";

export type GetTagsResponse = {
  count: number;
  list: TagType[];
};

export const getTags = async () => {
  const { data } = await axios.get<GetTagsResponse>("/tag");

  return data;
};
