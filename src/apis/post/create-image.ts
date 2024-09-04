import { UploadFile } from "antd/es/upload";
import axios from "../api-instance";
import { PostType } from "./types";

type PostImageInputs = {
  postId: PostType["id"];
  image: File;
};

export const postImage = async ({ postId, image }: PostImageInputs) => {
  const formData = new FormData();

  formData.append("file", image);

  const { data } = await axios.post(`/posts/${postId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
