import { forwardRef } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

export const Input = forwardRef(
  (
    { children, ...props }: React.ComponentProps<"input">,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <StyledInput {...props} ref={ref}>
        {children}
      </StyledInput>
    );
  }
);
