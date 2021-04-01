/** Ganja.js - Geometric Algebra - Not Just Algebra.
  * @author Enki
  * @link   https://github.com/enkimute/ganja.js
  */

/*********************************************************************************************************************/
//
// Ganja.js is an Algebra generator for javascript. It generates a wide variety of Algebra's and supports operator
// overloading, algebraic literals and a variety of graphing options.
//
// Ganja.js is designed with prototyping and educational purposes in mind. Clean mathematical syntax is the primary
// target.
//
// Ganja.js exports only one function called *Algebra*. This function is used to generate Algebra classes. (say complex
// numbers, minkowski or 3D CGA). The returned class can be used to create, add, multiply etc, but also to upgrade
// javascript functions with algebraic literals, operator overloading, vectors, matrices and much more.
//
// As a simple example, multiplying two complex numbers 3+2i and 1+4i could be done like this :
//
//  var complex = Algebra(0,1);
//  var a = new complex([3,2]);
//  var b = new complex([1,3]);
//  var result = a.Mul(b);
//
// But the same can be written using operator overloading and algebraic literals. (where scientific notation with
// lowercase e is overloaded to directly specify generators (e1, e2, e12, ...))
//
//   var result = Algebra(0,1,()=>(3+2e1)*(1+4e1));
//
// Please see github for user documentation and examples.
//
/*********************************************************************************************************************/

// Documentation below is for implementors. I'll assume you know about Clifford Algebra's, grades, its products, etc ..
// I'll also assume you are familiar with ES6. My style may feel a bith mathematical, advise is to read slow.

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && define.amd) define(name, definition);
  else context[name] = definition();
}('Algebra', this, function () {

/** The Algebra class generator. Possible calling signatures :
  *   Algebra([func])                      => algebra with no dimensions, i.e. R. Optional function for the translator.
  *   Algebra(p,[func])                    => 'p' positive dimensions and an optional function to pass to the translator.
  *   Algebra(p,q,[func])                  => 'p' positive and 'q' negative dimensions and optional function.
  *   Algebra(p,q,r,[func])                => 'p' positive, 'q' negative and 'r' zero dimensions and optional function.
  *   Algebra({                            => for custom basis, cayley, mixing, etc pass in an object as first parameter.
  *     [p:p],                             => optional 'p' for # of positive dimensions
  *     [q:q],                             => optional 'q' for # of negative dimensions
  *     [r:r],                             => optional 'r' for # of zero dimensions
  *     [metric:array],                    => alternative for p,q,r. e.g. ([1,1,1,-1] for spacetime)
  *     [basis:array],                     => array of strings with basis names. (e.g. ['1','e1','e2','e12'])
  *     [Cayley:Cayley],                   => optional custom Cayley table (strings). (e.g. [['1','e1'],['e1','-1']])
  *     [mix:boolean],                     => Allows mixing of various algebras. (for space efficiency).
  *     [graded:boolean],                  => Use a graded algebra implementation. (automatic for +6D)
  *     [baseType:Float32Array]            => optional basetype to use. (only for flat generator)
  *   },[func])                            => optional function for the translator.
 **/
  return function Algebra(p,q,r) {
  // Resolve possible calling signatures so we know the numbers for p,q,r. Last argument can always be a function.
    var fu=arguments[arguments.length-1],options=p; if (options instanceof Object) {
      q = (p.q || (p.metric && p.metric.filter(x=>x==-1).length))| 0;
      r = (p.r || (p.metric && p.metric.filter(x=>x==0).length)) | 0;
      p = p.p === undefined ? (p.metric && p.metric.filter(x=>x==1).length) || 0 : p.p || 0;
    } else { options={}; p=p|0; r=r|0; q=q|0; };

  // Support for multi-dual-algebras
    if (options.dual || (p==0 && q==0 && r<0)) { r=options.dual=options.dual||-r; // Create a dual number algebra if r<0 (old) or options.dual set(new)
      options.basis  = [...Array(r+1)].map((a,i)=>i?'e0'+i:'1');  options.metric = [1,...Array(r)]; options.tot=r+1;
      options.Cayley = [...Array(r+1)].map((a,i)=>[...Array(r+1)].map((y,j)=>i*j==0?((i+j)?'e0'+(i+j):'1'):'0'));
    }
    if (options.over) options.baseType = Array;

  // Calculate the total number of dimensions.
    var tot = options.tot = (options.tot||(p||0)+(q||0)+(r||0)||(options.basis&&options.basis.length))|0;

  // Unless specified, generate a full set of Clifford basis names. We generate them as an array of strings by starting
  // from numbers in binary representation and changing the set bits into their relative position.
  // Basis names are ordered first per grade, then lexically (not cyclic!).
  // For 10 or more dimensions all names will be double digits ! 1e01 instead of 1e1 ..
    var basis=(options.basis&&(options.basis.length==2**tot||r<0||options.Cayley)&&options.basis)||[...Array(2**tot)]           // => [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
              .map((x,xi)=>(((1<<30)+xi).toString(2)).slice(-tot||-1)                                                           // => ["000", "001", "010", "011", "100", "101", "110", "111"]  (index of array in base 2)
              .replace(/./g,(a,ai)=>a=='0'?'':String.fromCharCode(66+ai-(r!=0))))                                               // => ["", "3", "2", "23", "1", "13", "12", "123"] (1 bits replaced with their positions, 0's removed)
              .sort((a,b)=>(a.toString().length==b.toString().length)?(a>b?1:b>a?-1:0):a.toString().length-b.toString().length) // => ["", "1", "2", "3", "12", "13", "23", "123"] (sorted numerically)
              .map(x=>x&&'e'+(x.replace(/./g,x=>('0'+(x.charCodeAt(0)-65)).slice(tot>9?-2:-1) ))||'1')                          // => ["1", "e1", "e2", "e3", "e12", "e13", "e23", "e123"] (converted to commonly used basis names)

  // See if the basis names start from 0 or 1, store grade per component and lowest component per grade.
    var low=basis.length==1?1:basis[1].match(/\d+/g)[0]*1,
        grades=options.grades||(options.dual&&basis.map((x,i)=>i?1:0))||basis.map(x=>tot>9?(x.length-1)/2:x.length-1),
        grade_start=grades.map((a,b,c)=>c[b-1]!=a?b:-1).filter(x=>x+1).concat([basis.length]);

  // String-simplify a concatenation of two basis blades. (and supports custom basis names e.g. e21 instead of e12)
  // This is the function that implements e1e1 = +1/-1/0 and e1e2=-e2e1. The brm function creates the remap dictionary.
    var simplify = (s,p,q,r)=>{
          var sign=1,c,l,t=[],f=true,ss=s.match(tot>9?/(\d\d)/g:/(\d)/g);if (!ss) return s; s=ss; l=s.length;
          while (f) { f=false;
          // implement Ex*Ex = metric.
            for (var i=0; i<l;) if (s[i]===s[i+1]) { if (options.metric) sign*=options.metric[s[i]-basis[1][1]]; else if ((s[i]-low)>=(p+r)) sign*=-1; else if ((s[i]-low)<r) sign=0;i+=2; f=true; } else t.push(s[i++]);
          // implement Ex*Ey = -Ey*Ex while sorting basis vectors.
            for (var i=0; i<t.length-1; i++) if (t[i]>t[i+1]) { c=t[i];t[i]=t[i+1];t[i+1]=c;sign*=-1;f=true; break;} if (f) { s=t;t=[];l=s.length; }
          }
          var ret=(sign==0)?'0':((sign==1)?'':'-')+(t.length?'e'+t.join(''):'1'); return (brm&&brm[ret])||(brm&&brm['-'+ret]&&'-'+brm['-'+ret])||ret;
        },
        brm=(x=>{ var ret={}; for (var i in basis) ret[basis[i]=='1'?'1':simplify(basis[i],p,q,r)] = basis[i]; return ret; })(basis);

  // As an alternative to the string fiddling, one can also bit-fiddle. In this case the basisvectors are represented by integers with 1 bit per generator set.
    var simplify_bits = (A,B,p2)=>{ var n=p2||(p+q+r),t=0,ab=A&B,res=A^B; if (ab&((1<<r)-1)) return [0,0]; while (n--) t^=(A=A>>1); t&=B; t^=ab>>(p+r); t^=t>>16; t^=t>>8; t^=t>>4; return [1-2*(27030>>(t&15)&1),res]; },
        bc = (v)=>{ v=v-((v>>1)& 0x55555555); v=(v&0x33333333)+((v>>2)&0x33333333); var c=((v+(v>>4)&0xF0F0F0F)*0x1010101)>>24; return c };

  if (!options.graded && tot <= 6 || options.graded===false || options.Cayley) {
  // Faster and degenerate-metric-resistant dualization. (a remapping table that maps items into their duals).
    var drm=basis.map((a,i)=>{ return {a:a,i:i} })
                 .sort((a,b)=>a.a.length>b.a.length?1:a.a.length<b.a.length?-1:(+a.a.slice(1).split('').sort().join(''))-(+b.a.slice(1).split('').sort().join('')) )
                 .map(x=>x.i).reverse(),
        drms=drm.map((x,i)=>(x==0||i==0)?1:simplify(basis[x]+basis[i])[0]=='-'?-1:1);

  /// Store the full metric (also for bivectors etc ..)
    var metric = options.Cayley&&options.Cayley.map((x,i)=>x[i]) || basis.map((x,xi)=>simplify(x+x,p,q,r)|0); metric[0]=1;

  /// Generate multiplication tables for the outer and geometric products.
    var mulTable   = options.Cayley||basis.map(x=>basis.map(y=>(x==1)?y:(y==1)?x:simplify(x+y,p,q,r)));

  // subalgebra support. (must be bit-order basis blades, does no error checking.)
    if (options.even) options.basis = basis.filter(x=>x.length%2==1);
    if (options.basis && !options.Cayley && r>=0 && options.basis.length != 2**tot) {
      metric = metric.filter((x,i)=>options.basis.indexOf(basis[i])!=-1);
      mulTable = mulTable.filter((x,i)=>options.basis.indexOf(basis[i])!=-1).map(x=>x.filter((x,i)=>options.basis.indexOf(basis[i])!=-1));
      basis  = options.basis;
    }

  /// Convert Cayley table to product matrices. The outer product selects the strict sum of the GP (but without metric), the inner product
  /// is the left contraction.
    var gp=basis.map(x=>basis.map(x=>'0')), cp=gp.map(x=>gp.map(x=>'0')), cps=gp.map(x=>gp.map(x=>'0')), op=gp.map(x=>gp.map(x=>'0')), gpo={};          // Storage for our product tables.
    basis.forEach((x,xi)=>basis.forEach((y,yi)=>{ var n = mulTable[xi][yi].replace(/^-/,''); if (!gpo[n]) gpo[n]=[]; gpo[n].push([xi,yi]); }));
    basis.forEach((o,oi)=>{
      gpo[o].forEach(([xi,yi])=>op[oi][xi]=(grades[oi]==grades[xi]+grades[yi])?((mulTable[xi][yi]=='0')?'0':((mulTable[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']'):'0');
      gpo[o].forEach(([xi,yi])=>{
        gp[oi][xi] =((gp[oi][xi]=='0')?'':gp[oi][xi]+'+')   + ((mulTable[xi][yi]=='0')?'0':((mulTable[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']');
        cp[oi][xi] =((cp[oi][xi]=='0')?'':cp[oi][xi]+'+')   + ((grades[oi]==grades[yi]-grades[xi])?gp[oi][xi]:'0');
        cps[oi][xi]=((cps[oi][xi]=='0')?'':cps[oi][xi]+'+') + ((grades[oi]==Math.abs(grades[yi]-grades[xi]))?gp[oi][xi]:'0');
      });
    });

  /// Flat Algebra Multivector Base Class.
    var generator = class MultiVector extends (options.baseType||Float32Array) {
    /// constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a||basis.length); return this; }

    /// grade selection - return a only the part of the input with the specified grade.
      Grade(grade,res) { res=res||new this.constructor(); for (var i=0,l=res.length; i<l; i++) if (grades[i]==grade) res[i]=this[i]; else res[i]=0; return res; }
      Even(res) { res=res||new this.constructor(); for (var i=0,l=res.length; i<l; i++) if (grades[i]%2==0) res[i]=this[i]; else res[i]=0; return res; }

    /// grade creation - convert array with just one grade to full multivector.
      nVector(grade,...args) { this.set(args,grade_start[grade]); return this; }

    /// Fill in coordinates (accepts sequence of index,value as arguments)
      Coeff() { for (var i=0,l=arguments.length; i<l; i+=2) this[arguments[i]]=arguments[i+1]; return this; }

    /// Negates specific grades (passed in as args)
      Map(res, ...a) { for (var i=0, l=res.length; i<l; i++) res[i] = (~a.indexOf(grades[i]))?-this[i]:this[i]; return res; }

    /// Returns the vector grade only.
      get Vector ()    { return this.slice(grade_start[1],grade_start[2]); };

      toString() { var res=[]; for (var i=0; i<basis.length; i++) if (Math.abs(this[i])>1e-10) res.push(((this[i]==1)&&i?'':((this[i]==-1)&&i)?'-':(this[i].toFixed(10)*1))+(i==0?'':tot==1&&q==1?'i':basis[i].replace('e','e_'))); return res.join('+').replace(/\+-/g,'-')||'0'; }

    /// Reversion, Involutions, Conjugation for any number of grades, component acces shortcuts.
      get Negative (){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= -this[i]; return res; };
      get Reverse (){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,1,-1,-1][grades[i]%4]; return res; };
      get Involute (){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,1,-1][grades[i]%4]; return res; };
      get Conjugate (){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,-1,1][grades[i]%4]; return res; };

    /// The Dual, Length, non-metric length and normalized getters.
      get Dual (){ if (r) return this.map((x,i,a)=>a[drm[i]]*drms[i]); var res = new this.constructor(); res[res.length-1]=1; return res.Mul(this); };
      get Length (){ return options.over?Math.sqrt(Math.abs(this.Mul(this.Conjugate).s.s)):Math.sqrt(Math.abs(this.Mul(this.Conjugate).s)); };
      get VLength (){ var res = 0; for (var i=0; i<this.length; i++) res += this[i]*this[i]; return Math.sqrt(res); };
      get Normalized (){ var res = new this.constructor(),l=this.Length; if (!l) return this; l=1/l; for (var i=0; i<this.length; i++) if (options.over) {res[i]=this[i].Scale(l);} else {res[i]=this[i]*l}; return res; };
    }

  /// Convert symbolic matrices to code. (skipping zero's on dot and wedge matrices).
  /// These all do straightforward string fiddling. If the 'mix' option is set they reference basis components using e.g. '.e1' instead of eg '[3]' .. so that
  /// it will work for elements of subalgebras etc.
    generator.prototype.Add   = new Function('b,res','res=res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=b['+xi+']+this['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res')
    generator.prototype.Scale = new Function('b,res','res=res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=b*this['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res')
    generator.prototype.Sub   = new Function('b,res','res=res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=this['+xi+']-b['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res')
    generator.prototype.Mul   = new Function('b,res','res=res||new this.constructor();\n'+gp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a).replace(/\+0/g,'')+';').join('\n')+'\nreturn res;');
    generator.prototype.LDot  = new Function('b,res','res=res||new this.constructor();\n'+cp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
    generator.prototype.Dot   = new Function('b,res','res=res||new this.constructor();\n'+cps.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
    generator.prototype.Wedge = new Function('b,res','res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
//    generator.prototype.Vee   = new Function('b,res','res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+drm[ri]+']='+r.map(x=>x.replace(/\[(.*?)\]/g,function(a,b){return '['+(drm[b|0])+']'})).join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
  /// Conforms to the new Chapter 11 now.
    generator.prototype.Vee   = new Function('b,res',('res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+drm[ri]+']='+drms[ri]+'*('+r.map(x=>x.replace(/\[(.*?)\]/g,function(a,b){return '['+(drm[b|0])+']'+(drms[b|0]>0?"":"*-1")})).join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+');').join('\n')+'\nreturn res;').replace(/(b\[)|(this\[)/g,a=>a=='b['?'this[':'b['));

  /// Add getter and setters for the basis vectors/bivectors etc ..
    basis.forEach((b,i)=>Object.defineProperty(generator.prototype, i?b:'s', {
      configurable: true, get(){ return this[i] }, set(x){ this[i]=x; }
    }));

  /// Graded generator for high-dimensional algebras.
  } else {

  /// extra graded lookups.
    var basisg = grade_start.slice(0,grade_start.length-1).map((x,i)=>basis.slice(x,grade_start[i+1]));
    var counts = grade_start.map((x,i,a)=>i==a.length-1?0:a[i+1]-x).slice(0,tot+1);
    var basis_bits = basis.map(x=>x=='1'?0:x.slice(1).match(tot>9?/\d\d/g:/\d/g).reduce((a,b)=>a+(1<<(b-low)),0)),
        bits_basis = []; basis_bits.forEach((b,i)=>bits_basis[b]=i);
    var metric = basisg.map((x,xi)=>x.map((y,yi)=>simplify_bits(basis_bits[grade_start[xi]+yi],basis_bits[grade_start[xi]+yi])[0]));
    var drms   = basisg.map((x,xi)=>x.map((y,yi)=>simplify_bits(basis_bits[grade_start[xi]+yi],(~basis_bits[grade_start[xi]+yi])&((1<<tot)-1))[0]));

  /// Flat Algebra Multivector Base Class.
    var generator = class MultiVector extends Array {
    /// constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a||tot); return this; }

    /// grade selection - return a only the part of the input with the specified grade.
      Grade(grade,res) { res=new this.constructor(); res[grade] = this[grade]; return res; }

    /// grade creation - convert array with just one grade to full multivector.
      nVector(grade,...args) { this[grade]=args; return this; }

    /// Fill in coordinates (accepts sequence of index,value as arguments)
      Coeff() {
                for (var i=0,l=arguments.length; i<l; i+=2) if (arguments[i+1]) {
                 var gi = grades[arguments[i]];
                 if (this[gi]==undefined) this[gi]=[];
                 this[gi][arguments[i]-grade_start[gi]]=arguments[i+1];
                }
                return this;
              }

    /// Negates specific grades (passed in as args)
      Map(res, ...a) {  /* tbc */ }

    /// Returns the vector grade only.
      get Vector ()    { return this[1] };

    /// multivector addition, subtraction and scalar multiplication.
      Add(b,r) {
        r=r||new this.constructor();
        for (var i=0,l=Math.max(this.length,b.length);i<l;i++)
          if (!this[i] ^ !b[i]) r[i] = (!this[i]) ? b[i].slice():this[i].slice();
          else if (!(this[i]||b[i])) {}
          else { if (r[i]==undefined) r[i]=[]; for(var j=0,m=Math.max(this[i].length,b[i].length);j<m;j++)
          {
            if (typeof this[i][j]=="string" || typeof r[i][j]=="string" || typeof b[i][j]=="string") {
             if (!this[i][j]) r[i][j] = ""+b[i][j];
             else if (!b[i][j]) r[i][j] = ""+this[i][j];
             else r[i][j]="("+(this[i][j]||"0")+(b[i][j][0]=="-"?"":"+")+(b[i][j]||"0")+")";
            } else r[i][j]=(this[i][j]||0)+(b[i][j]||0);
          }}
        return r;
      }
      Sub(b,r) {
        r=r||new this.constructor();
        for (var i=0,l=Math.max(this.length,b.length);i<l;i++)
          if (!this[i] || !b[i]) r[i] = (!this[i]) ? (b[i]?b[i].map(x=>(typeof x=="string")?"-"+x:-x):undefined):this[i];
          else { if (r[i]==undefined) r[i]=[]; for(var j=0,m=Math.max(this[i].length,b[i].length);j<m;j++)
            if (typeof this[i][j]=="string" || typeof r[i][j]=="string" || typeof b[i][j]=="string") r[i][j]="("+(this[i][j]||"0")+"-"+(b[i][j]||"0")+")";
            else r[i][j]=(this[i][j]||0)-(b[i][j]||0);
          }
        return r;
      }
      Scale(s) { return this.map(x=>x&&x.map(y=>typeof y=="string"?y+"*"+s:y*s)); }

    // geometric product.
      Mul(b,r) {
        r=r||new this.constructor(); var gotstring=false;
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i==j && a==bb) { r[0] = r[0]||(typeof x[0]=="string" || typeof y[bb]=="string"?[""]:[0]);
            if (typeof x[a]=="string" || typeof r[0][0]=="string" || typeof y[bb]=="string") {
            r[0][0] = (r[0][0]?(r[0][0]+(x[a][0]=="-"?"":"+")):"")+ x[a]+"*"+y[bb]+(metric[i][a]!=1?"*"+metric[i][a]:"");  gotstring=true;
            } else r[0][0] += x[a]*y[bb]*metric[i][a];
          } else {
             var rn=simplify_bits(basis_bits[gsx+a],basis_bits[gsy+bb]), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g];
             if (!r[g])r[g]=[];
               if (typeof r[g][e]=="string"||typeof x[a]=="string"||typeof y[bb]=="string") {
                 r[g][e] = (r[g][e]?r[g][e]+"+":"") + (rn[0]!=1?rn[0]==-1?"-":rn[0]+"*":"")+ x[a]+(y[bb]!=1?"*"+y[bb]:""); gotstring=true;
               } else r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb];
          }
        }
        if (gotstring) return r.map(g=>g.map(e=>e&&(!(e+'').match(/-{0,1}\w+/))?'('+e+')':e))
        return r;
      }
    // outer product.
      Wedge(b,r) {
        r=r||new this.constructor();
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i!=j || a!=bb) {
             var n1=basis_bits[gsx+a], n2=basis_bits[gsy+bb], rn=simplify_bits(n1,n2,tot), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g];
             if (g == i+j) { if (!r[g]) r[g]=[]; r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb]; }
          }
        }
        return r;
      }
    // outer product glsl output.
      OPNS_GLSL(b,point_source) {
        var r='',count=0,curg;
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<counts[i]; a++) for (var bb=0; bb<counts[j]; bb++) {
          if (i!=j || a!=bb) {
             var n1=basis_bits[gsx+a], n2=basis_bits[gsy+bb], rn=simplify_bits(n1,n2,tot), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g];
             if (g == i+j) { curg=g; r += `res[${e}]${rn[0]=='1'?"+=":"-="}(${(point_source[a]+'').replace(/1([^.\d])|1$/g,"1.0$1")})*b[${bb}]; //${count++}\n`;  }
          }
        }
        r=r.split('\n').filter(x=>x).sort((a,b)=>((a.match(/\d+/)[0]|0)-(b.match(/\d+/)[0]|0))||((a.match(/\d+$/)[0]|0)-(b.match(/\d+$/)[0]|0))).map(x=>x.replace(/\/\/\d+$/,''));
        var r2 = 'float sum=0.0; float res=0.0;\n', g=0;
        r.forEach(x=>{
          var cg = x.match(/\d+/)[0]|0;
          if (cg != g) r2 += "sum += res*res;\nres = 0.0;\n";
          r2 += x.replace(/\[\d+\]/,'') + '\n';
          g=cg;
        });
        r2+= "sum += res*res;\n";
        return r2;
      }
    // Inner product glsl output.  
      IPNS_GLSL(b,point_source) {
        var r='',count=0,curg;
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<counts[i]; a++) for (var bb=0; bb<counts[j]; bb++) {
           var n1=basis_bits[gsx+a], n2=basis_bits[gsy+bb], rn=simplify_bits(n1,n2,tot), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g];
           if (g == Math.abs(i-j) && point_source[a]) { curg=g; r += `res[${e}]${rn[0]=='1'?"+=":"-="}(${(point_source[a]+'').replace(/1([^.\d])|1$/g,"1.0$1")})*b[${bb}]; //${count++}\n`;  }
        }
        r=r.split('\n').filter(x=>x).sort((a,b)=>((a.match(/\d+/)[0]|0)-(b.match(/\d+/)[0]|0))||((a.match(/\d+$/)[0]|0)-(b.match(/\d+$/)[0]|0))).map(x=>x.replace(/\/\/\d+$/,''));
        var r2 = 'float sum=0.0; float res=0.0;\n', g=0;
        r.forEach(x=>{
          var cg = x.match(/\d+/)[0]|0;
          if (cg != g) r2 += "sum += res*res;\nres = 0.0;\n";
          r2 += x.replace(/\[\d+\]/,'') + '\n';
          g=cg;
        });
        r2+= "sum += res*res;\n";
        return r2;
      }
    // Left contraction.
      LDot(b,r) {
        r=r||new this.constructor();
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i==j && a==bb) { r[0] = r[0]||[0]; r[0][0] += x[a]*y[bb]*metric[i][a]; }
          else {
             var rn=simplify_bits(basis_bits[gsx+a],basis_bits[gsy+bb]), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g];
             if (g == j-i) { if (!r[g])r[g]=[]; r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb]; }
          }
        }
        return r;
      }
    // Symmetric contraction.
      Dot(b,r) {
        r=r||new this.constructor();
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i==j && a==bb) { r[0] = r[0]||[0]; r[0][0] += x[a]*y[bb]*metric[i][a]; }
          else {
             var rn=simplify_bits(basis_bits[gsx+a],basis_bits[gsy+bb]), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g];
             if (g == Math.abs(j-i)) { if (!r[g])r[g]=[]; r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb]; }
          }
        }
        return r;
      }
    // Should be optimized..
      Vee(b,r)          { return (this.Dual.Wedge(b.Dual)).Dual; }
    // Output, lengths, involutions, normalized, dual.
      toString()        { return [...this].map((g,gi)=>g&&g.map((c,ci)=>!c?undefined:((c+'').match(/[\+\-\*]/)?'('+c+')':c)+(gi==0?"":basisg[gi][ci])).filter(x=>x).join('+')).filter(x=>x).join('+').replace(/\+\-/g,'-')||"0"; }
      get s ()          { if (this[0]) return this[0][0]||0; return 0; }
      get Length ()     { var res=0; this.forEach((g,gi)=>g&&g.forEach((e,ei)=>res+=(e||0)**2*metric[gi][ei])); return Math.abs(res)**.5; }
      get VLength ()    { var res=0; this.forEach((g,gi)=>g&&g.forEach((e,ei)=>res+=(e||0)**2)); return Math.abs(res)**.5; }
      get Reverse ()    { var r=new this.constructor(); this.forEach((x,gi)=>x&&x.forEach((e,ei)=>{if(!r[gi])r[gi]=[]; r[gi][ei] = this[gi][ei]*[1,1,-1,-1][gi%4]; })); return r; }
      get Involute ()   { var r=new this.constructor(); this.forEach((x,gi)=>x&&x.forEach((e,ei)=>{if(!r[gi])r[gi]=[]; r[gi][ei] = this[gi][ei]*[1,-1,1,-1][gi%4]; })); return r; }
      get Conjugate ()  { var r=new this.constructor(); this.forEach((x,gi)=>x&&x.forEach((e,ei)=>{if(!r[gi])r[gi]=[]; r[gi][ei] = this[gi][ei]*[1,-1,-1,1][gi%4]; })); return r; }
      get Dual()        { var r=new this.constructor(); this.forEach((g,gi)=>{ if (!g) return; r[tot-gi]=[]; g.forEach((e,ei)=>r[tot-gi][counts[gi]-1-ei]=drms[gi][ei]*e); }); return r; }
      get Normalized () { return this.Scale(1/this.Length); }
    }


   // This generator is UNDER DEVELOPMENT - I'm publishing it so I can test on observable.
  }

  // Generate a new class for our algebra. It extends the javascript typed arrays (default float32 but can be specified in options).
    var res = class Element extends generator {

    // constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a); if (this.upgrade) this.upgrade(); return this; }

    // Grade selection. (implemented by parent class).
      Grade(grade,res) { res=res||new Element(); return super.Grade(grade,res); }

    // Right and Left divide - Defined on the elements, shortcuts to multiplying with the inverse.
      Div  (b,res) { return this.Mul(b.Inverse,res); }
      LDiv (b,res) { return b.Inverse.Mul(this,res); }

    // Taylor exp - for PGA bivectors in 2D and 3D closed form solution is used.
      Exp  ()      {
        if (options.dual) { var f=Math.exp(this.s); return this.map((x,i)=>i?x*f:f); }
        if (r==1 && tot<=4 && Math.abs(this[0])<1E-9 && !options.over) {
           var u = Math.sqrt(Math.abs(this.Dot(this).s)); if (Math.abs(u)<1E-5) return this.Add(Element.Scalar(1));
           var v = this.Wedge(this).Scale(-1/(2*u)); 
           var res2 = Element.Add(Element.Sub(Math.cos(u),v.Scale(Math.sin(u))),Element.Div(Element.Mul((Element.Add(Math.sin(u),v.Scale(Math.cos(u)))),this),(Element.Add(u,v))));
           return res2;       
        }
        var res = Element.Scalar(1), y=1, M= this.Scale(1), N=this.Scale(1); for (var x=1; x<15; x++) { res=res.Add(M.Scale(1/y)); M=M.Mul(N); y=y*(x+1); }; return res;
      }
      
    // Log - only for up to 3D PGA for now
      Log () {
        if (tot>5 || options.over) return;
        var b = this.Grade(2), bdb = Element.Dot(b,b).s;
        if (Math.abs(bdb)<=1E-5) return this.s<0?b.Scale(-1):b;
        var s = Math.sqrt(-bdb), bwb = Element.Wedge(b,b); 
        if (Math.abs(bwb[bwb.length-1])<=1E-5 || Math.abs(this.s)<=1E-5) return b.Scale(Math.atan2(s,this.s)/s);
        var p = bwb.Scale(-1/(2*s));
        return Element.Mul(Element.Mul((Element.Add(Math.atan2(s,this.s),p.Scale(1/this.s))),b),Element.Sub(s,p)).Scale(1/(s*s));        
      }  

    // Helper for efficient inverses. (custom involutions - negates grades in arguments).
      Map () { var res=new Element(); return super.Map(res,...arguments); }

    // Factories - Make it easy to generate vectors, bivectors, etc when using the functional API. None of the examples use this but
    // users that have used other GA libraries will expect these calls. The Coeff() is used internally when translating algebraic literals.
      static Element()   { return new Element([...arguments]); };
      static Coeff()     { return (new Element()).Coeff(...arguments); }
      static Scalar(x)   { return (new Element()).Coeff(0,x); }
      static Vector()    { return (new Element()).nVector(1,...arguments); }
      static Bivector()  { return (new Element()).nVector(2,...arguments); }
      static Trivector() { return (new Element()).nVector(3,...arguments); }
      static nVector(n)  { return (new Element()).nVector(...arguments); }

    // Static operators. The parser will always translate operators to these static calls so that scalars, vectors, matrices and other non-multivectors can also be handled.
    // The static operators typically handle functions and matrices, calling through to element methods for multivectors. They are intended to be flexible and allow as many
    // types of arguments as possible. If performance is a consideration, one should use the generated element methods instead. (which only accept multivector arguments)
      static toEl(x)        { if (x instanceof Function) x=x(); if (!(x instanceof Element)) x=Element.Scalar(x); return x; }

    // Addition and subtraction. Subtraction with only one parameter is negation.
      static Add(a,b,res)   {
      // Resolve expressions passed in.
        while(a.call)a=a(); while(b.call)b=b(); if (a.Add && b.Add) return a.Add(b,res);
      // If either is a string, the result is a string.
        if ((typeof a=='string')||(typeof b=='string')) return a.toString()+b.toString();
      // If only one is an array, add the other element to each of the elements.
        if ((a instanceof Array && !a.Add)^(b instanceof Array && !b.Add)) return (a instanceof Array)?a.map(x=>Element.Add(x,b)):b.map(x=>Element.Add(a,x));
      // If both are equal length arrays, add elements one-by-one
        if ((a instanceof Array)&&(b instanceof Array)&&a.length==b.length) return a.map((x,xi)=>Element.Add(x,b[xi]));
      // If they're both not elements let javascript resolve it.
        if (!(a instanceof Element || b instanceof Element)) return a+b;
      // Here we're left with scalars and multivectors, call through to generated code.
        a=Element.toEl(a); b=Element.toEl(b); return a.Add(b,res);
      }

      static Sub(a,b,res)   {
      // Resolve expressions passed in.
        while(a.call)a=a(); while(b&&b.call) b=b(); if (a.Sub && b && b.Sub) return a.Sub(b,res);
      // If only one is an array, add the other element to each of the elements.
        if (b&&((a instanceof Array)^(b instanceof Array))) return (a instanceof Array)?a.map(x=>Element.Sub(x,b)):b.map(x=>Element.Sub(a,x));
      // If both are equal length arrays, add elements one-by-one
        if (b&&(a instanceof Array)&&(b instanceof Array)&&a.length==b.length) return a.map((x,xi)=>Element.Sub(x,b[xi]));
      // Negation
        if (arguments.length==1) return Element.Mul(a,-1);
      // If none are elements here, let js do it.
        if (!(a instanceof Element || b instanceof Element)) return a-b;
      // Here we're left with scalars and multivectors, call through to generated code.
        a=Element.toEl(a); b=Element.toEl(b); return a.Sub(b,res);
      }

    // The geometric product. (or matrix*matrix, matrix*vector, vector*vector product if called with 1D and 2D arrays)
      static Mul(a,b,res)   {
      // Resolve expressions
        while(a.call&&!a.length)a=a(); while(b.call&&!b.length)b=b(); if (a.Mul && b.Mul) return a.Mul(b,res);
      // still functions -> experimental curry style (dont use this.)
        if (a.call && b.call) return (ai,bi)=>Element.Mul(a(ai),b(bi));
      // scalar mul.
        if (Number.isFinite(a) && b.Scale) return b.Scale(a); else if (Number.isFinite(b) && a.Scale) return a.Scale(b);
      // Handle matrices and vectors.
        if ((a instanceof Array)&&(b instanceof Array)) {
        // vector times vector performs a dot product. (which internally uses the GP on each component)
          if((!(a[0] instanceof Array) || (a[0] instanceof Element)) &&(!(b[0] instanceof Array) || (b[0] instanceof Element))) { var r=tot?Element.Scalar(0):0; a.forEach((x,i)=>r=Element.Add(r,Element.Mul(x,b[i]),r)); return r; }
        // Array times vector
          if(!(b[0] instanceof Array)) return a.map((x,i)=>Element.Mul(a[i],b));
        // Array times Array
          var r=a.map((x,i)=>b[0].map((y,j)=>{ var r=tot?Element.Scalar(0):0; x.forEach((xa,k)=>r=Element.Add(r,Element.Mul(xa,b[k][j]))); return r; }));
        // Return resulting array or scalar if 1 by 1.
          if (r.length==1 && r[0].length==1) return r[0][0]; else return r;
        }
      // Only one is an array multiply each of its elements with the other.
        if ((a instanceof Array)^(b instanceof Array)) return (a instanceof Array)?a.map(x=>Element.Mul(x,b)):b.map(x=>Element.Mul(a,x));
      // Try js multiplication, else call through to geometric product.
        var r=a*b; if (!isNaN(r)) return r;
        a=Element.toEl(a); b=Element.toEl(b); return a.Mul(b,res);
      }

    // The inner product. (default is left contraction).
      static LDot(a,b,res)   {
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); //if (a.LDot) return a.LDot(b,res);
      // Map elements in array
        if (b instanceof Array && !(a instanceof Array)) return b.map(x=>Element.LDot(a,x));
        if (a instanceof Array && !(b instanceof Array)) return a.map(x=>Element.LDot(x,b));
      // js if numbers, else contraction product.
        if (!(a instanceof Element || b instanceof Element)) return a*b;
        a=Element.toEl(a);b=Element.toEl(b); return a.LDot(b,res);
      }

    // The symmetric inner product. (default is left contraction).
      static Dot(a,b,res)   {
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); //if (a.LDot) return a.LDot(b,res);
      // js if numbers, else contraction product.
        if (!(a instanceof Element || b instanceof Element)) return a|b;
        a=Element.toEl(a);b=Element.toEl(b); return a.Dot(b,res);
      }

    // The outer product. (Grassman product - no use of metric)
      static Wedge(a,b,res) {
      // normal behavior for booleans/numbers
        if (typeof a in {boolean:1,number:1} && typeof b in {boolean:1,number:1}) return a^b;
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.Wedge) return a.Wedge(Element.toEl(b),res);
      // The outer product of two vectors is a matrix .. internally Mul not Wedge !
        if (a instanceof Array && b instanceof Array) return a.map(xa=>b.map(xb=>Element.Mul(xa,xb)));
      // js, else generated wedge product.
        if (!(a instanceof Element || b instanceof Element)) return a*b;
        a=Element.toEl(a);b=Element.toEl(b); return a.Wedge(b,res);
      }

    // The regressive product. (Dual of the outer product of the duals).
      static Vee(a,b,res) {
      // normal behavior for booleans/numbers
        if (typeof a in {boolean:1,number:1} && typeof b in {boolean:1,number:1}) return a&b;
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.Vee) return a.Vee(Element.toEl(b),res);
      // js, else generated vee product. (shortcut for dual of wedge of duals)
        if (!(a instanceof Element || b instanceof Element)) return 0;
        a=Element.toEl(a);b=Element.toEl(b); return a.Vee(b,res);
      }

    // The sandwich product. Provided for convenience (>>> operator)
      static sw(a,b) {
      // Skip strings/colors
        if (typeof b == "string" || typeof b =="number") return b;
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.sw) return a.sw(b);
      // Map elements in array
        if (b instanceof Array && !b.Add) return b.map(x=>Element.sw(a,x));
      // Call through. no specific generated code for it so just perform the muls.
        a=Element.toEl(a); b=Element.toEl(b); return a.Mul(b).Mul(a.Reverse);
      }

    // Division - scalars or cal through to element method.
      static Div(a,b,res) {
      // Expressions
        while(a.call)a=a(); while(b.call)b=b();
      // For DDG experiments, I'll include a quick cholesky on matrices here. (vector/matrix)
        if ((a instanceof Array) && (b instanceof Array) && (b[0] instanceof Array)) {
          // factor
          var R = b.flat(), i, j, k, sum, i_n, j_n, n=b[0].length, s=new Array(n), x=new Array(n), yi;
          for (i=0;i<n;i++) { i_n = i*n;
            for (j=0; j<i; j++) { j_n=j*n;
              s[j] = R[i_n+j];
              for (k=0;k<j;k++) s[j] -= s[k]*R[j_n+k];
              if (R[j_n+j] == 0) return null;
              R[i_n+j] = s[j]/R[j_n+j];
            }
            sum = R[i_n+i];
            for (k=0;k<i; k++)  sum -= s[k]*R[i_n+k];
            R[i_n+i] = sum;
          }        
          // subst
          for (i=0; i<n; i++) for (x[i]=a[i],j=0;j<=i-1;j++) x[i]-=R[i*n+j]*x[j];
          for (i=n-1; i>=0; i--) for (x[i] /= R[i*n+i], j=i+1; j<n; j++) x[i] -= R[j*n+i]*x[j];
          return x;
        }
      // js or call through to element divide.
        if (!(a instanceof Element || b instanceof Element)) return a/b;
        a=Element.toEl(a);
        if (Number.isFinite(b)) { return a.Scale(1/b,res); }
        b=Element.toEl(b); return a.Div(b,res);
      }

    // Pow - needs obvious extensions for natural powers. (exponentiation by squaring)
      static Pow(a,b,res) {
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.Pow) return a.Pow(b,res);
      // Exponentiation.
        if (a===Math.E && b.Exp) return b.Exp();
      // Squaring
        if (b===2) return this.Mul(a,a,res);
      // No elements, call through to js
        if (!(a instanceof Element || b instanceof Element)) return a**b;
      // Inverse
        if (b===-1) return a.Inverse;
      // Call through to element pow.
        a=Element.toEl(a); return a.Pow(b);
      }

    // Handles scalars and calls through to element method.
      static exp(a) {
      // Expressions.
        while(a.call)a=a();
      // If it has an exp callthrough, use it, else call through to math.
        if (a.Exp) return a.Exp();
        return Math.exp(a);
      }

    // Dual, Involute, Reverse, Conjugate, Normalize and length, all direct call through. Conjugate handles matrices.
      static Dual(a)      { if (typeof a=='boolean' || typeof a=='number') return !a; return Element.toEl(a).Dual; };
      static Involute(a)  { return Element.toEl(a).Involute; };
      static Reverse(a)   { return Element.toEl(a).Reverse; };
      static Conjugate(a) { if (a.Conjugate) return a.Conjugate; if (a instanceof Array) return a[0].map((c,ci)=>a.map((r,ri)=>Element.Conjugate(a[ri][ci]))); return Element.toEl(a).Conjugate; }
      static Normalize(a) { return Element.toEl(a).Normalized; };
      static Length(a)    { return Element.toEl(a).Length };

    // Comparison operators always use length. Handle expressions, then js or length comparison
      static eq(a,b)  { if (!(a instanceof Element)||!(b instanceof Element)) return a==b; while(a.call)a=a(); while(b.call)b=b(); for (var i=0; i<a.length; i++) if (a[i]!=b[i]) return false; return true; }
      static neq(a,b) { if (!(a instanceof Element)||!(b instanceof Element)) return a!=b; while(a.call)a=a(); while(b.call)b=b(); for (var i=0; i<a.length; i++) if (a[i]!=b[i]) return true; return false; }
      static lt(a,b)  { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)<(b instanceof Element?b.Length:b); }
      static gt(a,b)  { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)>(b instanceof Element?b.Length:b); }
      static lte(a,b) { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)<=(b instanceof Element?b.Length:b); }
      static gte(a,b) { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)>=(b instanceof Element?b.Length:b); }

    // Debug output and printing multivectors.
      static describe(x) { if (x===true) console.log(`Basis\n${basis}\nMetric\n${metric.slice(1,1+tot)}\nCayley\n${mulTable.map(x=>(x.map(x=>('           '+x).slice(-2-tot)))).join('\n')}\nMatrix Form:\n`+gp.map(x=>x.map(x=>x.match(/(-*b\[\d+\])/)).map(x=>x&&((x[1].match(/-/)||' ')+String.fromCharCode(65+1*x[1].match(/\d+/)))||' 0')).join('\n')); return {basis:basisg||basis,metric,mulTable,matrix:gp.map(x=>x.map(x=>x.replace(/\*this\[.+\]/,'').replace(/b\[(\d+)\]/,(a,x)=>(metric[x]==-1||metric[x]==0&&grades[x]>1&&(-1)**grades[x]==(metric[basis.indexOf(basis[x].replace('0',''))]||(-1)**grades[x])?'-':'')+basis[x]).replace('--','')))} }

    // Direct sum of algebras - experimental
      static sum(B){
        var A = Element;
        // Get the multiplication tabe and basis.
        var T1 = A.describe().mulTable, T2 = B.describe().mulTable;
        var B1 = A.describe().basis, B2 = B.describe().basis;
        // Get the maximum index of T1, minimum of T2 and rename T2 if needed.
        var max_T1 = B1.filter(x=>x.match(/e/)).map(x=>x.match(/\d/g)).flat().map(x=>x|0).sort((a,b)=>b-a)[0];
        var max_T2 = B2.filter(x=>x.match(/e/)).map(x=>x.match(/\d/g)).flat().map(x=>x|0).sort((a,b)=>b-a)[0];
        var min_T2 = B2.filter(x=>x.match(/e/)).map(x=>x.match(/\d/g)).flat().map(x=>x|0).sort((a,b)=>a-b)[0];
        // remapping ..
        T2 = T2.map(x=>x.map(y=>y.match(/e/)?y.replace(/(\d)/g,(x)=>(x|0)+max_T1):y.replace("1","e"+(1+max_T2+max_T1))));
        B2 = B2.map((y,i)=>i==0?y.replace("1","e"+(1+max_T2+max_T1)):y.replace(/(\d)/g,(x)=>(x|0)+max_T1));
        // Build the new basis and multable..
        var basis = [...B1,...B2];
        var Cayley = T1.map((x,i)=>[...x,...T2[0].map(x=>"0")]).concat(T2.map((x,i)=>[...T1[0].map(x=>"0"),...x]))
        // Build the new algebra.
        var grades = [...B1.map(x=>x=="1"?0:x.length-1),...B2.map((x,i)=>i?x.length-1:0)];
        var a = Algebra({basis,Cayley,grades,tot:Math.log2(B1.length)+Math.log2(B2.length)})
        // And patch up ..
        a.Scalar = function(x) {
          var res = new a();
          for (var i=0; i<res.length; i++) res[i] = basis[i] == Cayley[i][i] ? x:0;
          return res;
        }
        return a;
      }

    // The graphing function supports several modes. It can render 1D functions and 2D functions on canvas, and PGA2D, PGA3D and CGA2D functions using SVG.
    // It handles animation and interactivity.
    //   graph(function(x))     => function of 1 parameter will be called with that parameter from -1 to 1 and graphed on a canvas. Returned values should also be in the [-1 1] range
    //   graph(function(x,y))   => functions of 2 parameters will be called from -1 to 1 on both arguments. Returned values can be 0-1 for greyscale or an array of three RGB values.
    //   graph(array)           => array of algebraic elements (points, lines, circles, segments, texts, colors, ..) is graphed.
    //   graph(function=>array) => same as above, for animation scenario's this function is called each frame.
    // An optional second parameter is an options object { width, height, animate, camera, scale, grid, canvas }
      static graph(f,options) {
      // Store the original input
        if (!f) return; var origf=f;
      // generate default options.
        options=options||{}; options.scale=options.scale||1; options.camera=options.camera||(tot!=4?Element.Scalar(1): ( Element.Bivector(0,0,0,0,0,options.p||0).Exp() ).Mul( Element.Bivector(0,0,0,0,options.h||0,0).Exp()) );
        if (options.conformal && tot==4) var ni = options.ni||this.Coeff(4,1,3,1), no = options.no||this.Coeff(4,0.5,3,-0.5), minus_no = no.Scale(-1);
        var ww=options.width, hh=options.height, cvs=options.canvas, tpcam=new Element([0,0,0,0,0,0,0,0,0,0,0,-5,0,0,1,0]),tpy=this.Coeff(4,1),tp=new Element(),
      // project 3D to 2D. This allows to render 3D and 2D PGA with the same code.
        project=(o)=>{ if (!o) return o; while (o.call) o=o(); 
//          if (o instanceof Element && o.length == 32) o = new Element([o[0],o[1],o[2],o[3],o[4],o[6],o[7],o[8],o[10],o[11],o[13],o[16],o[17],o[19],o[22],o[26]]); 
          // Clip 3D lines so they don't go past infinity.
          if (o instanceof Element && o.length == 16 && o[8]**2+o[9]**2+o[10]**2>0.0001) {
            o = [[options.clip||2,1,0,0],[-(options.clip||2),1,0,0],[options.clip||2,0,1,0],[-(options.clip||2),0,1,0],[options.clip||2,0,0,1],[-(options.clip||2),0,0,1]].map(v=>{
              var r = Element.Vector(...v).Wedge(o); return r[14]?r.Scale(1/r[14], r):undefined;
            }).filter(x=>x && Math.abs(x[13])<= (options.clip||2)+0.001 && Math.abs(x[12]) <= (options.clip||2)+0.001 && Math.abs(x[11]) <= (options.clip||2) + 0.001);
            return o.map(o=>(tpcam).Vee(options.camera.Mul(o).Mul(options.camera.Conjugate)).Wedge(tpy));
          } 
          // Convert 3D planes to polies.
          if (o instanceof Element && o.length == 16 && o.Grade(1).Length>0.01) {
            var m = Element.Add(1, Element.Mul(o.Normalized, Element.Coeff(3,1))).Normalized, e0 = 0;
            o=Element.sw(m,[[-1,-1],[-1,1],[1,1],[-1,-1],[1,1],[1,-1]].map(([x,z])=>Element.Trivector(x*o.Length,e0,z*o.Length,1)));
            return o.map(o=>(tpcam).Vee(options.camera.Mul(o).Mul(options.camera.Conjugate)).Wedge(tpy));
          }
          return (tot==4 && o instanceof Element && o.length==16)?(tpcam).Vee(options.camera.Mul(o).Mul(options.camera.Conjugate)).Wedge(tpy):(o.length==2**tot)?Element.sw(options.camera,o):o;
        };
      // gl escape.
        if (options.gl && !(tot==4 && options.conformal)) return Element.graphGL(f,options); if (options.up) return Element.graphGL2(f,options);
      // if we get an array or function without parameters, we render c2d or p2d SVG points/lines/circles/etc
        if (!(f instanceof Function) || f.length===0) {
        // Our current cursor, color, animation state and 2D mapping.
          var lx,ly,lr,color,res,anim=false,to2d=(tot==5)?[0, 8, 11, 13, 19, 17, 22, 26]:(tot==3)?[0,1,2,3,4,5,6,7]:[0,7,9,10,13,12,14,15];
        // Make sure we have an array of elements. (if its an object, convert to array with elements and names.)
          if (f instanceof Function) f=f(); if (!(f instanceof Array)) f=[].concat.apply([],Object.keys(f).map((k)=>typeof f[k]=='number'?[f[k]]:[f[k],k]));
        // The build function generates the actual SVG. It will be called everytime the user interacts or the anim flag is set.
          function build(f,or) {
          // Make sure we have an aray.
            if (or && f && f instanceof Function) f=f();
          // Reset position and color for cursor.
            lx=-2;ly=options.conformal?-1.85:1.85;lr=0;color='#444';
          // Create the svg element. (master template string till end of function)
            var svg=new DOMParser().parseFromString(`<SVG viewBox="-2 -${2*(hh/ww||1)} 4 ${4*(hh/ww||1)}" style="width:${ww||512}px; height:${hh||512}px; background-color:#eee; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none">
            ${// Add a grid (option)
              options.grid?(()=>{
                if (tot==4 && !options.conformal) {
                  const lines3d = (n,from,to,j,l=0, ox=0, oy=0, alpha=1)=>[`<G stroke-opacity="${alpha}" fill-opacity="${alpha}">`,...[...Array(n+1)].map((x,i)=>{
                    var f=from.map((x,i)=>x*(i==3?1:(options.gridSize||1))), t=to.map((x,i)=>x*(i==3?1:(options.gridSize||1))); f[j] = t[j] = (i-(n/2))/(n/2) * (options.gridSize||1); 
                    var D3a = Element.Trivector(...f), D2a = project(D3a), D3b = Element.Trivector(...t), D2b = project(D3b);
                    var lx=options.scale*D2a[drm[2]]/D2a[drm[1]]; if (drm[1]==6||drm[1]==14) lx*=-1; var ly=-options.scale*D2a[drm[3]]/D2a[drm[1]];
                    var lx2=options.scale*D2b[drm[2]]/D2b[drm[1]]; if (drm[1]==6||drm[1]==14) lx2*=-1; var ly2=-options.scale*D2b[drm[3]]/D2b[drm[1]];
                    var r = `<line x1="${lx}" y1="${ly}" x2="${lx2}" y2="${ly2}" stroke="black" stroke-width="${i%10==0?0.005:i%5==0?0.002:0.0005}" />`;
                    if (l && i && i!= n) r += `<text text-anchor="middle" font-size="0.04" fill="black" x="${l==1?lx+ox:lx2+ox}" y="${oy+(l==1?ly:ly2)}" >${((from[j]<0?-1:1)*(i-(n/2))/(n/2)*(options.gridSize||1)).toFixed(1)}</text>`
                    return r;
                  }),'</G>'];
                  var front = Element.sw(options.camera,Element.Trivector(1,0,0,0)).Dual.Dot(Element.Vector(0,0,0,1)).s, ff = front>0?1:-1;
                  var left  = Element.sw(options.camera,Element.Trivector(0,0,1,0)).Dual.Dot(Element.Vector(0,0,0,1)).s, ll = left>0?1:-1;
                  var fa = Math.max(0,Math.min(1,5*Math.abs(left))), la = Math.max(0,Math.min(1,5*Math.abs(front)));
                  return [
                    ...lines3d(20,[-1,-1,-1,1],[1,-1,1,1],2,options.labels?ff:0, 0, 0.05),
                    ...lines3d(20,[-1,-1,-1,1],[1,-1,1,1],0,options.labels?ll:0, 0, 0.05),
                    ...lines3d(20,[-1,-1,ll,1],[1,1,ll,1],0,0,0,0,fa),
                    ...lines3d(20,[-1,1,ll,1],[1,-1,ll,1],1,!options.labels?0:(ff!=-1)?1:2, ll*ff*-0.05, 0, fa),
                    ...lines3d(20,[ff,1,-1,1],[ff,-1,1,1],1,!options.labels?0:(ll!=-1)?1:2, ll*ff*0.05, 0, la),
                    ...lines3d(20,[ff,-1,-1,1],[ff,1,1,1],2,0,0,0,la),
                  ].join('');
                }
                const s = options.scale, n = (10/s)|0, cx = options.camera.e02, cy = options.camera.e01, alpha = Math.min(1,(s-0.2)*10); if (options.scale<0.1) return;
                const lines = (n,dir,space,width,color)=>[...Array(2*n+1)].map((x,xi)=>`<line x1="${dir?-10:((xi-n)*space-(tot<4?2*cy:0))*s}" y1="${dir?((xi-n)*space-(tot<4?2*cx:0))*s:-10}" x2="${dir?10:((xi-n)*space-(tot<4?2*cy:0))*s}" y2="${dir?((xi-n)*space-(tot<4?2*cx:0))*s:10}" stroke-width="${width}" stroke="${color}"/>`)
                return [`<G stroke-opacity='${alpha}' fill-opacity='${alpha}'>`,...lines(n*2,0,0.2,0.005,'#DDD'),...lines(n*2,1,0.2,0.005,'#DDD'),...lines(n,0,1,0.005,'#AAA'),...lines(n,1,1,0.005,'#AAA'),...lines(n,0,5,0.005,'#444'),...lines(n,1,5,0.005,'#444')]
                       .concat(options.labels?[...Array(4*n+1)].map((x,xi)=>(xi-n*2==0)?``:`<text text-anchor="middle" font-size="0.05" x="${((xi-n*2)*0.2-(tot<4?2*cy:0))*s}" y="0.06" >${((xi-n*2)*0.2).toFixed(1)}</text>`):[])
                       .concat(options.labels?[...Array(4*n+1)].map((x,xi)=>`<text text-anchor="end" font-size="0.05" y="${((xi-n*2)*0.2-(tot<4?2*cx:0))*s-0.01}" x="-0.01" >${((xi-n*2)*-0.2).toFixed(1)}</text>`):[]).join('')+'</G>';
            })():''}
            // Handle conformal 2D elements.
            ${options.conformal?f.map&&f.map((o,oidx)=>{
            // Optional animation handling.
              if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; }
            // Resolve expressions passed in.
              while (o.call) o=o();
              if (options.ipns && o instanceof Element) o = o.Dual;
              var sc = options.scale;
              var lineWidth = options.lineWidth || 1;
              var pointRadius = options.pointRadius || 1;
              var dash_for_r2 = (r2, render_r, target_width) => {
                // imaginary circles are dotted
                if (r2 >= 0) return 'none';
                var half_circum = render_r*Math.PI;
                var width = half_circum / Math.max(Math.round(half_circum / target_width), 1);
                return `${width} ${width}`;
              };
            // Arrays are rendered as segments or polygons. (2 or more elements)
              if (o instanceof Array)  { lx=ly=lr=0; o=o.map(o=>{ while(o.call)o=o(); return o.Scale(-1/o.Dot(ni).s); }); o.forEach((o)=>{lx+=sc*(o.e1);ly+=sc*(-o.e2)});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>(sc*o.e1+','+(-o.e2*sc)+' '))}"/>`:`<LINE style="pointer-events:none" x1=${o[0].e1*sc} y1=${-o[0].e2*sc} x2=${o[1].e1*sc} y2=${-o[1].e2*sc} stroke="${color||'#888'}"/>`; }
            // Allow insertion of literal svg strings.
              if (typeof o =='string' && o[0]=='<') { return o; }
            // Strings are rendered at the current cursor position.
              if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${ly}" font-family="Verdana" font-size="${options.fontSize*0.1||0.1}" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${lr},${lx},${ly})">&nbsp;${o}&nbsp;</text>`; ly+=0.14; return res2; }
            // Numbers change the current color.
              if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; };
            // All other elements are rendered ..
              var ni_part = o.Dot(no.Scale(-1));  // O_i + n_o O_oi
              var no_part = ni.Scale(-1).Dot(o);  // O_o + O_oi n_i
              if (ni_part.VLength * 1e-6 > no_part.VLength) {
                // direction or dual - nothing to render
                return "";
              }
              var no_ni_part = no_part.Dot(no.Scale(-1));  // O_oi
              var no_only_part = ni.Wedge(no_part).Dot(no.Scale(-1));  // O_o

              /* Note: making 1e-6 smaller increases the maximum circle radius before they are drawn as lines */
              if (no_ni_part.VLength * 1e-6 > no_only_part.VLength) {
                var is_flat = true;
                var direction = no_ni_part;
              }
              else {
                var is_flat = false;
                var direction = no_only_part;
              }
              // normalize to make the direction unitary
              var dl = direction.Length;
              o = o.Scale(1/dl);
              direction = direction.Scale(1/dl)

              var b0=direction.Grade(0).VLength>0.001,b1=direction.Grade(1).VLength>0.001,b2=direction.Grade(2).VLength>0.001;
              if (!is_flat && b0 && !b1 && !b2) {
                // Points
                if (direction.s < 0) { o = Element.Sub(o); }
                lx=sc*(o.e1); ly=sc*(-o.e2); lr=0; return res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${pointRadius*0.03}" fill="${color||'green'}"/>`;
              } else if (is_flat && !b0 && b1 && !b2) {
                // Lines.
                var loc=minus_no.LDot(o).Div(o), att=ni.Dot(o);
                lx=sc*(-loc.e1); ly=sc*(loc.e2); lr=Math.atan2(-o[14],o[13])/Math.PI*180; return `<LINE style="pointer-events:none" x1=${lx-10} y1=${ly} x2=${lx+10} y2=${ly} stroke="${color||'#888'}" transform="rotate(${lr},${lx},${ly})"/>`;
              } else if (!is_flat && !b0 && !b1 && b2) {
                // Circles
                var loc=o.Div(ni.LDot(o)); lx=sc*(-loc.e1); ly=sc*(loc.e2);
                var r2=o.Mul(o.Conjugate).s;
                var r = Math.sqrt(Math.abs(r2))*sc;
                return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${r}" fill="none" stroke="${color||'green'}" stroke-dasharray="${dash_for_r2(r2, r, lineWidth*0.020)}"/>`;
              } else if (!is_flat && !b0 && b1 && !b2) {
                // Point Pairs.
                lr=0; var ei=ni,eo=no, nix=o.Wedge(ei), sqr=o.LDot(o).s/nix.LDot(nix).s, r=Math.sqrt(Math.abs(sqr)), attitude=((ei.Wedge(eo)).LDot(nix)).Normalized.Mul(Element.Scalar(r)), pos=o.Div(nix); pos=pos.Div( pos.LDot(Element.Sub(ei)));
                if (nix==0) { pos = o.Dot(Element.Coeff(4,-1)); sqr=-1; }
                lx=sc*(pos.e1); ly=sc*(-pos.e2);
                if (sqr==0) return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${pointRadius*0.03}" stroke-width="${lineWidth*0.01}" fill="none" stroke="${color||'green'}"/>`;
                // Draw imaginary pairs hollow
                if (sqr > 0) var fill = color||'green', stroke = 'none', dash_array = 'none';
                else var fill = 'none', stroke = color||'green';
                lx=sc*(pos.e1+attitude.e1); ly=sc*(-pos.e2-attitude.e2);
                var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${pointRadius*0.03}" fill="${fill}" stroke-width="${lineWidth*0.01}" stroke="${stroke}" stroke-dasharray="${dash_for_r2(sqr, pointRadius*0.03, lineWidth*0.020)}" />`;
                lx=sc*(pos.e1-attitude.e1); ly=sc*(-pos.e2+attitude.e2);
                return res2+`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${pointRadius*0.03}" fill="${fill}" stroke-width="${lineWidth*0.01}" stroke="${stroke}" stroke-dasharray="${dash_for_r2(sqr, pointRadius*0.03, lineWidth*0.020)}" />`;
              } else {
                /* Unrecognized */
                return "";
              }
            // Handle projective 2D and 3D elements.
            }):f.map&&f.map((o,oidx)=>{  if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; } while (o instanceof Function) o=o(); o=(o instanceof Array)?o.map(project):project(o); if (o===undefined) return;
            // dual option dualizes before render
              if (options.dual && o instanceof Element) o = o.Dual;
            // line segments and polygons
              if (o instanceof Array && o.length)  { lx=ly=lr=0; o.forEach((o)=>{while (o.call) o=o(); lx+=options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[drm[2]]/o[drm[1]];ly+=options.scale*o[drm[3]]/o[drm[1]]});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>((drm[1]==6||drm[1]==14)?-1:1)*options.scale*o[drm[2]]/o[drm[1]]+','+(-options.scale)*o[drm[3]]/o[drm[1]]+' ')}"/>`:`<LINE style="pointer-events:none" x1=${options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[0][drm[2]]/o[0][drm[1]]} y1=${-options.scale*o[0][drm[3]]/o[0][drm[1]]} x2=${options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[1][drm[2]]/o[1][drm[1]]} y2=${-options.scale*o[1][drm[3]]/o[1][drm[1]]} stroke="${color||'#888'}"/>`; }
            // svg
              if (typeof o =='string' && o[0]=='<') { return o; }
            // Labels
              if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${-ly}" font-family="Verdana" font-size="${options.fontSize*0.1||0.1}" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${-lr},0,0)">&nbsp;${o}&nbsp;</text>`; ly-=0.14; return res2; }
            // Colors
              if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; };
            // Points
              if (o[to2d[6]]**2        >0.0001) { lx=options.scale*o[drm[2]]/o[drm[1]]; if (drm[1]==6||drm[1]==14) lx*=-1; ly=options.scale*o[drm[3]]/o[drm[1]]; lr=0;  var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${-ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`; ly+=0.05; lx-=0.1; return res2; }
            // Lines
              if (o[to2d[2]]**2+o[to2d[3]]**2>0.0001) { var l=Math.sqrt(o[to2d[2]]**2+o[to2d[3]]**2); o[to2d[2]]/=l; o[to2d[3]]/=l; o[to2d[1]]/=l; lx=0.5; ly=options.scale*((drm[1]==6)?-1:-1)*o[to2d[1]]; lr=-Math.atan2(o[to2d[2]],o[to2d[3]])/Math.PI*180; var res2=`<LINE style="pointer-events:none" x1=-10 y1=${-ly} x2=10 y2=${-ly} stroke="${color||'#888'}" transform="rotate(${-lr},0,0)"/>`; ly+=0.05; return res2; }
            // Vectors
              if (o[to2d[4]]**2+o[to2d[5]]**2>0.0001) { lr=0; ly+=0.05; lx+=0.1; var res2=`<LINE style="pointer-events:none" x1=${lx} y1=${-ly} x2=${lx-o.e02} y2=${-(ly+o.e01)} stroke="${color||'#888'}"/>`; ly=ly+o.e01/4*3-0.05; lx=lx-o.e02/4*3; return res2; }
            }).join()}`,'text/html').body;
          // return the inside of the created svg element.
            return svg.removeChild(svg.firstChild);
          };
        // Create the initial svg and install the mousehandlers.
          res=build(f); res.value=f; res.options=options; res.setAttribute("stroke-width",options.lineWidth*0.005||0.005);
          //onmousedown="if(evt.target==this)this.sel=undefined" 
          var mousex,mousey,cammove=false;
          res.onwheel=(e)=>{ e.preventDefault(); options.scale = Math.min(5,Math.max(0.1,(options.scale||1)-e.deltaY*0.0001)); if (!anim) {var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; } }
          res.onmousedown=(e)=>{ if (e.target == res) res.sel=undefined; mousex = e.clientX; mousey = e.clientY; cammove = true;  }
          res.onmousemove=(e)=>{ 
            if (cammove && tot==4 && !options.conformal) { 
              if (!e.buttons) { cammove=false; return; };
              var [dx,dy] = [e.clientX - mousex, e.clientY - mousey];
              [mousex,mousey] = [e.clientX,e.clientY];
              if (res.sel && f[res.sel].set) {
                f[res.sel].set(   Element.sw(Element.sw(options.camera.Reverse,Element.Bivector(-dx/500,dy/500,0,0,0,0).Exp()),f[res.sel]) );
              } else {
                options.h = (options.h||0) + dx/300;
                options.p = (options.p||0) - dy/600;
                if (options.camera) options.camera.set( ( Element.Bivector(0,0,0,0,0,options.p).Exp() ).Mul( Element.Bivector(0,0,0,0,options.h,0).Exp() )/*.Mul(options.camera)*/ )
              }
              if (!anim) {var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }
              return;
            }
            if (res.sel===undefined || f[res.sel] == undefined || f[res.sel].set == undefined || !e.buttons) return;
            var resx=res.getBoundingClientRect().width,resy=res.getBoundingClientRect().height,
                x=((e.clientX-res.getBoundingClientRect().left)/(resx/4||128)-2)*(resx>resy?resx/resy:1),y=((e.clientY-res.getBoundingClientRect().top)/(resy/4||128)-2)*(resy>resx?resy/resx:1);
            x/=options.scale;y/=options.scale; 
            if (options.conformal) { f[res.sel].set(this.Coeff(1,x,2,-y).Add(no).Add(ni.Scale(0.5*(x*x+y*y))) ) } 
                              else { f[res.sel][drm[2]]=((drm[1]==6)?-x:x)-((tot<4)?2*options.camera.e01:0); f[res.sel][drm[3]]=-y+((tot<4)?2*options.camera.e02:0); f[res.sel][drm[1]]=1; f[res.sel].set(f[res.sel].Normalized)} 
            if (!anim) {var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }
            res.dispatchEvent(new CustomEvent('input')) };
          return res;
        }
      // 1d and 2d functions are rendered on a canvas.
        cvs=cvs||document.createElement('canvas'); if(ww)cvs.width=ww; if(hh)cvs.height=hh; var w=cvs.width,h=cvs.height,context=cvs.getContext('2d'), data=context.getImageData(0,0,w,h);
      // Grid support for the canvas.  
        const [x_from,x_to,y_from,y_to]=options.range||[-1,1,1,-1];
        function drawGrid() {
          const [X,Y]=[x=>(x-x_from)*w/(x_to-x_from),y=>(y-y_from)*h/(y_to-y_from)]
          context.strokeStyle = "#008800"; context.lineWidth = 1;
          // X and Y axis
          context.beginPath();
          context.moveTo(X(x_from), Y(0)); context.lineTo(X(x_to  ), Y(0)); context.stroke();
          context.moveTo(X(0), Y(y_from)); context.lineTo(X(0), Y(y_to  )); context.stroke();
          // Draw ticks
          context.strokeStyle = "#00FF00"; context.lineWidth = 2; context.font = "10px Arial"; context.fillStyle = "#448844";
          for (var i=x_from,j=y_from,ii=0; ii<=10; ++ii) {
              context.beginPath(); j+= (y_to-y_from)/10; i+=(x_to-x_from)/10;
              context.moveTo(X(i), Y(-(y_to - y_from)/200)); context.lineTo(X(i), Y((y_to - y_from)/200)); context.stroke();
              if(i.toFixed(1)!=0) context.fillText(i.toFixed(1), X(i-(x_to-x_from)/100), Y(-(y_to-y_from)/40));
              context.moveTo(X((x_to-x_from)/200), Y(j)); context.lineTo(X(-(x_to-x_from)/200), Y(j)); context.stroke();
              if(j.toFixed(1)!=0) context.fillText(j.toFixed(1), X((x_to-x_from)/100), Y(j));
          }
        }
      // two parameter functions .. evaluate for both and set resulting color.
        if (f.length==2) for (var px=0; px<w; px++) for (var py=0; py<h; py++) { var res=f(px/w*(x_to-x_from)+x_from, py/h*(y_to-y_from)+y_from); res=res.buffer?[].slice.call(res):res.slice?res:[res,res,res]; data.data.set(res.map(x=>x*255).concat([255]),py*w*4+px*4); }
      // one parameter function.. go over x range, use result as y.
        else if (f.length==1) for (var px=0; px<w; px++) { var res=f(px/w*(x_to-x_from)+x_from); res=Math.round((res/(y_to-y_from)+(-y_from/(y_to-y_from)))*h); if (res > 0 && res < h-1) data.data.set([0,0,0,255],res*w*4+px*4); }
        context.putImageData(data,0,0);
        if (f.length == 1 || f.length == 2) if (options.grid) drawGrid();
        return cvs;
      }

    // webGL2 Graphing function. (for OPNS/IPNS implicit 2D and 1D surfaces in 3D space).
      static graphGL2(f,options) {
      // Create canvas, get webGL2 context.
        var canvas=document.createElement('canvas'); canvas.style.width=options.width||''; canvas.style.height=options.height||''; canvas.style.backgroundColor='#EEE';
        if (options.width && options.width.match && options.width.match(/px/i)) canvas.width = parseFloat(options.width)*(options.devicePixelRatio||devicePixelRatio||1); if (options.height && options.height.match && options.height.match(/px/i)) canvas.height = parseFloat(options.height)*(options.devicePixelRatio||devicePixelRatio||1);
        var gl=canvas.getContext('webgl2',{alpha:options.alpha||false,preserveDrawingBuffer:true,antialias:true,powerPreference:'high-performance'});
        var gl2=!!gl; if (!gl) gl=canvas.getContext('webgl',{alpha:options.alpha||false,preserveDrawingBuffer:true,antialias:true,powerPreference:'high-performance'});
        gl.clearColor(240/255,240/255,240/255,1.0); gl.enable(gl.DEPTH_TEST); if (!gl2) { gl.getExtension("EXT_frag_depth"); gl.va = gl.getExtension('OES_vertex_array_object'); }
        else gl.va = { createVertexArrayOES : gl.createVertexArray.bind(gl), bindVertexArrayOES : gl.bindVertexArray.bind(gl), deleteVertexArrayOES : gl.deleteVertexArray.bind(gl)  }
      // Compile vertex and fragment shader, return program.
        var compile=(vs,fs)=>{
          var s=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((t,i)=>{
            var r=gl.createShader(t); gl.shaderSource(r,[vs,fs][i]); gl.compileShader(r);
            return gl.getShaderParameter(r, gl.COMPILE_STATUS)&&r||console.error(gl.getShaderInfoLog(r));
          });
          var p = gl.createProgram(); gl.attachShader(p, s[0]); gl.attachShader(p, s[1]); gl.linkProgram(p);
          gl.getProgramParameter(p, gl.LINK_STATUS)||console.error(gl.getProgramInfoLog(p));
          return p;
        };
      // Create vertex array and buffers, upload vertices and optionally texture coordinates.
        var createVA=function(vtx) {
          var r = gl.va.createVertexArrayOES(); gl.va.bindVertexArrayOES(r);
          var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
          gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
          return {r,b}
        },
      // Destroy Vertex array and delete buffers.
        destroyVA=function(va) {
          if (va.b) gl.deleteBuffer(va.b); if (va.r) gl.va.deleteVertexArrayOES(va.r);
        }
      // Drawing function
        var M=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,5,1];
        var draw=function(p, tp, vtx, color, color2, ratio, texc, va, b,color3,r,g){
            gl.useProgram(p); gl.uniformMatrix4fv(gl.getUniformLocation(p, "mv"),false,M);
            gl.uniformMatrix4fv(gl.getUniformLocation(p, "p"),false, [5,0,0,0,0,5*(ratio||1),0,0,0,0,1,2,0,0,-1,0])
            gl.uniform3fv(gl.getUniformLocation(p, "color"),new Float32Array(color));
            gl.uniform3fv(gl.getUniformLocation(p, "color2"),new Float32Array(color2));
            if (color3) gl.uniform3fv(gl.getUniformLocation(p, "color3"),new Float32Array(color3));
            if (b) gl.uniform1fv(gl.getUniformLocation(p, "b"),(new Float32Array(counts[g])).map((x,i)=>b[g][i]||0));
            if (texc) gl.uniform1i(gl.getUniformLocation(p, "texc"),0);
            if (r) gl.uniform1f(gl.getUniformLocation(p,"ratio"),r);
            var v; if (!va) v = createVA(vtx); else gl.va.bindVertexArrayOESOES(va.r);
            gl.drawArrays(tp, 0, (va&&va.tcount)||vtx.length/3);
            if (v) destroyVA(v);
        }
      // Compile the OPNS renderer. (sphere tracing)
        var programs = [], genprog = grade=>compile(`${gl2?"#version 300 es":""}
             ${gl2?"in":"attribute"} vec4 position; ${gl2?"out":"varying"} vec4 Pos; uniform mat4 mv; uniform mat4 p;
             void main() { Pos=mv*position; gl_Position = p*Pos; }`,
            `${!gl2?"#extension GL_EXT_frag_depth : enable":"#version 300 es"}
             precision highp float;
             uniform vec3 color; uniform vec3 color2;
             uniform vec3 color3; uniform float b[${counts[grade]}];
             uniform float ratio; ${gl2?"out vec4 col;":""}
             ${gl2?"in":"varying"} vec4 Pos;
             float product_len (in float z, in float y, in float x, in float[${counts[grade]}] b) {
                ${this.nVector(options.up.length>tot?2:1,[])[options.IPNS?"IPNS_GLSL":"OPNS_GLSL"](this.nVector(grade,[]), options.up)}
                return sqrt(abs(sum));
             }
             vec3 find_root (in vec3 start, vec3 dir, in float thresh) {
                vec3 orig=start; 
                float lastd = 1000.0; 
                const int count=${(options.maxSteps||80)};
                for (int i=0; i<count; i++) {
                  float d = product_len(start[0],start[1],start[2],b);
                  float diff = ${(options.stepSize||0.0001)}*(1.0+2000.0*d);
                  if (d < thresh) return start + dir*(lastd-thresh)/(lastd-d)*diff;
                  lastd = d; start += dir*diff;
                }
                return orig;
             }
             void main() {
               vec3 dir = ((-Pos[0]/5.0)*color + color2 + vec3(0.0,Pos[1]/5.0*ratio,0.0)); 
               vec3 p = -5.0*normalize(color2) + dir+vec3(0.0,0.0,1.0); dir = normalize(dir);
               vec3 L = 5.0*normalize( -0.5*color + 0.85*color2 + vec3(0.0,-0.5,0.0) );
               vec3 d2 = find_root( p , dir, ${grade!=tot-1?(options.thresh||0.2):"0.0075"} );
               float dl2 = dot(d2-p,d2-p); const float h=0.0001;
               if (dl2>0.0) {
                 vec3 n = normalize(vec3(
                        product_len(d2[0]+h,d2[1],d2[2],b)-product_len(d2[0]-h,d2[1],d2[2],b),
                        product_len(d2[0],d2[1]+h,d2[2],b)-product_len(d2[0],d2[1]-h,d2[2],b),
                        product_len(d2[0],d2[1],d2[2]+h,b)-product_len(d2[0],d2[1],d2[2]-h,b)
                      ));
                 ${gl2?"gl_FragDepth":"gl_FragDepthEXT"} = dl2/50.0;
                 ${gl2?"col":"gl_FragColor"} = vec4(max(0.2,abs(dot(n,normalize(L-d2))))*color3 + pow(abs(dot(n,normalize(normalize(L-d2)+dir))),100.0),1.0);
               } else discard;
             }`),genprog2D = grade=>compile(`${gl2?"#version 300 es":""}
             ${gl2?"in":"attribute"} vec4 position; ${gl2?"out":"varying"} vec4 Pos; uniform mat4 mv; uniform mat4 p;
             void main() { Pos=mv*position; gl_Position = p*Pos; }`,
            `${!gl2?"#extension GL_EXT_frag_depth : enable":"#version 300 es"}
             precision highp float;
             uniform vec3 color; uniform vec3 color2;
             uniform vec3 color3; uniform float b[${counts[grade]}];
             uniform float ratio; ${gl2?"out vec4 col;":""}
             ${gl2?"in":"varying"} vec4 Pos;
             float product_len (in float z, in float y, in float x, in float[${counts[grade]}] b) {
                ${this.nVector(1,[])[options.IPNS?"IPNS_GLSL":"OPNS_GLSL"](this.nVector(grade,[]), options.up)}
                return sqrt(abs(sum));
             }
             void main() {
               vec3 p = -5.0*normalize(color2) -Pos[0]/5.0*color + color2 + vec3(0.0,Pos[1]/5.0*ratio,0.0); 
               float d2 = 1.0 - 150.0*pow(product_len( p[0]*5.0, p[1]*5.0, p[2]*5.0, b),2.0);
               if (d2>0.0) {
                 ${gl2?"col":"gl_FragColor"} = vec4(color3,d2);
               } else discard;
             }`)
      // canvas update will (re)render the content.
        var armed=0;
        canvas.update = (x)=>{
        // Start by updating canvas size if needed and viewport.
          var s = getComputedStyle(canvas); if (s.width) { canvas.width = parseFloat(s.width)*(options.devicePixelRatio||devicePixelRatio||1); canvas.height = parseFloat(s.height)*(options.devicePixelRatio||devicePixelRatio||1); }
          gl.viewport(0,0, canvas.width|0,canvas.height|0); var r=canvas.width/canvas.height;
        // Defaults, resolve function input
          var a,p=[],l=[],t=[],c=[.5,.5,.5],alpha=0,lastpos=[-2,2,0.2]; gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT); while (x.call) x=x();
        // Loop over all items to render.
          for (var i=0,ll=x.length;i<ll;i++) {
            var e=x[i]; while (e&&e.call) e=e(); if (e==undefined) continue;
            if (typeof e == "number") { alpha=((e>>>24)&0xff)/255; c[0]=((e>>>16)&0xff)/255; c[1]=((e>>>8)&0xff)/255; c[2]=(e&0xff)/255; }
            if (e instanceof Element){
              var tt = options.spin?-performance.now()*options.spin/1000:-options.h||0; tt+=Math.PI/2; var r = canvas.height/canvas.width;
              var g=tot-1; while(!e[g]&&g>1) g--;
              if (!programs[tot-1-g]) programs[tot-1-g] = (options.up.find(x=>x.match&&x.match("z")))?genprog(g):genprog2D(g);
              gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              draw(programs[tot-1-g],gl.TRIANGLES,[-2,-2,0,-2,2,0,2,-2,0,-2,2,0,2,-2,0,2,2,0],[Math.cos(tt),0,-Math.sin(tt)],[Math.sin(tt),0,Math.cos(tt)],undefined,undefined,undefined,e,c,r,g);
              gl.disable(gl.BLEND);
            }
          }
          // if we're no longer in the page .. stop doing the work.
          armed++; if (document.body.contains(canvas)) armed=0; if (armed==2) return;
          canvas.value=x; if (options&&!options.animate) canvas.dispatchEvent(new CustomEvent('input'));
          if (options&&options.animate) { requestAnimationFrame(canvas.update.bind(canvas,f,options)); }
          if (options&&options.still) { canvas.value=x; canvas.dispatchEvent(new CustomEvent('input')); canvas.im.width=canvas.width; canvas.im.height=canvas.height; canvas.im.src = canvas.toDataURL(); }
        }
        // Basic mouse interactivity. needs more love.
        var sel=-1; canvas.oncontextmenu = canvas.onmousedown = (e)=>{ e.preventDefault(); e.stopPropagation(); sel=-2;
          var rc = canvas.getBoundingClientRect(), mx=(e.x-rc.left)/(rc.right-rc.left)*2-1, my=((e.y-rc.top)/(rc.bottom-rc.top)*-4+2)*canvas.height/canvas.width;
          canvas.onwheel=e=>{e.preventDefault(); e.stopPropagation(); options.z = (options.z||5)+e.deltaY/100; if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));}
          canvas.onmouseup=e=>sel=-1; canvas.onmouseleave=e=>sel=-1;
          canvas.onmousemove=(e)=>{
            var rc = canvas.getBoundingClientRect();
            var mx =(e.movementX)/(rc.right-rc.left)*2, my=((e.movementY)/(rc.bottom-rc.top)*-2)*canvas.height/canvas.width;
            if (sel==-2) { options.h =  (options.h||0)+mx; if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options)); return; }; if (sel < 0) return;
          }
        }
        canvas.value = f.call?f():f; canvas.options = options;
        if (options&&options.still) {
          var i=new Image(); canvas.im = i; return requestAnimationFrame(canvas.update.bind(canvas,f,options)),i;
        } else return requestAnimationFrame(canvas.update.bind(canvas,f,options)),canvas;

      }


    // webGL Graphing function. (for parametric defined objects)
      static graphGL(f,options) {
      // Create a canvas, webgl2 context and set some default GL options.
        var canvas=document.createElement('canvas'); canvas.style.width=options.width||''; canvas.style.height=options.height||''; canvas.style.backgroundColor='#EEE';
        if (options.width && options.width.match && options.width.match(/px/i)) canvas.width = parseFloat(options.width); if (options.height && options.height.match && options.height.match(/px/i)) canvas.height = parseFloat(options.height);
        var gl=canvas.getContext('webgl',{alpha:options.alpha||false,antialias:true,preserveDrawingBuffer:options.still||true,powerPreference:'high-performance'});
        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); if (!options.alpha) gl.clearColor(240/255,240/255,240/255,1.0); gl.getExtension("OES_standard_derivatives"); gl.va=gl.getExtension("OES_vertex_array_object");
      // Compile vertex and fragment shader, return program.
        var compile=(vs,fs)=>{
          var s=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((t,i)=>{
            var r=gl.createShader(t); gl.shaderSource(r,[vs,fs][i]); gl.compileShader(r);
            return gl.getShaderParameter(r, gl.COMPILE_STATUS)&&r||console.error(gl.getShaderInfoLog(r));
          });
          var p = gl.createProgram(); gl.attachShader(p, s[0]); gl.attachShader(p, s[1]); gl.linkProgram(p);
          gl.getProgramParameter(p, gl.LINK_STATUS)||console.error(gl.getProgramInfoLog(p));
          return p;
        };
      // Create vertex array and buffers, upload vertices and optionally texture coordinates.
        var createVA=function(vtx, texc, idx, clr) {
              var r = gl.va.createVertexArrayOES(); gl.va.bindVertexArrayOES(r);
              var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
              gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
              if (texc){
                var b2=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b2);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texc), gl.STATIC_DRAW);
                gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(1);
              }
              if (clr){
                var b3=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b3);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(clr), gl.STATIC_DRAW);
                gl.vertexAttribPointer(texc?2:1, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(texc?2:1);
              }
              if (idx) {
                var b4=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b4);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
              }
              return {r,b,b2,b4,b3}
            },
      // Destroy Vertex array and delete buffers.
            destroyVA=function(va) {
              [va.b,va.b2,va.b4,va.b3].forEach(x=>{if(x) gl.deleteBuffer(x)}); if (va.r) gl.va.deleteVertexArrayOES(va.r);
            }
      // Default modelview matrix, convert camera to matrix (biquaternion->matrix)
        var M=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,5,1], mtx = (x,iscam=true)=>{ var t=options.spin?performance.now()*options.spin/1000:-options.h||0, t2=options.p||0;
          var ct = Math.cos(t), st= Math.sin(t), ct2 = Math.cos(t2), st2 = Math.sin(t2), xx=options.posx||0, y=options.posy||0, z=options.posz||0, zoom=options.z||5;
          if (tot==5) return [ct,st*-st2,st*ct2,0,0,ct2,st2,0,-st,ct*-st2,ct*ct2,0,xx*ct+z*-st,y*ct2+(xx*st+z*ct)*-st2,y*st2+xx*st+z*ct*ct2+zoom,1];
          x=x.Normalized; var y=x.Mul(x.Dual),X=x.e23,Y=-x.e13,Z=-x.e12,W=x.s;
          var xx = X*X, xy = X*Y, xz = X*Z, xw = X*W, yy = Y*Y, yz = Y*Z, yw = Y*W, zz = Z*Z, zw = Z*W;
          var mtx = [ 1-2*(yy+zz), 2*(xy+zw), 2*(xz-yw), 0, 2*(xy-zw), 1-2*(xx+zz), 2*(yz+xw), 0, 2*(xz+yw), 2*(yz-xw), 1-2*(xx+yy), 0, -2*y.e23, -2*y.e13, 2*y.e12+(iscam?5:0), 1];
          return mtx;
        }
      // Render the given vertices. (autocreates/destroys vertex array if not supplied).
        var draw=function(p, tp, vtx, color, color2, ratio, texc, va, cbuf){
          gl.useProgram(p); gl.uniformMatrix4fv(gl.getUniformLocation(p, "mv"),false,M);
          gl.uniformMatrix4fv(gl.getUniformLocation(p, "p"),false, [5,0,0,0,0,5*(ratio||2),0,0,0,0,1,2,0,0,-1,0])
          gl.uniform3fv(gl.getUniformLocation(p, "color"),new Float32Array(color));
          gl.uniform3fv(gl.getUniformLocation(p, "color2"),new Float32Array(color2));
          //if (texc) gl.uniform1i(gl.getAttribLocation(p, "texc"),0);
          var v; if (!va) v = createVA(vtx, texc, undefined, cbuf, p); else gl.va.bindVertexArrayOES(va.r);
          if (va && va.b4) {
            gl.drawElements(tp, va.tcount, gl.UNSIGNED_SHORT, 0);
          } else {
            gl.drawArrays(tp, 0, (va&&va.tcount)||vtx.length/3);
          }
          if (v) destroyVA(v);
        }
      // Program for the geometry. Derivative based normals. Basic lambert shading.
        var program = compile(`attribute vec4 position; varying vec4 Pos; uniform mat4 mv; uniform mat4 p;
                 void main() { gl_PointSize=12.0; Pos=mv*position; gl_Position = p*Pos; }`,
                `#extension GL_OES_standard_derivatives : enable
                 precision highp float; uniform vec3 color; uniform vec3 color2; varying vec4 Pos;
                 void main() { vec3 ldir = normalize(Pos.xyz - vec3(2.0,2.0,-4.0));
                 vec3 normal = normalize(cross(dFdx(Pos.xyz), dFdy(Pos.xyz))); float l=dot(normal,ldir);
                 vec3 E = normalize(-Pos.xyz); vec3 R = normalize(reflect(ldir,normal));
                 gl_FragColor = vec4(max(0.0,l)*color+vec3(0.5*pow(max(dot(R,E),0.0),20.0))+color2, 1.0);  }`);
        var programPoint = compile(`attribute vec4 position; varying vec4 Pos; uniform mat4 mv; uniform mat4 p;
                 void main() { gl_PointSize=${((options.pointRadius||1)*(options.devicePixelRatio||devicePixelRatio||1)*8.0).toFixed(2)}; Pos=mv*position; gl_Position = p*Pos; }`,
                `precision highp float; uniform vec3 color; uniform vec3 color2; varying vec4 Pos;
                 void main() {  float distanceToCenter = length(gl_PointCoord - vec2(0.5)); if (distanceToCenter>0.5) discard; 
                 gl_FragColor = vec4(color+color2, (distanceToCenter<0.5?1.0:0.0));  }`);
        var programline = compile(`
                 attribute vec4 position;  // current point.
                 attribute vec2 texc;      // x = +w or -w, alternating. y = opacity.
                 attribute vec4 col;       // next point. (extrapolated for end point)
                 uniform vec3 color;       // r=aspect g=thickness
                 uniform mat4 mv,p;        // modelview and projection matrix
                 varying vec2 tc;
                 void main() { 
                 // Convert to clipspace.
                   vec4 cp = p*mv*vec4(position.xyz,1.0);
                   vec2 cs = cp.xy / abs(cp.w);
                   vec4 np = p*mv*vec4(col.xyz,1.0);
                   vec2 ns = np.xy / abs(np.w);
                 // compensate aspect
                   cs.x *= color.r;
                   ns.x *= color.r; 
                 // clipspace line direction.
                   vec2 dir = normalize(cs-ns);
                 // Calculate screenspace normal.
                   vec2 normal = vec2( -dir.y, dir.x); 
                 // Line scaling and aspect fix.
                   normal *= color.g * 5.0;
                   normal.x /= color.r;
                 // Pass through texture coordinates for edge softening  
                   tc = vec2(texc.x / abs(texc.x), texc.y);
                   gl_Position = cp + vec4(normal*texc.x,0.0,0.0);
                 }`,
                `precision highp float; 
                 uniform vec3 color2; 
                 varying vec2 tc; 
                 void main() { 
                   gl_FragColor = vec4(color2,(1.0-pow(abs(tc.x),2.0))*tc.y); 
                 }`);
        var programcol = compile(`attribute vec4 position; attribute vec3 col; varying vec3 Col; varying vec4 Pos; uniform mat4 mv; uniform mat4 p;
                 void main() { gl_PointSize=6.0; Pos=mv*position; gl_Position = p*Pos; Col=col; }`,
                `#extension GL_OES_standard_derivatives : enable
                 precision highp float; uniform vec3 color; uniform vec3 color2; varying vec4 Pos; varying vec3 Col;
                 void main() { vec3 ldir = normalize(Pos.xyz - vec3(1.0,1.0,2.0));
                 vec3 normal = normalize(cross(dFdx(Pos.xyz), dFdy(Pos.xyz))); float l=dot(normal,ldir);
                 vec3 E = normalize(-Pos.xyz); vec3 R = normalize(reflect(ldir,normal));
                 gl_FragColor = vec4(max(0.3,l)*Col+vec3(pow(max(dot(R,E),0.0),20.0))+color2, 1.0); ${options.shader||''}  }`);
        var programmot = compile(`attribute vec4 position; attribute vec2 texc; attribute vec3 col; varying vec3 Col; varying vec4 Pos; uniform mat4 mv; uniform mat4 p; uniform vec3 color2;
                 void main() { gl_PointSize=2.0; float blend=fract(color2.x+texc.r)*0.5; Pos=mv*(position*(1.0-blend) + (blend)*vec4(col,1.0)); gl_Position = p*Pos; Col=vec3(length(col-position.xyz)*1.); gl_PointSize = 8.0 -  Col.x; Col.y=sin(blend*2.*3.1415); }`,
                `precision highp float; uniform vec3 color; uniform vec3 color2; varying vec4 Pos; varying vec3 Col; 
                 void main() {  float distanceToCenter = length(gl_PointCoord - vec2(0.5));gl_FragColor = vec4(1.0-pow(Col.x,2.0),0.0,0.0,(.6-Col.x*0.05)*(distanceToCenter<0.5?1.0:0.0)*Col.y);  }`);
        gl.lineWidth(options.lineWidth||1); // doesn't work yet (nobody supports it)
      // Create a font texture, lucida console or otherwise monospaced.
        var fw=33, font = Object.assign(document.createElement('canvas'),{width:(19+94)*fw,height:48}),
            ctx = Object.assign(font.getContext('2d'),{font:'bold 48px lucida console, monospace'}),
            ftx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ftx);
            for (var i=33; i<127; i++) ctx.fillText(String.fromCharCode(i),(i-33)*fw,40);
            var specialChars = "∞≅¹²³₀₁₂₃₄₅₆₇₈₉⋀⋁∆⋅"; specialChars.split('').forEach((x,i)=>ctx.fillText(x,(i-33+127)*fw,40));
            // 2.0 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,94*fw,32,0,gl.RGBA,gl.UNSIGNED_BYTE,font);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, font);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // Font rendering program. Renders billboarded fonts, transforms offset passed as color2.
        var program2 = compile(`attribute vec4 position; attribute vec2 texc; varying vec2 tex; varying vec4 Pos; uniform mat4 mv; uniform mat4 p; uniform vec3 color2;
                 void main() { tex=texc; gl_PointSize=6.0; vec4 o=mv*vec4(color2,0.0); Pos=(-1.0/(o.z-mv[3][2]))*position+vec4(mv[3][0],mv[3][1],mv[3][2],0.0)+o; gl_Position = p*Pos; }`,
                `precision highp float; uniform vec3 color; varying vec4 Pos; varying vec2 tex;
                 uniform sampler2D texm; void main() { vec4 c = texture2D(texm,tex); if (c.a<0.01) discard; gl_FragColor = vec4(color,c.a);}`);
      // Helpers for line drawing. Convert line segments to triangles.
        const line_to_tri  = ([ax,ay,az,bx,by,bz]) => [ax,ay,az,ax,ay,az,bx,by,bz,bx,by,bz,ax,ay,az,bx,by,bz];
        const line_to_tri2 = ([ax,ay,az,bx,by,bz]) => [bx,by,bz,bx,by,bz,2*bx-ax,2*by-ay,2*bz-az,2*bx-ax,2*by-ay,2*bz-az,bx,by,bz,2*bx-ax,2*by-ay,2*bz-az];
      // Conformal space needs a bit extra magic to extract euclidean parametric representations.
        if (tot==5 && options.conformal) var ni = Element.Coeff(4,1).Add(Element.Coeff(5,1)), no = Element.Coeff(4,0.5).Sub(Element.Coeff(5,0.5));
        var interprete = (x)=>{
          if (!(x instanceof Element)) return { tp:0 };
          if (options.ipns) x=x.Dual;
          // tp = { 0:unknown 1:point 2:line, 3:plane, 4:circle, 5:sphere
          var X2 = (x.Mul(x)).s, tp=0, weight2, opnix = ni.Wedge(x), ipnix = ni.LDot(x),
              attitude, pos, normal, tg,btg,epsilon = 0.000001/(options.scale||1), I3=Element.Coeff(16,-1);
          var x2zero = Math.abs(X2) < epsilon, ipnixzero = ipnix.VLength < epsilon, opnixzero = opnix.VLength < epsilon;
          if (opnixzero && ipnixzero) {                 // free flat
          } else if (opnixzero && !ipnixzero) {         // bound flat (lines)
            attitude = no.Wedge(ni).LDot(x);
            weight2 = Math.abs(attitude.LDot(attitude).s)**.5;
            pos = attitude.LDot(x.Reverse); //Inverse);
            pos = [-pos.e15/pos.e45,-pos.e25/pos.e45,-pos.e34/pos.e45];
            if (x.Grade(3).VLength) {
              normal = [attitude.e1/weight2,attitude.e2/weight2,attitude.e3/weight2]; tp=2;
            } else if (x.Grade(2).VLength) { // point pair with ni
              tp = 1;
            } else {
              normal = Element.LDot(Element.Mul(attitude,1/weight2),I3).Normalized;
              var r=normal.Mul(Element.Coeff(3,1)); if (r[0]==-1) r[0]=1; else {r[0]+=1; r=r.Normalized;}
              tg = [...r.Mul(Element.Coeff(1,1)).Mul(r.Conjugate)].slice(1,4);
              btg = [...r.Mul(Element.Coeff(2,1)).Mul(r.Conjugate)].slice(1,4);
              normal = [...normal.slice(1,4)]; tp=3;
            }
          } else if (!opnixzero && ipnixzero) {         // dual bound flat
          } else if (x2zero) {                          // bound vec,biv,tri (points)
            if (options.ipns) x=x.Dual;
            attitude = ni.Wedge(no).LDot(ni.Wedge(x));
            pos = [...(Element.LDot(1/(ni.LDot(x)).s,x)).slice(1,4)].map(x=>-x);
            tp=1;
          } else if (!x2zero) {                          // round (point pair,circle,sphere)
            tp = x.Grade(3).VLength?4:x.Grade(2).VLength?6:5;
            var nix  = ni.Wedge(x), nix2 = (nix.Mul(nix)).s;
            attitude = ni.Wedge(no).LDot(nix);
            pos = [...(x.Mul(ni).Mul(x)).slice(1,4)].map(x=>-x/(2.0*nix2));
            weight2 = Math.abs((x.LDot(x)).s / nix2)**.5;
            if (tp==4) {
              if (x.LDot(x).s < 0) { weight2 = -weight2; }
              normal = Element.LDot(Element.Mul(attitude,1/weight2),I3).Normalized;
              var r=normal.Mul(Element.Coeff(3,1)); if (r[0]==-1) r[0]=1; else {r[0]+=1; r=r.Normalized;}
              tg = [...r.Mul(Element.Coeff(1,1)).Mul(r.Conjugate)].slice(1,4);
              btg = [...r.Mul(Element.Coeff(2,1)).Mul(r.Conjugate)].slice(1,4);
              normal = [...normal.slice(1,4)];
            } else if (tp==6) {
              weight2 = (x.LDot(x).s < 0)?-(weight2):weight2;
              normal = Element.Mul(attitude.Normalized,weight2).slice(1,4);
            } else {
              normal = [...((Element.LDot(Element.Mul(attitude,1/weight2),I3)).Normalized).slice(1,4)];
            }
          }
          return {tp,pos:pos?pos.map(x=>x*(options.scale||1)):[0,0,0],normal,tg,btg,weight2:weight2*(options.scale||1)}
        };
      // canvas update will (re)render the content.
        var armed=0,sphere,e14 = Element.Coeff(14,1);
        canvas.update = (x)=>{
          if (!canvas.parentElement) return;
        // restore from still..
          if (options && !options.still && canvas.im && canvas.im.parentElement) { canvas.im.parentElement.insertBefore(canvas,canvas.im); canvas.im.parentElement.removeChild(canvas.im); }
        // Start by updating canvas size if needed and viewport.
          var s = getComputedStyle(canvas); if (s.width) { canvas.width = parseFloat(s.width)*(options.devicePixelRatio||devicePixelRatio||1); canvas.height = parseFloat(s.height)*(options.devicePixelRatio||devicePixelRatio||1); }
          gl.viewport(0,0, canvas.width|0,canvas.height|0); var r=canvas.width/canvas.height;
        // Defaults, resolve function input
          var a,p=[],l=[],t=[],c=[.5,.5,.5],alpha=0,lastpos=[-2,2,0.2,1]; gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT); while (x.call) x=x();
        // Create default camera matrix and initial lastposition (contra-compensated for camera)
          M = mtx(options.camera); lastpos = options.camera.Conjugate.Mul(((a=new this()).set(lastpos,11),a)).Mul(options.camera).slice(11,14);
        // Grid.
          if (options.grid) {
            const gr = options.gridSize||1;
            if (!options.gridLines) { options.gridLines=[[],[],[]]; for (var i=-gr; i<=gr; i+=gr/10) {
                options.gridLines[0].push(i,-gr,gr, i,-gr,-gr, gr,-gr,i, -gr,-gr,i); 
                options.gridLines[1].push(i,gr,gr, i,-gr,gr, gr,i,gr, -gr,i,gr); 
                options.gridLines[2].push(-gr,i,gr, -gr,i,-gr, -gr,gr,i, -gr,-gr,i);
            }}
            var ltest = [], ltest2 = [], ttest = []; for (var j=0; j<3; ++j) for (var i=0; i<options.gridLines[j].length; i+=6) {
              ltest.push(...line_to_tri(options.gridLines[j].slice(i,i+6)));
              ltest2.push(...line_to_tri2(options.gridLines[j].slice(i,i+6)));
              var w = ((i/12)|0)%10 == 0 ? 2 : ((i/12)|0)%5 == 0 ?1.5:.75;
              ttest.push(w,.5,-w,.5,w,.5,w,.5,-w,.5,-w,.5);
            }
            gl.depthMask(false); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND); 
            draw(programline, gl.TRIANGLES, ltest, [canvas.width/canvas.height, .003, 0.0],  [0,0,0], canvas.width/canvas.height, ttest, undefined, ltest2);   
            gl.depthMask(true); gl.disable(gl.BLEND);
          }
        // Z-buffer override.
          if (options.noZ) gl.depthMask(false);
        // Loop over all items to render.
          for (var i=0,ll=x.length;i<ll;i++) {
            var e=x[i]; while (e&&e.call&&e.length==0) e=e(); if (e==undefined) continue;
          // CGA
            if (tot==5 && options.conformal) {
              if (e instanceof Array && e.length==2) { e.forEach(x=>{ while (x.call) x=x.call(); x=interprete(x);l.push.apply(l,x.pos); });  var d = {tp:-1}; }
              else if (e instanceof Array && e.length==3) { e.forEach(x=>{ while (x.call) x=x.call(); x=interprete(x);t.push.apply(t,x.pos); });  var d = {tp:-1}; }
              else var d = interprete(e);
              if (d.tp) lastpos=d.pos;
              if (d.tp==1) p.push.apply(p,d.pos);
              if (d.tp==2) { l.push.apply(l,d.pos.map((x,i)=>x-d.normal[i]*10)); l.push.apply(l,d.pos.map((x,i)=>x+d.normal[i]*10)); }
              if (d.tp==3) { t.push.apply(t,d.pos.map((x,i)=>x+d.tg[i]+d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x-d.tg[i]+d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x+d.tg[i]-d.btg[i]));
                             t.push.apply(t,d.pos.map((x,i)=>x-d.tg[i]+d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x+d.tg[i]-d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x-d.tg[i]-d.btg[i])); }
              if (d.tp==4) {
                var ne=0,la=0;
                if (d.weight2<0) { c[0]=1;c[1]=0;c[2]=0; }
                for (var j=0; j<65; j++) {
                  ne = d.pos.map((x,i)=>x+Math.cos(j/32*Math.PI)*d.weight2*d.tg[i]+Math.sin(j/32*Math.PI)*d.weight2*d.btg[i]); if (ne&&la&&(d.weight2>0||j%2==0)) { l.push.apply(l,la); l.push.apply(l,ne); }; la=ne;
                }
              }
              if (d.tp==6) {
                if (d.weight2<0) { c[0]=1;c[1]=0;c[2]=0; }
                if (options.useUnnaturalLineDisplayForPointPairs) {
                  l.push.apply(l,d.pos.map((x,i)=>x-d.normal[i]*(options.scale||1)));
                  l.push.apply(l,d.pos.map((x,i)=>x+d.normal[i]*(options.scale||1)));
                }
                p.push.apply(p,d.pos.map((x,i)=>x-d.normal[i]*(options.scale||1)));
                p.push.apply(p,d.pos.map((x,i)=>x+d.normal[i]*(options.scale||1)));
              }
              if (d.tp==5) {
                if (!sphere) {
                  var pnts = [], tris=[], S=Math.sin, C=Math.cos, pi=Math.PI, W=96, H=48;
                  for (var j=0; j<W+1; j++) for (var k=0; k<H; k++) {
                    pnts.push( [S(2*pi*j/W)*S(pi*k/(H-1)), C(2*pi*j/W)*S(pi*k/(H-1)), C(pi*k/(H-1))]);
                    if (j && k) {
                      tris.push.apply(tris, pnts[(j-1)*H+k-1]);tris.push.apply(tris, pnts[(j-1)*H+k]);tris.push.apply(tris, pnts[j*H+k-1]);
                      tris.push.apply(tris, pnts[j*H+k-1]); tris.push.apply(tris, pnts[(j-1)*H+k]); tris.push.apply(tris, pnts[j*H+k]);
                  }}
                  sphere = { va : createVA(tris,undefined) }; sphere.va.tcount = tris.length/3;
                }
                var oldM = M;
                M=[].concat.apply([],Element.Mul([[d.weight2,0,0,0],[0,d.weight2,0,0],[0,0,d.weight2,0],[d.pos[0],d.pos[1],d.pos[2],1]],[[M[0],M[1],M[2],M[3]],[M[4],M[5],M[6],M[7]],[M[8],M[9],M[10],M[11]],[M[12],M[13],M[14],M[15]]])).map(x=>x.s);
                gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,0.5); gl.enable(gl.CULL_FACE)
                draw(program,gl.TRIANGLES,undefined,c,[0,0,0],r,undefined,sphere.va);
                gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
                M = oldM;
              }
              if (i==ll-1 || d.tp==0) {
              // render triangles, lines, points.
                if (alpha) { gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,1-alpha); }
                if (t.length) { draw(program,gl.TRIANGLES,t,c,[0,0,0],r); t.forEach((x,i)=>{ if (i%9==0) lastpos=[0,0,0]; lastpos[i%3]+=x/3; }); t=[];  }
                if (l.length) { 
                  var ltest = [], ltest2 = [], ttest = []; for (var li=0; li<l.length; li+=6) {
                    ltest.push(...line_to_tri(l.slice(li,li+6)));
                    ltest2.push(...line_to_tri2(l.slice(li,li+6)));
                    var w = (options.lineWidth||1);
                    ttest.push(w,1-alpha,-w,1-alpha,w,1-alpha,w,1-alpha,-w,1-alpha,-w,1-alpha);
                  }
                  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
                  draw(programline, gl.TRIANGLES, ltest, [canvas.width/canvas.height,.003,0.0], c, canvas.width/canvas.height, ttest, undefined, ltest2);   
                  var l2=l.length-1; lastpos=[(l[l2-2]+l[l2-5])/2,(l[l2-1]+l[l2-4])/2+0.1,(l[l2]+l[l2-3])/2]; l=[]; 
                  gl.disable(gl.BLEND);
                }
                if (p.length) { gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); draw(programPoint,gl.POINTS,p,[0,0,0],c,r); lastpos = p.slice(-3); lastpos[0]-=0.075; lastpos[1]+=0.075; p=[]; gl.disable(gl.BLEND); }
                // Motor orbits
                  if ( e.call && e.length==2 && !e.va3) { var countx=e.dx||32,county=e.dy||32;
                    var temp=new Float32Array(3*countx*county),o=new Float32Array(3),et=[];
                    for (var pp=0,ii=0; ii<countx; ii++) for (var jj=0; jj<county; jj++,pp+=3)
                      temp.set(Element.sw(e(ii/(countx-1),jj/(county-1)),no).slice(1,4),pp);
                    for (ii=0; ii<countx-1; ii++) for (var jj=0; jj<county; jj++)
                      et.push((ii+0)*county+(jj+0),(ii+0)*county+(jj+1),(ii+1)*county+(jj+1),(ii+0)*county+(jj+0),(ii+1)*county+(jj+1),(ii+1)*county+(jj+0));
                    e.va3 = createVA(temp,undefined,et.map(x=>x%(countx*county))); e.va3.tcount = (countx-1)*county*2*3;
                  }
                  if ( e.call && e.length==1 && !e.va2) { var countx=e.dx||256;
                    var temp=new Float32Array(3*countx),o=new Float32Array(3),et=[];
                    for (var ii=0; ii<countx; ii++) { temp.set(Element.sw(e(ii/(countx-1)),no).slice(1,4),ii*3); if (ii) et.push(ii-1,ii); }
                    e.va2 = createVA(temp,undefined,et); e.va2.tcount = et.length;
                  }
                // Experimental display of motors using particle systems.
                  if (e instanceof Object && e.motor) {
                    if (!e.va || e.recalc) {
                       var seed = 1; function random() { var x = Math.sin(seed++) * 10000; return x - Math.floor(x); }
                       e.xRange = e.xRange === undefined ? 1:e.xRange; e.yRange = e.yRange === undefined ? 1:e.yRange; e.zRange = e.zRange === undefined ? 1:e.zRange;
                       var vtx=[], tx=[], vtx2=[];
                       for (var i=0; i<(e.zRange*e.xRange*e.yRange===0?2500:Math.pow(e.zRange*e.xRange*e.yRange,1/3)*6000); i++) {
                         var [x,y,z] = [random()*(2*e.xRange)-e.xRange,random()*2*e.yRange-e.yRange,random()*2*e.zRange-e.zRange];
                         var xyz = (x*x+y*y+z*z)*0.5;
                         var p  = Element.Vector(x,y,z,xyz-0.5,xyz+0.5);
                         var p2 = Element.sw(e.motor,p);
                         var d = p2[5]-p2[4]; p2[1]/=d; p2[2]/=d; p2[3]/=d;
                         tx.push(random(), random());
                         vtx.push(...p.slice(1,4)); vtx2.push(...p2.slice(1,4));
                       }  
                       e.va = createVA(vtx,tx,undefined,vtx2); e.va.tcount = vtx.length/3;
                       e.recalc = false;
                    } 
                    var time = performance.now()/1000;
                    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
                    draw(programmot, gl.POINTS,t,c,[time%1,0,0],r,undefined,e.va);
                    gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST);
                  }
                // we could also be an object with cached vertex array of triangles ..
                  else if (e.va || e.va2 || e.va3 || (e instanceof Object && e.data)) {
                    // Create the vertex array and store it for re-use.
                    if (!e.va3 && !e.va2) {
                      var et=[],et2=[],et3=[],lc=0,pc=0,tc=0; e.data.forEach(e=>{
                        if (e instanceof Array && e.length==3) { tc++; e.forEach(x=>{ while (x.call) x=x.call(); x=interprete(x);et3.push.apply(et3,x.pos); });  var d = {tp:-1}; }
                        else {
                          var d = interprete(e);
                          if (d.tp==1) { pc++; et.push(...d.pos);  }
                          if (d.tp==2) { lc++; et2.push(...d.pos.map((x,i)=>x-d.normal[i]*10),...d.pos.map((x,i)=>x+d.normal[i]*10)); }
                        }
                      });
                      e.va = createVA(et,undefined); e.va.tcount = pc;
                      e.va2 = createVA(et2,undefined); e.va2.tcount = lc*2;
                      e.va3 = createVA(et3,undefined); e.va3.tcount = tc*3;
                    }
                    // render the vertex array.
                    if (e.va  && e.va.tcount) { gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); draw(programPoint,gl.POINTS,undefined,[0,0,0],c,r,undefined,e.va); gl.disable(gl.BLEND); };
                    if (e.va2 && e.va2.tcount) draw(program,gl.LINES,undefined,[0,0,0],c,r,undefined,e.va2);
                    if (e.va3 && e.va3.tcount) draw(program,gl.TRIANGLES,undefined,c,[0,0,0],r,undefined,e.va3);
                  }
                if (alpha) gl.disable(gl.BLEND); // no alpha for text printing.
              // setup a new color
                if (typeof e == "number") { alpha=((e>>>24)&0xff)/255; c[0]=((e>>>16)&0xff)/255; c[1]=((e>>>8)&0xff)/255; c[2]=(e&0xff)/255; }
                if (typeof(e)=='string') {
                  if (options.htmlText) {
                    if (!x['_'+i]) { console.log('creating div'); Object.defineProperty(x,'_'+i, {value: document.body.appendChild(document.createElement('div')), enumerable:false }) };
                    var rc = canvas.getBoundingClientRect(), div = x['_'+i];
                    var pos2 = Element.Mul( [[M[0],M[4],M[8],M[12]],[M[1],M[5],M[9],M[13]],[M[2],M[6],M[10],M[14]],[M[3],M[7],M[11],M[15]]], [...lastpos,1]).map(x=>x.s);
                    pos2 = Element.Mul( [[5,0,0,0],[0,5*(r||2),0,0],[0,0,1,-1],[0,0,2,0]], pos2).map(x=>x.s).map((x,i,a)=>x/a[3]);
                    Object.assign(div.style,{position:'fixed',pointerEvents:'none',left:rc.left + (rc.right-rc.left)*(pos2[0]/2+0.5),top: rc.top + (rc.bottom-rc.top)*(-pos2[1]/2+0.5) - 20});
                    if (div.last != e) { div.innerHTML = e; div.last = e; if (self.renderMathInElement) self.renderMathInElement(div); }
                  } else { 
                    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
                    var fw = 113, mapChar = (x)=>{ var c = x.charCodeAt(0)-33; if (c>=94) c = 94+specialChars.indexOf(x); return c/fw; }
                    draw(program2,gl.TRIANGLES,
                         [...Array(e.length*6*3)].map((x,i)=>{ var x=0,z=-0.2, o=x+(i/18|0)*1.1; return (0.05*(options.z||5))*[o,-1,z,o+1.2,-1,z,o,1,z,o+1.2,-1,z,o+1.2,1,z,o,1,z][i%18]}),c,lastpos,r,
                         [...Array(e.length*6*2)].map((x,i)=>{ var o=mapChar(e[i/12|0]); return [o,1,o+1/fw,1,o,0,o+1/fw,1,o+1/fw,0,o,0][i%12]})); gl.disable(gl.BLEND); lastpos[1]-=0.18;
                  }      
                }
              }
              continue;
            }
          // PGA
            if (options.dual && e instanceof Element) e = e.Dual;
          // Convert planes to polygons.
            if (e instanceof Element && e.Grade(1).Length > 0.001) {
              var m = Element.Add(1, Element.Mul(e.Normalized, Element.Coeff(3,1))).Normalized, e0 = 0;
              e=Element.sw(m,[[-1,-1],[-1,1],[1,1],[-1,-1],[1,1],[1,-1]].map(([x,z])=>Element.Trivector(x*e.Length,e0,z*e.Length,1)));
            }
          // Convert lines to line segments.
            if (e instanceof Element && e.Grade(2).Length)
               e=[e.LDot(e14).Wedge(e).Add(e.Wedge(Element.Coeff(1,1)).Mul(Element.Coeff(0,-500))),e.LDot(e14).Wedge(e).Add(e.Wedge(Element.Coeff(1,1)).Mul(Element.Coeff(0,500)))];
          // If euclidean point, store as point, store line segments and triangles.
            if (e.e123) p.push.apply(p,e.slice(11,14).map((y,i)=>(i<=1?1:-1)*y/e[14]).reverse());
            if (e instanceof Array && e.length==2) l=l.concat.apply(l,e.map(x=>[...x.slice(11,14).map((y,i)=>(i<=1?1:-1)*y/x[14]).reverse()]));
            if (e instanceof Array && e.length%3==0) t=t.concat.apply(t,e.map(x=>[...x.slice(11,14).map((y,i)=>(i<=1?1:-1)*y/x[14]).reverse()]));
          // Render orbits of parametrised motors, as well as lists of points.. 
            function sw_mot_orig(A,R){
              var a0=A[0],a1=A[5],a2=A[6],a3=A[7],a4=A[8],a5=A[9],a6=A[10],a7=A[15];
              R[2] = -2*(a0*a3+a4*a7-a6*a2-a5*a1);
              R[1] = -2*(a4*a1-a0*a2-a6*a3+a5*a7);
              R[0] =  2*(a0*a1+a4*a2+a5*a3+a6*a7);
              return R
            }
            if ( e.call && e.length==1) { var count=e.dx||64;
              for (var ismot,xx,o=new Float32Array(3),ii=0; ii<count; ii++) {
                if (ii>1) l.push(xx[0],xx[1],xx[2]);
                var m = e(ii/(count-1));
                if (ii==0) ismot = m[0]||m[5]||m[6]||m[7]||m[8]||m[9]||m[10];
                xx = ismot?sw_mot_orig(m,o):m.slice(11,14).map((y,i)=>(i<=1?1:-1)*y).reverse(); //Element.sw(e(ii/(count-1)),o);
                l.push(xx[0],xx[1],xx[2]);
              }
            }
            if ( e.call && e.length==2 && !e.va) { var countx=e.dx||64,county=e.dy||32;
              var temp=new Float32Array(3*countx*county),o=new Float32Array(3),et=[];
              for (var pp=0,ii=0; ii<countx; ii++) for (var jj=0; jj<county; jj++,pp+=3) temp.set(sw_mot_orig(e(ii/(countx-1),jj/(county-1)),o),pp);
              for (ii=0; ii<countx-1; ii++) for (var jj=0; jj<county; jj++) et.push((ii+0)*county+(jj+0),(ii+0)*county+(jj+1),(ii+1)*county+(jj+1),(ii+0)*county+(jj+0),(ii+1)*county+(jj+1),(ii+1)*county+(jj+0));
              e.va = createVA(temp,undefined,et.map(x=>x%(countx*county))); e.va.tcount = (countx-1)*county*2*3;
            }
          // Experimental display of motors using particle systems.
            if (e instanceof Object && e.motor) {
              if (!e.va || e.recalc) {
                 var seed = 1; function random() { var x = Math.sin(seed++) * 10000; return x - Math.floor(x); }
                 e.xRange = e.xRange === undefined ? 1:e.xRange; e.yRange = e.yRange === undefined ? 1:e.yRange; e.zRange = e.zRange === undefined ? 1:e.zRange;
                 var vtx=[], tx=[], vtx2=[];
                 for (var i=0; i<(e.zRange===0?5000:60000); i++) {
                   var p  = Element.Trivector(random()*(2*e.xRange)-e.xRange,random()*2*e.yRange-e.yRange,random()*2*e.zRange-e.zRange,1);
//                   var p2 = Element.sw(e.motor,p);
                   var p2 = e.motor.Mul(p).Mul(e.motor.Inverse);
                   tx.push(random(), random());
                   vtx.push(...p.slice(11,14).reverse()); vtx2.push(...p2.slice(11,14).reverse());
                 }  
                 e.va = createVA(vtx,tx,undefined,vtx2); e.va.tcount = vtx.length/3;
                 e.recalc = false;
              } 
              var time = performance.now()/1000;
              gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
              draw(programmot, gl.POINTS,t,c,[time%1,0,0],r,undefined,e.va);
              gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST);
            }
          // we could also be an object with cached vertex array of triangles ..
            else if (e.va || (e instanceof Object && e.data)) {
              // Create the vertex array and store it for re-use.
              if (!e.va) {
                if (e.idx) {
                  var et = e.data.map(x=>[...x.slice(11,14).map((y,i)=>(i<=1?1:-1)*y/x[14]).reverse()]).flat();
                } else {
                  var et=[]; e.data.forEach(e=>{if (e instanceof Array && e.length==3) et=et.concat.apply(et,e.map(x=>[...x.slice(11,14).map((y,i)=>(i<=1?1:-1)*y/x[14]).reverse()]));});
                }
                e.va = createVA(et,undefined,e.idx,e.color?new Float32Array(e.color):undefined); e.va.tcount = (e.idx && e.idx.length)?e.idx.length:e.data.length*3;
              }
              // render the vertex array.
              var M5 = Element.Scalar(1).Add(Element.Coeff(7,2.5));
              if (e.transform) {
                  var M1 = mtx(e.transform, false);
                  var M2 = mtx(M5.Mul(options.camera), false);
                  M = Array(16).fill(0);
                  for (var ii=0; ii<4; ++ii) for (var jj=0; jj<4; ++jj) for (var kk=0; kk<4; ++kk) M[ii*4+kk] += M1[ii*4+jj] * M2[jj*4+kk];
               }
              if (alpha) { gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,1-alpha); }
              draw(e.color?programcol:program,gl.TRIANGLES,t,c,[0,0,0],r,undefined,e.va);
              if (alpha) gl.disable(gl.BLEND);
              if (e.transform) { M=mtx(options.camera); }
            }
            // if we're a number (color), label or the last item, we output the collected items.
            else if (typeof e=='number' || i==ll-1 || typeof e == 'string') {
            // render triangles, lines, points.
              if (alpha) { gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,1-alpha); }
              if (t.length) { draw(program,gl.TRIANGLES,t,c,[0,0,0],r); t.forEach((x,i)=>{ if (i%9==0) lastpos=[0,0,0]; lastpos[i%3]+=x/3; }); t=[];  }
              if (l.length) { 
                var ltest = [], ltest2 = [], ttest = [],  w = (options.lineWidth||1); for (var li=0; li<l.length; li+=6) {
                  ltest.push(...line_to_tri(l.slice(li,li+6)));
                  ltest2.push(...line_to_tri2(l.slice(li,li+6)));
                  ttest.push(w,1-alpha,-w,1-alpha,w,1-alpha,w,1-alpha,-w,1-alpha,-w,1-alpha);
                }
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
                draw(programline, gl.TRIANGLES, ltest, [canvas.width/canvas.height,.003,0.0], c, canvas.width/canvas.height, ttest, undefined, ltest2);   
                var l2=l.length-1; lastpos=[(l[l2-2]+l[l2-5])/2,(l[l2-1]+l[l2-4])/2+0.1,(l[l2]+l[l2-3])/2]; l=[]; 
                gl.disable(gl.BLEND);
              }
              if (p.length) { gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); draw(programPoint,gl.POINTS,p,[0,0,0],c,r); lastpos = p.slice(-3); lastpos[0]-=0.075; lastpos[1]+=0.075; p=[];gl.disable(gl.BLEND); }
              if (alpha) gl.disable(gl.BLEND);
            // setup a new color
              if (typeof e == "number") { alpha=((e>>>24)&0xff)/255; c[0]=((e>>>16)&0xff)/255; c[1]=((e>>>8)&0xff)/255; c[2]=(e&0xff)/255; }
            // render a label
              if (typeof(e)=='string') {
                if (options.htmlText) { 
                  if (!canvas['_'+i]) { console.log('creating div'); Object.defineProperty(canvas,'_'+i, {value: document.body.appendChild(document.createElement('div')), enumerable:false }) };
                  var rc = canvas.getBoundingClientRect(), div = canvas['_'+i];
                  var pos2 = Element.Mul( [[M[0],M[4],M[8],M[12]],[M[1],M[5],M[9],M[13]],[M[2],M[6],M[10],M[14]],[M[3],M[7],M[11],M[15]]], [...lastpos,1]).map(x=>x.s);
                  pos2 = Element.Mul( [[5,0,0,0],[0,5*(r||2),0,0],[0,0,1,-1],[0,0,2,0]], pos2).map(x=>x.s).map((x,i,a)=>x/a[3]);
                  Object.assign(div.style,{position:'fixed',pointerEvents:'none',left:rc.left + (rc.right-rc.left)*(pos2[0]/2+0.5),top: rc.top + (rc.bottom-rc.top)*(-pos2[1]/2+0.5) - 20});
                  if (div.last != e) { div.innerHTML = e; div.last = e; if (self.renderMathInElement) self.renderMathInElement(div,{output:'html'});  }
                } else { 
                  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
                  var fw = 113, mapChar = (x)=>{ var c = x.charCodeAt(0)-33; if (c>=94) c = 94+specialChars.indexOf(x); return c/fw; }
                  draw(program2,gl.TRIANGLES,
                       [...Array(e.length*6*3)].map((x,i)=>{ var x=0,z=-0.2, o=x+(i/18|0)*1.1; return 0.25*[o,-1,z,o+1.2,-1,z,o,1,z,o+1.2,-1,z,o+1.2,1,z,o,1,z][i%18]}),c,lastpos,r,
                       [...Array(e.length*6*2)].map((x,i)=>{ var o=mapChar(e[i/12|0]); return [o,1,o+1/fw,1,o,0,o+1/fw,1,o+1/fw,0,o,0][i%12]})); gl.disable(gl.BLEND); lastpos[1]-=0.18;
                  if (!options.noZ) gl.enable(gl.DEPTH_TEST);     
                }
              }
            }
          };
          // if we're no longer in the page .. stop doing the work.
          armed++; if (document.body.contains(canvas)) armed=0; if (armed==2) return;
          canvas.value=x; if (options&&!options.animate) canvas.dispatchEvent(new CustomEvent('input')); canvas.options=options;
          if (options&&options.animate) { requestAnimationFrame(canvas.update.bind(canvas,f,options)); }
          if (options&&options.still) { canvas.value=x; canvas.dispatchEvent(new CustomEvent('input')); canvas.im.style.width=canvas.style.width; canvas.im.style.height=canvas.style.height; canvas.im.src = canvas.toDataURL();
            var p=canvas.parentElement;  if (p) { p.insertBefore(canvas.im,canvas); p.removeChild(canvas); }
          }
        }
        // Basic mouse interactivity. needs more love.
        var sel=-1; canvas.oncontextmenu = canvas.onmousedown = (e)=>{e.preventDefault(); e.stopPropagation();  if (e.detail===0) return;
          var rc = canvas.getBoundingClientRect(), mx=(e.x-rc.left)/(rc.right-rc.left)*2-1, my=((e.y-rc.top)/(rc.bottom-rc.top)*4-2)*canvas.height/canvas.width;
          sel = (e.button==2)?-3:-2; canvas.value.forEach((x,i)=>{
            if (tot != 5) { if (x[14]) {
              var pos2 = Element.Mul( [[M[0],M[4],M[8],M[12]],[M[1],M[5],M[9],M[13]],[M[2],M[6],M[10],M[14]],[M[3],M[7],M[11],M[15]]], [-x[13]/x[14],-x[12]/x[14],x[11]/x[14],1]).map(x=>x.s);
              pos2 = Element.Mul( [[5,0,0,0],[0,5*(2),0,0],[0,0,1,-1],[0,0,2,0]], pos2).map(x=>x.s).map((x,i,a)=>x/a[3]);
              if ((mx-pos2[0])**2 + ((my)-pos2[1])**2 < 0.02) sel=i;
            }} else {
              x = interprete(x); if (x.tp==1) {
                var pos2 = Element.Mul( [[M[0],M[4],M[8],M[12]],[M[1],M[5],M[9],M[13]],[M[2],M[6],M[10],M[14]],[M[3],M[7],M[11],M[15]]], [...x.pos,1]).map(x=>x.s);
                pos2 = Element.Mul( [[5,0,0,0],[0,5*(r||2),0,0],[0,0,1,-1],[0,0,2,0]], pos2).map(x=>x.s).map((x,i,a)=>x/a[3]);
                if ((mx-pos2[0])**2 + ((-my)-pos2[1])**2 < 0.01) sel=i;
              }
            }
          });
          canvas.onwheel=e=>{e.preventDefault(); e.stopPropagation(); options.z = (options.z||5)+e.deltaY/100; if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));}
          canvas.onmouseup=e=>sel=-1; canvas.onmouseleave=e=>sel=-1;
          var tx,ty; canvas.ontouchstart = (e)=>{e.preventDefault();  canvas.focus(); var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY; tx=x; ty=y; }
          canvas.ontouchmove = function (e) { e.preventDefault();
             var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY, mx = (x-(tx||x))/1000, my = -(y-(ty||y))/1000; tx=x; ty=y;
             options.h = (options.h||0)+mx; options.p = Math.max(-Math.PI/2,Math.min(Math.PI/2, (options.p||0)+my)); if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options)); return;
          };
          canvas.onmousemove=(e)=>{
            var rc = canvas.getBoundingClientRect(),x; if (sel>=0) { if (tot==5) x=interprete(canvas.value[sel]); else { x=canvas.value[sel]; x={pos:[-x[13]/x[14],-x[12]/x[14],x[11]/x[14]]};  }}
            var mx =(e.movementX)/(rc.right-rc.left)*2, my=((e.movementY)/(rc.bottom-rc.top)*2)*canvas.height/canvas.width;
            if (sel==-2) { options.h = (options.h||0)+(options.conformal?-1:1)*mx/2; options.p = Math.max(-Math.PI/2,Math.min(Math.PI/2, (options.p||0)-my/2)); if (options.camera) options.camera.set( ( Element.Bivector(0,0,0,0,0,options.p).Exp() ).Mul( Element.Bivector(0,0,0,0,options.h,0).Exp() )); if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options)); return; };
            if (sel==-3) { var ct = Math.cos(options.h||0), st= Math.sin(options.h||0), ct2 = Math.cos(options.p||0), st2 = Math.sin(options.p||0);
              if (e.shiftKey) { options.posy = (options.posy||0)+my; } else { options.posx = (options.posx||0)+mx*ct+my*st; options.posz = (options.posz||0)+mx*-st+my*ct*ct2; } if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));return; }; if (sel < 0) return;
            if (tot==5) { 
               x.pos[0] += (e.buttons!=2)?Math.cos((options.h||0))*mx:Math.sin(-(options.h||0))*-my; x.pos[1]+=(e.buttons!=2)?-my:0; x.pos[2]+=(e.buttons!=2)?Math.sin((options.h||0))*mx:Math.cos(-(options.h||0))*-my;
               canvas.value[sel].set(Element.Mul(ni,(x.pos[0]**2+x.pos[1]**2+x.pos[2]**2)*0.5).Sub(no)); canvas.value[sel].set(x.pos,1); }
            else if (x) { 
               canvas.value[sel].set(   Element.sw(Element.sw(options.camera.Reverse,Element.Bivector(-mx/2,my/2,0,0,0,0).Exp()),canvas.value[sel]) );
            }
            if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));
          }
        }
        canvas.value = f.call?f():f; canvas.options=options;
        if (options&&options.still) {
          var i=new Image(); canvas.im = i; return requestAnimationFrame(canvas.update.bind(canvas,f,options)),canvas;
        } else return requestAnimationFrame(canvas.update.bind(canvas,f,options)),canvas;
      }

    // The inline function is a js to js translator that adds operator overloading and algebraic literals.
    // It can be called with a function, a string, or used as a template function.
      static inline(intxt) {
      // If we are called as a template function.
        if (arguments.length>1 || intxt instanceof Array) {
          var args=[].slice.call(arguments,1);
          return res.inline(new Function(args.map((x,i)=>'_template_'+i).join(),'return ('+intxt.map((x,i)=>(x||'')+(args[i]&&('_template_'+i)||'')).join('')+')')).apply(res,args);
        }
      // Get the source input text.
        var txt = (intxt instanceof Function)?intxt.toString():`function(){return (${intxt})}`;
      // Our tokenizer reads the text token by token and stores it in the tok array (as type/token tuples).
        var tok = [], resi=[], t, possibleRegex=false, c, tokens = [/^[\s\uFFFF]|^[\u000A\u000D\u2028\u2029]|^\/\/[^\n]*\n|^\/\*[\s\S]*?\*\//g,                 // 0: whitespace/comments
          /^\"\"|^\'\'|^\".*?[^\\]\"|^\'.*?[^\\]\'|^\`[\s\S]*?[^\\]\`/g,                                                                // 1: literal strings
          /^\d+[.]{0,1}\d*[ei][\+\-_]{0,1}\d*|^\.\d+[ei][\+\-_]{0,1}\d*|^e_\d*/g,                                                       // 2: literal numbers in scientific notation (with small hack for i and e_ asciimath)
          /^\d+[.]{0,1}\d*[E][+-]{0,1}\d*|^\.\d+[E][+-]{0,1}\d*|^0x\d+|^\d+[.]{0,1}\d*|^\.\d+/g,                                        // 3: literal hex, nonsci numbers
          /^\/.*?[^\\]\/[gmisuy]?/g,                                                                                                    // 4: regex
          /^(\.Normalized|\.Length|\.\.\.|>>>=|===|!==|>>>|<<=|>>=|=>|\|\||[<>\+\-\*%&|^\/!\=]=|\*\*|\+\+|\-\-|<<|>>|\&\&|\^\^|^[{}()\[\];.,<>\+\-\*%|&^!~?:=\/]{1})/g,   // 5: punctuator
          /^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}\u200C\u200D]*/gu]                                                                 // 6: identifier
        while (txt.length) for (t in tokens) {
          if (t == 4 && !possibleRegex) continue;
          if (resi = txt.match(tokens[t])) {
            c = resi[0]; if (t!=0) {possibleRegex = c == '(' || c == '=' || c == '[' || c == ',' || c == ';';} tok.push([t | 0, c]); txt = txt.slice(c.length); break;
          }} // tokenise
      // Translate algebraic literals. (scientific e-notation to "this.Coeff"
        tok=tok.map(t=>(t[0]==2)?[2,'Element.Coeff('+basis.indexOf((!options.Cayley?simplify:(x)=>x)('e'+t[1].split(/e_|e|i/)[1]||1).replace('-',''))+','+(simplify(t[1].split(/e_|e|i/)[1]||1).match('-')?"-1*":"")+parseFloat(t[1][0]=='e'?1:t[1].split(/e_|e|i/)[0])+')']:t);
      // String templates (limited support - needs fundamental changes.).
        tok=tok.map(t=>(t[0]==1 && t[1][0]=='`')?[1,t[1].replace(/\$\{(.*?)\}/g,a=>"${"+Element.inline(a.slice(2,-1)).toString().match(/return \((.*)\)/)[1]+"}")]:t);  
      // We support two syntaxes, standard js or if you pass in a text, asciimath.
        var syntax = (intxt instanceof Function)?[[['.Normalized','Normalize',2],['.Length','Length',2]],[['~','Conjugate',1],['!','Dual',1]],[['**','Pow',0,1]],[['^','Wedge'],['&','Vee'],['<<','LDot']],[['*','Mul'],['/','Div']],[['|','Dot']],[['>>>','sw',0,1]],[['-','Sub'],['+','Add']],[['%','%']],[['==','eq'],['!=','neq'],['<','lt'],['>','gt'],['<=','lte'],['>=','gte']]]
                                                :[[['pi','Math.PI'],['sin','Math.sin']],[['ddot','this.Reverse'],['tilde','this.Involute'],['hat','this.Conjugate'],['bar','this.Dual']],[['^','Pow',0,1]],[['^^','Wedge'],['*','LDot']],[['**','Mul'],['/','Div']],[['-','Sub'],['+','Add']],[['<','lt'],['>','gt'],['<=','lte'],['>=','gte']]];
      // For asciimath, some fixed translations apply (like pi->Math.PI) etc ..
        tok=tok.map(t=>(t[0]!=6)?t:[].concat.apply([],syntax).filter(x=>x[0]==t[1]).length?[6,[].concat.apply([],syntax).filter(x=>x[0]==t[1])[0][1]]:t);
      // Now the token-stream is translated recursively.
        function translate(tokens) {
          // helpers : first token to the left of x that is not of a type in the skip list.
          var left = (x=ti-1,skip=[0])=>{ while(x>=0&&~skip.indexOf(tokens[x][0])) x--; return x; },
          // first token to the right of x that is not of a type in the skip list.
              right= (x=ti+1,skip=[0])=>{ while(x<tokens.length&&~skip.indexOf(tokens[x][0])) x++; return x; },
          // glue from x to y as new type, optionally replace the substring with sub.
              glue = (x,y,tp=6,sub)=>{tokens.splice(x,y-x+1,[tp,...(sub||tokens.slice(x,y+1))])},
          // match O-C pairs. returns the 'matching bracket' position
              match = (O="(",C=")")=>{var o=1,x=ti+1; while(o){if(tokens[x][1]==O)o++;if(tokens[x][1]==C)o--; x++;}; return x-1;};
          // grouping (resolving brackets).
          for (var ti=0,t,si;t=tokens[ti];ti++) if (t[1]=="(") glue(ti,si=match(),7,[[5,"("],...translate(tokens.slice(ti+1,si)),[5,")"]]);
          // [] dot call and new
          for (var ti=0,t,si; t=tokens[ti];ti++) {
            if (t[1]=="[") { glue(ti,si=match("[","]"),7,[[5,"["],...translate(tokens.slice(ti+1,si)),[5,"]"]]); if (ti)ti--;}    // matching []
            else if (t[1]==".") { glue(left(),right()); ti--; }                                                                   // dot operator
            else if (t[0]==7 && ti && left()>=0 && tokens[left()][0]>=6 && tokens[left()][1]!="return") { glue(left(),ti--) }     // collate ( and [
            else if (t[1]=='new') { glue(ti,right()) };                                                                           // collate new keyword
          }
          // ++ and --
          for (var ti=0,t; t=tokens[ti];ti++) if (t[1]=="++" || t[1]=="--") glue(left(),ti);
          // unary - and + are handled separately from syntax ..
          for (var ti=0,t,si; t=tokens[ti];ti++)
            if (t[1]=="-" && (left()<0 || (tokens[left()]||[5])[0]==5)) glue(ti,right(),6,["Element.Sub(",tokens[right()],")"]);   // unary minus works on all types.
            else if (t[1]=="+" && (tokens[left()]||[0])[0]==5 && (tokens[left()]||[0])[1][0]!=".") glue(ti,ti+1);                   // unary plus is glued, only on scalars.
          // now process all operators in the syntax list ..
          for (var si=0,s; s=syntax[si]; si++) for (var ti=s[0][3]?tokens.length-1:0,t; t=tokens[ti];s[0][3]?ti--:ti++) for (var opi=0,op; op=s[opi]; opi++) if (t[1]==op[0]) {
            // exception case .. ".Normalized" and ".Length" properties are re-routed (so they work on scalars etc ..)
                  if (op[2]==2) { var arg=tokens[left()]; glue(ti-1,ti,6,["Element."+op[1],"(",arg,")"]); }
            // unary operators (all are to the left)
              else if (op[2])    { var arg=tokens[right()]; glue(ti, right(), 6, ["Element."+op[1],"(",arg,")"]); }
            // binary operators
                            else { var l=left(),r=right(),a1=tokens[l],a2=tokens[r]; if (op[0]==op[1]) glue(l,r,6,[a1,op[1],a2]); else glue(l,r,6,["Element."+op[1],"(",a1,",",a2,")"]); ti--; }
          }
          return tokens;
      }
      // Glue all back together and return as bound function.
        return eval( ('('+(function f(t){return t.map(t=>t instanceof Array?f(t):typeof t == "string"?t:"").join('');})(translate(tok))+')') );
      }
    }

    if ((p==2 || p==3) && (r==1)) {
      res.arrow = res.inline(( from_point, to_point, w=0.03, aspect=0.8 )=>{
        from_point = from_point/(-from_point|!1e0); to_point = to_point/(-to_point|!1e0);
        var line = ( to_point & from_point ), l = line.Length;
        var shape = [[0,w],[l-5*w,w],[l-5*w,aspect*5*w],[l,0],[l-5*w,-aspect*5*w],[l-5*w,-w],[0,-w]].map(([x,y])=>!(1e0+x*1e1+y*1e2));
        return (1+from_point/!1e0).Normalized*(1+(((to_point) - from_point) & !1e0).Normalized/(!1e1 & !1e0)).Normalized >>> shape;
      })    
    }

    if (options.dual) {
      Object.defineProperty(res.prototype, 'Inverse', {configurable:true, get(){ var s = 1/this.s**2; return this.map((x,i)=>i?-x*s:1/x ); }});
    } else {
    // Matrix-free inverses up to 5D. Should translate this to an inline call for readability.
    // http://repository.essex.ac.uk/17282/1/TechReport_CES-534.pdf
      Object.defineProperty(res.prototype, 'Inverse', {configurable: true, get(){
        // Shirokov inverse ..
        if (tot > 5) {
          for (var N=2**(((tot+1)/2)|0), Uk=this.Scale(1), k=1; k<N; ++k) {
            var adjU = Uk.Sub(this.constructor.Scalar((N/k) * Uk.s));
            Uk = this.Mul(adjU);
          }
          return Uk.s == 0 ? 0:adjU.Scale( 1/Uk.s );
        }
        return (tot==0)?new this.constructor.Scalar([1/this[0]]):
               (tot==1)?this.Involute.Mul(this.constructor.Scalar(1/this.Mul(this.Involute)[0])):
               (tot==2)?this.Conjugate.Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate)[0])):
               (tot==3)?this.Reverse.Mul(this.Involute).Mul(this.Conjugate).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse)[0])):
               (tot==4)?this.Conjugate.Mul(this.Mul(this.Conjugate).Map(3,4)).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Mul(this.Conjugate).Map(3,4))[0])):
                        this.Conjugate.Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4)).Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4))[0]));
      }});
    }

    if (options.over) {
     // experimental. do not use.
      res.over = options.over;
      ["Mul","Add","Sub","Scale","Dot","Wedge","LDot","Vee"].forEach(x=>res.prototype[x] = options.over.inline(res.prototype[x]));
      res.prototype.Coeff   = function() { for (var i=0,l=arguments.length; i<l; i+=2) this[arguments[i]]=(arguments[i+1] instanceof options.over)?arguments[i+1]:options.over.Scalar(arguments[i+1]); return this; }
      res.prototype.upgrade = function () { for (var i=0; i<this.length; i++) this[i] = options.over.Scalar(0); }
      Object.defineProperty(res.prototype, 'Conjugate', {configurable:true,get(){var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i].slice().Scale([1,-1,-1,1][grades[i]%4]); return res; }});
      Object.defineProperty(res.prototype, 'Reverse',   {configurable:true,get(){var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i].slice().Scale([1,1,-1,-1][grades[i]%4]); return res; }});
      Object.defineProperty(res.prototype, 'Involute',  {configurable:true,get(){var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i].slice().Scale([1,-1,1,-1][grades[i]%4]); return res; }});
      Object.defineProperty(res.prototype, 'Inverse', {configurable: true, get(){
        return (tot==0)?new this.constructor.Scalar([this[0].Inverse]):
               (tot==1)?this.Involute.Mul(this.constructor.Scalar(this.Mul(this.Involute)[0].Inverse)):
               (tot==2)?this.Conjugate.Mul(this.constructor.Scalar(this.Mul(this.Conjugate)[0].Inverse)):
               (tot==3)?this.Reverse.Mul(this.Involute).Mul(this.Conjugate).Mul( this.constructor.Scalar(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse)[0].Inverse)):
               (tot==4)?this.Conjugate.Mul(this.Mul(this.Conjugate).Map(3,4)).Mul( this.constructor.Scalar(this.Mul(this.Conjugate).Mul(this.Mul(this.Conjugate).Map(3,4))[0].Inverse)):
                        this.Conjugate.Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4)).Mul(this.constructor.Scalar(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4))[0].Inverse));
      }});
      res.prototype.toString = function() { return [...this].map((x,i)=>x==0?undefined:(i?'('+x+')'+basis[i]:x.toString())).filter(x=>x).join(' + '); }
    }

  // Experimental differential operator.
    var _D, _DT, _DA, totd = basis.length;
    function makeD(transpose=false){
      _DA = _DA || Algebra({ p:p,q:q,r:r,basis:options.basis,even:options.even,over:Algebra({dual:totd})}); // same algebra, but over dual numbers.
      return (func)=>{
        var dfunc = _DA.inline(func);                                                                       // convert input function to dual algebra
        return (val,...args)=>{                                                                             // return a new function (the derivative w.r.t 1st param)
          if (!(val instanceof res)) val = res.Scalar(val);                                                 // allow to be called with scalars.
          args = args.map(x=>{ var r = _DA.Scalar(0); for (var i=0; i<totd; i++) r[i][0]=x[i]; return r;}); // upcast args.
          for (var dval=_DA.Scalar(0),i=0; i<totd; i++) { dval[i][0] = val[i]; dval[i][1+i] = 1; };         // fill in coefficients and dual components
          var rval = dfunc(dval,...args); var r = [...Array(totd)].map(x=>val.slice());                     // call the function in the dual algebra.
          if (transpose) for (var i=0; i<totd; i++) for (var j=0; j<totd; j++) { r[i][j] = rval[i][j+1]; }  // downcast transpose from dual algebra to Jacobian vector.
          else for (var i=0; i<totd; i++) for (var j=0; j<totd; j++) { r[j][i] = rval[i][j+1]; }            // downcast from dual algebra to Jacobian vector.
          return r.length<=2?r[0]:r;                                                                        // return derivative or jacobian.
        }
      }
    }
    Object.defineProperty(res, 'D',  {configurable:true,get(){ if (_D) return _D; _D = makeD(false); return _D }});
    Object.defineProperty(res, 'Dt', {configurable:true,get(){ if (_DT) return _DT; _DT = makeD(true); return _DT }});

  // If a function was passed in, translate, call and return its result. Else just return the Algebra.
    if (fu instanceof Function) return res.inline(fu)(); else return res;
  }
}));