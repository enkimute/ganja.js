// 3D Projective Geometric Algebra
// Written by a generator written by enki.
using System;
using System.Text;
using static R3.R3; // static variable acces

namespace R3
{
	public class R3
	{
		// just for debug and print output, the basis names
		public static string[] _basis = new[] { "1","e1","e2","e3","e12","e13","e23","e123" };

		private float[] _mVec = new float[8];

		/// <summary>
		/// Ctor
		/// </summary>
		/// <param name="f"></param>
		/// <param name="idx"></param>
		public R3(float f = 0f, int idx = 0)
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
		/// R3.Reverse : res = ~a
		/// Reverse the order of the basis blades.
		/// </summary>
		public static R3 operator ~ (R3 a)
		{
			R3 res = new R3();
			res[0]=a[0];
			res[1]=a[1];
			res[2]=a[2];
			res[3]=a[3];
			res[4]=-a[4];
			res[5]=-a[5];
			res[6]=-a[6];
			res[7]=-a[7];
			return res;
		}

		/// <summary>
		/// R3.Dual : res = !a
		/// Poincare duality operator.
		/// </summary>
		public static R3 operator ! (R3 a)
		{
			R3 res = new R3();
			res[0]=-a[7];
			res[1]=-a[6];
			res[2]=a[5];
			res[3]=-a[4];
			res[4]=a[3];
			res[5]=-a[2];
			res[6]=a[1];
			res[7]=a[0];
			return res;
		}

		/// <summary>
		/// R3.Conjugate : res = a.Conjugate()
		/// Clifford Conjugation
		/// </summary>
		public  R3 Conjugate ()
		{
			R3 res = new R3();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=-this[3];
			res[4]=-this[4];
			res[5]=-this[5];
			res[6]=-this[6];
			res[7]=this[7];
			return res;
		}

		/// <summary>
		/// R3.Involute : res = a.Involute()
		/// Main involution
		/// </summary>
		public  R3 Involute ()
		{
			R3 res = new R3();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=-this[3];
			res[4]=this[4];
			res[5]=this[5];
			res[6]=this[6];
			res[7]=-this[7];
			return res;
		}

		/// <summary>
		/// R3.Mul : res = a * b
		/// The geometric product.
		/// </summary>
		public static R3 operator * (R3 a, R3 b)
		{
			R3 res = new R3();
			res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]-b[7]*a[7];
			res[1]=b[1]*a[0]+b[0]*a[1]-b[4]*a[2]-b[5]*a[3]+b[2]*a[4]+b[3]*a[5]-b[7]*a[6]-b[6]*a[7];
			res[2]=b[2]*a[0]+b[4]*a[1]+b[0]*a[2]-b[6]*a[3]-b[1]*a[4]+b[7]*a[5]+b[3]*a[6]+b[5]*a[7];
			res[3]=b[3]*a[0]+b[5]*a[1]+b[6]*a[2]+b[0]*a[3]-b[7]*a[4]-b[1]*a[5]-b[2]*a[6]-b[4]*a[7];
			res[4]=b[4]*a[0]+b[2]*a[1]-b[1]*a[2]+b[7]*a[3]+b[0]*a[4]-b[6]*a[5]+b[5]*a[6]+b[3]*a[7];
			res[5]=b[5]*a[0]+b[3]*a[1]-b[7]*a[2]-b[1]*a[3]+b[6]*a[4]+b[0]*a[5]-b[4]*a[6]-b[2]*a[7];
			res[6]=b[6]*a[0]+b[7]*a[1]+b[3]*a[2]-b[2]*a[3]-b[5]*a[4]+b[4]*a[5]+b[0]*a[6]+b[1]*a[7];
			res[7]=b[7]*a[0]+b[6]*a[1]-b[5]*a[2]+b[4]*a[3]+b[3]*a[4]-b[2]*a[5]+b[1]*a[6]+b[0]*a[7];
			return res;
		}

		/// <summary>
		/// R3.Wedge : res = a ^ b
		/// The outer product. (MEET)
		/// </summary>
		public static R3 operator ^ (R3 a, R3 b)
		{
			R3 res = new R3();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			res[2]=b[2]*a[0]+b[0]*a[2];
			res[3]=b[3]*a[0]+b[0]*a[3];
			res[4]=b[4]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[4];
			res[5]=b[5]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[5];
			res[6]=b[6]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[6];
			res[7]=b[7]*a[0]+b[6]*a[1]-b[5]*a[2]+b[4]*a[3]+b[3]*a[4]-b[2]*a[5]+b[1]*a[6]+b[0]*a[7];
			return res;
		}

		/// <summary>
		/// R3.Vee : res = a & b
		/// The regressive product. (JOIN)
		/// </summary>
		public static R3 operator & (R3 a, R3 b)
		{
			R3 res = new R3();
			res[7]=b[7]*a[7];
			res[6]=b[6]*a[7]+b[7]*a[6];
			res[5]=b[5]*a[7]+b[7]*a[5];
			res[4]=b[4]*a[7]+b[7]*a[4];
			res[3]=b[3]*a[7]+b[5]*a[6]-b[6]*a[5]+b[7]*a[3];
			res[2]=b[2]*a[7]+b[4]*a[6]-b[6]*a[4]+b[7]*a[2];
			res[1]=b[1]*a[7]+b[4]*a[5]-b[5]*a[4]+b[7]*a[1];
			res[0]=b[0]*a[7]+b[1]*a[6]-b[2]*a[5]+b[3]*a[4]+b[4]*a[3]-b[5]*a[2]+b[6]*a[1]+b[7]*a[0];
			return res;
		}

		/// <summary>
		/// R3.Dot : res = a | b
		/// The inner product.
		/// </summary>
		public static R3 operator | (R3 a, R3 b)
		{
			R3 res = new R3();
			res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]-b[7]*a[7];
			res[1]=b[1]*a[0]+b[0]*a[1]-b[4]*a[2]-b[5]*a[3]+b[2]*a[4]+b[3]*a[5]-b[7]*a[6]-b[6]*a[7];
			res[2]=b[2]*a[0]+b[4]*a[1]+b[0]*a[2]-b[6]*a[3]-b[1]*a[4]+b[7]*a[5]+b[3]*a[6]+b[5]*a[7];
			res[3]=b[3]*a[0]+b[5]*a[1]+b[6]*a[2]+b[0]*a[3]-b[7]*a[4]-b[1]*a[5]-b[2]*a[6]-b[4]*a[7];
			res[4]=b[4]*a[0]+b[7]*a[3]+b[0]*a[4]+b[3]*a[7];
			res[5]=b[5]*a[0]-b[7]*a[2]+b[0]*a[5]-b[2]*a[7];
			res[6]=b[6]*a[0]+b[7]*a[1]+b[0]*a[6]+b[1]*a[7];
			res[7]=b[7]*a[0]+b[0]*a[7];
			return res;
		}

		/// <summary>
		/// R3.Add : res = a + b
		/// Multivector addition
		/// </summary>
		public static R3 operator + (R3 a, R3 b)
		{
			R3 res = new R3();
			res[0] = a[0]+b[0];
			res[1] = a[1]+b[1];
			res[2] = a[2]+b[2];
			res[3] = a[3]+b[3];
			res[4] = a[4]+b[4];
			res[5] = a[5]+b[5];
			res[6] = a[6]+b[6];
			res[7] = a[7]+b[7];
			return res;
		}

		/// <summary>
		/// R3.Sub : res = a - b
		/// Multivector subtraction
		/// </summary>
		public static R3 operator - (R3 a, R3 b)
		{
			R3 res = new R3();
			res[0] = a[0]-b[0];
			res[1] = a[1]-b[1];
			res[2] = a[2]-b[2];
			res[3] = a[3]-b[3];
			res[4] = a[4]-b[4];
			res[5] = a[5]-b[5];
			res[6] = a[6]-b[6];
			res[7] = a[7]-b[7];
			return res;
		}

		/// <summary>
		/// R3.smul : res = a * b
		/// scalar/multivector multiplication
		/// </summary>
		public static R3 operator * (float a, R3 b)
		{
			R3 res = new R3();
			res[0] = a*b[0];
			res[1] = a*b[1];
			res[2] = a*b[2];
			res[3] = a*b[3];
			res[4] = a*b[4];
			res[5] = a*b[5];
			res[6] = a*b[6];
			res[7] = a*b[7];
			return res;
		}

		/// <summary>
		/// R3.muls : res = a * b
		/// multivector/scalar multiplication
		/// </summary>
		public static R3 operator * (R3 a, float b)
		{
			R3 res = new R3();
			res[0] = a[0]*b;
			res[1] = a[1]*b;
			res[2] = a[2]*b;
			res[3] = a[3]*b;
			res[4] = a[4]*b;
			res[5] = a[5]*b;
			res[6] = a[6]*b;
			res[7] = a[7]*b;
			return res;
		}

		/// <summary>
		/// R3.sadd : res = a + b
		/// scalar/multivector addition
		/// </summary>
		public static R3 operator + (float a, R3 b)
		{
			R3 res = new R3();
			res[0] = a+b[0];
			res[1] = b[1];
			res[2] = b[2];
			res[3] = b[3];
			res[4] = b[4];
			res[5] = b[5];
			res[6] = b[6];
			res[7] = b[7];
			return res;
		}

		/// <summary>
		/// R3.adds : res = a + b
		/// multivector/scalar addition
		/// </summary>
		public static R3 operator + (R3 a, float b)
		{
			R3 res = new R3();
			res[0] = a[0]+b;
			res[1] = a[1];
			res[2] = a[2];
			res[3] = a[3];
			res[4] = a[4];
			res[5] = a[5];
			res[6] = a[6];
			res[7] = a[7];
			return res;
		}

		#endregion

                /// <summary>
                /// R3.norm()
                /// Calculate the Euclidean norm. (strict positive).
                /// </summary>
		public float norm() { return (float) Math.Sqrt(Math.Abs((this*this.Conjugate())[0]));}
		
		/// <summary>
		/// R3.inorm()
		/// Calculate the Ideal norm. (signed)
		/// </summary>
		public float inorm() { return this[1]!=0.0f?this[1]:this[15]!=0.0f?this[15]:(!this).norm();}
		
		/// <summary>
		/// R3.normalized()
		/// Returns a normalized (Euclidean) element.
		/// </summary>
		public R3 normalized() { return this*(1/norm()); }
		
		
		// The basis blades
		public static R3 e1 = new R3(1f, 1);
		public static R3 e2 = new R3(1f, 2);
		public static R3 e3 = new R3(1f, 3);
		public static R3 e12 = new R3(1f, 4);
		public static R3 e13 = new R3(1f, 5);
		public static R3 e23 = new R3(1f, 6);
		public static R3 e123 = new R3(1f, 7);

		
		/// string cast
		public override string ToString()
		{
			var sb = new StringBuilder();
			var n=0;
			for (int i = 0; i < 8; ++i) 
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
			Console.WriteLine("pss           : "+e123);
			Console.WriteLine("pss*pss       : "+e123*e123);

		}
	}
}

