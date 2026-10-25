import { MainValues } from "./MainValues";

export const scoreForValues = (values: MainValues) =>
  values.percentage + values.hearts * 100 + values.flames * 50;
