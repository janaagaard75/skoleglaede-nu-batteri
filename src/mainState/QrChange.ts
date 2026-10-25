import { MainValues } from "./MainValues";
import { QrCode } from "./QrCode";

export type QrChange = {
  newValues: MainValues;
  previousValues: MainValues;
  qrCode: QrCode;
};
