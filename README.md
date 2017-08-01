# ganja.js - Geometric Algebra for javascript.

<CENTER><IMG SRC="ganja_thumb.jpg"></CENTER>

Ganja.js is a Geometric Algebra code generator for javascript. It supports
algebra's of any signature and implements advanced operator overloading and
algebraic constants.

* Supports any metric (p,q,r) (spacelike/timelike/lightlike)
* Operator overloading
* Algebraic constants
* super small (130 lines)
* inverses up to 5 dimensions
* geometric, inner, outer product
* conjugate, reverse, involute, dual, negative
* 4 API's (inline, asciimath, object oriented, functional)

To use it, first include the ganja.js script.
```html
<SCRIPT SRC="https://raw.githubusercontent.com/enkimute/ganja.js/master/ganja.js"></SCRIPT>
```
#### Create your algebra class.

To create an Algebra, all you need to know is its metric. The Algebra
function will generate an ES6 class that implements the algebra with the
specified metric (p,q,r). 

```javascript
var Complex = Algebra(0,1);     // Complex numbers.
var E2 = Algebra(2);            // Euclidean 2D space.
var E3 = Algebra(3);            // Euclidean 3D space.
var timeSpace = Algebra(3,1);   // timespace
var P3 = Algebra(2,0,1);        // Projective 2D space
var C3 = Algebra(4,1);          // Conformal 3D space
```
These classes provide four seperate syntax flavors. (Inline, AsciiMath,
Object-Oriented and Functional). The Inline and AsciiMath syntaxes provide in
full operator overloading and literal algebraic objects - targetting the more
mathematically inclined. The Object Oriented and functional syntax on the
other hand will probably feel more familiar to engineers and programmers.  

#### Javascript inline syntax.

Ganja.js' inline syntax allows you to write GA statements seamlessly inside your
javascript functions. Simply wrap your functions to get full operator
overloading and algebraic constants.

To enable you to directly write algebraic constants, we overload the
scientific notation. Allowing you to write : 

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


#### Creating Algebra Elements.

```javascript
var c1 = new Complex([3,2]);           // 3 + 2i
var c2 = Complex.Element(3,2);         // 3 + 2i
var c3 = Complex.inline(()=>3+2e1)();  // 3 + 2i 

var v1 = new E2([0,1,0,0]);         // x-axis vector (1,0)
var v2 = E2.Vector(1,0);            // x-axis vector (1,0)
var v3 = E2.inline(()=>1e1);        // x-axis vector (1,0) 
```




#### Example : Mandlebrot

```javascript
Complex.graph(function(x,y){
  var n=110, z=0e1, c=x*1.75-1+y*1e1;
  while (z < 2 && n--) z=z**2+c;
  return (n/100);
});
```
<CENTER><IMG SRC="ganja_mandelbrot.png"></CENTER>

#### Example Hue Rotor

```javascript
E3.graph(function(x,y){
  var c=1e1, rot=Math.cos(x*2) + Math.sin(x*2)*(1e12+1e23-1e13);
  return (rot*c*rot**-1).slice(1,4);
});
```
<CENTER><IMG SRC="ganja_hue.png"></CENTER>
