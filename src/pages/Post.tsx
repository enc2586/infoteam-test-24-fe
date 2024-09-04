import { useQuery } from "@tanstack/react-query";
import { getPost } from "../apis/post/get-post";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { FullScreenLoading } from "../components/FullScreenLoading";
import {
  Button,
  Descriptions,
  Image,
  Popconfirm,
  Popover,
  Row,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Tag } from "../components/Tag";
import useAuth from "../hooks/useAuth";
import { deletePost } from "../apis/post/delete-post";
import toast from "react-hot-toast";
import { deleteImage } from "../apis/post/delete-image";

export function Component() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postId, setPostId] = useSearchParamsState<string>("postId", "", (v) =>
    v === "" ? "" : v
  );

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => getPost({ postId }),
    enabled: !!postId,
  });

  if (!post) {
    return <FullScreenLoading />;
  }

  const {
    board: { title: boardTitle },
    title,
    body,
    tags,
    images,
    createdAt,
    createdBy: { nickname, email },
  } = post;

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <h1>{title}</h1>
        <Descriptions
          items={[
            {
              key: 1,
              label: "작성자",
              children: nickname,
            },
            {
              key: 2,
              label: "작성일시",
              children: createdAt.toLocaleString(),
            },
            {
              key: 3,
              label: "게시판",
              children: boardTitle,
            },
            {
              key: 4,
              label: "태그",
              children: tags.length ? (
                tags
                  .sort((a, b) => a.localeCompare(b))
                  .map((i) => <Tag name={i} />)
              ) : (
                <span
                  style={{
                    color: "gray",
                  }}
                >
                  <i>없음</i>
                </span>
              ),
            },
            {
              key: 5,
              label: "관리",
              children: (
                <Row>
                  <Button
                    size="small"
                    onClick={() => navigate(`/board`)}
                    style={{
                      marginRight: "5px",
                    }}
                  >
                    목록으로
                  </Button>
                  {user?.sub === email && (
                    <>
                      <Button
                        size="small"
                        onClick={() => navigate(`/edit?postId=${postId}`)}
                        style={{
                          marginRight: "5px",
                        }}
                      >
                        수정
                      </Button>
                      <Popconfirm
                        title="정말 삭제하시겠습니까?"
                        onConfirm={async () => {
                          try {
                            toast.loading("삭제 중", { id: "loading" });
                            const imagesPromises = images.map(({ id }) =>
                              deleteImage({ postId, imageId: id })
                            );
                            await Promise.all(imagesPromises);
                            await deletePost({ postId });
                            toast.success("삭제 완료", { id: "loading" });
                            navigate(`/board`);
                          } catch (_) {
                            toast.error("삭제 실패", { id: "loading" });
                          }
                        }}
                      >
                        <Button
                          size="small"
                          danger
                          style={{
                            marginRight: "5px",
                          }}
                        >
                          삭제
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                </Row>
              ),
            },
          ]}
        />
        <p
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            border: "1px solid #d9d9d9",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          {body}
        </p>

        <Row>
          {images.map(({ image }) => (
            <Image
              src={`data:image/png;base64,${image}`}
              style={{
                height: "200px",
              }}
            />
          ))}
        </Row>
      </div>
    </div>
  );
}
