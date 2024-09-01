import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  register as registerAccount,
  RegisterInputs,
} from "../apis/auth/register";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function Component() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputs>();

  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterInputs) => {
    setGlobalError(null);

    try {
      await registerAccount(data);

      toast.success("회원가입이 완료. 로그인해주세요!");
      navigate("/u/login");
    } catch (_) {
      setGlobalError("오류가 발생했습니다.");
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
          <h1 style={{ marginBottom: "20px" }}>회원가입</h1>

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
              placeholder="닉네임"
              {...register("nickname", { required: "닉네임을 입력해주세요" })}
            />
            {errors.nickname && <p>{errors.nickname.message}</p>}
          </div>

          <div>
            <Input
              placeholder="이메일"
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

          <Button
            style={{ width: "100%" }}
            type="submit"
            disabled={isSubmitting}
          >
            회원가입
          </Button>
          <Button
            $variant="outlined"
            style={{ width: "100%" }}
            onClick={() => navigate("/u/login")}
          >
            돌아가기
          </Button>
        </div>
      </form>
    </div>
  );
}
