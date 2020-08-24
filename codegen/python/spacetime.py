"""3D Projective Geometric Algebra.

Written by a generator written by enki.
"""

__author__ = 'Enki'

import math

class SPACETIME:
    def __init__(self, value=0, index=0):
        """Initiate a new SPACETIME.
         
        Optional, the component index can be set with value.
        """
        self.mvec = [0] * 16
        self._base = ["1", "e1", "e2", "e3", "e4", "e12", "e13", "e14", "e23", "e24", "e34", "e123", "e124", "e134", "e234", "e1234"]
        if (value != 0):
            self.mvec[index] = value
            
    @classmethod
    def fromarray(cls, array):
        """Initiate a new SPACETIME from an array-like object.

        The first axis of the array is assumed to correspond to the elements
        of the algebra, and needs to have the same length. Any other dimensions
        are left unchanged, and should have simple operations such as addition 
        and multiplication defined. NumPy arrays are therefore a perfect 
        candidate. 

        :param array: array-like object whose length is the dimension of the algebra.
        :return: new instance of SPACETIME.
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
        """SPACETIME.Reverse
        
        Reverse the order of the basis blades.
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=a[1]
        res[2]=a[2]
        res[3]=a[3]
        res[4]=a[4]
        res[5]=-a[5]
        res[6]=-a[6]
        res[7]=-a[7]
        res[8]=-a[8]
        res[9]=-a[9]
        res[10]=-a[10]
        res[11]=-a[11]
        res[12]=-a[12]
        res[13]=-a[13]
        res[14]=-a[14]
        res[15]=a[15]
        return SPACETIME.fromarray(res)

    def Dual(a):
        """SPACETIME.Dual
        
        Poincare duality operator.
        """
        res = a.mvec.copy()
        res[0]=-a[15]
        res[1]=a[14]
        res[2]=-a[13]
        res[3]=a[12]
        res[4]=a[11]
        res[5]=a[10]
        res[6]=-a[9]
        res[7]=-a[8]
        res[8]=a[7]
        res[9]=a[6]
        res[10]=-a[5]
        res[11]=-a[4]
        res[12]=-a[3]
        res[13]=a[2]
        res[14]=-a[1]
        res[15]=a[0]
        return SPACETIME.fromarray(res)

    def Conjugate(a):
        """SPACETIME.Conjugate
        
        Clifford Conjugation
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=-a[1]
        res[2]=-a[2]
        res[3]=-a[3]
        res[4]=-a[4]
        res[5]=-a[5]
        res[6]=-a[6]
        res[7]=-a[7]
        res[8]=-a[8]
        res[9]=-a[9]
        res[10]=-a[10]
        res[11]=a[11]
        res[12]=a[12]
        res[13]=a[13]
        res[14]=a[14]
        res[15]=a[15]
        return SPACETIME.fromarray(res)

    def Involute(a):
        """SPACETIME.Involute
        
        Main involution
        """
        res = a.mvec.copy()
        res[0]=a[0]
        res[1]=-a[1]
        res[2]=-a[2]
        res[3]=-a[3]
        res[4]=-a[4]
        res[5]=a[5]
        res[6]=a[6]
        res[7]=a[7]
        res[8]=a[8]
        res[9]=a[9]
        res[10]=a[10]
        res[11]=-a[11]
        res[12]=-a[12]
        res[13]=-a[13]
        res[14]=-a[14]
        res[15]=a[15]
        return SPACETIME.fromarray(res)

    def __mul__(a,b):
        """SPACETIME.Mul
        
        The geometric product.
        """
        if type(b) in (int, float):
            return a.muls(b)
        res = a.mvec.copy()
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]+b[7]*a[7]-b[8]*a[8]+b[9]*a[9]+b[10]*a[10]-b[11]*a[11]+b[12]*a[12]+b[13]*a[13]+b[14]*a[14]-b[15]*a[15]
        res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]+b[7]*a[4]+b[2]*a[5]+b[3]*a[6]-b[4]*a[7]-b[11]*a[8]+b[12]*a[9]+b[13]*a[10]-b[8]*a[11]+b[9]*a[12]+b[10]*a[13]-b[15]*a[14]+b[14]*a[15]
        res[2]=b[2]*a[0]+b[5]*a[1]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]-b[1]*a[5]+b[11]*a[6]-b[12]*a[7]+b[3]*a[8]-b[4]*a[9]+b[14]*a[10]+b[6]*a[11]-b[7]*a[12]+b[15]*a[13]+b[10]*a[14]-b[13]*a[15]
        res[3]=b[3]*a[0]+b[6]*a[1]+b[8]*a[2]+b[0]*a[3]+b[10]*a[4]-b[11]*a[5]-b[1]*a[6]-b[13]*a[7]-b[2]*a[8]-b[14]*a[9]-b[4]*a[10]-b[5]*a[11]-b[15]*a[12]-b[7]*a[13]-b[9]*a[14]+b[12]*a[15]
        res[4]=b[4]*a[0]+b[7]*a[1]+b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[12]*a[5]-b[13]*a[6]-b[1]*a[7]-b[14]*a[8]-b[2]*a[9]-b[3]*a[10]-b[15]*a[11]-b[5]*a[12]-b[6]*a[13]-b[8]*a[14]+b[11]*a[15]
        res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[11]*a[3]-b[12]*a[4]+b[0]*a[5]-b[8]*a[6]+b[9]*a[7]+b[6]*a[8]-b[7]*a[9]+b[15]*a[10]+b[3]*a[11]-b[4]*a[12]+b[14]*a[13]-b[13]*a[14]+b[10]*a[15]
        res[6]=b[6]*a[0]+b[3]*a[1]-b[11]*a[2]-b[1]*a[3]-b[13]*a[4]+b[8]*a[5]+b[0]*a[6]+b[10]*a[7]-b[5]*a[8]-b[15]*a[9]-b[7]*a[10]-b[2]*a[11]-b[14]*a[12]-b[4]*a[13]+b[12]*a[14]-b[9]*a[15]
        res[7]=b[7]*a[0]+b[4]*a[1]-b[12]*a[2]-b[13]*a[3]-b[1]*a[4]+b[9]*a[5]+b[10]*a[6]+b[0]*a[7]-b[15]*a[8]-b[5]*a[9]-b[6]*a[10]-b[14]*a[11]-b[2]*a[12]-b[3]*a[13]+b[11]*a[14]-b[8]*a[15]
        res[8]=b[8]*a[0]+b[11]*a[1]+b[3]*a[2]-b[2]*a[3]-b[14]*a[4]-b[6]*a[5]+b[5]*a[6]+b[15]*a[7]+b[0]*a[8]+b[10]*a[9]-b[9]*a[10]+b[1]*a[11]+b[13]*a[12]-b[12]*a[13]-b[4]*a[14]+b[7]*a[15]
        res[9]=b[9]*a[0]+b[12]*a[1]+b[4]*a[2]-b[14]*a[3]-b[2]*a[4]-b[7]*a[5]+b[15]*a[6]+b[5]*a[7]+b[10]*a[8]+b[0]*a[9]-b[8]*a[10]+b[13]*a[11]+b[1]*a[12]-b[11]*a[13]-b[3]*a[14]+b[6]*a[15]
        res[10]=b[10]*a[0]+b[13]*a[1]+b[14]*a[2]+b[4]*a[3]-b[3]*a[4]-b[15]*a[5]-b[7]*a[6]+b[6]*a[7]-b[9]*a[8]+b[8]*a[9]+b[0]*a[10]-b[12]*a[11]+b[11]*a[12]+b[1]*a[13]+b[2]*a[14]-b[5]*a[15]
        res[11]=b[11]*a[0]+b[8]*a[1]-b[6]*a[2]+b[5]*a[3]+b[15]*a[4]+b[3]*a[5]-b[2]*a[6]-b[14]*a[7]+b[1]*a[8]+b[13]*a[9]-b[12]*a[10]+b[0]*a[11]+b[10]*a[12]-b[9]*a[13]+b[7]*a[14]-b[4]*a[15]
        res[12]=b[12]*a[0]+b[9]*a[1]-b[7]*a[2]+b[15]*a[3]+b[5]*a[4]+b[4]*a[5]-b[14]*a[6]-b[2]*a[7]+b[13]*a[8]+b[1]*a[9]-b[11]*a[10]+b[10]*a[11]+b[0]*a[12]-b[8]*a[13]+b[6]*a[14]-b[3]*a[15]
        res[13]=b[13]*a[0]+b[10]*a[1]-b[15]*a[2]-b[7]*a[3]+b[6]*a[4]+b[14]*a[5]+b[4]*a[6]-b[3]*a[7]-b[12]*a[8]+b[11]*a[9]+b[1]*a[10]-b[9]*a[11]+b[8]*a[12]+b[0]*a[13]-b[5]*a[14]+b[2]*a[15]
        res[14]=b[14]*a[0]+b[15]*a[1]+b[10]*a[2]-b[9]*a[3]+b[8]*a[4]-b[13]*a[5]+b[12]*a[6]-b[11]*a[7]+b[4]*a[8]-b[3]*a[9]+b[2]*a[10]+b[7]*a[11]-b[6]*a[12]+b[5]*a[13]+b[0]*a[14]-b[1]*a[15]
        res[15]=b[15]*a[0]+b[14]*a[1]-b[13]*a[2]+b[12]*a[3]-b[11]*a[4]+b[10]*a[5]-b[9]*a[6]+b[8]*a[7]+b[7]*a[8]-b[6]*a[9]+b[5]*a[10]+b[4]*a[11]-b[3]*a[12]+b[2]*a[13]-b[1]*a[14]+b[0]*a[15]
        return SPACETIME.fromarray(res)
    __rmul__=__mul__

    def __xor__(a,b):
        res = a.mvec.copy()
        res[0]=b[0]*a[0]
        res[1]=b[1]*a[0]+b[0]*a[1]
        res[2]=b[2]*a[0]+b[0]*a[2]
        res[3]=b[3]*a[0]+b[0]*a[3]
        res[4]=b[4]*a[0]+b[0]*a[4]
        res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[5]
        res[6]=b[6]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[6]
        res[7]=b[7]*a[0]+b[4]*a[1]-b[1]*a[4]+b[0]*a[7]
        res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[8]
        res[9]=b[9]*a[0]+b[4]*a[2]-b[2]*a[4]+b[0]*a[9]
        res[10]=b[10]*a[0]+b[4]*a[3]-b[3]*a[4]+b[0]*a[10]
        res[11]=b[11]*a[0]+b[8]*a[1]-b[6]*a[2]+b[5]*a[3]+b[3]*a[5]-b[2]*a[6]+b[1]*a[8]+b[0]*a[11]
        res[12]=b[12]*a[0]+b[9]*a[1]-b[7]*a[2]+b[5]*a[4]+b[4]*a[5]-b[2]*a[7]+b[1]*a[9]+b[0]*a[12]
        res[13]=b[13]*a[0]+b[10]*a[1]-b[7]*a[3]+b[6]*a[4]+b[4]*a[6]-b[3]*a[7]+b[1]*a[10]+b[0]*a[13]
        res[14]=b[14]*a[0]+b[10]*a[2]-b[9]*a[3]+b[8]*a[4]+b[4]*a[8]-b[3]*a[9]+b[2]*a[10]+b[0]*a[14]
        res[15]=b[15]*a[0]+b[14]*a[1]-b[13]*a[2]+b[12]*a[3]-b[11]*a[4]+b[10]*a[5]-b[9]*a[6]+b[8]*a[7]+b[7]*a[8]-b[6]*a[9]+b[5]*a[10]+b[4]*a[11]-b[3]*a[12]+b[2]*a[13]-b[1]*a[14]+b[0]*a[15]
        return SPACETIME.fromarray(res)


    def __and__(a,b):
        res = a.mvec.copy()
        res[15]=1*(a[15]*b[15])
        res[14]=-1*(a[14]*-1*b[15]+a[15]*b[14]*-1)
        res[13]=1*(a[13]*b[15]+a[15]*b[13])
        res[12]=-1*(a[12]*-1*b[15]+a[15]*b[12]*-1)
        res[11]=1*(a[11]*b[15]+a[15]*b[11])
        res[10]=1*(a[10]*b[15]+a[13]*b[14]*-1-a[14]*-1*b[13]+a[15]*b[10])
        res[9]=-1*(a[9]*-1*b[15]+a[12]*-1*b[14]*-1-a[14]*-1*b[12]*-1+a[15]*b[9]*-1)
        res[8]=1*(a[8]*b[15]+a[11]*b[14]*-1-a[14]*-1*b[11]+a[15]*b[8])
        res[7]=1*(a[7]*b[15]+a[12]*-1*b[13]-a[13]*b[12]*-1+a[15]*b[7])
        res[6]=-1*(a[6]*-1*b[15]+a[11]*b[13]-a[13]*b[11]+a[15]*b[6]*-1)
        res[5]=1*(a[5]*b[15]+a[11]*b[12]*-1-a[12]*-1*b[11]+a[15]*b[5])
        res[4]=-1*(a[4]*-1*b[15]+a[7]*b[14]*-1-a[9]*-1*b[13]+a[10]*b[12]*-1+a[12]*-1*b[10]-a[13]*b[9]*-1+a[14]*-1*b[7]+a[15]*b[4]*-1)
        res[3]=1*(a[3]*b[15]+a[6]*-1*b[14]*-1-a[8]*b[13]+a[10]*b[11]+a[11]*b[10]-a[13]*b[8]+a[14]*-1*b[6]*-1+a[15]*b[3])
        res[2]=-1*(a[2]*-1*b[15]+a[5]*b[14]*-1-a[8]*b[12]*-1+a[9]*-1*b[11]+a[11]*b[9]*-1-a[12]*-1*b[8]+a[14]*-1*b[5]+a[15]*b[2]*-1)
        res[1]=1*(a[1]*b[15]+a[5]*b[13]-a[6]*-1*b[12]*-1+a[7]*b[11]+a[11]*b[7]-a[12]*-1*b[6]*-1+a[13]*b[5]+a[15]*b[1])
        res[0]=1*(a[0]*b[15]+a[1]*b[14]*-1-a[2]*-1*b[13]+a[3]*b[12]*-1-a[4]*-1*b[11]+a[5]*b[10]-a[6]*-1*b[9]*-1+a[7]*b[8]+a[8]*b[7]-a[9]*-1*b[6]*-1+a[10]*b[5]+a[11]*b[4]*-1-a[12]*-1*b[3]+a[13]*b[2]*-1-a[14]*-1*b[1]+a[15]*b[0])
        return SPACETIME.fromarray(res)


    def __or__(a,b):
        res = a.mvec.copy()
        res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]+b[7]*a[7]-b[8]*a[8]+b[9]*a[9]+b[10]*a[10]-b[11]*a[11]+b[12]*a[12]+b[13]*a[13]+b[14]*a[14]-b[15]*a[15]
        res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]+b[7]*a[4]+b[2]*a[5]+b[3]*a[6]-b[4]*a[7]-b[11]*a[8]+b[12]*a[9]+b[13]*a[10]-b[8]*a[11]+b[9]*a[12]+b[10]*a[13]-b[15]*a[14]+b[14]*a[15]
        res[2]=b[2]*a[0]+b[5]*a[1]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]-b[1]*a[5]+b[11]*a[6]-b[12]*a[7]+b[3]*a[8]-b[4]*a[9]+b[14]*a[10]+b[6]*a[11]-b[7]*a[12]+b[15]*a[13]+b[10]*a[14]-b[13]*a[15]
        res[3]=b[3]*a[0]+b[6]*a[1]+b[8]*a[2]+b[0]*a[3]+b[10]*a[4]-b[11]*a[5]-b[1]*a[6]-b[13]*a[7]-b[2]*a[8]-b[14]*a[9]-b[4]*a[10]-b[5]*a[11]-b[15]*a[12]-b[7]*a[13]-b[9]*a[14]+b[12]*a[15]
        res[4]=b[4]*a[0]+b[7]*a[1]+b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[12]*a[5]-b[13]*a[6]-b[1]*a[7]-b[14]*a[8]-b[2]*a[9]-b[3]*a[10]-b[15]*a[11]-b[5]*a[12]-b[6]*a[13]-b[8]*a[14]+b[11]*a[15]
        res[5]=b[5]*a[0]+b[11]*a[3]-b[12]*a[4]+b[0]*a[5]+b[15]*a[10]+b[3]*a[11]-b[4]*a[12]+b[10]*a[15]
        res[6]=b[6]*a[0]-b[11]*a[2]-b[13]*a[4]+b[0]*a[6]-b[15]*a[9]-b[2]*a[11]-b[4]*a[13]-b[9]*a[15]
        res[7]=b[7]*a[0]-b[12]*a[2]-b[13]*a[3]+b[0]*a[7]-b[15]*a[8]-b[2]*a[12]-b[3]*a[13]-b[8]*a[15]
        res[8]=b[8]*a[0]+b[11]*a[1]-b[14]*a[4]+b[15]*a[7]+b[0]*a[8]+b[1]*a[11]-b[4]*a[14]+b[7]*a[15]
        res[9]=b[9]*a[0]+b[12]*a[1]-b[14]*a[3]+b[15]*a[6]+b[0]*a[9]+b[1]*a[12]-b[3]*a[14]+b[6]*a[15]
        res[10]=b[10]*a[0]+b[13]*a[1]+b[14]*a[2]-b[15]*a[5]+b[0]*a[10]+b[1]*a[13]+b[2]*a[14]-b[5]*a[15]
        res[11]=b[11]*a[0]+b[15]*a[4]+b[0]*a[11]-b[4]*a[15]
        res[12]=b[12]*a[0]+b[15]*a[3]+b[0]*a[12]-b[3]*a[15]
        res[13]=b[13]*a[0]-b[15]*a[2]+b[0]*a[13]+b[2]*a[15]
        res[14]=b[14]*a[0]+b[15]*a[1]+b[0]*a[14]-b[1]*a[15]
        res[15]=b[15]*a[0]+b[0]*a[15]
        return SPACETIME.fromarray(res)


    def __add__(a,b):
        """SPACETIME.Add
        
        Multivector addition
        """
        if type(b) in (int, float):
            return a.adds(b)
        res = a.mvec.copy()
        res[0] = a[0]+b[0]
        res[1] = a[1]+b[1]
        res[2] = a[2]+b[2]
        res[3] = a[3]+b[3]
        res[4] = a[4]+b[4]
        res[5] = a[5]+b[5]
        res[6] = a[6]+b[6]
        res[7] = a[7]+b[7]
        res[8] = a[8]+b[8]
        res[9] = a[9]+b[9]
        res[10] = a[10]+b[10]
        res[11] = a[11]+b[11]
        res[12] = a[12]+b[12]
        res[13] = a[13]+b[13]
        res[14] = a[14]+b[14]
        res[15] = a[15]+b[15]
        return SPACETIME.fromarray(res)
    __radd__=__add__

    def __sub__(a,b):
        """SPACETIME.Sub
        
        Multivector subtraction
        """
        if type(b) in (int, float):
            return a.subs(b)
        res = a.mvec.copy()
        res[0] = a[0]-b[0]
        res[1] = a[1]-b[1]
        res[2] = a[2]-b[2]
        res[3] = a[3]-b[3]
        res[4] = a[4]-b[4]
        res[5] = a[5]-b[5]
        res[6] = a[6]-b[6]
        res[7] = a[7]-b[7]
        res[8] = a[8]-b[8]
        res[9] = a[9]-b[9]
        res[10] = a[10]-b[10]
        res[11] = a[11]-b[11]
        res[12] = a[12]-b[12]
        res[13] = a[13]-b[13]
        res[14] = a[14]-b[14]
        res[15] = a[15]-b[15]
        return SPACETIME.fromarray(res)

    def __rsub__(a,b):
        """SPACETIME.Sub
                
        Multivector subtraction
        """
        return b + -1 * a


    def smul(a,b):
        res = a.mvec.copy()
        res[0] = a*b[0]
        res[1] = a*b[1]
        res[2] = a*b[2]
        res[3] = a*b[3]
        res[4] = a*b[4]
        res[5] = a*b[5]
        res[6] = a*b[6]
        res[7] = a*b[7]
        res[8] = a*b[8]
        res[9] = a*b[9]
        res[10] = a*b[10]
        res[11] = a*b[11]
        res[12] = a*b[12]
        res[13] = a*b[13]
        res[14] = a*b[14]
        res[15] = a*b[15]
        return SPACETIME.fromarray(res)


    def muls(a,b):
        res = a.mvec.copy()
        res[0] = a[0]*b
        res[1] = a[1]*b
        res[2] = a[2]*b
        res[3] = a[3]*b
        res[4] = a[4]*b
        res[5] = a[5]*b
        res[6] = a[6]*b
        res[7] = a[7]*b
        res[8] = a[8]*b
        res[9] = a[9]*b
        res[10] = a[10]*b
        res[11] = a[11]*b
        res[12] = a[12]*b
        res[13] = a[13]*b
        res[14] = a[14]*b
        res[15] = a[15]*b
        return SPACETIME.fromarray(res)


    def sadd(a,b):
        res = a.mvec.copy()
        res[0] = a+b[0]
        res[1] = b[1]
        res[2] = b[2]
        res[3] = b[3]
        res[4] = b[4]
        res[5] = b[5]
        res[6] = b[6]
        res[7] = b[7]
        res[8] = b[8]
        res[9] = b[9]
        res[10] = b[10]
        res[11] = b[11]
        res[12] = b[12]
        res[13] = b[13]
        res[14] = b[14]
        res[15] = b[15]
        return SPACETIME.fromarray(res)


    def adds(a,b):
        res = a.mvec.copy()
        res[0] = a[0]+b
        res[1] = a[1]
        res[2] = a[2]
        res[3] = a[3]
        res[4] = a[4]
        res[5] = a[5]
        res[6] = a[6]
        res[7] = a[7]
        res[8] = a[8]
        res[9] = a[9]
        res[10] = a[10]
        res[11] = a[11]
        res[12] = a[12]
        res[13] = a[13]
        res[14] = a[14]
        res[15] = a[15]
        return SPACETIME.fromarray(res)


    def ssub(a,b):
        res = a.mvec.copy()
        res[0] = a-b[0]
        res[1] = -b[1]
        res[2] = -b[2]
        res[3] = -b[3]
        res[4] = -b[4]
        res[5] = -b[5]
        res[6] = -b[6]
        res[7] = -b[7]
        res[8] = -b[8]
        res[9] = -b[9]
        res[10] = -b[10]
        res[11] = -b[11]
        res[12] = -b[12]
        res[13] = -b[13]
        res[14] = -b[14]
        res[15] = -b[15]
        return SPACETIME.fromarray(res)


    def subs(a,b):
        res = a.mvec.copy()
        res[0] = a[0]-b
        res[1] = a[1]
        res[2] = a[2]
        res[3] = a[3]
        res[4] = a[4]
        res[5] = a[5]
        res[6] = a[6]
        res[7] = a[7]
        res[8] = a[8]
        res[9] = a[9]
        res[10] = a[10]
        res[11] = a[11]
        res[12] = a[12]
        res[13] = a[13]
        res[14] = a[14]
        res[15] = a[15]
        return SPACETIME.fromarray(res)


    def norm(a):
        return abs((a * a.Conjugate())[0])**0.5
        
    def inorm(a):
        return a.Dual().norm()
        
    def normalized(a):
        return a * (1 / a.norm())

e1 = SPACETIME(1.0, 1)
e2 = SPACETIME(1.0, 2)
e3 = SPACETIME(1.0, 3)
e4 = SPACETIME(1.0, 4)
e12 = SPACETIME(1.0, 5)
e13 = SPACETIME(1.0, 6)
e14 = SPACETIME(1.0, 7)
e23 = SPACETIME(1.0, 8)
e24 = SPACETIME(1.0, 9)
e34 = SPACETIME(1.0, 10)
e123 = SPACETIME(1.0, 11)
e124 = SPACETIME(1.0, 12)
e134 = SPACETIME(1.0, 13)
e234 = SPACETIME(1.0, 14)
e1234 = SPACETIME(1.0, 15)

if __name__ == '__main__':
    print("e1*e1         :", str(e1*e1))
    print("pss           :", str(e1234))
    print("pss*pss       :", str(e1234*e1234))

