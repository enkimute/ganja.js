# ganja.js - Geometric Algebra for javascript.

**G**eometric **A**lgebra - **N**ot **J**ust **A**lgebra

<DIV STYLE="width:100%">
<CENTER><IMG SRC="ganja_thumb.jpg" WiDTH=100%></CENTER>
</DIV>

Ganja.js is a Geometric Algebra code generator for javascript. It supports
algebra's of any signature and implements advanced operator overloading and
algebraic constants.

* Supports any metric (p,q,r) (spacelike/timelike/lightlike)
* Operator overloading
* Algebraic constants
* smallish (138 lines)
* inverses up to 5D.
* geometric, inner, outer product
* conjugate, reverse, involute, dual, negative
* 4 API's (inline, asciimath, object oriented, functional)

To use it, first include the ganja.js script.
```html
<SCRIPT SRC="https://raw.githubusercontent.com/enkimute/ganja.js/master/ganja.js"></SCRIPT>
```
### Create your algebra class.

To create an Algebra, all you need to know is its metric. The Algebra
function will generate an ES6 class that implements the algebra with the
specified metric (p,q,r). (p = # of dimensions that square to 1, q = # that
square to -1, r = # that square to 0).

```javascript
var Complex = Algebra(0,1);     // Complex numbers.
var E2 = Algebra(2);            // Euclidean 2D space.
var E3 = Algebra(3);            // Euclidean 3D space.
var timeSpace = Algebra(3,1);   // timespace
var P3 = Algebra(3,0,1);        // Projective 3D space
var C3 = Algebra(4,1);          // Conformal 3D space
```

The result of this call will be an ES6 class object (deriving from
Float64Array). These classes can be used to generate algebra elements with
all expected operators available. Apart from the (default) OO syntax, they
also provide a functional syntax (through static member functions), and two
inline syntaxes (javascript and AsciiMath).

The Inline and AsciiMath syntaxes provide in full operator overloading and 
literal algebraic objects - targetting the more mathematically inclined. The 
Object Oriented and functional syntax on the other hand will probably feel 
more familiar to engineers and programmers.  

After creating your algebra you can view its properties (metric, Cayley
table, basis names) in the console with the describe function. 

```javascript
Complex.describe();
```
To use the inline syntax call the _inline_ function passing in your function
object, for the AsciiMath syntax, you pass in a string. In both cases the
_inline_ function will return a new function object. (where e-notation and
operators are resolved) 

```javascript
// Inline javascript syntax : 
Complex.inline(function(){
  return 2 + 3e1; // 2+3i
});

// Inline AsciiMath syntax : 
Complex.inline("2+3e_1")
```
### ganja.js Syntax Overview.

Here's a list of the supported operators in all syntax flavors : 

|Inline JS | AsciiMath | Object Oriented | Functional
|----------|-----------|-----------------|------------
| ~x       |  hat(x)   | x.Conjugate     | A.Conjugate(x)
| x.Involute|  tilde(x) | x.Involute      | A.Involute(x)
| x.Reverse|  ddot(x)  | x.Reverse       | A.Reverse(x)
| !x       |  hat(x)   | x.Dual          | A.Dual(x)
| x**-1    |  x^-1     | x.Inverse       | A.Inverse(x)
| x**y     |  x^y      | x.Pow(y)        | A.Pow(x,y)
| x*y      |  x**y     | x.Mul(y)        | A.Mul(x,y)
| x/y      |  x/y      | x.Div(y)        | A.Div(x,y)
| x^y      |  x^^y     | x.Wedge(y)      | A.Wedge(x,y)
| x<<y     |  x*y      | x.Dot(y)        | A.Dot(x,y)
| x-y      |  x-y      | x.Sub(y)        | A.Sub(x,y)
| x+y      |  x+y      | x.Add(y)        | A.Add(x,y)
| 1e1      |  1e_1     | new A([0,1])    | A.Vector(1)
| 2e2      |  2e_2     | new A([0,0,2,0])| A.Vector(0,2)
| 2e12     |  2e_12    | new A([0,0,0,2])| A.Bivector(2)

### Javascript inline syntax.

Ganja.js' inline syntax allows you to write GA statements seamlessly inside your
javascript functions. Simply wrap your functions to get full operator
overloading and algebraic constants.

To enable you to directly write algebraic constants, we overload the
scientific notation. Allowing you to write basis blade names 
**e<sub>1</sub>**, **e<sub>2</sub>**, **e<sub>12</sub>**,
**e<sub>235</sub>**, etc as : 

```javascript
// Direct algebraic objects specifying basisblades with e notation.
  var xy_bivector = 1e12;    // 1e12 = 1 time the basis xy-bivector
  var z_vector = 1e3;        // 1e3 = the basis z-vector

// Algebraic objects and operator overloading (^ = wedge) 
  var xy_bivector = 1e1^1e2; // wedge x-vector and y-vector to get the xy-bivector
```

Here are some more examples showing you the power and readability of this
API in C and R3. 

```javascript
Complex.inline(function(){
  console.log( (3+2e1)*(1+4e1) );      // complex multiplication. (outputs -5+14i)
  console.log( (1+4e1)**-1*(1+4e1) );  // complex inverse (outputs 1)
})();

E3.inline(function(){
  console.log( 1e1 );                  // x-vector (outputs [0, 1, 0, 0, 0, 0, 0, 0])
  console.log( 1e1^1e2 );              // x wedge y (outputs [0, 0, 0, 0, 1, 0, 0, 0])
  console.log( 1e12<<1e2 );            // xy dot y (outputs [0, 1, 0, 0, 0, 0, 0, 0])
  console.log( 1e1*1e2 );              // x * y (outputs [0, 0, 0, 0, 1, 0, 0, 0])
  console.log( 1e1.Dual );             // x.Dual (outputs [0, 0, 0, 0, 0, 0, -1, 0])
})();
```

### Example : Mandlebrot

In this example we use the smallest Geometric Algebra that cannonicaly
embeds the Complex numbers. We graph a two dimensional function where
we evaluate the number of iterations the complex expression (z*z+c) needs to
converge to infinity (well .. to more than two ;) ).

This famous equation is known as the Mandelbrot set. In the following piece
of javascript, z and c are complex numbers. The imaginary unit _i_ is
written **_e<sub>1</sub>_** as the first basis vector of R(0,1) squares to -1.  

```javascript
var Complex = Algebra(0,1);

var canvas = Complex.graph(function(x,y){
  var n=110, z=0e1, c=x*1.75-1+y*1e1;
  while (z < 2 && n--) z=z**2+c;
  return (n/100);
});

document.body.appendChild(canvas);
```

<CENTER><IMG SRC="ganja_mandelbrot.png"></CENTER>

### Example Hue Rotor

This example uses three dimensional euclidean space which is the smallest GA
that cannonicaly embeds the quaternions. Because of our order choice of
basis blades (i.e. **e<sub>13</sub>** instead of **e<sub>31</sub>**), the
**e<sub>13</sub>** basis bivector is negated
compared to the default quaternion implementations.

In the code below, **c** is a vector and **rot** is a quaternion (scalar +
bivector). We graph the color vector obtained by rotating red (1e1) in the
(1,1,1) bivector plane. (this is changing the hue).

```javascript
var E3 = Algebra(3);

var canvas = E3.graph(function(x,y){
  var c=1e1, rot=Math.cos(x*2) + Math.sin(x*2)*(1e12+1e23-1e13);
  return (rot*c*rot**-1).Vector;
});

document.body.appendChild(canvas);
```
<CENTER><IMG SRC="ganja_hue.png"></CENTER>


### Example Projective 2D

This example uses projective 2D. (degenerate signature R*2,0,1). (Dual ..
i.e. points are higher grade than lines). (Ganja.js can handle degenerate
metrics). Points are constructed by adding in E0, and the join is the dual of the
wedge of the duals. (meet is just wedge). We construct lines from points
and find their intersection points, angles, distances and more.

We've also used a custom ordering of the basis blades, and used
**e<sub>20</sub>** instead of the default **e<sub>02</sub>**. This matches
the convention of Charles Gunn (refer to his publications for more information
on projective geometric algebra). 

We start by creating an R<sub>2,0,1</sub> Clifford Algebra with given basis
names. (Ganja.js will handle duality and inner product correctly even for degenerate
metrics.)

```javascript
var P2 = Algebra({metric:[0,1,1],basis:['1','e0','e1','e2','e12','e20','e01','e012']});
```
Next, we upgrade it to a geometric algebra by extending it with geometric
operators. (this is where we decide our bivectors will be points,
effectively making this P(R*<sub>2,0,1</SUB>). 

```javascript
P2.inline(function(){ 
  this.point           = (X,Y)=>1e12+X*1e20+Y*1e01;
  this.to_point        = (p)=>`[${p.e12?[p.e01/p.e12,p.e20/p.e12]:[p.e01*Infinity||0,p.e20*Infinity||0]}]`;
  this.to_line         = (p)=>`${p.e1}x + ${p.e2}y + ${p.e0}`;
  this.join            = (x,y)=>!(!x^!y);                               // union
  this.meet            = (x,y)=>x^y;                                    // intersect 
  this.dist_points     = (p1,p2)=>this.join(p1/p1.e12,p2/p2.e12).Length;// distance between points
  this.dist_point_line = (p,l)=>((p.Normalized)^(l.Normalized)).e012;   // oriented distance point to line.
  this.angle_lines     = (l1,l2)=>(l1.Normalized<<l2.Normalized).s;     // angle between lines
  this.project         = (p,l)=>(p<<l)*l;                               // project p onto l
  this.parallel        = (p,l)=>(p<<l)*p;                               // line parallel to l and through p.
  this.ortho           = (p,l)=>p<<l;                                   // line ortho to l and through p.
  this.rotor           = (a)=>Math.cos(a*0.5)+Math.sin(a*0.5)*1e12;     // rotor a.
  this.translator      = (x,y)=>1+0.5*(x*1e20-y*1e01);                  // translator x,y
})();
```
We can now use our 2D Projective Algebra. 

```javascript
P2.inline(x=>{
  // define 4 points, and their 6 connecting lines.
  var a=P2.point(0,0), b=P2.point(0,1), c=P2.point(1,0), d=P2.point(1,1);
  var ab=P2.join(a,b), ac=P2.join(a,c), ad=P2.join(a,d), bc=P2.join(b,c), bd=P2.join(b,d), cd=P2.join(c,d);

  // output points
  console.log('points : ',[a,b,c,d].map(x=>P2.to_point(x)).join(' and '));   

  // output distances.
  console.log('a to d :',P2.dist_points(a,d));
  console.log('ad to c :',P2.dist_point_line(ad,c));
  console.log('ab to c :',P2.dist_point_line(ab,c));
  console.log('ad meet bc to c :',P2.dist_points(P2.meet(ad,bc),c));

  // output intersections
  console.log('ad intersect bc :', P2.to_point(P2.meet(ad,bc)));
  console.log('ab intersect cd :', P2.to_point(P2.meet(ab,cd)));
  console.log('ac intersect bd :', P2.to_point(P2.meet(ac,bd)));

  // output angles.
  console.log('angle ab ad :',P2.angle_lines(ab,ad));
  console.log('angle ab cd :',P2.angle_lines(ab,cd));
  console.log('angle ad bc :',P2.angle_lines(ad,bc));

  // project, ortho, parallel 
  console.log('project a onto bc :', P2.to_point(P2.project(a,bc)));
  console.log('line through d, parallel to bc :', P2.to_line(P2.parallel(d,bc)));
  console.log('line through d, orthogonal to bc :',P2.to_line(P2.ortho(d,bc)));

  // rotate, translate 
  var rot = P2.rotor(Math.PI/4);
  console.log('b rotated pi/4 :',P2.to_point(rot*b*~rot));
  var tran = P2.translator(1,2);
  console.log('b translated 1,2 :',P2.to_point(b),'->',P2.to_point(tran*b*~tran));
  var combined = tran*rot;
  console.log('b rotated and translated :',P2.to_point(combined*b*~combined));
})();
```

This example outputs :

```
points :  0,0 and 1,0 and 0,1 and 1,1

a to d : 1.4142135623730951
ad to c : -0.7071067811865475
ab to c : -1
ad meet bc to c : 0.7071067811865476

ad intersect bc : [0.5, 0.5]
ab intersect cd : [Infinity, 0]
ac intersect bd : [0, -Infinity]

angle ab ad : 0.7071067811865475
angle ab cd : 1
angle ad bc : 0

line through a, parallel to bc : 1x + 1y + -2
line through a, orthogonal to bc : 1x + -1y + 0
b rotated pi/4 : [0.7071067811865475, 0.7071067811865476]
b translated 1,2 : [1, 0] -> [2, 2]
b rotated and translated : [1.7071067811865472, 2.7071067811865475]
```

### Example Projective 3D

This example implements the table on page 15 of [Gunn's Geometric Algebra for Computer Graphics](http://page.math.tu-berlin.de/~gunn/Documents/Papers/GAforCGTRaw.pdf). 
We apply the same strategy from above and start from a Clifford Algebra in R<sub>3,0,1</sub>. 

```javascript
var P3 = Algebra({
           metric:[0,1,1,1],
           basis:['1','e0','e1','e2','e3','e01','e02','e03','e12','e31','e23','e123','e012','e023','e031','e0123']
         });
```
Extending it with geometric operators to form P(R*<sub>3,0,1</sub>). 

```javascript
P3.inline(function(){ 
    var E0=1e123, E1=1e012, E2=1e023, E3=1e031;
    this.point    = (X,Y,Z)=>E0+X*E1+Y*E2+(Z||0)*E3,
    this.to_point = (p)=>p.e123?[p.e012/p.e123,p.e023/p.e123,p.e031/p.e123]
                               :[p.e012*Infinity||0,p.e023*Infinity||0,p.e031*Infinity||0],
    this.join     = (x,y)=>!(!x^!y);
    this.meet     = (x,y)=>x^y;
  // Table from "Geometric Algebra for Copmuter Graphics"
    this.LineFromPoints            = (P,Q)=>join(P,Q);
    this.LineFromPlanes            = (a,b)=>a^b;
    this.PointFromPlanes           = (a,b,c)=>a^b^c;
    this.PlaneFromPoints           = (P,Q,R)=>join(join(P,Q),R);
    this.DistPointToPlane          = (a,P)=>join(a,P).Length;
    this.DistPoints                = (P,Q)=>join(P,Q).Length;
    this.AnglePlanes               = (a,b)=>Math.acos(a<<b);
    this.LineThroughPointPerpPlane = (P,a)=>P<<a;
    this.OrthProjPointToPlane      = (P,a)=>(P<<a)*a;
    this.PlaneThroughPointParPlane = (P,a)=>(P<<a)*P;
    this.IntersectLinePlane        = (PI,a)=>PI^a;
    this.PlaneThroughPointPerpLine = (PI,P)=>P<<PI;
    this.OrthProjPointToLine       = (PI,P)=>(P<<PI)*PI;
    this.LineThroughPointParLine   = (PI,P)=>(P<<PI)*P;
    this.LineThroughPointPerpLine  = (PI,P)=>join((P<<PI)*P,P);
    this.DistLines                 = (PI,EP)=>join(PI,EP);
    this.AngleLines                = (PI,EP)=>PI<<EP;
    this.ReflectionInPlane         = (a,X)=>a*X*a;
    this.Rotor                     = (PI,alpha)=>Math.cos(alpha/2) + Math.sin(alpha/2)*PI;
    this.RotationAroundLine        = (X,PI,alpha)=>this.rotor(PI,alpha)*X*~this.rotor(PI,alpha);
    this.Translator                = (x,y,z)=>1+0.5*(x*1e03+y*1e01+z*1e02);
})();
```
