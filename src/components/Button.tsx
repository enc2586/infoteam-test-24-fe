import styled from "styled-components";

const StyledButton = styled.button<{ $variant?: string }>`
  background-color: ${({ $variant }) =>
    $variant === "outlined" ? "white" : "black"};
  color: ${({ $variant }) => ($variant === "outlined" ? "black" : "white")};
  border: ${({ $variant }) =>
    $variant === "outlined" ? "1px solid black" : "none"};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

export function Button({
  children,
  ...props
}: React.ComponentProps<"button"> & { $variant?: string }) {
  return (
    <StyledButton type="button" {...props}>
      {children}
    </StyledButton>
  );
}
