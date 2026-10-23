import { MainValues } from "./MainValues";

export const scoreForValues = (values: MainValues) =>
  values.percentage + values.hearts * 125 + values.flames * 50;
