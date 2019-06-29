// 3D Projective Geometric Algebra
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

const basis: &'static [&'static str] = &[ "1","e1" ];
const basis_count: usize = basis.len();

#[derive(Default,Debug,Clone,Copy,PartialEq)]
struct HYPERBOLIC {
    mvec: [float_t; basis_count]
}

impl HYPERBOLIC {
    pub const fn zero() -> Self {
        Self {
            mvec: [0.0; basis_count]
        }
    }

    pub const fn new(f: float_t, idx: usize) -> Self {
        let mut ret = Self::zero();
        ret.mvec[idx] = f;
        ret
    }
}

// basis vectors are available as global constants.
const e1: HYPERBOLIC = HYPERBOLIC::new(1.0, 1);

impl Index<usize> for HYPERBOLIC {
    type Output = float_t;

    fn index<'a>(&'a self, index: usize) -> &'a Self::Output {
        &self.mvec[index]
    }
}

impl IndexMut<usize> for HYPERBOLIC {
    fn index_mut<'a>(&'a mut self, index: usize) -> &'a mut Self::Output {
        &mut self.mvec[index]
    }
}

impl fmt::Display for HYPERBOLIC {
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

// Reverse
// Reverse the order of the basis blades.
impl HYPERBOLIC {
    pub fn Reverse(self: Self) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=a[0];
        res[1]=a[1];
        res
    }
}

// Dual
// Poincare duality operator.
impl HYPERBOLIC {
    pub fn Dual(self: Self) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=a[1];
        res[1]=a[0];
        res
    }
}

impl Not for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn not(self: Self) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=a[1];
        res[1]=a[0];
        res
    }
}

// Conjugate
// Clifford Conjugation
impl HYPERBOLIC {
    pub fn Conjugate(self: Self) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res
    }
}

// Involute
// Main involution
impl HYPERBOLIC {
    pub fn Involute(self: Self) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res
    }
}

// Mul
// The geometric product.
impl Mul for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn mul(self: HYPERBOLIC, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[1]*a[1];
		res[1]=b[1]*a[0]+b[0]*a[1];
        res
    }
}

// Wedge
// The outer product. (MEET)
impl BitXor for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn bitxor(self: HYPERBOLIC, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=b[0]*a[0];
		res[1]=b[1]*a[0]+b[0]*a[1];
        res
    }
}

// Vee
// The regressive product. (JOIN)
impl BitAnd for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn bitand(self: HYPERBOLIC, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[1]=b[1]*a[1];
		res[0]=b[0]*a[1]+b[1]*a[0];
        res
    }
}

// Dot
// The inner product.
impl BitOr for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn bitor(self: HYPERBOLIC, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[1]*a[1];
		res[1]=b[1]*a[0]+b[0]*a[1];
        res
    }
}

// Add
// Multivector addition
impl Add for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn add(self: HYPERBOLIC, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0] = a[0]+b[0];
		res[1] = a[1]+b[1];
        res
    }
}

// Sub
// Multivector subtraction
impl Sub for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn sub(self: HYPERBOLIC, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0] = a[0]-b[0];
		res[1] = a[1]-b[1];
        res
    }
}

// smul
// scalar/multivector multiplication
impl Mul<HYPERBOLIC> for float_t {
    type Output = HYPERBOLIC;

    fn mul(self: float_t, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0] = a*b[0];
        res[1] = a*b[1];
        res
    }
}

// muls
// multivector/scalar multiplication
impl Mul<float_t> for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn mul(self: HYPERBOLIC, b: float_t) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0] = a[0]*b;
        res[1] = a[1]*b;
        res
    }
    }

// sadd
// scalar/multivector addition
impl Add<HYPERBOLIC> for float_t {
    type Output = HYPERBOLIC;

    fn add(self: float_t, b: HYPERBOLIC) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0] = a+b[0];
        res[1] = b[1];
        res
    }
}

// adds
// multivector/scalar addition
impl Add<float_t> for HYPERBOLIC {
    type Output = HYPERBOLIC;

    fn add(self: HYPERBOLIC, b: float_t) -> HYPERBOLIC {
        let mut res = HYPERBOLIC::zero();
        let a = self;
        res[0] = a[0]+b;
        res[1] = a[1];
        res
    }
    }

impl HYPERBOLIC {
    pub fn norm(self: Self) -> float_t {
        let scalar_part = (self * self.Conjugate())[0];

        scalar_part.abs().sqrt()
    }

    pub fn inorm(self: Self) -> float_t {
        self.Dual().norm()
    }

    pub fn normalized(self: Self) -> Self {
        self * (1.0 / self.norm())
    }
    
    

}


fn main() {

  println!("e1*e1         : {}", e1 * e1);
  println!("pss           : {}", e1);
  println!("pss*pss       : {}", e1*e1);

}