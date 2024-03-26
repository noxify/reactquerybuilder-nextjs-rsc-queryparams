import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  createSearchParamsCache,
  createParser,
} from "nuqs/server";

export const parseAsSorting = createParser({
  parse(queryValue) {
    const [by, direction] = queryValue.split(".");
    const isValid = by !== "" && direction !== "";
    if (!isValid) return null;
    return {
      by,
      direction,
    };
  },
  serialize(value) {
    return value.by !== "" && value.direction !== ""
      ? `${value.by}.${value.direction}`
      : "";
  },
});

export const searchParams = {
  filter: parseAsString.withDefault("(1 = 1)"),
  pageIndex: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sort: parseAsSorting.withDefault({ by: "", direction: "desc" }),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
