"""3D Projective Geometric Algebra.

Written by a generator written by enki.
"""

__author__ = 'Enki'

import math

class R2:
    def __init__(self, value=0, index=0):
        """Initiate a new R2.
         
        Optional, the component index can be set with value.
        """
        self.mvec = [0] * 4
        self._base = ["1", "e1", "e2", "e12"]
        if (value != 0):
            self.mvec[index] = value
            
    @classmethod
    def fromarray(cls, array):
        """Initiate a new R2 from an array-like object.

        The first axis of the array is assumed to correspond to the elements
        of the algebra, and needs to have the same length. Any other dimensions
        are left unchanged, and should have simple operations such as addition 
        and multiplication defined. NumPy arrays are therefore a perfect 
        candidate. 

        :param array: array-like object whose length is the dimension of the algebra.
        :return: new instance of R2.
        """
        self = cls()
        if len(array) != len(self):
            raise TypeError('length of array must be identical to the dimension '
                            'of the algebra.')
        self.mvec = array
        return self
        
    def __str__(self):
        if isinstance(self.mvec, list):
            res = ' + '.join(filter(None, [("%.7f" % x).rstrip("0").rstrip(".")+(["",self._base[i]][i>0]) if abs(x) > 0.000001 else None for i,x in enumerate(self)]))
        else:  # Assume array-like, redirect str conversion
            res = str(self.mvec)
        if (res == ''):
            return "0"
        return res

    def __getitem__(self, key):
        return self.mvec[key]

    def __setitem__(self, key, value):
        self.mvec[key] = value
        
    def __len__(self):
        return len(self.mvec)

    def __invert__(a):
        """R2.Reverse
        
        Reverse the order of the basis blades.
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=a[1]
        res[2]=a[2]
        res[3]=-a[3]
        return R2.fromarray(res)

    def Dual(a):
        """R2.Dual
        
        Poincare duality operator.
        """
        res = a.mvec.copy()
        res[0]=-a[3]
        res[1]=a[2]
        res[2]=-a[1]
        res[3]=a[0]
        return R2.fromarray(res)

    def Conjugate(a):
        """R2.Conjugate
        
        Clifford Conjugation
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=-a[1]
        res[2]=-a[2]
        res[3]=-a[3]
        return R2.fromarray(res)

    def Involute(a):
        """R2.Involute
        
        Main involution
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=-a[1]
        res[2]=-a[2]
        res[3]=a[3]
        return R2.fromarray(res)

    def __mul__(a,b):
        """R2.Mul
        
        The geometric product.
        """
        if type(b) in (int, float):
            return a.muls(b)
        res = a.mvec.copy()
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]-b[3]*a[3]
        res[1]=b[1]*a[0]+b[0]*a[1]-b[3]*a[2]+b[2]*a[3]
        res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3]
        res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3]
        return R2.fromarray(res)
    __rmul__=__mul__

    def __xor__(a,b):
        res = a.mvec.copy()
        res[0]=b[0]*a[0]
        res[1]=b[1]*a[0]+b[0]*a[1]
        res[2]=b[2]*a[0]+b[0]*a[2]
        res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3]
        return R2.fromarray(res)


    def __and__(a,b):
        res = a.mvec.copy()
        res[3]=1*(a[3]*b[3])
        res[2]=-1*(a[2]*-1*b[3]+a[3]*b[2]*-1)
        res[1]=1*(a[1]*b[3]+a[3]*b[1])
        res[0]=1*(a[0]*b[3]+a[1]*b[2]*-1-a[2]*-1*b[1]+a[3]*b[0])
        return R2.fromarray(res)


    def __or__(a,b):
        res = a.mvec.copy()
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]-b[3]*a[3]
        res[1]=b[1]*a[0]+b[0]*a[1]-b[3]*a[2]+b[2]*a[3]
        res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3]
        res[3]=b[3]*a[0]+b[0]*a[3]
        return R2.fromarray(res)


    def __add__(a,b):
        """R2.Add
        
        Multivector addition
        """
        if type(b) in (int, float):
            return a.adds(b)
        res = a.mvec.copy()
        res[0] = a[0]+b[0]
        res[1] = a[1]+b[1]
        res[2] = a[2]+b[2]
        res[3] = a[3]+b[3]
        return R2.fromarray(res)
    __radd__=__add__

    def __sub__(a,b):
        """R2.Sub
        
        Multivector subtraction
        """
        if type(b) in (int, float):
            return a.subs(b)
        res = a.mvec.copy()
        res[0] = a[0]-b[0]
        res[1] = a[1]-b[1]
        res[2] = a[2]-b[2]
        res[3] = a[3]-b[3]
        return R2.fromarray(res)

    def __rsub__(a,b):
        """R2.Sub
                
        Multivector subtraction
        """
        return b + -1 * a


    def smul(a,b):
        res = a.mvec.copy()
        res[0] = a*b[0]
        res[1] = a*b[1]
        res[2] = a*b[2]
        res[3] = a*b[3]
        return R2.fromarray(res)


    def muls(a,b):
        res = a.mvec.copy()
        res[0] = a[0]*b
        res[1] = a[1]*b
        res[2] = a[2]*b
        res[3] = a[3]*b
        return R2.fromarray(res)


    def sadd(a,b):
        res = a.mvec.copy()
        res[0] = a+b[0]
        res[1] = b[1]
        res[2] = b[2]
        res[3] = b[3]
        return R2.fromarray(res)


    def adds(a,b):
        res = a.mvec.copy()
        res[0] = a[0]+b
        res[1] = a[1]
        res[2] = a[2]
        res[3] = a[3]
        return R2.fromarray(res)


    def ssub(a,b):
        res = a.mvec.copy()
        res[0] = a-b[0]
        res[1] = -b[1]
        res[2] = -b[2]
        res[3] = -b[3]
        return R2.fromarray(res)


    def subs(a,b):
        res = a.mvec.copy()
        res[0] = a[0]-b
        res[1] = a[1]
        res[2] = a[2]
        res[3] = a[3]
        return R2.fromarray(res)


    def norm(a):
        return abs((a * a.Conjugate())[0])**0.5
        
    def inorm(a):
        return a.Dual().norm()
        
    def normalized(a):
        return a * (1 / a.norm())

e1 = R2(1.0, 1)
e2 = R2(1.0, 2)
e12 = R2(1.0, 3)

if __name__ == '__main__':
    print("e1*e1         :", str(e1*e1))
    print("pss           :", str(e12))
    print("pss*pss       :", str(e12*e12))

