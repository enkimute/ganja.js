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

const basis: &'static [&'static str] = &[ "1","e1","e2","e3","e12","e13","e23","e123" ];
const basis_count: usize = basis.len();

#[derive(Default,Debug,Clone,Copy,PartialEq)]
struct R3 {
    mvec: [float_t; basis_count]
}

impl R3 {
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
const e1: R3 = R3::new(1.0, 1);
const e2: R3 = R3::new(1.0, 2);
const e3: R3 = R3::new(1.0, 3);
const e12: R3 = R3::new(1.0, 4);
const e13: R3 = R3::new(1.0, 5);
const e23: R3 = R3::new(1.0, 6);
const e123: R3 = R3::new(1.0, 7);

impl Index<usize> for R3 {
    type Output = float_t;

    fn index<'a>(&'a self, index: usize) -> &'a Self::Output {
        &self.mvec[index]
    }
}

impl IndexMut<usize> for R3 {
    fn index_mut<'a>(&'a mut self, index: usize) -> &'a mut Self::Output {
        &mut self.mvec[index]
    }
}

impl fmt::Display for R3 {
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
impl R3 {
    pub fn Reverse(self: Self) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=a[0];
        res[1]=a[1];
        res[2]=a[2];
        res[3]=a[3];
        res[4]=-a[4];
        res[5]=-a[5];
        res[6]=-a[6];
        res[7]=-a[7];
        res
    }
}

// Dual
// Poincare duality operator.
impl R3 {
    pub fn Dual(self: Self) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=-a[7];
        res[1]=-a[6];
        res[2]=a[5];
        res[3]=-a[4];
        res[4]=a[3];
        res[5]=-a[2];
        res[6]=a[1];
        res[7]=a[0];
        res
    }
}

impl Not for R3 {
    type Output = R3;

    fn not(self: Self) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=-a[7];
        res[1]=-a[6];
        res[2]=a[5];
        res[3]=-a[4];
        res[4]=a[3];
        res[5]=-a[2];
        res[6]=a[1];
        res[7]=a[0];
        res
    }
}

// Conjugate
// Clifford Conjugation
impl R3 {
    pub fn Conjugate(self: Self) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res[2]=-a[2];
        res[3]=-a[3];
        res[4]=-a[4];
        res[5]=-a[5];
        res[6]=-a[6];
        res[7]=a[7];
        res
    }
}

// Involute
// Main involution
impl R3 {
    pub fn Involute(self: Self) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res[2]=-a[2];
        res[3]=-a[3];
        res[4]=a[4];
        res[5]=a[5];
        res[6]=a[6];
        res[7]=-a[7];
        res
    }
}

// Mul
// The geometric product.
impl Mul for R3 {
    type Output = R3;

    fn mul(self: R3, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]-b[7]*a[7];
		res[1]=b[1]*a[0]+b[0]*a[1]-b[4]*a[2]-b[5]*a[3]+b[2]*a[4]+b[3]*a[5]-b[7]*a[6]-b[6]*a[7];
		res[2]=b[2]*a[0]+b[4]*a[1]+b[0]*a[2]-b[6]*a[3]-b[1]*a[4]+b[7]*a[5]+b[3]*a[6]+b[5]*a[7];
		res[3]=b[3]*a[0]+b[5]*a[1]+b[6]*a[2]+b[0]*a[3]-b[7]*a[4]-b[1]*a[5]-b[2]*a[6]-b[4]*a[7];
		res[4]=b[4]*a[0]+b[2]*a[1]-b[1]*a[2]+b[7]*a[3]+b[0]*a[4]-b[6]*a[5]+b[5]*a[6]+b[3]*a[7];
		res[5]=b[5]*a[0]+b[3]*a[1]-b[7]*a[2]-b[1]*a[3]+b[6]*a[4]+b[0]*a[5]-b[4]*a[6]-b[2]*a[7];
		res[6]=b[6]*a[0]+b[7]*a[1]+b[3]*a[2]-b[2]*a[3]-b[5]*a[4]+b[4]*a[5]+b[0]*a[6]+b[1]*a[7];
		res[7]=b[7]*a[0]+b[6]*a[1]-b[5]*a[2]+b[4]*a[3]+b[3]*a[4]-b[2]*a[5]+b[1]*a[6]+b[0]*a[7];
        res
    }
}

// Wedge
// The outer product. (MEET)
impl BitXor for R3 {
    type Output = R3;

    fn bitxor(self: R3, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=b[0]*a[0];
		res[1]=b[1]*a[0]+b[0]*a[1];
		res[2]=b[2]*a[0]+b[0]*a[2];
		res[3]=b[3]*a[0]+b[0]*a[3];
		res[4]=b[4]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[4];
		res[5]=b[5]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[5];
		res[6]=b[6]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[6];
		res[7]=b[7]*a[0]+b[6]*a[1]-b[5]*a[2]+b[4]*a[3]+b[3]*a[4]-b[2]*a[5]+b[1]*a[6]+b[0]*a[7];
        res
    }
}

// Vee
// The regressive product. (JOIN)
impl BitAnd for R3 {
    type Output = R3;

    fn bitand(self: R3, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[7]=b[7]*a[7];
		res[6]=b[6]*a[7]+b[7]*a[6];
		res[5]=b[5]*a[7]+b[7]*a[5];
		res[4]=b[4]*a[7]+b[7]*a[4];
		res[3]=b[3]*a[7]+b[5]*a[6]-b[6]*a[5]+b[7]*a[3];
		res[2]=b[2]*a[7]+b[4]*a[6]-b[6]*a[4]+b[7]*a[2];
		res[1]=b[1]*a[7]+b[4]*a[5]-b[5]*a[4]+b[7]*a[1];
		res[0]=b[0]*a[7]+b[1]*a[6]-b[2]*a[5]+b[3]*a[4]+b[4]*a[3]-b[5]*a[2]+b[6]*a[1]+b[7]*a[0];
        res
    }
}

// Dot
// The inner product.
impl BitOr for R3 {
    type Output = R3;

    fn bitor(self: R3, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]-b[7]*a[7];
		res[1]=b[1]*a[0]+b[0]*a[1]-b[4]*a[2]-b[5]*a[3]+b[2]*a[4]+b[3]*a[5]-b[7]*a[6]-b[6]*a[7];
		res[2]=b[2]*a[0]+b[4]*a[1]+b[0]*a[2]-b[6]*a[3]-b[1]*a[4]+b[7]*a[5]+b[3]*a[6]+b[5]*a[7];
		res[3]=b[3]*a[0]+b[5]*a[1]+b[6]*a[2]+b[0]*a[3]-b[7]*a[4]-b[1]*a[5]-b[2]*a[6]-b[4]*a[7];
		res[4]=b[4]*a[0]+b[7]*a[3]+b[0]*a[4]+b[3]*a[7];
		res[5]=b[5]*a[0]-b[7]*a[2]+b[0]*a[5]-b[2]*a[7];
		res[6]=b[6]*a[0]+b[7]*a[1]+b[0]*a[6]+b[1]*a[7];
		res[7]=b[7]*a[0]+b[0]*a[7];
        res
    }
}

// Add
// Multivector addition
impl Add for R3 {
    type Output = R3;

    fn add(self: R3, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0] = a[0]+b[0];
		res[1] = a[1]+b[1];
		res[2] = a[2]+b[2];
		res[3] = a[3]+b[3];
		res[4] = a[4]+b[4];
		res[5] = a[5]+b[5];
		res[6] = a[6]+b[6];
		res[7] = a[7]+b[7];
        res
    }
}

// Sub
// Multivector subtraction
impl Sub for R3 {
    type Output = R3;

    fn sub(self: R3, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0] = a[0]-b[0];
		res[1] = a[1]-b[1];
		res[2] = a[2]-b[2];
		res[3] = a[3]-b[3];
		res[4] = a[4]-b[4];
		res[5] = a[5]-b[5];
		res[6] = a[6]-b[6];
		res[7] = a[7]-b[7];
        res
    }
}

// smul
// scalar/multivector multiplication
impl Mul<R3> for float_t {
    type Output = R3;

    fn mul(self: float_t, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0] = a*b[0];
        res[1] = a*b[1];
        res[2] = a*b[2];
        res[3] = a*b[3];
        res[4] = a*b[4];
        res[5] = a*b[5];
        res[6] = a*b[6];
        res[7] = a*b[7];
        res
    }
}

// muls
// multivector/scalar multiplication
impl Mul<float_t> for R3 {
    type Output = R3;

    fn mul(self: R3, b: float_t) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0] = a[0]*b;
        res[1] = a[1]*b;
        res[2] = a[2]*b;
        res[3] = a[3]*b;
        res[4] = a[4]*b;
        res[5] = a[5]*b;
        res[6] = a[6]*b;
        res[7] = a[7]*b;
        res
    }
    }

// sadd
// scalar/multivector addition
impl Add<R3> for float_t {
    type Output = R3;

    fn add(self: float_t, b: R3) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0] = a+b[0];
        res[1] = b[1];
        res[2] = b[2];
        res[3] = b[3];
        res[4] = b[4];
        res[5] = b[5];
        res[6] = b[6];
        res[7] = b[7];
        res
    }
}

// adds
// multivector/scalar addition
impl Add<float_t> for R3 {
    type Output = R3;

    fn add(self: R3, b: float_t) -> R3 {
        let mut res = R3::zero();
        let a = self;
        res[0] = a[0]+b;
        res[1] = a[1];
        res[2] = a[2];
        res[3] = a[3];
        res[4] = a[4];
        res[5] = a[5];
        res[6] = a[6];
        res[7] = a[7];
        res
    }
    }

impl R3 {
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
  println!("pss           : {}", e123);
  println!("pss*pss       : {}", e123*e123);

}