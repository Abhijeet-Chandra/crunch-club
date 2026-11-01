import fs from 'node:fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const file=new URL('../.env',import.meta.url);
const source=fs.readFileSync(file,'utf8');
const env=dotenv.parse(source);
if(!env.MONGODB_PASSWORD){console.error('Enter the existing crunchclub_app database password in MONGODB_PASSWORD in .env first.');process.exit(1);}
const hosts=['00','01','02'].map(n=>`ac-l9ii50d-shard-00-${n}.vsdcdln.mongodb.net:27017`).join(',');
const uri=process.argv.includes('--standard')?`mongodb://crunchclub_app:${encodeURIComponent(env.MONGODB_PASSWORD)}@${hosts}/crunch-club?tls=true&replicaSet=atlas-myjy62-shard-0&retryWrites=true&w=majority&authSource=admin`:`mongodb+srv://crunchclub_app:${encodeURIComponent(env.MONGODB_PASSWORD)}@crunchclub.vsdcdln.mongodb.net/crunch-club?retryWrites=true&w=majority&authSource=admin`;
try{
 await mongoose.connect(uri,{serverSelectionTimeoutMS:10000});
 await mongoose.connection.db.command({ping:1});
 let updated=source.replace(/^MONGODB_URI=.*$/m,()=>`MONGODB_URI=${uri}`);
 if(!/^MONGODB_URI=/m.test(source))updated+=`\nMONGODB_URI=${uri}\n`;
 updated=updated.replace(/^MONGODB_PASSWORD=.*(?:\r?\n|$)/m,'');
 fs.writeFileSync(file,updated,{mode:0o600});
 console.log('MongoDB ping succeeded. Saved the connection string privately in .env and removed the temporary password field.');
}catch(error){const category=error.code===18?'Authentication rejected':error.code==='ENOTFOUND'||error.code==='ECONNREFUSED'?'DNS or network connection failed':error.name==='MongoServerSelectionError'?'Cluster unreachable or IP access not permitted':'Connection error';console.error(category+'. No configuration was changed.');console.error('Diagnostic type: '+String(error.name)+'; code: '+String(error.code||'none'));process.exitCode=1;}
finally{await mongoose.disconnect();}
