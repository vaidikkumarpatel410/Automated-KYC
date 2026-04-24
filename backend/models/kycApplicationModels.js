const mongoose=require('mongoose');

const kycApplicationSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    documentType:{
        type:String,
        enum:['aadhaar','pan','passport'],
        required:true,
    },
    documentPath:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['uploaded','under_verification','verified','failed','manual_review','approved','rejected'],
        default:'uploaded',
    },
},{
    timestamps:true
});

module.exports=mongoose.model('KYCApplication',kycApplicationSchema);
