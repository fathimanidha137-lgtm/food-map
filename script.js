let map;
let userLat = null;
let userLng = null;
let places = JSON.parse(localStorage.getItem('places')) || [];
let markers = [];

window.onload = function(){

map = L.map('map').setView([11.2588, 75.7804],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map);

map.on('click',function(e){

let type = prompt("Enter type: veg / nonveg / cafe");

if(!type) return;

let spot = {
lat:e.latlng.lat,
lng:e.latlng.lng,
type:type.toLowerCase()
};

places.push(spot);
localStorage.setItem('places',JSON.stringify(places));

if(userLat) showNearby();

});

};

function toggleFilter(){
let box=document.getElementById("filterBox");
box.style.display = box.style.display==="block"?"none":"block";
}

function getMyLocation(){

navigator.geolocation.getCurrentPosition(function(position){

userLat=position.coords.latitude;
userLng=position.coords.longitude;

map.setView([userLat,userLng],15);

L.marker([userLat,userLng])
.addTo(map)
.bindPopup("You are here")
.openPopup();

showNearby();

},function(){
alert("Allow location access");
},{
enableHighAccuracy:true
});

}

function mapDistance(lat1,lon1,lat2,lon2){

let R=6371;

let dLat=(lat2-lat1)*Math.PI/180;
let dLon=(lon2-lon1)*Math.PI/180;

let a=Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*Math.sin(dLon/2);

let c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
return R*c;
}

function applyFilter(){
if(userLat) showNearby();
}

function showNearby(){

let filter=document.getElementById("foodFilter").value;
let list=document.getElementById("results");

list.innerHTML="";

markers.forEach(m=>map.removeLayer(m));
markers=[];

places.forEach(p=>{

let dist=mapDistance(userLat,userLng,p.lat,p.lng);

if(dist<=5){

if(filter==="all"||filter===p.type){

let m=L.marker([p.lat,p.lng]).addTo(map)
.bindPopup(p.type);

markers.push(m);

let li=document.createElement("li");
li.innerText=p.type+" - "+dist.toFixed(2)+" km";
list.appendChild(li);

}

}

});

}

function searchPlace(){

let place=document.getElementById("placeInput").value;

fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`)
.then(res=>res.json())
.then(data=>{

if(data.length>0){

let lat=data[0].lat;
let lon=data[0].lon;

map.setView([lat,lon],15);

L.marker([lat,lon]).addTo(map)
.bindPopup(place)
.openPopup();

}

});

}

