export const groupDigitsWithSpaces = (value: number) =>
  value.toLocaleString("en-US").replaceAll(",", "\u202F");
