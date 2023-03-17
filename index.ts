import Jimp from "jimp";
import QRCode from "qrcode";

const generateQR = async (text: string) => {
  return await QRCode.toString(text, {
    width: 240,
    color: {
      dark: "#FFF", // Blue dots
      light: "#0000", // Transparent background
    },
  });
};

async function main() {
  const ticket = await Jimp.read("./img/back.png");
  const qrBuffer = generateQR("Hello");
  const qr = await Jimp.read(qrBuffer);

  ticket.composite(qr, 100, 100);
  ticket.write("./output/ticket.png");
}

main();
console.log("Init");
