## 3D Projective Geometric Algebra
## Written by a generator written by enki.
import math
class PGA3D:
	def __init__(self, v=0, i=0):
		self.mvec = [0]*16
		self._base = ["1","e0","e1","e2","e3","e01","e02","e03","e12","e31","e23","e021","e013","e032","e123","e0123"]
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
	# PGA3D.Reverse
	# Reverse the order of the basis blades.
	########################## 
	def __invert__(a):
		res = PGA3D()
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
		return res

	########################## 
	# PGA3D.Dual
	# Poincare duality operator.
	########################## 
	def Dual(a):
		res = PGA3D()
		res[0]=a[15]
		res[1]=a[14]
		res[2]=a[13]
		res[3]=a[12]
		res[4]=a[11]
		res[5]=a[10]
		res[6]=a[9]
		res[7]=a[8]
		res[8]=a[7]
		res[9]=a[6]
		res[10]=a[5]
		res[11]=a[4]
		res[12]=a[3]
		res[13]=a[2]
		res[14]=a[1]
		res[15]=a[0]
		return res

	########################## 
	# PGA3D.Conjugate
	# Clifford Conjugation
	########################## 
	def Conjugate(a):
		res = PGA3D()
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
		return res

	########################## 
	# PGA3D.Involute
	# Main involution
	########################## 
	def Involute(a):
		res = PGA3D()
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
		return res

	########################## 
	# PGA3D.Mul
	# The geometric product.
	##########################
	def __mul__(a,b):
		if type(b) in (int,float):
			 return a.muls(b)
		res = PGA3D()
		res[0]=b[0]*a[0]+b[2]*a[2]+b[3]*a[3]+b[4]*a[4]-b[8]*a[8]-b[9]*a[9]-b[10]*a[10]-b[14]*a[14]
		res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]-b[7]*a[4]+b[2]*a[5]+b[3]*a[6]+b[4]*a[7]+b[11]*a[8]+b[12]*a[9]+b[13]*a[10]+b[8]*a[11]+b[9]*a[12]+b[10]*a[13]+b[15]*a[14]-b[14]*a[15]
		res[2]=b[2]*a[0]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]+b[3]*a[8]-b[4]*a[9]-b[14]*a[10]-b[10]*a[14]
		res[3]=b[3]*a[0]+b[8]*a[2]+b[0]*a[3]-b[10]*a[4]-b[2]*a[8]-b[14]*a[9]+b[4]*a[10]-b[9]*a[14]
		res[4]=b[4]*a[0]-b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[14]*a[8]+b[2]*a[9]-b[3]*a[10]-b[8]*a[14]
		res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]-b[11]*a[3]+b[12]*a[4]+b[0]*a[5]-b[8]*a[6]+b[9]*a[7]+b[6]*a[8]-b[7]*a[9]-b[15]*a[10]-b[3]*a[11]+b[4]*a[12]+b[14]*a[13]-b[13]*a[14]-b[10]*a[15]
		res[6]=b[6]*a[0]+b[3]*a[1]+b[11]*a[2]-b[1]*a[3]-b[13]*a[4]+b[8]*a[5]+b[0]*a[6]-b[10]*a[7]-b[5]*a[8]-b[15]*a[9]+b[7]*a[10]+b[2]*a[11]+b[14]*a[12]-b[4]*a[13]-b[12]*a[14]-b[9]*a[15]
		res[7]=b[7]*a[0]+b[4]*a[1]-b[12]*a[2]+b[13]*a[3]-b[1]*a[4]-b[9]*a[5]+b[10]*a[6]+b[0]*a[7]-b[15]*a[8]+b[5]*a[9]-b[6]*a[10]+b[14]*a[11]-b[2]*a[12]+b[3]*a[13]-b[11]*a[14]-b[8]*a[15]
		res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[14]*a[4]+b[0]*a[8]+b[10]*a[9]-b[9]*a[10]+b[4]*a[14]
		res[9]=b[9]*a[0]-b[4]*a[2]+b[14]*a[3]+b[2]*a[4]-b[10]*a[8]+b[0]*a[9]+b[8]*a[10]+b[3]*a[14]
		res[10]=b[10]*a[0]+b[14]*a[2]+b[4]*a[3]-b[3]*a[4]+b[9]*a[8]-b[8]*a[9]+b[0]*a[10]+b[2]*a[14]
		res[11]=b[11]*a[0]-b[8]*a[1]+b[6]*a[2]-b[5]*a[3]+b[15]*a[4]-b[3]*a[5]+b[2]*a[6]-b[14]*a[7]-b[1]*a[8]+b[13]*a[9]-b[12]*a[10]+b[0]*a[11]+b[10]*a[12]-b[9]*a[13]+b[7]*a[14]-b[4]*a[15]
		res[12]=b[12]*a[0]-b[9]*a[1]-b[7]*a[2]+b[15]*a[3]+b[5]*a[4]+b[4]*a[5]-b[14]*a[6]-b[2]*a[7]-b[13]*a[8]-b[1]*a[9]+b[11]*a[10]-b[10]*a[11]+b[0]*a[12]+b[8]*a[13]+b[6]*a[14]-b[3]*a[15]
		res[13]=b[13]*a[0]-b[10]*a[1]+b[15]*a[2]+b[7]*a[3]-b[6]*a[4]-b[14]*a[5]-b[4]*a[6]+b[3]*a[7]+b[12]*a[8]-b[11]*a[9]-b[1]*a[10]+b[9]*a[11]-b[8]*a[12]+b[0]*a[13]+b[5]*a[14]-b[2]*a[15]
		res[14]=b[14]*a[0]+b[10]*a[2]+b[9]*a[3]+b[8]*a[4]+b[4]*a[8]+b[3]*a[9]+b[2]*a[10]+b[0]*a[14]
		res[15]=b[15]*a[0]+b[14]*a[1]+b[13]*a[2]+b[12]*a[3]+b[11]*a[4]+b[10]*a[5]+b[9]*a[6]+b[8]*a[7]+b[7]*a[8]+b[6]*a[9]+b[5]*a[10]-b[4]*a[11]-b[3]*a[12]-b[2]*a[13]-b[1]*a[14]+b[0]*a[15]
		return res
	__rmul__=__mul__

	########################## 
	# PGA3D.Wedge
	# The outer product. (MEET)
	##########################
	def __xor__(a,b):
		res = PGA3D()
		res[0]=b[0]*a[0]
		res[1]=b[1]*a[0]+b[0]*a[1]
		res[2]=b[2]*a[0]+b[0]*a[2]
		res[3]=b[3]*a[0]+b[0]*a[3]
		res[4]=b[4]*a[0]+b[0]*a[4]
		res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[5]
		res[6]=b[6]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[6]
		res[7]=b[7]*a[0]+b[4]*a[1]-b[1]*a[4]+b[0]*a[7]
		res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[8]
		res[9]=b[9]*a[0]-b[4]*a[2]+b[2]*a[4]+b[0]*a[9]
		res[10]=b[10]*a[0]+b[4]*a[3]-b[3]*a[4]+b[0]*a[10]
		res[11]=b[11]*a[0]-b[8]*a[1]+b[6]*a[2]-b[5]*a[3]-b[3]*a[5]+b[2]*a[6]-b[1]*a[8]+b[0]*a[11]
		res[12]=b[12]*a[0]-b[9]*a[1]-b[7]*a[2]+b[5]*a[4]+b[4]*a[5]-b[2]*a[7]-b[1]*a[9]+b[0]*a[12]
		res[13]=b[13]*a[0]-b[10]*a[1]+b[7]*a[3]-b[6]*a[4]-b[4]*a[6]+b[3]*a[7]-b[1]*a[10]+b[0]*a[13]
		res[14]=b[14]*a[0]+b[10]*a[2]+b[9]*a[3]+b[8]*a[4]+b[4]*a[8]+b[3]*a[9]+b[2]*a[10]+b[0]*a[14]
		res[15]=b[15]*a[0]+b[14]*a[1]+b[13]*a[2]+b[12]*a[3]+b[11]*a[4]+b[10]*a[5]+b[9]*a[6]+b[8]*a[7]+b[7]*a[8]+b[6]*a[9]+b[5]*a[10]-b[4]*a[11]-b[3]*a[12]-b[2]*a[13]-b[1]*a[14]+b[0]*a[15]
		return res


	########################## 
	# PGA3D.Vee
	# The regressive product. (JOIN)
	##########################
	def __and__(a,b):
		res = PGA3D()
		res[15]=b[15]*a[15]
		res[14]=b[14]*a[15]+b[15]*a[14]
		res[13]=b[13]*a[15]+b[15]*a[13]
		res[12]=b[12]*a[15]+b[15]*a[12]
		res[11]=b[11]*a[15]+b[15]*a[11]
		res[10]=b[10]*a[15]+b[13]*a[14]-b[14]*a[13]+b[15]*a[10]
		res[9]=b[9]*a[15]+b[12]*a[14]-b[14]*a[12]+b[15]*a[9]
		res[8]=b[8]*a[15]+b[11]*a[14]-b[14]*a[11]+b[15]*a[8]
		res[7]=b[7]*a[15]+b[12]*a[13]-b[13]*a[12]+b[15]*a[7]
		res[6]=b[6]*a[15]-b[11]*a[13]+b[13]*a[11]+b[15]*a[6]
		res[5]=b[5]*a[15]+b[11]*a[12]-b[12]*a[11]+b[15]*a[5]
		res[4]=b[4]*a[15]-b[7]*a[14]+b[9]*a[13]-b[10]*a[12]-b[12]*a[10]+b[13]*a[9]-b[14]*a[7]+b[15]*a[4]
		res[3]=b[3]*a[15]-b[6]*a[14]-b[8]*a[13]+b[10]*a[11]+b[11]*a[10]-b[13]*a[8]-b[14]*a[6]+b[15]*a[3]
		res[2]=b[2]*a[15]-b[5]*a[14]+b[8]*a[12]-b[9]*a[11]-b[11]*a[9]+b[12]*a[8]-b[14]*a[5]+b[15]*a[2]
		res[1]=b[1]*a[15]+b[5]*a[13]+b[6]*a[12]+b[7]*a[11]+b[11]*a[7]+b[12]*a[6]+b[13]*a[5]+b[15]*a[1]
		res[0]=b[0]*a[15]+b[1]*a[14]+b[2]*a[13]+b[3]*a[12]+b[4]*a[11]+b[5]*a[10]+b[6]*a[9]+b[7]*a[8]+b[8]*a[7]+b[9]*a[6]+b[10]*a[5]-b[11]*a[4]-b[12]*a[3]-b[13]*a[2]-b[14]*a[1]+b[15]*a[0]
		return res


	########################## 
	# PGA3D.Dot
	# The inner product.
	##########################
	def __or__(a,b):
		res = PGA3D()
		res[0]=b[0]*a[0]+b[2]*a[2]+b[3]*a[3]+b[4]*a[4]-b[8]*a[8]-b[9]*a[9]-b[10]*a[10]-b[14]*a[14]
		res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]-b[7]*a[4]+b[2]*a[5]+b[3]*a[6]+b[4]*a[7]+b[11]*a[8]+b[12]*a[9]+b[13]*a[10]+b[8]*a[11]+b[9]*a[12]+b[10]*a[13]+b[15]*a[14]-b[14]*a[15]
		res[2]=b[2]*a[0]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]+b[3]*a[8]-b[4]*a[9]-b[14]*a[10]-b[10]*a[14]
		res[3]=b[3]*a[0]+b[8]*a[2]+b[0]*a[3]-b[10]*a[4]-b[2]*a[8]-b[14]*a[9]+b[4]*a[10]-b[9]*a[14]
		res[4]=b[4]*a[0]-b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[14]*a[8]+b[2]*a[9]-b[3]*a[10]-b[8]*a[14]
		res[5]=b[5]*a[0]-b[11]*a[3]+b[12]*a[4]+b[0]*a[5]-b[15]*a[10]-b[3]*a[11]+b[4]*a[12]-b[10]*a[15]
		res[6]=b[6]*a[0]+b[11]*a[2]-b[13]*a[4]+b[0]*a[6]-b[15]*a[9]+b[2]*a[11]-b[4]*a[13]-b[9]*a[15]
		res[7]=b[7]*a[0]-b[12]*a[2]+b[13]*a[3]+b[0]*a[7]-b[15]*a[8]-b[2]*a[12]+b[3]*a[13]-b[8]*a[15]
		res[8]=b[8]*a[0]+b[14]*a[4]+b[0]*a[8]+b[4]*a[14]
		res[9]=b[9]*a[0]+b[14]*a[3]+b[0]*a[9]+b[3]*a[14]
		res[10]=b[10]*a[0]+b[14]*a[2]+b[0]*a[10]+b[2]*a[14]
		res[11]=b[11]*a[0]+b[15]*a[4]+b[0]*a[11]-b[4]*a[15]
		res[12]=b[12]*a[0]+b[15]*a[3]+b[0]*a[12]-b[3]*a[15]
		res[13]=b[13]*a[0]+b[15]*a[2]+b[0]*a[13]-b[2]*a[15]
		res[14]=b[14]*a[0]+b[0]*a[14]
		res[15]=b[15]*a[0]+b[0]*a[15]
		return res


	########################## 
	# PGA3D.Add
	# Multivector addition
	##########################
	def __add__(a,b):
		if type(b) in (int,float):
			 return a.adds(b)
		res = PGA3D()
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
		return res
	__radd__=__add__

	########################## 
	# PGA3D.Sub
	# Multivector subtraction
	##########################
	def __sub__(a,b):
		if type(b) in (int,float):
			 return a.subs(b)
		res = PGA3D()
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
		return res
	__rsub__=__sub__

	########################## 
	# PGA3D.smul
	# scalar/multivector multiplication
	##########################
	def smul(a,b):
		res = PGA3D()
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
		return res


	########################## 
	# PGA3D.muls
	# multivector/scalar multiplication
	##########################
	def muls(a,b):
		res = PGA3D()
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
		return res


	########################## 
	# PGA3D.sadd
	# scalar/multivector addition
	##########################
	def sadd(a,b):
		res = PGA3D()
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
		return res


	########################## 
	# PGA3D.adds
	# multivector/scalar addition
	##########################
	def adds(a,b):
		res = PGA3D()
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
		return res


	def norm(a):
		return math.sqrt(math.fabs((a*a.Conjugate())[0]))

	def inorm(a):
		return a.Dual().norm()
		
	def normalized(a):
		return a*(1/a.norm())

# A rotor (Euclidean line) and translator (Ideal line)
def rotor(angle,line):
	return math.cos(angle/2.0) + math.sin(angle/2.0)*line.normalized()
	
def translator(dist,line):
	return 1.0 + dist/2.0*line

# PGA is plane based. Vectors are planes. (think linear functionals)
E0 = PGA3D(1.0,1)           # ideal plane
E1 = PGA3D(1.0,2)           # x=0 plane
E2 = PGA3D(1.0,3)           # y=0 plane
E3 = PGA3D(1.0,4)           # z=0 plane

# A plane is defined using its homogenous equation ax + by + cz + d = 0 
def PLANE(a,b,c,d):
        return a*E1 + b*E2 + c*E3 + d*E0

# PGA points are trivectors.
E123 = E1^E2^E3
E032 = E0^E3^E2
E013 = E0^E1^E3
E021 = E0^E2^E1

# A point is just a homogeneous point, euclidean coordinates plus the origin
def POINT(x,y,z):
        return E123 + x*E032 + y*E013 + z*E021

# for our toy problem (generate points on the surface of a torus)
# we start with a function that generates motors.
# circle(t) with t going from 0 to 1.
def CIRCLE(t,radius,line):
	return rotor(t*math.pi*2.0,line)*translator(radius,E1*E0)
	
# a torus is now the product of two circles.
def TORUS(s,t,r1,l1,r2,l2):
	return CIRCLE(s,r2,l2)*CIRCLE(t,r1,l1)

# sample the torus points by sandwich with the origin
def POINT_ON_TORUS(s,t):
	to = TORUS(s,t,0.25,E1*E2,0.6,E1*E3)
	return to * E123 * ~to

# Elements of the even subalgebra (scalar + bivector + pss) of unit length are motors
ROT = rotor(math.pi/2.0,E1*E2)

# The outer product ^ is the MEET. Here we intersect the yz (x=0) and xz (y=0) planes.
AXZ = E1 ^ E2                # x=0, y=0 -> z-axis line

# line and plane meet in point. We intersect the line along the z-axis (x=0,y=0) with the xy (z=0) plane.
ORIG = AXZ ^ E3              # x=0, y=0, z=0 -> origin

# We can also easily create points and join them into a line using the regressive (vee, &) product.
PX = POINT(1,0,0)
LINE = ORIG & PX             # & = regressive product, JOIN, here, x-axis line.

# Lets also create the plane with equation 2x + z - 3 = 0
P = PLANE(2,0,1,-3)

# rotations work on all elements ..
ROTATED_LINE = ROT * LINE * ~ROT
ROTATED_POINT = ROT * PX * ~ROT
ROTATED_PLANE = ROT * P * ~ROT

# See the 3D PGA Cheat sheet for a huge collection of useful formulas
POINT_ON_PLANE = (P | PX) * P

# output some numbers.
print("a point       :",str(PX))
print("a line        :",str(LINE))
print("a plane       :",str(P))
print("a rotor       :",str(ROT))
print("rotated line  :",str(ROTATED_LINE))
print("rotated point :",str(ROTATED_POINT))
print("rotated plane :",str(ROTATED_PLANE))
print("point on plane:",str(POINT_ON_PLANE.normalized()))
print("point on torus:",str(POINT_ON_TORUS(0.0,0.0)))

