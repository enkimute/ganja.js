  /** Ganja.js - Geometric Algebra - not just algebra.  (The worlds smallest Geometric Algebra Implementation Generator)
    * @author Enki
    * @link   https://github.com/enkimute/ganja.js
    */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && define.amd) define(name, definition);
  else context[name] = definition();
}('Algebra', this, function () {
  return function Algebra(p,q,r) {
  // p can be options object.
    var fu=arguments[arguments.length-1],options=p; if (options instanceof Object) {
      q = (p.q || (p.metric && p.metric.filter(x=>x==-1).length))| 0;
      r = (p.r || (p.metric && p.metric.filter(x=>x==0).length)) | 0;
      p = p.p === undefined ? (p.metric && p.metric.filter(x=>x==1).length) : p.p || 0;
    } else { options={}; p=p|0; r=r|0; q=q|0; };
  // Initialise basis names and multiplication table.
    var tot = options.tot||(p||0)+(q||0)+(r||0)||options.basis.length,                                                                      // p = #dimensions that square to 1, q to -1, r to 0.
        basis=options.basis||Array.apply([],{length:2**tot})                                                                                // => [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
              .map((x,xi)=>(((1<<20)+xi).toString(2)).slice(-tot||-1)                                                                       // => ["000", "001", "010", "011", "100", "101", "110", "111"]  (index of array in base 2)
              .replace(/./g,(a,ai)=>a=='0'?'':ai+1-(r==0?0:1)))                                                                             // => ["", "3", "2", "23", "1", "13", "12", "123"] (1 bits replaced with their positions, 0's removed)
              .sort((a,b)=>(a.toString().length==b.toString().length)?(a|0)-(b|0):a.toString().length-b.toString().length)                  // => ["", "1", "2", "3", "12", "13", "23", "123"] (sorted numerically)
              .map(x=>x&&'e'+x||'1'),                                                                                                       // => ["1", "e1", "e2", "e3", "e12", "e13", "e23", "e123"] (converted to commonly used basis names)
        low=basis.join('').split('').filter(x=>x.match(/\d/)).sort()[0]*1,                                                                  // lowest x in ex basis names.      
        grades=basis.map(x=>x.length-1),                                                                                                    // => [0, 1, 1, 1, 2, 2, 2, 3] (grade per basis blade)
        grade_start=grades.map((a,b,c)=>c[b-1]!=a?b:-1).filter(x=>x+1).concat([basis.length]),                                              // =>  [0, 1, 4, 7, 8] (first blade of given grade, with extra stop element)
        simplify = (s,p,q,r)=>{                                                                                                             // implement ex*ey=-ey*ex (for x!=y) and ex*ex=metric[x] 
          var sign=1,c,l,t=[],f=true;s=[].slice.call(s.replace(/e/g,''));l=s.length;
          while (f) { f=false;
            for (var i=0; i<l;) if (s[i]===s[i+1]) { if ((s[i]-low)>=(p+r)) sign*=-1; else if ((s[i]-low)<r) sign*=0; i+=2; f=true; } else t.push(s[i++]);
            for (var i=0; i<t.length-1; i++) if (t[i]>t[i+1]) { c=t[i];t[i]=t[i+1];t[i+1]=c;sign*=-1;f=true; break;} if (f) { s=t;t=[];l=s.length; }
          }
          var ret=(sign==0)?'0':((sign==1)?'':'-')+(t.length?'e'+t.join(''):'1'); return (brm&&brm[ret])||(brm&&brm['-'+ret]&&'-'+brm['-'+ret])||ret;
        },
        brm=(x=>{ var ret={}; for (var i in basis) ret[basis[i]=='1'?'1':simplify(basis[i],p,q,r)] = basis[i]; return ret; })(basis),      
        drm=basis.map((a,i)=>{ return {a:a,i:i} }).sort((a,b)=>a.a.length>b.a.length?1:a.a.length<b.a.length?-1:(+a.a.slice(1).split('').sort().join(''))-(+b.a.slice(1).split('').sort().join('')) ).map(x=>x.i).reverse(),
        mulTable  = options.Cayley||basis.map(x=>basis.map(y=>(x==1)?y:(y==1)?x:simplify(x+y,p,q,r))),                                      // Generate Cayley multiplication table.
        mulTable2 = options.Cayley||basis.map(x=>basis.map(y=>(x==1)?y:(y==1)?x:simplify(x+y,p+q+r,0,0))),                                  // Generate Cayley multiplication table.
        metric = basis.map((x,xi)=>mulTable[xi][xi]|0),                                                                                     // extended metric .. per basis blade (not just for the 1D subspaces) .. diagonal of cayley table.
        gp=basis.map(x=>basis.map(x=>'0')), cp=gp.map(x=>gp.map(x=>'0')), op=gp.map(x=>gp.map(x=>'0'));                                     // Storage for our product tables.
  // Convert Caeyley table to product matrices.           
    basis.forEach((output,i)=>basis.forEach((x,xi)=>basis.forEach((y,yi)=>{ if (mulTable2[xi][yi].replace('-','') == output) {              // For each output component scan Cayley table.
        gp[i][xi] = (mulTable2[xi][yi]=='0')?'0':((mulTable2[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']';                             // Fill in the geometric table         
        op[i][xi] = ( grades[i] == grades[xi]+grades[yi] ) ? gp[i][xi]:'0';                                                                 // strict sum of grades in outer
        if ((mulTable[xi][yi].replace('-','') == output)||(mulTable[xi][yi]=='0')) {
          gp[i][xi] = (mulTable[xi][yi]=='0')?'0':((mulTable[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']';                             // Fill in the geometric table
          cp[i][xi] = ( grades[i] == grades[yi]-grades[xi] ) ? gp[i][xi]:'0';                                                               // strict diff of grades in inner
        }  
    }})));
  // Generate a new class for our algebra.
    var res = class Element extends (options.baseType||Float32Array) {                                                                                        // Our elements will be Float32Arrays.
    // constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a||basis.length); return this; }                                                                                                 // Construct with correct default lenght.
      Blade(grade,res) { var res=res||new Element(); for (var i=0,l=res.length; i<l; i++) if (grades[i]==grade) res[i]=this[i]; else res[i]=0; return res; }  // Construct a pure blade of given grade from a multivector.
      Div  (b,res) { return this.Mul(b.Inverse,res); }                                                                                                        // right inverse assumed here.
      LDiv (b,res) { return b.Inverse.Mul(this,res); }                                                                                                        // left inverse assumed here.
      Exp  ()      { var r = Element.Scalar(1), y=1, M= new Element(this), N=new Element(this); for (var x=1; x<15; x++) { r=r.Add(M.Mul(Element.Scalar(1/y))); M=M.Mul(N); y=y*(x+1); }; return r; } // do something smarter.
      Map  (a,b  ) { var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*(((a===grades[i])||(b===grades[i]))?-1:1); return res; } // for inverse calculations.
      get Vector ()    { return this.slice(grade_start[1],grade_start[2]); };
    // Factories - Make it easy to generate blades.
      static Element()   { var res = new Element(); for (var i=0; i<res.length; i++) res[i]=arguments[i]||0; return res; }                                    // Create a fully specified element.
      static Coeff()  { var res = new Element(), i=0; while(i<arguments.length) res[arguments[i++]]=arguments[i++]; return res; }
      static Scalar(x)   { var res = new Element(); res[0]=x; return res; }                                                                                   // Create a scalar element.
      static Vector()    { var res = new Element(); res.set(arguments,grade_start[1]); return res; }                                                          // Create a vector element.
      static Bivector()  { var res = new Element(); res.set(arguments,grade_start[2]); return res; }                                                          // Create a bivector element.
      static Trivector() { var res = new Element(); res.set(arguments,grade_start[3]); return res; }                                                          // Create a trivector element.
      static nVector(n)  { var res = new Element(); res.set([].slice.call(arguments,1),grade_start[n]); return res; }                                         // Create an nVector of desired grade.
    // Static operators (easier integration with scalars when using inline operator overloading)
      static toEl(x)        { if (x instanceof Function) x=x(); if (x instanceof Array) return new Element(x); if (!(x instanceof Element)) x=Element.Scalar(x); return x; }
      static Add(a,b,res)   {  a=a.call?a():a; b=b.call?b():b; if ((a instanceof Array)^(b instanceof Array)) return (a instanceof Array)?a.map(x=>Element.Add(x,b)):b.map(x=>Element.Add(a,x)); if ((a instanceof Array)&&(b instanceof Array)&&a.length==b.length) return a.map((x,xi)=>Element.Add(x,b[xi])); if ((typeof a=='string')||(typeof b=='string')) return a.toString()+b.toString(); if (!(a instanceof Element || b instanceof Element)) return a+b; res=res||new Element(); a=Element.toEl(a); b=Element.toEl(b); for(var i=0;i<res.length;i++)res[i]=a[i]+b[i]; return res; }
      static Sub(a,b,res)   {  a=a.call?a():a; b=(b&&b.call)?b():b; if (b && ((a instanceof Array)^(b instanceof Array))) return (a instanceof Array)?a.map(x=>Element.Sub(x,b)):b.map(x=>Element.Sub(a,x)); if (b&&(a instanceof Array)&&(b instanceof Array)&&a.length==b.length) return a.map((x,xi)=>Element.Sub(x,b[xi])); if (arguments.length==1) return Element.Mul(a,-1); if (!(a instanceof Element || b instanceof Element)) return a-b; res=res||new Element(); a=Element.toEl(a); b=Element.toEl(b); for(var i=0;i<res.length;i++)res[i]=a[i]-b[i]; return res; }
      static Mul(a,b,res)   {  a=a.call?a():a; b=b.call?b():b; if ((a instanceof Array)&&(b instanceof Array)) { if(!(a[0] instanceof Array)&&!(b[0] instanceof Array)) { var r=tot?Element.Scalar(0):0; a.forEach((x,i)=>r=Element.Add(r,Element.Mul(x,b[i]))); return r; } else if (!(b[0] instanceof Array)) return a.map((x,i)=>Element.Mul(a[i],b)); var r=a.map((x,i)=>b[0].map((y,j)=>{ var r=tot?Element.Scalar(0):0; x.forEach((xa,k)=>r=Element.Add(r,Element.Mul(xa,b[k][j]))); return r; })); if (r.length==1 && r[0].length==1) return r[0][0]; else return r;  } 
                               else if ((a instanceof Array)^(b instanceof Array)) return (a instanceof Array)?a.map(x=>Element.Mul(x,b)):b.map(x=>Element.Mul(a,x)); var r=a*b; if (!isNaN(r)) return r; a=Element.toEl(a); b=Element.toEl(b); return a.Mul(b,res); }  
      static Div(a,b,res)   {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a/b; a=Element.toEl(a);b=Element.toEl(b); return a.Div(b,res); }  
      static Pow(a,b,res)   {  a=a.call?a():a; b=b.call?b():b; if (a.length==1 && a[0].length==1) return [[Element.Pow(a[0][0],b)]]; if (!(a instanceof Element || b instanceof Element)) return a**b; if (a==Math.E) return b.Exp(); a=Element.toEl(a); if (b==-1) return a.Inverse; if (b==2) return a.Mul(a,res); return a.Pow(b); }  
      static Dot(a,b,res)   {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a*b; a=Element.toEl(a);b=Element.toEl(b); return a.Dot(b,res); }  
      static Wedge(a,b,res) {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a*b; a=Element.toEl(a);b=Element.toEl(b); return a.Wedge(b,res); }  
      static Vee(a,b,res)   {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a*b; a=Element.toEl(a);b=Element.toEl(b); return a.Vee(b,res); }  
      static Dual(a)        {  if (r) return Element.toEl(a).map((x,i,a)=>a[drm[i]]); return Element.toEl(a).Dual; }; static Involute(a) { return Element.toEl(a).Involute; }; static Reverse(a) { return Element.toEl(a).Reverse; }; static Conjugate(a) { if (a instanceof Array) return a[0].map((c,ci)=>a.map((r,ri)=>Element.Conjugate(a[ri][ci]))); return Element.toEl(a).Conjugate; }
      static Normalize(a)   {  return Element.toEl(a).Normalized; }; static Length(a) {  return Element.toEl(a).Length };
      static lt(a,b)        {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a<b; a=Element.toEl(a);b=Element.toEl(b); a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a<b; }
      static gt(a,b)        {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a>b; a=Element.toEl(a);b=Element.toEl(b); a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a>b; }
      static lte(a,b)       {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a<=b; a=Element.toEl(a);b=Element.toEl(b); a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a<=b; }
      static gte(a,b)       {  a=a.call?a():a; b=b.call?b():b; if (!(a instanceof Element || b instanceof Element)) return a>=b; a=Element.toEl(a);b=Element.toEl(b); a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a>=b; }
      static sw(a,b)        {  if (b instanceof Array) return b.map(x=>Element.sw(a,x)); a=Element.toEl(a); b=Element.toEl(b); return a.Mul(b).Mul(a.Conjugate); }
      static exp(a)         {  a=a.call?a():a; if (a.Exp) return a.Exp(); return Math.exp(a); }
    // Debug  
      static describe() { console.log(`Basis\n${basis}\nMetric\n${metric.slice(1,1+tot)}\nCayley\n${mulTable.map(x=>(x.map(x=>('           '+x).slice(-2-tot)))).join('\n')}\nMatrix Form:\n`+gp.map(x=>x.map(x=>x.match(/(-*b\[\d+\])/)).map(x=>x&&((x[1].match(/-/)||' ')+String.fromCharCode(65+1*x[1].match(/\d+/)))||' 0')).join('\n')); }    
      toString() { var res=[]; for (var i=0; i<basis.length; i++) if (Math.abs(this[i])>1e-10) res.push(((this[i]==1)&&i?'':((this[i]==-1)&&i)?'-':(this[i].toFixed(10)*1))+(i==0?'':tot==1&&q==1?'i':basis[i].replace('e','e_'))); return res.join('+').replace(/\+-/g,'-')||'0'; }
    // Parse expressions, translate functions and render graphs.
      static graph(f,options) { if (!f) return; var origf=f; options=options||{}; options.scale=options.scale||1; options.camera=options.camera||new Element([0.7071067690849304, 0, 0, 0, 0, 0, 0, 0, 0, 0.7071067690849304, 0, 0, 0, 0, 0, 0]); var ww=options.width, hh=options.height, cvs=options.canvas, tpcam=new Element([0,0,0,0,0,0,0,0,0,0,0,-5,0,0,1,0]),tpy=this.Coeff(4,1),tp=new Element(), project=(o)=>{ if (!o) return o; while (o.call) o=o(); return (tot==4 && (o.length==16))?(tpcam).Vee(options.camera.Mul(o).Mul(options.camera.Conjugate)).Wedge(tpy):o};
      // p2d SVG points/lines/rotations/translations/labels . 
        if (!(f instanceof Function) || f.length===0) { var lx,ly,lr,color,res,anim=false,to2d=(tot==3)?[0,1,2,3,4,5,6,7]:[0,7,9,10,13,12,14,15];
          if (f instanceof Function) f=f();if (!(f instanceof Array)) f=[].concat.apply([],Object.keys(f).map((k)=>typeof f[k]=='number'?[f[k]]:[f[k],k])); 
          function build(f,or) { if (or && f && f instanceof Function) f=f(); lx=-2;ly=-1.85;lr=0;color='#444'; var svg=new DOMParser().parseFromString(`<SVG onmousedown="if(evt.target==this)this.sel=undefined" viewBox="-2 -${2*(hh/ww||1)} 4 ${4*(hh/ww||1)}" style="width:${ww||512}px; height:${hh||512}px; background-color:#eee; user-select:none">
           ${options.grid?Array.apply([],{length:11}).map((x,xi)=>`<line x1="-10" y1="${(xi-5)/2}" x2="10" y2="${(xi-5)/2}" stroke-width="0.005" stroke="#CCC"/><line y1="-10" x1="${(xi-5)/2}" y2="10" x2="${(xi-5)/2}"  stroke-width="0.005" stroke="#CCC"/>`):''}
           ${options.conformal?f.map&&f.map((o,oidx)=>{ if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; }while (o.call) o=o();
             if (o instanceof Array)  { lx=ly=lr=0; o=o.map(o=>{ while(o.call)o=o(); return o; }); o.forEach((o)=>{lx+=o.e1;ly+=-o.e2});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>(o.e1+','+(-o.e2)+' '))}"/>`:`<LINE style="pointer-events:none" x1=${o[0].e1} y1=${-o[0].e2} x2=${o[1].e1} y2=${-o[1].e2} stroke-width="0.005" stroke="${color||'#888'}"/>`; }
             if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${ly}" font-family="Verdana" font-size="0.1" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${lr},${lx},${ly})">&nbsp;${o}&nbsp;</text>`; ly+=0.14; return res2; }
             if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; };
             var b1=o.Blade(1).VLength>0.001,b2=o.Blade(2).VLength>0.001,b3=o.Blade(3).VLength>0.001; 
             if (b1 && !b2 && !b3) { lx=o.e1; ly=-o.e2; lr=0; return res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="0.03" fill="${color||'green'}"/>`; }
             else if (!b1 && !b2 && b3) { var isLine=Element.Coeff(4,1,3,-1).Dot(o).Length==0; 
               if (isLine) { var loc=((Element.Coeff(4,-.5).Add(Element.Coeff(3,-.5))).Dot(o)).Div(o), att=(Element.Coeff(4,1,3,-1)).Dot(o); lx=-loc.e1; ly=loc.e2; lr=Math.atan2(att[8],att[7])/Math.PI*180; return `<LINE style="pointer-events:none" x1=${lx-10} y1=${ly} x2=${lx+10} y2=${ly} stroke-width="0.005" stroke="${color||'#888'}" transform="rotate(${lr},${lx},${ly})"/>`;};
               var loc=o.Div((Element.Coeff(4,1,3,-1)).Dot(o)); lx=-loc.e1; ly=loc.e2; var r=-o.Mul(o.Conjugate).s/(Element.Pow((Element.Coeff(4,1,3,-1)).Dot(o),2).s); r=r**0.5; return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${r}" stroke-width="0.005" fill="none" stroke="${color||'green'}"/>`;   
             } else if (!b1 && b2 &&!b3) { 
               lr=0; var ei=Element.Coeff(4,1,3,-1),eo=Element.Coeff(4,.5,3,.5), nix=o.Wedge(ei), sqr=o.Dot(o).s/nix.Dot(nix).s, r=Math.sqrt(Math.abs(sqr)), attitude=((ei.Wedge(eo)).Dot(nix)).Normalized.Mul(Element.Scalar(r)), pos=o.Div(nix); pos=pos.Div( pos.Dot(Element.Sub(ei))); 
               lx=pos.e1; ly=-pos.e2; if (sqr<0) return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="0.03" stroke-width="0.005" fill="none" stroke="${color||'green'}"/>`;
               lx=pos.e1+attitude.e1; ly=-pos.e2-attitude.e2; var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="0.03" fill="${color||'green'}"/>`;
               lx=pos.e1-attitude.e1; ly=-pos.e2+attitude.e2; return res2+`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="0.03" fill="${color||'green'}"/>`;
             }
           }):f.map&&f.map((o,oidx)=>{  if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; } while (o instanceof Function) o=o(); o=(o instanceof Array)?o.map(project):project(o); if (o===undefined) return; 
             if (o instanceof Array)  { lx=ly=lr=0; o.forEach((o)=>{o=(o.call)?o():o; lx+=((drm[1]==6||drm[1]==14)?-1:1)*o[drm[2]]/o[drm[1]];ly+=o[drm[3]]/o[drm[1]]});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>((drm[1]==6||drm[1]==14)?-1:1)*o[drm[2]]/o[drm[1]]+','+o[drm[3]]/o[drm[1]]+' ')}"/>`:`<LINE style="pointer-events:none" x1=${((drm[1]==6||drm[1]==14)?-1:1)*o[0][drm[2]]/o[0][drm[1]]} y1=${o[0][drm[3]]/o[0][drm[1]]} x2=${((drm[1]==6||drm[1]==14)?-1:1)*o[1][drm[2]]/o[1][drm[1]]} y2=${o[1][drm[3]]/o[1][drm[1]]} stroke-width="0.005" stroke="${color||'#888'}"/>`; }
             if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${ly}" font-family="Verdana" font-size="0.1" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${lr},0,0)">&nbsp;${o}&nbsp;</text>`; ly+=0.14; return res2; }
             if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; };
             if (o[to2d[6]]**2        >0.0001) { lx=options.scale*o[drm[2]]/o[drm[1]]; if (drm[1]==6||drm[1]==14) lx*=-1; ly=options.scale*o[drm[3]]/o[drm[1]]; lr=0;  var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="0.03" fill="${color||'green'}"/>`; ly-=0.05; lx-=0.1; return res2; }
             if (o[to2d[2]]**2+o[to2d[3]]**2>0.0001) { var l=Math.sqrt(o[to2d[2]]**2+o[to2d[3]]**2); o[to2d[2]]/=l; o[to2d[3]]/=l; o[to2d[1]]/=l; lx=0.5; ly=((drm[1]==6)?-1:-1)*o[to2d[1]]; lr=-Math.atan2(o[to2d[2]],o[to2d[3]])/Math.PI*180; var res2=`<LINE style="pointer-events:none" x1=-10 y1=${ly} x2=10 y2=${ly} stroke-width="0.005" stroke="${color||'#888'}" transform="rotate(${lr},0,0)"/>`; ly-=0.05; return res2; }
             if (o[to2d[4]]**2+o[to2d[5]]**2>0.0001) { lr=0; ly+=0.05; lx+=0.1; var res2=`<LINE style="pointer-events:none" x1=${lx} y1=${ly} x2=${lx-o.e02} y2=${ly+o.e01} stroke-width="0.005" stroke="${color||'#888'}"/>`; ly=ly+o.e01/4*3-0.05; lx=lx-o.e02/4*3; return res2; }
            }).join()}`,'text/html').body; return svg.removeChild(svg.firstChild); };
          res=build(f); res.onmousemove=(e)=>{ if (res.sel===undefined || !e.buttons) return;var x=(e.clientX-res.getBoundingClientRect().left)/(res.getBoundingClientRect().width/4||128)-2,y=((e.clientY-res.getBoundingClientRect().top)/(res.getBoundingClientRect().height/4||128)-2)*(res.getBoundingClientRect().height/res.getBoundingClientRect().width||1); if (options.conformal) {f[res.sel][1]=x; f[res.sel][2]=-y; var l=x*x+y*y; f[res.sel][3]=0.5-l*0.5; f[res.sel][4]=0.5+l*0.5; } else {f[res.sel][drm[2]]=(drm[1]==6)?-x:x; f[res.sel][drm[3]]=y; f[res.sel][drm[1]]=1;} if (!anim) res.innerHTML=build(f).innerHTML; }; return res;
        }  
      // 1d and 2d functions  
        cvs=cvs||document.createElement('canvas'); if(ww)cvs.width=ww; if(hh)cvs.height=hh; var w=cvs.width,h=cvs.height,context=cvs.getContext('2d'), data=context.getImageData(0,0,w,h);
        if (f.length==2) for (var px=0; px<w; px++) for (var py=0; py<h; py++) { var res=f(px/w*2-1, py/h*2-1); res=res.buffer?[].slice.call(res):res.slice?res:[res,res,res]; data.data.set(res.map(x=>x*255).concat([255]),py*w*4+px*4); }
        else if (f.length==1) for (var px=0; px<w; px++) { var res=f(px/w*2-1); res=Math.round((res/2+0.5)*h); if (res > 0 && res < h-1) data.data.set([0,0,0,255],res*w*4+px*4); }
        return context.putImageData(data,0,0),cvs;       
      }
      static inline(intxt) {
        if (arguments.length>1 || intxt instanceof Array) {
          var args=[].slice.call(arguments,1);
          return res.inline(new Function(args.map((x,i)=>'_no_you_didnt_'+i).join(),'return ('+intxt.map((x,i)=>(x||'')+(args[i]&&('_no_you_didnt_'+i)||'')).join('')+')')).apply(res,args);
        }
        var txt = (intxt instanceof Function)?intxt.toString():`function(){return (${intxt})}`;
        var tok = [], resi=[], t, tokens = [/^[\s\uFFFF]|^[\u000A\u000D\u2028\u2029]|^\/\/[^\n]*\n|^\/\*[\s\S]*?\*\//g,                     // 0: whitespace/comments
          /^\"\"|^\'\'|^\".*?[^\\]\"|^\'.*?[^\\]\'|^\`[\s\S]*?[^\\]\`/g,                                                                // 1: literal strings
          /^\d+[.]{0,1}\d*[ei][\+\-_]{0,1}\d*|^\.\d+[ei][\+\-_]{0,1}\d*|^e_\d*/g,                                                       // 2: literal numbers in scientific notation (with small hack for i and e_ asciimath)
          /^\d+[.]{0,1}\d*[E][+-]{0,1}\d*|^\.\d+[E][+-]{0,1}\d*|^0x\d+|^\d+[.]{0,1}\d*|^\.\d+|^\(\/.*[^\\]\/\)/g,                       // 3: literal hex, nonsci numbers and regex (surround regex with extra brackets!)
          /^(\.Normalized|\.Length|>>>=|===|!==|>>>|<<=|>>=|=>|[<>\+\-\*%&|^\/!\=]=|\*\*|\+\+|\-\-|<<|>>|\&\&|\^\^|^[{}()\[\];.,<>\+\-\*%|&^!~?:=\/]{1})/g,   // 4: punctuator
          /^[A-Za-z0-9_]*/g]                                                                                                            // 5: identifier
        while (txt.length) for(t in tokens) if(resi=txt.match(tokens[t])){ tok.push([t|0,resi[0]]); txt=txt.slice(resi[0].length); break;} // tokenise 
        tok=tok.map(t=>(t[0]==2)?[2,'this.Coeff('+basis.indexOf('e'+(t[1].split(/e_|e|i/)[1]||1))+','+parseFloat(t[1][0]=='e'?1:t[1].split(/e_|e|i/)[0])+')']:t);   // translate scientific notation into algebra elements.
        var syntax = (intxt instanceof Function)?[[['.Normalized','Normalize',2],['.Length','Length',2],['.','.',3]],[['~','Conjugate',1],['!','Dual',1]],[['**','Pow',0,1]],[['>>>','sw',0,1],['^','Wedge'],['&','Vee'],['<<','Dot']],[['*','Mul'],['/','Div']],[['-','Sub'],['+','Add']],[['<','lt'],['>','gt'],['<=','lte'],['>=','gte']]]
                                                :[[['pi','Math.PI'],['sin','Math.sin']],[['ddot','this.Reverse'],['tilde','this.Involute'],['hat','this.Conjugate'],['bar','this.Dual']],[['^','Pow',0,1]],[['^^','Wedge'],['*','Dot']],[['**','Mul'],['/','Div']],[['-','Sub'],['+','Add']],[['<','lt'],['>','gt'],['<=','lte'],['>=','gte']]];
        tok=tok.map(t=>(t[0]!=5)?t:[].concat.apply([],syntax).filter(x=>x[0]==t[1]).length?[5,[].concat.apply([],syntax).filter(x=>x[0]==t[1])[0][1]]:t); // static function translations (mostly for asciimath)
        function translate(tokens) { var resi=[], isTok=(x,t)=>{while(x>0 && resi[x][0]==0)x--; return resi[x][0]==t}; 
            for (var i=0,t; i<tokens.length; i++) // recurse brackets and unary operators into subarrays first.
              if ((t=tokens[i])[1] == '(') { var open=1,sub=[],pre=[]; while(resi.length && (resi[resi.length-1][0]==5 || resi[resi.length-1][1]=='.')) pre.unshift(resi.pop()[1]);  while (open) { t = tokens[++i]; if (t[1] == '(') open++; else if (t[1] == ')') open--; if (open) sub.push(t); }; resi.push([[2,pre.join('')+'(']].concat(translate(sub)).concat([[2,')']])); }
              else if ((t=tokens[i])[1] == '[') { var open=1,sub=[],pre=[]; while(resi.length && (isTok(resi.length-1,5) || isTok(resi.length-1,2) || resi[resi.length-1][1]=='.')) pre.unshift(resi.pop()[1]);  while (open) { t = tokens[++i]; if (t[1] == '[') open++; else if (t[1] == ']') open--; if (open) sub.push(t); }; resi.push([[2,pre.join('')+'[']].concat(translate(sub)).concat([[2,']']])); }
              else if (~'~!'.indexOf(t[1])) { resi.push(t); var sub=[], open=0; while (~'~!-'.indexOf(t[1]) || open) { t=tokens[++i]; if (t[1] == '(') open++; else if (t[1] == ')') open--; sub.push(t); }; resi.push([[2,'']].concat(translate(sub))); }
              else if (t[1]=='-'&&resi.length&&(isTok(resi.length-1,4) || resi[resi.length-1][1]=='return'|| (resi[resi.length-1][0]==0 && resi[resi.length-2][1]=='return'))) { resi.push([[2,'']].concat(translate([t,tokens[++i]])))  }
              else resi.push(t);  
           for (var c=[],last=0,i=0; i<resi.length; i++) if (resi[i][0][0]!=2 || !/[\[\(]/.test(resi[i][0][1][0])) { last=0; c.push(resi[i]); } else if (last) last.push(resi[i]); else if (resi[i+1] && resi[i+1][0][0]==2 && /[\[\(]/.test(resi[i+1][0][1][0])) c.push(last=[resi[i]]); else c.push(resi[i]); resi=c;
           syntax.forEach((syntaxd,k)=>{ var ops=syntaxd.map(x=>x[0]);   
            syntaxd.forEach( (op)=>{ tokens=resi;resi=[]; // now translate ops ..
              if (op[3]) { /* right-to-left */ for (var i=tokens.length-1;  i >= 0; i--) { if (tokens[i][1] == op[0]) {
                      while(resi.length&&resi[resi.length-1][1].match&&resi[resi.length-1][1].match(/^\s+$/)) resi.pop();
                      if (!op[2]) var after=tokens[i-1]; while (after[1].match&&after[1].match(/^\s+$/)) after = tokens[--i-1];
                      if (op[2]||!resi.length||resi[resi.length-1][0]==4) resi[resi.length]=[[1,'this.'+op[1]+'('],resi[resi.length-1],[1,')']]; else resi[resi.length-1]=[[1,'this.'+op[1]+'('],after,[1,','],resi[resi.length-1],[1,')']];
                      i -= 1; } else resi.push(tokens[i]); }
                  resi=resi.reverse();
               } else { /* left-to-right */ for (var i=0;  i < tokens.length; i++) { if (ops.indexOf(tokens[i][1]) != -1) { op = syntaxd.filter(x=>x[0]==tokens[i][1])[0];
                      if (op[2]!=1) while(resi.length&&resi[resi.length-1][1].match&&resi[resi.length-1][1].match(/^\s+$/)) resi.pop();
                      if (op[2]!=2) { var after=tokens[i+1]; while (after[1].match&&after[1].match(/^\s+$/)) after = tokens[++i+1]; }
                      if (op[2]==3) resi[resi.length-1]=[resi[resi.length-1],[1,'.'],after];
                      else if (op[2]==2) resi[resi.length-1]=[[1,'this.'+op[1]+'('],resi[resi.length-1],[1,')']];
                      else if (op[2]||!resi.length||resi[resi.length-1][0]==4) resi[resi.length]=[[1,'this.'+op[1]+'('],after,[1,')']]; else resi[resi.length-1]=[[1,'this.'+op[1]+'('],resi[resi.length-1],[1,','],after,[1,')']];
                      if (op[2]!=2) i += 1; } else resi.push(tokens[i]); }}
           });}); return resi;
        }
        return eval('('+(function f(t){return t.map(t=>t[0]instanceof Array?f(t):t[1]).join('');})(translate(tok))+')').bind(Element);
      }
    }
  // Convert symbolic matrices to code. (skipping zero's on dot and wedge matrices).
    res.prototype.Add   = new Function('b,res','res = res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=b['+xi+']+this['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res')
    res.prototype.Sub   = new Function('b,res','res = res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=this['+xi+']-b['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res')
    res.prototype.Mul   = new Function('b,res','res=res||new this.constructor();\n'+gp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a).replace(/\+0/g,'')+';').join('\n')+'\nreturn res;');
    res.prototype.Dot   = new Function('b,res','res=res||new this.constructor();\n'+cp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
    res.prototype.Wedge = new Function('b,res','res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
    res.prototype.Vee   = new Function('b,res','res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+drm[ri]+']='+r.map(x=>x.replace(/\[(.*?)\]/g,function(a,b){return '['+(drm[b|0])+']'})).join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
  // Reversion, Involutions, Conjugation for any number of grades, component acces shortcuts.
    basis.forEach((b,i)=>{res.prototype.__defineGetter__(i?b:'s',function(){ return this[i] }); }); basis.forEach((b,i)=>{res.prototype.__defineSetter__(i?b:'s',function(x){ this[i]=x; }); });
    res.prototype.__defineGetter__('Negative', function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= -this[i]; return res; });
    res.prototype.__defineGetter__('Reverse',  function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,1,-1,-1][grades[i]%4]; return res; });
    res.prototype.__defineGetter__('Involute', function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,1,-1][grades[i]%4]; return res; });
    res.prototype.__defineGetter__('Conjugate',function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,-1,1][grades[i]%4]; return res; });
    res.prototype.__defineGetter__('Dual',function(){ if (r) return this.map((x,i,a)=>a[drm[i]]); var res = new this.constructor(); res[res.length-1]=-1; return res.Mul(this); });
    res.prototype.__defineGetter__('Length',  function(){  return Math.sqrt(Math.abs(this.Mul(this.Conjugate).s)); }); 
    res.prototype.__defineGetter__('VLength',  function(){ var res = 0; for (var i=0; i<this.length; i++) res += this[i]*this[i]; return Math.sqrt(res); });
    res.prototype.__defineGetter__('Normalized', function(){ var res = new this.constructor(),l=this.Length; if (!l) return this; l=1/l; for (var i=0; i<this.length; i++) res[i]=this[i]*l; return res; });
    res.prototype.__defineGetter__('Inverse', function(){  // http://repository.essex.ac.uk/17282/1/TechReport_CES-534.pdf
      return (tot==0)?new this.constructor([1/this[0]]):(tot==1)?this.Involute.Mul(this.constructor.Scalar(1/this.Mul(this.Involute)[0])):(tot==2)?this.Conjugate.Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate)[0])):
             (tot==3)?this.Reverse.Mul(this.Involute).Mul(this.Conjugate).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse)[0])):
             (tot==4)?this.Conjugate.Mul(this.Mul(this.Conjugate).Map(3,4)).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Mul(this.Conjugate).Map(3,4))[0])):
                      this.Conjugate.Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4)).Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4))[0]));
    });
    if (fu instanceof Function) return res.inline(fu)(); else return res;  
  }
}));
