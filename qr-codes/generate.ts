import * as fs from "fs";
import * as QRCode from "qrcode";

const qrCodes = [
  "+005pp",
  "+010pp",
  "+020pp",
  "+030pp",
  "+040pp",
  "+050pp",
  "-005pp",
  "-010pp",
  "-020pp",
  "-030pp",
  "-040pp",
  "-050pp",
  "+heart",
  "-heart",
  "+flame",
  "-flame",
];

fs.mkdirSync("out", { recursive: true });

for (const qrCode of qrCodes) {
  QRCode.toFile(`out/${qrCode}.svg`, qrCode);
}
