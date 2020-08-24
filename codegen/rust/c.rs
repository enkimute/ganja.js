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

const basis: &'static [&'static str] = &[ "1","e1" ];
const basis_count: usize = basis.len();

#[derive(Default,Debug,Clone,PartialEq)]
struct C {
    mvec: Vec<float_t>
}

impl C {
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
    pub fn e1() -> Self { C::new(1.0, 1) }
}

impl Index<usize> for C {
    type Output = float_t;

    fn index<'a>(&'a self, index: usize) -> &'a Self::Output {
        &self.mvec[index]
    }
}

impl IndexMut<usize> for C {
    fn index_mut<'a>(&'a mut self, index: usize) -> &'a mut Self::Output {
        &mut self.mvec[index]
    }
}

impl fmt::Display for C {
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
impl C {
    pub fn Reverse(self: & Self) -> C {
        let mut res = C::zero();
        let a = self;
        res[0]=a[0];
        res[1]=a[1];
        res
    }
}

// Dual
// Poincare duality operator.
impl C {
    pub fn Dual(self: & Self) -> C {
        let mut res = C::zero();
        let a = self;
        res[0]=-a[1];
        res[1]=a[0];
        res
    }
}

impl Not for & C {
    type Output = C;

    fn not(self: Self) -> C {
        let mut res = C::zero();
        let a = self;
        res[0]=-a[1];
        res[1]=a[0];
        res
    }
}

// Conjugate
// Clifford Conjugation
impl C {
    pub fn Conjugate(self: & Self) -> C {
        let mut res = C::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res
    }
}

// Involute
// Main involution
impl C {
    pub fn Involute(self: & Self) -> C {
        let mut res = C::zero();
        let a = self;
        res[0]=a[0];
        res[1]=-a[1];
        res
    }
}

// Mul
// The geometric product.

define_binary_op_all!(
    Mul,
    mul;
    self: C, b: C, Output = C;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0]=b[0]*a[0]-b[1]*a[1];
		res[1]=b[1]*a[0]+b[0]*a[1];
        res
    };
);


// Wedge
// The outer product. (MEET)

define_binary_op_all!(
    BitXor,
    bitxor;
    self: C, b: C, Output = C;
    [val val] => &self ^ &b;
    [ref val] =>  self ^ &b;
    [val ref] => &self ^  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0]=b[0]*a[0];
		res[1]=b[1]*a[0]+b[0]*a[1];
        res
    };
);


// Vee
// The regressive product. (JOIN)

define_binary_op_all!(
    BitAnd,
    bitand;
    self: C, b: C, Output = C;
    [val val] => &self & &b;
    [ref val] =>  self & &b;
    [val ref] => &self &  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[1]=(a[1]*b[1]);
		res[0]=(a[0]*b[1]+a[1]*b[0]);
        res
    };
);


// Dot
// The inner product.

define_binary_op_all!(
    BitOr,
    bitor;
    self: C, b: C, Output = C;
    [val val] => &self | &b;
    [ref val] =>  self | &b;
    [val ref] => &self |  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0]=b[0]*a[0]-b[1]*a[1];
		res[1]=b[1]*a[0]+b[0]*a[1];
        res
    };
);


// Add
// Multivector addition

define_binary_op_all!(
    Add,
    add;
    self: C, b: C, Output = C;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a[0]+b[0];
		res[1] = a[1]+b[1];
        res
    };
);


// Sub
// Multivector subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: C, b: C, Output = C;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a[0]-b[0];
		res[1] = a[1]-b[1];
        res
    };
);


// smul
// scalar/multivector multiplication

define_binary_op_all!(
    Mul,
    mul;
    self: float_t, b: C, Output = C;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a*b[0];
        res[1] = a*b[1];
        res
    };
);


// muls
// multivector/scalar multiplication

define_binary_op_all!(
    Mul,
    mul;
    self: C, b: float_t, Output = C;
    [val val] => &self * &b;
    [ref val] =>  self * &b;
    [val ref] => &self *  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a[0]*b;
        res[1] = a[1]*b;
        res
    };
);


// sadd
// scalar/multivector addition

define_binary_op_all!(
    Add,
    add;
    self: float_t, b: C, Output = C;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a+b[0];
        res[1] = b[1];
        res
    };
);


// adds
// multivector/scalar addition

define_binary_op_all!(
    Add,
    add;
    self: C, b: float_t, Output = C;
    [val val] => &self + &b;
    [ref val] =>  self + &b;
    [val ref] => &self +  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a[0]+b;
        res[1] = a[1];
        res
    };
);


// ssub
// scalar/multivector subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: float_t, b: C, Output = C;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a-b[0];
        res[1] = -b[1];
        res
    };
);


// subs
// multivector/scalar subtraction

define_binary_op_all!(
    Sub,
    sub;
    self: C, b: float_t, Output = C;
    [val val] => &self - &b;
    [ref val] =>  self - &b;
    [val ref] => &self -  b;
    [ref ref] => {
        let mut res = C::zero();
        let a = self;
        res[0] = a[0]-b;
        res[1] = a[1];
        res
    };
);


impl C {
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

  println!("e1*e1         : {}", C::e1() * C::e1());
  println!("pss           : {}", C::e1());
  println!("pss*pss       : {}", C::e1() * C::e1());

}