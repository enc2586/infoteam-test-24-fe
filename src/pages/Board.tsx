import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { getBoardList } from "../apis/board/get-board-list";
import { getPostList } from "../apis/post/get-post-list";
import { PostType } from "../apis/post/types";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { getTags } from "../apis/tag/get-tags";
import { PostsTable } from "../components/PostsTable";

export function Component() {
  const [boardId, setBoardId] = useSearchParamsState<string | undefined>(
    "boardId",
    "",
    (v) => (v === "" ? undefined : v)
  );

  const [tag, setTag] = useSearchParamsState<string | undefined>(
    "tag",
    "",
    (v) => (v === "" ? undefined : v)
  );

  const { data: posts } = useQuery({
    queryKey: ["posts", boardId],
    queryFn: async () =>
      (
        await getPostList({
          boardId: boardId,
        })
      ).list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  });

  const { data: boards, isFetching: isBoardsLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => (await getBoardList()).list,
  });

  const { data: tags, isFetching: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => (await getTags()).list,
  });

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
          width: "100%",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          maxWidth: "800px",
        }}
      >
        <Select
          showSearch
          loading={isBoardsLoading}
          placeholder="전체 게시판"
          value={boardId}
          allowClear
          options={boards?.map(({ id, title }) => ({
            value: id,
            label: title,
          }))}
          onChange={(value) => setBoardId(value)}
          style={{ flex: "1" }}
        />
        <Select
          showSearch
          loading={isTagsLoading}
          placeholder="태그 필터링..."
          value={tag}
          allowClear
          options={tags
            ?.sort((a, b) => a.key.localeCompare(b.key))
            .map(({ key }) => ({
              value: key,
            }))}
          onChange={(value) => setTag(value)}
          style={{ flex: "1" }}
        />
      </div>
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <PostsTable posts={posts} />
      </div>
    </div>
  );
}
