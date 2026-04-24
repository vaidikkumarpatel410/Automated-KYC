const KYCApplication=require('../models/kycApplicationModels');
const {verifyDocument}=require('../services/OCRService');
const VerificationResult=require('../models/verificationResult');
const ActivityLog=require('../models/activityLogs');

const adminReviewableStatuses=['approved','failed','manual_review','rejected'];

const uploadDocument=async (req,res)=>{
    try{
        const {documentType}=req.body;
        const allowedDocumentTypes=['aadhaar','pan','passport'];

        if(!allowedDocumentTypes.includes(documentType)){
            return res.status(400).json({
                message:'Please select a valid document type'
            });
        }

        if(!req.file){
            return res.status(400).json({
                message:"Please upload a file"
            });
        }

        const application=await KYCApplication.create({
            user:req.user._id,
            documentType,
            documentPath:req.file.path,
            status:'under_verification'
        });

        const verificationResponse=await verifyDocument(
            req.file.path,
            documentType
        );

        const verificationStatus=verificationResponse.status || (
            verificationResponse.success ? 'verified' : 'failed'
        );
        const applicationStatus=verificationStatus === 'verified'
            ? 'approved'
            : verificationStatus;

        const verificationResult=await VerificationResult.create({
            application:application._id,
            status:verificationStatus,
            confidence:verificationResponse.confidence || 0,
            extractedName:verificationResponse.name || '',
            extractedDocumentNumber:verificationResponse.documentNumber || '',
            remarks:verificationResponse.message || ''
        });

        application.status=applicationStatus;
        await application.save();

        await ActivityLog.create({
            user:req.user._id,
            action:'KYC Document Uploaded',
            details:`${documentType} document uploaded with status ${applicationStatus}`
        });

        res.status(201).json({
            message:verificationResponse.message,
            application,
            verificationResult
        });
    }catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
};

const getMyApplications=async (req,res)=>{
    try{
        const applications=await KYCApplication.find({
            user:req.user._id
        }).sort({createdAt:-1});

        return res.status(200).json({applications});
    }catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
};

const getAllApplications=async (req,res)=>{
    try{
        const applications=await KYCApplication
            .find()
            .populate('user','name email')
            .sort('-createdAt');

        const applicationIds=applications.map((application)=>application._id);
        const verificationResults=await VerificationResult.find({
            application:{$in:applicationIds}
        }).sort({createdAt:-1});

        const verificationMap=new Map();

        verificationResults.forEach((result)=>{
            const applicationId=result.application.toString();

            if(!verificationMap.has(applicationId)){
                verificationMap.set(applicationId,result);
            }
        });

        const applicationsWithVerification=applications.map((application)=>({
            ...application.toObject(),
            verificationResult:verificationMap.get(application._id.toString()) || null
        }));

        res.status(200).json(applicationsWithVerification);
    }catch(err){
        res.status(500).json({
            message:err.message
        });
    }
};

const approveApplication=async (req,res)=>{
    try{
        const application=await KYCApplication.findById(req.params.id);

        if(!application){
            return res.status(404).json({
                message:"Application not found"
            });
        }

        if(!adminReviewableStatuses.includes(application.status)){
            return res.status(400).json({
                message:'This application cannot be approved by admin in its current state'
            });
        }

        application.status="approved";
        await application.save();

        await ActivityLog.create({
            user:req.user._id,
            action:'KYC Approved',
            details:`Application ${application._id} approved`
        });

        res.status(200).json({
            message:"Application approved successfully",
            application
        });
    }catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
};

const rejectApplication=async (req,res)=>{
    try{
        const application=await KYCApplication.findById(req.params.id);

        if(!application){
            return res.status(404).json({
                message:'Application not found'
            });
        }

        if(!adminReviewableStatuses.includes(application.status)){
            return res.status(400).json({
                message:'This application cannot be rejected by admin in its current state'
            });
        }

        application.status='rejected';
        await application.save();

        await ActivityLog.create({
            user:req.user._id,
            action:'KYC Rejected',
            details:`Application ${application._id} rejected`
        });

        res.status(200).json({
            message:'Application rejected successfully',
            application
        });
    }catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
};

module.exports={
    uploadDocument,
    getAllApplications,
    approveApplication,
    rejectApplication,
    getMyApplications
};
