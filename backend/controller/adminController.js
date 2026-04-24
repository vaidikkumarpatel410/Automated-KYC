const ActivityLog=require('../models/activityLogs');

const getActivityLogs=async (req,res)=>{
    try{
        const logs=await ActivityLog
        .find()
        .populate('user','name email')
        .sort({createdAt:-1});

        return res.status(200).json(logs);
    }catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
};

module.exports={getActivityLogs};