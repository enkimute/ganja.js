// 3D Projective Geometric Algebra
// Written by a generator written by enki.
using System;
using System.Text;
using static HYP.HYPERBOLIC; // static variable acces

namespace HYP
{
	public class HYPERBOLIC
	{
		// just for debug and print output, the basis names
		public static string[] _basis = new[] { "1","e1" };

		private float[] _mVec = new float[2];

		/// <summary>
		/// Ctor
		/// </summary>
		/// <param name="f"></param>
		/// <param name="idx"></param>
		public HYPERBOLIC(float f = 0f, int idx = 0)
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

		#region Overloaded Operators

		/// <summary>
		/// HYPERBOLIC.Reverse : res = ~a
		/// Reverse the order of the basis blades.
		/// </summary>
		public static HYPERBOLIC operator ~ (HYPERBOLIC a)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0]=a[0];
			res[1]=a[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Dual : res = !a
		/// Poincare duality operator.
		/// </summary>
		public static HYPERBOLIC operator ! (HYPERBOLIC a)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0]=a[1];
			res[1]=a[0];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Conjugate : res = a.Conjugate()
		/// Clifford Conjugation
		/// </summary>
		public  HYPERBOLIC Conjugate ()
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0]=this[0];
			res[1]=-this[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Involute : res = a.Involute()
		/// Main involution
		/// </summary>
		public  HYPERBOLIC Involute ()
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0]=this[0];
			res[1]=-this[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Mul : res = a * b
		/// The geometric product.
		/// </summary>
		public static HYPERBOLIC operator * (HYPERBOLIC a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0]=b[0]*a[0]+b[1]*a[1];
			res[1]=b[1]*a[0]+b[0]*a[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Wedge : res = a ^ b
		/// The outer product. (MEET)
		/// </summary>
		public static HYPERBOLIC operator ^ (HYPERBOLIC a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Vee : res = a & b
		/// The regressive product. (JOIN)
		/// </summary>
		public static HYPERBOLIC operator & (HYPERBOLIC a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[1]=b[1]*a[1];
			res[0]=b[0]*a[1]+b[1]*a[0];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Dot : res = a | b
		/// The inner product.
		/// </summary>
		public static HYPERBOLIC operator | (HYPERBOLIC a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0]=b[0]*a[0]+b[1]*a[1];
			res[1]=b[1]*a[0]+b[0]*a[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Add : res = a + b
		/// Multivector addition
		/// </summary>
		public static HYPERBOLIC operator + (HYPERBOLIC a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0] = a[0]+b[0];
			res[1] = a[1]+b[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.Sub : res = a - b
		/// Multivector subtraction
		/// </summary>
		public static HYPERBOLIC operator - (HYPERBOLIC a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0] = a[0]-b[0];
			res[1] = a[1]-b[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.smul : res = a * b
		/// scalar/multivector multiplication
		/// </summary>
		public static HYPERBOLIC operator * (float a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0] = a*b[0];
			res[1] = a*b[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.muls : res = a * b
		/// multivector/scalar multiplication
		/// </summary>
		public static HYPERBOLIC operator * (HYPERBOLIC a, float b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0] = a[0]*b;
			res[1] = a[1]*b;
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.sadd : res = a + b
		/// scalar/multivector addition
		/// </summary>
		public static HYPERBOLIC operator + (float a, HYPERBOLIC b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0] = a+b[0];
			res[1] = b[1];
			return res;
		}

		/// <summary>
		/// HYPERBOLIC.adds : res = a + b
		/// multivector/scalar addition
		/// </summary>
		public static HYPERBOLIC operator + (HYPERBOLIC a, float b)
		{
			HYPERBOLIC res = new HYPERBOLIC();
			res[0] = a[0]+b;
			res[1] = a[1];
			return res;
		}

		#endregion

                /// <summary>
                /// HYPERBOLIC.norm()
                /// Calculate the Euclidean norm. (strict positive).
                /// </summary>
		public float norm() { return (float) Math.Sqrt(Math.Abs((this*this.Conjugate())[0]));}
		
		/// <summary>
		/// HYPERBOLIC.inorm()
		/// Calculate the Ideal norm. (signed)
		/// </summary>
		public float inorm() { return this[1]!=0.0f?this[1]:this[15]!=0.0f?this[15]:(!this).norm();}
		
		/// <summary>
		/// HYPERBOLIC.normalized()
		/// Returns a normalized (Euclidean) element.
		/// </summary>
		public HYPERBOLIC normalized() { return this*(1/norm()); }
		
		
		// The basis blades
		public static HYPERBOLIC e1 = new HYPERBOLIC(1f, 1);

		
		/// string cast
		public override string ToString()
		{
			var sb = new StringBuilder();
			var n=0;
			for (int i = 0; i < 2; ++i) 
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
		
			Console.WriteLine("e1*e1         : "+e1*e1);
			Console.WriteLine("pss           : "+e1);
			Console.WriteLine("pss*pss       : "+e1*e1);

		}
	}
}

