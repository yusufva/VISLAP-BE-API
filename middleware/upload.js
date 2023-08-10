
const multer = require('multer');
const path = require('path')

const productStorage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null, './public/images')
    },
    filename: (req,file,cb)=>{
        cb(null, `produk-${Math.floor(Math.random()*1000)}${new Date().getTime()}`+path.extname(file.originalname))
    }
});

const productFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)){
        return cb(new Error('Please upload a Image'))
    }
    cb(null, true)
};

exports.upload = multer({
    storage: productStorage,
    fileFilter: productFilter
});
