// 3D Projective Geometric Algebra
// Written by a generator written by enki.
using System;
using System.Text;
using static MIN.MINK; // static variable acces

namespace MIN
{
	public class MINK
	{
		// just for debug and print output, the basis names
		public static string[] _basis = new[] { "1","e1","e2","e12" };

		private float[] _mVec = new float[4];

		/// <summary>
		/// Ctor
		/// </summary>
		/// <param name="f"></param>
		/// <param name="idx"></param>
		public MINK(float f = 0f, int idx = 0)
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
		/// MINK.Reverse : res = ~a
		/// Reverse the order of the basis blades.
		/// </summary>
		public static MINK operator ~ (MINK a)
		{
			MINK res = new MINK();
			res[0]=a[0];
			res[1]=a[1];
			res[2]=a[2];
			res[3]=-a[3];
			return res;
		}

		/// <summary>
		/// MINK.Dual : res = !a
		/// Poincare duality operator.
		/// </summary>
		public static MINK operator ! (MINK a)
		{
			MINK res = new MINK();
			res[0]=a[3];
			res[1]=-a[2];
			res[2]=-a[1];
			res[3]=a[0];
			return res;
		}

		/// <summary>
		/// MINK.Conjugate : res = a.Conjugate()
		/// Clifford Conjugation
		/// </summary>
		public  MINK Conjugate ()
		{
			MINK res = new MINK();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=-this[3];
			return res;
		}

		/// <summary>
		/// MINK.Involute : res = a.Involute()
		/// Main involution
		/// </summary>
		public  MINK Involute ()
		{
			MINK res = new MINK();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=this[3];
			return res;
		}

		/// <summary>
		/// MINK.Mul : res = a * b
		/// The geometric product.
		/// </summary>
		public static MINK operator * (MINK a, MINK b)
		{
			MINK res = new MINK();
			res[0]=b[0]*a[0]+b[1]*a[1]-b[2]*a[2]+b[3]*a[3];
			res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
			res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3];
			res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
			return res;
		}

		/// <summary>
		/// MINK.Wedge : res = a ^ b
		/// The outer product. (MEET)
		/// </summary>
		public static MINK operator ^ (MINK a, MINK b)
		{
			MINK res = new MINK();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			res[2]=b[2]*a[0]+b[0]*a[2];
			res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
			return res;
		}

		/// <summary>
		/// MINK.Vee : res = a & b
		/// The regressive product. (JOIN)
		/// </summary>
		public static MINK operator & (MINK a, MINK b)
		{
			MINK res = new MINK();
			res[3]=b[3]*a[3];
			res[2]=b[2]*a[3]+b[3]*a[2];
			res[1]=b[1]*a[3]+b[3]*a[1];
			res[0]=b[0]*a[3]+b[1]*a[2]-b[2]*a[1]+b[3]*a[0];
			return res;
		}

		/// <summary>
		/// MINK.Dot : res = a | b
		/// The inner product.
		/// </summary>
		public static MINK operator | (MINK a, MINK b)
		{
			MINK res = new MINK();
			res[0]=b[0]*a[0]+b[1]*a[1]-b[2]*a[2]+b[3]*a[3];
			res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
			res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3];
			res[3]=b[3]*a[0]+b[0]*a[3];
			return res;
		}

		/// <summary>
		/// MINK.Add : res = a + b
		/// Multivector addition
		/// </summary>
		public static MINK operator + (MINK a, MINK b)
		{
			MINK res = new MINK();
			res[0] = a[0]+b[0];
			res[1] = a[1]+b[1];
			res[2] = a[2]+b[2];
			res[3] = a[3]+b[3];
			return res;
		}

		/// <summary>
		/// MINK.Sub : res = a - b
		/// Multivector subtraction
		/// </summary>
		public static MINK operator - (MINK a, MINK b)
		{
			MINK res = new MINK();
			res[0] = a[0]-b[0];
			res[1] = a[1]-b[1];
			res[2] = a[2]-b[2];
			res[3] = a[3]-b[3];
			return res;
		}

		/// <summary>
		/// MINK.smul : res = a * b
		/// scalar/multivector multiplication
		/// </summary>
		public static MINK operator * (float a, MINK b)
		{
			MINK res = new MINK();
			res[0] = a*b[0];
			res[1] = a*b[1];
			res[2] = a*b[2];
			res[3] = a*b[3];
			return res;
		}

		/// <summary>
		/// MINK.muls : res = a * b
		/// multivector/scalar multiplication
		/// </summary>
		public static MINK operator * (MINK a, float b)
		{
			MINK res = new MINK();
			res[0] = a[0]*b;
			res[1] = a[1]*b;
			res[2] = a[2]*b;
			res[3] = a[3]*b;
			return res;
		}

		/// <summary>
		/// MINK.sadd : res = a + b
		/// scalar/multivector addition
		/// </summary>
		public static MINK operator + (float a, MINK b)
		{
			MINK res = new MINK();
			res[0] = a+b[0];
			res[1] = b[1];
			res[2] = b[2];
			res[3] = b[3];
			return res;
		}

		/// <summary>
		/// MINK.adds : res = a + b
		/// multivector/scalar addition
		/// </summary>
		public static MINK operator + (MINK a, float b)
		{
			MINK res = new MINK();
			res[0] = a[0]+b;
			res[1] = a[1];
			res[2] = a[2];
			res[3] = a[3];
			return res;
		}

		#endregion

                /// <summary>
                /// MINK.norm()
                /// Calculate the Euclidean norm. (strict positive).
                /// </summary>
		public float norm() { return (float) Math.Sqrt(Math.Abs((this*this.Conjugate())[0]));}
		
		/// <summary>
		/// MINK.inorm()
		/// Calculate the Ideal norm. (signed)
		/// </summary>
		public float inorm() { return this[1]!=0.0f?this[1]:this[15]!=0.0f?this[15]:(!this).norm();}
		
		/// <summary>
		/// MINK.normalized()
		/// Returns a normalized (Euclidean) element.
		/// </summary>
		public MINK normalized() { return this*(1/norm()); }
		
		
		// The basis blades
		public static MINK e1 = new MINK(1f, 1);
		public static MINK e2 = new MINK(1f, 2);
		public static MINK e12 = new MINK(1f, 3);

		
		/// string cast
		public override string ToString()
		{
			var sb = new StringBuilder();
			var n=0;
			for (int i = 0; i < 4; ++i) 
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
			Console.WriteLine("pss           : "+e12);
			Console.WriteLine("pss*pss       : "+e12*e12);

		}
	}
}

