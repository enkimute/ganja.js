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

const basis: &'static [&'static str] = &[ "1","e1","e2","e3","e12","e13","e23","e123" ];
const basis_count: usize = basis.len();

#[derive(Default,Debug,Clone,PartialEq)]
struct R3 {
    mvec: Vec<float_t>
}

impl R3 {
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
    pub fn e1() -> Self { R3::new(1.0, 1) }
    pub fn e2() -> Self { R3::new(1.0, 2) }
    pub fn e3() -> Self { R3::new(1.0, 3) }
    pub fn e12() -> Self { R3::new(1.0, 4) }
    pub fn e13() -> Self { R3::new(1.0, 5) }
    pub fn e23() -> Self { R3::new(1.0, 6) }
    pub fn e123() -> Self { R3::new(1.0, 7) }
}

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
impl R3 {
    pub fn Reverse(self: & Self) -> R3 {
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
    pub fn Dual(self: & Self) -> R3 {
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

impl Not for & R3 {
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
    pub fn Conjugate(self: & Self) -> R3 {
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
    pub fn Involute(self: & Self) -> R3 {
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

define_binary_op_all!(
    Mul,
    mul;
    self: R3, b: R3, Output = R3;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
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
    };
);


// Wedge
// The outer product. (MEET)

define_binary_op_all!(
    BitXor,
    bitxor;
    self: R3, b: R3, Output = R3;
    [val val] => &self ^ &b;
    [ref val] =>  self ^ &b;
    [val ref] => &self ^  b;
    [ref ref] => {
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
    };
);


// Vee
// The regressive product. (JOIN)

define_binary_op_all!(
    BitAnd,
    bitand;
    self: R3, b: R3, Output = R3;
    [val val] => &self & &b;
    [ref val] =>  self & &b;
    [val ref] => &self &  b;
    [ref ref] => {
        let mut res = R3::zero();
        let a = self;
        res[7]=(a[7]*b[7]);
		res[6]=(a[6]*b[7]+a[7]*b[6]);
		res[5]=-(a[5]*-b[7]+a[7]*b[5]*-1.0);
		res[4]=(a[4]*b[7]+a[7]*b[4]);
		res[3]=(a[3]*b[7]+a[5]*-b[6]-a[6]*b[5]*-1.0+a[7]*b[3]);
		res[2]=-(a[2]*-b[7]+a[4]*b[6]-a[6]*b[4]+a[7]*b[2]*-1.0);
		res[1]=(a[1]*b[7]+a[4]*b[5]*-1.0-a[5]*-b[4]+a[7]*b[1]);
		res[0]=(a[0]*b[7]+a[1]*b[6]-a[2]*-b[5]*-1.0+a[3]*b[4]+a[4]*b[3]-a[5]*-b[2]*-1.0+a[6]*b[1]+a[7]*b[0]);
        res
    };
);


// Dot
// The inner product.

define_binary_op_all!(
    BitOr,
    bitor;
    self: R3, b: R3, Output = R3;
    [val val] => &self | &b;
    [ref val] =>  self | &b;
    [val ref] => &self |  b;
    [ref ref] => {
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
    };
);


// Add
// Multivector addition

define_binary_op_all!(
    Add,
    add;
    self: R3, b: R3, Output = R3;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
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
    };
);


// Sub
// Multivector subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: R3, b: R3, Output = R3;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
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
    };
);


// smul
// scalar/multivector multiplication

define_binary_op_all!(
    Mul,
    mul;
    self: float_t, b: R3, Output = R3;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
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
    };
);


// muls
// multivector/scalar multiplication

define_binary_op_all!(
    Mul,
    mul;
    self: R3, b: float_t, Output = R3;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
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
    };
);


// sadd
// scalar/multivector addition

define_binary_op_all!(
    Add,
    add;
    self: float_t, b: R3, Output = R3;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
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
    };
);


// adds
// multivector/scalar addition

define_binary_op_all!(
    Add,
    add;
    self: R3, b: float_t, Output = R3;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
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
    };
);


// ssub
// scalar/multivector subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: float_t, b: R3, Output = R3;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = R3::zero();
        let a = self;
        res[0] = a-b[0];
        res[1] = -b[1];
        res[2] = -b[2];
        res[3] = -b[3];
        res[4] = -b[4];
        res[5] = -b[5];
        res[6] = -b[6];
        res[7] = -b[7];
        res
    };
);


// subs
// multivector/scalar subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: R3, b: float_t, Output = R3;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = R3::zero();
        let a = self;
        res[0] = a[0]-b;
        res[1] = a[1];
        res[2] = a[2];
        res[3] = a[3];
        res[4] = a[4];
        res[5] = a[5];
        res[6] = a[6];
        res[7] = a[7];
        res
    };
);


impl R3 {
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

  println!("e1*e1         : {}", R3::e1() * R3::e1());
  println!("pss           : {}", R3::e123());
  println!("pss*pss       : {}", R3::e123() * R3::e123());

}