// python Template for the preamble
var preamble = (basis,classname)=>
`"""3D Projective Geometric Algebra.

Written by a generator written by enki.
"""

__author__ = \'Enki\'

import math

class ${classname}:
    def __init__(self, value=0, index=0):
        """Initiate a new ${classname}.
         
        Optional, the component index can be set with value.
        """
        self.mvec = [0] * ${basis.length}
        self._base = [${basis.map(x=>'"'+x+'"').join(', ')}]
        if (value != 0):
            self.mvec[index] = value
            
    @classmethod
    def fromarray(cls, array):
        """Initiate a new ${classname} from an array-like object.

        The first axis of the array is assumed to correspond to the elements
        of the algebra, and needs to have the same length. Any other dimensions
        are left unchanged, and should have simple operations such as addition 
        and multiplication defined. NumPy arrays are therefore a perfect 
        candidate. 

        :param array: array-like object whose length is the dimension of the algebra.
        :return: new instance of ${classname}.
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
        return len(self.mvec)`

// python Template for our binary operators

var binary = (classname, symbol, name, name_a, name_b, name_ret, code, classname_a=classname, classname_b=classname, desc)=>
`    def ${(name.match(/^s[^u]/) || name.match(/s$/))?name:({"+":"__add__","-":"__sub__","*":"__mul__","^":"__xor__","&":"__and__","|":"__or__"}[symbol]||name)}(${name_a},${name_b}):${(name in {Mul:1,Add:1,Sub:1})?`
        """${classname}.${name}
        
        ${desc}
        """
        if type(${name_b}) in (int, float):
            return ${name_a}.${name.toLowerCase()}s(${name_b})`:``}
        ${name_ret} = ${name_a}.mvec.copy()
        ${code.replace(/;/g,'').replace(/^ */g,'').replace(/\n */g,'\n        ')}
        return ${classname}.fromarray(${name_ret})
${(name in {Mul:1,Add:1})?`    __r${name.toLowerCase()}__=__${name.toLowerCase()}__`:((name in {Sub:1})?`
    def __r${name.toLowerCase()}__(${name_a},${name_b}):
        """${classname}.${name}
                
        ${desc}
        """
        return ${name_b} + -1 * ${name_a}
`:``)}`;

// python Template for our unary operators

var unary = (classname, symbol, name, name_a, name_ret, code, classname_a=classname,desc)=>
`    def ${({"~":"__invert__"}[symbol]||name)}(${name_a}):
        """${classname}.${name}
        
        ${desc}
        """
        ${name_ret} = ${name_a}.mvec.copy()
        ${code.replace(/;/g,'').replace(/^ */g,'').replace(/\n */g,'\n        ')}
        return ${classname}.fromarray(${name_ret})`;

// python template for CGA example
var CGA = (basis,classname)=>({
preamble:
``,
amble:
`
if __name__ == '__main__':
    # CGA is point based. Vectors are points.
    E1 = ${classname}(1.0, 1)
    E2 = ${classname}(1.0, 2)
    E3 = ${classname}(1.0, 3)
    E4 = ${classname}(1.0, 4)
    E5 = ${classname}(1.0, 5)

    EO = E4 + E5
    EI = (E5 - E4) * 0.5

    def up(x, y, z):
	    return x * E1 + y * E2 + z * E3 + 0.5 * (x * x + y * y + z * z) * EI + EO

    PX = up(1, 2, 3)
    LINE = PX ^ EO ^ EI
    SPHERE = (EO - EI).Dual()

    # output some numbers.
    print("a point       :", str(PX))
    print("a line        :", str(LINE))
    print("a sphere      :", str(SPHERE))
`
});

// python template for algebras without example
var GENERIC = (basis,classname)=>({
preamble:`
`,
amble:`
${basis.slice(1).map((x,i)=>`${x} = ${classname}(1.0, ${i+1})`).join('\n')}

if __name__ == '__main__':
    print("${basis[1]}*${basis[1]}         :", str(${basis[1]}*${basis[1]}))
    print("pss           :", str(${basis[basis.length-1]}))
    print("pss*pss       :", str(${basis[basis.length-1]}*${basis[basis.length-1]}))
`
})

// python template for PGA example
var PGA3D = (basis,classname)=>({
preamble:
``,
amble:
`
if __name__ == '__main__':
    # A rotor (Euclidean line) and translator (Ideal line)
    def rotor(angle, line):
	    return math.cos(angle / 2.0) + math.sin(angle / 2.0) * line.normalized()
	
    def translator(dist, line):
	    return 1.0 + dist / 2.0 * line

    # PGA is plane based. Vectors are planes. (think linear functionals)
    E0 = ${classname}(1.0, 1)           # ideal plane
    E1 = ${classname}(1.0, 2)           # x=0 plane
    E2 = ${classname}(1.0, 3)           # y=0 plane
    E3 = ${classname}(1.0, 4)           # z=0 plane

    # A plane is defined using its homogenous equation ax + by + cz + d = 0 
    def PLANE(a, b, c, d):
        return a * E1 + b * E2 + c * E3 + d * E0

    # PGA points are trivectors.
    E123 = E1 ^ E2 ^ E3
    E032 = E0 ^ E3 ^ E2
    E013 = E0 ^ E1 ^ E3
    E021 = E0 ^ E2 ^ E1

    # A point is just a homogeneous point, euclidean coordinates plus the origin
    def POINT(x, y, z):
        return E123 + x * E032 + y * E013 + z * E021

    # for our toy problem (generate points on the surface of a torus)
    # we start with a function that generates motors.
    # circle(t) with t going from 0 to 1.
    def CIRCLE(t, radius, line):
    	return rotor(t * math.pi * 2.0, line) * translator(radius, E1 * E0)
	
    # a torus is now the product of two circles.
    def TORUS(s, t, r1, l1, r2, l2):
	    return CIRCLE(s, r2, l2)*CIRCLE(t, r1, l1)

    # sample the torus points by sandwich with the origin
    def POINT_ON_TORUS(s, t):
	    to = TORUS(s, t, 0.25, E1 * E2, 0.6, E1 * E3)
	    return to * E123 * ~to

    # Elements of the even subalgebra (scalar + bivector + pss) of unit length are motors
    ROT = rotor(math.pi / 2.0, E1 * E2)

    # The outer product ^ is the MEET. Here we intersect the yz (x=0) and xz (y=0) planes.
    AXZ = E1 ^ E2                # x=0, y=0 -> z-axis line

    # line and plane meet in point. We intersect the line along the z-axis (x=0,y=0) with the xy (z=0) plane.
    ORIG = AXZ ^ E3              # x=0, y=0, z=0 -> origin

    # We can also easily create points and join them into a line using the regressive (vee, &) product.
    PX = POINT(1, 0, 0)
    LINE = ORIG & PX             # & = regressive product, JOIN, here, x-axis line.

    # Lets also create the plane with equation 2x + z - 3 = 0
    P = PLANE(2, 0, 1, -3)

    # rotations work on all elements ..
    ROTATED_LINE = ROT * LINE * ~ROT
    ROTATED_POINT = ROT * PX * ~ROT
    ROTATED_PLANE = ROT * P * ~ROT

    # See the 3D PGA Cheat sheet for a huge collection of useful formulas
    POINT_ON_PLANE = (P | PX) * P

    # output some numbers.
    print("a point       :", str(PX))
    print("a line        :", str(LINE))
    print("a plane       :", str(P))
    print("a rotor       :", str(ROT))
    print("rotated line  :", str(ROTATED_LINE))
    print("rotated point :", str(ROTATED_POINT))
    print("rotated plane :", str(ROTATED_PLANE))
    print("point on plane:", str(POINT_ON_PLANE.normalized()))
    print("point on torus:", str(POINT_ON_TORUS(0.0, 0.0)))
    print(E0 - 1)
    print(1 - E0)
`
})

// python Template for the postamble
var postamble = (basis,classname,example)=>
`    def norm(a):
        return abs((a * a.Conjugate())[0])**0.5
        
    def inorm(a):
        return a.Dual().norm()
        
    def normalized(a):
        return a * (1 / a.norm())
${example.amble}
`;

Object.assign(exports,{preamble,postamble,unary,binary,desc:"python",PGA3D,CGA,GENERIC});
