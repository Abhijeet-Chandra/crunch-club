import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const env=process.env;
const checks=[
 ['MongoDB connection string',/^mongodb(?:\+srv)?:\/\//.test(env.MONGODB_URI||'')],
 ['JWT secret (32+ characters)',(env.JWT_SECRET||'').length>=32&&!env.JWT_SECRET.startsWith('replace-')],
 ['Manager email',/^\S+@\S+\.\S+$/.test(env.ADMIN_EMAIL||'')],
 ['Manager bootstrap password (12+ characters)',(env.ADMIN_PASSWORD||'').length>=12],
 ['Razorpay test key',/^rzp_test_/.test(env.RAZORPAY_KEY_ID||'')],
 ['Razorpay key secret',Boolean(env.RAZORPAY_KEY_SECRET)],
 ['Razorpay webhook secret',Boolean(env.RAZORPAY_WEBHOOK_SECRET)],
 ['SMTP host and sender',Boolean(env.SMTP_HOST&&env.SMTP_FROM)],
 ['Public HTTPS URL',/^https:\/\//.test(env.PUBLIC_URL||'')]
];
for(const [label,ok]of checks)console.log(`${ok?'READY':'NEEDED'}: ${label}`);
if(process.argv.includes('--database')&&checks[0][1]){
 try{await mongoose.connect(env.MONGODB_URI,{serverSelectionTimeoutMS:8000});await mongoose.connection.db.admin().ping();console.log('PASS: MongoDB connection and ping.');}
 catch{console.error('FAIL: MongoDB connection. Check the URI, credentials, network access, and database status.');process.exitCode=1;}
 finally{await mongoose.disconnect();}
}
if(checks.some(([,ok])=>!ok))process.exitCode=1;
console.log('No secret values are displayed. READY checks confirm configuration presence/format only; real provider tests remain required.');
