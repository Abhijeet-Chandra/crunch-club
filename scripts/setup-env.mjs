import fs from 'node:fs';
import crypto from 'node:crypto';
const target=new URL('../.env',import.meta.url);
if(fs.existsSync(target)){console.log('Existing .env preserved.');process.exit(0);}
let config=fs.readFileSync(new URL('../.env.example',import.meta.url),'utf8');
const values={MONGODB_URI:'',JWT_SECRET:crypto.randomBytes(48).toString('hex'),ADMIN_PASSWORD:crypto.randomBytes(24).toString('base64url'),RAZORPAY_WEBHOOK_SECRET:crypto.randomBytes(32).toString('hex')};
for(const [key,value]of Object.entries(values))config=config.replace(new RegExp('^'+key+'=.*$','m'),key+'='+value);
fs.writeFileSync(target,config,{flag:'wx',mode:0o600});
console.log('Created private .env with generated JWT, manager-password and webhook secrets. Provider credentials and manager email remain unset. No secrets were printed.');
