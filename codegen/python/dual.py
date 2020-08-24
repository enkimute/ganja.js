"""3D Projective Geometric Algebra.

Written by a generator written by enki.
"""

__author__ = 'Enki'

import math

class DUAL:
    def __init__(self, value=0, index=0):
        """Initiate a new DUAL.
         
        Optional, the component index can be set with value.
        """
        self.mvec = [0] * 2
        self._base = ["1", "e0"]
        if (value != 0):
            self.mvec[index] = value
            
    @classmethod
    def fromarray(cls, array):
        """Initiate a new DUAL from an array-like object.

        The first axis of the array is assumed to correspond to the elements
        of the algebra, and needs to have the same length. Any other dimensions
        are left unchanged, and should have simple operations such as addition 
        and multiplication defined. NumPy arrays are therefore a perfect 
        candidate. 

        :param array: array-like object whose length is the dimension of the algebra.
        :return: new instance of DUAL.
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
        """DUAL.Reverse
        
        Reverse the order of the basis blades.
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=a[1]
        return DUAL.fromarray(res)

    def Dual(a):
        """DUAL.Dual
        
        Poincare duality operator.
        """
        res = a.mvec.copy()
        res[0]=a[1]
        res[1]=a[0]
        return DUAL.fromarray(res)

    def Conjugate(a):
        """DUAL.Conjugate
        
        Clifford Conjugation
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=-a[1]
        return DUAL.fromarray(res)

    def Involute(a):
        """DUAL.Involute
        
        Main involution
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=-a[1]
        return DUAL.fromarray(res)

    def __mul__(a,b):
        """DUAL.Mul
        
        The geometric product.
        """
        if type(b) in (int, float):
            return a.muls(b)
        res = a.mvec.copy()
        res[0]=b[0]*a[0]
        res[1]=b[1]*a[0]+b[0]*a[1]
        return DUAL.fromarray(res)
    __rmul__=__mul__

    def __xor__(a,b):
        res = a.mvec.copy()
        res[0]=b[0]*a[0]
        res[1]=b[1]*a[0]+b[0]*a[1]
        return DUAL.fromarray(res)


    def __and__(a,b):
        res = a.mvec.copy()
        res[1]=1*(a[1]*b[1])
        res[0]=1*(a[0]*b[1]+a[1]*b[0])
        return DUAL.fromarray(res)


    def __or__(a,b):
        res = a.mvec.copy()
        res[0]=b[0]*a[0]
        res[1]=b[1]*a[0]+b[0]*a[1]
        return DUAL.fromarray(res)


    def __add__(a,b):
        """DUAL.Add
        
        Multivector addition
        """
        if type(b) in (int, float):
            return a.adds(b)
        res = a.mvec.copy()
        res[0] = a[0]+b[0]
        res[1] = a[1]+b[1]
        return DUAL.fromarray(res)
    __radd__=__add__

    def __sub__(a,b):
        """DUAL.Sub
        
        Multivector subtraction
        """
        if type(b) in (int, float):
            return a.subs(b)
        res = a.mvec.copy()
        res[0] = a[0]-b[0]
        res[1] = a[1]-b[1]
        return DUAL.fromarray(res)

    def __rsub__(a,b):
        """DUAL.Sub
                
        Multivector subtraction
        """
        return b + -1 * a


    def smul(a,b):
        res = a.mvec.copy()
        res[0] = a*b[0]
        res[1] = a*b[1]
        return DUAL.fromarray(res)


    def muls(a,b):
        res = a.mvec.copy()
        res[0] = a[0]*b
        res[1] = a[1]*b
        return DUAL.fromarray(res)


    def sadd(a,b):
        res = a.mvec.copy()
        res[0] = a+b[0]
        res[1] = b[1]
        return DUAL.fromarray(res)


    def adds(a,b):
        res = a.mvec.copy()
        res[0] = a[0]+b
        res[1] = a[1]
        return DUAL.fromarray(res)


    def ssub(a,b):
        res = a.mvec.copy()
        res[0] = a-b[0]
        res[1] = -b[1]
        return DUAL.fromarray(res)


    def subs(a,b):
        res = a.mvec.copy()
        res[0] = a[0]-b
        res[1] = a[1]
        return DUAL.fromarray(res)


    def norm(a):
        return abs((a * a.Conjugate())[0])**0.5
        
    def inorm(a):
        return a.Dual().norm()
        
    def normalized(a):
        return a * (1 / a.norm())

e0 = DUAL(1.0, 1)

if __name__ == '__main__':
    print("e0*e0         :", str(e0*e0))
    print("pss           :", str(e0))
    print("pss*pss       :", str(e0*e0))

