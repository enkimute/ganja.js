// c++ Template for the preamble
var preamble = (basis,classname)=>
`// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { ${basis.map(x=>'"'+x+'"').join(',')} };

class ${classname} {
  public:
    ${classname} ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    ${classname} (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    ${classname} log () { int n=0; for (int i=0,j=0;i<${basis.length};i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\\n"); return *this; }
    ${classname} Conjugate(); 
    ${classname} Involute();
    float norm();
    float inorm();
    ${classname} normalized();
  private:  
    float mvec[${basis.length}];
};
`

// C++ Template for our binary operators

var binary = (classname, symbol, name, name_a, name_b, name_ret, code, classname_a=classname, classname_b=classname, desc)=>
`//***********************
// ${classname}.${name} : ${name_ret} = ${symbol?name_a+" "+symbol+" "+name_b:name_a+"."+name+"("+name_b+")"} 
// ${desc}
//***********************
inline ${classname} ${symbol?"operator "+symbol:name} (const ${classname_a} &${name_a}, const ${classname_b} &${name_b}) {
  ${classname} ${name_ret};
  ${code}
  return ${name_ret};
};`

// c++ Template for our unary operators

var unary = (classname, symbol, name, name_a, name_ret, code, classname_a=classname, desc)=>
`//***********************
// ${classname}.${name} : ${name_ret} = ${symbol?symbol+name_a:name_a+"."+name+"()"}
// ${desc}
//***********************
inline ${classname} ${symbol?"operator "+symbol:classname+'::'+name} (${symbol?`const ${classname_a} &${name_a}`:``}) {
  ${classname} ${name_ret};
  ${symbol?code:code.replace(/a\[/g,'this->mvec[')}
  return ${name_ret};
};`

// c++ example for CGA
var CGA=(basis,classname)=>({
preamble:`
// PGA is point based. Vectors are points.
static ${classname} e1(1.0f,1), e2(1.0f,2), e3(1.0f,3), e4(1.0f,4), e5(1.0f,5);

// We seldomly work in the natural basis, but instead in a null basis
// for this we create two null vectors 'origin' and 'infinity'
static ${classname} eo = e4+e5, ei = 0.5f*(e5-e4);

// create a point from x,y,z coordinates
static ${classname} up(float x, float y, float z) {
  float d = x*x + y*y + z*z;
  return x*e1 + y*e2 + z*e3 + 0.5f*d*ei + eo;
}


`,
amble:`
  ${classname} px = up(1.0,2.0,3.0);
  ${classname} line = px ^ eo ^ ei;
  ${classname} sphere = !(eo-ei);
  printf("a point       : "); px.log();
  printf("a line        : "); line.log();
  printf("a sphere      : "); sphere.log();
`  
})

// c++ example for algebras without example
var GENERIC = (basis,classname)=>({
preamble:`
${basis.slice(1).map((x,i)=>`static ${classname} ${x}(1.0f,${i+1});`).join('\n')}
`,
amble:`
  printf("${basis[1]}*${basis[1]}         : "); (${basis[1]}*${basis[1]}).log();
  printf("pss           : "); ${basis[basis.length-1]}.log();
  printf("pss*pss       : "); (${basis[basis.length-1]}*${basis[basis.length-1]}).log();
`
})

// c++ example for PGA
var PGA3D = (basis,classname)=>({
preamble:`
// A rotor (Euclidean line) and translator (Ideal line)
static ${classname} rotor(float angle, ${classname} line) { return cos(angle/2.0f) + sin(angle/2.0f)*line.normalized(); }
static ${classname} translator(float dist, ${classname} line) { return 1.0f + dist/2.0f*line; }

// PGA is plane based. Vectors are planes. (think linear functionals)
static ${classname} e0(1.0f,1), e1(1.0f,2), e2(1.0f,3), e3(1.0f,4);

// A plane is defined using its homogenous equation ax + by + cz + d = 0
static ${classname} plane(float a,float b,float c,float d) { return a*e1 + b*e2 + c*e3 + d*e0; }

// PGA points are trivectors.
static ${classname} e123 = e1^e2^e3, e032 = e0^e3^e2, e013 = e0^e1^e3, e021 = e0^e2^e1;

// A point is just a homogeneous point, euclidean coordinates plus the origin
static ${classname} point(float x, float y, float z) { return e123 + x*e032 + y*e013 + z*e021; }

// for our toy problem (generate points on the surface of a torus)
// we start with a function that generates motors.
// circle(t) with t going from 0 to 1.
static ${classname} circle(float t, float radius, ${classname} line) {
  return rotor(t*2.0f*PI,line) * translator(radius,e1*e0);
}

// a torus is now the product of two circles.
static ${classname} torus(float s, float t, float r1, ${classname} l1, float r2, ${classname} l2) {
  return circle(s,r2,l2)*circle(t,r1,l1);
}

// and to sample its points we simply sandwich the origin ..
static ${classname} point_on_torus(float s, float t) {
  ${classname} to = torus(s,t,0.25f,e1*e2,0.6f,e1*e3);
  return to * e123 * ~to;
}
`,
amble:`
  // Elements of the even subalgebra (scalar + bivector + pss) of unit length are motors
  ${classname} rot = rotor( PI/2.0f, e1 * e2 );
  
  // The outer product ^ is the MEET. Here we intersect the yz (x=0) and xz (y=0) planes.
  ${classname} ax_z = e1 ^ e2;
  
  // line and plane meet in point. We intersect the line along the z-axis (x=0,y=0) with the xy (z=0) plane.
  ${classname} orig = ax_z ^ e3;
  
  // We can also easily create points and join them into a line using the regressive (vee, &) product.
  ${classname} px = point(1.0,0.0,0.0);
  ${classname} line = orig & px;
  
  // Lets also create the plane with equation 2x + z - 3 = 0
  ${classname} p = plane(2,0,1,-3);
  
  // rotations work on all elements
  ${classname} rotated_plane = rot * p * ~rot;
  ${classname} rotated_line  = rot * line * ~rot;
  ${classname} rotated_point = rot * px * ~rot;
  
  // See the 3D PGA Cheat sheet for a huge collection of useful formulas
  ${classname} point_on_plane = (p | px) * p;
  
  // Some output.
  printf("a point       : "); px.log();
  printf("a line        : "); line.log();
  printf("a plane       : "); p.log();
  printf("a rotor       : "); rot.log();
  printf("rotated line  : "); rotated_line.log();
  printf("rotated point : "); rotated_point.log();
  printf("rotated plane : "); rotated_plane.log();
  printf("point on plane: "); point_on_plane.normalized().log();
  printf("point on torus: "); point_on_torus(0.0f,0.0f).log();
  (e0-1.0f).log();
  (1.0f-e0).log();
`})

// c++ Template for the postamble
var postamble = (basis, classname, example)=>
`
inline float ${classname}::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float ${classname}::inorm() { return (!(*this)).norm(); }
inline ${classname} ${classname}::normalized() { return (*this) * (1/norm()); }

${example.preamble}

int main (int argc, char **argv) {
  ${example.amble}
  return 0;
}`;

Object.assign(exports,{preamble,postamble,unary,binary,desc:"c++",PGA3D,CGA,GENERIC});
