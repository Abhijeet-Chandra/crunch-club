export const menu = [
 {id:'bucket',name:'The OG Chicken Bucket',description:'6 golden, juicy pieces. Our secret spice blend. Zero regrets.',category:'Buckets',price:549,original:649,image:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=85',tag:'BESTSELLER',calories:1240,spicy:false},
 {id:'burger',name:'Signature Crunch Burger',description:'Crispy chicken, fresh lettuce & our signature creamy sauce.',category:'Burgers',price:199,original:249,image:'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=85',tag:'FAN FAVORITE',calories:540,spicy:false},
 {id:'wings',name:'Smoky Hot Wings',description:'6 fiery wings, glazed with smoky heat. Go on, get messy.',category:'Chicken',price:249,image:'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85',tag:'BRING THE HEAT',calories:620,spicy:true},
 {id:'fries',name:'Loaded Crispy Fries',description:'Golden fries, cheese sauce & a generous sprinkle of goodness.',category:'Sides',price:149,image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',tag:'VEGETARIAN',calories:380,spicy:false},
 {id:'feast',name:'The Together Feast',description:'8 chicken pieces, 2 burgers, 2 fries. Your crew is covered.',category:'Combos',price:999,original:1299,image:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85',tag:'SAVE ₹300',calories:2680,spicy:false},
 {id:'tenders',name:'Golden Chicken Tenders',description:'4 tender strips with your favorite dipping sauce.',category:'Chicken',price:229,image:'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&w=900&q=85',tag:'NEW',calories:480,spicy:false},
 {id:'cola',name:'Ice-cold Classic Cola',description:'A fizzy, refreshing sidekick to every delicious bite. 330 ml.',category:'Drinks',price:79,image:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=85',calories:139,spicy:false},
 {id:'shake',name:'Chocolate Dream Shake',description:'Rich chocolate, creamy ice cream & a little happiness. 300 ml.',category:'Drinks',price:159,image:'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85',tag:'SWEET FINISH',calories:420,spicy:false}
];
const additions = [
 ['fire-bucket','Firecracker Bucket','8 spicy chicken pieces for a table that likes it hot.','Buckets',749,'bucket',true],
 ['duo-bucket','Just Us Two Bucket','4 crispy chicken pieces and 2 portions of golden fries.','Buckets',499,'bucket'],
 ['party-bucket','Party Crunch Bucket','12 original chicken pieces for your next get-together.','Buckets',1099,'bucket'],
 ['pepper-burger','Pepper Crunch Burger','Crispy chicken, pepper mayo and crunchy lettuce.','Burgers',219,'burger',true],
 ['double-burger','Double Trouble Burger','Two crispy chicken fillets, cheese and signature sauce.','Burgers',329,'burger'],
 ['bbq-burger','Smoky BBQ Burger','Crispy chicken layered with smoky barbecue sauce and onions.','Burgers',249,'burger'],
 ['cheese-burger','Cheese Lover’s Crunch','Crispy chicken, melting cheese and creamy mayo.','Burgers',239,'burger'],
 ['bbq-wings','BBQ Glazed Wings','6 wings coated in a sweet and smoky barbecue glaze.','Chicken',279,'wings'],
 ['pepper-tenders','Pepper Chicken Tenders','4 chicken strips tossed in a peppery spice blend.','Chicken',249,'tenders',true],
 ['wing-platter','Wing Night Platter','12 wings with smoky barbecue and spicy sauces.','Chicken',499,'wings',true],
 ['solo-combo','Solo Crunch Meal','A signature burger, regular fries and a 330 ml cola.','Combos',349,'burger'],
 ['duo-combo','Burger Buddies Combo','2 signature burgers, 2 regular fries and 2 colas.','Combos',649,'burger'],
 ['wings-combo','Wings & Fries Combo','6 smoky wings, regular fries and a 330 ml cola.','Combos',399,'wings',true],
 ['tender-combo','Tender Loving Meal','4 golden tenders, regular fries and a 330 ml cola.','Combos',379,'tenders'],
 ['family-combo','Family Crunch Spread','8 chicken pieces, 4 burgers, 2 large fries and 4 colas.','Combos',1599,'feast'],
 ['classic-fries','Classic Golden Fries','A generous portion of crisp fries with a pinch of salt.','Sides',99,'fries'],
 ['peri-fries','Peri-Peri Fries','Golden fries tossed in a zesty, fiery peri-peri seasoning.','Sides',129,'fries',true],
 ['double-shake','Chocolate Shake Duo','Two 300 ml chocolate shakes for a sweet shared finish.','Drinks',289,'shake']
];
for(const [id,name,description,category,price,photo,spicy=false] of additions){menu.push({id,name,description,category,price,image:menu.find(p=>p.id===photo).image,tag:category==='Sides'?'VEGETARIAN':'NEW',spicy});}
export function calculateOrder(items, coupon='', mode='delivery', catalog=menu) {
 if(!Array.isArray(items)||!items.length||items.length>50) throw new Error('Add something delicious to your cart first.');
 const ids=new Set();
 const lines=items.map(line=>{const product=catalog.find(p=>p.id===line.id); if(!product||product.available===false||ids.has(line.id)||!Number.isInteger(line.quantity)||line.quantity<1||line.quantity>20) throw new Error('An item is unavailable or has an invalid quantity. Please refresh your bag.');ids.add(line.id);return {id:product.id,name:product.name,price:product.price,quantity:line.quantity};});
 const subtotal=lines.reduce((s,p)=>s+p.price*p.quantity,0);
 const code=coupon.trim().toUpperCase(); if(code&&!['CRUNCH20','WELCOME'].includes(code)) throw new Error('That promo code is not valid. Try CRUNCH20.');
 const discount=code?Math.min(Math.round(subtotal*.2),200):0;
 const delivery=mode==='pickup'||subtotal>=599?0:39;
 return {items:lines,subtotal,discount,delivery,total:subtotal-discount+delivery};
}
