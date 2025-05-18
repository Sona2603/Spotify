// import multer from "multer";

// const storage = multer.diskStorage({
//     filename: function(req,file,callback){
//          callback(null,file.originalname)
//     }
// })

// const upload=multer({storage})

// export default upload;

import multer from "multer";

// Configure Multer to store files in "uploads" folder temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
