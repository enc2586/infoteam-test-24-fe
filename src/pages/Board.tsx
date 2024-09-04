import { useQuery } from "@tanstack/react-query";
import { Button, Input, Modal, Row, Select } from "antd";
import { getBoardList } from "../apis/board/get-board-list";
import { getPostList } from "../apis/post/get-post-list";
import { getTags } from "../apis/tag/get-tags";
import { PostsTable } from "../components/PostsTable";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createBoard } from "../apis/board/create-board";
import { Input as StyledInput } from "../components/Input";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { deleteBoard } from "../apis/board/delete-board";

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
    queryKey: ["posts", boardId, tag],
    queryFn: async () =>
      (
        await getPostList({
          boardId: boardId,
          tag: tag,
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

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const handleAddButtonClick = () => {
    setIsAddBoardModalOpen(true);
  };

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
        <Row style={{ flex: 1 }}>
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
          <Button style={{ marginLeft: "5px" }} onClick={handleAddButtonClick}>
            관리
          </Button>
          <AddBoardModal
            open={isAddBoardModalOpen}
            onClose={() => setIsAddBoardModalOpen(false)}
          />
        </Row>
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

type AddBoardInputs = {
  title: string;
};

function AddBoardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [boardId, setBoardId] = useState<string | null>(null);

  const { data: boards, refetch } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => (await getBoardList()).list,
  });

  const onSubmit = async ({ title }: AddBoardInputs) => {
    await toast.promise(createBoard({ title }), {
      loading: "게시판을 추가하는 중...",
      success: "게시판을 추가했습니다",
      error: "게시판 추가에 실패했습니다",
    });

    refetch();
  };

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<AddBoardInputs>({
    defaultValues: {
      title: "",
    },
  });
  const { user } = useAuth();
  return (
    <Modal
      open={open}
      onClose={onClose}
      onCancel={onClose}
      footer={null}
      title="게시판 관리"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <span>게시판 추가</span>
        <Row>
          <StyledInput
            placeholder="이름"
            style={{ flex: 1, marginRight: "5px" }}
            {...register("title", { required: true })}
          />
          <Button
            htmlType="submit"
            size="large"
            disabled={watch("title").length === 0}
          >
            추가
          </Button>
        </Row>
        {errors.title && <p>게시판 이름을 입력해주세요</p>}
      </form>

      <div
        style={{
          marginTop: "10px",
        }}
      >
        <span>게시판 삭제 (내가 만든 게시판만 가능)</span>
        <Row>
          <Select
            removeIcon
            size="large"
            style={{ flex: 1, marginRight: "5px" }}
            options={boards
              ?.filter((i) => i.creator.email === user?.sub)
              .map(({ id, title }) => ({
                value: id,
                label: title,
              }))}
            value={boardId}
            onChange={(value) => setBoardId(value as string | null)}
          />
          <Button
            danger
            disabled={!boardId}
            size="large"
            onClick={async () => {
              await toast.promise(deleteBoard({ boardId: boardId! }), {
                loading: "게시판을 삭제하는 중...",
                success: "게시판을 삭제했습니다",
                error: "게시판 삭제에 실패했습니다",
              });

              setBoardId(null);
              refetch();
            }}
          >
            삭제
          </Button>
        </Row>
      </div>
    </Modal>
  );
}
