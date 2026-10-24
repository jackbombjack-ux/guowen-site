(function(){
'use strict';
var GW=window.GW||{products:[],courses:[],index:[],config:{}};
var CONFIG=GW.config||{};
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var money=function(n){return 'NT$'+n.toLocaleString('en-US')};
var ico=function(id,st){return '<svg class="ico"'+(st?' style="'+st+'"':'')+'><use href="#'+id+'"/></svg>'};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var byId=function(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i]};
var PAGE=document.body.getAttribute('data-page')||'';

/* ---------- 水墨插圖生成（程式繪製，不使用圖片） ---------- */
var INK_N=0;
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function ridge(r,o){
  var terms=[];for(var i=0;i<3;i++)terms.push({f:o.fr*(1+i*1.9+r()*.7),p:r()*6.283,w:1/(1+i*1.1)});
  var d='M-10 '+(o.H+10);
  for(var x=-10;x<=o.W+10;x+=(o.step||8)){
    var v=0,t=0;terms.forEach(function(q){v+=q.w*(1-Math.abs(Math.sin(x*q.f+q.p)));t+=q.w});
    v=Math.pow(v/t,o.sharp||1.6);
    var e=o.env?o.env(x/o.W):1;
    d+=' L'+x+' '+(o.base-o.amp*v*e).toFixed(1);
  }
  return d+' L'+(o.W+10)+' '+(o.H+10)+'Z';
}
function pine(x,y,s){var d='';for(var k=0;k<4;k++){var w=(15-k*3)*s,h=(12+k*10)*s,t=15*s;d+='M'+(x-w)+' '+(y-h)+' L'+x+' '+(y-h-t)+' L'+(x+w)+' '+(y-h)+'Z '}return d+'M'+(x-1.3*s)+' '+y+' h'+(2.6*s)+' v-'+(16*s)+' h-'+(2.6*s)+'Z'}
function pagoda(x,y,s){var d='';for(var k=0;k<3;k++){var w=(34-k*8)*s,yy=y-k*30*s;
  d+='M'+(x-w)+' '+yy+' Q'+(x-w*.5)+' '+(yy-3*s)+' '+x+' '+(yy-15*s)+' Q'+(x+w*.5)+' '+(yy-3*s)+' '+(x+w)+' '+yy+' Q'+x+' '+(yy+6*s)+' '+(x-w)+' '+yy+'Z ';
  d+='M'+(x-w*.55)+' '+yy+' h'+(w*1.1)+' v'+(18*s)+' h-'+(w*1.1)+'Z ';}
  return d+'M'+(x-1.2*s)+' '+(y-90*s-10*s)+' v-'+(20*s)+' h'+(2.4*s)+' v'+(20*s)+'Z'}
function sheetG(r,cx,cy,w,h,rot,o){o=o||{};var x=cx-w/2,y=cy-h/2,cols=o.cols||6,gap=(w-34)/cols;
  var g='<g transform="rotate('+rot+' '+cx+' '+cy+')"><rect x="'+(x+6)+'" y="'+(y+8)+'" width="'+w+'" height="'+h+'" rx="3" fill="#000" opacity=".16" filter="url(#soft)"/><rect class="sheet" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3"/>';
  if(o.grid){for(var gx=1;gx<4;gx++)g+='<path class="inkline" opacity=".35" d="M'+(x+gx*w/4)+' '+(y+12)+' V'+(y+h-12)+'"/>';for(var gy=1;gy<3;gy++)g+='<path class="inkline" opacity=".35" d="M'+(x+12)+' '+(y+gy*h/3)+' H'+(x+w-12)+'"/>'}
  else for(var c=0;c<cols;c++){var xx=x+w-20-c*gap,len=h*(.35+r()*.5);g+='<path class="inkline" d="M'+xx+' '+(y+18)+' V'+(y+18+len)+'" stroke-dasharray="'+(2+r()*4).toFixed(1)+' 3.5"/>'}
  if(o.stamp)g+='<rect x="'+(x+16)+'" y="'+(y+h-36)+'" width="18" height="18" rx="1" fill="var(--seal)" opacity=".85"/>';
  return g+'</g>'}
function penG(cx,cy,rot,len){return '<g transform="rotate('+rot+' '+cx+' '+cy+')"><rect x="'+(cx-len/2)+'" y="'+(cy-4)+'" width="'+len+'" height="8" rx="4" class="pen"/><path class="pen" d="M'+(cx-len/2)+' '+(cy-4)+' L'+(cx-len/2-26)+' '+cy+' L'+(cx-len/2)+' '+(cy+4)+'Z"/></g>'}
function bookG(cx,cy,s){var f=function(n){return (n*s).toFixed(1)};
  var L='M'+f(-150)+' '+f(-4)+' C'+f(-95)+' '+f(-34)+' '+f(-35)+' '+f(-34)+' 0 '+f(0)+' L0 '+f(68)+' C'+f(-35)+' '+f(36)+' '+f(-95)+' '+f(36)+' '+f(-150)+' '+f(70)+'Z';
  var R='M0 '+f(0)+' C'+f(35)+' '+f(-34)+' '+f(95)+' '+f(-34)+' '+f(150)+' '+f(-4)+' L'+f(150)+' '+f(70)+' C'+f(95)+' '+f(36)+' '+f(35)+' '+f(36)+' 0 '+f(68)+'Z';
  var g='<g transform="translate('+cx+' '+cy+')"><ellipse cx="0" cy="'+f(76)+'" rx="'+f(170)+'" ry="'+f(12)+'" fill="#000" opacity=".22" filter="url(#soft)"/><path class="sheet2" d="M'+f(-154)+' '+f(6)+' L'+f(-150)+' '+f(76)+' C'+f(-95)+' '+f(44)+' '+f(-35)+' '+f(44)+' 0 '+f(76)+' C'+f(35)+' '+f(44)+' '+f(95)+' '+f(44)+' '+f(150)+' '+f(76)+' L'+f(154)+' '+f(6)+'Z"/><path class="sheet" d="'+L+'"/><path class="sheet" d="'+R+'"/>';
  for(var i=0;i<6;i++){var yy=i*9+6;g+='<path class="inkline" opacity=".5" d="M'+f(-128)+' '+f(yy+2)+' C'+f(-90)+' '+f(yy-14)+' '+f(-50)+' '+f(yy-14)+' '+f(-14)+' '+f(yy+6)+'"/><path class="inkline" opacity=".5" d="M'+f(14)+' '+f(yy+6)+' C'+f(50)+' '+f(yy-14)+' '+f(90)+' '+f(yy-14)+' '+f(128)+' '+f(yy+2)+'"/>'}
  return g+'</g>'}
function scene(seed,o){o=o||{};var r=rng(seed),id='g'+(++INK_N),W=640,H=400;
  var s='<svg class="sc" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sc-top)"/><stop offset="1" style="stop-color:var(--sc-bot)"/></linearGradient></defs><rect width="'+W+'" height="'+H+'" fill="url(#'+id+')"/>';
  if(o.sun)s+='<circle class="iks" cx="'+(o.sunx||470)+'" cy="'+(o.suny||96)+'" r="'+(o.sunr||34)+'" opacity=".55" filter="url(#soft)"/>';
  if(o.glow)s+='<circle cx="'+o.glow[0]+'" cy="'+o.glow[1]+'" r="'+o.glow[2]+'" fill="#FFD59A" opacity=".5" filter="url(#glow)"/>';
  var L=[{b:230,a:150,f:.012,sh:1.5,c:'ik1',op:.5,fl:'wash'},{b:300,a:140,f:.016,sh:1.7,c:'ik2',op:.6,fl:'wash2'},{b:372,a:90,f:.02,sh:1.4,c:'ik3',op:.82,fl:'wash2'}];
  L.forEach(function(l,i){
    s+='<path class="'+l.c+'" opacity="'+l.op+'" filter="url(#'+l.fl+')" d="'+ridge(r,{W:W,H:H,base:l.b+(o.lift||0),amp:l.a*(o.amp||1),fr:l.f,sharp:l.sh,env:o.env})+'"/>';
    if(i<2)s+='<ellipse class="ikm" cx="'+(140+r()*360)+'" cy="'+(l.b+(o.lift||0)+34)+'" rx="280" ry="26" filter="url(#mistblur)"/>';
  });
  if(o.pines){var p='';for(var i=0;i<7;i++)p+=pine(20+i*24+r()*14,396,.55+r()*.5)+' ';s+='<path class="ik3" opacity=".9" d="'+p+'"/>'}
  return s+(o.extra||'')+'</svg>';
}
var SCN={};
function cached(key,fn){return SCN[key]||(SCN[key]=fn())}
function thumb(seed,kind){return cached('t'+seed+kind,function(){var r=rng(seed+99),ex='',op={amp:.7,lift:-6};
  if(kind==='notes'){ex=sheetG(r,300,208,200,160,-7,{cols:7,stamp:1})}
  else if(kind==='essay'){ex=sheetG(r,290,206,200,160,-5,{cols:6})+penG(380,262,-24,170);op.sun=1;op.sunx=500;op.suny=84}
  else if(kind==='read'){ex=bookG(320,190,1.02);op.sun=1;op.sunx=130;op.suny=86;op.sunr=28}
  else if(kind==='exam'){ex=sheetG(r,300,214,190,160,5,{grid:1});op.glow=[500,100,70]}
  op.extra=ex;return scene(seed,op)})}
function coverBg(i){return cached('c'+i,function(){return scene(40+i,{amp:.5,lift:36})})}
function heroSVG(){
  var r=rng(11),W=1240,H=560,env=function(u){return 1-.64*Math.min(1,Math.max(0,(u-.06)/.72))};
  var s='<svg class="sc" viewBox="0 0 1240 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="hgBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sc-top)"/><stop offset="1" style="stop-color:var(--sc-bot)"/></linearGradient><linearGradient id="hgSc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--sheet)"/><stop offset="1" style="stop-color:var(--sheet-2)"/></linearGradient><clipPath id="hgClip"><path d="M560 -20 C600 100 690 150 690 240 C690 320 630 372 584 428 L682 442 C764 392 804 332 794 246 C786 160 764 92 846 -20Z"/></clipPath></defs><rect width="1240" height="560" fill="url(#hgBg)"/>';
  s+='<circle class="iks" cx="470" cy="92" r="38" opacity=".45" filter="url(#soft)"/>';
  s+='<g class="layer-far"><path class="ik1" opacity=".4" filter="url(#wash)" d="'+ridge(r,{W:W,H:H,base:330,amp:330,fr:.0085,sharp:1.5,env:env,step:10})+'"/></g>';
  s+='<g class="layer-mist"><ellipse class="ikm" cx="260" cy="250" rx="440" ry="42" filter="url(#mistblur)"/><ellipse class="ikm" cx="760" cy="330" rx="380" ry="34" filter="url(#mistblur)"/></g>';
  s+='<g class="layer-mid"><path class="ik2" opacity=".66" filter="url(#wash2)" d="'+ridge(r,{W:W,H:H,base:430,amp:310,fr:.0105,sharp:1.7,env:env,step:10})+'"/></g>';
  s+='<g class="layer-mist"><ellipse class="ikm" cx="340" cy="400" rx="460" ry="38" filter="url(#mistblur)"/></g>';
  s+='<g class="layer-near"><path class="ik3" opacity=".84" filter="url(#wash2)" d="'+ridge(r,{W:W,H:H,base:548,amp:170,fr:.0085,sharp:1.15,env:env,step:10})+'"/>';
  var p='';for(var i=0;i<12;i++)p+=pine(14+i*26+r()*16,556,.85+r()*.7)+' ';
  s+='<path class="ik3" d="'+p+'"/><ellipse class="ik3" cx="742" cy="458" rx="70" ry="12" opacity=".8" filter="url(#wash)"/><path class="ik3" d="'+pagoda(742,448,.95)+'"/></g>';
  var cols=['壬戌之秋七月既望','蘇子與客泛舟遊於','赤壁之下清風徐來','水波不興舉酒屬客','誦明月之詩歌窈窕','之章少焉月出於東','山之上徘徊於斗牛'],t='';
  cols.forEach(function(c,k){var x=832-k*31;t+='<text font-size="19" letter-spacing="2" opacity=".62">';Array.from(c).forEach(function(ch,j){t+='<tspan x="'+x+'" y="'+(8+j*24)+'">'+ch+'</tspan>'});t+='</text>'});
  s+='<g class="layer-scroll"><path d="M560 -20 C600 100 690 150 690 240 C690 320 630 372 584 428 L682 442 C764 392 804 332 794 246 C786 160 764 92 846 -20Z" fill="url(#hgSc)" stroke="var(--sheet-line)" stroke-width="1"/><g clip-path="url(#hgClip)"><g transform="rotate(7 720 200) translate(-6 20)">'+t+'</g></g></g>';
  s+='<g class="layer-book">'+bookG(560,462,1.18)+'</g>';
  return s+'</svg>';
}

/* ---------- 水墨 2.0:更細緻的山水(覆寫 scene / heroSVG) ----------
   - 山脈改為「墨暈漸層」:山頭濃、山腳淡,融進雲霧
   - 加上皴法(沿山勢的細筆觸)與勾勒山稜
   - 遠山、中山、近山共四層,中間隔著雲霧;近山帶松林
   - 標題級畫面(hd)另有飛鳥與孤舟 */
function ridge2(r,o){
  var terms=[];for(var i=0;i<3;i++)terms.push({f:o.fr*(1+i*1.9+r()*.7),p:r()*6.283,w:1/(1+i*1.1)});
  var pts=[];
  for(var x=-10;x<=o.W+10;x+=(o.step||8)){
    var v=0,t=0;terms.forEach(function(q){v+=q.w*(1-Math.abs(Math.sin(x*q.f+q.p)));t+=q.w});
    v=Math.pow(v/t,o.sharp||1.6);
    var e=o.env?o.env(x/o.W):1;
    pts.push([x,o.base-o.amp*v*e]);
  }
  var seg=pts.map(function(p){return p[0]+' '+p[1].toFixed(1)}).join(' L');
  return {pts:pts,line:'M'+seg,d:'M-10 '+(o.H+10)+' L'+seg+' L'+(o.W+10)+' '+(o.H+10)+'Z'};
}
/* 一層山:漸層墨色 + 皴筆 + 山稜勾勒。回傳 {svg, pts} */
function mountain(r,id,o,l){
  var R=ridge2(r,{W:o.W,H:o.H,base:l.b+(o.lift||0),amp:l.a*(o.amp||1),fr:l.f,sharp:l.sh,env:o.env,step:o.step});
  var s='<defs><linearGradient id="'+id+'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--'+l.c+')" stop-opacity="'+l.top+'"/><stop offset="1" style="stop-color:var(--'+l.c+')" stop-opacity="'+l.bot+'"/></linearGradient><clipPath id="'+id+'c"><path d="'+R.d+'"/></clipPath></defs>';
  var n=Math.round((o.W/640)*40*Math.min(1.4,(o.amp||1)+.3)*l.dens),st='';
  for(var k=0;k<n;k++){
    var p=R.pts[Math.floor(r()*R.pts.length)],x=p[0]+(r()-.5)*16,y=p[1]+7+r()*Math.min(80,l.a*.45),len=14+r()*34,bend=(r()-.5)*9;
    st+='M'+x.toFixed(1)+' '+y.toFixed(1)+' q'+bend.toFixed(1)+' '+(len/2).toFixed(1)+' '+(bend*.5+(r()-.5)*4).toFixed(1)+' '+len.toFixed(1)+' ';
  }
  s+='<g filter="url(#'+l.fl+')"><path fill="url(#'+id+'f)" d="'+R.d+'"/>'+
     '<g clip-path="url(#'+id+'c)"><path fill="none" stroke="var(--'+l.c+')" stroke-width="'+(o.W>800?1.1:.8)+'" stroke-linecap="round" opacity="'+l.cun+'" d="'+st+'"/></g>'+
     '<path fill="none" stroke="var(--'+l.c+')" stroke-width="'+(o.W>800?1.5:1.1)+'" stroke-linejoin="round" opacity="'+l.edge+'" d="'+R.line+'"/></g>';
  return {svg:s,pts:R.pts};
}
function miniPine(x,y,s){ // 山稜上的小松:一撇主幹加幾層疏葉
  var d='M'+x.toFixed(1)+' '+y.toFixed(1)+' v-'+(18*s).toFixed(1)+' ';
  for(var k=0;k<3;k++){var w=(9-k*2)*s,yy=y-(6+k*6)*s;d+='M'+(x-w).toFixed(1)+' '+yy.toFixed(1)+' L'+x.toFixed(1)+' '+(yy-8*s).toFixed(1)+' L'+(x+w).toFixed(1)+' '+yy.toFixed(1)+' '}
  return d;
}
function ridgePines(r,pts,count,s0,lo,hi){
  var d='';
  for(var i=0;i<count;i++){var p=pts[Math.floor(lo+r()*(hi-lo))];if(!p)continue;d+=miniPine(p[0],p[1]+3,s0*(.7+r()*.6))}
  return '<path fill="none" stroke="var(--ik3)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".7" d="'+d+'"/>';
}
function birds(r,W,H,n){
  var s='<g class="birds">';
  for(var i=0;i<n;i++){var x=W*(.2+r()*.55),y=H*(.12+r()*.2),k=.8+r()*.7;
    s+='<path class="bird" style="--bd:'+(i*-3.1).toFixed(1)+'s" fill="none" stroke="var(--ik3)" stroke-width="'+(1.3*k).toFixed(1)+'" stroke-linecap="round" opacity=".6" d="M'+x.toFixed(0)+' '+y.toFixed(0)+' q'+(5*k).toFixed(1)+' '+(-5*k).toFixed(1)+' '+(10*k).toFixed(1)+' 0 q'+(5*k).toFixed(1)+' '+(-5*k).toFixed(1)+' '+(10*k).toFixed(1)+' 0"/>'}
  return s+'</g>';
}
function boat(x,y,s){
  return '<g class="boat" transform="translate('+x+' '+y+') scale('+s+')"><path d="M-22 0 h44 l-6 6 h-32z" fill="var(--ik3)" opacity=".9"/><path d="M-2 0 v-17" stroke="var(--ik3)" stroke-width="1.4" fill="none"/><path d="M-2 -17 q9 5 7 14 h-7z" fill="var(--ik2)" opacity=".7"/><ellipse cx="0" cy="8" rx="30" ry="2.2" fill="var(--ik2)" opacity=".25"/></g>';
}
function scene(seed,o){
  o=o||{};var r=rng(seed),id='g'+(++INK_N),W=640,H=400,am=o.amp||1,lift=o.lift||0;
  var s='<svg class="sc" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sc-top)"/><stop offset="1" style="stop-color:var(--sc-bot)"/></linearGradient></defs><rect width="'+W+'" height="'+H+'" fill="url(#'+id+')"/>';
  if(o.sun){var sx=o.sunx||470,sy=o.suny||96,sr=o.sunr||34;
    s+='<circle class="iks" cx="'+sx+'" cy="'+sy+'" r="'+(sr*2.3)+'" opacity=".13" filter="url(#glow)"/><circle class="iks" cx="'+sx+'" cy="'+sy+'" r="'+sr+'" opacity=".55" filter="url(#soft)"/><circle cx="'+sx+'" cy="'+sy+'" r="'+(sr+9)+'" fill="none" stroke="var(--seal)" stroke-width=".8" opacity=".25"/>';}
  if(o.glow)s+='<circle cx="'+o.glow[0]+'" cy="'+o.glow[1]+'" r="'+o.glow[2]+'" fill="#FFD59A" opacity=".5" filter="url(#glow)"/>';
  var base={W:W,H:H,amp:am,lift:lift,env:o.env,step:8};
  var Ls=[
    {b:206,a:130,f:.010,sh:1.5,c:'ik1',top:.50,bot:.04,shade:.30,crag:.06,fl:'wash',dens:.55,cun:.30,edge:.30},
    {b:256,a:140,f:.0135,sh:1.6,c:'ik1',top:.66,bot:.20,shade:.38,crag:.09,fl:'wash',dens:.8,cun:.40,edge:.40},
    {b:316,a:128,f:.0165,sh:1.7,c:'ik2',top:.78,bot:.42,shade:.46,crag:.11,fl:'wash2',dens:1,cun:.45,edge:.50},
    {b:382,a:88,f:.0205,sh:1.4,c:'ik3',top:.90,bot:.97,shade:.30,crag:.12,fl:'wash2',dens:1.1,cun:.40,edge:.56}];
  var near=null;
  Ls.forEach(function(l,i){
    var m=mountain(r,id+'m'+i,base,l);s+=m.svg;if(i===3)near=m;
    if(i<3)s+='<ellipse fill="url(#fogG)" cx="'+(120+r()*400).toFixed(0)+'" cy="'+(l.b+lift+34)+'" rx="'+(300+r()*80).toFixed(0)+'" ry="'+(34+r()*10).toFixed(0)+'"/>';
  });
  s+=ridgePines(r,near.pts,5+Math.round(r()*3),.62,6,near.pts.length-6);
  if(o.pines){var p='';for(var i=0;i<7;i++)p+=pine(20+i*24+r()*14,396,.55+r()*.5)+' ';s+='<path class="ik3" opacity=".9" d="'+p+'"/>'}
  if(o.hd){s+=rock(r,-20,H+2,150+r()*60,26+r()*10)+rock(r,W-170,H+2,190,22+r()*8);s+=birds(r,W,H,3);if(seed%2===0)s+=boat(150+r()*260,(316+lift+6),.8)}
  s+='<rect width="'+W+'" height="'+H+'" fill="url(#vigG)"/>';
  return s+(o.extra||'')+'</svg>';
}
function heroSVG(){
  var r=rng(11),W=1240,H=560,env=function(u){return 1-.64*Math.min(1,Math.max(0,(u-.06)/.72))};
  var base={W:W,H:H,amp:1,lift:0,env:env,step:10};
  var s='<svg class="sc" viewBox="0 0 1240 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="hgBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sc-top)"/><stop offset="1" style="stop-color:var(--sc-bot)"/></linearGradient><linearGradient id="hgSc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--sheet)"/><stop offset="1" style="stop-color:var(--sheet-2)"/></linearGradient><clipPath id="hgClip"><path d="M560 -20 C600 100 690 150 690 240 C690 320 630 372 584 428 L682 442 C764 392 804 332 794 246 C786 160 764 92 846 -20Z"/></clipPath></defs><rect width="1240" height="560" fill="url(#hgBg)"/>';
  s+='<circle class="iks" cx="470" cy="92" r="88" opacity=".12" filter="url(#glow)"/><circle class="iks" cx="470" cy="92" r="38" opacity=".5" filter="url(#soft)"/><circle cx="470" cy="92" r="50" fill="none" stroke="var(--seal)" stroke-width="1" opacity=".22"/>';
  s+='<g class="px" data-k="5"><g class="layer-far">'+mountain(r,'hf',base,{b:300,a:340,f:.0080,sh:1.5,c:'ik1',top:.56,bot:.04,shade:.34,crag:.07,fl:'wash',dens:.8,cun:.34,edge:.30}).svg+'</g></g>';
  s+='<g class="layer-mist"><ellipse fill="url(#fogG)" cx="260" cy="262" rx="560" ry="58"/><ellipse fill="url(#fogG)" cx="820" cy="330" rx="520" ry="50"/></g>';
  s+='<g class="px" data-k="10"><g class="layer-mid">'+mountain(r,'hm',base,{b:382,a:330,f:.0100,sh:1.65,c:'ik1',top:.76,bot:.24,shade:.44,crag:.10,fl:'wash',dens:1,cun:.42,edge:.40}).svg+'</g></g>';
  s+='<g class="layer-mist"><ellipse fill="url(#fogG)" cx="360" cy="396" rx="620" ry="52"/></g>';
  var m3=mountain(r,'hn',base,{b:448,a:300,f:.0112,sh:1.7,c:'ik2',top:.86,bot:.50,shade:.52,crag:.12,fl:'wash2',dens:1.1,cun:.46,edge:.52});
  s+='<g class="px" data-k="16"><g class="layer-mid">'+m3.svg+ridgePines(r,m3.pts,5,1.1,14,m3.pts.length-14)+'</g></g>';
  s+='<g class="layer-mist"><ellipse fill="url(#fogG)" cx="640" cy="478" rx="700" ry="46"/></g>';
  var m4=mountain(r,'hz',base,{b:556,a:170,f:.0085,sh:1.15,c:'ik3',top:.92,bot:.97,shade:.32,crag:.12,fl:'wash2',dens:1.2,cun:.40,edge:.58});
  s+='<g class="px" data-k="26"><g class="layer-near">'+m4.svg;
  var p='';for(var i=0;i<12;i++)p+=pine(14+i*26+r()*16,556,.85+r()*.7)+' ';
  s+=rock(r,-30,562,260,70)+rock(r,1010,562,300,56)+'<path class="ik3" d="'+p+'"/><ellipse class="ik3" cx="742" cy="458" rx="70" ry="12" opacity=".8" filter="url(#wash)"/><path class="ik3" d="'+pagoda(742,448,.95)+'"/></g></g>';
  s+=birds(r,W,H,5)+boat(300,402,1.1);
  var cols=['壬戌之秋七月既望','蘇子與客泛舟遊於','赤壁之下清風徐來','水波不興舉酒屬客','誦明月之詩歌窈窕','之章少焉月出於東','山之上徘徊於斗牛'],t='';
  cols.forEach(function(c,k){var x=832-k*31;t+='<text font-size="19" letter-spacing="2" opacity=".62">';Array.from(c).forEach(function(ch,j){t+='<tspan x="'+x+'" y="'+(8+j*24)+'">'+ch+'</tspan>'});t+='</text>'});
  s+='<g class="layer-scroll"><path d="M560 -20 C600 100 690 150 690 240 C690 320 630 372 584 428 L682 442 C764 392 804 332 794 246 C786 160 764 92 846 -20Z" fill="url(#hgSc)" stroke="var(--sheet-line)" stroke-width="1"/><g clip-path="url(#hgClip)"><g transform="rotate(7 720 200) translate(-6 20)">'+t+'</g></g></g>';
  s+='<g class="layer-book">'+bookG(560,462,1.18)+'</g>';
  s+='<rect width="1240" height="560" fill="url(#vigG)"/>';
  return s+'</svg>';
}
/* 頁尾上緣的山影 */
function footerMtn(){
  var r=rng(77),W=1240,H=90,m=ridge2(r,{W:W,H:H,base:78,amp:64,fr:.007,sharp:1.5,step:10}),m2=ridge2(r,{W:W,H:H,base:84,amp:44,fr:.011,sharp:1.6,step:10});
  return '<svg class="f-mtn" viewBox="0 0 1240 90" preserveAspectRatio="none" aria-hidden="true"><path d="'+m.d+'" fill="var(--dark)" opacity=".5"/><path d="'+m2.d+'" fill="var(--dark)"/></svg>';
}

/* ---------- 水墨 3.0:寫實山水(覆寫 ink2 的 ridge2 / mountain / ridgePines) ----------
   - 山形更嶙峋(加入高頻起伏),向右下的山坡畫成「陰面」:濃墨由山稜向下暈開
   - 陰面內用斧劈皴(短而下斜的筆觸)與飛白(乾筆留白)
   - 山稜線斷續、山頭點苔、松樹成叢(松針團 + 彎曲樹幹)
   - 雲霧用放射漸層,前景有山石 */
function ridge2(r,o){
  var terms=[];for(var i=0;i<3;i++)terms.push({f:o.fr*(1+i*1.9+r()*.7),p:r()*6.283,w:1/(1+i*1.1)});
  var hf=[{f:o.fr*9.3,p:r()*6.283},{f:o.fr*17.1,p:r()*6.283}];
  var cr=o.crag===undefined?.10:o.crag;
  var pts=[];
  for(var x=-10;x<=o.W+10;x+=(o.step||8)){
    var v=0,t=0;terms.forEach(function(q){v+=q.w*(1-Math.abs(Math.sin(x*q.f+q.p)));t+=q.w});
    v=Math.pow(v/t,o.sharp||1.6);
    v+=cr*(.55*Math.sin(x*hf[0].f+hf[0].p)+.45*Math.sin(x*hf[1].f+hf[1].p))*(.35+v);
    var e=o.env?o.env(x/o.W):1;
    pts.push([x,o.base-o.amp*Math.max(v,0)*e]);
  }
  var seg=pts.map(function(p){return p[0]+' '+p[1].toFixed(1)}).join(' L');
  return {pts:pts,line:'M'+seg,d:'M-10 '+(o.H+10)+' L'+seg+' L'+(o.W+10)+' '+(o.H+10)+'Z'};
}
function mountain(r,id,o,l){
  var R=ridge2(r,{W:o.W,H:o.H,base:l.b+(o.lift||0),amp:l.a*(o.amp||1),fr:l.f,sharp:l.sh,env:o.env,step:o.step,crag:l.crag});
  var P=R.pts,big=o.W>800,sc=big?1.6:1,c='var(--'+l.c+')';
  var s='<defs><linearGradient id="'+id+'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:'+c+'" stop-opacity="'+l.top+'"/><stop offset="1" style="stop-color:'+c+'" stop-opacity="'+l.bot+'"/></linearGradient>'+
    '<linearGradient id="'+id+'s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:'+c+'" stop-opacity="'+l.shade+'"/><stop offset="1" style="stop-color:'+c+'" stop-opacity="0"/></linearGradient>'+
    '<clipPath id="'+id+'c"><path d="'+R.d+'"/></clipPath></defs>';
  // 找出向右下傾斜的連續山坡(陰面)
  var runs=[],cur=null;
  for(var i=0;i<P.length-1;i++){
    var down=P[i+1][1]-P[i][1]>.35;
    if(down){if(!cur)cur=[P[i]];cur.push(P[i+1])}else if(cur){if(cur.length>=3)runs.push(cur);cur=null}
  }
  if(cur&&cur.length>=3)runs.push(cur);
  var shade='',cun1='',cun2='';
  runs.forEach(function(run){
    var span=run[run.length-1][1]-run[0][1];
    if(span<4*sc*.5)return;
    var d=Math.min(l.a*(.55+r()*.3),span*2.4+26*sc);
    var top=run.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1)}).join(' L');
    var bot=run.slice().reverse().map(function(p,k){return p[0].toFixed(1)+' '+(p[1]+d*(.65+.35*Math.sin(k*1.3+run.length))).toFixed(1)}).join(' L');
    shade+='<path fill="url(#'+id+'s)" d="M'+top+' L'+bot+'Z"/>';
    var n=Math.round(run.length*1.8*l.dens);
    for(var k=0;k<n;k++){
      var q=run[Math.floor(r()*run.length)],x=q[0]+(r()-.5)*8*sc,y=q[1]+3+r()*d*.8,len=(10+r()*28)*sc*(.6+l.dens*.4),lean=(2+r()*5)*sc;
      var stroke='M'+x.toFixed(1)+' '+y.toFixed(1)+' q'+(lean*.4).toFixed(1)+' '+(len*.5).toFixed(1)+' '+lean.toFixed(1)+' '+len.toFixed(1)+' ';
      if(r()<.35)cun2+=stroke;else cun1+=stroke;
    }
  });
  // 山頭點苔 + 少量陽面細皴
  var dots='',light='';
  var nd=Math.round(P.length*.22*l.dens);
  for(var k=0;k<nd;k++){var q=P[Math.floor(r()*P.length)],rr=(.7+r()*1.2)*sc,x=q[0]+(r()-.5)*5,y=q[1]+1+r()*4;dots+='M'+(x-rr).toFixed(1)+' '+y.toFixed(1)+' a'+rr.toFixed(1)+' '+(rr*.8).toFixed(1)+' 0 1 0 '+(2*rr).toFixed(1)+' 0 a'+rr.toFixed(1)+' '+(rr*.8).toFixed(1)+' 0 1 0 '+(-2*rr).toFixed(1)+' 0 '}
  for(var k=0;k<Math.round(P.length*.5*l.dens);k++){var q=P[Math.floor(r()*P.length)],x=q[0]+(r()-.5)*10,y=q[1]+6+r()*l.a*.4,len=(6+r()*14)*sc;light+='M'+x.toFixed(1)+' '+y.toFixed(1)+' l'+((r()-.5)*3).toFixed(1)+' '+len.toFixed(1)+' '}
  s+='<g filter="url(#'+l.fl+')"><path fill="url(#'+id+'f)" d="'+R.d+'"/>'+
     '<g clip-path="url(#'+id+'c)">'+shade+
     '<g filter="url(#dry)"><path fill="none" stroke="'+c+'" stroke-width="'+(1.05*sc).toFixed(2)+'" stroke-linecap="round" opacity="'+l.cun+'" d="'+cun1+'"/>'+
     '<path fill="none" stroke="'+c+'" stroke-width="'+(1.9*sc).toFixed(2)+'" stroke-linecap="round" opacity="'+(l.cun*.55).toFixed(2)+'" d="'+cun2+'"/>'+
     '<path fill="none" stroke="'+c+'" stroke-width="'+(.7*sc).toFixed(2)+'" stroke-linecap="round" opacity="'+(l.cun*.55).toFixed(2)+'" d="'+light+'"/></g></g>'+
     '<path fill="none" stroke="'+c+'" stroke-width="'+(1.2*sc).toFixed(2)+'" stroke-linejoin="round" opacity="'+(l.edge*.55).toFixed(2)+'" d="'+R.line+'"/>'+
     '<path fill="none" stroke="'+c+'" stroke-width="'+(1.7*sc).toFixed(2)+'" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="'+(9*sc).toFixed(0)+' '+(4*sc).toFixed(0)+' '+(22*sc).toFixed(0)+' '+(6*sc).toFixed(0)+'" opacity="'+l.edge+'" d="'+R.line+'"/>'+
     '<path fill="'+c+'" opacity="'+(l.edge+.15).toFixed(2)+'" d="'+dots+'"/></g>';
  return {svg:s,pts:P};
}
/* 一叢松:彎曲樹幹 + 幾團松針 */
function pineTree(r,x,y,s){
  var h=(34+r()*22)*s,lean=(r()-.5)*10*s,d='M'+x.toFixed(1)+' '+y.toFixed(1)+' q'+(lean).toFixed(1)+' '+(-h*.5).toFixed(1)+' '+(lean*.4).toFixed(1)+' '+(-h).toFixed(1);
  var f='';
  for(var k=0;k<4;k++){
    var t=(.38+k*.2)+r()*.06,cx=x+lean*t*.9+(r()-.5)*5*s,cy=y-h*t,rx=(13-k*2.2+r()*3)*s,ry=(3.6+r()*1.6)*s;
    f+='M'+(cx-rx).toFixed(1)+' '+cy.toFixed(1)+' q'+rx.toFixed(1)+' '+(-ry*2.2).toFixed(1)+' '+(rx*2).toFixed(1)+' 0 q'+(-rx).toFixed(1)+' '+(ry*1.1).toFixed(1)+' '+(-rx*2).toFixed(1)+' 0Z ';
  }
  return {trunk:d,foliage:f};
}
function ridgePines(r,pts,count,s0,lo,hi){
  var tr='',fo='';
  for(var i=0;i<count;i++){
    var base=pts[Math.floor(lo+r()*(hi-lo))];if(!base)continue;
    var n=1+Math.floor(r()*3);
    for(var k=0;k<n;k++){var t=pineTree(r,base[0]+k*(7+r()*9)*s0,base[1]+4+r()*3,s0*(.6+r()*.6));tr+=t.trunk+' ';fo+=t.foliage}
  }
  return '<path fill="none" stroke="var(--ik3)" stroke-width="'+(1.5*s0).toFixed(2)+'" stroke-linecap="round" opacity=".8" d="'+tr+'"/><path fill="var(--ik3)" opacity=".78" d="'+fo+'"/>';
}
/* 前景山石 */
function rock(r,x,y,w,h){
  var n=7,p=[];
  for(var i=0;i<=n;i++){var u=i/n,yy=y-h*Math.pow(Math.sin(Math.PI*u),.7)*(.72+r()*.45);p.push([x+w*u+(r()-.5)*w*.04,yy])}
  var d='M'+x+' '+(y+4)+' L'+p.map(function(q){return q[0].toFixed(1)+' '+q[1].toFixed(1)}).join(' L')+' L'+(x+w)+' '+(y+4)+'Z';
  var hl='M'+p.slice(1,4).map(function(q){return (q[0]+2).toFixed(1)+' '+(q[1]+3).toFixed(1)}).join(' L');
  return '<path d="'+d+'" fill="var(--ik3)" opacity=".94"/><path d="'+hl+'" fill="none" stroke="var(--ik1)" stroke-width="1.2" opacity=".45" stroke-linecap="round"/>';
}

/* ---------- 水墨 4.0:預先繪製的山水(亮/暗兩版),覆寫 scene / heroSVG ----------
   山水圖由程式原創生成:層層遠山、雲霧、墨黑松崖。亮色用宣紙底,暗色用夜色墨景。 */
function inkImgs(name,pos){
  var st=pos?' style="object-position:'+pos+'"':'';
  return '<img class="sc ir on-light" src="images/ink/'+name+'-light.webp" alt="" loading="lazy" decoding="async"'+st+'>'+
         '<img class="sc ir on-dark" src="images/ink/'+name+'-dark.webp" alt="" loading="lazy" decoding="async"'+st+'>';
}
function scene(seed,o){
  var n=Math.abs(Math.round(seed*3+(o&&o.pines?1:0)+(o&&o.sun?2:0)))%8;
  return inkImgs('s'+n,'50% 72%');
}
function heroSVG(){
  function layer(i,k){
    return '<div class="hl hl'+i+(k?' px':'')+'"'+(k?' data-k="'+k+'"':'')+'>'+
      '<img class="ir on-light" src="images/ink/hero-light-'+i+'.webp" alt="" decoding="async">'+
      '<img class="ir on-dark" src="images/ink/hero-dark-'+i+'.webp" alt="" decoding="async"></div>';
  }
  return layer(0,0)+layer(1,9)+layer(2,20);
}
function footerMtn(){return ''}


/* ---------- 狀態(預覽版存在瀏覽器本機) ---------- */
var PROD=true;
var KEY=PROD?'gw-cart-v1':'gw-demo-v2';
function loadS(){try{var o=JSON.parse(localStorage.getItem(KEY))||{};return PROD?{cart:(o&&typeof o.cart==='object'&&o.cart)||{}}:o}catch(e){return {}}}
var S=Object.assign({user:null,cart:{},enrolled:{},claimed:{},essays:[],tessays:[],progress:{},admin:false,tmember:{},sub:null},loadS());
function save(){try{localStorage.setItem(KEY,JSON.stringify(PROD?{cart:S.cart}:S))}catch(e){}}
var onAuth=[];

/* ---------- Toast / 對話框 ---------- */
var toastEl=$('#toast'),toastT;
function toast(msg){if(!toastEl)return;toastEl.textContent=msg;toastEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('on')},2800)}
function showDlg(d){if(!d||d.open)return;if(d.showModal){try{d.showModal();return}catch(e){}}d.setAttribute('open','')}
function closeDlg(d){if(!d)return;if(d.close){try{d.close();return}catch(e){}}d.removeAttribute('open')}
$$('dialog').forEach(function(d){
  d.addEventListener('click',function(e){if(e.target===d)closeDlg(d)});
  $$('[data-close]',d).forEach(function(b){b.addEventListener('click',function(){closeDlg(d)})});
});
var modal=$('#modal'),mBody=$('#mBody');
function openModal(html,mount){mBody.innerHTML=html;if(mount)mount(mBody);showDlg(modal)}
function ext(key){if(CONFIG[key]){window.open(CONFIG[key],'_blank','noopener')}else{toast('此連結將於正式上線前設定')}}
$$('[data-ext]').forEach(function(a){a.addEventListener('click',function(e){var k=a.getAttribute('data-ext');if(CONFIG[k]){e.preventDefault();window.open(CONFIG[k],'_blank','noopener')}else{e.preventDefault();toast('此連結將於正式上線前設定')}})});

/* ---------- 分析(填入代碼後才載入) ---------- */
if(CONFIG.gaId){var gs=document.createElement('script');gs.async=true;gs.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(CONFIG.gaId);document.head.appendChild(gs);
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CONFIG.gaId)}

/* ---------- 主題 ---------- */
var root=document.documentElement,themeBtn=$('#themeBtn');
function isDark(){var a=root.getAttribute('data-theme');if(a)return a==='dark';return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches}
function syncTheme(){var d=isDark();var u=$('#themeUse');if(u)u.setAttribute('href',d?'#i-sun':'#i-moon');if(themeBtn)themeBtn.setAttribute('aria-label',d?'切換為淺色模式':'切換為深色模式')}
try{var saved=localStorage.getItem('gw-theme');if(saved==='dark'||saved==='light')root.setAttribute('data-theme',saved)}catch(e){}
if(themeBtn)themeBtn.addEventListener('click',function(){
  var next=isDark()?'light':'dark';
  document.body.classList.add('theme-anim');
  root.setAttribute('data-theme',next);
  try{localStorage.setItem('gw-theme',next)}catch(e){}
  syncTheme();setTimeout(function(){document.body.classList.remove('theme-anim')},450);
});
new MutationObserver(syncTheme).observe(root,{attributes:true,attributeFilter:['data-theme']});
if(window.matchMedia)try{window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',syncTheme)}catch(e){}
syncTheme();

/* ---------- 導覽 ---------- */
var header=$('#siteHeader');
function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>8)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
var hamb=$('#hambBtn'),mnav=$('#mnav');
if(hamb)hamb.addEventListener('click',function(){var o=mnav.classList.toggle('open');hamb.setAttribute('aria-expanded',o?'true':'false');hamb.querySelector('use').setAttribute('href',o?'#i-x':'#i-menu')});

/* ---------- 水墨插圖 ---------- */
$$('[data-scene]').forEach(function(el){
  var seed=+el.getAttribute('data-scene'),o={};try{o=JSON.parse(el.getAttribute('data-sopt')||'{}')}catch(e){}
  if(el.classList.contains('art')||el.classList.contains('l-art'))o.hd=1;
  el.insertAdjacentHTML('afterbegin',scene(seed,o));
});
$$('[data-thumb]').forEach(function(el){var p=el.getAttribute('data-thumb').split(':');el.insertAdjacentHTML('afterbegin',thumb(+p[0],p[1]))});
var heroArt=$('#heroArt');if(heroArt)heroArt.innerHTML=heroSVG();
/* 首頁載入畫面(LOGO):資源載入完成且至少播完約 2 秒後淡出,再開始首頁動畫;同一分頁只播一次 */
(function(){
  var R=document.documentElement;if(!R.classList.contains('ld'))return;
  var t0=Date.now(),done=false;
  function fin(){
    if(done)return;done=true;
    setTimeout(function(){
      R.classList.add('ld-out');
      try{sessionStorage.setItem('gw-ld','1')}catch(e){}
      setTimeout(function(){var l=$('#loader');if(l&&l.parentNode)l.parentNode.removeChild(l);R.classList.remove('ld','ld-out')},900);
    },Math.max(0,2100-(Date.now()-t0)));
  }
  if(document.readyState==='complete')fin();else window.addEventListener('load',fin);
  setTimeout(fin,7000);
})();
var rb=$('#replayBtn');if(rb)rb.addEventListener('click',function(){var h=$('#home');h.classList.remove('play');void h.offsetWidth;h.classList.add('play')});

/* ---------- 購物車(狀態) ---------- */
function cartCount(){var n=0;for(var k in S.cart)n+=S.cart[k];return n}
function cartSum(){var s=0;for(var k in S.cart){var p=byId(GW.products,k);if(p)s+=S.cart[k]*p.price}return s}
function refreshBadge(bump){
  var b=$('#cartBadge');if(!b)return;var n=cartCount();b.textContent=n;b.classList.toggle('on',n>0);
  if(bump){b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}
}
function syncAddBtns(){$$('[data-add]').forEach(function(b){var id=b.getAttribute('data-add');if(b.classList.contains('cartbtn')){var on=!!S.cart[id];b.classList.toggle('added',on);b.innerHTML=ico(on?'i-check':'i-cart','width:18px;height:18px')}})}
function addToCart(id,quiet){
  var p=byId(GW.products,id);if(!p)return;
  if(typeof canAdd==='function'&&!canAdd(id))return;
  S.cart[id]=(S.cart[id]||0)+1;save();refreshBadge(true);syncAddBtns();
  if(!quiet)toast('已加入購物車:'+p.name);
}
function bindAdd(root){$$('[data-add]:not([data-b])',root).forEach(function(b){b.setAttribute('data-b','1');b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();addToCart(b.getAttribute('data-add'),b.hasAttribute('data-go'));if(b.hasAttribute('data-go'))location.href=b.getAttribute('data-go')})})}
bindAdd();

/* ================= 正式版:接上 Supabase(登入、報名、付款、作文、後台) ================= */
var sb=null,U=null,MEM=null,ENR={},CLAIMED={},ready=false;
var PUB={products:{},courses:{},plans:{},resources:{},pay:false,liveDays:90};
var INTENT={};
var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var isAdmin=function(){return !!(U&&U.role==='admin')};
function isMember(){return !!(U&&MEM&&new Date(MEM.valid_until).getTime()+3*864e5>Date.now())}
function fmtDate(t){var d=new Date(t);return d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()}
function fmtDT(t){var d=new Date(t);return fmtDate(t)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function planName(id){return (PUB.plans[id]&&PUB.plans[id].name)||({monthly:'月繳',yearly:'年繳'}[id])||'付費會員'}
function canAdd(id){var p=PUB.products[id];if(p&&!p.active){toast('這本教材暫時無法購買');return false}return true}

var CAN_EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function niceErr(e){
  var m=(e&&e.message)||'';
  if(/Failed to fetch|NetworkError|network/i.test(m))return '網路連線不穩,請稍後再試。';
  if(/row-level security|permission denied/i.test(m))return '沒有權限執行這個動作。';
  if(/duplicate key/i.test(m))return '資料已存在。';
  return m||'系統忙碌,請稍後再試。';
}
async function callFn(name,body){
  var r=await sb.functions.invoke(name,{body:body});
  if(r.error){
    var m='系統忙碌,請稍後再試';
    try{if(r.error.context&&r.error.context.json){var j=await r.error.context.json();if(j&&j.error)m=j.error}}catch(_){}
    throw new Error(m);
  }
  if(r.data&&r.data.error)throw new Error(r.data.error);
  return r.data;
}
function postForm(url,fields){
  var f=document.createElement('form');f.method='POST';f.action=url;f.acceptCharset='UTF-8';
  Object.keys(fields).forEach(function(k){var i=document.createElement('input');i.type='hidden';i.name=k;i.value=fields[k];f.appendChild(i)});
  document.body.appendChild(f);f.submit();
}
async function checkout(body,btn,errEl){
  var label=btn&&btn.textContent;
  if(btn){btn.disabled=true;btn.textContent='正在前往綠界…'}
  if(errEl)errEl.textContent='';
  try{
    var r=await callFn('create-order',body);
    if(!r||!r.url||!r.fields)throw new Error('系統忙碌,請稍後再試');
    postForm(r.url,r.fields);
  }catch(e){
    if(btn){btn.disabled=false;btn.textContent=label}
    if(errEl)errEl.textContent=niceErr(e);else toast(niceErr(e));
  }
}

/* ---------- 登入 ---------- */
var userBtn=$('#userBtn');
function renderUserBtn(){
  if(!userBtn)return;
  userBtn.innerHTML=U?'<span style="width:30px;height:30px;border-radius:50%;background:var(--bronze-b);color:var(--on-bronze);display:grid;place-items:center;font-weight:700;font-size:14px">'+esc((U.name||'?').charAt(0).toUpperCase())+'</span>':ico('i-user');
  userBtn.setAttribute('aria-label',U?'會員專區:'+U.name:'會員登入');
}
function signIn(intent){
  if(!sb){toast('網站尚未完成設定,請稍後再試');return}
  try{sessionStorage.setItem('gw-after',JSON.stringify(Object.assign({page:PAGE,id:dynId()},intent||{})))}catch(e){}
  sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname,queryParams:{prompt:'select_account'}}}).then(function(r){if(r&&r.error)toast('登入失敗:'+niceErr(r.error))});
}
function askLogin(reason,intent){
  openModal('<h3 id="mTitle">登入會員</h3><p class="lead">'+esc(reason||'使用 Google 帳號登入,即可領取免費資源、報名課程與上傳作文。')+'</p><button type="button" class="gbtn" id="gLogin"><span class="g" aria-hidden="true">G</span>使用 Google 帳號登入</button><p class="mfoot">不需要另外設定密碼,我們只會取得你的姓名與 Email。登入即表示同意<a href="terms.html" style="text-decoration:underline">服務條款</a>與<a href="privacy.html" style="text-decoration:underline">隱私權政策</a>。</p>',function(){
    $('#gLogin').addEventListener('click',function(){signIn(intent)});
  });
}
if(userBtn)userBtn.addEventListener('click',function(){if(U){location.href='member.html'}else{askLogin()}});
$$('[data-login]').forEach(function(b){b.addEventListener('click',function(){if(U){location.href='member.html'}else{askLogin()}})});
/* ---------- 手機推播通知(Web Push) ---------- */
var PUSH={
  key:function(){return (window.GW&&GW.config&&GW.config.vapidPublicKey)||''},
  supported:function(){return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window},
  ios:function(){return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)},
  standalone:function(){return !!((window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true)},
  u8:function(b){var p='='.repeat((4-b.length%4)%4),r=atob((b+p).replace(/-/g,'+').replace(/_/g,'/')),o=new Uint8Array(r.length);for(var i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o},
  sub:async function(){try{if(!PUSH.supported())return null;var r=await navigator.serviceWorker.getRegistration();return r?await r.pushManager.getSubscription():null}catch(_){return null}},
  /* hide | ios | unsupported | denied | off | on */
  state:async function(){
    if(!PUSH.key())return 'hide';
    if(!PUSH.supported())return PUSH.ios()&&!PUSH.standalone()?'ios':'unsupported';
    if(Notification.permission==='denied')return 'denied';
    return (await PUSH.sub())?'on':'off';
  },
  on:async function(){
    var perm=await Notification.requestPermission();
    if(perm!=='granted')return 'denied';
    await navigator.serviceWorker.register('sw.js');
    var reg=await navigator.serviceWorker.ready,opt={userVisibleOnly:true,applicationServerKey:PUSH.u8(PUSH.key())},sub;
    try{sub=await reg.pushManager.subscribe(opt)}
    catch(e){var old=await reg.pushManager.getSubscription();if(old){await old.unsubscribe();sub=await reg.pushManager.subscribe(opt)}else throw e}
    var j=sub.toJSON();
    var r=await sb.rpc('save_push_subscription',{p_endpoint:j.endpoint,p_p256dh:j.keys.p256dh,p_auth:j.keys.auth,p_ua:(navigator.userAgent||'').slice(0,300)});
    if(r.error){try{await sub.unsubscribe()}catch(_){}throw r.error}
    return 'on';
  },
  off:async function(){
    var s=await PUSH.sub();if(!s)return;
    var ep=s.endpoint;
    try{await sb.from('push_subscriptions').delete().eq('endpoint',ep)}catch(_){}
    try{await s.unsubscribe()}catch(_){}
  }
};
async function signOut(){try{await PUSH.off()}catch(e){}try{await sb.auth.signOut()}catch(e){}U=null;MEM=null;ENR={};CLAIMED={};renderUserBtn();fire();toast('已登出')}

/* ---------- 載入使用者與公開資料 ---------- */
async function loadUser(session){
  if(!session||!session.user){U=null;MEM=null;ENR={};CLAIMED={};return}
  var au=session.user,prof=null;
  for(var i=0;i<4&&!prof;i++){var r=await sb.from('profiles').select('id,email,name,role').eq('id',au.id).maybeSingle();prof=r.data;if(!prof)await sleep(500)}
  var meta=au.user_metadata||{};
  U={id:au.id,email:(prof&&prof.email)||au.email||'',name:(prof&&prof.name)||meta.full_name||meta.name||(au.email||'會員').split('@')[0],role:prof?prof.role:'student',toured:!!meta.gw_toured};
  await loadMine();
}
async function loadMine(){
  if(!U)return;
  var rs=await Promise.all([
    sb.from('memberships').select('plan,status,valid_until').eq('user_id',U.id).maybeSingle(),
    sb.from('enrollments').select('course_id').eq('user_id',U.id),
    sb.from('resource_claims').select('resource_id').eq('user_id',U.id)]);
  MEM=rs[0].data||null;ENR={};CLAIMED={};
  (rs[1].data||[]).forEach(function(x){ENR[x.course_id]=true});
  (rs[2].data||[]).forEach(function(x){CLAIMED[x.resource_id]=true});
}

/* ---- 教材內容(封面、簡介、特色、目錄、內頁圖):資料庫有值就蓋過內建預設 ---- */
function mediaUrl(p){
  if(/^(images\/|https?:)/.test(p))return p;
  return String((GW.config&&GW.config.supabaseUrl)||'').replace(/\/$/,'')+'/storage/v1/object/public/product-media/'+String(p).split('/').map(encodeURIComponent).join('/');
}
function galHtml(items){
  return items.map(function(it){var u=mediaUrl(it.src||it.path),c=it.cap||'';
    return '<figure><img src="'+esc(u)+'" alt="'+esc(c)+'" loading="lazy">'+(c?'<figcaption>'+esc(c)+'</figcaption>':'')+'</figure>'}).join('');
}
function tocHtml(rows){
  return rows.map(function(t){return t[1]?'<li><span>'+esc(t[0])+'</span><i>'+esc(t[1])+'</i></li>':'<li class="grp">'+esc(t[0])+'</li>'}).join('');
}
var COURSE_SEED={
  guoxie:{tagline:'知性題 × 情意題 × 寫作策略。審題、立意、架構、表達,一次掌握。',intro:'適用學測國寫。從知性題與情意題的審題、立意,到架構與表達,搭配《高中國寫之屠龍寶刀》《倚天神劍》《學測國寫全攻略》一起學。(章節為暫訂,待老師確認。)',audience:'準備學測的高中生'},
  guwen:{tagline:'逐篇精讀 × 重點統整 × 考點掌握。字詞註解、篇章理解、寫作手法、題型分析,一次掌握。',intro:'十五篇核心古文逐篇精讀:字詞註解、篇章理解、寫作手法與題型分析,考前一次複習完。搭配《國文學霸筆記――核心古文 15 篇》使用。(章節為暫訂,待老師確認。)',audience:'想打好古文底子的高中生'}
};
function applyCourseContent(){
  Object.keys(PUB.courses).forEach(function(id){
    var r=PUB.courses[id],g=byId(GW.courses,id);
    if(!g||g.dyn)return;
    var eb=$('#enrollBtn[data-course="'+id+'"]'),e;
    if(r.tagline){
      $$('#card-'+id+' .c-body p').forEach(function(el){el.textContent=r.tagline});
      if(eb&&(e=$('.phero-in p')))e.textContent=r.tagline;
    }
    if(eb&&r.intro&&(e=$('.pd-tag')))e.textContent=r.intro;
    if(eb&&r.audience)$$('dt').forEach(function(dt){if(dt.textContent.trim()==='適合對象'&&dt.nextElementSibling)dt.nextElementSibling.textContent=r.audience});
    if(r.cover_path){
      var u=mediaUrl(r.cover_path);
      $$('#card-'+id+' .c-art img:not(.sc)').forEach(function(im){im.src=u});
      if(eb)$$('.cd-art img:not(.sc)').forEach(function(im){im.src=u});
    }
  });
}
function applyProductContent(){
  Object.keys(PUB.products).forEach(function(id){
    var r=PUB.products[id],g=byId(GW.products,id),e;
    if(r.cover_path){
      if(g)g.coverUrl=mediaUrl(r.cover_path);
      $$('img[data-pimg="'+id+'"]').forEach(function(im){im.src=mediaUrl(r.cover_path)});
    }
    if(r.meta){$$('#card-'+id+' .pmeta').forEach(function(el){el.textContent=r.meta});var pm=$('.pd-info [data-price="'+id+'"]');if(pm){var pe=$('.pd-meta');if(pe&&pe.id!=='dMeta')pe.textContent=r.meta}}
    if(r.tagline)$$('#card-'+id+' .pbody p').forEach(function(el){el.textContent=r.tagline});
    if(r.intro&&(e=$('[data-pintro="'+id+'"]')))e.textContent=r.intro;
    if(Array.isArray(r.feats)&&r.feats.length&&(e=$('[data-pfeats="'+id+'"]')))
      e.innerHTML=r.feats.map(function(x){return '<li>'+esc(x)+'</li>'}).join('');
    if(Array.isArray(r.toc)&&r.toc.length&&(e=$('[data-ptoc="'+id+'"]')))e.innerHTML=tocHtml(r.toc);
    if(Array.isArray(r.gallery)){
      var w=$('[data-pgalwrap="'+id+'"]'),gl=$('[data-pgal="'+id+'"]');
      if(w&&gl){gl.innerHTML=galHtml(r.gallery);w.hidden=!r.gallery.length}
    }
  });
}
function tagPrice(){
  $$('[data-price]').forEach(function(el){var p=byId(GW.products,el.getAttribute('data-price'));if(p)el.textContent=p.price.toLocaleString('en-US')});
}
/* 課程價格:以後台設定為準,顯示在課程頁與課程卡片 */
function applyCoursePrice(){
  Object.keys(PUB.courses).forEach(function(id){
    var c=PUB.courses[id];if(c.price==null)return;
    var tx=c.price>0?'NT$'+(+c.price).toLocaleString('en-US'):'免費';
    $$('#card-'+id+' .c-meta').forEach(function(m){if(!$('.cprice',m)){var sp=document.createElement('span');sp.className='cprice';sp.textContent=tx;m.insertBefore(sp,m.firstChild)}});
    var b=$('#enrollBtn');
    if(b&&b.getAttribute('data-course')===id){
      var ci=$('.cinfo');
      if(ci){var ex=$('#cPrice',ci);if(!ex){ex=document.createElement('div');ex.id='cPrice';ex.innerHTML='<dt>課程價格</dt><dd></dd>';ci.insertBefore(ex,ci.firstChild)}$('dd',ex).textContent=tx}
    }
  });
}
/* 課程章節:以後台設定為準(老師新增或改名章節後,課程頁與課程卡片的章節數、章節清單同步) */
function applyChapters(){
  var CH=PUB.chapters||{};
  Object.keys(CH).forEach(function(id){
    var list=CH[id];if(!list||!list.length)return;
    $$('#card-'+id+' .c-meta span').slice(0,1).forEach(function(sp){sp.textContent=list.length+' 個章節'});
    var b=$('#enrollBtn');
    if(b&&b.getAttribute('data-course')===id){
      var ol=$('.chlist');if(ol)ol.innerHTML=list.map(function(c){return '<li>'+esc(c.title)+'</li>'}).join('');
      $$('dt').forEach(function(dt){if(dt.textContent.trim()==='章節數'&&dt.nextElementSibling)dt.nextElementSibling.textContent=list.length+' 個章節'});
    }
  });
}

/* ---------- 老師在後台新增的教材與課程:由資料庫內容產生前台頁面 ---------- */
function dynId(){
  var m=/[?&]id=([A-Za-z0-9_-]{1,40})/.exec(location.search);
  if(m)return m[1];
  if(!/-dyn$/.test(PAGE))return '';
  try{var j=JSON.parse(sessionStorage.getItem('gw-after')||'null');if(j&&j.page===PAGE&&/^[A-Za-z0-9_-]{1,40}$/.test(j.id||'')){try{history.replaceState(null,'',location.pathname+'?id='+j.id)}catch(_){}return j.id}}catch(e){}
  return '';
}
function holdHtml(name){return '<span class="phold">'+esc(name)+'</span>'}
function dynScene(id,o){var n=0;String(id).split('').forEach(function(c){n+=c.charCodeAt(0)});return scene(n,o)}
function productCardHtml(g){
  var r=PUB.products[g.id]||{},src=r.cover_path?mediaUrl(r.cover_path):(g.cover?'images/'+g.cover:'');
  var txt=g.tagline||g.intro||r.intro||'';
  return '<article class="pcard" id="card-'+esc(g.id)+'"><div class="pcover">'+dynScene(g.id,{amp:.5,lift:36})+'<a class="cvlink" href="'+esc(g.url)+'" tabindex="-1" aria-hidden="true">'+(src?'<img class="cv" data-pimg="'+esc(g.id)+'" src="'+esc(src)+'" alt="" width="176" height="249" loading="lazy">':holdHtml(g.name))+'</a></div>'+
    '<div class="pbody"><div class="pmeta">'+esc(g.meta||'')+(r.active===false?(g.meta?'・':'')+'未上架(只有老師看得到)':'')+'</div><h3><a href="'+esc(g.url)+'">'+esc(g.name)+'</a></h3><p>'+esc(txt)+'</p>'+
    '<div class="prow"><span class="price">NT$<span data-price="'+esc(g.id)+'">'+g.price+'</span></span><div class="pact"><a class="btn btn-line sm" href="'+esc(g.url)+'">查看詳情</a><button type="button" class="cartbtn" data-add="'+esc(g.id)+'" aria-label="加入購物車:'+esc(g.name)+'">'+ico('i-cart','width:18px;height:18px')+'</button></div></div></div></article>';
}
function courseCardHtml(c){
  var r=PUB.courses[c.id]||{},n=(PUB.chapters&&PUB.chapters[c.id]||[]).length;
  return '<article class="course" id="card-'+esc(c.id)+'"><a class="c-art" href="'+esc(c.url)+'" aria-label="'+esc(c.name)+'">'+dynScene(c.id,{amp:.7,lift:4})+(r.cover_path?'<img src="'+esc(mediaUrl(r.cover_path))+'" alt="" loading="lazy">':holdHtml(c.name))+'</a>'+
    '<div class="c-body"><span class="cbadge">'+(r.status==='open'?'開放報名':'籌備中')+'</span><h3 aria-level="2"><a href="'+esc(c.url)+'">'+esc(c.name)+'</a></h3><p>'+esc(r.tagline||r.intro||'')+'</p>'+
    '<div class="c-meta"><span>'+n+' 個章節</span><span>預錄影片</span><span>YouTube 平台</span></div><a class="btn btn-fill" href="'+esc(c.url)+'">課程資訊 '+ico('i-arrow')+'</a></div></article>';
}
var dynDone=false;
function renderDyn(){
  if(dynDone)return;dynDone=true;
  var dp=GW.products.filter(function(g){return g.dyn}),dc=GW.courses.filter(function(c){return c.dyn});
  if(PAGE==='materials')renderMaterialsPage(dp);
  if(PAGE==='courses'&&dc.length){
    var cw=$('.courses');if(cw)cw.insertAdjacentHTML('beforeend',dc.map(courseCardHtml).join(''));
  }
  if(PAGE==='product-dyn')dynProduct();
  if(PAGE==='course-dyn')dynCourse();
  if(PAGE==='learn-dyn')dynLearn();
}
function renderMaterialsPage(dp){
  var holder=$('.pg .wrap .section.first'),w=$('.pg .wrap'),lp=$('.lead-p'),cats=PUB.cats||[];
  if(lp)lp.textContent=lp.textContent.replace(/共有\s*\d+\s*本/,'共有 '+GW.products.length+' 本');
  if(!cats.length){
    if(dp.length&&w){
      var sec=document.createElement('div');sec.id='dynProds';sec.style.marginTop='40px';
      sec.innerHTML='<div class="sec-head"><div><h2>更多教材</h2></div></div><div class="pgrid">'+dp.map(productCardHtml).join('')+'</div>';
      w.appendChild(sec);bindAdd(sec);syncAddBtns();
    }
    return;
  }
  if(!holder)return;
  var cards={};$$('.pcard',holder).forEach(function(el){cards[el.id.replace(/^card-/,'')]=el});
  var groups={},other=[];cats.forEach(function(c){groups[c.id]=[]});
  GW.products.map(function(g,i){return {g:g,i:i,s:(PUB.products[g.id]&&PUB.products[g.id].sort!=null)?PUB.products[g.id].sort:i}})
    .sort(function(a,b){return a.s-b.s||a.i-b.i}).forEach(function(o){
      var g=o.g;if(!g.dyn&&!cards[g.id])return;
      var cid=PUB.products[g.id]&&PUB.products[g.id].category_id;
      (cid&&groups[cid]?groups[cid]:other).push(g);
    });
  var secs=cats.map(function(c){return {name:c.name,sub:c.subtitle,items:groups[c.id]}});
  if(other.length)secs.push({name:'其他教材',sub:'',items:other});
  holder.innerHTML='';
  secs.forEach(function(sc,i){
    var d=document.createElement('div');if(holder.children.length)d.style.marginTop='40px';
    d.innerHTML='<div class="sec-head"><div><h2>'+esc(sc.name)+'</h2>'+(sc.sub?'<p class="sub">'+esc(sc.sub)+'</p>':'')+'</div></div><div class="pgrid"></div>';
    var gr=$('.pgrid',d);
    if(!sc.items.length){
      gr.outerHTML='<div class="zone-empty" role="note"><b>'+esc(sc.name)+'教材籌備中</b><p>我們正在準備這個專區的教材,敬請期待。有想要的內容,歡迎<a href="contact.html">告訴我們</a>。</p></div>';
      holder.appendChild(d);return;
    }
    sc.items.forEach(function(g){
      if(cards[g.id])gr.appendChild(cards[g.id]);
      else gr.insertAdjacentHTML('beforeend',productCardHtml(g));
    });
    holder.appendChild(d);
  });
  bindAdd(holder);syncAddBtns();
}
function dynMissing(){var b=$('#dBody'),m=$('#dMissing');if(b)b.hidden=true;if(m)m.hidden=false}
function dynProduct(){
  var id=dynId(),g=id&&byId(GW.products,id);
  if(g&&!g.dyn){location.replace(g.url);return}
  if(!g||!PUB.products[id]){dynMissing();return}
  var r=PUB.products[id];
  ['data-pimg','data-price','data-add','data-pintro','data-pfeats','data-ptoc','data-pgalwrap','data-pgal'].forEach(function(a){$$('['+a+'="__ID__"]').forEach(function(el){el.setAttribute(a,id)})});
  $('#dName').textContent=g.name;$('#dTitle').textContent=g.title;$('#dSub').textContent=g.tagline||'';
  var mt=$('#dMeta');mt.textContent=(g.meta||'')+(r.active===false?(g.meta?'・':'')+'未上架(只有老師看得到)':'');mt.hidden=!mt.textContent;
  var tg=$('#dTag');tg.textContent=g.tagline||'';tg.hidden=!g.tagline;
  document.title=g.name+'｜國文滿級分專業工作室';
  var intro=$('#dIntro');if(intro){intro.textContent=r.intro||'';if(!r.intro){intro.hidden=true;if(intro.previousElementSibling)intro.previousElementSibling.hidden=true}}
  applyProductContent();
  var im=$('.pd-cover img');
  if(im&&!r.cover_path){im.insertAdjacentHTML('afterend',holdHtml(g.name));im.remove()}
  if(!(Array.isArray(r.feats)&&r.feats.length))$('#dFeatsWrap').hidden=true;
  if(!(Array.isArray(r.toc)&&r.toc.length))$('#dTocWrap').hidden=true;
  var rel=GW.products.filter(function(x){return x.id!==id&&(!x.dyn||(PUB.products[x.id]&&PUB.products[x.id].active))}).slice(0,4);
  var rg=$('#dRel');if(rg){rg.innerHTML=rel.map(productCardHtml).join('')}
  bindAdd();syncAddBtns();
}
function dynCourse(){
  var id=dynId(),c=id&&byId(GW.courses,id);
  if(c&&!c.dyn){location.replace(c.url);return}
  if(!c||!PUB.courses[id]){dynMissing();return}
  var r=PUB.courses[id];
  $('#dName').textContent=c.name;$('#dTitle').textContent=c.name;$('#dSub').textContent=r.tagline||'';
  document.title=c.name+'｜國文滿級分專業工作室';
  var tg=$('#dTag');tg.textContent=r.intro||r.tagline||'';tg.hidden=!tg.textContent;
  var au=$('#dAud');if(au){if(r.audience){$('dd',au).textContent=r.audience}else au.remove()}
  var art=$('#dArt');if(art&&r.cover_path)art.insertAdjacentHTML('beforeend','<img src="'+esc(mediaUrl(r.cover_path))+'" alt="'+esc(c.name)+'" loading="lazy">');
  var b=$('#enrollBtn');b.setAttribute('data-course',id);
  var ch=PUB.chapters&&PUB.chapters[id]||[];
  $('.chlist').innerHTML=ch.length?ch.map(function(x){return '<li>'+esc(x.title)+'</li>'}).join(''):'<li>章節內容籌備中</li>';
  $$('dt').forEach(function(dt){if(dt.textContent.trim()==='章節數'&&dt.nextElementSibling)dt.nextElementSibling.textContent=ch.length+' 個章節'});
  var bd=$('.pd-info .cbadge');if(bd)bd.textContent=r.status==='open'?'開放報名':'籌備中';
  initCourse();
}
function dynLearn(){
  var id=dynId(),c=id&&byId(GW.courses,id);
  if(c&&!c.dyn){location.replace(c.learn);return}
  if(!c||!PUB.courses[id]){var a=$('#learnApp');if(a)a.innerHTML='<div class="gate"><h2>找不到這門課程</h2><p><a href="courses.html" style="text-decoration:underline">回線上課程</a></p></div>';return}
  var cr=$('#dCrumb');if(cr){cr.textContent=c.name;cr.href=c.url}
  var sb2=$('#dSub');if(sb2)sb2.textContent=c.name;
  document.title='學習環境・'+c.name+'｜國文滿級分專業工作室';
  $('#learnApp').setAttribute('data-course',id);
  initLearn();
}
async function selFb(table,cols,fb,order){
  var list=[cols].concat(Array.isArray(fb)?fb:(fb?[fb]:[])),r;
  for(var i=0;i<list.length;i++){
    var q=sb.from(table).select(list[i]);if(order)q=q.order(order);
    r=await q;if(!(r&&r.error))break;
  }
  return r;
}
function addDynProduct(r){
  if(!r||!r.id||!r.name||byId(GW.products,r.id))return;
  if(r.active===false&&!(typeof isAdmin==='function'&&isAdmin()))return;
  GW.products.push({id:r.id,name:r.name,title:r.title||r.name,price:r.price,cover:'',url:'product.html?id='+encodeURIComponent(r.id),intro:'',feats:[],toc:[],extra:[],dyn:true,meta:r.meta||'',tagline:r.tagline||''});
}
function addDynCourse(r){
  if(!r||!r.id||!r.name||byId(GW.courses,r.id))return;
  GW.courses.push({id:r.id,name:r.name,url:'course.html?id='+encodeURIComponent(r.id),learn:'learn.html?id='+encodeURIComponent(r.id),chaps:[],dyn:true});
}
async function loadPublic(){
  try{
    var rs=await Promise.all([
      selFb('products','id,name,title,price,active,kind,sort,meta,tagline,category_id,cover_path,intro,feats,toc,gallery',['id,name,title,price,active,kind,sort,meta,tagline,cover_path,intro,feats,toc,gallery','id,price,active,kind,cover_path,intro,feats,toc,gallery'],'sort'),
      selFb('courses','id,name,price,status,sort,intro,tagline,audience,cover_path','id,price,status','sort'),
      sb.from('plans').select('id,name,amount,period_type,frequency,active'),sb.from('site_settings').select('key,value'),
      sb.from('resources').select('id,name,gate,storage_path,href'),sb.from('course_chapters').select('course_id,position,title').order('position'),sb.from('product_categories').select('id,name,subtitle,sort').order('sort')]);
    PUB.cats=(rs[6]&&rs[6].data)||[];
    (rs[0].data||[]).forEach(function(r){PUB.products[r.id]=r;var p=byId(GW.products,r.id);if(p)p.price=r.price;else addDynProduct(r)});
    (rs[1].data||[]).forEach(function(r){PUB.courses[r.id]=r;addDynCourse(r)});
    (rs[2].data||[]).forEach(function(r){PUB.plans[r.id]=r});
    (rs[4].data||[]).forEach(function(r){PUB.resources[r.id]=r});
    var CH={};(rs[5].data||[]).forEach(function(r){(CH[r.course_id]=CH[r.course_id]||[]).push(r)});PUB.chapters=CH;
    (rs[3].data||[]).forEach(function(r){
      if(r.key==='payments_enabled')PUB.pay=(r.value===true);
      if(r.key==='live_retention_days'&&typeof r.value==='number')PUB.liveDays=r.value;
      if(r.key==='line_url'&&r.value)CONFIG.lineUrl=r.value;
      if(r.key==='youtube_url'&&r.value)CONFIG.youtubeUrl=r.value;
    });
  }catch(e){}
  renderDyn();
  tagPrice();applyProductContent();
  applyChapters();applyCoursePrice();applyCourseContent();
  Object.keys(PUB.products).forEach(function(id){
    if(!PUB.products[id].active)$$('[data-add="'+id+'"]').forEach(function(b){b.classList.add('off');b.setAttribute('title','暫時無法購買')});
  });
  Object.keys(PUB.courses).forEach(function(id){
    if(PUB.courses[id].status==='open')$$('#card-'+id+' .cbadge').forEach(function(b){b.textContent='開放報名'});
  });
  $$('#enrollBtn').forEach(function(b){var c=PUB.courses[b.getAttribute('data-course')];if(c&&c.status==='open'){var bd=$('.pd-info .cbadge');if(bd)bd.textContent='開放報名'}});
  Object.keys(PUB.plans).forEach(function(id){
    var pl=PUB.plans[id],el=$('[data-planprice="'+id+'"]');
    if(el&&pl.active)el.textContent=pl.amount.toLocaleString('en-US')+(pl.period_type==='Y'?' / 年':' / 月');
  });
}
function fire(){renderUserBtn();onAuth.forEach(function(f){try{f()}catch(e){console.error(e)}})}
function takeIntent(){
  try{var j=JSON.parse(sessionStorage.getItem('gw-after')||'null');sessionStorage.removeItem('gw-after');return j&&j.page===PAGE?j:null}catch(e){return null}
}
/* ---------- 首頁公告橫幅(最近 30 天最新一則,公開可見,可關閉) ---------- */
async function annBanner(){
  try{
    if(!sb||$('#annBar'))return;
    var r=await sb.from('announcements').select('id,title,body,url,created_at').gte('created_at',new Date(Date.now()-30*864e5).toISOString()).order('created_at',{ascending:false}).limit(1);
    var a=r&&r.data&&r.data[0];if(!a)return;
    try{if(sessionStorage.getItem('gw-ann-'+a.id))return}catch(_){}
    var main=$('#main');if(!main)return;
    var ok=a.url&&/^[\w\-.\/?=&#]+$/.test(a.url)&&!/^\w+:/.test(a.url);
    var txt='<b>'+esc(a.title)+'</b><span>'+esc(a.body)+'</span>';
    main.insertAdjacentHTML('afterbegin','<div class="annbar" id="annBar" role="status"><span class="annic" aria-hidden="true">公告</span>'+(ok?'<a href="'+esc(a.url)+'">'+txt+'</a>':'<div>'+txt+'</div>')+'<button type="button" class="annx" aria-label="關閉公告">×</button></div>');
    $('.annx',$('#annBar')).addEventListener('click',function(){
      try{sessionStorage.setItem('gw-ann-'+a.id,'1')}catch(_){}
      var b=$('#annBar');if(b)b.remove();
    });
  }catch(e){console.error(e)}
}
/* ---------- 首頁自學教材:一次顯示 4 本,滑鼠移到箭頭或手機左滑可看後面的教材;後台新增的教材排在最後 ---------- */
function homeCarousel(){
  if(PAGE!=='index')return;
  var grid=$('.section .pgrid');if(!grid||grid.getAttribute('data-hc'))return;
  grid.setAttribute('data-hc','1');
  var staticCards={};$$('.pcard',grid).forEach(function(el){staticCards[el.id.replace(/^card-/,'')]=el});
  var list=GW.products.map(function(g,i){return {g:g,i:i,s:(PUB.products[g.id]&&PUB.products[g.id].sort!=null)?PUB.products[g.id].sort:i}})
    .filter(function(o){return o.g.dyn||staticCards[o.g.id]})
    .sort(function(a,b){return a.s-b.s||a.i-b.i});
  var fresh=[];
  list.forEach(function(o){
    if(staticCards[o.g.id]){grid.appendChild(staticCards[o.g.id])}
    else{grid.insertAdjacentHTML('beforeend',productCardHtml(o.g));fresh.push(1)}
  });
  if(fresh.length){bindAdd(grid);syncAddBtns()}
  grid.classList.add('hrow');
  var wrap=document.createElement('div');wrap.className='carousel hcar';
  grid.parentNode.insertBefore(wrap,grid);wrap.appendChild(grid);
  var arrow=function(cls,label,flip){return '<button type="button" class="car-arrow '+cls+'" aria-label="'+label+'"><svg class="ico" style="width:18px;height:18px'+(flip?';transform:rotate(180deg)':'')+'"><use href="#i-arrow"/></svg></button>'};
  wrap.insertAdjacentHTML('beforeend',arrow('l','上一批教材',true)+arrow('r','下一批教材',false));
  var bl=$('.car-arrow.l',wrap),br=$('.car-arrow.r',wrap),raf=0,dir=0;
  function upd(){
    var max=grid.scrollWidth-grid.clientWidth;
    bl.hidden=grid.scrollLeft<=2;br.hidden=max<=2||grid.scrollLeft>=max-2;
  }
  var last=0;
  function step(t){var dt=last?Math.min(50,Math.max(0,t-last)):16;last=t;grid.scrollLeft+=dir*dt*0.5;upd();if(dir)raf=requestAnimationFrame(step)}
  function go(d){if(dir===d)return;dir=d;cancelAnimationFrame(raf);grid.classList.toggle('autoscroll',!!d);if(d){last=0;raf=requestAnimationFrame(step)}}
  [[bl,-1],[br,1]].forEach(function(x){
    var b=x[0],d=x[1];
    b.addEventListener('mouseenter',function(){go(d)});
    b.addEventListener('mouseleave',function(){go(0)});
    b.addEventListener('blur',function(){go(0)});
    b.addEventListener('click',function(){
      go(0);var c=$('.pcard',grid),w=c?c.getBoundingClientRect().width+18:300;
      var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
      grid.scrollBy({left:d*w,behavior:reduce?'auto':'smooth'});
    });
  });
  grid.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  upd();setTimeout(upd,400);
}
async function boot(){
  var url=CONFIG.supabaseUrl,key=CONFIG.supabaseAnonKey;
  if(url&&key&&window.supabase&&window.supabase.createClient){
    sb=window.supabase.createClient(url,key,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
    sb.auth.onAuthStateChange(function(ev,session){
      if(!ready)return;
      setTimeout(async function(){
        if(ev==='SIGNED_OUT'){if(U){U=null;MEM=null;ENR={};CLAIMED={};fire()}}
        else if(ev==='SIGNED_IN'&&session&&(!U||U.id!==session.user.id)){await loadUser(session);fire()}
      },0);
    });
    try{var g=await sb.auth.getSession();await loadUser(g.data&&g.data.session)}catch(e){console.error(e)}
    await loadPublic();
  }
  renderDyn();
  homeCarousel();
  if(PAGE==='index')annBanner();
  onAuth.push(function(){TOUR.hint()});
  ready=true;
  fire();
  var it=takeIntent();
  if(it&&U&&it.act&&INTENT[it.act])INTENT[it.act](it.arg);
}

/* ---------- 付費會員 ---------- */
function initMembership(){
  var st=$('#memStatus');if(!st)return;
  function render(){
    var on=isMember();
    var cancelled=MEM&&MEM.status==='cancelled';
    st.innerHTML=on?'<div class="memstat"><div><b>你目前是付費會員</b><span>'+(MEM.plan?'方案:'+esc(planName(MEM.plan))+'・':'')+(cancelled?'已取消續約,':'')+'有效至 '+fmtDate(MEM.valid_until)+'</span></div><div><a class="btn btn-fill sm" href="live.html">前往直播專區</a> <a class="btn btn-line sm" href="member.html">管理訂閱</a></div></div>':'';
    $$('[data-plan]').forEach(function(b){
      var p=b.getAttribute('data-plan'),pl=PUB.plans[p],cur=on&&!cancelled&&MEM.plan===p,avail=!!(pl&&pl.active&&PUB.pay);
      b.disabled=!ready||!avail||(on&&!cancelled);
      b.textContent=!avail?'即將開放':(cur?'目前方案':(on&&!cancelled?'已是會員':'加入'+planName(p)+'會員'));
      var card=$('#plan-'+p);if(card)card.classList.toggle('cur',cur);
    });
  }
  function confirmPlan(plan){
    var pl=PUB.plans[plan];if(!pl||!pl.active||!PUB.pay){toast('這個方案尚未開放');return}
    var every=pl.period_type==='Y'?'每年':'每月';
    openModal('<h3 id="mTitle">確認加入付費會員</h3><p class="lead">方案:'+esc(pl.name)+'・NT$'+pl.amount.toLocaleString('en-US')+' / '+(pl.period_type==='Y'?'年':'月')+'</p><ul><li>以信用卡定期定額付款,'+every+'自動扣款 NT$'+pl.amount.toLocaleString('en-US')+'。</li><li>卡號只會輸入在綠界科技的付款頁,本站不會經手。</li><li>付款成功後,系統會自動開通付費會員。</li><li>可隨時到「會員專區」取消續約,已付款的期間仍可使用到期。</li></ul><div class="err" id="payErr" role="alert"></div><button type="button" class="btn btn-fill" id="payGo" style="width:100%;margin-top:12px">前往綠界付款</button>',function(){
      $('#payGo').addEventListener('click',function(){checkout({type:'membership',plan:plan},this,$('#payErr'))});
    });
  }
  INTENT.plan=confirmPlan;
  $$('[data-plan]').forEach(function(b){b.addEventListener('click',function(){
    var plan=b.getAttribute('data-plan');
    if(!U){askLogin('登入後即可加入付費會員',{act:'plan',arg:plan});return}
    confirmPlan(plan);
  })});
  onAuth.push(render);render();
}

/* ---------- 直播專區 ---------- */
function liveStatus(e){
  if(!e.starts_at)return 'live';
  var t=new Date(e.starts_at).getTime(),n=Date.now();
  if(n<t-30*6e4)return 'soon';
  return n<=t+3*36e5?'live':'replay';
}
var LIVE_ST={soon:'即將開始',live:'直播中',replay:'回放'};
var VIEWED={};
function initLive(){
  var box=$('#liveMember');if(!box)return;
  var cur=null,items=[];
  function liveSrc(it){return it.url}
  function drawPlayer(){
    var p=$('#livePlayer');if(!p)return;
    var it=items.filter(function(x){return x.e.id===cur})[0];
    if(!it){p.innerHTML='<p class="mfoot">目前沒有可以觀看的場次。</p>';return}
    var y=ytId(it.url),ok=false;try{ok=/^https?:$/.test(new URL(it.url).protocol)}catch(e){}
    var mem=it.e.kind==='member';
    var wm='';if(mem&&U){var t=esc(U.email||U.name||'會員');wm='<div class="lwm" aria-hidden="true">'+new Array(16).join('<span>'+t+'</span>')+'</div>'}
    if(mem&&!it.locked&&!isAdmin()&&!VIEWED[it.e.id]&&sb){VIEWED[it.e.id]=1;sb.rpc('log_live_view',{p_event:it.e.id}).then(function(){},function(){})}
    p.innerHTML='<div class="lframe" id="lframe">'+(y?'<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(y)+'?rel=0&modestbranding=1&playsinline=1'+(mem?'&fs=0':'')+'" title="'+esc(it.e.title)+'" allow="accelerometer; encrypted-media; picture-in-picture'+(mem?'':'; fullscreen')+'"'+(mem?'':' allowfullscreen')+' referrerpolicy="strict-origin-when-cross-origin"></iframe>':'<div class="lframe-alt">'+(ok&&!mem?'<a class="btn btn-gold" target="_blank" rel="noopener noreferrer" href="'+esc(it.url)+'">前往觀看</a>':'<p class="mfoot">這個場次的網址不是 YouTube,請聯絡老師。</p>')+'</div>')+wm+'</div>'+
      '<div class="lmeta"><h3>'+esc(it.e.title)+'</h3><p>'+(mem?'會員限定':'公開')+'・'+LIVE_ST[it.st]+(it.e.starts_at?'・'+esc(fmtDT(it.e.starts_at)):'')+'</p>'+(mem?'<p class="note">畫面會顯示你的帳號作為浮水印,請不要轉傳或錄影外流。<button type="button" class="btn btn-line sm" data-lfs>全螢幕</button></p>':'')+'</div>';
    var fb=$('[data-lfs]',p);if(fb)fb.addEventListener('click',function(){var f=$('#lframe');try{(f.requestFullscreen||f.webkitRequestFullscreen).call(f)}catch(e){}});
  }
  function cardHtml(it){
    var e=it.e,meta='<span class="lb'+(e.kind==='member'?' lb-m':'')+'">'+(e.kind==='member'?'會員限定':'公開')+'</span><span class="lb lb-'+it.st+'">'+LIVE_ST[it.st]+'</span>'+(e.starts_at?'<span class="ld">'+esc(fmtDT(e.starts_at))+'</span>':'');
    if(it.locked)return '<a class="lev locked" href="membership.html"><span class="lt">'+esc(e.title)+'</span><span class="lm">'+meta+'</span><span class="lk">加入付費會員後觀看</span></a>';
    return '<button type="button" class="lev'+(cur===e.id?' on':'')+'" data-lev="'+e.id+'" aria-pressed="'+(cur===e.id)+'"><span class="lt">'+esc(e.title)+'</span><span class="lm">'+meta+'</span></button>';
  }
  function drawList(){
    var act=items.filter(function(x){return x.st!=='replay'}),rep=items.filter(function(x){return x.st==='replay'});
    var h='';
    if(act.length)h+='<h3 class="lh">直播</h3><div class="llist">'+act.map(cardHtml).join('')+'</div>';
    if(rep.length)h+='<h3 class="lh">回放</h3><div class="llist">'+rep.map(cardHtml).join('')+'</div>';
    var l=$('#liveList');l.innerHTML=h;
    $$('[data-lev]',l).forEach(function(b){b.addEventListener('click',function(){recheck();cur=+b.getAttribute('data-lev');drawList();drawPlayer();var pl=$('#livePlayer');if(pl&&pl.scrollIntoView)pl.scrollIntoView({block:'nearest',behavior:'smooth'})})});
  }
  async function board(){
    var wrap=$('#liveBoard'),body=$('#liveBoardBody');if(!wrap||!ready||!sb)return;
    var er=await sb.from('live_events').select('id,title,starts_at,created_at,kind,public_url,replay_url').order('starts_at',{ascending:false,nullsFirst:true}).limit(60);
    var days=PUB.liveDays,evs=(er.data||[]).filter(function(e){
      if(!(days>0))return true;var t=new Date(e.starts_at||e.created_at).getTime();return !(t<Date.now()-days*864e5)});
    var can=isMember()||isAdmin(),lm={};
    if(can&&evs.length){var lr=await sb.from('live_links').select('event_id,url,replay_url').in('event_id',evs.map(function(e){return e.id}));(lr.data||[]).forEach(function(x){lm[x.event_id]=x})}
    items=[];
    evs.forEach(function(e){
      var st=liveStatus(e),url=null,locked=false;
      if(e.kind==='public'){url=(st==='replay'&&e.replay_url)||e.public_url;if(!url)return}
      else if(can){var l=lm[e.id];if(!l)return;url=(st==='replay'&&l.replay_url)||l.url}
      else locked=true;
      items.push({e:e,st:st,url:url,locked:locked});
    });
    var act=items.filter(function(x){return x.st!=='replay'}).sort(function(a,b){return new Date(a.e.starts_at||0)-new Date(b.e.starts_at||0)});
    var rep=items.filter(function(x){return x.st==='replay'});
    items=act.concat(rep);
    wrap.hidden=!items.length;
    if(!items.length)return;
    var ok=items.filter(function(x){return !x.locked});
    if(!ok.some(function(x){return x.e.id===cur}))cur=ok.length?ok[0].e.id:null;
    body.innerHTML='<div class="lboard"><div id="livePlayer" class="lplay" aria-live="polite"></div><div id="liveList" class="lsel"></div></div>';
    drawList();drawPlayer();
  }
  async function render(){
    if(!ready)return;
    if(!(isMember()||isAdmin())){
      box.innerHTML='<h3>會員限定直播</h3><p>只開放給付費會員。尚未加入的人看不到直播連結。</p><a class="btn btn-gold" href="membership.html">了解付費會員 '+ico('i-arrow')+'</a><p class="note">在本網站付款,付款成功後自動開通。</p>';return;
    }
    box.innerHTML='<h3>會員限定直播</h3><p>你是付費會員,可以直接在下方「直播與回放」觀看會員場次與回放。</p><a class="btn btn-gold" href="#liveBoard">前往觀看 '+ico('i-arrow')+'</a><p class="note">請不要把直播連結轉傳給他人。</p>';
  }
  /* 站內保障:定期重新向資料庫確認會員資格,過期或被老師停用就立刻收掉會員播放器 */
  var rcBusy=false;
  async function recheck(){
    if(rcBusy||!ready||!U||!sb)return;rcBusy=true;
    try{
      var was=isMember()||isAdmin(),r=await sb.from('profiles').select('role').eq('id',U.id).maybeSingle();
      if(r&&r.data)U.role=r.data.role;
      await loadMine();
      if(was!==(isMember()||isAdmin())){render();board()}
    }catch(e){}
    rcBusy=false;
  }
  setInterval(recheck,3*60*1000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)recheck()});
  window.addEventListener('focus',recheck);
  onAuth.push(function(){render();board()});render();board();
}

/* ---------- 課程資訊 ---------- */
async function enrollCourse(cid){
  var c=PUB.courses[cid];if(!c)return false;
  if(c.price>0){await checkout({type:'course',course:cid});return false}
  var r=await sb.rpc('enroll_free',{p_course:cid});
  if(r.error){toast(niceErr(r.error));return false}
  ENR[cid]=true;return true;
}
function initCourse(){
  var btn=$('#enrollBtn');if(!btn)return;var cid=btn.getAttribute('data-course'),c=byId(GW.courses,cid);if(!cid||!c)return;
  function render(){
    var db=PUB.courses[cid],en=!!ENR[cid]&&!!U;
    if(!ready){btn.disabled=true;btn.textContent='載入中…';return}
    if(en){btn.disabled=false;btn.textContent='已報名(前往學習環境)';return}
    if(!db||(db.status!=='open'&&!isAdmin())){btn.disabled=true;btn.textContent='課程籌備中';return}
    if(db.price>0&&!PUB.pay){btn.disabled=true;btn.textContent='課程付款尚未開放';return}
    btn.disabled=false;btn.textContent=db.price>0?'購買課程 NT$'+db.price.toLocaleString('en-US'):'免費報名';
  }
  INTENT.enroll=async function(){if(await enrollCourse(cid)){toast('已報名「'+c.name+'」');setTimeout(function(){location.href=c.learn},500)}};
  btn.addEventListener('click',async function(){
    if(ENR[cid]&&U){location.href=c.learn;return}
    if(!U){askLogin('登入後即可報名「'+c.name+'」',{act:'enroll',arg:cid});return}
    btn.disabled=true;
    if(await enrollCourse(cid)){toast('已報名「'+c.name+'」');setTimeout(function(){location.href=c.learn},500)}
    render();
  });
  var sh=$('#shareBtn');
  if(sh)sh.addEventListener('click',function(){
    var url=location.href.split('#')[0];
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){toast('已複製課程連結')},function(){toast('請手動複製網址列連結')})}
    else toast('請手動複製網址列連結');
  });
  onAuth.push(render);render();
}

/* ---------- 學習環境 ---------- */
function ytId(v){
  v=String(v||'').trim();
  var m=v.match(/(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([A-Za-z0-9_-]{6,20})/);
  if(m)return m[1];
  return /^[A-Za-z0-9_-]{6,20}$/.test(v)?v:'';
}
function initLearn(){
  var app=$('#learnApp');if(!app)return;var cid=app.getAttribute('data-course'),c=byId(GW.courses,cid);if(!cid||!c)return;
  var cur=0,panelOn=true,chapters=null,vids={},progT=null,drawn=false;
  function gate(kind){
    var db=PUB.courses[cid],open=db&&db.status==='open';
    var t,b,btnTxt;
    if(!ready){app.innerHTML='<div class="gate"><p>載入中…</p></div>';return}
    if(!U){t='請先登入並報名課程';btnTxt='使用 Google 帳號登入'}
    else if(!open){t='課程籌備中';btnTxt=''}
    else if(db.price>0&&!PUB.pay){t='課程付款尚未開放';btnTxt=''}
    else{t='報名後即可進入學習環境';btnTxt=db.price>0?'購買課程 NT$'+db.price.toLocaleString('en-US'):'免費報名'}
    app.innerHTML='<div class="gate"><svg class="ico" style="width:34px;height:34px;color:var(--bronze-text);margin:0 auto 8px"><use href="#i-lock"/></svg><h2>'+t+'</h2><p>「'+esc(c.name)+'」為預錄影片課程,報名後在這裡依章節學習。</p>'+(btnTxt?'<button type="button" class="btn btn-fill" id="gateBtn">'+btnTxt+'</button> ':'')+'<a class="btn btn-line" href="'+c.url+'">回課程資訊</a></div>';
    var g=$('#gateBtn');
    if(g)g.addEventListener('click',async function(){
      if(!U){askLogin('登入後即可報名「'+c.name+'」',{act:'enroll',arg:cid});return}
      g.disabled=true;
      if(await enrollCourse(cid)){drawn=false;render()}else g.disabled=false;
    });
  }
  async function load(){
    var ch=await sb.from('course_chapters').select('id,position,title,is_preview').eq('course_id',cid).order('position');
    chapters=(ch.data||[]).map(function(x){return {id:x.id,title:x.title}});
    if(!chapters.length)chapters=c.chaps.map(function(t){return {id:null,title:t}});
    var ids=chapters.map(function(x){return x.id}).filter(Boolean);
    vids={};
    if(ids.length){var v=await sb.from('chapter_videos').select('chapter_id,youtube_id').in('chapter_id',ids);(v.data||[]).forEach(function(x){vids[x.chapter_id]=x.youtube_id})}
    var p=await sb.from('progress').select('position').eq('user_id',U.id).eq('course_id',cid).maybeSingle();
    cur=Math.max(0,Math.min((p.data&&p.data.position)||0,chapters.length-1));
  }
  function saveProg(){
    clearTimeout(progT);
    progT=setTimeout(function(){sb.from('progress').upsert({user_id:U.id,course_id:cid,position:cur,updated_at:new Date().toISOString()},{onConflict:'user_id,course_id'}).then(function(){},function(){})},600);
  }
  function player(){
    app.innerHTML='<div class="lp-bar"><h2>'+esc(c.name)+'</h2><div><button type="button" class="btn btn-line sm" id="lToggle" aria-expanded="'+panelOn+'">章節清單</button> <a class="btn btn-line sm" href="'+c.url+'">課程資訊</a></div></div>'+
     '<div class="lp-grid'+(panelOn?'':' nopanel')+'" id="lpg"><div><div class="vid" id="vid"></div><div class="lp-nav"><button type="button" class="btn btn-line sm" id="lPrev">上一章</button><span id="lPos" style="font-size:13px;color:var(--text-soft)"></span><button type="button" class="btn btn-fill sm" id="lNext">下一章</button></div></div>'+
     '<aside class="lpanel" aria-label="章節與字幕"><div class="tabs" role="tablist"><button type="button" role="tab" id="lt1">課程章節</button><button type="button" role="tab" id="lt2">字幕</button></div><div class="chaps" id="chaps"></div><div class="subs" id="subs" hidden>字幕請在影片播放器右下角的「CC」按鈕開啟。</div></aside></div>';
    function draw(){
      $('#chaps').innerHTML=chapters.map(function(t,i){return '<button type="button" class="chap" data-ch="'+i+'" aria-current="'+(i===cur)+'"><i>'+String(i+1).padStart(2,'0')+'</i><span>'+esc(t.title)+'</span></button>'}).join('');
      $$('[data-ch]',app).forEach(function(b){b.addEventListener('click',function(){cur=+b.getAttribute('data-ch');saveProg();draw()})});
      var yid=chapters[cur].id&&vids[chapters[cur].id];
      $('#vid').innerHTML=yid?'<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(yid)+'?rel=0&modestbranding=1&playsinline=1" title="'+esc(chapters[cur].title)+'" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>':
        scene(80+(cid==='guoxie'?0:1),{amp:.8,sun:true,sunx:520,suny:90})+'<div class="cap"><small>第 '+(cur+1)+' 章</small>'+esc(chapters[cur].title)+'・影片準備中</div>';
      $('#lPos').textContent='第 '+(cur+1)+' / '+chapters.length+' 章';
      $('#lPrev').disabled=cur===0;$('#lNext').disabled=cur===chapters.length-1;
    }
    function selTab(n){$('#lt1').setAttribute('aria-selected',n===1);$('#lt2').setAttribute('aria-selected',n===2);$('#chaps').hidden=n!==1;$('#subs').hidden=n!==2}
    $('#lt1').addEventListener('click',function(){selTab(1)});$('#lt2').addEventListener('click',function(){selTab(2)});
    $('#lPrev').addEventListener('click',function(){if(cur>0){cur--;saveProg();draw()}});
    $('#lNext').addEventListener('click',function(){if(cur<chapters.length-1){cur++;saveProg();draw()}});
    $('#lToggle').addEventListener('click',function(){panelOn=!panelOn;$('#lpg').classList.toggle('nopanel',!panelOn);this.setAttribute('aria-expanded',panelOn)});
    selTab(1);draw();
  }
  async function render(){
    if(!ready){gate();return}
    if(!U||!(ENR[cid]||isAdmin())){drawn=false;gate();return}
    if(drawn)return;
    app.innerHTML='<div class="gate"><p>載入課程…</p></div>';
    try{await load();drawn=true;player()}catch(e){app.innerHTML='<div class="gate"><p>讀取失敗,請重新整理頁面。</p></div>'}
  }
  onAuth.push(render);render();
}

/* ---------- 購物車與結帳 ---------- */
var RC_KEY='gw-rcpt';
function loadRc(){try{return JSON.parse(localStorage.getItem(RC_KEY))||{}}catch(e){return {}}}
function saveRc(o){try{localStorage.setItem(RC_KEY,JSON.stringify(o))}catch(e){}}
function initCart(){
  var app=$('#cartApp');if(!app)return;
  function render(){
    var ids=Object.keys(S.cart).filter(function(id){return byId(GW.products,id)});
    if(!ids.length){app.innerHTML='<div class="empty" style="max-width:520px;margin:20px auto"><b>卷</b>購物車還是空的<br><a class="btn btn-fill" style="margin-top:16px" href="materials.html">逛逛自學教材</a></div>';return}
    var rc=loadRc();
    var gone=ids.filter(function(id){return PUB.products[id]&&!PUB.products[id].active});
    var needShip=ids.some(function(id){return !PUB.products[id]||PUB.products[id].kind==='physical'});
    app.innerHTML='<div class="cp"><div class="cp-list" id="cpl">'+ids.map(function(id){var p=byId(GW.products,id);
      return '<div class="ci"><a href="'+p.url+'"><img src="'+esc(p.coverUrl||(p.cover?'images/'+p.cover:'images/favicon.png'))+'" alt="'+esc(p.title)+' 封面"></a><div><b>'+esc(p.name)+'</b><small>'+money(p.price)+'</small><div class="qty"><button type="button" data-dec="'+id+'" aria-label="減少數量">−</button><span>'+S.cart[id]+'</span><button type="button" data-inc="'+id+'" aria-label="增加數量">+</button></div></div><button type="button" class="rm" data-rm="'+id+'">移除</button></div>'}).join('')+
      '</div><aside class="cp-sum"><h2>訂單摘要</h2>'+ids.map(function(id){var p=byId(GW.products,id);return '<div class="row"><span>'+esc(p.name)+' × '+S.cart[id]+'</span><span>'+money(p.price*S.cart[id])+'</span></div>'}).join('')+'<div class="row total"><span>合計</span><span>'+money(cartSum())+'</span></div>'+
      (needShip&&PUB.pay?'<div class="rcpt"><h3>收件資料</h3><label class="fld" for="rName">收件人<input id="rName" autocomplete="name" maxlength="30" value="'+esc(rc.name||'')+'"></label><label class="fld" for="rPhone">手機<input id="rPhone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" value="'+esc(rc.phone||'')+'"></label><label class="fld" for="rAddr">收件地址<input id="rAddr" autocomplete="street-address" maxlength="120" value="'+esc(rc.address||'')+'"></label></div>':'')+
      (PUB.pay?'<label class="fld" for="rNote">備註(選填)<input id="rNote" maxlength="100" value="'+esc(rc.note||'')+'"></label>':'')+
      (gone.length?'<p class="err">購物車內有已下架的教材,請先移除。</p>':'')+
      '<div class="err" id="cartErr" role="alert"></div>'+(PUB.pay?'<button type="button" class="btn btn-fill" id="goPay"'+(gone.length?' disabled':'')+'>前往付款</button>':'<p class="paynote" id="noPay">線上付款即將開放。現在想訂購,請先透過 LINE 聯繫我們,我們會協助你完成。</p><button type="button" class="btn btn-fill" data-ext="lineUrl" id="lineOrder">用 LINE 聯繫訂購</button>')+(PUB.pay?'<div class="pay"><span>信用卡</span><span>超商繳費</span><span>ATM 轉帳</span></div><p class="mfoot">按下「前往付款」後,會轉到綠界科技的付款頁面,可用方式以該頁顯示為準。教材為實體書籍,付款成功後會寄到上方地址。</p>':'')+'</aside></div>';
    $$('[data-inc]',app).forEach(function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-inc');if(S.cart[id]<20)S.cart[id]++;save();refreshBadge();render()})});
    $$('[data-dec]',app).forEach(function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-dec');S.cart[id]--;if(S.cart[id]<1)delete S.cart[id];save();refreshBadge();render()})});
    $$('[data-rm]',app).forEach(function(b){b.addEventListener('click',function(){delete S.cart[b.getAttribute('data-rm')];save();refreshBadge();render()})});
    function readRc(){return {name:($('#rName')||{}).value||'',phone:($('#rPhone')||{}).value||'',address:($('#rAddr')||{}).value||'',note:($('#rNote')||{}).value||''}}
    ['rName','rPhone','rAddr','rNote'].forEach(function(id){var el=$('#'+id);if(el)el.addEventListener('input',function(){saveRc(readRc())})});
    var lo=$('#lineOrder');if(lo)lo.addEventListener('click',function(){ext('lineUrl')});
    var gp=$('#goPay');if(gp)gp.addEventListener('click',function(){
      var r=readRc(),err=$('#cartErr');err.textContent='';
      if(!U){askLogin('登入後即可結帳(購物車與收件資料會保留)');return}
      if(needShip){
        if(r.name.trim().length<2){err.textContent='請填寫收件人姓名。';return}
        if(!/^[0-9+\-\s()]{8,20}$/.test(r.phone.trim())){err.textContent='請填寫正確的手機號碼。';return}
        if(r.address.trim().length<6){err.textContent='請填寫完整的收件地址。';return}
      }
      checkout({type:'cart',items:ids.map(function(id){return {id:id,qty:S.cart[id]}}),recipient:needShip?{name:r.name.trim(),phone:r.phone.trim(),address:r.address.trim()}:undefined,note:r.note.trim()||undefined},this,err);
    });
  }
  onAuth.push(render);render();
}

/* ---------- 免費資源 ---------- */
function initRes(){
  var btns=$$('[data-res]');if(!btns.length)return;
  function render(){btns.forEach(function(b){
    var id=b.getAttribute('data-res'),gated=b.getAttribute('data-gate')==='1',tagEl=$('#tag-'+id);
    if(!gated)return;
    var done=!!CLAIMED[id];
    b.firstChild.nodeValue=done?'下載 ':(U?'立即領取 ':'加入會員領取 ');
    b.classList.toggle('done',done);
    if(tagEl)tagEl.textContent=U?(done?'已領取':'已解鎖'):'會員限定';
  })}
  async function download(id){
    var r=PUB.resources[id];
    if(!r||!r.storage_path){toast('檔案還在準備中,上傳後會在這裡提供下載');return}
    var s=await sb.storage.from('resources').createSignedUrl(r.storage_path,120);
    if(s.error||!s.data){toast('下載失敗,請稍後再試');return}
    window.open(s.data.signedUrl,'_blank','noopener');
  }
  async function claim(id){
    if(!CLAIMED[id]){
      var r=await sb.from('resource_claims').insert({user_id:U.id,resource_id:id});
      if(r.error&&!/duplicate/i.test(r.error.message||'')){toast(niceErr(r.error));return}
      CLAIMED[id]=true;render();toast('已加入你的資源');
    }
    await download(id);
  }
  INTENT.claim=claim;
  btns.forEach(function(b){b.addEventListener('click',function(){
    var id=b.getAttribute('data-res');
    if(b.getAttribute('data-gate')!=='1'){window.open(b.getAttribute('data-href'),'_blank','noopener');return}
    if(!U){askLogin('登入後即可領取這份資源',{act:'claim',arg:id});return}
    claim(id);
  })});
  onAuth.push(render);render();
}

/* ---------- 作文:共用 ---------- */
var upFiles=[],upUrls=[],MAXF=6,MAXMB=10;
var OK_MIME={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
function clearThumbs(){upUrls.forEach(function(u){URL.revokeObjectURL(u)});upUrls=[];upFiles=[]}
function checkFile(f,list){
  if(!OK_MIME[f.type])return /\.(heic|heif)$/i.test(f.name)||/heic|heif/.test(f.type)?'「'+f.name+'」是 HEIC 格式,請改用 JPG 或 PNG(iPhone 可從相簿直接選取,系統會自動轉成 JPG)。':'只能上傳 JPG、PNG 或 WebP 圖片。';
  if(f.size>MAXMB*1024*1024)return '「'+f.name+'」超過 '+MAXMB+' MB,請縮小後再上傳。';
  if(list.length>=MAXF)return '最多上傳 '+MAXF+' 張。';
  return '';
}
var uuid=function(){return (window.crypto&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return (c==='x'?r:(r&3|8)).toString(16)})};
/* 建立作文 + 上傳照片。失敗會自動清除半成品 */
async function submitEssay(row,files,kindPrefix){
  var id=uuid();
  var ins=await sb.from('essays').insert(Object.assign({id:id},row));
  if(ins.error)throw ins.error;
  var paths=[];
  try{
    for(var i=0;i<files.length;i++){
      var path=id+'/submission-'+(i+1)+'.'+OK_MIME[files[i].type];
      var up=await sb.storage.from('essays').upload(path,files[i],{contentType:files[i].type,upsert:false});
      if(up.error)throw up.error;
      paths.push(path);
    }
    var fr=await sb.from('essay_files').insert(paths.map(function(p,i){return {essay_id:id,path:p,page_no:i+1,kind:'submission'}}));
    if(fr.error)throw fr.error;
  }catch(e){
    try{if(paths.length)await sb.storage.from('essays').remove(paths)}catch(_){}
    try{await sb.from('essays').delete().eq('id',id)}catch(_){}
    throw e;
  }
  return id;
}
async function signedMap(paths){
  var out={};if(!paths.length)return out;
  var r=await sb.storage.from('essays').createSignedUrls(paths,3600);
  (r.data||[]).forEach(function(x){if(x&&x.signedUrl)out[x.path]=x.signedUrl});
  return out;
}
var STATUS_ES={pending:'待批改',graded:'已批改'};
/* 作文自動辨識:先交給後端(Google 辨識,每月有額度);額度用完或失敗時,改用瀏覽器內的免費辨識(Tesseract.js) */
var TESS_URL='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
function loadTess(){
  if(window.Tesseract)return Promise.resolve(window.Tesseract);
  return new Promise(function(res,rej){var s=document.createElement('script');s.src=TESS_URL;s.onload=function(){window.Tesseract?res(window.Tesseract):rej(new Error('tess'))};s.onerror=function(){rej(new Error('tess'))};document.head.appendChild(s)});
}
function cleanOcr(t){
  var C='[\\u3400-\\u9fff\\uf900-\\ufaff\\u3000-\\u303f\\uff00-\\uffef\\u2014\\u2026,.;:!?]';
  t=String(t||'').replace(/\r/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n[ \t]+/g,'\n');
  t=t.replace(new RegExp('('+C+')[ \\t]+(?='+C+')','g'),'$1');
  t=t.replace(new RegExp('('+C+')[ \\t]*\\n(?='+C+')','g'),'$1');
  return t.replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
async function clientOcr(id,say){
  var f=await sb.from('essay_files').select('path,page_no').eq('essay_id',id).eq('kind','submission').order('page_no');
  var rows=(f.data||[]).filter(function(r){return /\.(jpe?g|png|webp)$/i.test(r.path)}).slice(0,8);
  if(!rows.length)return '';
  var sm=await signedMap(rows.map(function(r){return r.path}));
  if(say)say('載入辨識工具…');
  var T=await loadTess(),w=await T.createWorker('chi_tra'),out=[];
  try{
    for(var i=0;i<rows.length;i++){
      if(!sm[rows[i].path])continue;
      if(say)say('簡易辨識中('+(i+1)+'/'+rows.length+')…');
      var r=await w.recognize(sm[rows[i].path]);
      var cf=(r&&r.data&&typeof r.data.confidence==='number')?r.data.confidence:0;
      /* 手寫、直書或稿紙格線的照片,簡易辨識會變成亂碼;信心不足就不採用,避免學生看到一堆錯字 */
      if(cf>=65)out.push(cleanOcr(r&&r.data&&r.data.text));
    }
  }finally{try{await w.terminate()}catch(_){}}
  return out.filter(Boolean).join('\n');
}
function transcribeEssay(id,say){
  return (async function(){
    try{
      var r=await sb.functions.invoke('transcribe-essay',{body:{essay_id:id}});
      if(r&&r.error)return false;
      var d=r&&r.data;
      if(d&&d.fallback==='client'){
        var txt=await clientOcr(id,say);
        if(!txt)return false;
        var r2=await sb.functions.invoke('transcribe-essay',{body:{essay_id:id,save_text:txt}});
        return !(r2&&r2.error);
      }
      return true;
    }catch(_){return false}
  })();
}
var TX_NOTE={vision:'由 Google 文字辨識自動轉出,可能有誤字,以照片為準。',tesseract:'由瀏覽器簡易辨識轉出,錯字會比較多,以照片為準,老師會再校正。',manual:'老師已校正。'};
var UNSEEN=0;
async function fetchMyEssays(){
  var r=await sb.from('essays').select('id,title,grade,status,feedback,created_at,graded_at,score,score_max,student_seen_at,transcript,transcript_status,transcript_engine,essay_files(path,kind,page_no)').eq('student_id',U.id).order('created_at',{ascending:false});
  return r.data||[];
}
function scoreTx(e){return e&&e.score!=null&&e.score_max!=null?(+e.score)+' / '+(+e.score_max):''}
function dateShort(t){var d=new Date(t);return (d.getMonth()+1)+'/'+d.getDate()}

function initEssay(){
  var p=$('#uPanel');if(!p)return;
  var seq=0;
  async function listMine(){
    var box=$('#myEssays');if(!box)return;
    if(!U){box.innerHTML='<li class="none">登入後可以看到你的上傳紀錄</li>';return}
    var my=++seq,es=await fetchMyEssays();if(my!==seq)return;
    var gp=[];es.forEach(function(e){if(e.status==='graded')e.essay_files.forEach(function(f){if(f.kind==='feedback')gp.push(f.path)})});
    var sm=gp.length?await signedMap(gp):{};if(my!==seq)return;
    if(es.some(function(x){return x.status==='graded'&&!x.student_seen_at})){sb.rpc('mark_essays_seen').then(function(){UNSEEN=0})}
    box.innerHTML=es.length?es.map(function(e){var n=e.essay_files.filter(function(f){return f.kind==='submission'}).length;
      var fb=e.status==='graded'?'<div class="fbk"><b>老師評語</b><p>'+esc(e.feedback||'(老師已批改,沒有文字評語)').replace(/\n/g,'<br>')+'</p>'+e.essay_files.filter(function(f){return f.kind==='feedback'&&sm[f.path]}).sort(function(a,b){return a.page_no-b.page_no}).map(function(f){return '<a href="'+sm[f.path]+'" target="_blank" rel="noopener"><img src="'+sm[f.path]+'" alt="老師批改照片" loading="lazy"></a>'}).join('')+'</div>':'';
      return '<li class="col"><div class="l1"><span>'+esc(e.title)+'('+esc(e.grade||'')+'・'+n+' 張・'+dateShort(e.created_at)+')</span><em>'+(e.status==='graded'&&!e.student_seen_at?'<span class="newpill">新批改</span>':'')+STATUS_ES[e.status]+(scoreTx(e)?'・'+scoreTx(e)+' 分':'')+'</em></div>'+fb+'</li>'}).join(''):'<li class="none">還沒有上傳紀錄</li>';
  }
  function render(){
    if(!ready){p.innerHTML='<h3>上傳作文</h3><p class="lead">載入中…</p>';return}
    if(!U){
      clearThumbs();
      p.innerHTML='<h3>上傳作文</h3><p class="lead">登入後即可上傳,上傳的作文僅供本人與老師查看。</p><div class="lockmask"><svg class="ico" style="width:32px;height:32px;color:var(--bronze-text)"><use href="#i-lock"/></svg><p>請先使用 Google 帳號登入</p><button type="button" class="btn btn-fill" id="upLogin">使用 Google 帳號登入</button></div>';
      $('#upLogin').addEventListener('click',function(){askLogin('登入後即可上傳作文')});
      listMine();return;
    }
    p.innerHTML='<h3>上傳作文</h3><p class="lead">上傳的作文僅供本人與老師查看。</p>'+
     '<form id="upForm" novalidate><div class="row2"><label class="fld" for="upTitle">作文題目<input id="upTitle" placeholder="例如:溫暖的心" maxlength="60"></label><label class="fld" for="upGrade">年級<select id="upGrade"><option>國一</option><option>國二</option><option>國三</option><option>高一</option><option>高二</option><option selected>高三</option><option>其他</option></select></label></div>'+
     '<label class="drop" id="drop" for="upFile">'+ico('i-upload')+'<span><b>點選選擇照片</b>,或把照片拖曳到這裡</span><span style="font-size:12.5px">最多 '+MAXF+' 張・每張 '+MAXMB+' MB 以內・JPG / PNG / WebP</span><input id="upFile" type="file" accept="image/jpeg,image/png,image/webp" multiple></label>'+
     '<div class="thumbs" id="thumbs"></div>'+
     '<div class="tips"><span>光線充足</span><span>整頁入鏡</span><span>避免反光與陰影</span><span>依頁碼順序上傳</span></div>'+
     '<label class="fld" for="upNote" style="margin-top:8px">給老師的話(選填)<textarea id="upNote" maxlength="500" placeholder="例如:想加強結尾的收束"></textarea></label>'+
     '<div class="err" id="upErr" role="alert"></div><button class="btn btn-fill" type="submit" id="upGo">送出批改</button></form>';
    var inp=$('#upFile'),drop=$('#drop');
    function drawThumbs(){
      $('#thumbs').innerHTML=upUrls.map(function(u,i){return '<div class="th"><img src="'+u+'" alt="作文第 '+(i+1)+' 頁"><button type="button" data-rmf="'+i+'" aria-label="移除第 '+(i+1)+' 張">×</button></div>'}).join('');
      $$('[data-rmf]',p).forEach(function(b){b.addEventListener('click',function(){var i=+b.getAttribute('data-rmf');URL.revokeObjectURL(upUrls[i]);upUrls.splice(i,1);upFiles.splice(i,1);drawThumbs()})});
    }
    function addFiles(list){
      var err=$('#upErr');err.textContent='';
      Array.prototype.forEach.call(list,function(f){var m=checkFile(f,upFiles);if(m){err.textContent=m;return}upFiles.push(f);upUrls.push(URL.createObjectURL(f))});
      drawThumbs();
    }
    inp.addEventListener('change',function(){addFiles(inp.files);inp.value=''});
    ['dragenter','dragover'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add('over')})});
    ['dragleave','drop'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove('over')})});
    drop.addEventListener('drop',function(e){if(e.dataTransfer)addFiles(e.dataTransfer.files)});
    drawThumbs();
    $('#upForm').addEventListener('submit',async function(e){
      e.preventDefault();var err=$('#upErr'),t=$('#upTitle').value.trim(),go=$('#upGo');
      if(!t){err.textContent='請填寫作文題目。';return}
      if(!upFiles.length){err.textContent='請至少上傳一張作文照片。';return}
      go.disabled=true;go.textContent='上傳中…';err.textContent='';
      try{
        var newId=await submitEssay({student_id:U.id,created_by:U.id,source:'student',title:t,grade:$('#upGrade').value,note:$('#upNote').value.trim()||null,status:'pending'},upFiles);
        transcribeEssay(newId);
        var n=upFiles.length;clearThumbs();render();toast('已收到「'+t+'」共 '+n+' 張,老師批改後可在會員專區查看');
      }catch(ex){err.textContent='上傳失敗:'+niceErr(ex);go.disabled=false;go.textContent='送出批改'}
    });
    listMine();
  }
  onAuth.push(render);render();
}

/* ---------- 會員專區 ---------- */
var FUL={none:'',to_ship:'準備寄出',shipped:'已寄出',done:'已完成'};
var ORD_ST={pending:'待付款',paid:'已付款',failed:'付款失敗',cancelled:'已取消'};
var ORD_KIND={product:'教材',course:'課程',membership:'付費會員'};
/* ---------- 新用戶導覽與新手任務 ---------- */
var TOUR={
  shown:false,on:false,
  key:function(){return 'gw-tour-'+(U?U.id:'')},
  done:function(){
    if(U&&U.toured)return true;
    try{return !!localStorage.getItem(this.key())}catch(_){return false}
  },
  mark:function(){
    if(!U)return;U.toured=true;
    try{localStorage.setItem(this.key(),'1')}catch(_){}
    try{if(sb&&sb.auth&&sb.auth.updateUser)sb.auth.updateUser({data:{gw_toured:true}}).catch(function(){})}catch(_){}
  },
  steps:function(){
    return [
      {sel:'.profile',t:'歡迎來到會員專區',x:'這裡是你的個人頁面。花不到一分鐘,帶你看看每個功能在哪裡。'},
      {sel:'[data-t=c]',t:'我的課程',x:'報名後的線上課程會列在這裡,點進去就能開始看影片。老師發的最新公告也會顯示在這一頁最上方。'},
      {sel:'[data-t=e]',t:'我的作文',x:'拍下手寫作文上傳,老師批改後,分數和評語會出現在這裡,有新批改時分頁會亮起提示。'},
      {sel:'[data-t=r]',t:'我的資源',x:'在「免費資源」領取的講義與檔案都收在這裡,隨時可以重新下載。'},
      {sel:'[data-t=o]',t:'我的訂單',x:'購買教材、課程與會員的紀錄,以及教材的出貨狀態,都可以在這裡查看。'},
      {sel:'[data-t=a]',t:'帳號與手機通知',x:'建議在這裡開啟手機通知:作文批改完成、直播開始前,手機都會提醒你。想重看這份導覽,也在這一頁。'},
      {sel:'.nav',t:'網站主選單',x:'上方選單可以前往免費資源、自學教材、線上課程與直播專區。手機版請點右上角選單。'}
    ];
  },
  start:function(){
    if(this.on)return;
    var self=this,steps=this.steps(),i=0,prev=document.activeElement;
    this.on=true;
    var ov=document.createElement('div');ov.className='tour';
    ov.innerHTML='<div class="tour-hole" aria-hidden="true"></div><div class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tourT" tabindex="-1"><div class="tour-dots" aria-hidden="true"></div><b id="tourT"></b><p id="tourX"></p><div class="tour-act"><button type="button" class="more" data-tskip>略過導覽</button><span><button type="button" class="btn btn-line sm" data-tprev>上一步</button> <button type="button" class="btn btn-fill sm" data-tnext>下一步</button></span></div></div>';
    document.body.appendChild(ov);
    var hole=$('.tour-hole',ov),card=$('.tour-card',ov);
    function target(){var st=steps[i],el=st.sel?$(st.sel):null;return el&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0?el:null}
    function place(){
      var el=target(),vw=window.innerWidth,vh=window.innerHeight,cw=card.offsetWidth,ch=card.offsetHeight,top,left;
      if(!el){ov.classList.add('nohole');top=Math.max(12,(vh-ch)/2);left=Math.max(12,(vw-cw)/2)}
      else{
        ov.classList.remove('nohole');
        var r=el.getBoundingClientRect(),pd=6;
        hole.style.cssText='top:'+(r.top-pd)+'px;left:'+(r.left-pd)+'px;width:'+(r.width+pd*2)+'px;height:'+(r.height+pd*2)+'px';
        top=r.bottom+pd+12;
        if(top+ch>vh-12)top=r.top-pd-12-ch;
        if(top<12)top=Math.max(12,Math.min(vh-ch-12,(vh-ch)/2));
        left=Math.min(Math.max(12,r.left+r.width/2-cw/2),vw-cw-12);
      }
      card.style.top=top+'px';card.style.left=left+'px';
    }
    function show(n){
      i=n;var st=steps[i],el=st.sel?$(st.sel):null;
      if(el&&el.getBoundingClientRect().width>0){try{el.scrollIntoView({block:'center',inline:'nearest'})}catch(_){}}
      $('#tourT',ov).textContent=st.t;$('#tourX',ov).textContent=st.x;
      $('.tour-dots',ov).innerHTML=steps.map(function(_,k){return '<i'+(k===i?' class="on"':'')+'></i>'}).join('');
      $('[data-tprev]',ov).hidden=i===0;
      $('[data-tnext]',ov).textContent=i===steps.length-1?'開始使用':'下一步 ('+(i+1)+'/'+steps.length+')';
      place();
      try{$('[data-tnext]',ov).focus({preventScroll:true})}catch(_){}
    }
    function end(){
      document.removeEventListener('keydown',key,true);window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);
      ov.remove();self.on=false;self.mark();
      try{if(prev&&prev.focus&&document.contains(prev))prev.focus({preventScroll:true})}catch(_){}
    }
    function key(e){
      if(e.key==='Escape'){e.preventDefault();end()}
      else if(e.key==='ArrowRight'&&i<steps.length-1){show(i+1)}
      else if(e.key==='ArrowLeft'&&i>0){show(i-1)}
      else if(e.key==='Tab'){
        var f=$$('button:not([hidden])',card);if(!f.length)return;
        var a=document.activeElement,k=f.indexOf(a);
        if(e.shiftKey&&(k<=0)){e.preventDefault();f[f.length-1].focus()}
        else if(!e.shiftKey&&(k===f.length-1||k<0)){e.preventDefault();f[0].focus()}
      }
    }
    $('[data-tskip]',ov).addEventListener('click',end);
    $('[data-tprev]',ov).addEventListener('click',function(){if(i>0)show(i-1)});
    $('[data-tnext]',ov).addEventListener('click',function(){if(i<steps.length-1)show(i+1);else end()});
    document.addEventListener('keydown',key,true);window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
    show(0);
  },
  maybeStart:function(){
    if(this.shown||this.on)return;
    var force=false;try{force=/(^|[?&])tour=1(&|$)/.test(location.search)}catch(_){}
    if(!force&&(this.done()||isAdmin()))return;
    this.shown=true;
    if(force){try{history.replaceState(null,'',location.pathname)}catch(_){}}
    var self=this;setTimeout(function(){self.start()},450);
  },
  hideKey:function(){return 'gw-start-hide-'+(U?U.id:'')},
  cardHidden:function(){try{return !!localStorage.getItem(this.hideKey())}catch(_){return false}},
  /* 新手任務卡(只給學生,顯示在「我的課程」最上方;可收起) */
  card:async function(){
    if(!U||isAdmin()||this.cardHidden())return '';
    var pst='hide',hasEssay=false;
    try{pst=await PUSH.state()}catch(_){}
    try{var er=await sb.from('essays').select('id').eq('student_id',U.id).limit(1);hasEssay=!!(er.data&&er.data.length)}catch(_){}
    var items=[
      {ok:this.done(),t:'看完網站導覽',go:'<button type="button" class="more" data-sc-tour>開始導覽</button>'}
    ];
    if(pst!=='hide')items.push({ok:pst==='on',t:'開啟手機通知(批改完成就會提醒你)',go:'<button type="button" class="more" data-sc-go="a">前往設定</button>'});
    items.push({ok:Object.keys(CLAIMED).length>0,t:'領取一份免費資源',go:'<a class="more" href="resources.html">去看看</a>'});
    items.push({ok:Object.keys(ENR).length>0,t:'報名一門課程(免費課程可直接開始)',go:'<a class="more" href="courses.html">去看看</a>'});
    items.push({ok:hasEssay,t:'上傳你的第一篇作文給老師批改',go:'<a class="more" href="essay.html">去上傳</a>'});
    var n=items.filter(function(x){return x.ok}).length,all=n===items.length;
    return '<div class="startcard" id="startCard"><div class="sc-h"><b>'+(all?'新手任務全部完成!':'新手任務 '+n+' / '+items.length)+'</b><span class="sc-bar" aria-hidden="true"><i style="width:'+Math.round(n/items.length*100)+'%"></i></span><button type="button" class="more" data-sc-hide>'+(all?'收起':'不再顯示')+'</button></div><ul>'+
      items.map(function(x){return '<li'+(x.ok?' class="done"':'')+'><span class="sc-ck" aria-hidden="true">'+(x.ok?'✓':'')+'</span><span class="sc-t">'+x.t+(x.ok?'<span class="sr">(已完成)</span>':'')+'</span>'+(x.ok?'':'<em>'+x.go+'</em>')+'</li>'}).join('')+'</ul></div>';
  },
  /* 其他頁面的歡迎提示:第一次登入、還沒看過導覽時,提醒去會員專區看導覽 */
  hint:function(){
    var old=$('#tourHint');
    if(!U||isAdmin()||this.done()||PAGE==='member'||PAGE==='admin'){if(old)old.remove();return}
    if(old)return;
    try{if(sessionStorage.getItem('gw-tourhint'))return}catch(_){}
    var d=document.createElement('div');d.className='tourhint';d.id='tourHint';d.setAttribute('role','region');d.setAttribute('aria-label','新手導覽');
    d.innerHTML='<div><b>第一次來嗎?</b><p>花一分鐘認識會員專區和網站功能。</p></div><span><a class="btn btn-fill sm" href="member.html?tour=1">看導覽</a> <button type="button" class="more" data-hx>之後再說</button></span>';
    document.body.appendChild(d);
    $('[data-hx]',d).addEventListener('click',function(){try{sessionStorage.setItem('gw-tourhint','1')}catch(_){}d.remove()});
  }
};
function initMember(){
  var app=$('#memberApp');if(!app)return;
  var tab='c',payMsg='',paying=false,rendering=0;
  async function checkPay(){
    var tn=new URLSearchParams(location.search).get('pay');
    if(!tn||!/^[A-Za-z0-9]{1,20}$/.test(tn)||paying)return;
    paying=true;tab='o';
    payMsg='<div class="paynote" role="status">確認付款結果中…</div>';render();
    var o=null;
    for(var i=0;i<20;i++){
      var r=await sb.from('orders').select('status,kind,amount').eq('merchant_trade_no',tn).maybeSingle();
      o=r.data;if(o&&o.status!=='pending')break;
      await sleep(2000);
    }
    try{history.replaceState(null,'',location.pathname)}catch(e){}
    if(o&&o.status==='paid'){
      await loadMine();
      if(o.kind==='product'){S.cart={};save();refreshBadge();syncAddBtns()}
      payMsg='<div class="paynote ok" role="status">付款成功!'+(o.kind==='membership'?'已自動開通付費會員,可以到直播專區收看。':o.kind==='course'?'課程已開通,可到「我的課程」進入學習。':'我們會盡快寄出教材,出貨進度可在下方訂單查看。')+'</div>';
    }else if(o&&(o.status==='failed'||o.status==='cancelled')){
      payMsg='<div class="paynote bad" role="status">付款沒有成功,你可以回到網站重新下單。如有疑問請聯繫我們。</div>';
    }else{
      payMsg='<div class="paynote" role="status">尚未收到款項。若你選的是超商或 ATM 付款,完成繳費後這裡會自動更新;若已刷卡成功,請稍候幾分鐘再重新整理。</div>';
    }
    paying=false;render();
  }
  async function render(){
    var my=++rendering;
    if(!ready){app.innerHTML='<div class="gate"><p>載入中…</p></div>';return}
    if(!U){
      app.innerHTML='<div class="gate"><h2>登入會員</h2><p>使用 Google 帳號登入,即可查看你的課程、作文批改與資源。</p><button type="button" class="gbtn" id="gLogin2" style="max-width:340px;margin:0 auto"><span class="g" aria-hidden="true">G</span>使用 Google 帳號登入</button><p class="mfoot">不需要另外設定密碼。</p></div>';
      $('#gLogin2').addEventListener('click',function(){askLogin()});return;
    }
    if(tab!=='e'){try{var ur=await sb.from('essays').select('id,status,student_seen_at').eq('student_id',U.id).eq('status','graded');UNSEEN=(ur.data||[]).filter(function(x){return !x.student_seen_at}).length}catch(_){UNSEEN=0}if(my!==rendering)return}
    var body='';
    var ANN=[];
    if(tab==='c'){try{var anr=await sb.from('announcements').select('id,title,body,created_at').gte('created_at',new Date(Date.now()-30*864e5).toISOString()).order('created_at',{ascending:false}).limit(3);ANN=anr.data||[]}catch(_){ANN=[]}if(my!==rendering)return}
    var SC='';
    if(tab==='c'){SC=await TOUR.card();if(my!==rendering)return}
    if(tab==='c'){
      var cs=Object.keys(ENR).map(function(id){var c=byId(GW.courses,id);return c?'<li><a href="'+c.learn+'">'+esc(c.name)+'</a><em>前往學習</em></li>':''}).join('')||'<li class="none">尚未報名課程。<a href="courses.html" style="text-decoration:underline;margin-left:6px">看看線上課程</a></li>';
      body=SC+(ANN.length?'<h2>最新公告</h2><ul class="mlist annlist">'+ANN.map(function(a){return '<li><span><b>'+esc(a.title)+'</b><br><small>'+esc(a.body)+'</small></span><em>'+fmtDate(a.created_at)+'</em></li>'}).join('')+'</ul>':'')+'<h2'+(ANN.length?' style="margin-top:22px"':'')+'>我的課程</h2><ul class="mlist">'+cs+'</ul>';
    }else if(tab==='e'){
      var es=await fetchMyEssays();if(my!==rendering)return;
      var fpaths=[];es.forEach(function(e){e.essay_files.forEach(function(f){fpaths.push(f.path)})});
      var sm=await signedMap(fpaths);if(my!==rendering)return;
      if(es.some(function(x){return x.status==='graded'&&!x.student_seen_at})){sb.rpc('mark_essays_seen').then(function(){UNSEEN=0})}
      body='<h2>我的作文</h2><ul class="mlist">'+(es.map(function(e){
        var fb=e.status==='graded'?'<div class="fbk">'+(scoreTx(e)?'<div class="scorebox"><span>分數</span><b>'+esc(scoreTx(e))+'</b></div>':'')+'<b>老師評語</b><p>'+esc(e.feedback||'(老師已批改,沒有文字評語)').replace(/\n/g,'<br>')+'</p>'+e.essay_files.filter(function(f){return f.kind==='feedback'&&sm[f.path]}).sort(function(a,b){return a.page_no-b.page_no}).map(function(f){return '<a href="'+sm[f.path]+'" target="_blank" rel="noopener"><img src="'+sm[f.path]+'" alt="老師批改照片" loading="lazy"></a>'}).join('')+'</div>':'';
        var subs=e.essay_files.filter(function(f){return f.kind==='submission'}).sort(function(a,b){return a.page_no-b.page_no});
        var n=subs.length;
        var imgs=subs.filter(function(f){return sm[f.path]}).map(function(f,i){return '<a href="'+sm[f.path]+'" target="_blank" rel="noopener"><img src="'+sm[f.path]+'" alt="作文第 '+(i+1)+' 頁" loading="lazy"></a>'}).join('');
        var tx;
        if(e.transcript_status==='done'&&e.transcript)tx='<b>作文文字</b><span class="tnote">'+esc(TX_NOTE[e.transcript_engine]||TX_NOTE.vision)+'</span><div class="ttext">'+esc(e.transcript).replace(/\n/g,'<br>')+'</div>';
        else if(e.transcript_status==='pending')tx='<b>作文文字</b><p class="tnote">辨識中,請稍後切換分頁再看。</p>';
        else tx='<b>作文文字</b><p class="tnote">尚未辨識。</p><button type="button" class="btn btn-line sm" data-retx="'+e.id+'">自動辨識</button>';
        return '<li class="col"><div class="l1"><span>'+esc(e.title)+'('+esc(e.grade||'')+'・'+n+' 張・'+dateShort(e.created_at)+')</span><em>'+(e.status==='graded'&&!e.student_seen_at?'<span class="newpill">新批改</span>':'')+STATUS_ES[e.status]+'</em></div><div class="ecols"><div class="eimgs">'+imgs+'</div><div class="etext">'+tx+'</div></div>'+fb+'</li>'}).join('')||'<li class="none">尚未上傳作文。<a href="essay.html" style="text-decoration:underline;margin-left:6px">前往作文批改</a></li>')+'</ul>';
    }else if(tab==='r'){
      var rs=Object.keys(CLAIMED).map(function(id){var r=PUB.resources[id];return r?'<li><span>'+esc(r.name)+'</span><em><button type="button" class="more" data-dl="'+esc(id)+'">下載</button></em></li>':''}).join('')||'<li class="none">尚未領取資源。<a href="resources.html" style="text-decoration:underline;margin-left:6px">免費資源</a></li>';
      body='<h2>我的資源</h2><ul class="mlist">'+rs+'</ul>';
    }else if(tab==='o'){
      var r=await sb.from('orders').select('id,merchant_trade_no,kind,status,amount,plan_id,course_id,fulfillment,created_at,order_items(name,qty)').eq('user_id',U.id).order('created_at',{ascending:false});
      if(my!==rendering)return;
      body='<h2>我的訂單</h2><ul class="mlist">'+((r.data||[]).map(function(o){
        var what=o.kind==='product'?(o.order_items||[]).map(function(i){return esc(i.name)+' × '+i.qty}).join('、'):o.kind==='membership'?'付費會員('+esc(planName(o.plan_id))+')':esc((byId(GW.courses,o.course_id)||{}).name||'線上課程');
        var ful=o.kind==='product'&&o.status==='paid'&&FUL[o.fulfillment]?'・'+FUL[o.fulfillment]:'';
        return '<li class="col"><div class="l1"><span>'+what+'</span><em>'+ORD_ST[o.status]+ful+'</em></div><small class="sub">'+fmtDate(o.created_at)+'・'+money(o.amount)+'・訂單 '+esc(o.merchant_trade_no)+'</small></li>'}).join('')||'<li class="none">還沒有訂單。</li>')+'</ul>';
    }else{
      var on=isMember();
      var pst=await PUSH.state();if(my!==rendering)return;
      var PTX={on:'這支裝置已開啟通知:作文批改完成、直播開始前約 15 分鐘、付費會員到期前 3 天,手機都會跳出提醒。',off:'開啟後,作文批改完成、直播開始前約 15 分鐘、付費會員到期前 3 天,手機都會跳出提醒。',ios:'iPhone / iPad 需要先把網站加到主畫面:用 Safari 點下方的分享鈕,選「加入主畫面」,再從主畫面的圖示開啟本頁,就能開啟通知(需 iOS 16.4 以上)。',denied:'這個瀏覽器目前封鎖了通知。請到瀏覽器或手機的網站設定,把本站的通知改成「允許」,再回來開啟。',unsupported:'這個瀏覽器不支援網頁通知,建議改用 Chrome(電腦或 Android)或 Safari(iPhone 需先加到主畫面)。'};
      var pushCard=pst==='hide'?'':'<div class="pushcard" id="pushCard" data-st="'+pst+'"><div><b>手機通知</b><p>'+PTX[pst]+'</p></div><div class="pact">'+(pst==='off'?'<button type="button" class="btn btn-fill sm" id="pushOn">開啟手機通知</button>':pst==='on'?'<button type="button" class="btn btn-line sm" id="pushTest">傳送測試通知</button><button type="button" class="btn btn-line sm" id="pushOff">關閉</button>':'')+'</div></div>';
      body='<h2>帳號</h2><ul class="mlist"><li><span>登入方式</span><em>Google 帳號</em></li><li><span>會員等級</span><em>'+(on?'付費會員':'免費會員')+'</em></li>'+(MEM?'<li><span>方案</span><em>'+(MEM.plan?esc(planName(MEM.plan))+'・':'')+(MEM.status==='cancelled'?'已取消續約・':'')+'有效至 '+fmtDate(MEM.valid_until)+'</em></li>':'')+'</ul><p style="color:var(--text-soft);font-size:14px;margin-bottom:14px">'+(on?'你可以到直播專區進入會員限定直播。':'付費會員可觀看會員限定直播,在網站付款後自動開通。<a href="membership.html" style="text-decoration:underline;margin-left:4px">了解付費會員</a>')+'</p>'+pushCard+
        (on&&MEM.status==='active'&&MEM.plan?'<button type="button" class="btn btn-line" id="cancelSub">取消續約</button> ':'')+(isAdmin()?'<a class="btn btn-line" href="admin.html">老師後台</a> ':'')+'<button type="button" class="btn btn-line" id="tourAgain">重看網站導覽</button> <button type="button" class="btn btn-line" id="logoutBtn">登出</button>';
    }
    app.innerHTML=payMsg+'<div class="profile"><span class="av">'+esc((U.name||'?').charAt(0).toUpperCase())+'</span><div><b>'+esc(U.name)+'</b><small>'+esc(U.email)+'</small></div></div>'+
     '<div class="tabs mtabs" role="tablist">'+[['c','我的課程'],['e','我的作文'],['r','我的資源'],['o','我的訂單'],['a','帳號']].map(function(t){return '<button type="button" role="tab" data-t="'+t[0]+'" aria-selected="'+(tab===t[0])+'">'+t[1]+(t[0]==='e'&&UNSEEN>0&&tab!=='e'?' <span class="newpill">'+UNSEEN+'</span>':'')+'</button>'}).join('')+'</div><div class="panel">'+body+'</div>';
    $$('[data-t]',app).forEach(function(b){b.addEventListener('click',function(){tab=b.getAttribute('data-t');render()})});
    $$('[data-dl]',app).forEach(function(b){b.addEventListener('click',async function(){
      var rr=PUB.resources[b.getAttribute('data-dl')];
      if(!rr||!rr.storage_path){toast('檔案還在準備中');return}
      var s=await sb.storage.from('resources').createSignedUrl(rr.storage_path,120);
      if(s.data)window.open(s.data.signedUrl,'_blank','noopener');else toast('下載失敗,請稍後再試');
    })});
    $$('[data-retx]',app).forEach(function(b){b.addEventListener('click',async function(){
      b.disabled=true;b.textContent='辨識中…';
      var ok=await transcribeEssay(b.getAttribute('data-retx'),function(m){b.textContent=m});
      toast(ok?'辨識完成':'這張照片無法自動辨識,老師會直接看照片批改');render();
    })});
    var lo=$('#logoutBtn');if(lo)lo.addEventListener('click',signOut);
    var ta=$('#tourAgain');if(ta)ta.addEventListener('click',function(){TOUR.start()});
    var sct=$('[data-sc-tour]',app);if(sct)sct.addEventListener('click',function(){TOUR.start()});
    var sch=$('[data-sc-hide]',app);if(sch)sch.addEventListener('click',function(){try{localStorage.setItem(TOUR.hideKey(),'1')}catch(_){}var c=$('#startCard');if(c)c.remove()});
    $$('[data-sc-go]',app).forEach(function(b){b.addEventListener('click',function(){tab=b.getAttribute('data-sc-go');render()})});
    TOUR.maybeStart();
    var pOn=$('#pushOn');
    if(pOn)pOn.addEventListener('click',async function(){
      this.disabled=true;this.textContent='開啟中…';
      try{var r=await PUSH.on();toast(r==='on'?'已開啟手機通知':'通知權限沒有開啟')}
      catch(e){toast('開啟失敗:'+niceErr(e))}
      render();
    });
    var pTest=$('#pushTest');
    if(pTest)pTest.addEventListener('click',async function(){
      this.disabled=true;
      try{
        var r=await callFn('push-test',{});
        toast(r&&r.ok?'已送出測試通知,幾秒內手機會跳出':r&&r.reason==='not_configured'?'通知功能還在設定中,請稍後再試':'找不到可用的裝置,請先關閉再重新開啟');
      }catch(e){toast(niceErr(e))}
      this.disabled=false;
    });
    var pOff=$('#pushOff');
    if(pOff)pOff.addEventListener('click',async function(){this.disabled=true;await PUSH.off();toast('已關閉這支裝置的通知');render()});
    var cs2=$('#cancelSub');
    if(cs2)cs2.addEventListener('click',function(){
      openModal('<h3 id="mTitle">取消續約</h3><p class="lead">取消後不會再自動扣款,已付款的期間(到 '+fmtDate(MEM.valid_until)+')仍可繼續使用。</p><div class="err" id="cxErr" role="alert"></div><button type="button" class="btn btn-fill" id="cxGo" style="width:100%">確認取消續約</button>',function(){
        $('#cxGo').addEventListener('click',async function(){
          this.disabled=true;
          try{await callFn('cancel-membership',{});await loadMine();closeDlg(modal);toast('已取消續約');fire()}
          catch(e){$('#cxErr').textContent=niceErr(e);this.disabled=false}
        });
      });
    });
  }
  onAuth.push(function(){render();checkPay()});render();
}

/* ---------- 老師後台 ---------- */
function parseYt(v){return ytId(v)}
function initAdmin(){
  var app=$('#adminApp');if(!app)return;
  var aTab='e',tf={who:'',title:'',grade:'國三',open:false},tFiles=[],tUrls=[],names={};
  function clearT(){tUrls.forEach(function(u){URL.revokeObjectURL(u)});tUrls=[];tFiles=[]}
  function nm(id){return id&&names[id]?names[id].name||names[id].email:'(未知)'}
  async function loadNames(){var r=await sb.from('profiles').select('id,name,email,created_at,role');(r.data||[]).forEach(function(x){names[x.id]=x});return r.data||[]}
  async function count(table,filter){var q=sb.from(table).select('id',{count:'exact',head:true});if(filter)q=filter(q);var r=await q;return r.count||0}

  async function render(){
    if(!ready){app.innerHTML='<div class="gate"><p>載入中…</p></div>';return}
    if(!U){app.innerHTML='<div class="gate"><h2>老師後台</h2><p>請使用老師的 Google 帳號登入。</p><button type="button" class="btn btn-fill" id="admLogin">使用 Google 帳號登入</button></div>';$('#admLogin').addEventListener('click',function(){askLogin('請用老師的 Google 帳號登入後台')});return}
    if(!isAdmin()){app.innerHTML='<div class="gate"><h2>沒有權限</h2><p>這個帳號('+esc(U.email)+')不是老師帳號。</p><a class="btn btn-line" href="member.html">回會員專區</a></div>';return}
    app.innerHTML='<div class="tiles" id="tiles"></div><div id="ocrAlert"></div><div class="tabs" role="tablist" style="max-width:860px">'+[['e','作文批改'],['o','訂單'],['m','會員'],['p','教材'],['c','課程'],['l','直播'],['n','公告'],['s','設定']].map(function(t){return '<button type="button" role="tab" data-at="'+t[0]+'" aria-selected="'+(aTab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div><div class="panel" id="aBody"><p>載入中…</p></div><p class="mfoot"><button type="button" class="more" id="admOut">登出</button></p>';
    $$('[data-at]',app).forEach(function(b){b.addEventListener('click',function(){aTab=b.getAttribute('data-at');render()})});
    $('#admOut').addEventListener('click',signOut);
    tiles();ocrAlert();
    var body=$('#aBody');
    try{await TABS[aTab](body)}catch(e){body.innerHTML='<p class="err">讀取失敗:'+esc(niceErr(e))+'</p>'}
  }
  async function ocrAlert(){
    var h=$('#ocrAlert');if(!h)return;
    try{
      var r=await sb.rpc('ocr_status');if(r.error||!r.data)return;
      var u=r.data.units,l=r.data.limit,pct=l>0?Math.round(u*100/l):0;
      if(u>=l)h.innerHTML='<div class="ocrbar full" role="status"><b>本月 Google 文字辨識免費額度已用完</b>('+u+' / '+l+' 張)。新上傳的作文會自動改用瀏覽器簡易辨識,錯字會比較多,請直接看照片批改;每月 1 日(UTC)額度自動恢復。</div>';
      else if(pct>=80)h.innerHTML='<div class="ocrbar warn" role="status"><b>本月 Google 文字辨識已用 '+pct+'%</b>('+u+' / '+l+' 張),快用完了。用完後會自動改用瀏覽器簡易辨識。</div>';
      else h.innerHTML='';
    }catch(e){}
  }
  async function tiles(){
    var c=await Promise.all([count('essays',function(q){return q.eq('status','pending')}),count('orders',function(q){return q.eq('status','paid').eq('fulfillment','to_ship')}),count('memberships',function(q){return q.eq('status','active')})]);
    var t=$('#tiles');if(t)t.innerHTML='<div class="tile"><b>'+c[0]+'</b><span>待批改作文</span></div><div class="tile"><b>'+c[1]+'</b><span>待出貨訂單</span></div><div class="tile"><b>'+c[2]+'</b><span>訂閱中的會員</span></div>';
  }
  var TABS={};

  /* --- 作文 --- */
  TABS.e=async function(body){
    await loadNames();
    var r=await sb.from('essays').select('id,student_id,source,source_note,title,grade,note,status,feedback,created_at,score,score_max,transcript,transcript_status,transcript_engine').order('status',{ascending:false}).order('created_at',{ascending:false}).limit(150);
    var rows=r.data||[];
    var h='<div class="upanel" id="tPanel" style="margin-bottom:18px"><div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><h3>老師自行上傳作文</h3><p class="lead" style="margin-bottom:0">手邊額外需要批閱的作文,可以直接上傳,和學生送來的作文一起排進待批改。</p></div><button type="button" class="btn btn-line sm" id="tToggle" aria-expanded="'+tf.open+'">'+(tf.open?'收合':'＋ 上傳作文')+'</button></div>';
    if(tf.open){
      h+='<form id="tForm" novalidate style="margin-top:16px"><div class="row2"><label class="fld" for="tWho">學生或來源備註(選填)<input id="tWho" placeholder="例如:王同學、班級作業" maxlength="40" value="'+esc(tf.who)+'"></label><label class="fld" for="tGrade">年級<select id="tGrade">'+['國一','國二','國三','高一','高二','高三','其他'].map(function(g){return '<option'+(g===tf.grade?' selected':'')+'>'+g+'</option>'}).join('')+'</select></label></div>'+
       '<label class="fld" for="tTitle" style="margin-bottom:12px">作文題目<input id="tTitle" placeholder="例如:溫暖的心" maxlength="60" value="'+esc(tf.title)+'"></label>'+
       '<label class="drop" id="tDrop" for="tFile">'+ico('i-upload')+'<span><b>點選選擇照片</b>,或把照片拖曳到這裡</span><span style="font-size:12.5px">最多 '+MAXF+' 張・每張 '+MAXMB+' MB 以內・JPG / PNG / WebP</span><input id="tFile" type="file" accept="image/jpeg,image/png,image/webp" multiple></label>'+
       '<div class="thumbs" id="tThumbs">'+tUrls.map(function(u,i){return '<div class="th"><img src="'+u+'" alt="作文第 '+(i+1)+' 頁"><button type="button" data-trm="'+i+'" aria-label="移除第 '+(i+1)+' 張">×</button></div>'}).join('')+'</div>'+
       '<div class="err" id="tErr" role="alert" style="margin-top:8px"></div><button class="btn btn-fill" type="submit" id="tGo">加入待批改</button></form>';
    }
    h+='</div><div class="twrap"><table class="tbl"><thead><tr><th>學生</th><th>題目</th><th>年級</th><th>來源</th><th>日期</th><th>狀態</th><th></th></tr></thead><tbody>'+
      rows.map(function(e){var teacher=e.source==='teacher';
        return '<tr><td>'+esc(teacher?(e.source_note||'(老師自行上傳)'):nm(e.student_id))+'</td><td>'+esc(e.title)+'</td><td>'+esc(e.grade||'')+'</td><td><span class="pill'+(teacher?' ok':'')+'">'+(teacher?'老師上傳':'學生上傳')+'</span></td><td>'+dateShort(e.created_at)+'</td><td><span class="pill '+(e.status==='pending'?'warn':'ok')+'">'+STATUS_ES[e.status]+'</span>'+(scoreTx(e)?' <small>'+esc(scoreTx(e))+'</small>':'')+'</td><td><button type="button" class="btn btn-line sm" data-gr="'+e.id+'">'+(e.status==='pending'?'批改':'查看')+'</button></td></tr>'}).join('')+(rows.length?'':'<tr><td colspan="7" class="none">還沒有作文</td></tr>')+'</tbody></table></div>';
    body.innerHTML=h;
    var tt=$('#tToggle');tt.addEventListener('click',function(){tf.open=!tf.open;render()});
    var tForm=$('#tForm');
    if(tForm){
      $('#tWho').addEventListener('input',function(){tf.who=this.value});$('#tTitle').addEventListener('input',function(){tf.title=this.value});$('#tGrade').addEventListener('change',function(){tf.grade=this.value});
      var tfi=$('#tFile'),td=$('#tDrop');
      function tAdd(list){var er=$('#tErr');er.textContent='';
        Array.prototype.forEach.call(list,function(f){var m=checkFile(f,tFiles);if(m){er.textContent=m;return}tFiles.push(f);tUrls.push(URL.createObjectURL(f))});
        TABS.e(body);
      }
      tfi.addEventListener('change',function(){tAdd(tfi.files);tfi.value=''});
      ['dragenter','dragover'].forEach(function(ev){td.addEventListener(ev,function(e){e.preventDefault();td.classList.add('over')})});
      ['dragleave','drop'].forEach(function(ev){td.addEventListener(ev,function(e){e.preventDefault();td.classList.remove('over')})});
      td.addEventListener('drop',function(e){if(e.dataTransfer)tAdd(e.dataTransfer.files)});
      $$('[data-trm]',body).forEach(function(b){b.addEventListener('click',function(){var i=+b.getAttribute('data-trm');URL.revokeObjectURL(tUrls[i]);tUrls.splice(i,1);tFiles.splice(i,1);TABS.e(body)})});
      tForm.addEventListener('submit',async function(e){
        e.preventDefault();var er=$('#tErr'),t=$('#tTitle').value.trim(),go=$('#tGo');
        if(!t){er.textContent='請填寫作文題目。';return}
        if(!tFiles.length){er.textContent='請至少上傳一張作文照片。';return}
        go.disabled=true;go.textContent='上傳中…';
        try{
          var tId=await submitEssay({student_id:null,created_by:U.id,source:'teacher',source_note:$('#tWho').value.trim()||null,title:t,grade:$('#tGrade').value,status:'pending'},tFiles);
          transcribeEssay(tId);
          var n=tFiles.length;clearT();tf.who='';tf.title='';tf.open=false;toast('已加入「'+t+'」共 '+n+' 張,列在待批改');render();
        }catch(ex){er.textContent='上傳失敗:'+niceErr(ex);go.disabled=false;go.textContent='加入待批改'}
      });
    }
    $$('[data-gr]',body).forEach(function(b){b.addEventListener('click',function(){openGrade(b.getAttribute('data-gr'),rows)})});
  };
  async function openGrade(id,rows){
    var e=rows.filter(function(x){return x.id===id})[0];if(!e)return;
    var fr=await sb.from('essay_files').select('path,kind,page_no').eq('essay_id',id).order('page_no');
    var files=fr.data||[],sm=await signedMap(files.map(function(f){return f.path}));
    var subs=files.filter(function(f){return f.kind==='submission'}),fbs=files.filter(function(f){return f.kind==='feedback'});
    var fpick=[],TPL=[],tplEdit=false;
    try{var tr=await sb.from('feedback_templates').select('id,label,body,sort_order').order('sort_order');TPL=tr.data||[]}catch(_){}
    var lastMax='';try{lastMax=localStorage.getItem('gw-score-max')||''}catch(_){}
    var maxV=e.score_max!=null?e.score_max:(lastMax||60);
    openModal('<h3 id="mTitle">'+esc(e.title)+'</h3><p class="lead">'+esc(e.source==='teacher'?(e.source_note||'老師自行上傳'):nm(e.student_id))+'・'+esc(e.grade||'')+'・'+fmtDate(e.created_at)+'</p>'+
      (e.note?'<p class="gnote"><b>學生留言:</b>'+esc(e.note)+'</p>':'')+
      '<div class="gimgs">'+subs.map(function(f,i){return sm[f.path]?'<a href="'+sm[f.path]+'" target="_blank" rel="noopener"><img src="'+sm[f.path]+'" alt="作文第 '+(i+1)+' 頁"></a>':''}).join('')+'</div>'+
      (fbs.length?'<p class="gnote"><b>已上傳的批改照片:</b></p><div class="gimgs">'+fbs.map(function(f){return sm[f.path]?'<a href="'+sm[f.path]+'" target="_blank" rel="noopener"><img src="'+sm[f.path]+'" alt="批改照片"></a>':''}).join('')+'</div>':'')+
      '<label class="fld" for="gTx">作文文字(自動辨識,可直接修改;學生也看得到)<textarea id="gTx" rows="8" maxlength="20000" placeholder="'+(e.transcript_status==='pending'?'辨識中…請稍後按「重新辨識」更新':'尚未辨識')+'">'+esc(e.transcript||'')+'</textarea></label><button type="button" class="btn btn-line sm" id="gRetx" style="margin:-4px 0 12px">重新辨識</button>'+
      '<div class="scoreRow"><label for="gScore">分數<input id="gScore" type="number" inputmode="decimal" min="0" max="100" step="0.5" value="'+(e.score!=null?e.score:'')+'" placeholder="例如 45"></label><span class="sl">/</span><label for="gMax">滿分<input id="gMax" type="number" inputmode="decimal" min="1" max="100" step="0.5" value="'+maxV+'"></label><small>不打分數就留空</small></div>'+
      '<div class="fld"><div class="tplHead"><span>評語範本(點一下插入)</span><button type="button" class="more" id="tplMng">管理</button></div><div class="tplRow" id="tplRow"></div></div>'+
      '<label class="fld" for="gFb">文字評語<textarea id="gFb" rows="6" maxlength="4000" placeholder="寫給學生的評語與建議">'+esc(e.feedback||'')+'</textarea></label>'+
      '<div class="tplSave"><button type="button" class="more" id="tplAdd">＋ 把目前評語存成範本</button><span id="tplForm" hidden><input id="tplLabel" maxlength="20" placeholder="範本名稱(20 字內)"> <button type="button" class="btn btn-line sm" id="tplOk">存</button></span></div>'+
      '<label class="fld" for="gFile">批改後的照片(選填,JPG / PNG / WebP)<input id="gFile" type="file" accept="image/jpeg,image/png,image/webp" multiple></label>'+
      '<div class="err" id="gErr" role="alert"></div><button type="button" class="btn btn-fill" id="gGo" style="width:100%">'+(e.status==='graded'?'更新評語':'儲存並標為已批改')+'</button><button type="button" class="btn btn-line gdel" id="gDel">刪除這篇作文</button>',function(){
        var delArm=0,delT;
        $('#gDel').addEventListener('click',async function(){
          var bt=this,er=$('#gErr');
          if(!delArm){delArm=1;bt.textContent='再按一次,確定永久刪除(作文與照片都無法復原)';bt.classList.add('armed');clearTimeout(delT);delT=setTimeout(function(){delArm=0;bt.textContent='刪除這篇作文';bt.classList.remove('armed')},6000);return}
          bt.disabled=true;bt.textContent='刪除中…';er.textContent='';
          try{
            var dr=await sb.from('essays').delete().eq('id',id).select('id');
            if(dr.error)throw dr.error;
            if(!dr.data||!dr.data.length)throw new Error('沒有刪除成功,請重新整理後再試');
            var ps=files.map(function(f){return f.path});
            if(ps.length){try{await sb.storage.from('essays').remove(ps)}catch(_){}}
            closeDlg(modal);toast('已刪除「'+e.title+'」');render();tiles();
          }catch(ex){er.textContent='刪除失敗:'+niceErr(ex);bt.disabled=false;delArm=0;bt.classList.remove('armed');bt.textContent='刪除這篇作文'}
        });
        function drawTpl(){
          var row=$('#tplRow');if(!row)return;
          row.innerHTML=TPL.length?TPL.map(function(t){return '<span class="tplc"><button type="button" class="chip" data-tpl="'+t.id+'" title="'+esc(t.body)+'">'+esc(t.label)+'</button>'+(tplEdit?'<button type="button" class="tplx" data-tdel="'+t.id+'" aria-label="刪除範本 '+esc(t.label)+'">×</button>':'')+'</span>'}).join(''):'<span class="tnote">還沒有範本,寫好評語後可以存成範本。</span>';
          $$('[data-tpl]',row).forEach(function(b){b.addEventListener('click',function(){var t=TPL.filter(function(x){return String(x.id)===b.getAttribute('data-tpl')})[0];if(!t)return;var ta=$('#gFb');var cur=ta.value;ta.value=(cur&&!/\n$/.test(cur)?cur+'\n':cur)+t.body;if(ta.value.length>4000)ta.value=ta.value.slice(0,4000);ta.focus()})});
          $$('[data-tdel]',row).forEach(function(b){b.addEventListener('click',async function(){var id2=b.getAttribute('data-tdel');var dr=await sb.from('feedback_templates').delete().eq('id',+id2);if(dr.error){$('#gErr').textContent='刪除範本失敗:'+niceErr(dr.error);return}TPL=TPL.filter(function(x){return String(x.id)!==id2});drawTpl()})});
        }
        drawTpl();
        $('#tplMng').addEventListener('click',function(){tplEdit=!tplEdit;this.textContent=tplEdit?'完成':'管理';drawTpl()});
        $('#tplAdd').addEventListener('click',function(){var er=$('#gErr');if(!$('#gFb').value.trim()){er.textContent='先寫好評語,才能存成範本。';return}er.textContent='';$('#tplForm').hidden=false;$('#tplLabel').focus()});
        $('#tplOk').addEventListener('click',async function(){
          var er=$('#gErr'),lb=$('#tplLabel').value.trim(),bd=$('#gFb').value.trim();
          if(!lb){er.textContent='請幫範本取個名稱。';return}
          if(bd.length>1000){er.textContent='範本最多 1000 字,請縮短後再存。';return}
          var ins=await sb.from('feedback_templates').insert({label:lb,body:bd,sort_order:TPL.length+1}).select('id,label,body,sort_order');
          if(ins.error){er.textContent='存範本失敗:'+niceErr(ins.error);return}
          var row0=(ins.data&&ins.data[0])||null;if(row0)TPL.push(row0);
          $('#tplLabel').value='';$('#tplForm').hidden=true;er.textContent='';drawTpl();toast('已存成範本');
        });
        $('#gRetx').addEventListener('click',async function(){
          var bt=this;bt.disabled=true;bt.textContent='辨識中…';
          var ok=await transcribeEssay(id,function(m){bt.textContent=m});
          if(ok){var rr=await sb.from('essays').select('transcript,transcript_engine').eq('id',id).maybeSingle();if(rr.data){$('#gTx').value=rr.data.transcript||'';e.transcript=rr.data.transcript;e.transcript_status='done';e.transcript_engine=rr.data.transcript_engine}}
          else $('#gErr').textContent='這張照片無法自動辨識(手寫稿紙格線容易造成錯字),請直接看照片批改。';
          bt.disabled=false;bt.textContent='重新辨識';
        });
        $('#gFile').addEventListener('change',function(){fpick=[];var er=$('#gErr');er.textContent='';Array.prototype.forEach.call(this.files,function(f){var m=checkFile(f,fpick);if(m){er.textContent=m;return}fpick.push(f)})});
        $('#gGo').addEventListener('click',async function(){
          var er=$('#gErr'),fb=$('#gFb').value.trim();
          if(!fb&&!fpick.length&&!fbs.length){er.textContent='請寫下評語,或上傳批改後的照片。';return}
          var sc=$('#gScore').value.trim(),mx=$('#gMax').value.trim(),scN=null,mxN=null;
          if(sc!==''){scN=+sc;mxN=+mx;if(!isFinite(scN)||!isFinite(mxN)||mx===''){er.textContent='請填寫分數與滿分。';return}if(mxN<1||mxN>100){er.textContent='滿分請填 1 到 100。';return}if(scN<0||scN>mxN){er.textContent='分數要在 0 到滿分之間。';return}}
          this.disabled=true;this.textContent='儲存中…';
          var up=[];
          try{
            var stamp=Date.now();
            for(var i=0;i<fpick.length;i++){
              var path=id+'/feedback-'+stamp+'-'+(i+1)+'.'+OK_MIME[fpick[i].type];
              var u=await sb.storage.from('essays').upload(path,fpick[i],{contentType:fpick[i].type,upsert:false});
              if(u.error)throw u.error;up.push(path);
            }
            if(up.length){var ir=await sb.from('essay_files').insert(up.map(function(p,i){return {essay_id:id,path:p,page_no:i+1,kind:'feedback'}}));if(ir.error)throw ir.error}
            var upd={status:'graded',feedback:fb||null,graded_at:new Date().toISOString(),graded_by:U.id,score:scN,score_max:scN==null?null:mxN,student_seen_at:null};
            var txv=$('#gTx').value.trim();
            if(txv!==(e.transcript||'').trim()){upd.transcript=txv||null;upd.transcript_status=txv?'done':'none';upd.transcript_engine=txv?'manual':null;upd.transcript_at=new Date().toISOString()}
            var ur=await sb.from('essays').update(upd).eq('id',id);
            if(ur.error)throw ur.error;
            if(scN!=null){try{localStorage.setItem('gw-score-max',String(mxN))}catch(_){}}
            var via=[];try{var nr=await callFn('notify-graded',{essay_id:id});if(nr&&nr.pushed>0)via.push('手機推播');if(nr&&nr.email==='sent')via.push('Email')}catch(_){}
            closeDlg(modal);toast(via.length?'已儲存批改,並用'+via.join('和')+'通知學生':'已儲存批改');render();
          }catch(ex){
            try{if(up.length)await sb.storage.from('essays').remove(up)}catch(_){}
            er.textContent='儲存失敗:'+niceErr(ex);this.disabled=false;this.textContent='儲存並標為已批改';
          }
        });
      });
  }

  /* --- 訂單 --- */
  TABS.o=async function(body){
    await loadNames();
    var r=await sb.from('orders').select('id,merchant_trade_no,user_id,kind,status,amount,plan_id,course_id,recipient_name,recipient_phone,recipient_address,note,fulfillment,created_at,order_items(name,qty)').order('created_at',{ascending:false}).limit(150);
    var rows=r.data||[];
    body.innerHTML='<div class="twrap"><table class="tbl"><thead><tr><th>日期</th><th>會員</th><th>內容</th><th>金額</th><th>付款</th><th>出貨</th></tr></thead><tbody>'+rows.map(function(o){
      var what=o.kind==='product'?(o.order_items||[]).map(function(i){return esc(i.name)+' × '+i.qty}).join('<br>'):o.kind==='membership'?'付費會員('+esc(planName(o.plan_id))+')':esc((byId(GW.courses,o.course_id)||{}).name||'線上課程');
      var rec=o.kind==='product'?'<details><summary>收件資料</summary>'+esc(o.recipient_name||'')+'<br>'+esc(o.recipient_phone||'')+'<br>'+esc(o.recipient_address||'')+(o.note?'<br>備註:'+esc(o.note):'')+'</details>':'';
      var ship=o.kind==='product'&&o.status==='paid'?'<select data-ful="'+o.id+'">'+['to_ship','shipped','done'].map(function(v){return '<option value="'+v+'"'+(o.fulfillment===v?' selected':'')+'>'+FUL[v]+'</option>'}).join('')+'</select>':'—';
      return '<tr><td>'+fmtDate(o.created_at)+'</td><td>'+esc(nm(o.user_id))+'</td><td>'+what+rec+'</td><td>'+money(o.amount)+'</td><td><span class="pill '+(o.status==='paid'?'ok':o.status==='pending'?'warn':'')+'">'+ORD_ST[o.status]+'</span></td><td>'+ship+'</td></tr>'}).join('')+(rows.length?'':'<tr><td colspan="6" class="none">還沒有訂單</td></tr>')+'</tbody></table></div><p class="mfoot">教材付款成功後會自動列為「準備寄出」。寄出後請改成「已寄出」。</p>';
    $$('[data-ful]',body).forEach(function(s){s.addEventListener('change',async function(){
      var u=await sb.from('orders').update({fulfillment:s.value}).eq('id',s.getAttribute('data-ful'));
      if(u.error){toast('更新失敗:'+niceErr(u.error));TABS.o(body)}else{toast('已更新出貨狀態');tiles()}
    })});
  };

  /* --- 會員 --- */
  TABS.m=async function(body){
    var profs=await loadNames();
    var mr=await sb.from('memberships').select('user_id,plan,status,valid_until,source');
    var mm={};(mr.data||[]).forEach(function(x){mm[x.user_id]=x});
    var q='';
    function draw(){
      var list=profs.filter(function(p){return !q||((p.name||'')+(p.email||'')).toLowerCase().indexOf(q)>-1});
      $('#mRows').innerHTML=list.map(function(p){
        var m=mm[p.id],on=m&&new Date(m.valid_until).getTime()+3*864e5>Date.now();
        return '<tr><td>'+esc(p.name||'')+'</td><td>'+esc(p.email)+'</td><td>'+fmtDate(p.created_at)+'</td><td><span class="pill '+(on?'ok':'')+'">'+(on?(m.source==='manual'?'手動開通':planName(m.plan)):'免費')+'</span>'+(m?'<small class="sub"> 到 '+fmtDate(m.valid_until)+(m.status==='cancelled'?'・已取消續約':'')+'</small>':'')+'</td><td>'+(p.role==='admin'?'老師':'<select data-grant="'+p.id+'"><option value="">手動開通…</option><option value="30">30 天</option><option value="90">90 天</option><option value="365">1 年</option></select>'+(on?' <button type="button" class="btn btn-line sm" data-stop="'+p.id+'">停用</button>':''))+'</td></tr>'}).join('')||'<tr><td colspan="5" class="none">沒有符合的會員</td></tr>';
      $$('[data-grant]',body).forEach(function(s){s.addEventListener('change',async function(){
        if(!s.value)return;var uid=s.getAttribute('data-grant'),old=mm[uid],base=old&&new Date(old.valid_until).getTime()>Date.now()?new Date(old.valid_until).getTime():Date.now();
        var until=new Date(base+(+s.value)*864e5).toISOString(),res;
        if(old)res=await sb.from('memberships').update({status:'active',valid_until:until,updated_at:new Date().toISOString()}).eq('user_id',uid);
        else res=await sb.from('memberships').insert({user_id:uid,plan:null,status:'active',valid_until:until,source:'manual'});
        if(res.error){toast('開通失敗:'+niceErr(res.error));return}
        toast('已手動開通');TABS.m(body);tiles();
      })});
      $$('[data-stop]',body).forEach(function(b){b.addEventListener('click',async function(){
        var uid=b.getAttribute('data-stop');
        var res=await sb.from('memberships').update({status:'cancelled',valid_until:new Date(Date.now()-4*864e5).toISOString(),updated_at:new Date().toISOString()}).eq('user_id',uid);
        if(res.error){toast('停用失敗:'+niceErr(res.error));return}
        toast('已停用。若對方是用信用卡訂閱,請另外請他到會員專區取消續約');TABS.m(body);tiles();
      })});
    }
    body.innerHTML='<label class="fld" for="mQ" style="max-width:320px;margin-bottom:12px">搜尋姓名或 Email<input id="mQ" type="search"></label><div class="twrap"><table class="tbl"><thead><tr><th>姓名</th><th>Email</th><th>加入日</th><th>付費會員</th><th></th></tr></thead><tbody id="mRows"></tbody></table></div><p class="mfoot">客人在網站付款成功後,系統會自動開通,這裡不用處理。手動開通只用在退款、補開或贈送的情況。</p>';
    $('#mQ').addEventListener('input',function(){q=this.value.trim().toLowerCase();draw()});
    draw();
  };

  /* --- 教材 --- */
  /* 圖片先在瀏覽器縮小再上傳(長邊 max 像素,JPEG),手機直接拍的大圖也能傳 */
  function shrinkImage(file,max){
    return new Promise(function(res,rej){
      var im=new Image(),u=URL.createObjectURL(file);
      im.onload=function(){
        var w=im.naturalWidth,h=im.naturalHeight,k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');
        c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));
        var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
        URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej(new Error('encode'))},'image/jpeg',.88);
      };
      im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('decode'))};
      im.src=u;
    });
  }
  function tocToText(rows){return (rows||[]).map(function(t){return t[1]?t[0]+' | '+t[1]:t[0]}).join('\n')}
  function textToToc(t){
    return String(t||'').split('\n').map(function(l){return l.trim()}).filter(Boolean).map(function(l){
      var i=l.lastIndexOf('|');return i<0?[l,'']:[l.slice(0,i).trim(),l.slice(i+1).trim()];
    });
  }
  function linesToList(t){return String(t||'').split('\n').map(function(l){return l.trim()}).filter(Boolean)}
  var same=function(a,b){return JSON.stringify(a)===JSON.stringify(b)};

  TABS.p=async function(body){
    var r=await sb.from('products').select('*').order('sort');
    var rows=r.data||[],EDS={};
    var cr0=await sb.from('product_categories').select('*').order('sort');
    var catOk=!cr0.error,cats=cr0.data||[];
    function catOpts(sel,blank){return '<option value="">'+(blank||'未分類')+'</option>'+cats.map(function(c){return '<option value="'+esc(c.id)+'"'+(sel===c.id?' selected':'')+'>'+esc(c.name)+'</option>'}).join('')}
    var catBox=!catOk?'':'<details class="addbox" id="catBox"><summary>專區管理(例如:高中、國中、國小、國家考試)</summary>'+
      '<p class="mfoot" style="margin:0 0 10px">教材列表會依專區分區顯示。可以新增專區、改名、調整順序;把教材放進哪個專區,在下方表格的「專區」欄選。刪除專區不會刪掉教材,教材會變成「未分類」(顯示在最後的「其他教材」)。</p>'+
      '<div id="catList">'+cats.map(function(c,i){return '<div class="catrow" data-cat="'+esc(c.id)+'"><input type="text" data-cf="name" value="'+esc(c.name)+'" maxlength="20" aria-label="專區名稱"><input type="text" data-cf="sub" value="'+esc(c.subtitle||'')+'" maxlength="60" placeholder="專區說明(可留空)" aria-label="專區說明"><span class="catact"><button type="button" class="btn btn-line sm" data-cup'+(i===0?' disabled':'')+' aria-label="上移">↑</button><button type="button" class="btn btn-line sm" data-cdn'+(i===cats.length-1?' disabled':'')+' aria-label="下移">↓</button><button type="button" class="btn btn-line sm" data-csv>儲存</button><button type="button" class="btn btn-line sm" data-cdel>刪除</button></span></div>'}).join('')+(cats.length?'':'<p class="mfoot">還沒有專區。</p>')+'</div>'+
      '<form id="catNew" class="catrow" novalidate><input type="text" id="catnName" maxlength="20" placeholder="新專區名稱,例如:國小" aria-label="新專區名稱"><input type="text" id="catnSub" maxlength="60" placeholder="專區說明(可留空)" aria-label="新專區說明"><span class="catact"><button type="submit" class="btn btn-fill sm">＋ 新增專區</button></span></form></details>';
    var newForm='<details class="addbox" id="pNewBox"><summary>＋ 新增教材</summary><form id="pNew" novalidate>'+
      '<label class="fld">書名(顯示在教材卡片與購物車)<input type="text" id="pnName" maxlength="40" placeholder="例如:國文學霸筆記・續集"></label>'+
      '<label class="fld">完整書名(教材頁大標題,可留空沿用書名)<input type="text" id="pnTitle" maxlength="60"></label>'+
      '<div class="row2"><label class="fld">售價 NT$<input type="number" id="pnPrice" min="0" step="10" value="600"></label><label class="fld">類型<select id="pnKind"><option value="physical">實體書(需寄送)</option><option value="digital">電子檔</option></select></label></div>'+
      (catOk?'<label class="fld">放進哪個專區<select id="pnCat">'+catOpts('','未分類(顯示在「其他教材」)')+'</select></label>':'')+
      '<label class="fld">分類說明(卡片上的小字)<input type="text" id="pnMeta" maxlength="80" placeholder="例如:寫作素材・內文約 146 頁"></label>'+
      '<label class="fld">一句話標語<input type="text" id="pnTag" maxlength="120"></label>'+
      '<button type="submit" class="btn btn-fill sm">建立教材</button> <span class="mfoot">建立後先是「未上架」,只有你看得到;補完封面、簡介、目錄,再勾選「上架」並按儲存,前台就會出現。</span></form></details>';
    body.innerHTML=catBox+newForm+'<div class="twrap"><table class="tbl"><thead><tr><th>教材</th><th>售價(NT$)</th><th>類型</th>'+(catOk?'<th>專區</th>':'')+'<th>上架</th><th></th></tr></thead><tbody>'+rows.map(function(p){
      return '<tr data-prow="'+esc(p.id)+'"><td>'+esc(p.name)+'</td><td><input type="number" min="0" step="10" value="'+p.price+'" data-f="price" style="width:90px"></td><td><select data-f="kind"><option value="physical"'+(p.kind==='physical'?' selected':'')+'>實體書(需寄送)</option><option value="digital"'+(p.kind==='digital'?' selected':'')+'>電子檔</option></select></td>'+(catOk?'<td><select data-f="cat">'+catOpts(p.category_id||'')+'</select></td>':'')+'<td><input type="checkbox" data-f="active"'+(p.active?' checked':'')+' aria-label="上架"></td><td class="pact2"><button type="button" class="btn btn-line sm" data-save="'+esc(p.id)+'">儲存</button> <button type="button" class="btn btn-line sm" data-edit="'+esc(p.id)+'" aria-expanded="false">編輯內容與圖片</button></td></tr>'+
        '<tr data-erow="'+esc(p.id)+'" hidden><td colspan="6"></td></tr>'}).join('')+'</tbody></table></div><p class="mfoot">價格會立刻套用到網站與結帳。已付款的舊訂單金額不受影響。「編輯內容與圖片」可以自己換封面、改簡介、特色與目錄,以及上傳內頁圖。</p>';
    if(catOk){
      var cnf=$('#catNew',body);
      cnf.addEventListener('submit',async function(ev){
        ev.preventDefault();
        var nm=$('#catnName').value.trim();if(!nm){toast('請輸入專區名稱');return}
        var mx=cats.reduce(function(m,x){return Math.max(m,x.sort||0)},0);
        var ins=await sb.from('product_categories').insert({id:'k'+Date.now().toString(36),name:nm,subtitle:$('#catnSub').value.trim()||null,sort:mx+1});
        if(ins.error){toast('新增失敗:'+niceErr(ins.error));return}
        toast('已新增專區「'+nm+'」。到下方表格的「專區」欄,把教材放進去。');
        await TABS.p(body);var bx=$('#catBox',body);if(bx)bx.open=true;
      });
      $$('[data-cat]',body).forEach(function(row){
        var id=row.getAttribute('data-cat'),idx=cats.map(function(c){return c.id}).indexOf(id);
        $('[data-csv]',row).addEventListener('click',async function(){
          var nm=$('[data-cf=name]',row).value.trim();if(!nm){toast('專區名稱不能空白');return}
          var u=await sb.from('product_categories').update({name:nm,subtitle:$('[data-cf=sub]',row).value.trim()||null}).eq('id',id);
          if(u.error){toast('儲存失敗:'+niceErr(u.error));return}
          toast('已儲存專區');await TABS.p(body);var bx=$('#catBox',body);if(bx)bx.open=true;
        });
        function swap(j){
          return async function(){
            var o=cats[j],me=cats[idx];if(!o)return;
            var a=sb.from('product_categories').update({sort:o.sort}).eq('id',me.id),b2=sb.from('product_categories').update({sort:me.sort}).eq('id',o.id);
            var ra=await a,rb=await b2;
            if(ra.error||rb.error){toast('調整順序失敗');return}
            if(o.sort===me.sort){await sb.from('product_categories').update({sort:me.sort+(j<idx?-1:1)}).eq('id',me.id)}
            await TABS.p(body);var bx=$('#catBox',body);if(bx)bx.open=true;
          };
        }
        $('[data-cup]',row).addEventListener('click',swap(idx-1));
        $('[data-cdn]',row).addEventListener('click',swap(idx+1));
        $('[data-cdel]',row).addEventListener('click',async function(){
          var n=rows.filter(function(x){return x.category_id===id}).length;
          if(!window.confirm('要刪除專區「'+$('[data-cf=name]',row).value+'」嗎?'+(n?'裡面的 '+n+' 本教材不會被刪除,會變成「未分類」。':''))){return}
          var d=await sb.from('product_categories').delete().eq('id',id);
          if(d.error){toast('刪除失敗:'+niceErr(d.error));return}
          toast('已刪除專區');await TABS.p(body);var bx=$('#catBox',body);if(bx)bx.open=true;
        });
      });
    }
    $('#pNew',body).addEventListener('submit',async function(ev){
      ev.preventDefault();
      var name=$('#pnName').value.trim(),price=parseInt($('#pnPrice').value,10);
      if(!name){toast('請輸入書名');return}
      if(!(price>=0)){toast('請輸入正確的售價');return}
      var mx=rows.reduce(function(m,x){return Math.max(m,x.sort||0)},0);
      var row={id:'p'+Date.now().toString(36),name:name,title:$('#pnTitle').value.trim()||name,price:price,kind:$('#pnKind').value,active:false,sort:mx+1,meta:$('#pnMeta').value.trim()||null,tagline:$('#pnTag').value.trim()||null};
      if(catOk&&$('#pnCat')&&$('#pnCat').value)row.category_id=$('#pnCat').value;
      var ins=await sb.from('products').insert(row);
      if(ins.error){toast('新增失敗:'+niceErr(ins.error));return}
      PUB.products[row.id]=row;addDynProduct(row);
      toast('已新增「'+name+'」(尚未上架)。請接著補封面與內容。');
      await TABS.p(body);var eb=$('[data-edit="'+row.id+'"]',body);if(eb)eb.click();
    });
    $$('[data-save]',body).forEach(function(b){b.addEventListener('click',async function(){
      var tr=b.closest('tr'),price=parseInt($('[data-f=price]',tr).value,10);
      if(!(price>=0)){toast('請輸入正確的價格');return}
      var up={price:price,kind:$('[data-f=kind]',tr).value,active:$('[data-f=active]',tr).checked};var cs=$('[data-f=cat]',tr);if(cs)up.category_id=cs.value||null;
      var u=await sb.from('products').update(up).eq('id',b.getAttribute('data-save'));
      toast(u.error?'儲存失敗:'+niceErr(u.error):'已儲存');
    })});
    $$('[data-edit]',body).forEach(function(b){b.addEventListener('click',function(){
      var id=b.getAttribute('data-edit'),er=$('[data-erow="'+id+'"]',body),open=er.hidden;
      er.hidden=!open;b.setAttribute('aria-expanded',String(open));
      if(open&&!EDS[id])openEditor(id,er.firstChild);
    })});

    function openEditor(id,host){
      var db=rows.filter(function(x){return x.id===id})[0],g=byId(GW.products,id);
      var D={intro:g.intro,feats:g.feats,toc:g.toc,gallery:g.extra.map(function(x){return {src:'images/'+x[0],cap:x[1]}})};
      var S={cover:db.cover_path||null,gallery:Array.isArray(db.gallery)?db.gallery.map(function(x){return Object.assign({},x)}):D.gallery.map(function(x){return Object.assign({},x)})};
      var orig=[db.cover_path].concat((Array.isArray(db.gallery)?db.gallery:[]).map(function(x){return x.path})).filter(Boolean);
      EDS[id]=S;
      host.innerHTML='<div class="ped">'+
        '<div class="ped-top"><label class="fld">分類說明(教材卡片與教材頁上的小字,例如「108–115 學測・內文約 157 頁」)<input type="text" data-e="meta" maxlength="80"></label><label class="fld">卡片簡短說明(教材列表卡片上的兩三行介紹)<textarea data-e="tagline" rows="2" maxlength="120"></textarea></label></div>'+
        '<div class="ped-row"><div class="ped-cov"><b>封面圖</b><img data-ecov alt="目前封面"><label class="btn btn-line sm ped-up">上傳新封面<input type="file" accept="image/*" data-efile="cover" hidden></label><small>建議直式、比例約 7:10;太大的圖會自動縮小。</small></div>'+
        '<div class="ped-txt"><label class="fld">內容簡介<textarea data-e="intro" rows="3"></textarea></label>'+
        '<label class="fld">本書特色(一行一點)<textarea data-e="feats" rows="6"></textarea></label></div></div>'+
        '<label class="fld">內容目錄(一行一項,格式:標題 | 頁碼。沒有頁碼的行會當作章節標題)<textarea data-e="toc" rows="12"></textarea></label>'+
        '<div class="ped-gal"><b>內頁與介紹圖</b><div data-egal></div><label class="btn btn-line sm ped-up">新增圖片(可一次選多張)<input type="file" accept="image/*" multiple data-efile="gal" hidden></label></div>'+
        '<div class="ped-act"><button type="button" class="btn btn-fill sm" data-esave>儲存內容</button> <button type="button" class="btn btn-line sm" data-ereset>還原為預設內容</button><span class="mfoot" data-emsg></span></div></div>';
      var $e=function(sel){return $(sel,host)};
      $e('[data-e=meta]').value=db.meta!=null?db.meta:(g.dyn?'':(g.meta||''));
      $e('[data-e=tagline]').value=db.tagline!=null?db.tagline:(g.dyn?'':(g.tagline||''));
      $e('[data-e=intro]').value=db.intro!=null?db.intro:D.intro;
      $e('[data-e=feats]').value=(Array.isArray(db.feats)?db.feats:D.feats).join('\n');
      $e('[data-e=toc]').value=tocToText(Array.isArray(db.toc)?db.toc:D.toc);
      function drawCover(){$e('[data-ecov]').src=S.cover?mediaUrl(S.cover):(g.cover?'images/'+g.cover:'images/favicon.png')}
      function drawGal(){
        var box=$e('[data-egal]');
        box.innerHTML=S.gallery.length?S.gallery.map(function(it,i){
          return '<div class="ped-g" data-gi="'+i+'"><img src="'+esc(mediaUrl(it.src||it.path))+'" alt=""><input type="text" data-gcap value="'+esc(it.cap||'')+'" placeholder="圖片說明(可留空)" aria-label="圖片說明">'+
            '<span><button type="button" class="btn btn-line sm" data-gup aria-label="上移">↑</button><button type="button" class="btn btn-line sm" data-gdn aria-label="下移">↓</button><button type="button" class="btn btn-line sm" data-grm>移除</button></span></div>'}).join(''):'<p class="mfoot">目前沒有內頁圖。</p>';
        $$('[data-gi]',box).forEach(function(row){
          var i=parseInt(row.getAttribute('data-gi'),10);
          $('[data-gcap]',row).addEventListener('input',function(){S.gallery[i].cap=this.value});
          $('[data-gup]',row).addEventListener('click',function(){if(i>0){var t=S.gallery[i];S.gallery[i]=S.gallery[i-1];S.gallery[i-1]=t;drawGal()}});
          $('[data-gdn]',row).addEventListener('click',function(){if(i<S.gallery.length-1){var t=S.gallery[i];S.gallery[i]=S.gallery[i+1];S.gallery[i+1]=t;drawGal()}});
          $('[data-grm]',row).addEventListener('click',function(){S.gallery.splice(i,1);drawGal()});
        });
      }
      async function up(file,kind,max){
        var blob;try{blob=await shrinkImage(file,max)}catch(_){toast('這張圖片無法讀取,請改用 JPG 或 PNG');return null}
        var path=id+'/'+kind+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)+'.jpg';
        var u=await sb.storage.from('product-media').upload(path,blob,{contentType:'image/jpeg',upsert:false});
        if(u.error){toast('上傳失敗:'+niceErr(u.error));return null}
        return path;
      }
      $e('[data-efile=cover]').addEventListener('change',async function(){
        var f=this.files&&this.files[0];this.value='';if(!f)return;
        var p=await up(f,'cover',1200);if(p){S.cover=p;drawCover();$e('[data-emsg]').textContent='封面已上傳,按「儲存內容」後才會套用到網站。'}
      });
      $e('[data-efile=gal]').addEventListener('change',async function(){
        var fs=Array.prototype.slice.call(this.files||[]);this.value='';
        for(var i=0;i<fs.length;i++){var p=await up(fs[i],'gal',1800);if(p)S.gallery.push({path:p,cap:''})}
        drawGal();if(fs.length)$e('[data-emsg]').textContent='圖片已上傳,按「儲存內容」後才會套用到網站。';
      });
      $e('[data-esave]').addEventListener('click',async function(){
        var intro=$e('[data-e=intro]').value.trim(),feats=linesToList($e('[data-e=feats]').value),toc=textToToc($e('[data-e=toc]').value);
        var mv=$e('[data-e=meta]').value.trim(),tv=$e('[data-e=tagline]').value.trim();
        var patch={
          meta:(!mv||mv===(g.dyn?'':(g.meta||'')))?null:mv,
          tagline:(!tv||tv===(g.dyn?'':(g.tagline||'')))?null:tv,
          cover_path:S.cover||null,
          intro:(!intro||intro===D.intro)?null:intro,
          feats:(!feats.length||same(feats,D.feats))?null:feats,
          toc:(!toc.length||same(toc,D.toc))?null:toc,
          gallery:same(S.gallery,D.gallery)?null:S.gallery.map(function(x){return x.path?{path:x.path,cap:x.cap||''}:{src:x.src,cap:x.cap||''}})
        };
        var u=await sb.from('products').update(patch).eq('id',id);
        if(u.error){toast('儲存失敗:'+niceErr(u.error));return}
        Object.assign(db,patch);
        var keep=[patch.cover_path].concat((patch.gallery||[]).map(function(x){return x.path})).filter(Boolean);
        var gone=orig.filter(function(p){return keep.indexOf(p)<0});
        if(gone.length){try{await sb.storage.from('product-media').remove(gone)}catch(_){}}
        orig=keep;
        toast('已儲存,網站教材頁會立刻更新');$e('[data-emsg]').textContent='';
      });
      $e('[data-ereset]').addEventListener('click',async function(){
        if(!window.confirm('要把「'+g.name+'」的封面、簡介、特色、目錄與內頁圖全部還原成網站內建的內容嗎?')){return}
        var u=await sb.from('products').update({meta:null,tagline:null,cover_path:null,intro:null,feats:null,toc:null,gallery:null}).eq('id',id);
        if(u.error){toast('還原失敗:'+niceErr(u.error));return}
        if(orig.length){try{await sb.storage.from('product-media').remove(orig)}catch(_){}}
        Object.assign(db,{meta:null,tagline:null,cover_path:null,intro:null,feats:null,toc:null,gallery:null});delete EDS[id];
        openEditor(id,host);toast('已還原為預設內容');
      });
      drawCover();drawGal();
    }
  };

  /* --- 課程 --- */
  TABS.c=async function(body){
    var cr=await selFb('courses','id,name,price,status,sort,intro,tagline,audience,cover_path','id,name,price,status,sort','sort');
    var chr=await sb.from('course_chapters').select('id,course_id,position,title,is_preview').order('position');
    var ids=(chr.data||[]).map(function(x){return x.id});
    var vr=ids.length?await sb.from('chapter_videos').select('chapter_id,youtube_id').in('chapter_id',ids):{data:[]};
    var vm={};(vr.data||[]).forEach(function(x){vm[x.chapter_id]=x.youtube_id});
    var h='';
    (cr.data||[]).forEach(function(c){
      var chs=(chr.data||[]).filter(function(x){return x.course_id===c.id});
      h+='<div class="ccfg" data-crow="'+esc(c.id)+'"><div class="ccfg-h"><b>'+esc(c.name)+'</b><label>狀態 <select data-f="status"><option value="draft"'+(c.status==='draft'?' selected':'')+'>籌備中</option><option value="open"'+(c.status==='open'?' selected':'')+'>開放報名</option></select></label><label>價格 NT$ <input type="number" min="0" step="10" data-f="price" value="'+c.price+'" style="width:90px"></label><button type="button" class="btn btn-line sm" data-csave="'+esc(c.id)+'">儲存</button></div><p class="mfoot" style="margin:0 0 8px">價格填 0 代表免費報名。</p>'+
        '<div class="twrap"><table class="tbl"><thead><tr><th>#</th><th>章節</th><th>YouTube 網址或影片代碼</th><th>試看</th><th></th></tr></thead><tbody>'+chs.map(function(ch){
          return '<tr data-ch="'+ch.id+'"><td>'+(ch.position+1)+'</td><td><input data-f="title" value="'+esc(ch.title)+'" maxlength="80"></td><td><input data-f="yt" value="'+esc(vm[ch.id]||'')+'" placeholder="https://youtu.be/…"></td><td><input type="checkbox" data-f="prev"'+(ch.is_preview?' checked':'')+' aria-label="試看"></td><td><button type="button" class="btn btn-line sm" data-chsave="'+ch.id+'">儲存</button></td></tr>'}).join('')+'</tbody></table></div><button type="button" class="btn btn-line sm" data-chadd="'+esc(c.id)+'" style="margin-top:8px">＋ 新增章節</button></div>';
    });
    var newC='<details class="addbox" id="cNewBox"><summary>＋ 新增課程</summary><form id="cNew" novalidate>'+
      '<label class="fld">課程名稱<input type="text" id="cnName" maxlength="40" placeholder="例如:會考作文衝刺班"></label>'+
      '<div class="row2"><label class="fld">價格 NT$(0 = 免費報名)<input type="number" id="cnPrice" min="0" step="10" value="0"></label><label class="fld">適合對象<input type="text" id="cnAud" maxlength="80" placeholder="例如:準備會考的國中生"></label></div>'+
      '<label class="fld">一句話標語<input type="text" id="cnTag" maxlength="120"></label>'+
      '<label class="fld">課程簡介<textarea id="cnIntro" rows="3" maxlength="1000"></textarea></label>'+
      '<button type="submit" class="btn btn-fill sm">建立課程</button> <span class="mfoot">建立後是「籌備中」。接著在下方新增章節、貼上 YouTube 網址,準備好再把狀態改成「開放報名」。</span></form></details>';
    body.innerHTML=newC+h+'<p class="mfoot">影片請在 YouTube 設為「不公開」,貼上網址即可。只有報名的學生(或標為試看的章節)能取得影片代碼。</p>';
    $('#cNew',body).addEventListener('submit',async function(ev){
      ev.preventDefault();
      var name=$('#cnName').value.trim(),price=parseInt($('#cnPrice').value,10);
      if(!name){toast('請輸入課程名稱');return}
      if(!(price>=0)){toast('請輸入正確的價格');return}
      var mx=(cr.data||[]).reduce(function(m,x){return Math.max(m,x.sort||0)},0);
      var row={id:'c'+Date.now().toString(36),name:name,price:price,status:'draft',sort:mx+1,intro:$('#cnIntro').value.trim()||null,tagline:$('#cnTag').value.trim()||null,audience:$('#cnAud').value.trim()||null};
      var ins=await sb.from('courses').insert(row);
      if(ins.error){toast('新增失敗:'+niceErr(ins.error));return}
      PUB.courses[row.id]=row;addDynCourse(row);
      var c1=await sb.from('course_chapters').insert({course_id:row.id,position:0,title:'第一章'});
      toast(c1.error?'已新增課程,但第一個章節建立失敗,請按「新增章節」':'已新增「'+name+'」(籌備中)。請接著編輯章節與影片。');
      TABS.c(body);
    });
    (cr.data||[]).forEach(function(c){
      var g=byId(GW.courses,c.id),box=$('[data-crow="'+c.id+'"]',body);
      if(!g||!box)return;
      var sd=(!g.dyn&&COURSE_SEED[c.id])||{};
      var mf=$('.mfoot',box);if(!mf)return;
      mf.insertAdjacentHTML('afterend','<div class="ccedit"><b>課程介紹(前台課程頁顯示)</b>'+
        '<label class="fld">一句話標語<input type="text" data-ce="tagline" maxlength="120"></label>'+
        '<label class="fld">課程簡介<textarea data-ce="intro" rows="4" maxlength="1000"></textarea></label>'+
        '<label class="fld">適合對象<input type="text" data-ce="audience" maxlength="80"></label>'+
        '<div>封面圖<img data-ccov alt="" hidden><label class="btn btn-line sm">上傳封面<input type="file" accept="image/*" data-cfile hidden></label> <small>建議橫式或直式皆可,太大的圖會自動縮小。</small></div>'+
        '<button type="button" class="btn btn-fill sm" data-cesave style="margin-top:10px">儲存課程介紹</button> <span class="mfoot" data-cemsg></span></div>');
      var ed=$('.ccedit',box),cover=c.cover_path||null,orig=c.cover_path||null;
      $('[data-ce=tagline]',ed).value=c.tagline||sd.tagline||'';$('[data-ce=intro]',ed).value=c.intro||sd.intro||'';$('[data-ce=audience]',ed).value=c.audience||sd.audience||'';
      var fbCov=g.dyn?'':'images/course-'+c.id+'.jpg';
      function drawC(){var im=$('[data-ccov]',ed);if(cover){im.src=mediaUrl(cover);im.hidden=false}else if(fbCov){im.src=fbCov;im.hidden=false}else im.hidden=true}
      drawC();
      $('[data-cfile]',ed).addEventListener('change',async function(){
        var f=this.files&&this.files[0];this.value='';if(!f)return;
        var blob;try{blob=await shrinkImage(f,1400)}catch(_){toast('這張圖片無法讀取,請改用 JPG 或 PNG');return}
        var path='course-'+c.id+'/cover-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)+'.jpg';
        var u=await sb.storage.from('product-media').upload(path,blob,{contentType:'image/jpeg',upsert:false});
        if(u.error){toast('上傳失敗:'+niceErr(u.error));return}
        if(cover&&cover!==orig){try{await sb.storage.from('product-media').remove([cover])}catch(_){}}
        cover=path;drawC();
        var sv=await sb.from('courses').update({cover_path:cover}).eq('id',c.id);
        if(sv.error){$('[data-cemsg]',ed).textContent='封面已上傳,但還沒儲存成功,請按「儲存課程介紹」。';return}
        if(orig&&orig!==cover){try{await sb.storage.from('product-media').remove([orig])}catch(_){}}
        orig=cover;c.cover_path=cover;if(PUB.courses[c.id])PUB.courses[c.id].cover_path=cover;
        $('[data-cemsg]',ed).textContent='';toast('封面已更新');
      });
      $('[data-cesave]',ed).addEventListener('click',async function(){
        var patch={tagline:$('[data-ce=tagline]',ed).value.trim()||null,intro:$('[data-ce=intro]',ed).value.trim()||null,audience:$('[data-ce=audience]',ed).value.trim()||null,cover_path:cover};
        var u=await sb.from('courses').update(patch).eq('id',c.id);
        if(u.error){toast('儲存失敗:'+niceErr(u.error));return}
        if(orig&&orig!==cover){try{await sb.storage.from('product-media').remove([orig])}catch(_){}}
        orig=cover;Object.assign(c,patch);Object.assign(PUB.courses[c.id]||{},patch);
        toast('已儲存課程介紹');$('[data-cemsg]',ed).textContent='';
      });
    });
    $$('[data-csave]',body).forEach(function(b){b.addEventListener('click',async function(){
      var box=b.closest('[data-crow]'),price=parseInt($('[data-f=price]',box).value,10);
      if(!(price>=0)){toast('請輸入正確的價格');return}
      var u=await sb.from('courses').update({status:$('[data-f=status]',box).value,price:price}).eq('id',b.getAttribute('data-csave'));
      toast(u.error?'儲存失敗:'+niceErr(u.error):'已儲存課程設定');
    })});
    $$('[data-chsave]',body).forEach(function(b){b.addEventListener('click',async function(){
      var tr=b.closest('tr'),id=+b.getAttribute('data-chsave'),raw=$('[data-f=yt]',tr).value.trim(),yid=parseYt(raw);
      if(raw&&!yid){toast('看不出這是 YouTube 網址,請確認');return}
      var u=await sb.from('course_chapters').update({title:$('[data-f=title]',tr).value.trim()||'未命名章節',is_preview:$('[data-f=prev]',tr).checked}).eq('id',id);
      if(u.error){toast('儲存失敗:'+niceErr(u.error));return}
      var v=yid?await sb.from('chapter_videos').upsert({chapter_id:id,youtube_id:yid},{onConflict:'chapter_id'}):await sb.from('chapter_videos').delete().eq('chapter_id',id);
      toast(v.error?'影片儲存失敗:'+niceErr(v.error):'已儲存章節');
    })});
    $$('[data-chadd]',body).forEach(function(b){b.addEventListener('click',async function(){
      var cid=b.getAttribute('data-chadd'),mx=(chr.data||[]).filter(function(x){return x.course_id===cid}).reduce(function(m,x){return Math.max(m,x.position)},-1);
      var u=await sb.from('course_chapters').insert({course_id:cid,position:mx+1,title:'新章節'});
      if(u.error){toast('新增失敗:'+niceErr(u.error));return}
      TABS.c(body);
    })});
  };

  /* --- 直播 --- */
  TABS.l=async function(body){
    try{await sb.rpc('purge_old_live')}catch(_){}
    var er=await sb.from('live_events').select('id,title,starts_at,kind,public_url,replay_url').order('starts_at',{ascending:false,nullsFirst:true}).limit(60);
    var ids=(er.data||[]).map(function(x){return x.id});
    var lr=ids.length?await sb.from('live_links').select('event_id,url,replay_url').in('event_id',ids):{data:[]};
    var lm={};(lr.data||[]).forEach(function(x){lm[x.event_id]=x});
    var sr=await sb.from('site_settings').select('key,value').eq('key','live_retention_days');
    var days=(sr.data&&sr.data[0]&&typeof sr.data[0].value==='number')?sr.data[0].value:90;
    var loc=function(t){if(!t)return '';var d=new Date(t);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)};
    body.innerHTML='<form id="lForm" novalidate style="margin-bottom:18px"><h3>新增直播</h3><div class="row2"><label class="fld" for="lKind">類型<select id="lKind"><option value="member">會員限定</option><option value="public">公開(所有人可看)</option></select></label><label class="fld" for="lAt">開播時間<input id="lAt" type="datetime-local"></label></div><label class="fld" for="lTitle">標題<input id="lTitle" maxlength="80" placeholder="例如:10/30 學測國寫衝刺直播"></label><label class="fld" for="lUrl">直播網址(YouTube)<input id="lUrl" placeholder="https://youtube.com/live/…"></label><label class="fld" for="lRep">回放網址(選填。不填的話,直播結束後會沿用直播網址,YouTube 會自動變成回放)<input id="lRep" placeholder="https://youtu.be/…"></label><div class="err" id="lErr" role="alert"></div><button class="btn btn-fill" type="submit">新增</button></form>'+
      '<div class="twrap"><table class="tbl"><thead><tr><th>類型</th><th>標題</th><th>開播</th><th>直播網址</th><th>回放網址</th><th></th></tr></thead><tbody>'+(er.data||[]).map(function(e){
        var u=e.kind==='public'?e.public_url:(lm[e.id]&&lm[e.id].url),rp=e.kind==='public'?e.replay_url:(lm[e.id]&&lm[e.id].replay_url);
        return '<tr data-ev="'+e.id+'" data-kind="'+esc(e.kind||'member')+'"><td>'+(e.kind==='public'?'公開':'會員限定')+'</td><td>'+esc(e.title)+'</td><td><input type="datetime-local" data-f="at" value="'+esc(loc(e.starts_at))+'"></td><td><input data-f="url" value="'+esc(u||'')+'" style="min-width:200px"></td><td><input data-f="rep" value="'+esc(rp||'')+'" style="min-width:200px" placeholder="選填"></td><td><button type="button" class="btn btn-line sm" data-lsave="'+e.id+'">儲存</button> <button type="button" class="btn btn-line sm" data-ldel="'+e.id+'">刪除</button></td></tr>'}).join('')+((er.data||[]).length?'':'<tr><td colspan="6" class="none">還沒有直播</td></tr>')+'</tbody></table></div>'+
      '<h3 style="margin-top:22px">會員直播觀看紀錄</h3><div id="lViews"><p class="mfoot">讀取中…</p></div>'+
      '<form id="lRet" class="fm" style="max-width:520px;margin-top:22px"><h3>自動刪除舊的直播紀錄</h3><label class="fld" for="lDays">直播紀錄保留天數(填 0 代表不自動刪除)<input id="lDays" type="number" min="0" max="3650" step="1" value="'+days+'" style="width:120px"></label><p class="mfoot">超過天數的直播紀錄(含回放網址)每天會自動刪除。只會刪除本網站上的紀錄,YouTube 上的影片不受影響。</p><button class="btn btn-line sm" type="submit" style="align-self:flex-start">儲存</button></form>';
    function okUrl(u){try{var x=new URL(u);return /^https?:$/.test(x.protocol)}catch(e){return false}}
    function checkUrls(u,rp){
      if(!okUrl(u))return '請貼上完整的直播網址(https://…)。';
      if(!ytId(u))return '目前只支援 YouTube 網址。';
      if(rp&&!okUrl(rp))return '回放網址格式不正確。';
      if(rp&&!ytId(rp))return '回放網址目前只支援 YouTube。';
      return '';
    }
    $('#lForm').addEventListener('submit',async function(e){
      e.preventDefault();var er2=$('#lErr'),t=$('#lTitle').value.trim(),u=$('#lUrl').value.trim(),rp=$('#lRep').value.trim(),at=$('#lAt').value,kind=$('#lKind').value;
      if(!t){er2.textContent='請填寫標題。';return}
      var bad=checkUrls(u,rp);if(bad){er2.textContent=bad;return}
      var row={title:t,kind:kind,starts_at:at?new Date(at).toISOString():null};
      if(kind==='public'){row.public_url=u;row.replay_url=rp||null}
      var ins=await sb.from('live_events').insert(row).select('id').single();
      if(ins.error){er2.textContent='新增失敗:'+niceErr(ins.error);return}
      if(kind==='member'){
        var lk=await sb.from('live_links').insert({event_id:ins.data.id,url:u,replay_url:rp||null});
        if(lk.error){await sb.from('live_events').delete().eq('id',ins.data.id);er2.textContent='新增失敗:'+niceErr(lk.error);return}
      }
      toast('已新增直播');TABS.l(body);
    });
    $$('[data-lsave]',body).forEach(function(b){b.addEventListener('click',async function(){
      var tr=b.closest('tr'),id=+b.getAttribute('data-lsave'),kind=tr.getAttribute('data-kind'),u=$('[data-f=url]',tr).value.trim(),rp=$('[data-f=rep]',tr).value.trim(),at=$('[data-f=at]',tr).value;
      var bad=checkUrls(u,rp);if(bad){toast(bad);return}
      var patch={starts_at:at?new Date(at).toISOString():null};
      if(kind==='public'){patch.public_url=u;patch.replay_url=rp||null}
      var r1=await sb.from('live_events').update(patch).eq('id',id);
      if(r1.error){toast('儲存失敗:'+niceErr(r1.error));return}
      if(kind!=='public'){var r2=await sb.from('live_links').upsert({event_id:id,url:u,replay_url:rp||null},{onConflict:'event_id'});if(r2.error){toast('儲存失敗:'+niceErr(r2.error));return}}
      toast('已更新');
    })});
    $$('[data-ldel]',body).forEach(function(b){b.addEventListener('click',async function(){
      if(b.getAttribute('data-ask')!=='1'){b.setAttribute('data-ask','1');b.textContent='再按一次刪除';return}
      var r2=await sb.from('live_events').delete().eq('id',+b.getAttribute('data-ldel'));
      if(r2.error)toast('刪除失敗:'+niceErr(r2.error));else TABS.l(body);
    })});
    (async function(){
      var box=$('#lViews');if(!box)return;
      var mem=(er.data||[]).filter(function(e){return e.kind!=='public'});
      var vr=mem.length?await sb.from('live_views').select('event_id,user_id,first_at,last_at,plays').in('event_id',mem.map(function(e){return e.id})):{data:[]};
      var vs=vr.data||[],uids=[];vs.forEach(function(v){if(uids.indexOf(v.user_id)<0)uids.push(v.user_id)});
      var pr=uids.length?await sb.from('profiles').select('id,name,email').in('id',uids):{data:[]},pm={};(pr.data||[]).forEach(function(x){pm[x.id]=x});
      if(!mem.length){box.innerHTML='<p class="mfoot">還沒有會員限定直播。</p>';return}
      box.innerHTML=mem.map(function(e){
        var l=vs.filter(function(v){return v.event_id===e.id}).sort(function(a,b){return new Date(a.first_at)-new Date(b.first_at)});
        return '<details class="lvw"><summary>'+esc(e.title)+(e.starts_at?'('+esc(fmtDT(e.starts_at))+')':'')+' <b>'+l.length+' 人觀看</b></summary>'+(l.length?'<ul>'+l.map(function(v){var p=pm[v.user_id]||{};return '<li>'+esc(p.name||'(未命名)')+' <span>'+esc(p.email||'')+'</span>・首次 '+esc(fmtDT(v.first_at))+'・共進入 '+v.plays+' 次</li>'}).join('')+'</ul>':'<p class="mfoot">還沒有人觀看。</p>')+'</details>';
      }).join('')+'<p class="mfoot">只記錄付費會員打開會員場次的播放器;老師預覽不計入。直播紀錄被自動刪除時,觀看紀錄會一起刪除。</p>';
    })();
    $('#lRet').addEventListener('submit',async function(e){
      e.preventDefault();var n=parseInt($('#lDays').value,10);
      if(!(n>=0&&n<=3650)){toast('請輸入 0 到 3650 之間的天數');return}
      var r2=await sb.from('site_settings').upsert({key:'live_retention_days',value:n,updated_at:new Date().toISOString()},{onConflict:'key'});
      if(r2.error){toast('儲存失敗:'+niceErr(r2.error));return}
      try{await sb.rpc('purge_old_live')}catch(_){}
      toast(n?'已儲存,超過 '+n+' 天的直播紀錄會自動刪除':'已儲存,不會自動刪除');TABS.l(body);
    });
  };

  /* --- 設定 --- */
  /* --- 公告(送出後會推播給所有已開啟手機通知的人) --- */
  TABS.n=async function(body){
    var r=await sb.from('announcements').select('id,title,body,url,created_at').order('created_at',{ascending:false}).limit(30);
    if(r.error)throw r.error;
    var pages={'':'會員專區','live.html':'直播專區','courses.html':'線上課程','membership.html':'付費會員','index.html':'首頁'};
    body.innerHTML='<form id="nForm" class="fm" novalidate style="max-width:560px;margin-bottom:22px"><h3>發送公告</h3>'+
      '<label class="fld" for="nT">標題(最多 40 字)<input id="nT" maxlength="40" placeholder="例如:本週六加開一場直播"></label>'+
      '<label class="fld" for="nB">內容(最多 120 字)<textarea id="nB" rows="3" maxlength="120" placeholder="手機通知會顯示這段文字"></textarea></label>'+
      '<label class="fld" for="nU">點通知後前往<select id="nU">'+Object.keys(pages).map(function(k){return '<option value="'+k+'">'+pages[k]+'</option>'}).join('')+'</select></label>'+
      '<p class="err" id="nErr" role="alert"></p><button class="btn btn-fill" type="submit">送出並推播</button>'+
      '<p class="mfoot">送出後,所有已開啟手機通知的人會立刻收到;其他人進會員專區的「我的課程」也看得到最近 30 天的公告。送出後無法收回已推出的通知。</p></form>'+
      '<h3>已發送的公告</h3>'+((r.data||[]).length?'<div class="twrap"><table class="tbl"><thead><tr><th>日期</th><th>標題</th><th>內容</th><th></th></tr></thead><tbody>'+(r.data||[]).map(function(a){
        return '<tr><td>'+fmtDate(a.created_at)+'</td><td>'+esc(a.title)+'</td><td>'+esc(a.body)+'</td><td><button type="button" class="btn btn-line sm" data-ndel="'+a.id+'">刪除</button></td></tr>'}).join('')+'</tbody></table></div>':'<p class="mfoot">還沒有發送過公告。</p>');
    $('#nForm').addEventListener('submit',async function(e){
      e.preventDefault();var er=$('#nErr'),t=$('#nT').value.trim(),b=$('#nB').value.trim(),u=$('#nU').value;
      if(!t||!b){er.textContent='請填寫標題和內容。';return}
      var btn=$('button[type=submit]',this);btn.disabled=true;er.textContent='';
      var ins=await sb.from('announcements').insert({title:t,body:b,url:u||null,created_by:U.id});
      btn.disabled=false;
      if(ins.error){er.textContent='發送失敗:'+niceErr(ins.error);return}
      toast('已發送公告,手機通知會在幾秒內送出');TABS.n(body);
    });
    $$('[data-ndel]',body).forEach(function(b){b.addEventListener('click',async function(){
      if(b.getAttribute('data-ask')!=='1'){b.setAttribute('data-ask','1');b.textContent='再按一次刪除';return}
      var d=await sb.from('announcements').delete().eq('id',+b.getAttribute('data-ndel'));
      if(d.error)toast('刪除失敗:'+niceErr(d.error));else TABS.n(body);
    })});
  };

  TABS.s=async function(body){
    var pr=await sb.from('plans').select('id,name,amount,period_type,frequency,exec_times,active,sort').order('sort');
    var sr=await sb.from('site_settings').select('key,value');
    var st={};(sr.data||[]).forEach(function(x){st[x.key]=x.value});
    body.innerHTML='<h3>付費會員方案</h3><div class="twrap"><table class="tbl"><thead><tr><th>方案</th><th>金額(NT$)</th><th>扣款週期</th><th>開放</th><th></th></tr></thead><tbody>'+(pr.data||[]).map(function(p){
      return '<tr data-plan="'+esc(p.id)+'"><td>'+esc(p.name)+'</td><td><input type="number" min="1" step="10" data-f="amount" value="'+p.amount+'" style="width:100px"></td><td>每 '+p.frequency+' '+(p.period_type==='Y'?'年':p.period_type==='M'?'個月':'天')+',最多 '+p.exec_times+' 期</td><td><input type="checkbox" data-f="active"'+(p.active?' checked':'')+' aria-label="開放"></td><td><button type="button" class="btn btn-line sm" data-psave="'+esc(p.id)+'">儲存</button></td></tr>'}).join('')+'</tbody></table></div><p class="mfoot">已經在扣款的訂閱者,金額不會跟著改(綠界以下單當時的金額為準)。價格確認後把「開放」打勾,網站才會顯示並開放加入。</p>'+
      '<h3 style="margin-top:22px">網站設定</h3><form id="sForm" class="fm" style="max-width:520px"><label class="fld" style="flex-direction:row;gap:10px;align-items:center"><input type="checkbox" id="sPay"'+(st.payments_enabled===true?' checked':'')+'> 開放線上付款(教材、付費會員、付費課程)</label><label class="fld" for="sLine">LINE 官方帳號連結<input id="sLine" value="'+esc(st.line_url||'')+'" placeholder="https://lin.ee/…"></label><label class="fld" for="sYt">YouTube 頻道網址(公開直播)<input id="sYt" value="'+esc(st.youtube_url||'')+'" placeholder="https://www.youtube.com/@…"></label><div class="err" id="sErr" role="alert"></div><button class="btn btn-fill" type="submit" style="align-self:flex-start">儲存</button></form>';
    body.insertAdjacentHTML('beforeend','<h3 style="margin-top:26px">資料備份</h3><div class="bkbox"><p class="mfoot" style="margin:0 0 10px">把網站所有資料表(會員、作文與評語、訂單、課程、直播…)匯出成一個檔案存到你的電腦。建議每月備份一次,出大改動前也先備份。檔案內有學生個資,請存放在安全的地方,不要上傳到公開處。作文與封面的圖片檔本身不在其中,檔案內只有它們的路徑。</p><button type="button" class="btn btn-line" id="bkGo">下載資料備份</button> <span class="mfoot" id="bkMsg" role="status"></span></div>');
    $('#bkGo').addEventListener('click',async function(){
      var bt=this,msg=$('#bkMsg');bt.disabled=true;msg.textContent='備份中…';
      var TB=['profiles','admin_emails','site_settings','plans','memberships','products','courses','course_chapters','chapter_videos','enrollments','progress','orders','order_items','payments','product_categories','essays','essay_files','feedback_templates','resources','resource_claims','live_events','live_links','live_views','announcements','contact_messages','ocr_usage'];
      var out={exported_at:new Date().toISOString(),site:location.host,tables:{},errors:{}},total=0;
      try{
        for(var i=0;i<TB.length;i++){
          var rows=[],from=0;
          for(var pg=0;pg<50;pg++){
            var r=await sb.from(TB[i]).select('*').range(from,from+999);
            if(r.error){out.errors[TB[i]]=niceErr(r.error);break}
            var d=r.data||[];rows=rows.concat(d);if(d.length<1000)break;from+=1000;
          }
          out.tables[TB[i]]=rows;total+=rows.length;
          msg.textContent='備份中… '+(i+1)+' / '+TB.length;
        }
        var blob=new Blob([JSON.stringify(out,null,1)],{type:'application/json'});
        var d0=new Date(),ds=d0.getFullYear()+('0'+(d0.getMonth()+1)).slice(-2)+('0'+d0.getDate()).slice(-2);
        var a2=document.createElement('a');a2.href=URL.createObjectURL(blob);a2.download='guowen-backup-'+ds+'.json';document.body.appendChild(a2);a2.click();
        setTimeout(function(){URL.revokeObjectURL(a2.href);a2.remove()},1500);
        var ne=Object.keys(out.errors).length;
        msg.textContent='已下載備份(共 '+total+' 筆資料'+(ne?',有 '+ne+' 個資料表讀取失敗:'+Object.keys(out.errors).join('、'):'')+')';
      }catch(ex){msg.textContent='備份失敗:'+niceErr(ex)}
      bt.disabled=false;
    });
    $$('[data-psave]',body).forEach(function(b){b.addEventListener('click',async function(){
      var tr=b.closest('tr'),amt=parseInt($('[data-f=amount]',tr).value,10);
      if(!(amt>0)){toast('請輸入正確的金額');return}
      var u=await sb.from('plans').update({amount:amt,active:$('[data-f=active]',tr).checked}).eq('id',b.getAttribute('data-psave'));
      toast(u.error?'儲存失敗:'+niceErr(u.error):'已儲存方案');
    })});
    $('#sForm').addEventListener('submit',async function(e){
      e.preventDefault();var er2=$('#sErr'),a=$('#sLine').value.trim(),b2=$('#sYt').value.trim();
      function ok(u){if(!u)return true;try{return /^https?:$/.test(new URL(u).protocol)}catch(x){return false}}
      if(!ok(a)||!ok(b2)){er2.textContent='請貼上完整網址(https://…),或留空。';return}
      var r2=await sb.from('site_settings').upsert([{key:'payments_enabled',value:$('#sPay').checked,updated_at:new Date().toISOString()},{key:'line_url',value:a,updated_at:new Date().toISOString()},{key:'youtube_url',value:b2,updated_at:new Date().toISOString()}],{onConflict:'key'});
      if(r2.error){er2.textContent='儲存失敗:'+niceErr(r2.error);return}
      er2.textContent='';toast('已儲存');
    });
  };
  onAuth.push(render);render();
}

/* ---------- 聯絡表單 ---------- */
var cf=$('#contactForm');
if(cf)cf.addEventListener('submit',async function(e){
  e.preventDefault();var err=$('#cErr'),hp=$('#cHp');
  if(hp&&hp.value)return;
  if(!$('#cName').value.trim()){err.textContent='請輸入姓名。';return}
  if(!CAN_EMAIL.test($('#cMail').value.trim())){err.textContent='請輸入正確的 Email。';return}
  if(!$('#cMsg').value.trim()){err.textContent='請簡單寫下想詢問的內容。';return}
  if(!sb){err.textContent='留言功能暫時無法使用,請先用 LINE 聯繫我們。';return}
  var btn=cf.querySelector('button[type=submit]');btn.disabled=true;
  var topic=$('#cTopic')?$('#cTopic').value:'';
  var r=await sb.from('contact_messages').insert({name:$('#cName').value.trim().slice(0,60),email:$('#cMail').value.trim().slice(0,120),message:((topic?'【'+topic+'】':'')+$('#cMsg').value.trim()).slice(0,2000)});
  btn.disabled=false;
  if(r.error){err.textContent='送出失敗,請稍後再試或改用 LINE 聯繫。';return}
  err.textContent='';cf.reset();toast('已收到你的留言,我們會盡快回覆');
});

initMembership();initLive();initCourse();initLearn();initCart();initRes();initEssay();initMember();initAdmin();
boot();

/* ---------- 搜尋 ---------- */
var sDlg=$('#searchDlg'),sInput=$('#sInput'),sRes=$('#sRes');
function doSearch(){
  var q=sInput.value.trim().toLowerCase();
  var hits=GW.index.filter(function(x){return !q||(x.name+x.desc+x.text).toLowerCase().indexOf(q)>-1}).slice(0,9);
  sRes.innerHTML=hits.length?hits.map(function(h){return '<a class="sit" href="'+h.url+'"><em>'+h.kind+'</em><span><b>'+esc(h.name)+'</b><small>'+esc(h.desc)+'</small></span></a>'}).join(''):'<div class="empty">找不到相關內容,換個關鍵字試試。</div>';
}
var searchBtn=$('#searchBtn');
if(searchBtn&&sDlg){searchBtn.addEventListener('click',function(){showDlg(sDlg);sInput.value='';doSearch();setTimeout(function(){sInput.focus()},30)});sInput.addEventListener('input',doSearch)}

/* ---------- 成果數字 ---------- */
var statsEl=$('#stats');
if(statsEl){
  var statHTML=function(n,u){return n+'<small style="font-size:14px;font-weight:500;margin-left:2px">'+u+'</small>'};
  if('IntersectionObserver' in window&&!reduce){
    var counted=false;
    $$('b',statsEl).forEach(function(b){b.innerHTML=statHTML(0,b.getAttribute('data-u'))});
    new IntersectionObserver(function(es,ob){es.forEach(function(e){
      if(e.isIntersecting&&!counted){counted=true;ob.disconnect();
        $$('b',statsEl).forEach(function(b){var n=+b.getAttribute('data-n'),u=b.getAttribute('data-u'),t0=performance.now();
          (function step(t){var p=Math.min(1,(t-t0)/1200),v=Math.round(n*(1-Math.pow(1-p,3)));b.innerHTML=statHTML(v,u);if(p<1)requestAnimationFrame(step)})(t0)});
      }})},{threshold:.5}).observe(statsEl);
  }
}


/* ---------- 質感與動態(尊重「減少動態效果」設定) ---------- */
(function(){
  var reducedFx=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ft=$('.footer');if(ft&&typeof footerMtn==='function')ft.insertAdjacentHTML('afterbegin',footerMtn());
  // 捲動進度:頁首底部一條細墨線
  var hd=$('#siteHeader'),ticking=false;
  function prog(){ticking=false;var h=document.documentElement,m=h.scrollHeight-h.clientHeight;if(hd)hd.style.setProperty('--p',(m>0?h.scrollTop/m:0).toFixed(4))}
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(prog)}},{passive:true});prog();
  if(reducedFx)return;
  document.documentElement.classList.add('fx');
  // 區塊進場:墨暈般由模糊轉清晰
  if('IntersectionObserver' in window){
    var sel='.sec-head,.pcard,.course,.rcard,.plan,.flow .step,.twocol .box,.band,.ccard,.panel,.tile,.faq details,.pd-cover,.pd-info>*';
    var els=$$(sel).filter(function(e){return !e.closest('.hero')&&!e.closest('dialog')});
    var seen=new Map();
    els.forEach(function(e){var p=e.parentNode,i=seen.get(p)||0;seen.set(p,i+1);e.classList.add('rv');e.style.setProperty('--rd',Math.min(i,7)*70+'ms')});
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var t=x.target;t.classList.add('in');io.unobserve(t);setTimeout(function(){t.classList.remove('rv','in');t.style.removeProperty('--rd')},1700)}})},{rootMargin:'0px 0px -6% 0px',threshold:.08});
    els.forEach(function(e){io.observe(e)});
    // 保險:3 秒後仍未顯示的一律顯示
    setTimeout(function(){els.forEach(function(e){if(e.classList.contains('rv'))e.classList.add('in')})},3500);
  }
  // 視差:首頁山水隨滑鼠與捲動,頁首橫幅隨捲動
  var home=$('#home'),px=$$('.px',home||document),tx=0,ty=0,cx=0,cy=0,raf=0;
  function loop(){raf=0;cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
    var sy=Math.min(window.scrollY,700)/700;
    px.forEach(function(g){var k=+g.getAttribute('data-k')||0;g.style.transform='translate('+(cx*k).toFixed(2)+'px,'+(cy*k*.5+sy*k*1.6).toFixed(2)+'px)'});
    if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)raf=requestAnimationFrame(loop)}
  if(home&&px.length){
    home.addEventListener('pointermove',function(e){var b=home.getBoundingClientRect();tx=((e.clientX-b.left)/b.width-.5)*2;ty=((e.clientY-b.top)/b.height-.5)*2;if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
    home.addEventListener('pointerleave',function(){tx=0;ty=0;if(!raf)raf=requestAnimationFrame(loop)});
    window.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
  }
  var arts=$$('.phero .art');
  if(arts.length){var t2=false;window.addEventListener('scroll',function(){if(t2)return;t2=true;requestAnimationFrame(function(){t2=false;var y=Math.min(window.scrollY,420)*.1;arts.forEach(function(a){a.style.transform='translateY('+y.toFixed(1)+'px)'})})},{passive:true})}
})();

})();
