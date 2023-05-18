import Jimp from "jimp";
import QRCode from "qrcode";
import ShortUniqueId from "short-unique-id";
import PdfPrinter from "pdfmake";
import fs from "fs";

const uid = new ShortUniqueId({ length: 8, dictionary: "number" });
const pdfGen = new PdfPrinter({});

var dd = {
  pageSize: {
    width: 330,
    height: 660,
  },
  info: {
    title: "ERE Cinema Week 2023 - Request ID 6417c4891500118ff480d5d8",
    author: "ERE Department - UOM",
    subject: "ERE Cinema Week 2023",
  },
  pageMargins: 0,
  content: [],
};

const generateQR = async (text: string): Promise<Buffer> => {
  return QRCode.toBuffer(text, {
    width: 208,
    // color: {
    //   dark: "#FFF", // Blue dots
    //   light: "#0000", // Transparent background
    // },
  });
};

async function generateIdImg(ticketId: string): Promise<Jimp> {
  const image = new Jimp(208, 36, "#FFF");
  await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then((font) => {
    image.print(
      font,
      0,
      0,
      {
        text: ticketId,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      208,
      36
    ); // prints 'Hello world!' on an image, middle and center-aligned, when x = 0 and y = 0
  });

  return image;
}

async function main() {
  const ticketId = uid();
  console.log(`Ticket ID: ${ticketId}`);

  const ticket = await Jimp.read("./img/back.png");
  const qrBuffer = await generateQR(
    `https://ere22ct.web.app/tickeks?id=${ticketId}`
  );
  const qr = await Jimp.read(qrBuffer);
  const idTag = await generateIdImg(ticketId);

  qr.write("./output/qr.png");
  idTag.write("./output/idTag.png");

  ticket.composite(qr, 12, 560);
  ticket.composite(idTag, 12, 780);
  ticket.write("./output/ticket.png");

  var pdfDoc = pdfGen.createPdfKitDocument(dd, {});
  pdfDoc.pipe(fs.createWriteStream("document.pdf"));
  pdfDoc.end();
}

// main();
function generateIds() {
  let idTxt = "";
  for (let i = 0; i < 1000; i++) {
    idTxt += String(uid());
    idTxt += "\n";
  }

  console.log(uid.collisionProbability(1000, 5));

  fs.writeFileSync("./output/ids.txt", idTxt);
}

generateIds();
