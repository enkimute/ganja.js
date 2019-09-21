// rust Template for the preamble
var preamble = (basis, classname) =>
`// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#![allow(unused_imports)]
#![allow(dead_code)]
#![allow(non_upper_case_globals)]
#![allow(non_snake_case)]
#![allow(non_camel_case_types)]
#![feature(const_slice_len)]

use std::fmt;
use std::ops::{Index,IndexMut,Add,Sub,Mul,BitAnd,BitOr,BitXor,Not};

type float_t = f64;

// use std::f64::consts::PI;
const PI: float_t = 3.14159265358979323846;

const basis: &'static [&'static str] = &[ ${basis.map(x=>'"'+x+'"').join(',')} ];
const basis_count: usize = basis.len();

#[derive(Default,Debug,Clone,PartialEq)]
struct ${classname} {
    mvec: Vec<float_t>
}

impl ${classname} {
    pub fn zero() -> Self {
        Self {
            mvec: vec![0.0; basis_count]
        }
    }

    pub fn new(f: float_t, idx: usize) -> Self {
        let mut ret = Self::zero();
        ret.mvec[idx] = f;
        ret
    }

    // basis vectors are available as methods
${basis.slice(1).map((x,i)=>`    pub fn ${x}() -> Self { ${classname}::new(1.0, ${i+1}) }`).join('\n')}
}

impl Index<usize> for ${classname} {
    type Output = float_t;

    fn index<'a>(&'a self, index: usize) -> &'a Self::Output {
        &self.mvec[index]
    }
}

impl IndexMut<usize> for ${classname} {
    fn index_mut<'a>(&'a mut self, index: usize) -> &'a mut Self::Output {
        &mut self.mvec[index]
    }
}

impl fmt::Display for ${classname} {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut n = 0;
        let ret = self.mvec.iter().enumerate().filter_map(|(i, &coeff)| {
            if coeff > 0.00001 || coeff < -0.00001 {
                n = 1;
                Some(format!("{}{}", 
                        format!("{:.*}", 7, coeff).trim_end_matches('0').trim_end_matches('.'),
                        if i > 0 { basis[i] } else { "" }
                    )
                )
            } else {
                None
            }
        }).collect::<Vec<String>>().join(" + ");
        if n==0 { write!(f,"0") } else { write!(f, "{}", ret) }
    }
}

macro_rules! define_binary_op(
    (
        // Operator, operator method, and scalar bounds.
        $Op: ident, $op: ident;
        // Argument identifiers and types + output.
        $lhs: ident: $Lhs: ty, $rhs: ident: $Rhs: ty, Output = $Result: ty;
        // Operator actual implementation.
        $action: expr;
        // Lifetime.
        $($lives: tt),*
    ) => {
       impl<$($lives ,)*> $Op<$Rhs> for $Lhs {
           type Output = $Result;

           #[inline]
           fn $op($lhs, $rhs: $Rhs) -> Self::Output {
               $action
           }
       }
    }
);

macro_rules! define_binary_op_all(
    (
        // Operator, operator method, and scalar bounds.
        $Op: ident, $op: ident;
        // Argument identifiers and types + output.
        $lhs: ident: $Lhs: ty, $rhs: ident: $Rhs: ty, Output = $Result: ty;
        // Operators actual implementations.
        [val val] => $action_val_val: expr;
        [ref val] => $action_ref_val: expr;
        [val ref] => $action_val_ref: expr;
        [ref ref] => $action_ref_ref: expr;
    ) => {
        define_binary_op!(
            $Op, $op;
            $lhs: $Lhs, $rhs: $Rhs, Output = $Result;
            $action_val_val;
        );

        define_binary_op!(
            $Op, $op;
            $lhs: &'a $Lhs, $rhs: $Rhs, Output = $Result;
            $action_ref_val;
            'a
        );

        define_binary_op!(
            $Op, $op;
            $lhs: $Lhs, $rhs: &'b $Rhs, Output = $Result;
            $action_val_ref;
            'b
        );

        define_binary_op!(
            $Op, $op;
            $lhs: &'a $Lhs, $rhs: &'b $Rhs, Output = $Result;
            $action_ref_ref;
            'a, 'b
        );
    }
);

// TODO define_unary_op

`;

// rust Template for our binary operators

var binary = (classname, symbol, name, name_a, name_b, name_ret, code, classname_a = classname, classname_b = classname, desc) => {

  let body = ``;

  if (symbol) {

    if (name.match(/^s[^u]/)) {
body = `
define_binary_op_all!(
    ${{ "+": "Add", "*": "Mul", "-": "Sub" }[symbol] || name},
    ${{ "+": "add", "*": "mul", "-": "sub" }[symbol] || name};
    self: float_t, b: ${classname}, Output = ${classname};
    [val val] => &self ${symbol} &b;
    [ref val] =>  self ${symbol} &b;
    [val ref] => &self ${symbol}  b;
    [ref ref] => {
        let mut ${name_ret} = ${classname}::zero();
        let ${name_a} = self;
        ${code.replace(/^ */g, '').replace(/\n */g, '\n        ')}
        ${name_ret}
    };
);
`;
    } else if (name.match(/s$/)) {
    body = `
define_binary_op_all!(
    ${{ "+": "Add", "*": "Mul", "-": "Sub" }[symbol] || name},
    ${{ "+": "add", "*": "mul", "-": "sub" }[symbol] || name};
    self: ${classname}, b: float_t, Output = ${classname};
    [val val] => &self ${symbol} &b;
    [ref val] =>  self ${symbol} &b;
    [val ref] => &self ${symbol}  b;
    [ref ref] => {
        let mut ${name_ret} = ${classname}::zero();
        let ${name_a} = self;
        ${code.replace(/^ */g, '').replace(/\n */g, '\n        ')}
        ${name_ret}
    };
);
`;
    } else {
      body = `
define_binary_op_all!(
    ${{ "+": "Add", "*": "Mul", "^": "BitXor", "&": "BitAnd", "|": "BitOr" }[symbol] || name},
    ${{ "+": "add", "-": "sub", "*": "mul", "^": "bitxor", "&": "bitand", "|": "bitor" }[symbol] || name};
    self: ${classname}, b: ${classname}, Output = ${classname};
    [val val] => &self ${symbol} &b;
    [ref val] =>  self ${symbol} &b;
    [val ref] => &self ${symbol}  b;
    [ref ref] => {
        let mut ${name_ret} = ${classname}::zero();
        let ${name_a} = self;
        ${code.replace(/^ */g, '').replace(/\n */g, '\n		')}
        ${name_ret}
    };
);
`;
    }
  } else {
    // no binary named function yet
    body = ``;
    }

  return `// ${name}
// ${desc}
${body}`;
};

// rust Template for our unary operators
var unary = (classname, symbol, name, name_a, name_ret, code, classname_a = classname, desc) => {
  let body = `impl ${classname} {
    pub fn ${name}(self: & Self) -> ${classname} {
        let mut ${name_ret} = ${classname}::zero();
        let ${name_a} = self;
        ${code.replace(/^ */g, '').replace(/\n */g, '\n        ')}
        ${name_ret}
    }
}`;

  if (symbol == `!`) {
    body = `${body}

impl ${{ "!": "Not" }[symbol] || name} for & ${classname} {
    type Output = ${classname};

    fn ${{ "!": "not" }[symbol] || name}(self: Self) -> ${classname} {
        let mut ${name_ret} = ${classname}::zero();
        let ${name_a} = self;
        ${code.replace(/^ */g, '').replace(/\n */g, '\n        ')}
        ${name_ret}
    }
}`;
  }

  return `// ${name}
// ${desc}
${body}`;
}

// rust template for CGA
var CGA = (basis,classname)=>({
preamble:`
  pub fn eo() -> Self { Self::e4() + Self::e5() }
  pub fn ei() -> Self { (Self::e5() - Self::e4())*0.5 }
  
  pub fn up(x: float_t, y: float_t, z: float_t) -> Self {
    x * Self::e1() + y * Self::e2() + z * Self::e3() + 0.5 * (x * x + y * y + z * z) * Self::ei() + Self::eo()
  }
`,
amble:`
    let px = &${classname}::up(1.0,2.0,3.0);
    let line = px ^ ${classname}::eo() ^ ${classname}::ei();
    let sphere = (${classname}::eo() - ${classname}::ei()).Dual();
    println!("a point       : {}", px);
    println!("a line        : {}", line);
    println!("a sphere      : {}", sphere);
  
`
})

// rust template for algebras without examples
var GENERIC = (basis,classname)=>({
preamble:``,
amble:`
  println!("${basis[1]}*${basis[1]}         : {}", ${classname}::${basis[1]}() * ${classname}::${basis[1]}());
  println!("pss           : {}", ${classname}::${basis[basis.length-1]}());
  println!("pss*pss       : {}", ${classname}::${basis[basis.length-1]}() * ${classname}::${basis[basis.length-1]}());
`
})

// rust template for PGA
var PGA3D = (basis,classname)=>({
preamble:`
    // A rotor (Euclidean line) and translator (Ideal line)
    pub fn rotor(angle: float_t, line: & Self) -> Self {
        (angle / 2.0).cos() + (angle / 2.0).sin() * line.normalized()
    }

    pub fn translator(dist: float_t, line: & Self) -> Self {
        1.0 + dist / 2.0 * line
    }

    // A plane is defined using its homogenous equation ax + by + cz + d = 0
    pub fn plane(a: float_t, b: float_t, c: float_t, d: float_t) -> Self {
        a * Self::e1() + b * Self::e2() + c * Self::e3() + d * Self::e0()
    }

    // A point is just a homogeneous point, euclidean coordinates plus the origin
    pub fn point(x: float_t, y: float_t, z:float_t) -> Self {
         Self::e123() + x * Self::e032() + y * Self::e013() + z * Self::e021()
    }

    // for our toy problem (generate points on the surface of a torus)
    // we start with a function that generates motors.
    // circle(t) with t going from 0 to 1.
    pub fn circle(t: float_t, radius: float_t, line: & Self) -> Self {
        Self::rotor(t * 2.0 * PI, line) * Self::translator(radius, &(Self::e1() * Self::e0()))
    }

    // a torus is now the product of two circles.
    pub fn torus(s: float_t, t: float_t, r1: float_t, l1: & Self, r2: float_t, l2: & Self) -> Self {
        Self::circle(s, r2, l2) * Self::circle(t, r1, l1)
    }

    // and to sample its points we simply sandwich the origin ..
    pub fn point_on_torus(s: float_t, t: float_t) -> Self {
        let to = &Self::torus(s, t, 0.25, &Self::e12(), 0.6, &Self::e31());

        to * Self::e123() * to.Reverse()
    }

`,
amble:`
    // Elements of the even subalgebra (scalar + bivector + pss) of unit length are motors
    let rot = &${classname}::rotor(PI / 2.0, &(${classname}::e1() * ${classname}::e2()));

    // The outer product ^ is the MEET. Here we intersect the yz (x=0) and xz (y=0) planes.
    let ax_z = &(${classname}::e1() ^ ${classname}::e2());
    
    // line and plane meet in point. We intersect the line along the z-axis (x=0,y=0) with the xy (z=0) plane.
    let orig = &(ax_z ^ ${classname}::e3());
    
    // We can also easily create points and join them into a line using the regressive (vee, &) product.
    let px = &${classname}::point(1.0, 0.0, 0.0);
    let line = &(orig & px);
    
    // Lets also create the plane with equation 2x + z - 3 = 0
    let p = &${classname}::plane(2.0, 0.0, 1.0, -3.0);
    
    // rotations work on all elements
    let rotated_plane = rot * p * rot.Reverse();
    let rotated_line  = rot * line * rot.Reverse();
    let rotated_point = rot * px * rot.Reverse();
    
    // See the 3D PGA Cheat sheet for a huge collection of useful formulas
    let point_on_plane = &((p | px) * p);

    // Some output
    println!("a point       : {}", px);
    println!("a line        : {}", line);
    println!("a plane       : {}", p);
    println!("a rotor       : {}", rot);
    println!("rotated line  : {}", rotated_line);
    println!("rotated point : {}", rotated_point);
    println!("rotated plane : {}", rotated_plane);
    println!("point on plane: {}", point_on_plane.normalized());
    println!("point on torus: {}", ${classname}::point_on_torus(0.0, 0.0));
    println!("{}", ${classname}::e0()-1.0);
    println!("{}", 1.0-${classname}::e0());
`});

// rust Template for the postamble
var postamble = (basis,classname,example) =>
  `impl ${classname} {
    pub fn norm(self: & Self) -> float_t {
        let scalar_part = (self * self.Conjugate())[0];

        scalar_part.abs().sqrt()
    }

    pub fn inorm(self: & Self) -> float_t {
        self.Dual().norm()
    }

    pub fn normalized(self: & Self) -> Self {
        self * (1.0 / self.norm())
    }
    
    ${example.preamble}

}


fn main() {
${example.amble}
}`;

Object.assign(exports,{preamble,postamble,unary,binary,desc:"rust",PGA3D,CGA,GENERIC});
