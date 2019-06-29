## 3D Projective Geometric Algebra
## Written by a generator written by enki.
import math
class R2:
	def __init__(self, v=0, i=0):
		self.mvec = [0]*4
		self._base = ["1","e1","e2","e12"]
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
	# R2.Reverse
	# Reverse the order of the basis blades.
	########################## 
	def __invert__(a):
		res = R2()
		res[0]=a[0]
		res[1]=a[1]
		res[2]=a[2]
		res[3]=-a[3]
		return res

	########################## 
	# R2.Dual
	# Poincare duality operator.
	########################## 
	def Dual(a):
		res = R2()
		res[0]=-a[3]
		res[1]=a[2]
		res[2]=-a[1]
		res[3]=a[0]
		return res

	########################## 
	# R2.Conjugate
	# Clifford Conjugation
	########################## 
	def Conjugate(a):
		res = R2()
		res[0]=a[0]
		res[1]=-a[1]
		res[2]=-a[2]
		res[3]=-a[3]
		return res

	########################## 
	# R2.Involute
	# Main involution
	########################## 
	def Involute(a):
		res = R2()
		res[0]=a[0]
		res[1]=-a[1]
		res[2]=-a[2]
		res[3]=a[3]
		return res

	########################## 
	# R2.Mul
	# The geometric product.
	##########################
	def __mul__(a,b):
		if type(b) in (int,float):
			 return a.muls(b)
		res = R2()
		res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]-b[3]*a[3]
		res[1]=b[1]*a[0]+b[0]*a[1]-b[3]*a[2]+b[2]*a[3]
		res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3]
		res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3]
		return res
	__rmul__=__mul__

	########################## 
	# R2.Wedge
	# The outer product. (MEET)
	##########################
	def __xor__(a,b):
		res = R2()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		res[2]=b[2]*a[0]+b[0]*a[2]
		res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3]
		return res


	########################## 
	# R2.Vee
	# The regressive product. (JOIN)
	##########################
	def __and__(a,b):
		res = R2()
		res[3]=b[3]*a[3]
		res[2]=b[2]*a[3]+b[3]*a[2]
		res[1]=b[1]*a[3]+b[3]*a[1]
		res[0]=b[0]*a[3]+b[1]*a[2]-b[2]*a[1]+b[3]*a[0]
		return res


	########################## 
	# R2.Dot
	# The inner product.
	##########################
	def __or__(a,b):
		res = R2()
		res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]-b[3]*a[3]
		res[1]=b[1]*a[0]+b[0]*a[1]-b[3]*a[2]+b[2]*a[3]
		res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3]
		res[3]=b[3]*a[0]+b[0]*a[3]
		return res


	########################## 
	# R2.Add
	# Multivector addition
	##########################
	def __add__(a,b):
		if type(b) in (int,float):
			 return a.adds(b)
		res = R2()
		res[0] = a[0]+b[0]
		res[1] = a[1]+b[1]
		res[2] = a[2]+b[2]
		res[3] = a[3]+b[3]
		return res
	__radd__=__add__

	########################## 
	# R2.Sub
	# Multivector subtraction
	##########################
	def __sub__(a,b):
		if type(b) in (int,float):
			 return a.subs(b)
		res = R2()
		res[0] = a[0]-b[0]
		res[1] = a[1]-b[1]
		res[2] = a[2]-b[2]
		res[3] = a[3]-b[3]
		return res
	__rsub__=__sub__

	########################## 
	# R2.smul
	# scalar/multivector multiplication
	##########################
	def smul(a,b):
		res = R2()
		res[0] = a*b[0]
		res[1] = a*b[1]
		res[2] = a*b[2]
		res[3] = a*b[3]
		return res


	########################## 
	# R2.muls
	# multivector/scalar multiplication
	##########################
	def muls(a,b):
		res = R2()
		res[0] = a[0]*b
		res[1] = a[1]*b
		res[2] = a[2]*b
		res[3] = a[3]*b
		return res


	########################## 
	# R2.sadd
	# scalar/multivector addition
	##########################
	def sadd(a,b):
		res = R2()
		res[0] = a+b[0]
		res[1] = b[1]
		res[2] = b[2]
		res[3] = b[3]
		return res


	########################## 
	# R2.adds
	# multivector/scalar addition
	##########################
	def adds(a,b):
		res = R2()
		res[0] = a[0]+b
		res[1] = a[1]
		res[2] = a[2]
		res[3] = a[3]
		return res


	def norm(a):
		return math.sqrt(math.fabs((a*a.Conjugate())[0]))

	def inorm(a):
		return a.Dual().norm()
		
	def normalized(a):
		return a*(1/a.norm())

e1 = R2(1.0,1)
e2 = R2(1.0,2)
e12 = R2(1.0,3)

print("e1*e1         :", str(e1*e1))
print("pss           :", str(e12))
print("pss*pss       :", str(e12*e12))

