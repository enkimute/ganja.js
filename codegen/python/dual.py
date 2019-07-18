"""3D Projective Geometric Algebra.

Written by a generator written by enki.
"""

__author__ = 'Enki'

import math

class DUAL:
	def __init__(self, value=0, index=0):
		"""Initiate a new DUAL.
		 
		Optional, the component ``index`` can be set with ``value``.
		"""
		self.mvec = [0]*2
		self._base = ["1","e0"]
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
		"""DUAL.Reverse
		
		Reverse the order of the basis blades.
		"""
		res = DUAL()
		res[0]=a[0]
		res[1]=a[1]
		return res

	def Dual(a):
		"""DUAL.Dual
		
		Poincare duality operator.
		"""
		res = DUAL()
		res[0]=a[1]
		res[1]=a[0]
		return res

	def Conjugate(a):
		"""DUAL.Conjugate
		
		Clifford Conjugation
		"""
		res = DUAL()
		res[0]=a[0]
		res[1]=-a[1]
		return res

	def Involute(a):
		"""DUAL.Involute
		
		Main involution
		"""
		res = DUAL()
		res[0]=a[0]
		res[1]=-a[1]
		return res

	def __mul__(a,b):
		"""DUAL.Mul
		
		The geometric product.
		"""
		if type(b) in (int, float):
			 return a.muls(b)
		res = DUAL()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res
	__rmul__=__mul__

	def __xor__(a,b):
		res = DUAL()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res


	def __and__(a,b):
		res = DUAL()
		res[1]=b[1]*a[1]
		res[0]=b[0]*a[1]+b[1]*a[0]
		return res


	def __or__(a,b):
		res = DUAL()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res


	def __add__(a,b):
		"""DUAL.Add
		
		Multivector addition
		"""
		if type(b) in (int, float):
			 return a.adds(b)
		res = DUAL()
		res[0] = a[0]+b[0]
		res[1] = a[1]+b[1]
		return res
	__radd__=__add__

	def __sub__(a,b):
		"""DUAL.Sub
		
		Multivector subtraction
		"""
		if type(b) in (int, float):
			 return a.subs(b)
		res = DUAL()
		res[0] = a[0]-b[0]
		res[1] = a[1]-b[1]
		return res
	__rsub__=__sub__

	def smul(a,b):
		res = DUAL()
		res[0] = a*b[0]
		res[1] = a*b[1]
		return res


	def muls(a,b):
		res = DUAL()
		res[0] = a[0]*b
		res[1] = a[1]*b
		return res


	def sadd(a,b):
		res = DUAL()
		res[0] = a+b[0]
		res[1] = b[1]
		return res


	def adds(a,b):
		res = DUAL()
		res[0] = a[0]+b
		res[1] = a[1]
		return res


	def norm(a):
		return math.sqrt(math.fabs((a * a.Conjugate())[0]))

	def inorm(a):
		return a.Dual().norm()
		
	def normalized(a):
		return a * (1 / a.norm())

e0 = DUAL(1.0, 1)
if __name__ == '__main__':
    print("e0*e0         :", str(e0*e0))
    print("pss           :", str(e0))
    print("pss*pss       :", str(e0*e0))


