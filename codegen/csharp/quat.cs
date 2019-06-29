// 3D Projective Geometric Algebra
// Written by a generator written by enki.
using System;
using System.Text;
using static QUA.QUAT; // static variable acces

namespace QUA
{
	public class QUAT
	{
		// just for debug and print output, the basis names
		public static string[] _basis = new[] { "1","e1","e2","e12" };

		private float[] _mVec = new float[4];

		/// <summary>
		/// Ctor
		/// </summary>
		/// <param name="f"></param>
		/// <param name="idx"></param>
		public QUAT(float f = 0f, int idx = 0)
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
		/// QUAT.Reverse : res = ~a
		/// Reverse the order of the basis blades.
		/// </summary>
		public static QUAT operator ~ (QUAT a)
		{
			QUAT res = new QUAT();
			res[0]=a[0];
			res[1]=a[1];
			res[2]=a[2];
			res[3]=-a[3];
			return res;
		}

		/// <summary>
		/// QUAT.Dual : res = !a
		/// Poincare duality operator.
		/// </summary>
		public static QUAT operator ! (QUAT a)
		{
			QUAT res = new QUAT();
			res[0]=-a[3];
			res[1]=-a[2];
			res[2]=a[1];
			res[3]=a[0];
			return res;
		}

		/// <summary>
		/// QUAT.Conjugate : res = a.Conjugate()
		/// Clifford Conjugation
		/// </summary>
		public  QUAT Conjugate ()
		{
			QUAT res = new QUAT();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=-this[3];
			return res;
		}

		/// <summary>
		/// QUAT.Involute : res = a.Involute()
		/// Main involution
		/// </summary>
		public  QUAT Involute ()
		{
			QUAT res = new QUAT();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=this[3];
			return res;
		}

		/// <summary>
		/// QUAT.Mul : res = a * b
		/// The geometric product.
		/// </summary>
		public static QUAT operator * (QUAT a, QUAT b)
		{
			QUAT res = new QUAT();
			res[0]=b[0]*a[0]-b[1]*a[1]-b[2]*a[2]-b[3]*a[3];
			res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
			res[2]=b[2]*a[0]-b[3]*a[1]+b[0]*a[2]+b[1]*a[3];
			res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
			return res;
		}

		/// <summary>
		/// QUAT.Wedge : res = a ^ b
		/// The outer product. (MEET)
		/// </summary>
		public static QUAT operator ^ (QUAT a, QUAT b)
		{
			QUAT res = new QUAT();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			res[2]=b[2]*a[0]+b[0]*a[2];
			res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
			return res;
		}

		/// <summary>
		/// QUAT.Vee : res = a & b
		/// The regressive product. (JOIN)
		/// </summary>
		public static QUAT operator & (QUAT a, QUAT b)
		{
			QUAT res = new QUAT();
			res[3]=b[3]*a[3];
			res[2]=b[2]*a[3]+b[3]*a[2];
			res[1]=b[1]*a[3]+b[3]*a[1];
			res[0]=b[0]*a[3]+b[1]*a[2]-b[2]*a[1]+b[3]*a[0];
			return res;
		}

		/// <summary>
		/// QUAT.Dot : res = a | b
		/// The inner product.
		/// </summary>
		public static QUAT operator | (QUAT a, QUAT b)
		{
			QUAT res = new QUAT();
			res[0]=b[0]*a[0]-b[1]*a[1]-b[2]*a[2]-b[3]*a[3];
			res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
			res[2]=b[2]*a[0]-b[3]*a[1]+b[0]*a[2]+b[1]*a[3];
			res[3]=b[3]*a[0]+b[0]*a[3];
			return res;
		}

		/// <summary>
		/// QUAT.Add : res = a + b
		/// Multivector addition
		/// </summary>
		public static QUAT operator + (QUAT a, QUAT b)
		{
			QUAT res = new QUAT();
			res[0] = a[0]+b[0];
			res[1] = a[1]+b[1];
			res[2] = a[2]+b[2];
			res[3] = a[3]+b[3];
			return res;
		}

		/// <summary>
		/// QUAT.Sub : res = a - b
		/// Multivector subtraction
		/// </summary>
		public static QUAT operator - (QUAT a, QUAT b)
		{
			QUAT res = new QUAT();
			res[0] = a[0]-b[0];
			res[1] = a[1]-b[1];
			res[2] = a[2]-b[2];
			res[3] = a[3]-b[3];
			return res;
		}

		/// <summary>
		/// QUAT.smul : res = a * b
		/// scalar/multivector multiplication
		/// </summary>
		public static QUAT operator * (float a, QUAT b)
		{
			QUAT res = new QUAT();
			res[0] = a*b[0];
			res[1] = a*b[1];
			res[2] = a*b[2];
			res[3] = a*b[3];
			return res;
		}

		/// <summary>
		/// QUAT.muls : res = a * b
		/// multivector/scalar multiplication
		/// </summary>
		public static QUAT operator * (QUAT a, float b)
		{
			QUAT res = new QUAT();
			res[0] = a[0]*b;
			res[1] = a[1]*b;
			res[2] = a[2]*b;
			res[3] = a[3]*b;
			return res;
		}

		/// <summary>
		/// QUAT.sadd : res = a + b
		/// scalar/multivector addition
		/// </summary>
		public static QUAT operator + (float a, QUAT b)
		{
			QUAT res = new QUAT();
			res[0] = a+b[0];
			res[1] = b[1];
			res[2] = b[2];
			res[3] = b[3];
			return res;
		}

		/// <summary>
		/// QUAT.adds : res = a + b
		/// multivector/scalar addition
		/// </summary>
		public static QUAT operator + (QUAT a, float b)
		{
			QUAT res = new QUAT();
			res[0] = a[0]+b;
			res[1] = a[1];
			res[2] = a[2];
			res[3] = a[3];
			return res;
		}

		#endregion

                /// <summary>
                /// QUAT.norm()
                /// Calculate the Euclidean norm. (strict positive).
                /// </summary>
		public float norm() { return (float) Math.Sqrt(Math.Abs((this*this.Conjugate())[0]));}
		
		/// <summary>
		/// QUAT.inorm()
		/// Calculate the Ideal norm. (signed)
		/// </summary>
		public float inorm() { return this[1]!=0.0f?this[1]:this[15]!=0.0f?this[15]:(!this).norm();}
		
		/// <summary>
		/// QUAT.normalized()
		/// Returns a normalized (Euclidean) element.
		/// </summary>
		public QUAT normalized() { return this*(1/norm()); }
		
		
		// The basis blades
		public static QUAT e1 = new QUAT(1f, 1);
		public static QUAT e2 = new QUAT(1f, 2);
		public static QUAT e12 = new QUAT(1f, 3);

		
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

