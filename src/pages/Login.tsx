import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { LoginInputs } from "../apis/auth/types";

type Inputs = LoginInputs & { saveEmail: boolean };

export function Component() {
  const navigate = useNavigate();

  const {
    loginMutation: { mutateAsync: login },
  } = useAuth();

  const [searchParams] = useSearchParams();
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const isExpired = searchParams.get("expired") === "true";
    if (isExpired) {
      setGlobalError("로그인이 만료되었습니다. 재로그인해주세요.");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit = async ({ email, password, saveEmail }: Inputs) => {
    try {
      await login({ email, password });

      if (saveEmail) localStorage.setItem("email", email);
      else localStorage.removeItem("email");

      toast.success("로그인되었습니다");
      navigate("/");
    } catch (_) {
      setGlobalError("오류가 발생했습니다");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h1 style={{ marginBottom: "20px" }}>로그인</h1>

          {globalError && (
            <div
              style={{
                backgroundColor: "#fce4e4",
                color: "#a25050",
                padding: "10px",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            >
              {globalError}
            </div>
          )}

          <div>
            <Input
              placeholder="이메일"
              defaultValue={localStorage.getItem("email") || ""}
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식이 아닙니다",
                },
                maxLength: {
                  value: 100,
                  message: "이메일은 100자 이하여야 합니다",
                },
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <Input
              placeholder="패스워드"
              type="password"
              {...register("password", {
                required: "패스워드를 입력해주세요",
                minLength: {
                  value: 4,
                  message: "패스워드는 4자 이상이어야 합니다",
                },
                maxLength: {
                  value: 20,
                  message: "패스워드는 20자 이하여야 합니다",
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <div>
            <input
              type="checkbox"
              {...register("saveEmail")}
              defaultChecked={!!localStorage.getItem("email")}
            />
            <label htmlFor="saveEmail" style={{ marginLeft: "3px" }}>
              이메일 기억
            </label>
          </div>

          <Button
            style={{ width: "100%" }}
            type="submit"
            disabled={isSubmitting}
          >
            로그인
          </Button>
          <Button
            $variant="outlined"
            style={{ width: "100%" }}
            onClick={() => navigate("/u/register")}
          >
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
}
