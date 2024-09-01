import { useSearchParams } from "react-router-dom";

export function useSearchParamsState<T = string>(
  searchParamName: string,
  defaultValue: string,
  parse?: (value: string) => T
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const acquiredSearchParam = searchParams.get(searchParamName);
  const searchParamsState = parse
    ? (parse(acquiredSearchParam ?? defaultValue) as T)
    : ((acquiredSearchParam ?? defaultValue) as string);

  const setSearchParamsState = (newState: string | undefined | null) => {
    const next: { [key: string]: string } = Object.assign(
      {},
      [...searchParams.entries()].reduce(
        (o, [key, value]) => ({ ...o, [key]: value }),
        {}
      )
    );

    if (newState === undefined || newState === null) {
      delete next[searchParamName];
    } else {
      next[searchParamName] = newState;
    }

    setSearchParams(next);
  };

  if (parse)
    return [searchParamsState, setSearchParamsState] as readonly [
      T,
      (newState: string | undefined | null) => void
    ];
  else
    return [searchParamsState, setSearchParamsState] as readonly [
      string,
      (newState: string | undefined | null) => void
    ];
}
