import { useMutation, useQuery } from "@tanstack/react-query";
import { Select, UploadFile } from "antd";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getBoardList } from "../apis/board/get-board-list";
import { createPost, CreatePostInputs } from "../apis/post/create-post";
import { Button } from "../components/Button";
import { ImagesSelect } from "../components/ImagesSelect";
import { Input } from "../components/Input";
import { TagsSelector } from "../components/TagsSelector";
import { TextArea } from "../components/TextArea";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { postImage } from "../apis/post/create-image";
import { createTag } from "../apis/tag/create-tag";

const FormContainer = styled.div`
  padding: 20px;
  height: parent;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Inputs = Omit<CreatePostInputs, "tags">;

export function Component() {
  const navigate = useNavigate();

  const [boardId] = useSearchParamsState("boardId", "", (v) =>
    v === "" ? undefined : v
  );
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      boardId: boardId,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: boards } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => (await getBoardList()).list,
  });

  const onSubmit = async ({ boardId, title, body }: Inputs) => {
    if (!boardId) {
      setError("boardId", { message: "게시판을 선택해주세요" });
      return;
    }

    try {
      if (tags.length > 0) {
        toast.loading("태그 먼저 보내는 중", { id: "loading" });

        const requests = tags.map((tag) => createTag({ key: tag }));

        await Promise.all(requests);
      }

      toast.loading("글쓰는 중", { id: "loading" });

      const { id } = await createPost({
        boardId,
        title,
        body,
        tags,
      });

      if (fileList.length > 0) {
        toast.loading("사진 올리는 중", { id: "loading" });

        const requests = fileList.map((file) =>
          postImage({ postId: id, image: file.originFileObj! })
        );

        await Promise.all(requests);
      }

      toast.success("글이 작성되었습니다", { id: "loading" });
      navigate(`/board?boardId=${boardId}`);
    } catch (_) {
      toast.error("글 작성에 실패했습니다", { id: "loading" });
    }
  };

  return (
    <FormContainer>
      <h1>새로운 글</h1>

      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "540px",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <div>
            <Select
              options={boards?.map(({ id, title }) => ({
                label: title,
                value: id,
              }))}
              placeholder="게시판 선택"
              style={{ width: "100%" }}
              size="large"
              defaultValue={boardId}
              onChange={(value) => {
                setValue("boardId", value);
              }}
            />
            {errors.boardId && <p>{errors.boardId.message}</p>}
          </div>

          <div>
            <Input
              placeholder="제목"
              style={{
                fontWeight: "bold",
              }}
              {...register("title", {
                required: "제목을 입력해주세요",
              })}
            />
            {errors.title && <p>{errors.title.message}</p>}
          </div>

          <div>
            <TextArea
              placeholder="내용"
              {...register("body", { required: "내용을 입력해주세요" })}
            />
            {errors.body && <p>{errors.body.message}</p>}
          </div>
        </div>
      </form>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "545px",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <TagsSelector value={tags} setValue={setTags} />

        <ImagesSelect fileList={fileList} setFileList={setFileList} />

        <Button
          style={{ marginTop: "20px" }}
          disabled={isSubmitting}
          onClick={() =>
            formRef.current!.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            )
          }
        >
          저장
        </Button>
      </div>
    </FormContainer>
  );
}
