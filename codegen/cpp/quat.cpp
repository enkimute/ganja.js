// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e1","e2","e12" };

class QUAT {
  public:
    QUAT ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    QUAT (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    QUAT log () { int n=0; for (int i=0,j=0;i<4;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    QUAT Conjugate(); 
    QUAT Involute();
    float norm();
    float inorm();
    QUAT normalized();
  private:  
    float mvec[4];
};


//***********************
// QUAT.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline QUAT operator ~ (const QUAT &a) {
  QUAT res;
  res[0]=a[0];
  res[1]=a[1];
  res[2]=a[2];
  res[3]=-a[3];
  return res;
};

//***********************
// QUAT.Dual : res = !a
// Poincare duality operator.
//***********************
inline QUAT operator ! (const QUAT &a) {
  QUAT res;
  res[0]=-a[3];
  res[1]=-a[2];
  res[2]=a[1];
  res[3]=a[0];
  return res;
};

//***********************
// QUAT.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline QUAT QUAT::Conjugate () {
  QUAT res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=-this->mvec[3];
  return res;
};

//***********************
// QUAT.Involute : res = a.Involute()
// Main involution
//***********************
inline QUAT QUAT::Involute () {
  QUAT res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=this->mvec[3];
  return res;
};

//***********************
// QUAT.Mul : res = a * b 
// The geometric product.
//***********************
inline QUAT operator * (const QUAT &a, const QUAT &b) {
  QUAT res;
  res[0]=b[0]*a[0]-b[1]*a[1]-b[2]*a[2]-b[3]*a[3];
  res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
  res[2]=b[2]*a[0]-b[3]*a[1]+b[0]*a[2]+b[1]*a[3];
  res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
  return res;
};

//***********************
// QUAT.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline QUAT operator ^ (const QUAT &a, const QUAT &b) {
  QUAT res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  res[2]=b[2]*a[0]+b[0]*a[2];
  res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
  return res;
};

//***********************
// QUAT.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline QUAT operator & (const QUAT &a, const QUAT &b) {
  QUAT res;
  res[3]=b[3]*a[3];
  res[2]=b[2]*a[3]+b[3]*a[2];
  res[1]=b[1]*a[3]+b[3]*a[1];
  res[0]=b[0]*a[3]+b[1]*a[2]-b[2]*a[1]+b[3]*a[0];
  return res;
};

//***********************
// QUAT.Dot : res = a | b 
// The inner product.
//***********************
inline QUAT operator | (const QUAT &a, const QUAT &b) {
  QUAT res;
  res[0]=b[0]*a[0]-b[1]*a[1]-b[2]*a[2]-b[3]*a[3];
  res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
  res[2]=b[2]*a[0]-b[3]*a[1]+b[0]*a[2]+b[1]*a[3];
  res[3]=b[3]*a[0]+b[0]*a[3];
  return res;
};

//***********************
// QUAT.Add : res = a + b 
// Multivector addition
//***********************
inline QUAT operator + (const QUAT &a, const QUAT &b) {
  QUAT res;
      res[0] = a[0]+b[0];
    res[1] = a[1]+b[1];
    res[2] = a[2]+b[2];
    res[3] = a[3]+b[3];
  return res;
};

//***********************
// QUAT.Sub : res = a - b 
// Multivector subtraction
//***********************
inline QUAT operator - (const QUAT &a, const QUAT &b) {
  QUAT res;
      res[0] = a[0]-b[0];
    res[1] = a[1]-b[1];
    res[2] = a[2]-b[2];
    res[3] = a[3]-b[3];
  return res;
};

//***********************
// QUAT.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline QUAT operator * (const float &a, const QUAT &b) {
  QUAT res;
      res[0] = a*b[0];
    res[1] = a*b[1];
    res[2] = a*b[2];
    res[3] = a*b[3];
  return res;
};

//***********************
// QUAT.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline QUAT operator * (const QUAT &a, const float &b) {
  QUAT res;
      res[0] = a[0]*b;
    res[1] = a[1]*b;
    res[2] = a[2]*b;
    res[3] = a[3]*b;
  return res;
};

//***********************
// QUAT.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline QUAT operator + (const float &a, const QUAT &b) {
  QUAT res;
    res[0] = a+b[0];
      res[1] = b[1];
    res[2] = b[2];
    res[3] = b[3];
  return res;
};

//***********************
// QUAT.adds : res = a + b 
// multivector/scalar addition
//***********************
inline QUAT operator + (const QUAT &a, const float &b) {
  QUAT res;
    res[0] = a[0]+b;
      res[1] = a[1];
    res[2] = a[2];
    res[3] = a[3];
  return res;
};


inline float QUAT::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float QUAT::inorm() { return (!(*this)).norm(); }
inline QUAT QUAT::normalized() { return (*this) * (1/norm()); }


static QUAT e1(1.0f,1);
static QUAT e2(1.0f,2);
static QUAT e12(1.0f,3);


int main (int argc, char **argv) {
  
  printf("e1*e1         : "); (e1*e1).log();
  printf("pss           : "); e12.log();
  printf("pss*pss       : "); (e12*e12).log();

  return 0;
}