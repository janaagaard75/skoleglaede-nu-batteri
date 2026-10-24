import { MainValues } from "./MainValues";
import { QrCode } from "./QrCode";

export type QrChange = {
  id: number;
  newValues: MainValues;
  previousValues: MainValues;
  qrCode: QrCode;
};
