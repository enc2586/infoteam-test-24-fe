import { useQuery } from "@tanstack/react-query";
import { PostsTable } from "../components/PostsTable";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { searchPosts } from "../apis/post/search-posts";

export function Component() {
  const [query] = useSearchParamsState("q", "", (v) => (v === "" ? "" : v));

  const { data } = useQuery({
    queryKey: ["posts", query],
    queryFn: async () =>
      (await searchPosts({ query })).list.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      ),
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
          maxWidth: "800px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h1>"{query}" 검색 결과</h1>
        <PostsTable posts={data} />
      </div>
    </div>
  );
}
