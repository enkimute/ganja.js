"""3D Projective Geometric Algebra.

Written by a generator written by enki.
"""

__author__ = 'Enki'

import math

class R3:
	def __init__(self, value=0, index=0):
		"""Initiate a new R3.
		 
		Optional, the component ``index`` can be set with ``value``.
		"""
		self.mvec = [0]*8
		self._base = ["1","e1","e2","e3","e12","e13","e23","e123"]
		if (value != 0):
			self.mvec[index] = value
        
	def __str__(self):
		res = ' + '.join(filter(None, [("%.7f" % x).rstrip("0").rstrip(".")+(["",self._base[i]][i>0]) if math.fabs(x) > 0.000001 else None for i,x in enumerate(self)]))
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
		"""R3.Reverse
		
		Reverse the order of the basis blades.
		"""
		res = R3()
		res[0]=a[0]
		res[1]=a[1]
		res[2]=a[2]
		res[3]=a[3]
		res[4]=-a[4]
		res[5]=-a[5]
		res[6]=-a[6]
		res[7]=-a[7]
		return res

	def Dual(a):
		"""R3.Dual
		
		Poincare duality operator.
		"""
		res = R3()
		res[0]=-a[7]
		res[1]=-a[6]
		res[2]=a[5]
		res[3]=-a[4]
		res[4]=a[3]
		res[5]=-a[2]
		res[6]=a[1]
		res[7]=a[0]
		return res

	def Conjugate(a):
		"""R3.Conjugate
		
		Clifford Conjugation
		"""
		res = R3()
		res[0]=a[0]
		res[1]=-a[1]
		res[2]=-a[2]
		res[3]=-a[3]
		res[4]=-a[4]
		res[5]=-a[5]
		res[6]=-a[6]
		res[7]=a[7]
		return res

	def Involute(a):
		"""R3.Involute
		
		Main involution
		"""
		res = R3()
		res[0]=a[0]
		res[1]=-a[1]
		res[2]=-a[2]
		res[3]=-a[3]
		res[4]=a[4]
		res[5]=a[5]
		res[6]=a[6]
		res[7]=-a[7]
		return res

	def __mul__(a,b):
		"""R3.Mul
		
		The geometric product.
		"""
		if type(b) in (int, float):
			 return a.muls(b)
		res = R3()
		res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]-b[7]*a[7]
		res[1]=b[1]*a[0]+b[0]*a[1]-b[4]*a[2]-b[5]*a[3]+b[2]*a[4]+b[3]*a[5]-b[7]*a[6]-b[6]*a[7]
		res[2]=b[2]*a[0]+b[4]*a[1]+b[0]*a[2]-b[6]*a[3]-b[1]*a[4]+b[7]*a[5]+b[3]*a[6]+b[5]*a[7]
		res[3]=b[3]*a[0]+b[5]*a[1]+b[6]*a[2]+b[0]*a[3]-b[7]*a[4]-b[1]*a[5]-b[2]*a[6]-b[4]*a[7]
		res[4]=b[4]*a[0]+b[2]*a[1]-b[1]*a[2]+b[7]*a[3]+b[0]*a[4]-b[6]*a[5]+b[5]*a[6]+b[3]*a[7]
		res[5]=b[5]*a[0]+b[3]*a[1]-b[7]*a[2]-b[1]*a[3]+b[6]*a[4]+b[0]*a[5]-b[4]*a[6]-b[2]*a[7]
		res[6]=b[6]*a[0]+b[7]*a[1]+b[3]*a[2]-b[2]*a[3]-b[5]*a[4]+b[4]*a[5]+b[0]*a[6]+b[1]*a[7]
		res[7]=b[7]*a[0]+b[6]*a[1]-b[5]*a[2]+b[4]*a[3]+b[3]*a[4]-b[2]*a[5]+b[1]*a[6]+b[0]*a[7]
		return res
	__rmul__=__mul__

	def __xor__(a,b):
		res = R3()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		res[2]=b[2]*a[0]+b[0]*a[2]
		res[3]=b[3]*a[0]+b[0]*a[3]
		res[4]=b[4]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[4]
		res[5]=b[5]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[5]
		res[6]=b[6]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[6]
		res[7]=b[7]*a[0]+b[6]*a[1]-b[5]*a[2]+b[4]*a[3]+b[3]*a[4]-b[2]*a[5]+b[1]*a[6]+b[0]*a[7]
		return res


	def __and__(a,b):
		res = R3()
		res[7]=b[7]*a[7]
		res[6]=b[6]*a[7]+b[7]*a[6]
		res[5]=b[5]*a[7]+b[7]*a[5]
		res[4]=b[4]*a[7]+b[7]*a[4]
		res[3]=b[3]*a[7]+b[5]*a[6]-b[6]*a[5]+b[7]*a[3]
		res[2]=b[2]*a[7]+b[4]*a[6]-b[6]*a[4]+b[7]*a[2]
		res[1]=b[1]*a[7]+b[4]*a[5]-b[5]*a[4]+b[7]*a[1]
		res[0]=b[0]*a[7]+b[1]*a[6]-b[2]*a[5]+b[3]*a[4]+b[4]*a[3]-b[5]*a[2]+b[6]*a[1]+b[7]*a[0]
		return res


	def __or__(a,b):
		res = R3()
		res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]-b[7]*a[7]
		res[1]=b[1]*a[0]+b[0]*a[1]-b[4]*a[2]-b[5]*a[3]+b[2]*a[4]+b[3]*a[5]-b[7]*a[6]-b[6]*a[7]
		res[2]=b[2]*a[0]+b[4]*a[1]+b[0]*a[2]-b[6]*a[3]-b[1]*a[4]+b[7]*a[5]+b[3]*a[6]+b[5]*a[7]
		res[3]=b[3]*a[0]+b[5]*a[1]+b[6]*a[2]+b[0]*a[3]-b[7]*a[4]-b[1]*a[5]-b[2]*a[6]-b[4]*a[7]
		res[4]=b[4]*a[0]+b[7]*a[3]+b[0]*a[4]+b[3]*a[7]
		res[5]=b[5]*a[0]-b[7]*a[2]+b[0]*a[5]-b[2]*a[7]
		res[6]=b[6]*a[0]+b[7]*a[1]+b[0]*a[6]+b[1]*a[7]
		res[7]=b[7]*a[0]+b[0]*a[7]
		return res


	def __add__(a,b):
		"""R3.Add
		
		Multivector addition
		"""
		if type(b) in (int, float):
			 return a.adds(b)
		res = R3()
		res[0] = a[0]+b[0]
		res[1] = a[1]+b[1]
		res[2] = a[2]+b[2]
		res[3] = a[3]+b[3]
		res[4] = a[4]+b[4]
		res[5] = a[5]+b[5]
		res[6] = a[6]+b[6]
		res[7] = a[7]+b[7]
		return res
	__radd__=__add__

	def __sub__(a,b):
		"""R3.Sub
		
		Multivector subtraction
		"""
		if type(b) in (int, float):
			 return a.subs(b)
		res = R3()
		res[0] = a[0]-b[0]
		res[1] = a[1]-b[1]
		res[2] = a[2]-b[2]
		res[3] = a[3]-b[3]
		res[4] = a[4]-b[4]
		res[5] = a[5]-b[5]
		res[6] = a[6]-b[6]
		res[7] = a[7]-b[7]
		return res
	__rsub__=__sub__

	def smul(a,b):
		res = R3()
		res[0] = a*b[0]
		res[1] = a*b[1]
		res[2] = a*b[2]
		res[3] = a*b[3]
		res[4] = a*b[4]
		res[5] = a*b[5]
		res[6] = a*b[6]
		res[7] = a*b[7]
		return res


	def muls(a,b):
		res = R3()
		res[0] = a[0]*b
		res[1] = a[1]*b
		res[2] = a[2]*b
		res[3] = a[3]*b
		res[4] = a[4]*b
		res[5] = a[5]*b
		res[6] = a[6]*b
		res[7] = a[7]*b
		return res


	def sadd(a,b):
		res = R3()
		res[0] = a+b[0]
		res[1] = b[1]
		res[2] = b[2]
		res[3] = b[3]
		res[4] = b[4]
		res[5] = b[5]
		res[6] = b[6]
		res[7] = b[7]
		return res


	def adds(a,b):
		res = R3()
		res[0] = a[0]+b
		res[1] = a[1]
		res[2] = a[2]
		res[3] = a[3]
		res[4] = a[4]
		res[5] = a[5]
		res[6] = a[6]
		res[7] = a[7]
		return res


	def norm(a):
		return math.sqrt(math.fabs((a * a.Conjugate())[0]))

	def inorm(a):
		return a.Dual().norm()
		
	def normalized(a):
		return a * (1 / a.norm())

e1 = R3(1.0, 1)
e2 = R3(1.0, 2)
e3 = R3(1.0, 3)
e12 = R3(1.0, 4)
e13 = R3(1.0, 5)
e23 = R3(1.0, 6)
e123 = R3(1.0, 7)
if __name__ == '__main__':
    print("e1*e1         :", str(e1*e1))
    print("pss           :", str(e123))
    print("pss*pss       :", str(e123*e123))


