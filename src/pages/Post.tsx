import { useQuery } from "@tanstack/react-query";
import { getPost } from "../apis/post/get-post";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { FullScreenLoading } from "../components/FullScreenLoading";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";

export function Component() {
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
    createdAt,
    createdBy: { nickname, id },
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
              key: 3,
              label: "태그",
              children: tags.length ? (
                tags
                  .sort((a, b) => a.localeCompare(b))
                  .map((i) => (
                    <Link
                      to={`/board?tag=${i}`}
                      key={i}
                      style={{ marginRight: "5px" }}
                    >
                      #{i}
                    </Link>
                  ))
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
      </div>
    </div>
  );
}
