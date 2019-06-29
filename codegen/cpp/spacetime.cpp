// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e1","e2","e3","e4","e12","e13","e14","e23","e24","e34","e123","e124","e134","e234","e1234" };

class SPACETIME {
  public:
    SPACETIME ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    SPACETIME (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    SPACETIME log () { int n=0; for (int i=0,j=0;i<16;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    SPACETIME Conjugate(); 
    SPACETIME Involute();
    float norm();
    float inorm();
    SPACETIME normalized();
  private:  
    float mvec[16];
};


//***********************
// SPACETIME.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline SPACETIME operator ~ (const SPACETIME &a) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.Dual : res = !a
// Poincare duality operator.
//***********************
inline SPACETIME operator ! (const SPACETIME &a) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline SPACETIME SPACETIME::Conjugate () {
  SPACETIME res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=-this->mvec[3];
  res[4]=-this->mvec[4];
  res[5]=-this->mvec[5];
  res[6]=-this->mvec[6];
  res[7]=-this->mvec[7];
  res[8]=-this->mvec[8];
  res[9]=-this->mvec[9];
  res[10]=-this->mvec[10];
  res[11]=this->mvec[11];
  res[12]=this->mvec[12];
  res[13]=this->mvec[13];
  res[14]=this->mvec[14];
  res[15]=this->mvec[15];
  return res;
};

//***********************
// SPACETIME.Involute : res = a.Involute()
// Main involution
//***********************
inline SPACETIME SPACETIME::Involute () {
  SPACETIME res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=-this->mvec[3];
  res[4]=-this->mvec[4];
  res[5]=this->mvec[5];
  res[6]=this->mvec[6];
  res[7]=this->mvec[7];
  res[8]=this->mvec[8];
  res[9]=this->mvec[9];
  res[10]=this->mvec[10];
  res[11]=-this->mvec[11];
  res[12]=-this->mvec[12];
  res[13]=-this->mvec[13];
  res[14]=-this->mvec[14];
  res[15]=this->mvec[15];
  return res;
};

//***********************
// SPACETIME.Mul : res = a * b 
// The geometric product.
//***********************
inline SPACETIME operator * (const SPACETIME &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline SPACETIME operator ^ (const SPACETIME &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline SPACETIME operator & (const SPACETIME &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.Dot : res = a | b 
// The inner product.
//***********************
inline SPACETIME operator | (const SPACETIME &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.Add : res = a + b 
// Multivector addition
//***********************
inline SPACETIME operator + (const SPACETIME &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.Sub : res = a - b 
// Multivector subtraction
//***********************
inline SPACETIME operator - (const SPACETIME &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline SPACETIME operator * (const float &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline SPACETIME operator * (const SPACETIME &a, const float &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline SPACETIME operator + (const float &a, const SPACETIME &b) {
  SPACETIME res;
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
};

//***********************
// SPACETIME.adds : res = a + b 
// multivector/scalar addition
//***********************
inline SPACETIME operator + (const SPACETIME &a, const float &b) {
  SPACETIME res;
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
};


inline float SPACETIME::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float SPACETIME::inorm() { return (!(*this)).norm(); }
inline SPACETIME SPACETIME::normalized() { return (*this) * (1/norm()); }


static SPACETIME e1(1.0f,1);
static SPACETIME e2(1.0f,2);
static SPACETIME e3(1.0f,3);
static SPACETIME e4(1.0f,4);
static SPACETIME e12(1.0f,5);
static SPACETIME e13(1.0f,6);
static SPACETIME e14(1.0f,7);
static SPACETIME e23(1.0f,8);
static SPACETIME e24(1.0f,9);
static SPACETIME e34(1.0f,10);
static SPACETIME e123(1.0f,11);
static SPACETIME e124(1.0f,12);
static SPACETIME e134(1.0f,13);
static SPACETIME e234(1.0f,14);
static SPACETIME e1234(1.0f,15);


int main (int argc, char **argv) {
  
  printf("e1*e1         : "); (e1*e1).log();
  printf("pss           : "); e1234.log();
  printf("pss*pss       : "); (e1234*e1234).log();

  return 0;
}