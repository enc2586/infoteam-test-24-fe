import { Link } from "react-router-dom";

export function Tag({ name: i }: { name: string }) {
  return (
    <Link to={`/board?tag=${i}`} key={i} style={{ marginRight: "5px" }}>
      #{i}
    </Link>
  );
}
