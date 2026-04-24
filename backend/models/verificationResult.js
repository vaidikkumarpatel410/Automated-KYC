const mongoose=require('mongoose');

const verificationResultSchema=new mongoose.Schema({
    application:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'KYCApplication',
        required:true,
    },
    provider:{
        type:String,
        default:'OCR',
    },
    status:{
        type:String,
        enum:['verified','failed','manual_review'],
        required:true,
    },
    confidence:{
        type:Number,
    },
    extractedName:{
        type:String,
    },
    extractedDocumentNumber:{
        type:String,
    },
    remarks:{
        type:String,
    }
},{
    timestamps:true
});

module.exports=mongoose.model('VerificationResult',verificationResultSchema);