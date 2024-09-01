import { Table } from "antd";
import { PostType } from "../apis/post/types";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";

type PostsTableProps = {
  posts?: PostType[];
};

export function PostsTable({ posts }: PostsTableProps) {
  const navigate = useNavigate();
  const columns: ColumnsType<PostType> = [
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "작성일시",
      dataIndex: "createdAt",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "작성자",
      dataIndex: "createdBy",
      render: (value) => value.nickname,
    },
  ];

  return (
    <Table
      dataSource={posts?.map((post) => ({ ...post, key: post.id }))}
      columns={columns}
      loading={!posts}
      pagination={false}
      onRow={(record) => {
        return {
          onClick: () => navigate(`/post?postId=${record.id}`),
        };
      }}
      style={{
        cursor: "pointer",
      }}
    />
  );
}
