import { forwardRef } from "react";
import styled from "styled-components";

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  resize: vertical;
`;

export const TextArea = forwardRef(
  (
    { children, ...props }: React.ComponentProps<"textarea">,
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    return (
      <StyledTextArea {...props} ref={ref}>
        {children}
      </StyledTextArea>
    );
  }
);
