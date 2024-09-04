import { useQuery } from "@tanstack/react-query";
import { Row, UploadFile, Image, Space, Alert } from "antd";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getPost } from "../apis/post/get-post";
import { patchPost, PatchPostInputs } from "../apis/post/patch-post";
import { createTag } from "../apis/tag/create-tag";
import { Button } from "../components/Button";
import { FullScreenLoading } from "../components/FullScreenLoading";
import { Input } from "../components/Input";
import { TagsSelector } from "../components/TagsSelector";
import { TextArea } from "../components/TextArea";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { deleteImage } from "../apis/post/delete-image";
import { postImage } from "../apis/post/create-image";

const FormContainer = styled.div`
  padding: 20px;
  height: parent;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Inputs = Omit<PatchPostInputs["post"], "tags">;

export function Component() {
  const navigate = useNavigate();

  const [postId] = useSearchParamsState("postId", "");

  const { data, refetch } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => getPost({ postId: postId }),
    enabled: !!postId,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    if (data) {
      const { title, body, tags } = data;
      setTags(tags);
      reset({ title, body });
    }
  }, [data]);

  const formRef = useRef<HTMLFormElement>(null);

  const [tags, setTags] = useState<string[]>([]);

  const onSubmit = async ({ title, body }: Inputs) => {
    try {
      if (tags.length > 0) {
        toast.loading("태그 먼저 보내는 중", { id: "loading" });

        const requests = tags.map((tag) => createTag({ key: tag }));
        await Promise.allSettled(requests);
      }

      toast.loading("글쓰는 중", { id: "loading" });

      const { id } = await patchPost({
        postId,
        post: {
          title,
          body,
          tags,
        },
      });

      toast.success("글이 수정되었습니다", { id: "loading" });
      navigate(`/post?postId=${id}`);
    } catch (_) {
      toast.error("글 수정에 실패했습니다", { id: "loading" });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      await toast.promise(postImage({ postId, image: file }), {
        loading: "이미지 업로드 중...",
        success: "이미지를 업로드했습니다",
        error: "이미지 업로드에 실패했습니다",
      });
      refetch();
    }
  };

  if (!data) {
    return <FullScreenLoading />;
  }

  return (
    <FormContainer>
      <h1>글 수정</h1>

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

        <Row>
          {data.images.map(({ image, id }) => (
            <Image
              src={`data:image/png;base64,${image}`}
              height={150}
              preview={{
                toolbarRender: () => (
                  <Space size={12} className="toolbar-wrapper">
                    <Button
                      onClick={async () => {
                        await toast.promise(
                          deleteImage({ postId, imageId: id }),
                          {
                            loading: "이미지 삭제 중...",
                            success: "이미지를 삭제했습니다",
                            error: "이미지 삭제에 실패했습니다",
                          }
                        );
                        refetch();
                      }}
                    >
                      삭제
                    </Button>
                  </Space>
                ),
              }}
            />
          ))}
        </Row>

        <div>
          <button type="button" onClick={handleButtonClick}>
            이미지 추가
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <Alert message="이미지 추가/삭제는 즉시 반영됩니다." />

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
