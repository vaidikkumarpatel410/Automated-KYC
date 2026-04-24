const express=require('express');
const router=express.Router();

const {protect}=require('../middleware/authMiddleware');
const {adminOnly}=require('../middleware/adminMiddleware');
const {getAllApplications,approveApplication,rejectApplication}=require('../controller/kycController');
const {getActivityLogs}=require('../controller/adminController');

router.get('/applications',protect,adminOnly,getAllApplications);
router.put('/applications/:id/approve',protect,adminOnly,approveApplication);
router.put('/applications/:id/reject',protect,adminOnly,rejectApplication);
router.get('/logs',protect,adminOnly,getActivityLogs);

module.exports=router;