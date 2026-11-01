import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

test('API authenticates accounts, protects history, and validates checkout',async()=>{
 const port=15000+Math.floor(Math.random()*30000);
 const server=spawn(process.execPath,['server/index.js'],{env:{...process.env,PORT:String(port),MONGODB_URI:'',JWT_SECRET:'test-only-secret'},stdio:'ignore'});
 const request=async(route,body,token)=>{const response=await fetch(`http://127.0.0.1:${port}/api${route}`,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};};
 try{
  let ready=false;for(let i=0;i<50;i++){try{await request('/health');ready=true;break;}catch{await delay(100);}}assert.ok(ready,'server starts');
  assert.equal((await request('/orders')).status,401);
  const credentials={name:'Test Customer',email:'customer@example.test',password:'test-password-123'};
  const registration=await request('/auth/register',credentials);assert.equal(registration.status,200);assert.ok(registration.data.token);
  assert.equal((await request('/auth/register',credentials)).status,409);
  assert.equal((await request('/auth/login',{...credentials,password:'incorrect-password'})).status,401);
  const login=await request('/auth/login',credentials);assert.equal(login.status,200);
  const body={items:[{id:'bucket',quantity:1,price:1}],coupon:'CRUNCH20',mode:'delivery',customer:{name:'Test Customer',phone:'9999999999',address:'Demo Street',pincode:'110001'}};
  const order=await request('/orders',body,login.data.token);assert.equal(order.status,201);assert.equal(order.data.total,478);
  const history=await request('/orders',null,login.data.token);assert.equal(history.data.length,1);assert.equal(history.data[0].id,order.data.id);
  const other=await request('/auth/register',{...credentials,email:'other@example.test'});assert.equal((await request('/orders',null,other.data.token)).data.length,0);
  assert.equal((await request('/orders',{...body,customer:{name:'Missing details'}})).status,400);
  assert.equal((await request('/orders',{...body,items:[{id:'bucket',quantity:-1}]})).status,400);
 }finally{server.kill();}
});
