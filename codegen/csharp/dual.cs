// 3D Projective Geometric Algebra
// Written by a generator written by enki.
using System;
using System.Text;
using static DUA.DUAL; // static variable acces

namespace DUA
{
	public class DUAL
	{
		// just for debug and print output, the basis names
		public static string[] _basis = new[] { "1","e0" };

		private float[] _mVec = new float[2];

		/// <summary>
		/// Ctor
		/// </summary>
		/// <param name="f"></param>
		/// <param name="idx"></param>
		public DUAL(float f = 0f, int idx = 0)
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
		/// DUAL.Reverse : res = ~a
		/// Reverse the order of the basis blades.
		/// </summary>
		public static DUAL operator ~ (DUAL a)
		{
			DUAL res = new DUAL();
			res[0]=a[0];
			res[1]=a[1];
			return res;
		}

		/// <summary>
		/// DUAL.Dual : res = !a
		/// Poincare duality operator.
		/// </summary>
		public static DUAL operator ! (DUAL a)
		{
			DUAL res = new DUAL();
			res[0]=a[1];
			res[1]=a[0];
			return res;
		}

		/// <summary>
		/// DUAL.Conjugate : res = a.Conjugate()
		/// Clifford Conjugation
		/// </summary>
		public  DUAL Conjugate ()
		{
			DUAL res = new DUAL();
			res[0]=this[0];
			res[1]=-this[1];
			return res;
		}

		/// <summary>
		/// DUAL.Involute : res = a.Involute()
		/// Main involution
		/// </summary>
		public  DUAL Involute ()
		{
			DUAL res = new DUAL();
			res[0]=this[0];
			res[1]=-this[1];
			return res;
		}

		/// <summary>
		/// DUAL.Mul : res = a * b
		/// The geometric product.
		/// </summary>
		public static DUAL operator * (DUAL a, DUAL b)
		{
			DUAL res = new DUAL();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			return res;
		}

		/// <summary>
		/// DUAL.Wedge : res = a ^ b
		/// The outer product. (MEET)
		/// </summary>
		public static DUAL operator ^ (DUAL a, DUAL b)
		{
			DUAL res = new DUAL();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			return res;
		}

		/// <summary>
		/// DUAL.Vee : res = a & b
		/// The regressive product. (JOIN)
		/// </summary>
		public static DUAL operator & (DUAL a, DUAL b)
		{
			DUAL res = new DUAL();
			res[1]=b[1]*a[1];
			res[0]=b[0]*a[1]+b[1]*a[0];
			return res;
		}

		/// <summary>
		/// DUAL.Dot : res = a | b
		/// The inner product.
		/// </summary>
		public static DUAL operator | (DUAL a, DUAL b)
		{
			DUAL res = new DUAL();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			return res;
		}

		/// <summary>
		/// DUAL.Add : res = a + b
		/// Multivector addition
		/// </summary>
		public static DUAL operator + (DUAL a, DUAL b)
		{
			DUAL res = new DUAL();
			res[0] = a[0]+b[0];
			res[1] = a[1]+b[1];
			return res;
		}

		/// <summary>
		/// DUAL.Sub : res = a - b
		/// Multivector subtraction
		/// </summary>
		public static DUAL operator - (DUAL a, DUAL b)
		{
			DUAL res = new DUAL();
			res[0] = a[0]-b[0];
			res[1] = a[1]-b[1];
			return res;
		}

		/// <summary>
		/// DUAL.smul : res = a * b
		/// scalar/multivector multiplication
		/// </summary>
		public static DUAL operator * (float a, DUAL b)
		{
			DUAL res = new DUAL();
			res[0] = a*b[0];
			res[1] = a*b[1];
			return res;
		}

		/// <summary>
		/// DUAL.muls : res = a * b
		/// multivector/scalar multiplication
		/// </summary>
		public static DUAL operator * (DUAL a, float b)
		{
			DUAL res = new DUAL();
			res[0] = a[0]*b;
			res[1] = a[1]*b;
			return res;
		}

		/// <summary>
		/// DUAL.sadd : res = a + b
		/// scalar/multivector addition
		/// </summary>
		public static DUAL operator + (float a, DUAL b)
		{
			DUAL res = new DUAL();
			res[0] = a+b[0];
			res[1] = b[1];
			return res;
		}

		/// <summary>
		/// DUAL.adds : res = a + b
		/// multivector/scalar addition
		/// </summary>
		public static DUAL operator + (DUAL a, float b)
		{
			DUAL res = new DUAL();
			res[0] = a[0]+b;
			res[1] = a[1];
			return res;
		}

		#endregion

                /// <summary>
                /// DUAL.norm()
                /// Calculate the Euclidean norm. (strict positive).
                /// </summary>
		public float norm() { return (float) Math.Sqrt(Math.Abs((this*this.Conjugate())[0]));}
		
		/// <summary>
		/// DUAL.inorm()
		/// Calculate the Ideal norm. (signed)
		/// </summary>
		public float inorm() { return this[1]!=0.0f?this[1]:this[15]!=0.0f?this[15]:(!this).norm();}
		
		/// <summary>
		/// DUAL.normalized()
		/// Returns a normalized (Euclidean) element.
		/// </summary>
		public DUAL normalized() { return this*(1/norm()); }
		
		
		// The basis blades
		public static DUAL e0 = new DUAL(1f, 1);

		
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
		
			Console.WriteLine("e0*e0         : "+e0*e0);
			Console.WriteLine("pss           : "+e0);
			Console.WriteLine("pss*pss       : "+e0*e0);

		}
	}
}

