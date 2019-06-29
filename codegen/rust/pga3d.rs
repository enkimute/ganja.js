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

const basis: &'static [&'static str] = &[ "1","e0","e1","e2","e3","e01","e02","e03","e12","e31","e23","e021","e013","e032","e123","e0123" ];
const basis_count: usize = basis.len();

#[derive(Default,Debug,Clone,Copy,PartialEq)]
struct PGA3D {
    mvec: [float_t; basis_count]
}

impl PGA3D {
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
const e0: PGA3D = PGA3D::new(1.0, 1);
const e1: PGA3D = PGA3D::new(1.0, 2);
const e2: PGA3D = PGA3D::new(1.0, 3);
const e3: PGA3D = PGA3D::new(1.0, 4);
const e01: PGA3D = PGA3D::new(1.0, 5);
const e02: PGA3D = PGA3D::new(1.0, 6);
const e03: PGA3D = PGA3D::new(1.0, 7);
const e12: PGA3D = PGA3D::new(1.0, 8);
const e31: PGA3D = PGA3D::new(1.0, 9);
const e23: PGA3D = PGA3D::new(1.0, 10);
const e021: PGA3D = PGA3D::new(1.0, 11);
const e013: PGA3D = PGA3D::new(1.0, 12);
const e032: PGA3D = PGA3D::new(1.0, 13);
const e123: PGA3D = PGA3D::new(1.0, 14);
const e0123: PGA3D = PGA3D::new(1.0, 15);

impl Index<usize> for PGA3D {
    type Output = float_t;

    fn index<'a>(&'a self, index: usize) -> &'a Self::Output {
        &self.mvec[index]
    }
}

impl IndexMut<usize> for PGA3D {
    fn index_mut<'a>(&'a mut self, index: usize) -> &'a mut Self::Output {
        &mut self.mvec[index]
    }
}

impl fmt::Display for PGA3D {
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
impl PGA3D {
    pub fn Reverse(self: Self) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=a[0];
        res[1]=a[1];
        res[2]=a[2];
        res[3]=a[3];
        res[4]=a[4];
        res[5]=-a[5];
        res[6]=-a[6];
        res[7]=-a[7];
        res[8]=-a[8];
        res[9]=-a[9];
        res[10]=-a[10];
        res[11]=-a[11];
        res[12]=-a[12];
        res[13]=-a[13];
        res[14]=-a[14];
        res[15]=a[15];
        res
    }
}

// Dual
// Poincare duality operator.
impl PGA3D {
    pub fn Dual(self: Self) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=a[15];
        res[1]=a[14];
        res[2]=a[13];
        res[3]=a[12];
        res[4]=a[11];
        res[5]=a[10];
        res[6]=a[9];
        res[7]=a[8];
        res[8]=a[7];
        res[9]=a[6];
        res[10]=a[5];
        res[11]=a[4];
        res[12]=a[3];
        res[13]=a[2];
        res[14]=a[1];
        res[15]=a[0];
        res
    }
}

impl Not for PGA3D {
    type Output = PGA3D;

    fn not(self: Self) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=a[15];
        res[1]=a[14];
        res[2]=a[13];
        res[3]=a[12];
        res[4]=a[11];
        res[5]=a[10];
        res[6]=a[9];
        res[7]=a[8];
        res[8]=a[7];
        res[9]=a[6];
        res[10]=a[5];
        res[11]=a[4];
        res[12]=a[3];
        res[13]=a[2];
        res[14]=a[1];
        res[15]=a[0];
        res
    }
}

// Conjugate
// Clifford Conjugation
impl PGA3D {
    pub fn Conjugate(self: Self) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res[2]=-a[2];
        res[3]=-a[3];
        res[4]=-a[4];
        res[5]=-a[5];
        res[6]=-a[6];
        res[7]=-a[7];
        res[8]=-a[8];
        res[9]=-a[9];
        res[10]=-a[10];
        res[11]=a[11];
        res[12]=a[12];
        res[13]=a[13];
        res[14]=a[14];
        res[15]=a[15];
        res
    }
}

// Involute
// Main involution
impl PGA3D {
    pub fn Involute(self: Self) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res[2]=-a[2];
        res[3]=-a[3];
        res[4]=-a[4];
        res[5]=a[5];
        res[6]=a[6];
        res[7]=a[7];
        res[8]=a[8];
        res[9]=a[9];
        res[10]=a[10];
        res[11]=-a[11];
        res[12]=-a[12];
        res[13]=-a[13];
        res[14]=-a[14];
        res[15]=a[15];
        res
    }
}

// Mul
// The geometric product.
impl Mul for PGA3D {
    type Output = PGA3D;

    fn mul(self: PGA3D, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[2]*a[2]+b[3]*a[3]+b[4]*a[4]-b[8]*a[8]-b[9]*a[9]-b[10]*a[10]-b[14]*a[14];
		res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]-b[7]*a[4]+b[2]*a[5]+b[3]*a[6]+b[4]*a[7]+b[11]*a[8]+b[12]*a[9]+b[13]*a[10]+b[8]*a[11]+b[9]*a[12]+b[10]*a[13]+b[15]*a[14]-b[14]*a[15];
		res[2]=b[2]*a[0]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]+b[3]*a[8]-b[4]*a[9]-b[14]*a[10]-b[10]*a[14];
		res[3]=b[3]*a[0]+b[8]*a[2]+b[0]*a[3]-b[10]*a[4]-b[2]*a[8]-b[14]*a[9]+b[4]*a[10]-b[9]*a[14];
		res[4]=b[4]*a[0]-b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[14]*a[8]+b[2]*a[9]-b[3]*a[10]-b[8]*a[14];
		res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]-b[11]*a[3]+b[12]*a[4]+b[0]*a[5]-b[8]*a[6]+b[9]*a[7]+b[6]*a[8]-b[7]*a[9]-b[15]*a[10]-b[3]*a[11]+b[4]*a[12]+b[14]*a[13]-b[13]*a[14]-b[10]*a[15];
		res[6]=b[6]*a[0]+b[3]*a[1]+b[11]*a[2]-b[1]*a[3]-b[13]*a[4]+b[8]*a[5]+b[0]*a[6]-b[10]*a[7]-b[5]*a[8]-b[15]*a[9]+b[7]*a[10]+b[2]*a[11]+b[14]*a[12]-b[4]*a[13]-b[12]*a[14]-b[9]*a[15];
		res[7]=b[7]*a[0]+b[4]*a[1]-b[12]*a[2]+b[13]*a[3]-b[1]*a[4]-b[9]*a[5]+b[10]*a[6]+b[0]*a[7]-b[15]*a[8]+b[5]*a[9]-b[6]*a[10]+b[14]*a[11]-b[2]*a[12]+b[3]*a[13]-b[11]*a[14]-b[8]*a[15];
		res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[14]*a[4]+b[0]*a[8]+b[10]*a[9]-b[9]*a[10]+b[4]*a[14];
		res[9]=b[9]*a[0]-b[4]*a[2]+b[14]*a[3]+b[2]*a[4]-b[10]*a[8]+b[0]*a[9]+b[8]*a[10]+b[3]*a[14];
		res[10]=b[10]*a[0]+b[14]*a[2]+b[4]*a[3]-b[3]*a[4]+b[9]*a[8]-b[8]*a[9]+b[0]*a[10]+b[2]*a[14];
		res[11]=b[11]*a[0]-b[8]*a[1]+b[6]*a[2]-b[5]*a[3]+b[15]*a[4]-b[3]*a[5]+b[2]*a[6]-b[14]*a[7]-b[1]*a[8]+b[13]*a[9]-b[12]*a[10]+b[0]*a[11]+b[10]*a[12]-b[9]*a[13]+b[7]*a[14]-b[4]*a[15];
		res[12]=b[12]*a[0]-b[9]*a[1]-b[7]*a[2]+b[15]*a[3]+b[5]*a[4]+b[4]*a[5]-b[14]*a[6]-b[2]*a[7]-b[13]*a[8]-b[1]*a[9]+b[11]*a[10]-b[10]*a[11]+b[0]*a[12]+b[8]*a[13]+b[6]*a[14]-b[3]*a[15];
		res[13]=b[13]*a[0]-b[10]*a[1]+b[15]*a[2]+b[7]*a[3]-b[6]*a[4]-b[14]*a[5]-b[4]*a[6]+b[3]*a[7]+b[12]*a[8]-b[11]*a[9]-b[1]*a[10]+b[9]*a[11]-b[8]*a[12]+b[0]*a[13]+b[5]*a[14]-b[2]*a[15];
		res[14]=b[14]*a[0]+b[10]*a[2]+b[9]*a[3]+b[8]*a[4]+b[4]*a[8]+b[3]*a[9]+b[2]*a[10]+b[0]*a[14];
		res[15]=b[15]*a[0]+b[14]*a[1]+b[13]*a[2]+b[12]*a[3]+b[11]*a[4]+b[10]*a[5]+b[9]*a[6]+b[8]*a[7]+b[7]*a[8]+b[6]*a[9]+b[5]*a[10]-b[4]*a[11]-b[3]*a[12]-b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
        res
    }
}

// Wedge
// The outer product. (MEET)
impl BitXor for PGA3D {
    type Output = PGA3D;

    fn bitxor(self: PGA3D, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=b[0]*a[0];
		res[1]=b[1]*a[0]+b[0]*a[1];
		res[2]=b[2]*a[0]+b[0]*a[2];
		res[3]=b[3]*a[0]+b[0]*a[3];
		res[4]=b[4]*a[0]+b[0]*a[4];
		res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[5];
		res[6]=b[6]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[6];
		res[7]=b[7]*a[0]+b[4]*a[1]-b[1]*a[4]+b[0]*a[7];
		res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[8];
		res[9]=b[9]*a[0]-b[4]*a[2]+b[2]*a[4]+b[0]*a[9];
		res[10]=b[10]*a[0]+b[4]*a[3]-b[3]*a[4]+b[0]*a[10];
		res[11]=b[11]*a[0]-b[8]*a[1]+b[6]*a[2]-b[5]*a[3]-b[3]*a[5]+b[2]*a[6]-b[1]*a[8]+b[0]*a[11];
		res[12]=b[12]*a[0]-b[9]*a[1]-b[7]*a[2]+b[5]*a[4]+b[4]*a[5]-b[2]*a[7]-b[1]*a[9]+b[0]*a[12];
		res[13]=b[13]*a[0]-b[10]*a[1]+b[7]*a[3]-b[6]*a[4]-b[4]*a[6]+b[3]*a[7]-b[1]*a[10]+b[0]*a[13];
		res[14]=b[14]*a[0]+b[10]*a[2]+b[9]*a[3]+b[8]*a[4]+b[4]*a[8]+b[3]*a[9]+b[2]*a[10]+b[0]*a[14];
		res[15]=b[15]*a[0]+b[14]*a[1]+b[13]*a[2]+b[12]*a[3]+b[11]*a[4]+b[10]*a[5]+b[9]*a[6]+b[8]*a[7]+b[7]*a[8]+b[6]*a[9]+b[5]*a[10]-b[4]*a[11]-b[3]*a[12]-b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
        res
    }
}

// Vee
// The regressive product. (JOIN)
impl BitAnd for PGA3D {
    type Output = PGA3D;

    fn bitand(self: PGA3D, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[15]=b[15]*a[15];
		res[14]=b[14]*a[15]+b[15]*a[14];
		res[13]=b[13]*a[15]+b[15]*a[13];
		res[12]=b[12]*a[15]+b[15]*a[12];
		res[11]=b[11]*a[15]+b[15]*a[11];
		res[10]=b[10]*a[15]+b[13]*a[14]-b[14]*a[13]+b[15]*a[10];
		res[9]=b[9]*a[15]+b[12]*a[14]-b[14]*a[12]+b[15]*a[9];
		res[8]=b[8]*a[15]+b[11]*a[14]-b[14]*a[11]+b[15]*a[8];
		res[7]=b[7]*a[15]+b[12]*a[13]-b[13]*a[12]+b[15]*a[7];
		res[6]=b[6]*a[15]-b[11]*a[13]+b[13]*a[11]+b[15]*a[6];
		res[5]=b[5]*a[15]+b[11]*a[12]-b[12]*a[11]+b[15]*a[5];
		res[4]=b[4]*a[15]-b[7]*a[14]+b[9]*a[13]-b[10]*a[12]-b[12]*a[10]+b[13]*a[9]-b[14]*a[7]+b[15]*a[4];
		res[3]=b[3]*a[15]-b[6]*a[14]-b[8]*a[13]+b[10]*a[11]+b[11]*a[10]-b[13]*a[8]-b[14]*a[6]+b[15]*a[3];
		res[2]=b[2]*a[15]-b[5]*a[14]+b[8]*a[12]-b[9]*a[11]-b[11]*a[9]+b[12]*a[8]-b[14]*a[5]+b[15]*a[2];
		res[1]=b[1]*a[15]+b[5]*a[13]+b[6]*a[12]+b[7]*a[11]+b[11]*a[7]+b[12]*a[6]+b[13]*a[5]+b[15]*a[1];
		res[0]=b[0]*a[15]+b[1]*a[14]+b[2]*a[13]+b[3]*a[12]+b[4]*a[11]+b[5]*a[10]+b[6]*a[9]+b[7]*a[8]+b[8]*a[7]+b[9]*a[6]+b[10]*a[5]-b[11]*a[4]-b[12]*a[3]-b[13]*a[2]-b[14]*a[1]+b[15]*a[0];
        res
    }
}

// Dot
// The inner product.
impl BitOr for PGA3D {
    type Output = PGA3D;

    fn bitor(self: PGA3D, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[2]*a[2]+b[3]*a[3]+b[4]*a[4]-b[8]*a[8]-b[9]*a[9]-b[10]*a[10]-b[14]*a[14];
		res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]-b[7]*a[4]+b[2]*a[5]+b[3]*a[6]+b[4]*a[7]+b[11]*a[8]+b[12]*a[9]+b[13]*a[10]+b[8]*a[11]+b[9]*a[12]+b[10]*a[13]+b[15]*a[14]-b[14]*a[15];
		res[2]=b[2]*a[0]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]+b[3]*a[8]-b[4]*a[9]-b[14]*a[10]-b[10]*a[14];
		res[3]=b[3]*a[0]+b[8]*a[2]+b[0]*a[3]-b[10]*a[4]-b[2]*a[8]-b[14]*a[9]+b[4]*a[10]-b[9]*a[14];
		res[4]=b[4]*a[0]-b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[14]*a[8]+b[2]*a[9]-b[3]*a[10]-b[8]*a[14];
		res[5]=b[5]*a[0]-b[11]*a[3]+b[12]*a[4]+b[0]*a[5]-b[15]*a[10]-b[3]*a[11]+b[4]*a[12]-b[10]*a[15];
		res[6]=b[6]*a[0]+b[11]*a[2]-b[13]*a[4]+b[0]*a[6]-b[15]*a[9]+b[2]*a[11]-b[4]*a[13]-b[9]*a[15];
		res[7]=b[7]*a[0]-b[12]*a[2]+b[13]*a[3]+b[0]*a[7]-b[15]*a[8]-b[2]*a[12]+b[3]*a[13]-b[8]*a[15];
		res[8]=b[8]*a[0]+b[14]*a[4]+b[0]*a[8]+b[4]*a[14];
		res[9]=b[9]*a[0]+b[14]*a[3]+b[0]*a[9]+b[3]*a[14];
		res[10]=b[10]*a[0]+b[14]*a[2]+b[0]*a[10]+b[2]*a[14];
		res[11]=b[11]*a[0]+b[15]*a[4]+b[0]*a[11]-b[4]*a[15];
		res[12]=b[12]*a[0]+b[15]*a[3]+b[0]*a[12]-b[3]*a[15];
		res[13]=b[13]*a[0]+b[15]*a[2]+b[0]*a[13]-b[2]*a[15];
		res[14]=b[14]*a[0]+b[0]*a[14];
		res[15]=b[15]*a[0]+b[0]*a[15];
        res
    }
}

// Add
// Multivector addition
impl Add for PGA3D {
    type Output = PGA3D;

    fn add(self: PGA3D, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0] = a[0]+b[0];
		res[1] = a[1]+b[1];
		res[2] = a[2]+b[2];
		res[3] = a[3]+b[3];
		res[4] = a[4]+b[4];
		res[5] = a[5]+b[5];
		res[6] = a[6]+b[6];
		res[7] = a[7]+b[7];
		res[8] = a[8]+b[8];
		res[9] = a[9]+b[9];
		res[10] = a[10]+b[10];
		res[11] = a[11]+b[11];
		res[12] = a[12]+b[12];
		res[13] = a[13]+b[13];
		res[14] = a[14]+b[14];
		res[15] = a[15]+b[15];
        res
    }
}

// Sub
// Multivector subtraction
impl Sub for PGA3D {
    type Output = PGA3D;

    fn sub(self: PGA3D, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0] = a[0]-b[0];
		res[1] = a[1]-b[1];
		res[2] = a[2]-b[2];
		res[3] = a[3]-b[3];
		res[4] = a[4]-b[4];
		res[5] = a[5]-b[5];
		res[6] = a[6]-b[6];
		res[7] = a[7]-b[7];
		res[8] = a[8]-b[8];
		res[9] = a[9]-b[9];
		res[10] = a[10]-b[10];
		res[11] = a[11]-b[11];
		res[12] = a[12]-b[12];
		res[13] = a[13]-b[13];
		res[14] = a[14]-b[14];
		res[15] = a[15]-b[15];
        res
    }
}

// smul
// scalar/multivector multiplication
impl Mul<PGA3D> for float_t {
    type Output = PGA3D;

    fn mul(self: float_t, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0] = a*b[0];
        res[1] = a*b[1];
        res[2] = a*b[2];
        res[3] = a*b[3];
        res[4] = a*b[4];
        res[5] = a*b[5];
        res[6] = a*b[6];
        res[7] = a*b[7];
        res[8] = a*b[8];
        res[9] = a*b[9];
        res[10] = a*b[10];
        res[11] = a*b[11];
        res[12] = a*b[12];
        res[13] = a*b[13];
        res[14] = a*b[14];
        res[15] = a*b[15];
        res
    }
}

// muls
// multivector/scalar multiplication
impl Mul<float_t> for PGA3D {
    type Output = PGA3D;

    fn mul(self: PGA3D, b: float_t) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0] = a[0]*b;
        res[1] = a[1]*b;
        res[2] = a[2]*b;
        res[3] = a[3]*b;
        res[4] = a[4]*b;
        res[5] = a[5]*b;
        res[6] = a[6]*b;
        res[7] = a[7]*b;
        res[8] = a[8]*b;
        res[9] = a[9]*b;
        res[10] = a[10]*b;
        res[11] = a[11]*b;
        res[12] = a[12]*b;
        res[13] = a[13]*b;
        res[14] = a[14]*b;
        res[15] = a[15]*b;
        res
    }
    }

// sadd
// scalar/multivector addition
impl Add<PGA3D> for float_t {
    type Output = PGA3D;

    fn add(self: float_t, b: PGA3D) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0] = a+b[0];
        res[1] = b[1];
        res[2] = b[2];
        res[3] = b[3];
        res[4] = b[4];
        res[5] = b[5];
        res[6] = b[6];
        res[7] = b[7];
        res[8] = b[8];
        res[9] = b[9];
        res[10] = b[10];
        res[11] = b[11];
        res[12] = b[12];
        res[13] = b[13];
        res[14] = b[14];
        res[15] = b[15];
        res
    }
}

// adds
// multivector/scalar addition
impl Add<float_t> for PGA3D {
    type Output = PGA3D;

    fn add(self: PGA3D, b: float_t) -> PGA3D {
        let mut res = PGA3D::zero();
        let a = self;
        res[0] = a[0]+b;
        res[1] = a[1];
        res[2] = a[2];
        res[3] = a[3];
        res[4] = a[4];
        res[5] = a[5];
        res[6] = a[6];
        res[7] = a[7];
        res[8] = a[8];
        res[9] = a[9];
        res[10] = a[10];
        res[11] = a[11];
        res[12] = a[12];
        res[13] = a[13];
        res[14] = a[14];
        res[15] = a[15];
        res
    }
    }

impl PGA3D {
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
    
    
    // A rotor (Euclidean line) and translator (Ideal line)
    pub fn rotor(angle: float_t, line: Self) -> Self {
        (angle / 2.0).cos() + (angle / 2.0).sin() * line.normalized()
    }

    pub fn translator(dist: float_t, line: Self) -> Self {
        1.0 + dist / 2.0 * line
    }

    // A plane is defined using its homogenous equation ax + by + cz + d = 0
    pub fn plane(a: float_t, b: float_t, c:float_t, d:float_t) -> Self {
        a * e1 + b * e2 + c * e3 + d * e0
    }

    // PGA lines are bivectors.
    pub fn e01() -> Self { e0^e1 } 
    pub fn e02() -> Self { e0^e2 }
    pub fn e03() -> Self { e0^e3 }
    pub fn e12() -> Self { e1^e2 } 
    pub fn e31() -> Self { e3^e1 }
    pub fn e23() -> Self { e2^e3 }

    // PGA points are trivectors.
    pub fn e123() -> Self { e1^e2^e3 }
    pub fn e032() -> Self { e0^e3^e2 }
    pub fn e013() -> Self { e0^e1^e3 }
    pub fn e021() -> Self { e0^e2^e1 }

    // A point is just a homogeneous point, euclidean coordinates plus the origin
    pub fn point(x: float_t, y: float_t, z:float_t) -> Self {
         Self::e123() + x * Self::e032() + y * Self::e013() + z * Self::e021()
    }

    // for our toy problem (generate points on the surface of a torus)
    // we start with a function that generates motors.
    // circle(t) with t going from 0 to 1.
    pub fn circle(t: float_t, radius: float_t, line: Self) -> Self {
        Self::rotor(t * 2.0 * PI, line) * Self::translator(radius, e1 * e0)
    }

    // a torus is now the product of two circles.
    pub fn torus(s: float_t, t: float_t, r1: float_t, l1: Self, r2: float_t, l2: Self) -> Self {
        Self::circle(s, r2, l2) * Self::circle(t, r1, l1)
    }

    // and to sample its points we simply sandwich the origin ..
    pub fn point_on_torus(s: float_t, t: float_t) -> Self {
        let to: Self = Self::torus(s, t, 0.25, Self::e12(), 0.6, Self::e31());

        to * Self::e123() * to.Reverse()
    }



}


fn main() {

    // Elements of the even subalgebra (scalar + bivector + pss) of unit length are motors
    let rot = PGA3D::rotor(PI / 2.0, e1 * e2);

    // The outer product ^ is the MEET. Here we intersect the yz (x=0) and xz (y=0) planes.
    let ax_z = e1 ^ e2;
    
    // line and plane meet in point. We intersect the line along the z-axis (x=0,y=0) with the xy (z=0) plane.
    let orig = ax_z ^ e3;
    
    // We can also easily create points and join them into a line using the regressive (vee, &) product.
    let px = PGA3D::point(1.0, 0.0, 0.0);
    let line = orig & px;
    
    // Lets also create the plane with equation 2x + z - 3 = 0
    let p = PGA3D::plane(2.0, 0.0, 1.0, -3.0);
    
    // rotations work on all elements
    let rotated_plane = rot * p * rot.Reverse();
    let rotated_line  = rot * line * rot.Reverse();
    let rotated_point = rot * px * rot.Reverse();
    
    // See the 3D PGA Cheat sheet for a huge collection of useful formulas
    let point_on_plane = (p | px) * p;

    // Some output
    println!("a point       : {}", px);
    println!("a line        : {}", line);
    println!("a plane       : {}", p);
    println!("a rotor       : {}", rot);
    println!("rotated line  : {}", rotated_line);
    println!("rotated point : {}", rotated_point);
    println!("rotated plane : {}", rotated_plane);
    println!("point on plane: {}", point_on_plane.normalized());
    println!("point on torus: {}", PGA3D::point_on_torus(0.0, 0.0));

}