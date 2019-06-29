## 3D Projective Geometric Algebra
## Written by a generator written by enki.
import math
class DUAL:
	def __init__(self, v=0, i=0):
		self.mvec = [0]*2
		self._base = ["1","e0"]
		if (v!=0):
			self.mvec[i] = v
        
	def __str__(self):
		res = ' + '.join(filter(None, [("%.7f" % x).rstrip("0").rstrip(".")+(["",self._base[i]][i>0]) if math.fabs(x) > 0.000001 else None for i,x in enumerate(self.mvec)]))
		if (res == ''):
			return "0"
		return res

	def __getitem__(self,key):
		return self.mvec[key]

	def __setitem__(self,key,value):
		self.mvec[key]=value

	########################## 
	# DUAL.Reverse
	# Reverse the order of the basis blades.
	########################## 
	def __invert__(a):
		res = DUAL()
		res[0]=a[0]
		res[1]=a[1]
		return res

	########################## 
	# DUAL.Dual
	# Poincare duality operator.
	########################## 
	def Dual(a):
		res = DUAL()
		res[0]=a[1]
		res[1]=a[0]
		return res

	########################## 
	# DUAL.Conjugate
	# Clifford Conjugation
	########################## 
	def Conjugate(a):
		res = DUAL()
		res[0]=a[0]
		res[1]=-a[1]
		return res

	########################## 
	# DUAL.Involute
	# Main involution
	########################## 
	def Involute(a):
		res = DUAL()
		res[0]=a[0]
		res[1]=-a[1]
		return res

	########################## 
	# DUAL.Mul
	# The geometric product.
	##########################
	def __mul__(a,b):
		if type(b) in (int,float):
			 return a.muls(b)
		res = DUAL()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res
	__rmul__=__mul__

	########################## 
	# DUAL.Wedge
	# The outer product. (MEET)
	##########################
	def __xor__(a,b):
		res = DUAL()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res


	########################## 
	# DUAL.Vee
	# The regressive product. (JOIN)
	##########################
	def __and__(a,b):
		res = DUAL()
		res[1]=b[1]*a[1]
		res[0]=b[0]*a[1]+b[1]*a[0]
		return res


	########################## 
	# DUAL.Dot
	# The inner product.
	##########################
	def __or__(a,b):
		res = DUAL()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res


	########################## 
	# DUAL.Add
	# Multivector addition
	##########################
	def __add__(a,b):
		if type(b) in (int,float):
			 return a.adds(b)
		res = DUAL()
		res[0] = a[0]+b[0]
		res[1] = a[1]+b[1]
		return res
	__radd__=__add__

	########################## 
	# DUAL.Sub
	# Multivector subtraction
	##########################
	def __sub__(a,b):
		if type(b) in (int,float):
			 return a.subs(b)
		res = DUAL()
		res[0] = a[0]-b[0]
		res[1] = a[1]-b[1]
		return res
	__rsub__=__sub__

	########################## 
	# DUAL.smul
	# scalar/multivector multiplication
	##########################
	def smul(a,b):
		res = DUAL()
		res[0] = a*b[0]
		res[1] = a*b[1]
		return res


	########################## 
	# DUAL.muls
	# multivector/scalar multiplication
	##########################
	def muls(a,b):
		res = DUAL()
		res[0] = a[0]*b
		res[1] = a[1]*b
		return res


	########################## 
	# DUAL.sadd
	# scalar/multivector addition
	##########################
	def sadd(a,b):
		res = DUAL()
		res[0] = a+b[0]
		res[1] = b[1]
		return res


	########################## 
	# DUAL.adds
	# multivector/scalar addition
	##########################
	def adds(a,b):
		res = DUAL()
		res[0] = a[0]+b
		res[1] = a[1]
		return res


	def norm(a):
		return math.sqrt(math.fabs((a*a.Conjugate())[0]))

	def inorm(a):
		return a.Dual().norm()
		
	def normalized(a):
		return a*(1/a.norm())

e0 = DUAL(1.0,1)

print("e0*e0         :", str(e0*e0))
print("pss           :", str(e0))
print("pss*pss       :", str(e0*e0))

