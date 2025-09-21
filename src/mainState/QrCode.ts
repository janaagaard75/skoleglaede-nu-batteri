export type QrCode = FlameQrCode | HeartQrCode | PercentageQrCode;

type FlameQrCode = {
  amount: -1 | 1;
  type: "flame";
};

type HeartQrCode = {
  amount: -1 | 1;
  type: "heart";
};

type PercentageQrCode = {
  amount: number;
  type: "percentage";
};
