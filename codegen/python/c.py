## 3D Projective Geometric Algebra
## Written by a generator written by enki.
import math
class C:
	def __init__(self, v=0, i=0):
		self.mvec = [0]*2
		self._base = ["1","e1"]
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
	# C.Reverse
	# Reverse the order of the basis blades.
	########################## 
	def __invert__(a):
		res = C()
		res[0]=a[0]
		res[1]=a[1]
		return res

	########################## 
	# C.Dual
	# Poincare duality operator.
	########################## 
	def Dual(a):
		res = C()
		res[0]=-a[1]
		res[1]=a[0]
		return res

	########################## 
	# C.Conjugate
	# Clifford Conjugation
	########################## 
	def Conjugate(a):
		res = C()
		res[0]=a[0]
		res[1]=-a[1]
		return res

	########################## 
	# C.Involute
	# Main involution
	########################## 
	def Involute(a):
		res = C()
		res[0]=a[0]
		res[1]=-a[1]
		return res

	########################## 
	# C.Mul
	# The geometric product.
	##########################
	def __mul__(a,b):
		if type(b) in (int,float):
			 return a.muls(b)
		res = C()
		res[0]=b[0]*a[0]-b[1]*a[1]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res
	__rmul__=__mul__

	########################## 
	# C.Wedge
	# The outer product. (MEET)
	##########################
	def __xor__(a,b):
		res = C()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res


	########################## 
	# C.Vee
	# The regressive product. (JOIN)
	##########################
	def __and__(a,b):
		res = C()
		res[1]=b[1]*a[1]
		res[0]=b[0]*a[1]+b[1]*a[0]
		return res


	########################## 
	# C.Dot
	# The inner product.
	##########################
	def __or__(a,b):
		res = C()
		res[0]=b[0]*a[0]-b[1]*a[1]
		res[1]=b[1]*a[0]+b[0]*a[1]
		return res


	########################## 
	# C.Add
	# Multivector addition
	##########################
	def __add__(a,b):
		if type(b) in (int,float):
			 return a.adds(b)
		res = C()
		res[0] = a[0]+b[0]
		res[1] = a[1]+b[1]
		return res
	__radd__=__add__

	########################## 
	# C.Sub
	# Multivector subtraction
	##########################
	def __sub__(a,b):
		if type(b) in (int,float):
			 return a.subs(b)
		res = C()
		res[0] = a[0]-b[0]
		res[1] = a[1]-b[1]
		return res
	__rsub__=__sub__

	########################## 
	# C.smul
	# scalar/multivector multiplication
	##########################
	def smul(a,b):
		res = C()
		res[0] = a*b[0]
		res[1] = a*b[1]
		return res


	########################## 
	# C.muls
	# multivector/scalar multiplication
	##########################
	def muls(a,b):
		res = C()
		res[0] = a[0]*b
		res[1] = a[1]*b
		return res


	########################## 
	# C.sadd
	# scalar/multivector addition
	##########################
	def sadd(a,b):
		res = C()
		res[0] = a+b[0]
		res[1] = b[1]
		return res


	########################## 
	# C.adds
	# multivector/scalar addition
	##########################
	def adds(a,b):
		res = C()
		res[0] = a[0]+b
		res[1] = a[1]
		return res


	def norm(a):
		return math.sqrt(math.fabs((a*a.Conjugate())[0]))

	def inorm(a):
		return a.Dual().norm()
		
	def normalized(a):
		return a*(1/a.norm())

e1 = C(1.0,1)

print("e1*e1         :", str(e1*e1))
print("pss           :", str(e1))
print("pss*pss       :", str(e1*e1))

