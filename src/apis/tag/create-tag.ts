import axios from "../api-instance";
import { TagType } from "./types";

export const createTag = async (input: TagType) => {
  const { data } = await axios.post<TagType>("/tag", input);

  return data;
};
