import multer from "multer";
import path from "path";

const getStorage = (destination) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `D-voting/${destination}`);
    },
    filename: function (req, file, cb) {
      const accountAddress = req.accountAddress;
      console.log("accountAddress in multer", accountAddress);
      cb(null, accountAddress + path.extname(file.originalname));
    },
  });
};

const candidateUpload = multer({storage: getStorage("candidateImages"),}).single("file");
const voterUpload = multer({ storage: getStorage("voterImages") }).single("file");

export { candidateUpload, voterUpload };
