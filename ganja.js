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
    var options=p; if (options instanceof Object) {
      q = p.q || (p.metric && p.metric.filter(x=>x==-1).length) || q;
      r = p.r || (p.metric && p.metric.filter(x=>x==0).length) || r;
      p = p.p || (p.metric && p.metric.filter(x=>x==1).length) || p;
    } else options={};
  // Initialise basis names and multiplication table.
    var tot = options.tot||(p||0)+(q||0)+(r||0),                                                                                            // p = #dimensions that square to 1, q to -1, r to 0.
        basis=options.basis||Array.apply([],{length:2**tot})                                                                                // => [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
              .map((x,xi)=>(((1<<20)+xi).toString(2)).slice(-tot||-1)                                                                       // => ["000", "001", "010", "011", "100", "101", "110", "111"]  (index of array in base 2)
              .replace(/./g,(a,ai)=>a=='0'?'':ai+1-(r||0)))                                                                                 // => ["", "3", "2", "23", "1", "13", "12", "123"] (1 bits replaced with their positions, 0's removed)
              .sort((a,b)=>(a.toString().length==b.toString().length)?(a|0)-(b|0):a.toString().length-b.toString().length)                  // => ["", "1", "2", "3", "12", "13", "23", "123"] (sorted numerically)
              .map(x=>x&&'e'+x||'1'),                                                                                                       // => ["1", "e1", "e2", "e3", "e12", "e13", "e23", "e123"] (converted to commonly used basis names)
        grades=basis.map(x=>x.length-1),                                                                                                    // => [0, 1, 1, 1, 2, 2, 2, 3] (grade per basis blade)
        grade_start=grades.map((a,b,c)=>c[b-1]!=a?b:-1).filter(x=>x+1).concat([basis.length]),                                              // =>  [0, 1, 4, 7, 8] (first blade of given grade, with extra stop element)
        simplify = (s,p,q,r)=>{                                                                                                             // implement ex*ey=-ey*ex (for x!=y) and ex*ex=metric[x] 
          var sign=1,c,l,t=[],f=true;s=[].slice.call(s.replace(/e/g,''));l=s.length;
          while (f) { f=false;
            for (var i=0; i<l;) if (s[i]===s[i+1]) { if ((s[i]|0)>p) sign*=-1; else if ((s[i]|0)<r) sign*=0; i+=2; f=true; } else t.push(s[i++]);
            for (var i=0; i<t.length-1; i++) if (t[i]>t[i+1]) { c=t[i];t[i]=t[i+1];t[i+1]=c;sign*=-1;f=true; break;} if (f) { s=t;t=[];l=s.length; }
          }
          var ret=(sign==0)?'0':((sign==1)?'':'-')+(t.length?'e'+t.join(''):'1'); return (brm&&brm[ret])||(brm&&brm['-'+ret]&&'-'+brm['-'+ret])||ret;
        },
        brm=(x=>{ var ret={}; for (var i in basis) ret[basis[i]=='1'?'1':simplify(basis[i],p,q,r)] = basis[i]; return ret; })(basis),      
        drm=basis.map((a,i)=>{ return {a:a,i:i} }).sort((a,b)=>a.a.length>b.a.length?1:a.a.length<b.a.length?-1:(+a.a.slice(1).split('').sort().join(''))-(+b.a.slice(1).split('').sort().join('')) ).map(x=>x.i).reverse(),
        mulTable = basis.map(x=>basis.map(y=>(x==1)?y:(y==1)?x:simplify(x+y,p,q,r))),                                                       // Generate Cayley multiplication table.
        mulTable2 = basis.map(x=>basis.map(y=>(x==1)?y:(y==1)?x:simplify(x+y,p+q+r,0,0))),                                                  // Generate Cayley multiplication table.
        metric = basis.map((x,xi)=>mulTable[xi][xi]|0),                                                                                     // extended metric .. per basis blade (not just for the 1D subspaces) .. diagonal of cayley table.
        gp=basis.map(x=>basis.map(x=>'0')), cp=gp.map(x=>gp.map(x=>'0')), op=gp.map(x=>gp.map(x=>'0'));                                     // Storage for our product tables.
  // Convert Caeyley table to product matrices.           
    basis.forEach((output,i)=>basis.forEach((x,xi)=>basis.forEach((y,yi)=>{ if (mulTable2[xi][yi].replace('-','') == output) {              // For each output component scan Cayley table.
        gp[i][xi] = (mulTable2[xi][yi]=='0')?'0':((mulTable2[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']';                             // Fill in the geometric table         
        op[i][xi] = ( grades[i] == grades[xi]+grades[yi] ) ? gp[i][xi]:'0';                                                                 // strict sum of grades in outer
        if ((mulTable[xi][yi].replace('-','') == output)||(mulTable[xi][yi]=='0')) {
          gp[i][xi] = (mulTable[xi][yi]=='0')?'0':((mulTable[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']';                             // Fill in the geometric table
          cp[i][xi] = ( grades[i] == grades[xi]-grades[yi] ) ? gp[i][xi]:'0';                                                               // strict diff of grades in inner
        }  
    }})));
  // Generate a new class for our algebra.
    var res = class Element extends Float64Array {                                                                                                            // Our elements will be Float64Arrays.
    // constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a||basis.length); return this; }                                                                                                 // Construct with correct default lenght.
      Blade(grade,res) { var res=res||new Element(); for (var i=0,l=res.length; i<l; i++) if (grades[i]==grade) res[i]=this[i]; else res[i]=0; return res; }  // Construct a pure blade of given grade from a multivector.
      Add  (b,res) { if (!(b instanceof Element)) { var c=new Element(b.length&&b); b.length||(c[0]=b); b=c; }; res = res||new Element(); for (var i=0; i<res.length; i++) res[i] = this[i]+b[i]; return res; }  // Component add.
      Sub  (b,res) { if (!(b instanceof Element)) { var c=new Element(b.length&&b); b.length||(c[0]=b); b=c; }; res = res||new Element(); for (var i=0; i<res.length; i++) res[i] = this[i]-b[i]; return res; }  // Component add.
      Div  (b,res) { return this.Mul(b.Inverse,res); }                                                                                                        // right inverse assumed here.
      LDiv (b,res) { return b.Inverse.Mul(this,res); }                                                                                                        // left inverse assumed here.
      Map  (a,b  ) { var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*(((a===grades[i])||(b===grades[i]))?-1:1); return res; } // for inverse calculations.
      get Vector ()    { return this.slice(grade_start[1],grade_start[2]); };
    // Factories - Make it easy to generate blades.
      static Element()   { var res = new Element(); for (var i=0; i<res.length; i++) res[i]=arguments[i]||0; return res; }                                    // Create a fully specified element.
      static Coeff(x,y)  { var res = new Element(); res[x]=y; return res; }
      static Scalar(x)   { var res = new Element(); res[0]=x; return res; }                                                                                   // Create a scalar element.
      static Vector()    { var res = new Element(); res.set(arguments,grade_start[1]); return res; }                                                          // Create a vector element.
      static Bivector()  { var res = new Element(); res.set(arguments,grade_start[2]); return res; }                                                          // Create a bivector element.
      static Trivector() { var res = new Element(); res.set(arguments,grade_start[3]); return res; }                                                          // Create a trivector element.
      static nVector(n)  { var res = new Element(); res.set([].slice.call(arguments,1),grade_start[n]); return res; }                                         // Create an nVector of desired grade.
    // Static operators (easier integration with scalars when using inline operator overloading)
      static Add(a,b,res)   { if ((typeof a=='string')||(typeof b=='string')) return a.toString()+b.toString(); if (!(a instanceof Element || b instanceof Element)) return a+b; res=res||new Element(); a=(a instanceof Element)?a:Element.Scalar(a); b=(b instanceof Element)?b:Element.Scalar(b);for(var i=0;i<res.length;i++)res[i]=a[i]+b[i]; return res; }  
      static Sub(a,b,res)   { if (arguments.length==1) return Element.Mul(a,-1); if (!(a instanceof Element || b instanceof Element)) return a-b; res=res||new Element(); a=(a instanceof Element)?a:Element.Scalar(a); b=(b instanceof Element)?b:Element.Scalar(b);for(var i=0;i<res.length;i++)res[i]=a[i]-b[i]; return res; }
      static Mul(a,b,res)   { if (!(a instanceof Element || b instanceof Element)) return a*b; a=(a instanceof Element)?a:Element.Scalar(a); b=(b instanceof Element)?b:Element.Scalar(b); return a.Mul(b,res); }  
      static Div(a,b,res)   { if (!(a instanceof Element || b instanceof Element)) return a/b; a=(a instanceof Element)?a:Element.Scalar(a); b=(b instanceof Element)?b:Element.Scalar(b); return a.Div(b,res); }  
      static Pow(a,b,res)   { if (!(a instanceof Element || b instanceof Element)) return a**b; a=(a instanceof Element)?a:Element.Scalar(a); if (b==-1) return a.Inverse; if (b==2) return a.Mul(a); throw 'not yet'; }  
      static Dot(a,b,res)   { if (!(a instanceof Element || b instanceof Element)) return a*b; a=(a instanceof Element)?a:Element.Scalar(a); b=(b instanceof Element)?b:Element.Scalar(b); return a.Dot(b,res); }  
      static Wedge(a,b,res) { if (!(a instanceof Element || b instanceof Element)) return a*b; a=(a instanceof Element)?a:Element.Scalar(a); b=(b instanceof Element)?b:Element.Scalar(b); return a.Wedge(b,res); }  
      static Dual(a)        { if (r) return a.map((x,i,a)=>a[drm[i]]); return (a instanceof Element)?a.Dual:Element.nVector(tot-1,a); }; static Involute(a) { return a.Involute; }; static Reverse(a) { return a.Reverse; }; static Conjugate(a) { return a.Conjugate; }
      static lt(a,b)        { if (!(a instanceof Element || b instanceof Element)) return a<b; a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a<b; }
      static gt(a,b)        { if (!(a instanceof Element || b instanceof Element)) return a>b; a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a>b; }
      static lte(a,b)       { if (!(a instanceof Element || b instanceof Element)) return a<=b; a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a<=b; }
      static gte(a,b)       { if (!(a instanceof Element || b instanceof Element)) return a>=b; a=(a instanceof Element)?a.Length:a; b=(b instanceof Element)?b.Length:b; return a>=b; }
    // Debug  
      static describe() { console.log(`Basis\n${basis}\nRemap${JSON.stringify(brm)}\nDual\n${drm}\nMetric\n${metric.slice(1,1+tot)}\nCayley\n${mulTable.map(x=>(x.map(x=>('           '+x).slice(-2-tot)))).join('\n')}`); }    
      toString() { var res=[]; for (var i=0; i<basis.length; i++) if (Math.abs(this[i])>1e-10) res.push(((this[i]==1)&&i?'':((this[i]==-1)&&i)?'-':(this[i].toFixed(10)*1))+(i==0?'':tot==1?'i':basis[i].replace('e','e_'))); return res.join('+').replace(/\+-/g,'-')||'0'; }
    // Parse expressions, translate functions and render graphs.
      static graph(f,cvs,ww,hh) { if (f instanceof Object) return new DOMParser().parseFromString(`<SVG viewBox="-2 -2 4 4" style="width:512px; height:512px; background-color:#eee">${Object.keys(f).map(oi=>{ var o=f[oi].Normalized; return (o.Blade(1).Length>0.001?`<LINE x1=-10 y1=${-o[1]} x2=10 y2=${-o[1]} stroke-width="0.005" stroke="#888" transform="rotate(${-Math.atan2(o[2],o[3])/Math.PI*180},0,0)"/><text x="0.5" y="${-o[1]-0.05}" font-family="Verdana" font-size="0.1" transform="rotate(${(-Math.atan2(o[2],o[3])/Math.PI*180)},0,0)">${oi}</text>`:`<CIRCLE cx="${o.e20/o.e12}" cy="${o.e01/o.e12}" r="0.02" fill="green"/><text x="${o.e20/o.e12-0.1}" y="${o.e01/o.e12-0.05}" font-family="Verdana" font-size="0.1">${oi}</text>`)}).join()}`,'text/html').body.firstChild;
        if (cvs!==false) f=this.inline(f); cvs=cvs||document.createElement('canvas'); if(ww)cvs.width=ww; if(hh)cvs.height=hh; var w=cvs.width,h=cvs.height,context=cvs.getContext('2d'), data=context.getImageData(0,0,w,h);
        if (f.length==2) for (var px=0; px<w; px++) for (var py=0; py<h; py++) { var res=f(px/w*2-1, py/h*2-1); res=res.buffer?[].slice.call(res):res.slice?res:[res,res,res]; data.data.set(res.map(x=>x*255).concat([255]),py*w*4+px*4); }
        else if (f.length==1) for (var px=0; px<w; px++) { var res=f(px/w*2-1); res=Math.round(Math.min(h-1,Math.max(0,(res/2+0.5)*h))); data.data.set([0,0,0,255],res*w*4+px*4); }
        return context.putImageData(data,0,0),cvs;       
      }
      static inline(intxt) {
        var txt = (intxt instanceof Function)?intxt.toString():`function(){return (${intxt})}`;
        var tok = [], res, t, tokens = [/^[\s\uFFFF]|^[\u000A\u000D\u2028\u2029]|^\/\/[^\n]*\n|^\/\*[\s\S]*?\*\//g,                     // 0: whitespace/comments
          /^\".*?[^\\]\"|^\'.*?[^\\]\'|^\`[\s\S]*?[^\\]\`/g,                                                                            // 1: literal strings 
          /^\d+[.]{0,1}\d*[eEi][\+\-_]{0,1}\d*|^\.\d+[eEi][\+\-_]{0,1}\d*|^e_\d*/g,                                                     // 2: literal numbers in scientific notation (with small hack for i and e_ asciimath)
          /^0x\d+|^\d+[.]{0,1}\d*|^\.\d+|^\(\/.*[^\\]\/\)/g,                                                                            // 3: literal hex, nonsci numbers and regex (surround regex with extra brackets!)
          /^(>>>=|===|!==|>>>|<<=|>>=|=>|[<>\+\-\*%&|^\/!\=]=|\*\*|\+\+|\-\-|<<|>>|\&\&|\^\^|^[{}()\[\];.,<>\+\-\*%|&^!~?:=\/]{1})/g,   // 4: punctuator
          /^[A-Za-z0-9_.]*/g]                                                                                                           // 5: identifier
        while (txt.length) for(t in tokens) if(res=txt.match(tokens[t])){ tok.push([t|0,res[0]]); txt=txt.slice(res[0].length); break;} // tokenise
        tok=tok.map(t=>(t[0]==2)?[2,'this.Coeff('+basis.indexOf('e'+(t[1].split(/e_|e|i/)[1]||1))+','+parseFloat(t[1][0]=='e'?1:t[1].split(/e_|e|i/)[0])+')']:t);   // translate scientific notation into algebra elements.
        var syntax = (intxt instanceof Function)?[['~','Conjugate',1],['!','Dual',1],['**','Pow',0,1],['*','Mul'],['/','Div'],['^','Wedge'],['<<','Dot'],['-','Sub'],['+','Add'],['<','lt'],['>','gt'],['<=','lte'],['>=','gte']]
                                                :[['pi','Math.PI'],['sin','Math.sin'],['ddot','this.Reverse'],['tilde','this.Involute'],['hat','this.Conjugate'],['bar','this.Dual'],['hat',''],['~','Conjugate',1],['!','Involute',1],['^','Pow',0,1],['**','Mul'],['/','Div'],['^^','Wedge'],['*','Dot'],['-','Sub'],['+','Add'],['<','lt'],['>','gt'],['<=','lte'],['>=','gte']];
        tok=tok.map(t=>(t[0]!=5)?t:syntax.filter(x=>x[0]==t[1]).length?[5,syntax.filter(x=>x[0]==t[1])[0][1]]:t); // static function translations (mostly for asciimath)                                       
        function translate(tokens) { 
            var res=[]; 
            for (var i=0,t; i<tokens.length; i++) // recurse brackets and unary operators into subarrays first.
              if ((t=tokens[i])[1] == '(') { var open=1,sub=[],pre=[]; while(res.length && (res[res.length-1][0]==5 || res[res.length-1][1]=='.')) pre.unshift(res.pop()[1]);  while (open) { t = tokens[++i]; if (t[1] == '(') open++; else if (t[1] == ')') open--; if (open) sub.push(t); }; res.push([[2,pre.join('')+'(']].concat(translate(sub)).concat([[2,')']])); } 
              else if (~'~!'.indexOf(t[1])) { res.push(t); var sub=[], open=0; while (~'~!-'.indexOf(t[1]) || open) { t=tokens[++i]; if (t[1] == '(') open++; else if (t[1] == ')') open--; sub.push(t); }; res.push([[2,'']].concat(translate(sub))); } 
              else if (t[1]=='-'&&res.length&&res[res.length-1][0]==4) { res.push([[2,'']].concat(translate([t,tokens[++i]])))  }
              else res.push(t);
            syntax.forEach( (op)=>{ tokens=res;res=[]; // now translate ops .. 
              if (op[3]) { /* right-to-left */ for (var i=tokens.length-1;  i >= 0; i--) { if (tokens[i][1] == op[0]) {
                      while(res.length&&res[res.length-1][1].match&&res[res.length-1][1].match(/^\s+$/)) res.pop(); 
                      if (!op[2]) var after=tokens[i-1]; while (after[1].match&&after[1].match(/^\s+$/)) after = tokens[--i-1];
                      if (op[2]||!res.length||res[res.length-1][0]==4) res[res.length]=[[1,'this.'+op[1]+'('],res[res.length-1],[1,')']]; else res[res.length-1]=[[1,'this.'+op[1]+'('],after,[1,','],res[res.length-1],[1,')']];
                      i -= 1; } else res.push(tokens[i]); }
                  res=res.reverse();
               } else { /* left-to-right */ for (var i=0;  i < tokens.length; i++) { if (tokens[i][1] == op[0]) {
                      if (!op[2]) while(res.length&&res[res.length-1][1].match&&res[res.length-1][1].match(/^\s+$/)) res.pop(); 
                      var after=tokens[i+1]; while (after[1].match&&after[1].match(/^\s+$/)) after = tokens[++i+1];
                      if (op[2]||!res.length||res[res.length-1][0]==4) res[res.length]=[[1,'this.'+op[1]+'('],after,[1,')']]; else res[res.length-1]=[[1,'this.'+op[1]+'('],res[res.length-1],[1,','],after,[1,')']];
                      i += 1; } else res.push(tokens[i]); }} 
            });
            return res;
        }
        return eval('('+(function f(t){return t.map(t=>t[0]instanceof Array?f(t):t[1]).join('');})(translate(tok))+')').bind(Element);
      }
    }
  // Convert symbolic matrices to code. (skipping zero's on dot and wedge matrices).
    res.prototype.Mul   = new Function('b,res','res=res||new this.constructor();\n'+gp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-')+';').join('\n')+'\nreturn res;');
    res.prototype.Dot   = new Function('b,res','res=res||new this.constructor();\n'+cp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'')+';').join('\n')+'\nreturn res;');
    res.prototype.Wedge = new Function('b,res','res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'')+';').join('\n')+'\nreturn res;');
  // Reversion, Involutions, Conjugation for any number of grades, component acces shortcuts.
    basis.forEach((b,i)=>{res.prototype.__defineGetter__(i?b:'s',function(){ return this[i] }); });
    res.prototype.__defineGetter__('Negative', function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= -this[i]; return res; });
    res.prototype.__defineGetter__('Reverse',  function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,1,-1,-1][grades[i]%4]; return res; });
    res.prototype.__defineGetter__('Involute', function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,1,-1][grades[i]%4]; return res; });
    res.prototype.__defineGetter__('Conjugate',function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,-1,1][grades[i]%4]; return res; });
    res.prototype.__defineGetter__('Dual',function(){ return this.map((x,i,a)=>a[drm[i]]); var res = new this.constructor(); res[res.length-1]=-1; return res.Mul(this); });
    res.prototype.__defineGetter__('Length',  function(){ var res = 0; for (var i=0; i<this.length; i++) res += this[i]*this[i]*Math.abs(metric[i]); return Math.sqrt(res); });
    res.prototype.__defineGetter__('Normalized', function(){ var res = new this.constructor(),l=0; for (var i=0; i<this.length; i++) l += this[i]*this[i]*metric[i]; if (!l) return this; l=1/Math.sqrt(Math.abs(l)); for (var i=0; i<this.length; i++)res[i]=this[i]*l; return res; });
    res.prototype.__defineGetter__('Inverse', function(){  // http://repository.essex.ac.uk/17282/1/TechReport_CES-534.pdf
      return (tot==0)?new this.constructor([1/this[0]]):(tot==1)?this.Involute.Mul(this.constructor.Scalar(1/this.Mul(this.Involute)[0])):(tot==2)?this.Conjugate.Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate)[0])):
             (tot==3)?this.Reverse.Mul(this.Involute).Mul(this.Conjugate).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse)[0])):
             (tot==4)?this.Conjugate.Mul(this.Mul(this.Conjugate).Map(3,4)).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Mul(this.Conjugate).Map(3,4))[0])):
                      this.Conjugate.Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4)).Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4))[0]));
    });
    return res;  
  }
}));