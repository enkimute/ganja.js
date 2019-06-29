// 3D Projective Geometric Algebra
// Written by a generator written by enki.
using System;
using System.Text;
using static SPA.SPACETIME; // static variable acces

namespace SPA
{
	public class SPACETIME
	{
		// just for debug and print output, the basis names
		public static string[] _basis = new[] { "1","e1","e2","e3","e4","e12","e13","e14","e23","e24","e34","e123","e124","e134","e234","e1234" };

		private float[] _mVec = new float[16];

		/// <summary>
		/// Ctor
		/// </summary>
		/// <param name="f"></param>
		/// <param name="idx"></param>
		public SPACETIME(float f = 0f, int idx = 0)
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
		/// SPACETIME.Reverse : res = ~a
		/// Reverse the order of the basis blades.
		/// </summary>
		public static SPACETIME operator ~ (SPACETIME a)
		{
			SPACETIME res = new SPACETIME();
			res[0]=a[0];
			res[1]=a[1];
			res[2]=a[2];
			res[3]=a[3];
			res[4]=a[4];
			res[5]=-a[5];
			res[6]=-a[6];
			res[7]=-a[7];
			res[8]=-a[8];
			res[9]=-a[9];
			res[10]=-a[10];
			res[11]=-a[11];
			res[12]=-a[12];
			res[13]=-a[13];
			res[14]=-a[14];
			res[15]=a[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.Dual : res = !a
		/// Poincare duality operator.
		/// </summary>
		public static SPACETIME operator ! (SPACETIME a)
		{
			SPACETIME res = new SPACETIME();
			res[0]=-a[15];
			res[1]=a[14];
			res[2]=-a[13];
			res[3]=a[12];
			res[4]=a[11];
			res[5]=a[10];
			res[6]=-a[9];
			res[7]=-a[8];
			res[8]=a[7];
			res[9]=a[6];
			res[10]=-a[5];
			res[11]=-a[4];
			res[12]=-a[3];
			res[13]=a[2];
			res[14]=-a[1];
			res[15]=a[0];
			return res;
		}

		/// <summary>
		/// SPACETIME.Conjugate : res = a.Conjugate()
		/// Clifford Conjugation
		/// </summary>
		public  SPACETIME Conjugate ()
		{
			SPACETIME res = new SPACETIME();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=-this[3];
			res[4]=-this[4];
			res[5]=-this[5];
			res[6]=-this[6];
			res[7]=-this[7];
			res[8]=-this[8];
			res[9]=-this[9];
			res[10]=-this[10];
			res[11]=this[11];
			res[12]=this[12];
			res[13]=this[13];
			res[14]=this[14];
			res[15]=this[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.Involute : res = a.Involute()
		/// Main involution
		/// </summary>
		public  SPACETIME Involute ()
		{
			SPACETIME res = new SPACETIME();
			res[0]=this[0];
			res[1]=-this[1];
			res[2]=-this[2];
			res[3]=-this[3];
			res[4]=-this[4];
			res[5]=this[5];
			res[6]=this[6];
			res[7]=this[7];
			res[8]=this[8];
			res[9]=this[9];
			res[10]=this[10];
			res[11]=-this[11];
			res[12]=-this[12];
			res[13]=-this[13];
			res[14]=-this[14];
			res[15]=this[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.Mul : res = a * b
		/// The geometric product.
		/// </summary>
		public static SPACETIME operator * (SPACETIME a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]+b[7]*a[7]-b[8]*a[8]+b[9]*a[9]+b[10]*a[10]-b[11]*a[11]+b[12]*a[12]+b[13]*a[13]+b[14]*a[14]-b[15]*a[15];
			res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]+b[7]*a[4]+b[2]*a[5]+b[3]*a[6]-b[4]*a[7]-b[11]*a[8]+b[12]*a[9]+b[13]*a[10]-b[8]*a[11]+b[9]*a[12]+b[10]*a[13]-b[15]*a[14]+b[14]*a[15];
			res[2]=b[2]*a[0]+b[5]*a[1]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]-b[1]*a[5]+b[11]*a[6]-b[12]*a[7]+b[3]*a[8]-b[4]*a[9]+b[14]*a[10]+b[6]*a[11]-b[7]*a[12]+b[15]*a[13]+b[10]*a[14]-b[13]*a[15];
			res[3]=b[3]*a[0]+b[6]*a[1]+b[8]*a[2]+b[0]*a[3]+b[10]*a[4]-b[11]*a[5]-b[1]*a[6]-b[13]*a[7]-b[2]*a[8]-b[14]*a[9]-b[4]*a[10]-b[5]*a[11]-b[15]*a[12]-b[7]*a[13]-b[9]*a[14]+b[12]*a[15];
			res[4]=b[4]*a[0]+b[7]*a[1]+b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[12]*a[5]-b[13]*a[6]-b[1]*a[7]-b[14]*a[8]-b[2]*a[9]-b[3]*a[10]-b[15]*a[11]-b[5]*a[12]-b[6]*a[13]-b[8]*a[14]+b[11]*a[15];
			res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[11]*a[3]-b[12]*a[4]+b[0]*a[5]-b[8]*a[6]+b[9]*a[7]+b[6]*a[8]-b[7]*a[9]+b[15]*a[10]+b[3]*a[11]-b[4]*a[12]+b[14]*a[13]-b[13]*a[14]+b[10]*a[15];
			res[6]=b[6]*a[0]+b[3]*a[1]-b[11]*a[2]-b[1]*a[3]-b[13]*a[4]+b[8]*a[5]+b[0]*a[6]+b[10]*a[7]-b[5]*a[8]-b[15]*a[9]-b[7]*a[10]-b[2]*a[11]-b[14]*a[12]-b[4]*a[13]+b[12]*a[14]-b[9]*a[15];
			res[7]=b[7]*a[0]+b[4]*a[1]-b[12]*a[2]-b[13]*a[3]-b[1]*a[4]+b[9]*a[5]+b[10]*a[6]+b[0]*a[7]-b[15]*a[8]-b[5]*a[9]-b[6]*a[10]-b[14]*a[11]-b[2]*a[12]-b[3]*a[13]+b[11]*a[14]-b[8]*a[15];
			res[8]=b[8]*a[0]+b[11]*a[1]+b[3]*a[2]-b[2]*a[3]-b[14]*a[4]-b[6]*a[5]+b[5]*a[6]+b[15]*a[7]+b[0]*a[8]+b[10]*a[9]-b[9]*a[10]+b[1]*a[11]+b[13]*a[12]-b[12]*a[13]-b[4]*a[14]+b[7]*a[15];
			res[9]=b[9]*a[0]+b[12]*a[1]+b[4]*a[2]-b[14]*a[3]-b[2]*a[4]-b[7]*a[5]+b[15]*a[6]+b[5]*a[7]+b[10]*a[8]+b[0]*a[9]-b[8]*a[10]+b[13]*a[11]+b[1]*a[12]-b[11]*a[13]-b[3]*a[14]+b[6]*a[15];
			res[10]=b[10]*a[0]+b[13]*a[1]+b[14]*a[2]+b[4]*a[3]-b[3]*a[4]-b[15]*a[5]-b[7]*a[6]+b[6]*a[7]-b[9]*a[8]+b[8]*a[9]+b[0]*a[10]-b[12]*a[11]+b[11]*a[12]+b[1]*a[13]+b[2]*a[14]-b[5]*a[15];
			res[11]=b[11]*a[0]+b[8]*a[1]-b[6]*a[2]+b[5]*a[3]+b[15]*a[4]+b[3]*a[5]-b[2]*a[6]-b[14]*a[7]+b[1]*a[8]+b[13]*a[9]-b[12]*a[10]+b[0]*a[11]+b[10]*a[12]-b[9]*a[13]+b[7]*a[14]-b[4]*a[15];
			res[12]=b[12]*a[0]+b[9]*a[1]-b[7]*a[2]+b[15]*a[3]+b[5]*a[4]+b[4]*a[5]-b[14]*a[6]-b[2]*a[7]+b[13]*a[8]+b[1]*a[9]-b[11]*a[10]+b[10]*a[11]+b[0]*a[12]-b[8]*a[13]+b[6]*a[14]-b[3]*a[15];
			res[13]=b[13]*a[0]+b[10]*a[1]-b[15]*a[2]-b[7]*a[3]+b[6]*a[4]+b[14]*a[5]+b[4]*a[6]-b[3]*a[7]-b[12]*a[8]+b[11]*a[9]+b[1]*a[10]-b[9]*a[11]+b[8]*a[12]+b[0]*a[13]-b[5]*a[14]+b[2]*a[15];
			res[14]=b[14]*a[0]+b[15]*a[1]+b[10]*a[2]-b[9]*a[3]+b[8]*a[4]-b[13]*a[5]+b[12]*a[6]-b[11]*a[7]+b[4]*a[8]-b[3]*a[9]+b[2]*a[10]+b[7]*a[11]-b[6]*a[12]+b[5]*a[13]+b[0]*a[14]-b[1]*a[15];
			res[15]=b[15]*a[0]+b[14]*a[1]-b[13]*a[2]+b[12]*a[3]-b[11]*a[4]+b[10]*a[5]-b[9]*a[6]+b[8]*a[7]+b[7]*a[8]-b[6]*a[9]+b[5]*a[10]+b[4]*a[11]-b[3]*a[12]+b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.Wedge : res = a ^ b
		/// The outer product. (MEET)
		/// </summary>
		public static SPACETIME operator ^ (SPACETIME a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[0]=b[0]*a[0];
			res[1]=b[1]*a[0]+b[0]*a[1];
			res[2]=b[2]*a[0]+b[0]*a[2];
			res[3]=b[3]*a[0]+b[0]*a[3];
			res[4]=b[4]*a[0]+b[0]*a[4];
			res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[5];
			res[6]=b[6]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[6];
			res[7]=b[7]*a[0]+b[4]*a[1]-b[1]*a[4]+b[0]*a[7];
			res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[8];
			res[9]=b[9]*a[0]+b[4]*a[2]-b[2]*a[4]+b[0]*a[9];
			res[10]=b[10]*a[0]+b[4]*a[3]-b[3]*a[4]+b[0]*a[10];
			res[11]=b[11]*a[0]+b[8]*a[1]-b[6]*a[2]+b[5]*a[3]+b[3]*a[5]-b[2]*a[6]+b[1]*a[8]+b[0]*a[11];
			res[12]=b[12]*a[0]+b[9]*a[1]-b[7]*a[2]+b[5]*a[4]+b[4]*a[5]-b[2]*a[7]+b[1]*a[9]+b[0]*a[12];
			res[13]=b[13]*a[0]+b[10]*a[1]-b[7]*a[3]+b[6]*a[4]+b[4]*a[6]-b[3]*a[7]+b[1]*a[10]+b[0]*a[13];
			res[14]=b[14]*a[0]+b[10]*a[2]-b[9]*a[3]+b[8]*a[4]+b[4]*a[8]-b[3]*a[9]+b[2]*a[10]+b[0]*a[14];
			res[15]=b[15]*a[0]+b[14]*a[1]-b[13]*a[2]+b[12]*a[3]-b[11]*a[4]+b[10]*a[5]-b[9]*a[6]+b[8]*a[7]+b[7]*a[8]-b[6]*a[9]+b[5]*a[10]+b[4]*a[11]-b[3]*a[12]+b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.Vee : res = a & b
		/// The regressive product. (JOIN)
		/// </summary>
		public static SPACETIME operator & (SPACETIME a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[15]=b[15]*a[15];
			res[14]=b[14]*a[15]+b[15]*a[14];
			res[13]=b[13]*a[15]+b[15]*a[13];
			res[12]=b[12]*a[15]+b[15]*a[12];
			res[11]=b[11]*a[15]+b[15]*a[11];
			res[10]=b[10]*a[15]+b[13]*a[14]-b[14]*a[13]+b[15]*a[10];
			res[9]=b[9]*a[15]+b[12]*a[14]-b[14]*a[12]+b[15]*a[9];
			res[8]=b[8]*a[15]+b[11]*a[14]-b[14]*a[11]+b[15]*a[8];
			res[7]=b[7]*a[15]+b[12]*a[13]-b[13]*a[12]+b[15]*a[7];
			res[6]=b[6]*a[15]+b[11]*a[13]-b[13]*a[11]+b[15]*a[6];
			res[5]=b[5]*a[15]+b[11]*a[12]-b[12]*a[11]+b[15]*a[5];
			res[4]=b[4]*a[15]+b[7]*a[14]-b[9]*a[13]+b[10]*a[12]+b[12]*a[10]-b[13]*a[9]+b[14]*a[7]+b[15]*a[4];
			res[3]=b[3]*a[15]+b[6]*a[14]-b[8]*a[13]+b[10]*a[11]+b[11]*a[10]-b[13]*a[8]+b[14]*a[6]+b[15]*a[3];
			res[2]=b[2]*a[15]+b[5]*a[14]-b[8]*a[12]+b[9]*a[11]+b[11]*a[9]-b[12]*a[8]+b[14]*a[5]+b[15]*a[2];
			res[1]=b[1]*a[15]+b[5]*a[13]-b[6]*a[12]+b[7]*a[11]+b[11]*a[7]-b[12]*a[6]+b[13]*a[5]+b[15]*a[1];
			res[0]=b[0]*a[15]+b[1]*a[14]-b[2]*a[13]+b[3]*a[12]-b[4]*a[11]+b[5]*a[10]-b[6]*a[9]+b[7]*a[8]+b[8]*a[7]-b[9]*a[6]+b[10]*a[5]+b[11]*a[4]-b[12]*a[3]+b[13]*a[2]-b[14]*a[1]+b[15]*a[0];
			return res;
		}

		/// <summary>
		/// SPACETIME.Dot : res = a | b
		/// The inner product.
		/// </summary>
		public static SPACETIME operator | (SPACETIME a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]+b[3]*a[3]-b[4]*a[4]-b[5]*a[5]-b[6]*a[6]+b[7]*a[7]-b[8]*a[8]+b[9]*a[9]+b[10]*a[10]-b[11]*a[11]+b[12]*a[12]+b[13]*a[13]+b[14]*a[14]-b[15]*a[15];
			res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]+b[7]*a[4]+b[2]*a[5]+b[3]*a[6]-b[4]*a[7]-b[11]*a[8]+b[12]*a[9]+b[13]*a[10]-b[8]*a[11]+b[9]*a[12]+b[10]*a[13]-b[15]*a[14]+b[14]*a[15];
			res[2]=b[2]*a[0]+b[5]*a[1]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]-b[1]*a[5]+b[11]*a[6]-b[12]*a[7]+b[3]*a[8]-b[4]*a[9]+b[14]*a[10]+b[6]*a[11]-b[7]*a[12]+b[15]*a[13]+b[10]*a[14]-b[13]*a[15];
			res[3]=b[3]*a[0]+b[6]*a[1]+b[8]*a[2]+b[0]*a[3]+b[10]*a[4]-b[11]*a[5]-b[1]*a[6]-b[13]*a[7]-b[2]*a[8]-b[14]*a[9]-b[4]*a[10]-b[5]*a[11]-b[15]*a[12]-b[7]*a[13]-b[9]*a[14]+b[12]*a[15];
			res[4]=b[4]*a[0]+b[7]*a[1]+b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[12]*a[5]-b[13]*a[6]-b[1]*a[7]-b[14]*a[8]-b[2]*a[9]-b[3]*a[10]-b[15]*a[11]-b[5]*a[12]-b[6]*a[13]-b[8]*a[14]+b[11]*a[15];
			res[5]=b[5]*a[0]+b[11]*a[3]-b[12]*a[4]+b[0]*a[5]+b[15]*a[10]+b[3]*a[11]-b[4]*a[12]+b[10]*a[15];
			res[6]=b[6]*a[0]-b[11]*a[2]-b[13]*a[4]+b[0]*a[6]-b[15]*a[9]-b[2]*a[11]-b[4]*a[13]-b[9]*a[15];
			res[7]=b[7]*a[0]-b[12]*a[2]-b[13]*a[3]+b[0]*a[7]-b[15]*a[8]-b[2]*a[12]-b[3]*a[13]-b[8]*a[15];
			res[8]=b[8]*a[0]+b[11]*a[1]-b[14]*a[4]+b[15]*a[7]+b[0]*a[8]+b[1]*a[11]-b[4]*a[14]+b[7]*a[15];
			res[9]=b[9]*a[0]+b[12]*a[1]-b[14]*a[3]+b[15]*a[6]+b[0]*a[9]+b[1]*a[12]-b[3]*a[14]+b[6]*a[15];
			res[10]=b[10]*a[0]+b[13]*a[1]+b[14]*a[2]-b[15]*a[5]+b[0]*a[10]+b[1]*a[13]+b[2]*a[14]-b[5]*a[15];
			res[11]=b[11]*a[0]+b[15]*a[4]+b[0]*a[11]-b[4]*a[15];
			res[12]=b[12]*a[0]+b[15]*a[3]+b[0]*a[12]-b[3]*a[15];
			res[13]=b[13]*a[0]-b[15]*a[2]+b[0]*a[13]+b[2]*a[15];
			res[14]=b[14]*a[0]+b[15]*a[1]+b[0]*a[14]-b[1]*a[15];
			res[15]=b[15]*a[0]+b[0]*a[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.Add : res = a + b
		/// Multivector addition
		/// </summary>
		public static SPACETIME operator + (SPACETIME a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[0] = a[0]+b[0];
			res[1] = a[1]+b[1];
			res[2] = a[2]+b[2];
			res[3] = a[3]+b[3];
			res[4] = a[4]+b[4];
			res[5] = a[5]+b[5];
			res[6] = a[6]+b[6];
			res[7] = a[7]+b[7];
			res[8] = a[8]+b[8];
			res[9] = a[9]+b[9];
			res[10] = a[10]+b[10];
			res[11] = a[11]+b[11];
			res[12] = a[12]+b[12];
			res[13] = a[13]+b[13];
			res[14] = a[14]+b[14];
			res[15] = a[15]+b[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.Sub : res = a - b
		/// Multivector subtraction
		/// </summary>
		public static SPACETIME operator - (SPACETIME a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[0] = a[0]-b[0];
			res[1] = a[1]-b[1];
			res[2] = a[2]-b[2];
			res[3] = a[3]-b[3];
			res[4] = a[4]-b[4];
			res[5] = a[5]-b[5];
			res[6] = a[6]-b[6];
			res[7] = a[7]-b[7];
			res[8] = a[8]-b[8];
			res[9] = a[9]-b[9];
			res[10] = a[10]-b[10];
			res[11] = a[11]-b[11];
			res[12] = a[12]-b[12];
			res[13] = a[13]-b[13];
			res[14] = a[14]-b[14];
			res[15] = a[15]-b[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.smul : res = a * b
		/// scalar/multivector multiplication
		/// </summary>
		public static SPACETIME operator * (float a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[0] = a*b[0];
			res[1] = a*b[1];
			res[2] = a*b[2];
			res[3] = a*b[3];
			res[4] = a*b[4];
			res[5] = a*b[5];
			res[6] = a*b[6];
			res[7] = a*b[7];
			res[8] = a*b[8];
			res[9] = a*b[9];
			res[10] = a*b[10];
			res[11] = a*b[11];
			res[12] = a*b[12];
			res[13] = a*b[13];
			res[14] = a*b[14];
			res[15] = a*b[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.muls : res = a * b
		/// multivector/scalar multiplication
		/// </summary>
		public static SPACETIME operator * (SPACETIME a, float b)
		{
			SPACETIME res = new SPACETIME();
			res[0] = a[0]*b;
			res[1] = a[1]*b;
			res[2] = a[2]*b;
			res[3] = a[3]*b;
			res[4] = a[4]*b;
			res[5] = a[5]*b;
			res[6] = a[6]*b;
			res[7] = a[7]*b;
			res[8] = a[8]*b;
			res[9] = a[9]*b;
			res[10] = a[10]*b;
			res[11] = a[11]*b;
			res[12] = a[12]*b;
			res[13] = a[13]*b;
			res[14] = a[14]*b;
			res[15] = a[15]*b;
			return res;
		}

		/// <summary>
		/// SPACETIME.sadd : res = a + b
		/// scalar/multivector addition
		/// </summary>
		public static SPACETIME operator + (float a, SPACETIME b)
		{
			SPACETIME res = new SPACETIME();
			res[0] = a+b[0];
			res[1] = b[1];
			res[2] = b[2];
			res[3] = b[3];
			res[4] = b[4];
			res[5] = b[5];
			res[6] = b[6];
			res[7] = b[7];
			res[8] = b[8];
			res[9] = b[9];
			res[10] = b[10];
			res[11] = b[11];
			res[12] = b[12];
			res[13] = b[13];
			res[14] = b[14];
			res[15] = b[15];
			return res;
		}

		/// <summary>
		/// SPACETIME.adds : res = a + b
		/// multivector/scalar addition
		/// </summary>
		public static SPACETIME operator + (SPACETIME a, float b)
		{
			SPACETIME res = new SPACETIME();
			res[0] = a[0]+b;
			res[1] = a[1];
			res[2] = a[2];
			res[3] = a[3];
			res[4] = a[4];
			res[5] = a[5];
			res[6] = a[6];
			res[7] = a[7];
			res[8] = a[8];
			res[9] = a[9];
			res[10] = a[10];
			res[11] = a[11];
			res[12] = a[12];
			res[13] = a[13];
			res[14] = a[14];
			res[15] = a[15];
			return res;
		}

		#endregion

                /// <summary>
                /// SPACETIME.norm()
                /// Calculate the Euclidean norm. (strict positive).
                /// </summary>
		public float norm() { return (float) Math.Sqrt(Math.Abs((this*this.Conjugate())[0]));}
		
		/// <summary>
		/// SPACETIME.inorm()
		/// Calculate the Ideal norm. (signed)
		/// </summary>
		public float inorm() { return this[1]!=0.0f?this[1]:this[15]!=0.0f?this[15]:(!this).norm();}
		
		/// <summary>
		/// SPACETIME.normalized()
		/// Returns a normalized (Euclidean) element.
		/// </summary>
		public SPACETIME normalized() { return this*(1/norm()); }
		
		
		// The basis blades
		public static SPACETIME e1 = new SPACETIME(1f, 1);
		public static SPACETIME e2 = new SPACETIME(1f, 2);
		public static SPACETIME e3 = new SPACETIME(1f, 3);
		public static SPACETIME e4 = new SPACETIME(1f, 4);
		public static SPACETIME e12 = new SPACETIME(1f, 5);
		public static SPACETIME e13 = new SPACETIME(1f, 6);
		public static SPACETIME e14 = new SPACETIME(1f, 7);
		public static SPACETIME e23 = new SPACETIME(1f, 8);
		public static SPACETIME e24 = new SPACETIME(1f, 9);
		public static SPACETIME e34 = new SPACETIME(1f, 10);
		public static SPACETIME e123 = new SPACETIME(1f, 11);
		public static SPACETIME e124 = new SPACETIME(1f, 12);
		public static SPACETIME e134 = new SPACETIME(1f, 13);
		public static SPACETIME e234 = new SPACETIME(1f, 14);
		public static SPACETIME e1234 = new SPACETIME(1f, 15);

		
		/// string cast
		public override string ToString()
		{
			var sb = new StringBuilder();
			var n=0;
			for (int i = 0; i < 16; ++i) 
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
			Console.WriteLine("pss           : "+e1234);
			Console.WriteLine("pss*pss       : "+e1234*e1234);

		}
	}
}

