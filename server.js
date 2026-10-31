const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 8080;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_DIR = process.env.DATA_DIR || (process.env.VERCEL ? path.join(os.tmpdir(), 'primedrive') : path.join(__dirname, 'data'));
const DB_FILE = path.join(DATA_DIR, 'bookings.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');

const MIME = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.json':'application/json'};
function readBookings(){try{return JSON.parse(fs.readFileSync(DB_FILE,'utf8'))}catch{return []}}
function writeBookings(rows){fs.writeFileSync(DB_FILE, JSON.stringify(rows, null, 2))}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data))}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>1e6)req.destroy()});req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch{reject(new Error('Invalid JSON'))}});req.on('error',reject)})}
function authorized(req){const token=req.headers.authorization||'';return token==='Basic '+Buffer.from('owner:'+ADMIN_PASSWORD).toString('base64')}
async function notifyOwner(booking){
 if (!process.env.OWNER_NOTIFY_URL) return;
 try { await fetch(process.env.OWNER_NOTIFY_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:`New PrimeDrive booking: ${booking.car}\nCustomer: ${booking.name}\nPhone: ${booking.phone}\nDates: ${booking.pickupDate} to ${booking.returnDate}\nEstimated price: Rs. ${booking.total}`})}); } catch {}
}
const handler=async(req,res)=>{
 const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);
 if(url.pathname==='/'||url.pathname==='') req.url='/index.html';
 if(url.pathname==='/api/bookings'&&req.method==='POST'){try{const b=await body(req);const required=['name','phone','car','service','pickup','dropoff','pickupDate','returnDate'];if(required.some(k=>!String(b[k]||'').trim()))return json(res,400,{error:'Please complete all required fields.'});const pickup=new Date(b.pickupDate),drop=new Date(b.returnDate);if(isNaN(pickup)||isNaN(drop)||drop<=pickup)return json(res,400,{error:'Return date must be after pickup date.'});const days=Math.max(1,Math.ceil((drop-pickup)/86400000));const rates={luxury:18000,suv:16000,economy:6500,sports:35000,family:7500};const carName=String(b.car);const key=carName.includes('Fortuner')?'suv':carName.includes('Mercedes-Benz')?'luxury':carName.includes('Porsche')?'sports':carName.includes('Honda Civic')?'economy':'luxury';const exactRates={'Mercedes-Benz C-Class':18000,'Toyota Fortuner':16000,'Mercedes-Benz':18000,'Porsche 911 Carrera':35000,'Honda Civic':6500,'BMW X5':28000};const dailyRate=exactRates[carName]||(rates[key]||18000);const booking={id:'PD-'+Date.now().toString(36).toUpperCase(),createdAt:new Date().toISOString(),name:b.name.trim(),phone:b.phone.trim(),car:b.car.trim(),service:b.service,pickup:b.pickup.trim(),dropoff:b.dropoff.trim(),pickupDate:b.pickupDate,returnDate:b.returnDate,days,total:(rates[key]||18000)*days,status:'New'};booking.total=(dailyRate+(b.service==='With Driver'?3000:0))*days;const rows=readBookings();rows.unshift(booking);writeBookings(rows);notifyOwner(booking).catch(()=>{});return json(res,201,{message:'Booking received',booking});}catch(e){return json(res,400,{error:e.message||'Could not save booking'})}}
 if(url.pathname==='\/api\/bookings'&&req.method==='GET'){if(!authorized(req))return json(res,401,{error:'Unauthorized'}) ;return json(res,200,readBookings())}
 let file=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));file=path.normalize(file).replace(/^(\.\.[\/\\])+/, '');const full=path.join(__dirname,file);
 if(!full.startsWith(__dirname))return json(res,403,{error:'Forbidden'});
 fs.readFile(full,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}const ext=path.extname(full);const cache=ext==='.css'||ext==='.js'?'public, max-age=86400':ext.match(/\.(jpg|jpeg|svg|mp4)$/i)?'public, max-age=31536000, immutable':undefined;res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream',...(cache?{'Cache-Control':cache}:{})});res.end(data)});
};

if (require.main === module) {
  const server = http.createServer(handler);
  server.listen(PORT,()=>console.log(`PrimeDrive running at http://localhost:${PORT}`));
}

module.exports = handler;
