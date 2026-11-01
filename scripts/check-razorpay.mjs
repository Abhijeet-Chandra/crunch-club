import fs from 'node:fs';
import dotenv from 'dotenv';
const env=dotenv.parse(fs.readFileSync(new URL('../.env',import.meta.url),'utf8'));
if(!env.RAZORPAY_KEY_ID?.startsWith('rzp_test_')||!env.RAZORPAY_KEY_SECRET){console.error('Test credentials required.');process.exit(1);}
try{
 const response=await fetch('https://api.razorpay.com/v1/orders?count=1',{headers:{Authorization:'Basic '+Buffer.from(env.RAZORPAY_KEY_ID+':'+env.RAZORPAY_KEY_SECRET).toString('base64')},signal:AbortSignal.timeout(15000)});
 if(!response.ok){console.error('Razorpay verification failed; HTTP '+response.status+'. No credentials displayed.');process.exitCode=1;}
 else console.log('PASS: Razorpay accepted the test credentials. Read-only verification; no payment created or charged.');
}catch{console.error('Unable to reach Razorpay. No credentials displayed.');process.exitCode=1;}
