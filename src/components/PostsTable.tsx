import { Table } from "antd";
import { PostType } from "../apis/post/types";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Tag } from "./Tag";

type PostsTableProps = {
  posts?: PostType[];
};

export function PostsTable({ posts }: PostsTableProps) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const columns: ColumnsType<PostType> = [
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "태그",
      dataIndex: "tags",
      render: (tags: string[]) =>
        tags.sort((a, b) => a.localeCompare(b)).map((tag) => `#${tag} `),
    },
    {
      title: "작성일시",
      dataIndex: "createdAt",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "작성자",
      dataIndex: "createdBy",
      render: (value) => {
        const isMe = user?.sub === value.email;

        if (isMe) return `${value.nickname} (자신)`;
        return value.nickname;
      },
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
