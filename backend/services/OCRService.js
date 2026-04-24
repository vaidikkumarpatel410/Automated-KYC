const axios=require('axios');
const FormData=require('form-data');
const fs=require('fs');

const normalizeText=(text='')=>{
    return text
        .toUpperCase()
        .replace(/\s+/g,' ')
        .trim();
};

const hasAnyKeyword=(text,keywords=[])=>{
    return keywords.some((keyword)=>text.includes(keyword));
};

const invertTable=[
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0]
];

const permutationTable=[
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8]
];

const validateVerhoeff=(value='')=>{
    let checksum=0;
    const reversed=value.split('').reverse().map(Number);

    for(let index=0;index<reversed.length;index+=1){
        checksum=invertTable[
            checksum
        ][
            permutationTable[index % 8][reversed[index]]
        ];
    }

    return checksum===0;
};

const extractAadhaarNumber=(text='')=>{
    const digitGroups=text.match(/\d[\d\s-]{10,18}\d/g) || [];

    for(const group of digitGroups){
        const digitsOnly=group.replace(/\D/g,'');

        if(digitsOnly.length===12 && validateVerhoeff(digitsOnly)){
            return digitsOnly;
        }
    }

    return '';
};

const verifyPan=(text)=>{
    const keywords=[
        'INCOME TAX DEPARTMENT',
        'PERMANENT ACCOUNT NUMBER'
    ];
    const panMatch=text.match(/[A-Z]{5}[0-9]{4}[A-Z]/);

    if(!panMatch){
        return {
            success:false,
            status:'failed',
            documentNumber:'',
            confidence:0,
            message:'PAN number not found'
        };
    }

    if(!hasAnyKeyword(text,keywords)){
        return {
            success:false,
            status:'manual_review',
            documentNumber:panMatch[0],
            confidence:48,
            message:'PAN number found, but document markers are weak. Sent for manual review.'
        };
    }

    return {
        success:true,
        status:'verified',
        documentNumber:panMatch[0],
        confidence:94,
        message:'PAN document verified using OCR'
    };
};

const verifyAadhaar=(text)=>{
    const keywords=[
        'GOVERNMENT OF INDIA',
        'UNIQUE IDENTIFICATION AUTHORITY OF INDIA',
        'AADHAAR',
        'DOB',
        'YEAR OF BIRTH'
    ];
    const conflictingKeywords=[
        'INCOME TAX DEPARTMENT',
        'PERMANENT ACCOUNT NUMBER',
        'PASSPORT'
    ];
    const aadhaarNumber=extractAadhaarNumber(text);

    if(!aadhaarNumber){
        return {
            success:false,
            status:'failed',
            documentNumber:'',
            confidence:0,
            message:'Valid Aadhaar number not found'
        };
    }

    if(!hasAnyKeyword(text,keywords)){
        return {
            success:false,
            status:'manual_review',
            documentNumber:aadhaarNumber,
            confidence:45,
            message:'Aadhaar number found, but Aadhaar-specific markers are weak. Sent for manual review.'
        };
    }

    if(hasAnyKeyword(text,conflictingKeywords) && !text.includes('AADHAAR')){
        return {
            success:false,
            status:'failed',
            documentNumber:aadhaarNumber,
            confidence:0,
            message:'Uploaded document does not look like an Aadhaar card'
        };
    }

    return {
        success:true,
        status:'verified',
        documentNumber:aadhaarNumber,
        confidence:96,
        message:'Aadhaar document verified using OCR'
    };
};

const verifyPassport=(text)=>{
    const keywords=[
        'PASSPORT',
        'REPUBLIC OF INDIA',
        'NATIONALITY'
    ];
    const passportMatch=text.match(/\b[A-PR-WY][0-9]{7}\b/);

    if(!passportMatch){
        return {
            success:false,
            status:'failed',
            documentNumber:'',
            confidence:0,
            message:'Passport number not found'
        };
    }

    if(!hasAnyKeyword(text,keywords)){
        return {
            success:false,
            status:'manual_review',
            documentNumber:passportMatch[0],
            confidence:46,
            message:'Passport number found, but document markers are weak. Sent for manual review.'
        };
    }

    return {
        success:true,
        status:'verified',
        documentNumber:passportMatch[0],
        confidence:92,
        message:'Passport document verified using OCR'
    };
};

const verifyDocument=async(filePath,documentType)=>{
    try{
        const formData=new FormData();

        formData.append(
            'file',
            fs.createReadStream(filePath)
        );

        formData.append('apikey',process.env.OCR_API_KEY);

        const response=await axios.post(
            'https://api.ocr.space/parse/image',
            formData,
            {headers:formData.getHeaders()}
        );

        const text=response.data.ParsedResults?.[0]?.ParsedText || '';
        const normalizedText=normalizeText(text);

        console.log('OCR Extracted Text:\n',text);
        if(!normalizedText){
            return{
                success:false,
                status:'failed',
                documentNumber:'',
                confidence:0,
                message:'No readable text found in uploaded document'
            };
        }

        if(documentType==='pan'){
            return verifyPan(normalizedText);
        }

        if(documentType==='aadhaar'){
            return verifyAadhaar(normalizedText);
        }

        if(documentType==='passport'){
            return verifyPassport(normalizedText);
        }

        return{
            success:false,
            status:'failed',
            documentNumber:'',
            confidence:0,
            message:'Unsupported document type'
        };
    }
    catch(error){
        console.log('OCR Error:',error.response?.data || error.message);
        return{
            success:false,
            status:'failed',
            message:'OCR verification failed'
        };
    }
};

module.exports={verifyDocument};
