const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.fieldname+path.extname(file.originalname));
    }
});

const fileFilter=(req,file,cb)=>{
    const allowedTypes=/jpeg|jpg|png|pdf/;

    const extName=allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    if(extName){
        cb(null,true);
    }else{
        cb(new Error('Only JPG, PNG and PDF files are alowed'));
    }
};

const upload=multer({
    storage,
    fileFilter
});

module.exports=upload;