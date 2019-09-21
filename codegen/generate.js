//******** Projective Geometric Algebra *********//
// 
// a nodeJS template generator for a reference
// PGA implementation in a variety of languages.
//
//***********************************************//

//***********************************************//
// Templates are loaded here ..
//***********************************************//
var lang = [
      { name: 'csharp', ext: "cs",  template: require('./cs.template.js') },
      { name: 'cpp', ext: "cpp", template: require('./cpp.template.js') },
      { name: 'python', ext: "py",  template: require('./py.template.js') },
      { name: 'rust', ext: "rs",  template: require('./rs.template.js') }
    ];

//***********************************************//
// The code generator is below.
//***********************************************//

// We use ganja.js to do our heavy lifting.
Algebra = require('../ganja.js');

// To write output files.
fs = require('fs');
path = require('path');

// The basis used in the Siggraph course notes.
var basis = "1,e0,e1,e2,e3,e01,e02,e03,e12,e31,e23,e021,e013,e032,e123,e0123".split(",");
var p=3, q=0, r=1;
var name="PGA3D";

// Process commandline parameters
if (process.argv[2] && process.argv[2]!='PGA3D') {
  name = process.argv[2].toUpperCase();
  var known = {
    "CGA":[4,1,0],
    "MINK":[1,1,0],
    "R3":[3,0,0],
    "R2":[2,0,0],
    "C":[0,1,0],
    "QUAT":[0,2,0],
    "SPACETIME":[3,1,0],
    "HYPERBOLIC":[1,0,0],
    "DUAL":[0,0,1]
  };
  if (known[name]) {
    [p,q,r] = known[name]
  } else if (name[0]=='R') {
    [p,q,r] = [name[1]|0,name[2]|0,name[3]|0];
    console.log('CUSTOM METRIC : ', p, q, r);
  } else {
    console.log('UNKNOWN ALGEBRA ! use rPQR (e.g. R410) or one of the names in ['+Object.keys(known)+']');
    process.exit(1);
  }
  basis = undefined;
}

// A Javascript implementation of the algebra.
var pga = Algebra({p,q,r,basis,graded:false});

basis = pga.describe().basis;
var d= 2**(p+q+r);

//console.log(basis.join(','));

// unroll functions that ganja does with for loops.
pga.prototype.Add= new Function("b,res",
`  res = res||new pga();
  ${[...Array(2**(p+q+r))].map((x,i)=>`  res[${i}] = this[${i}]+b[${i}];`).join("\n")}
  return res;`)
pga.prototype.Sub= new Function("b,res",
`  res = res||new pga();
  ${[...Array(2**(p+q+r))].map((x,i)=>`  res[${i}] = this[${i}]-b[${i}];`).join("\n")}
  return res;`)
// prototype scalar mul/add left and right side  
pga.prototype.muls= new Function("b,res",
`  res = res||new pga();
  ${[...Array(2**(p+q+r))].map((x,i)=>`  res[${i}] = this[${i}]*b;`).join("\n")}
  return res;`)
pga.prototype.smul= new Function("b,res",
`  res = res||new pga();
  ${[...Array(2**(p+q+r))].map((x,i)=>`  res[${i}] = a*b[${i}];`).join("\n")}
  return res;`)
pga.prototype.adds= new Function("b,res",
`  res = res||new pga();
  res[0] = this[0]+b;
  ${[...Array(2**(p+q+r)-1)].map((x,i)=>`  res[${i+1}] = this[${i+1}];`).join("\n")}
  return res;`)
pga.prototype.sadd= new Function("b,res",
`  res = res||new pga();
  res[0] = a+b[0];
  ${[...Array(2**(p+q+r)-1)].map((x,i)=>`  res[${i+1}] = b[${i+1}];`).join("\n")}
  return res;`)
pga.prototype.subs= new Function("b,res",
`  res = res||new pga();
  res[0] = this[0]-b;
  ${[...Array(2**(p+q+r)-1)].map((x,i)=>`  res[${i+1}] = this[${i+1}];`).join("\n")}
  return res;`)
pga.prototype.ssub= new Function("b,res",
`  res = res||new pga();
  res[0] = a-b[0];
  ${[...Array(2**(p+q+r)-1)].map((x,i)=>`  res[${i+1}] = -b[${i+1}];`).join("\n")}
  return res;`)


// The binary operators we support
var binops = [
      { name:"Mul",   symbol:"*", desc:"The geometric product." },
      { name:"Wedge", symbol:"^", desc:"The outer product. (MEET)" },
      { name:"Vee",   symbol:"&", desc:"The regressive product. (JOIN)" },
      { name:"Dot",   symbol:"|", desc:"The inner product."},
      { name:"Add",   symbol:"+", desc:"Multivector addition" },
      { name:"Sub",   symbol:"-", desc:"Multivector subtraction" },
      { name:"smul",  symbol:"*", classname_a:"float", desc:"scalar/multivector multiplication" },
      { name:"muls",  symbol:"*", classname_b:"float", desc:"multivector/scalar multiplication" },
      { name:"sadd",  symbol:"+", classname_a:"float", desc:"scalar/multivector addition" },
      { name:"adds",  symbol:"+", classname_b:"float", desc:"multivector/scalar addition" },
      { name:"ssub",  symbol:"-", classname_a:"float", desc:"scalar/multivector subtraction" },
      { name:"subs",  symbol:"-", classname_b:"float", desc:"multivector/scalar subtraction" },
    ];

// The unary operators we support
var unops = [
      { name:"Reverse",   symbol:"~", desc:"Reverse the order of the basis blades." },
      { name:"Dual",      symbol:"!", desc:"Poincare duality operator." },
      { name:"Conjugate", desc:"Clifford Conjugation" },
      { name:"Involute",  desc:"Main involution" }
    ];

var should_generate_lang = (lang) => {
  return !process.env.GEN_LANG || (process.env.GEN_LANG && process.env.GEN_LANG.includes(lang.name));
};

// now loop over templates and generate output ..
lang.filter(should_generate_lang).forEach(lang => {
  // Generate the code for the binary operators.
  var binops_code = binops.map(b=>lang.template.binary(
                      name, b.symbol, b.name,'a','b','res',
                      pga.prototype[b.name].toString()
                                           .replace(/\n\s*return .*\n.*/g,'')
                                           .replace(/^.*?\n.*?\n.*?\n/,'')
                                           .replace(/\n/g,"\n  ")
                                           .replace(/this/g,"a")
                                           .replace(/\-/g,(a)=>b.name=="Dual"?"":a),
                      b.classname_a, b.classname_b, b.desc 
                    ));    

  // Generate the code for the unary operators.
  var unops_code = unops.map(u=>lang.template.unary(
                      name, u.symbol, u.name,'a','res',
                      pga.inline((name)=>{
                        var x = new Element([...Array(2**(p+q+r)).keys()]);
                        x = (name=="Dual"&&r==1?[...x.reverse()]:[...x[name]]).map((x,i)=>(i?"  ":"")+'res['+i+']='+(x<0?"-a[":"a[")+Math.abs(x)+"];").join("\n");
                        return x;
                      })(u.name),
                      u.classname_a, u.desc
                   ));

  // Output the target source code to stdout
  if (!fs.existsSync(lang.name)) {
    fs.mkdirSync(lang.name);
  }
  
  var file_name = path.join(lang.name, `${name.toLowerCase()}.${lang.ext}`);
  fs.writeFileSync(file_name,[lang.template.preamble(basis,name),
               ...unops_code,
               ...binops_code,
               lang.template.postamble(basis,name,lang.template[name]&&lang.template[name](basis,name)||lang.template.GENERIC&&lang.template.GENERIC(basis,name)||{preamble:'',amble:''})
              ].join("\n\n"));
});              
  console.log('['+name.toUpperCase()+'] Generated '+lang.filter(should_generate_lang).map(x=>x.template.desc).join(', '));


