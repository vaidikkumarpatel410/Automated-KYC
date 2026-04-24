const express=require('express');
const cors=require('cors');
const path=require('path');
require('dotenv').config();
const connectDB=require('./config/db');
const authRouter=require('./routes/authRoutes');
const customerRouter=require('./routes/customerRoutes');
const adminRouter=require('./routes/adminRoutes');

const app=express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.get('/',(req,res)=>{
    res.send('KYC Backend Running.')
});

app.use('/api/auth',authRouter);
app.use('/api/customer',customerRouter);
app.use('/api/admin',adminRouter);

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is listening on http://localhost:${PORT}`);
});
