const express=require('express');
const router=express.Router();
const {protect}=require('../middleware/authMiddleware');
const upload=require('../middleware/uploadMiddleware');
const {uploadDocument}=require('../controller/kycController');
const {getMyApplications}=require('../controller/kycController');

router.get('/applications',protect,getMyApplications);
router.post('/upload',protect,upload.single('document'),uploadDocument);

module.exports=router;