import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styled from "styled-components";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { useForm } from "react-hook-form";

const Header = styled.header`
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #000;
`;

export function Component() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const { register, handleSubmit } = useForm<{ query: string }>();

  const onSubmit = ({ query }: { query: string }) => {
    navigate(`/search?q=${query}`);
  };

  const [boardId] = useSearchParamsState("boardId", "", (v) =>
    v === "" ? undefined : v
  );

  if (!token) {
    return <Navigate to="/u/login?redirect=" />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <Header>
        {window.innerWidth > 768 && (
          <h1
            onClick={() => navigate("/board")}
            style={{
              cursor: "pointer",
            }}
          >
            INFOTEAM
          </h1>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <Input
              type="text"
              placeholder="제목과 본문 검색..."
              style={{
                width: "200px",
              }}
              {...register("query", { required: true })}
            />
            <Button $variant="outlined" style={{ width: "70px" }} type="submit">
              검색
            </Button>
          </div>
        </form>

        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
          <Button
            onClick={() => {
              navigate(`/write${boardId ? `?boardId=${boardId}` : ""}`);
            }}
          >
            글쓰기
          </Button>
          <Button
            onClick={() => {
              if (window.confirm("로그아웃하시겠습니까?")) {
                logout();
              }
            }}
          >
            로그아웃
          </Button>
        </div>
      </Header>
      <Outlet />
    </div>
  );
}
