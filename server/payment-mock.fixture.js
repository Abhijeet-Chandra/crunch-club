// Loaded only by the integration test subprocess using node --import.
import nodemailer from 'nodemailer';
import fs from 'node:fs/promises';
if(process.env.MAIL_TEST_PATH)nodemailer.createTransport=()=>({sendMail:async message=>{await fs.writeFile(process.env.MAIL_TEST_PATH,JSON.stringify(message));return {accepted:[message.to]};}});
const originalFetch=globalThis.fetch;
let sequence=0;const orders=new Map();
globalThis.fetch=async(url,options={})=>{
 if(!String(url).startsWith('https://api.razorpay.com/v1'))return originalFetch(url,options);
 const route=String(url).slice('https://api.razorpay.com/v1'.length);
 if(route==='/orders'){const body=JSON.parse(options.body),id='order_Test'+(++sequence);orders.set(id,body);return Response.json({id,...body});}
 if(route.endsWith('/refund'))return Response.json({id:'rfnd_Test',status:'processed'});
 if(route.startsWith('/payments/')){const id=route.split('/')[2],order_id=id.replace('pay_','order_');return Response.json({id,order_id,amount:orders.get(order_id)?.amount,currency:'INR',status:'captured'});}
 return Response.json({error:'Unknown mock route'},{status:404});
};
