# ganja.js - Geometric Algebra for javascript.

<IMG SRC="ganja_thumb.jpg">

Ganja.js is a Geometric Algebra code generator for javascript. It supports
algebra's of any signature and implements advanced operator overloading and
algebraic constants.

To use it, first include the ganja.js script.
```html
<SCRIPT SRC="../res/ganja.js"></SCRIPT>
```
<SCRIPT SRC="../res/ganja.js"></SCRIPT>

#### Creating algebra classes.

```javascript
function Algebra(p,q,r)
  // p = dimensions that square to +1
  // q = dimensions that square to -1
  // r = dimensions that square to  0
```

To create an Algebra, all you need to know is its metric. The Algebra
function will generate an ES6 class that implements the algebra with the
specified metric.

```javascript
var Complex = Algebra(0,1);     // Complex numbers.
var E2 = Algebra(2);            // Euclidean 2D space.
var E3 = Algebra(3);            // Euclidean 3D space.
var timeSpace = Algebra(3,1);   // timespace
var P3 = Algebra(2,0,1);        // Projective 2D space
var C3 = Algebra(4,1);          // Conformal 3D space
```
<SCRIPT>
var Complex = Algebra(0,1);     // Complex numbers.
var E2 = Algebra(2);            // Euclidean 2D space.
var E3 = Algebra(3);            // Euclidean 3D space.
var timeSpace = Algebra(3,1);   // timespace
var P3 = Algebra(2,0,1);        // Projective 2D space
var C3 = Algebra(4,1);          // Conformal 3D space
</SCRIPT>

These classes provide four seperate syntax flavors. (Inline, AsciiMath,
Object-Oriented and Functional). The Inline and AsciiMath syntaxes provide in
full operator overloading and literal algebraic objects - targetting the more
mathematically inclined. The Object Oriented and functional syntax on the
other hand will probably feel more familiar to engineers and programmers.  

#### Introducing the javascript inline syntax.

To use the javascript inline syntax, simply wrap any function with direct
mathematical statemens inside the 'inline' function call:

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
<DIV ID="mandlebrot" STYLE="text-align:center"></DiV>
<SCRIPT>
  document.getElementById('mandlebrot').appendChild(Algebra(0,1).graph(function(x,y){
    var n=110, z=0e1, c=x*1.75-1+y*1e1;
    while (z < 2 && n--) z=z**2+c;
    return (n/100);
  }));
</SCRIPT>

#### Example Hue Rotor

```javascript
E3.graph(function(x,y){
  var c=1e1, rot=Math.cos(x*2) + Math.sin(x*2)*(1e12+1e23-1e13);
  return (rot*c*rot**-1).slice(1,4);
});
```
<DIV ID="hue"></DiV>
<SCRIPT>
  document.getElementById('hue').appendChild(Algebra(3,0).graph(function(x,y){
    var c=1e1, rot=Math.cos(x*2) + Math.sin(x*2)*(1e12+1e23-1e13);
    return (rot*c*rot**-1).slice(1,4);
  },undefined,820,20));
</SCRIPT>
