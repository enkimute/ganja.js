// cs Template for the preamble
var preamble = (basis,classname)=>
`// 3D Projective Geometric Algebra
// Written by a generator written by enki.
using System;
using System.Text;
using static ${classname.slice(0,3)}.${classname}; // static variable acces

namespace ${classname.slice(0,3)}
{
	public class ${classname}
	{
		// just for debug and print output, the basis names
		public static string[] _basis = new[] { ${basis.map(x=>'"'+x+'"').join(',')} };

		private float[] _mVec = new float[${basis.length}];

		/// <summary>
		/// Ctor
		/// </summary>
		/// <param name="f"></param>
		/// <param name="idx"></param>
		public ${classname}(float f = 0f, int idx = 0)
		{
			_mVec[idx] = f;
		}

		#region Array Access
		public float this[int idx]
		{
			get { return _mVec[idx]; }
			set { _mVec[idx] = value; }
		}
		#endregion

		#region Overloaded Operators`;


// cs Template for our binary operators

var binary = (classname, symbol, name, name_a, name_b, name_ret, code, classname_a=classname, classname_b=classname,desc='')=>
`		/// <summary>
		/// ${classname}.${name} : ${name_ret} = ${symbol?name_a+" "+symbol+" "+name_b:name_a+"."+name+"("+name_b+")"}
		/// ${desc}
		/// </summary>
		public static ${classname} ${symbol?"operator "+symbol:name} (${classname_a} ${name_a}, ${classname_b} ${name_b})
		{
			${classname} ${name_ret} = new ${classname}();
${code.replace(/^\s*/gm,'			')}
			return ${name_ret};
		}`

// cs Template for our unary operators

var unary = (classname, symbol, name, name_a, name_ret, code, classname_a=classname,desc='')=>
`		/// <summary>
		/// ${classname}.${name} : ${name_ret} = ${symbol?symbol+name_a:name_a+"."+name+"()"}
		/// ${desc}
		/// </summary>
		public ${symbol?"static":""} ${classname} ${symbol?"operator "+symbol:name} (${symbol?`${classname_a} ${name_a}`:``})
		{
			${classname} ${name_ret} = new ${classname}();
${(symbol?code:code.replace(/a\[/g,'this[')).replace(/^\s*/gm,'			')}
			return ${name_ret};
		}`

// cs template for CGA example
var CGA = (basis,classname)=>({
preamble:`
		// CGA is point based. Vectors are points. 
		public static ${classname} e1 = new ${classname}(1f, 1);
		public static ${classname} e2 = new ${classname}(1f, 2);
		public static ${classname} e3 = new ${classname}(1f, 3);
		public static ${classname} e4 = new ${classname}(1f, 4);
		public static ${classname} e5 = new ${classname}(1f, 5);
		
		// We seldomly work in the natural basis, but instead in a null basis
		// for this we create two null vectors 'origin' and 'infinity'
		public static ${classname} eo = e4+e5;
		public static ${classname} ei = (e5-e4)*0.5f;
		
		// create a point from x,y,z coordinates
		public static ${classname} up (float x, float y, float z) { 
		  float d = x*x + y*y + z*z;
		  return x*e1 + y*e2 + z*e3 + 0.5f*d*ei + eo;
		}
`,
amble:`
                        // For points, use the up function.
                        var px = up(1.0f,2.0f,3.0f);
                        
                        // Create lines, spheres, circles, planes using the outer product
                        var line = px^eo^ei;
                        
                        // Or using their dual form
                        var sphere = !(eo-ei);
                        
                        // some output.
			Console.WriteLine("a point       : "+px);
			Console.WriteLine("a line        : "+line);
			Console.WriteLine("a sphere      : "+sphere);
`
})

// cs template for algebras where I don't have specific examples yet ..
var GENERIC = (basis, classname)=>({
preamble:`
		// The basis blades
${basis.slice(1).map((x,i)=>`		public static ${classname} ${x} = new ${classname}(1f, ${i+1});`).join('\n')}
`,
amble:`
			Console.WriteLine("${basis[1]}*${basis[1]}         : "+${basis[1]}*${basis[1]});
			Console.WriteLine("pss           : "+${basis[basis.length-1]});
			Console.WriteLine("pss*pss       : "+${basis[basis.length-1]}*${basis[basis.length-1]});
`
})

// cs template for PGA example
var PGA3D = (basis,classname)=>({
preamble:`
		// PGA is plane based. Vectors are planes. (think linear functionals)
		public static ${classname} e0 = new ${classname}(1f, 1);
		public static ${classname} e1 = new ${classname}(1f, 2);
		public static ${classname} e2 = new ${classname}(1f, 3);
		public static ${classname} e3 = new ${classname}(1f, 4);
		
		// PGA lines are bivectors.
		public static ${classname} e01 = e0^e1; 
		public static ${classname} e02 = e0^e2;
		public static ${classname} e03 = e0^e3;
		public static ${classname} e12 = e1^e2; 
		public static ${classname} e31 = e3^e1;
		public static ${classname} e23 = e2^e3;
		
		// PGA points are trivectors.
		public static ${classname} e123 = e1^e2^e3; // the origin
		public static ${classname} e032 = e0^e3^e2;
		public static ${classname} e013 = e0^e1^e3;
		public static ${classname} e021 = e0^e2^e1;

		/// <summary>
		/// ${classname}.plane(a,b,c,d)
		/// A plane is defined using its homogenous equation ax + by + cz + d = 0
		/// </summary>
		public static ${classname} plane(float a, float b, float c, float d) { return a*e1 + b*e2 + c*e3 + d*e0; }
		
		/// <summary>
		/// ${classname}.point(x,y,z)
		/// A point is just a homogeneous point, euclidean coordinates plus the origin
		/// </summary>
		public static ${classname} point(float x, float y, float z) { return e123 + x*e032 + y*e013 + z*e021; }
		
		/// <summary>
		/// Rotors (euclidean lines) and translators (ideal lines)
		/// </summary>
		public static ${classname} rotor(float angle, ${classname} line) { return ((float) Math.Cos(angle/2.0f)) +  ((float) Math.Sin(angle/2.0f)) * line.normalized(); }
		public static ${classname} translator(float dist, ${classname} line) { return 1.0f + (dist/2.0f) * line; }

		// for our toy problem (generate points on the surface of a torus)
		// we start with a function that generates motors.
		// circle(t) with t going from 0 to 1.
		public static ${classname} circle(float t, float radius, ${classname} line) {
		  return rotor(t*2.0f*(float) Math.PI,line) * translator(radius,e1*e0);
		}
		
		// a torus is now the product of two circles. 
		public static ${classname} torus(float s, float t, float r1, ${classname} l1, float r2, ${classname} l2) {
		  return circle(s,r2,l2)*circle(t,r1,l1);
		}
		
		// and to sample its points we simply sandwich the origin ..
		public static ${classname} point_on_torus(float s, float t) {
		  var to = torus(s,t,0.25f,e12,0.6f,e31);
		  return to * e123 * ~to;
		}
`,
amble:`
			// Elements of the even subalgebra (scalar + bivector + pss) of unit length are motors
			var rot = rotor((float) Math.PI/2.0f,e1*e2);
			
			// The outer product ^ is the MEET. Here we intersect the yz (x=0) and xz (y=0) planes.
			var ax_z = e1 ^ e2;
			
			// line and plane meet in point. We intersect the line along the z-axis (x=0,y=0) with the xy (z=0) plane.
			var orig = ax_z ^ e3;
			
			// We can also easily create points and join them into a line using the regressive (vee, &) product.
			var px = point(1,0,0);
			var line = orig & px;
			
			// Lets also create the plane with equation 2x + z - 3 = 0
			var p = plane(2,0,1,-3);
			
			// rotations work on all elements
			var rotated_plane = rot * p * ~rot;
			var rotated_line  = rot * line * ~rot;
			var rotated_point = rot * px * ~rot;
			
			// See the 3D PGA Cheat sheet for a huge collection of useful formulas
			var point_on_plane = (p | px) * p;
			
			// Some output
			Console.WriteLine("a point       : "+px);
			Console.WriteLine("a line        : "+line);
			Console.WriteLine("a plane       : "+p);
			Console.WriteLine("a rotor       : "+rot);
			Console.WriteLine("rotated line  : "+rotated_line);
			Console.WriteLine("rotated point : "+rotated_point);
			Console.WriteLine("rotated plane : "+rotated_plane);
			Console.WriteLine("point on plane: "+point_on_plane.normalized());
			Console.WriteLine("point on torus: "+point_on_torus(0.0f,0.0f));
			Console.WriteLine(e0-1);
			Console.WriteLine(1-e0);
`
})

// cs Template for the postamble
var postamble = (basis, classname, example)=>
`		#endregion

                /// <summary>
                /// ${classname}.norm()
                /// Calculate the Euclidean norm. (strict positive).
                /// </summary>
		public float norm() { return (float) Math.Sqrt(Math.Abs((this*this.Conjugate())[0]));}
		
		/// <summary>
		/// ${classname}.inorm()
		/// Calculate the Ideal norm. (signed)
		/// </summary>
		public float inorm() { return this[1]!=0.0f?this[1]:this[15]!=0.0f?this[15]:(!this).norm();}
		
		/// <summary>
		/// ${classname}.normalized()
		/// Returns a normalized (Euclidean) element.
		/// </summary>
		public ${classname} normalized() { return this*(1/norm()); }
		
		${example.preamble}
		
		/// string cast
		public override string ToString()
		{
			var sb = new StringBuilder();
			var n=0;
			for (int i = 0; i < ${basis.length}; ++i) 
				if (_mVec[i] != 0.0f) {
					sb.Append($"{_mVec[i]}{(i == 0 ? string.Empty : _basis[i])} + ");
					n++;
			        }
			if (n==0) sb.Append("0");
			return sb.ToString().TrimEnd(' ', '+');
		}
	}

	class Program
	{
	        

		static void Main(string[] args)
		{
		${example.amble}
		}
	}
}

`;


Object.assign(exports,{preamble,postamble,unary,binary,desc:"c#",PGA3D,CGA,GENERIC});
