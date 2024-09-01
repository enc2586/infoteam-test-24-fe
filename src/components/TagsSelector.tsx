import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { disassemble } from "es-hangul";
import { Dispatch, SetStateAction } from "react";
import { getTags } from "../apis/tag/get-tags";

type TagsSelectorProps = {
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
};

export function TagsSelector({ value, setValue }: TagsSelectorProps) {
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => (await getTags()).list,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>태그 선택: </span>
      <Select
        placeholder="태그"
        mode="tags"
        options={tags?.map(({ key }) => ({ value: key }))}
        value={value}
        onChange={(value) => setValue(value)}
        filterOption={(input, option) =>
          disassemble(option?.value ?? "").startsWith(disassemble(input))
        }
      />
    </div>
  );
}
