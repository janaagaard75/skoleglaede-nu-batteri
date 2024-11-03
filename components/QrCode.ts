interface FlameQrCode {
  amount: -1 | 1;
  type: "flame";
}

interface HeartQrCode {
  amount: -1 | 1;
  type: "heart";
}

interface PercentageQrCode {
  amount: number;
  type: "percentage";
}

export type QrCode = FlameQrCode | HeartQrCode | PercentageQrCode;
