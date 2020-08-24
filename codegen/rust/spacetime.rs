// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#![allow(unused_imports)]
#![allow(dead_code)]
#![allow(non_upper_case_globals)]
#![allow(non_snake_case)]
#![allow(non_camel_case_types)]
//#![feature(const_slice_len)]

use std::fmt;
use std::ops::{Index,IndexMut,Add,Sub,Mul,BitAnd,BitOr,BitXor,Not};

type float_t = f64;

// use std::f64::consts::PI;
const PI: float_t = 3.14159265358979323846;

const basis: &'static [&'static str] = &[ "1","e1","e2","e3","e4","e12","e13","e14","e23","e24","e34","e123","e124","e134","e234","e1234" ];
const basis_count: usize = basis.len();

#[derive(Default,Debug,Clone,PartialEq)]
struct SPACETIME {
    mvec: Vec<float_t>
}

impl SPACETIME {
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
    pub fn e1() -> Self { SPACETIME::new(1.0, 1) }
    pub fn e2() -> Self { SPACETIME::new(1.0, 2) }
    pub fn e3() -> Self { SPACETIME::new(1.0, 3) }
    pub fn e4() -> Self { SPACETIME::new(1.0, 4) }
    pub fn e12() -> Self { SPACETIME::new(1.0, 5) }
    pub fn e13() -> Self { SPACETIME::new(1.0, 6) }
    pub fn e14() -> Self { SPACETIME::new(1.0, 7) }
    pub fn e23() -> Self { SPACETIME::new(1.0, 8) }
    pub fn e24() -> Self { SPACETIME::new(1.0, 9) }
    pub fn e34() -> Self { SPACETIME::new(1.0, 10) }
    pub fn e123() -> Self { SPACETIME::new(1.0, 11) }
    pub fn e124() -> Self { SPACETIME::new(1.0, 12) }
    pub fn e134() -> Self { SPACETIME::new(1.0, 13) }
    pub fn e234() -> Self { SPACETIME::new(1.0, 14) }
    pub fn e1234() -> Self { SPACETIME::new(1.0, 15) }
}

impl Index<usize> for SPACETIME {
    type Output = float_t;

    fn index<'a>(&'a self, index: usize) -> &'a Self::Output {
        &self.mvec[index]
    }
}

impl IndexMut<usize> for SPACETIME {
    fn index_mut<'a>(&'a mut self, index: usize) -> &'a mut Self::Output {
        &mut self.mvec[index]
    }
}

impl fmt::Display for SPACETIME {
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



// Reverse
// Reverse the order of the basis blades.
impl SPACETIME {
    pub fn Reverse(self: & Self) -> SPACETIME {
        let mut res = SPACETIME::zero();
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
impl SPACETIME {
    pub fn Dual(self: & Self) -> SPACETIME {
        let mut res = SPACETIME::zero();
        let a = self;
        res[0]=-a[15];
        res[1]=a[14];
        res[2]=-a[13];
        res[3]=a[12];
        res[4]=a[11];
        res[5]=a[10];
        res[6]=-a[9];
        res[7]=-a[8];
        res[8]=a[7];
        res[9]=a[6];
        res[10]=-a[5];
        res[11]=-a[4];
        res[12]=-a[3];
        res[13]=a[2];
        res[14]=-a[1];
        res[15]=a[0];
        res
    }
}

impl Not for & SPACETIME {
    type Output = SPACETIME;

    fn not(self: Self) -> SPACETIME {
        let mut res = SPACETIME::zero();
        let a = self;
        res[0]=-a[15];
        res[1]=a[14];
        res[2]=-a[13];
        res[3]=a[12];
        res[4]=a[11];
        res[5]=a[10];
        res[6]=-a[9];
        res[7]=-a[8];
        res[8]=a[7];
        res[9]=a[6];
        res[10]=-a[5];
        res[11]=-a[4];
        res[12]=-a[3];
        res[13]=a[2];
        res[14]=-a[1];
        res[15]=a[0];
        res
    }
}

// Conjugate
// Clifford Conjugation
impl SPACETIME {
    pub fn Conjugate(self: & Self) -> SPACETIME {
        let mut res = SPACETIME::zero();
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
impl SPACETIME {
    pub fn Involute(self: & Self) -> SPACETIME {
        let mut res = SPACETIME::zero();
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

define_binary_op_all!(
    Mul,
    mul;
    self: SPACETIME, b: SPACETIME, Output = SPACETIME;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]+b[7]*a[7]-b[8]*a[8]+b[9]*a[9]+b[10]*a[10]-b[11]*a[11]+b[12]*a[12]+b[13]*a[13]+b[14]*a[14]-b[15]*a[15];
		res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]+b[7]*a[4]+b[2]*a[5]+b[3]*a[6]-b[4]*a[7]-b[11]*a[8]+b[12]*a[9]+b[13]*a[10]-b[8]*a[11]+b[9]*a[12]+b[10]*a[13]-b[15]*a[14]+b[14]*a[15];
		res[2]=b[2]*a[0]+b[5]*a[1]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]-b[1]*a[5]+b[11]*a[6]-b[12]*a[7]+b[3]*a[8]-b[4]*a[9]+b[14]*a[10]+b[6]*a[11]-b[7]*a[12]+b[15]*a[13]+b[10]*a[14]-b[13]*a[15];
		res[3]=b[3]*a[0]+b[6]*a[1]+b[8]*a[2]+b[0]*a[3]+b[10]*a[4]-b[11]*a[5]-b[1]*a[6]-b[13]*a[7]-b[2]*a[8]-b[14]*a[9]-b[4]*a[10]-b[5]*a[11]-b[15]*a[12]-b[7]*a[13]-b[9]*a[14]+b[12]*a[15];
		res[4]=b[4]*a[0]+b[7]*a[1]+b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[12]*a[5]-b[13]*a[6]-b[1]*a[7]-b[14]*a[8]-b[2]*a[9]-b[3]*a[10]-b[15]*a[11]-b[5]*a[12]-b[6]*a[13]-b[8]*a[14]+b[11]*a[15];
		res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[11]*a[3]-b[12]*a[4]+b[0]*a[5]-b[8]*a[6]+b[9]*a[7]+b[6]*a[8]-b[7]*a[9]+b[15]*a[10]+b[3]*a[11]-b[4]*a[12]+b[14]*a[13]-b[13]*a[14]+b[10]*a[15];
		res[6]=b[6]*a[0]+b[3]*a[1]-b[11]*a[2]-b[1]*a[3]-b[13]*a[4]+b[8]*a[5]+b[0]*a[6]+b[10]*a[7]-b[5]*a[8]-b[15]*a[9]-b[7]*a[10]-b[2]*a[11]-b[14]*a[12]-b[4]*a[13]+b[12]*a[14]-b[9]*a[15];
		res[7]=b[7]*a[0]+b[4]*a[1]-b[12]*a[2]-b[13]*a[3]-b[1]*a[4]+b[9]*a[5]+b[10]*a[6]+b[0]*a[7]-b[15]*a[8]-b[5]*a[9]-b[6]*a[10]-b[14]*a[11]-b[2]*a[12]-b[3]*a[13]+b[11]*a[14]-b[8]*a[15];
		res[8]=b[8]*a[0]+b[11]*a[1]+b[3]*a[2]-b[2]*a[3]-b[14]*a[4]-b[6]*a[5]+b[5]*a[6]+b[15]*a[7]+b[0]*a[8]+b[10]*a[9]-b[9]*a[10]+b[1]*a[11]+b[13]*a[12]-b[12]*a[13]-b[4]*a[14]+b[7]*a[15];
		res[9]=b[9]*a[0]+b[12]*a[1]+b[4]*a[2]-b[14]*a[3]-b[2]*a[4]-b[7]*a[5]+b[15]*a[6]+b[5]*a[7]+b[10]*a[8]+b[0]*a[9]-b[8]*a[10]+b[13]*a[11]+b[1]*a[12]-b[11]*a[13]-b[3]*a[14]+b[6]*a[15];
		res[10]=b[10]*a[0]+b[13]*a[1]+b[14]*a[2]+b[4]*a[3]-b[3]*a[4]-b[15]*a[5]-b[7]*a[6]+b[6]*a[7]-b[9]*a[8]+b[8]*a[9]+b[0]*a[10]-b[12]*a[11]+b[11]*a[12]+b[1]*a[13]+b[2]*a[14]-b[5]*a[15];
		res[11]=b[11]*a[0]+b[8]*a[1]-b[6]*a[2]+b[5]*a[3]+b[15]*a[4]+b[3]*a[5]-b[2]*a[6]-b[14]*a[7]+b[1]*a[8]+b[13]*a[9]-b[12]*a[10]+b[0]*a[11]+b[10]*a[12]-b[9]*a[13]+b[7]*a[14]-b[4]*a[15];
		res[12]=b[12]*a[0]+b[9]*a[1]-b[7]*a[2]+b[15]*a[3]+b[5]*a[4]+b[4]*a[5]-b[14]*a[6]-b[2]*a[7]+b[13]*a[8]+b[1]*a[9]-b[11]*a[10]+b[10]*a[11]+b[0]*a[12]-b[8]*a[13]+b[6]*a[14]-b[3]*a[15];
		res[13]=b[13]*a[0]+b[10]*a[1]-b[15]*a[2]-b[7]*a[3]+b[6]*a[4]+b[14]*a[5]+b[4]*a[6]-b[3]*a[7]-b[12]*a[8]+b[11]*a[9]+b[1]*a[10]-b[9]*a[11]+b[8]*a[12]+b[0]*a[13]-b[5]*a[14]+b[2]*a[15];
		res[14]=b[14]*a[0]+b[15]*a[1]+b[10]*a[2]-b[9]*a[3]+b[8]*a[4]-b[13]*a[5]+b[12]*a[6]-b[11]*a[7]+b[4]*a[8]-b[3]*a[9]+b[2]*a[10]+b[7]*a[11]-b[6]*a[12]+b[5]*a[13]+b[0]*a[14]-b[1]*a[15];
		res[15]=b[15]*a[0]+b[14]*a[1]-b[13]*a[2]+b[12]*a[3]-b[11]*a[4]+b[10]*a[5]-b[9]*a[6]+b[8]*a[7]+b[7]*a[8]-b[6]*a[9]+b[5]*a[10]+b[4]*a[11]-b[3]*a[12]+b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
        res
    };
);


// Wedge
// The outer product. (MEET)

define_binary_op_all!(
    BitXor,
    bitxor;
    self: SPACETIME, b: SPACETIME, Output = SPACETIME;
    [val val] => &self ^ &b;
    [ref val] =>  self ^ &b;
    [val ref] => &self ^  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
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
		res[9]=b[9]*a[0]+b[4]*a[2]-b[2]*a[4]+b[0]*a[9];
		res[10]=b[10]*a[0]+b[4]*a[3]-b[3]*a[4]+b[0]*a[10];
		res[11]=b[11]*a[0]+b[8]*a[1]-b[6]*a[2]+b[5]*a[3]+b[3]*a[5]-b[2]*a[6]+b[1]*a[8]+b[0]*a[11];
		res[12]=b[12]*a[0]+b[9]*a[1]-b[7]*a[2]+b[5]*a[4]+b[4]*a[5]-b[2]*a[7]+b[1]*a[9]+b[0]*a[12];
		res[13]=b[13]*a[0]+b[10]*a[1]-b[7]*a[3]+b[6]*a[4]+b[4]*a[6]-b[3]*a[7]+b[1]*a[10]+b[0]*a[13];
		res[14]=b[14]*a[0]+b[10]*a[2]-b[9]*a[3]+b[8]*a[4]+b[4]*a[8]-b[3]*a[9]+b[2]*a[10]+b[0]*a[14];
		res[15]=b[15]*a[0]+b[14]*a[1]-b[13]*a[2]+b[12]*a[3]-b[11]*a[4]+b[10]*a[5]-b[9]*a[6]+b[8]*a[7]+b[7]*a[8]-b[6]*a[9]+b[5]*a[10]+b[4]*a[11]-b[3]*a[12]+b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
        res
    };
);


// Vee
// The regressive product. (JOIN)

define_binary_op_all!(
    BitAnd,
    bitand;
    self: SPACETIME, b: SPACETIME, Output = SPACETIME;
    [val val] => &self & &b;
    [ref val] =>  self & &b;
    [val ref] => &self &  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
        let a = self;
        res[15]=(a[15]*b[15]);
		res[14]=-(a[14]*-b[15]+a[15]*b[14]*-1.0);
		res[13]=(a[13]*b[15]+a[15]*b[13]);
		res[12]=-(a[12]*-b[15]+a[15]*b[12]*-1.0);
		res[11]=(a[11]*b[15]+a[15]*b[11]);
		res[10]=(a[10]*b[15]+a[13]*b[14]*-1.0-a[14]*-b[13]+a[15]*b[10]);
		res[9]=-(a[9]*-b[15]+a[12]*-b[14]*-1.0-a[14]*-b[12]*-1.0+a[15]*b[9]*-1.0);
		res[8]=(a[8]*b[15]+a[11]*b[14]*-1.0-a[14]*-b[11]+a[15]*b[8]);
		res[7]=(a[7]*b[15]+a[12]*-b[13]-a[13]*b[12]*-1.0+a[15]*b[7]);
		res[6]=-(a[6]*-b[15]+a[11]*b[13]-a[13]*b[11]+a[15]*b[6]*-1.0);
		res[5]=(a[5]*b[15]+a[11]*b[12]*-1.0-a[12]*-b[11]+a[15]*b[5]);
		res[4]=-(a[4]*-b[15]+a[7]*b[14]*-1.0-a[9]*-b[13]+a[10]*b[12]*-1.0+a[12]*-b[10]-a[13]*b[9]*-1.0+a[14]*-b[7]+a[15]*b[4]*-1.0);
		res[3]=(a[3]*b[15]+a[6]*-b[14]*-1.0-a[8]*b[13]+a[10]*b[11]+a[11]*b[10]-a[13]*b[8]+a[14]*-b[6]*-1.0+a[15]*b[3]);
		res[2]=-(a[2]*-b[15]+a[5]*b[14]*-1.0-a[8]*b[12]*-1.0+a[9]*-b[11]+a[11]*b[9]*-1.0-a[12]*-b[8]+a[14]*-b[5]+a[15]*b[2]*-1.0);
		res[1]=(a[1]*b[15]+a[5]*b[13]-a[6]*-b[12]*-1.0+a[7]*b[11]+a[11]*b[7]-a[12]*-b[6]*-1.0+a[13]*b[5]+a[15]*b[1]);
		res[0]=(a[0]*b[15]+a[1]*b[14]*-1.0-a[2]*-b[13]+a[3]*b[12]*-1.0-a[4]*-b[11]+a[5]*b[10]-a[6]*-b[9]*-1.0+a[7]*b[8]+a[8]*b[7]-a[9]*-b[6]*-1.0+a[10]*b[5]+a[11]*b[4]*-1.0-a[12]*-b[3]+a[13]*b[2]*-1.0-a[14]*-b[1]+a[15]*b[0]);
        res
    };
);


// Dot
// The inner product.

define_binary_op_all!(
    BitOr,
    bitor;
    self: SPACETIME, b: SPACETIME, Output = SPACETIME;
    [val val] => &self | &b;
    [ref val] =>  self | &b;
    [val ref] => &self |  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
        let a = self;
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]+b[7]*a[7]-b[8]*a[8]+b[9]*a[9]+b[10]*a[10]-b[11]*a[11]+b[12]*a[12]+b[13]*a[13]+b[14]*a[14]-b[15]*a[15];
		res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]+b[7]*a[4]+b[2]*a[5]+b[3]*a[6]-b[4]*a[7]-b[11]*a[8]+b[12]*a[9]+b[13]*a[10]-b[8]*a[11]+b[9]*a[12]+b[10]*a[13]-b[15]*a[14]+b[14]*a[15];
		res[2]=b[2]*a[0]+b[5]*a[1]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]-b[1]*a[5]+b[11]*a[6]-b[12]*a[7]+b[3]*a[8]-b[4]*a[9]+b[14]*a[10]+b[6]*a[11]-b[7]*a[12]+b[15]*a[13]+b[10]*a[14]-b[13]*a[15];
		res[3]=b[3]*a[0]+b[6]*a[1]+b[8]*a[2]+b[0]*a[3]+b[10]*a[4]-b[11]*a[5]-b[1]*a[6]-b[13]*a[7]-b[2]*a[8]-b[14]*a[9]-b[4]*a[10]-b[5]*a[11]-b[15]*a[12]-b[7]*a[13]-b[9]*a[14]+b[12]*a[15];
		res[4]=b[4]*a[0]+b[7]*a[1]+b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[12]*a[5]-b[13]*a[6]-b[1]*a[7]-b[14]*a[8]-b[2]*a[9]-b[3]*a[10]-b[15]*a[11]-b[5]*a[12]-b[6]*a[13]-b[8]*a[14]+b[11]*a[15];
		res[5]=b[5]*a[0]+b[11]*a[3]-b[12]*a[4]+b[0]*a[5]+b[15]*a[10]+b[3]*a[11]-b[4]*a[12]+b[10]*a[15];
		res[6]=b[6]*a[0]-b[11]*a[2]-b[13]*a[4]+b[0]*a[6]-b[15]*a[9]-b[2]*a[11]-b[4]*a[13]-b[9]*a[15];
		res[7]=b[7]*a[0]-b[12]*a[2]-b[13]*a[3]+b[0]*a[7]-b[15]*a[8]-b[2]*a[12]-b[3]*a[13]-b[8]*a[15];
		res[8]=b[8]*a[0]+b[11]*a[1]-b[14]*a[4]+b[15]*a[7]+b[0]*a[8]+b[1]*a[11]-b[4]*a[14]+b[7]*a[15];
		res[9]=b[9]*a[0]+b[12]*a[1]-b[14]*a[3]+b[15]*a[6]+b[0]*a[9]+b[1]*a[12]-b[3]*a[14]+b[6]*a[15];
		res[10]=b[10]*a[0]+b[13]*a[1]+b[14]*a[2]-b[15]*a[5]+b[0]*a[10]+b[1]*a[13]+b[2]*a[14]-b[5]*a[15];
		res[11]=b[11]*a[0]+b[15]*a[4]+b[0]*a[11]-b[4]*a[15];
		res[12]=b[12]*a[0]+b[15]*a[3]+b[0]*a[12]-b[3]*a[15];
		res[13]=b[13]*a[0]-b[15]*a[2]+b[0]*a[13]+b[2]*a[15];
		res[14]=b[14]*a[0]+b[15]*a[1]+b[0]*a[14]-b[1]*a[15];
		res[15]=b[15]*a[0]+b[0]*a[15];
        res
    };
);


// Add
// Multivector addition

define_binary_op_all!(
    Add,
    add;
    self: SPACETIME, b: SPACETIME, Output = SPACETIME;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
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
    };
);


// Sub
// Multivector subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: SPACETIME, b: SPACETIME, Output = SPACETIME;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
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
    };
);


// smul
// scalar/multivector multiplication

define_binary_op_all!(
    Mul,
    mul;
    self: float_t, b: SPACETIME, Output = SPACETIME;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
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
    };
);


// muls
// multivector/scalar multiplication

define_binary_op_all!(
    Mul,
    mul;
    self: SPACETIME, b: float_t, Output = SPACETIME;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
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
    };
);


// sadd
// scalar/multivector addition

define_binary_op_all!(
    Add,
    add;
    self: float_t, b: SPACETIME, Output = SPACETIME;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
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
    };
);


// adds
// multivector/scalar addition

define_binary_op_all!(
    Add,
    add;
    self: SPACETIME, b: float_t, Output = SPACETIME;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
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
    };
);


// ssub
// scalar/multivector subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: float_t, b: SPACETIME, Output = SPACETIME;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
        let a = self;
        res[0] = a-b[0];
        res[1] = -b[1];
        res[2] = -b[2];
        res[3] = -b[3];
        res[4] = -b[4];
        res[5] = -b[5];
        res[6] = -b[6];
        res[7] = -b[7];
        res[8] = -b[8];
        res[9] = -b[9];
        res[10] = -b[10];
        res[11] = -b[11];
        res[12] = -b[12];
        res[13] = -b[13];
        res[14] = -b[14];
        res[15] = -b[15];
        res
    };
);


// subs
// multivector/scalar subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: SPACETIME, b: float_t, Output = SPACETIME;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = SPACETIME::zero();
        let a = self;
        res[0] = a[0]-b;
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
    };
);


impl SPACETIME {
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
    
    

}


fn main() {

  println!("e1*e1         : {}", SPACETIME::e1() * SPACETIME::e1());
  println!("pss           : {}", SPACETIME::e1234());
  println!("pss*pss       : {}", SPACETIME::e1234() * SPACETIME::e1234());

}