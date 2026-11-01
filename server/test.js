import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrder } from './catalog.js';
test('prices come from the catalog, with discount and delivery',()=>{const o=calculateOrder([{id:'bucket',quantity:1,price:1}],'CRUNCH20');assert.equal(o.subtotal,549);assert.equal(o.discount,110);assert.equal(o.total,478);});
test('pickup and large orders get free delivery',()=>{assert.equal(calculateOrder([{id:'burger',quantity:1}],'','pickup').delivery,0);assert.equal(calculateOrder([{id:'bucket',quantity:2}]).delivery,0);});
test('rejects invalid items, quantities and coupons',()=>{for(const items of [[],[{id:'unknown',quantity:1}],[{id:'bucket',quantity:-1}],[{id:'bucket',quantity:1.2}]])assert.throws(()=>calculateOrder(items));assert.throws(()=>calculateOrder([{id:'burger',quantity:1}],'FAKE'));});
