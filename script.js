const cars=[
 {name:'Mercedes-Benz C-Class',category:'luxury',year:'2024',price:18000,image:'assets/mercedes-c-class.jpg',video:'assets/mercedes-c-class.mp4',trans:'Automatic',fuel:'Petrol',seats:5},
 {name:'Toyota Fortuner',category:'suv',year:'2025',price:16000,image:'assets/toyota-fortuner.jpg',video:'assets/toyota-fortuner.mp4',trans:'Automatic',fuel:'Diesel',seats:7},
 {name:'Mercedes-Benz',category:'luxury',year:'2024',price:18000,image:'assets/mercedes-c-class.jpg',video:'assets/mercedes-benz.mp4',trans:'Automatic',fuel:'Petrol',seats:5},
 {name:'Porsche 911 Carrera',category:'sports',year:'2023',price:35000,image:'assets/porsche-911.jpg',video:'assets/porsche-911-new.mp4',trans:'Automatic',fuel:'Petrol',seats:4},
 {name:'Honda Civic',category:'economy',year:'2025',price:6500,image:'assets/honda-civic.jpg',video:'assets/honda-civic.mp4',trans:'Automatic',fuel:'Petrol',seats:5},
 {name:'BMW X5',category:'luxury',year:'2024',price:28000,image:'assets/bmw-x5.jpg',video:'assets/bmw-x5.mp4',trans:'Automatic',fuel:'Petrol',seats:5}
];
const grid=document.getElementById('carGrid');
function carPlaceholder(name){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#20242a"/><circle cx="720" cy="120" r="170" fill="#303640"/><path d="M105 390h690l-55-95H220l-115 95z" fill="#f5f5f2"/><path d="M190 390h560l-45-110H310z" fill="#d8dbe0"/><rect x="135" y="390" width="630" height="55" rx="18" fill="#ff5b35"/><circle cx="280" cy="445" r="72" fill="#121212"/><circle cx="280" cy="445" r="38" fill="#dfe2e7"/><circle cx="620" cy="445" r="72" fill="#121212"/><circle cx="620" cy="445" r="38" fill="#dfe2e7"/><text x="450" y="525" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700" fill="#ffffff">${name}</text></svg>`;
 return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function carMedia(c){return `<img src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.onerror=null;this.src='${carPlaceholder(c.name)}'">`}
function videoButton(c){return c.video?`<button class="spec-video-btn" type="button" onclick="openVideo('${c.name}')" aria-label="Watch ${c.name} video">▶ Watch Video</button>`:''}
function renderCars(filter='all'){grid.innerHTML=cars.filter(c=>filter==='all'||c.category===filter).map(c=>`<article class="car-card"><div class="car-image">${carMedia(c)}<span class="status">Available</span></div><div class="car-info"><div class="car-title"><div><h3>${c.name}</h3><span>${c.year}</span></div><div class="price"><strong>Rs. ${c.price.toLocaleString()}</strong><small>/ day</small></div></div><div class="specs"><span>⚙ ${c.trans}</span><span>⛽ ${c.fuel}</span><span>♙ ${c.seats} Seats</span>${videoButton(c)}</div><div class="card-actions"><button class="outline-btn" onclick="openBooking('${c.name}')">View Details</button><button class="btn" onclick="openBooking('${c.name}')">Book Now</button></div></div></article>`).join('')}renderCars();
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCars(b.dataset.filter)});
const modal=document.getElementById('bookingModal');const select=document.getElementById('carSelect');select.innerHTML=cars.map(c=>`<option>${c.name}</option>`).join('');
function openBooking(car){select.value=cars.some(c=>c.name===car)?car:cars[0].name;document.getElementById('serviceSelect').value=serviceType.value;if(car.toLowerCase().includes('economy'))select.value='Honda Civic';if(car==='SUV')select.value='Toyota Fortuner';modal.classList.add('open');modal.setAttribute('aria-hidden','false');calculate()}window.openBooking=openBooking;
document.getElementById('closeModal').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
const videoModal=document.getElementById('videoModal');
function openVideo(name){const car=cars.find(c=>c.name===name);if(!car?.video)return;document.getElementById('videoTitle').textContent=name;const player=document.getElementById('carVideoPlayer');player.src=car.video;videoModal.classList.add('open');videoModal.setAttribute('aria-hidden','false');player.play().catch(()=>{})}
window.openVideo=openVideo;
document.getElementById('closeVideo').onclick=()=>{const player=document.getElementById('carVideoPlayer');player.pause();player.removeAttribute('src');player.load();videoModal.classList.remove('open');videoModal.setAttribute('aria-hidden','true')};
videoModal.onclick=e=>{if(e.target===videoModal)document.getElementById('closeVideo').click()};
document.getElementById('themeBtn').onclick=e=>{document.body.classList.toggle('dark');e.currentTarget.textContent=document.body.classList.contains('dark')?'☀':'☾';localStorage.setItem('primedrive-theme',document.body.classList.contains('dark')?'dark':'light')};if(localStorage.getItem('primedrive-theme')==='dark'){document.body.classList.add('dark');document.getElementById('themeBtn').textContent='☀'}
document.getElementById('menuBtn').onclick=()=>document.getElementById('nav').classList.toggle('open');document.querySelectorAll('.nav a').forEach(a=>a.onclick=()=>document.getElementById('nav').classList.remove('open'));
const now=new Date(),tomorrow=new Date(now.getTime()+86400000),returnDay=new Date(now.getTime()+3*86400000);function localDT(d){d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)}document.getElementById('pickupDate').value=localDT(tomorrow);document.getElementById('returnDate').value=localDT(returnDay);
const serviceType=document.getElementById('serviceType');
const fleetSummary=document.getElementById('fleetSummary');
function dailyRate(car){return car.price+(serviceType.value==='With Driver'?3000:0)}
function renderBudgetCars(list){grid.innerHTML=list.map(c=>{const price=dailyRate(c);return `<article class="car-card"><div class="car-image">${carMedia(c)}<span class="status">Available</span></div><div class="car-info"><div class="car-title"><div><h3>${c.name}</h3><span>${c.year} • ${serviceType.value}</span></div><div class="price"><strong>Rs. ${price.toLocaleString()}</strong><small>/ day</small></div></div><div class="specs"><span>⚙ ${c.trans}</span><span>⛽ ${c.fuel}</span><span>♙ ${c.seats} Seats</span>${videoButton(c)}</div><div class="card-actions"><button class="outline-btn" onclick="openBooking('${c.name}')">View Details</button><button class="btn" onclick="openBooking('${c.name}')">Book Now</button></div></div></article>`}).join('')||'<div class="no-results"><h3>No cars found in this budget</h3><p>Increase your maximum daily price and search again.</p></div>';}
document.getElementById('searchForm').onsubmit=e=>{e.preventDefault();const maxPrice=Number(document.getElementById('maxPrice').value);if(!maxPrice||maxPrice<=0){alert('Please enter a valid daily budget.');return}const matchingCars=cars.filter(c=>dailyRate(c)<=maxPrice).sort((a,b)=>dailyRate(a)-dailyRate(b));renderBudgetCars(matchingCars);fleetSummary.textContent=matchingCars.length?`${matchingCars.length} car${matchingCars.length===1?'':'s'} available within Rs. ${maxPrice.toLocaleString()} per day`:`No car available within Rs. ${maxPrice.toLocaleString()} per day`;document.getElementById('cars').scrollIntoView({behavior:'smooth',block:'start'});};
serviceType.onchange=()=>{if(fleetSummary.textContent)document.getElementById('searchForm').requestSubmit()};
select.onchange=calculate;document.getElementById('serviceSelect').onchange=calculate;document.querySelectorAll('.form-grid input[type=date]').forEach(i=>i.onchange=calculate);function calculate(){const car=cars.find(c=>c.name===select.value),dates=document.querySelectorAll('.form-grid input[type=date]'),start=new Date(dates[0].value),end=new Date(dates[1].value);let days=1;if(dates[0].value&&dates[1].value)days=Math.max(1,Math.ceil((end-start)/86400000));const driverCharge=document.getElementById('serviceSelect').value==='With Driver'?3000:0;document.getElementById('estimatedPrice').textContent='Rs. '+(((car?.price||0)+driverCharge)*days).toLocaleString()}
document.getElementById('bookingForm').onsubmit=async e=>{
 e.preventDefault();
 const pickupDate=document.getElementById('bookingPickupDate').value;
 const returnDate=document.getElementById('bookingReturnDate').value;
 if(!pickupDate||!returnDate||new Date(returnDate)<=new Date(pickupDate)){alert('Return date must be after pickup date.');return}
 const button=e.target.querySelector('button[type="submit"]');
 button.disabled=true;button.textContent='Saving booking...';
 const booking={name:document.getElementById('bookingName').value,phone:document.getElementById('bookingPhone').value,car:document.getElementById('carSelect').value,service:document.getElementById('serviceSelect').value,pickup:document.getElementById('bookingPickup').value,dropoff:document.getElementById('bookingDropoff').value,pickupDate,returnDate,payment:document.getElementById('bookingPayment').value,total:document.getElementById('estimatedPrice').textContent.replace(/[^0-9]/g,'')};
 try{
  const response=await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(booking)});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||'Booking could not be saved');
  if(booking.payment==='EasyPaisa Online'){
   const paymentResponse=await fetch('/api/payments/easypaisa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookingId:result.booking.id,total:result.booking.total,phone:booking.phone,name:booking.name})});
   const payment=await paymentResponse.json();
   if(!paymentResponse.ok)throw new Error(payment.error||'EasyPaisa payment could not be started');
   window.location.assign(payment.url);return;
  }
  modal.classList.remove('open');const toast=document.getElementById('toast');toast.textContent=`Booking ${result.booking.id} confirmed! Owner has received it.`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4500);e.target.reset();
 }catch(error){alert(error.message)}finally{button.disabled=false;button.textContent='Confirm Booking Request'};
};