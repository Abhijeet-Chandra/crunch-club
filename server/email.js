import nodemailer from 'nodemailer';
export const emailReady=()=>Boolean(process.env.SMTP_HOST&&process.env.SMTP_FROM&&process.env.PUBLIC_URL);
export async function sendEmail(to,subject,text){
 if(!emailReady())throw new Error('Email delivery is not configured.');
 const port=Number(process.env.SMTP_PORT||587);
 const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port!==465,auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}:undefined,connectionTimeout:10000,socketTimeout:15000,disableFileAccess:true,disableUrlAccess:true});
 await transport.sendMail({from:process.env.SMTP_FROM,to,subject,text});
}
