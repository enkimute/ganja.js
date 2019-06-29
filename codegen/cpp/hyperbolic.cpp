// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e1" };

class HYPERBOLIC {
  public:
    HYPERBOLIC ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    HYPERBOLIC (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    HYPERBOLIC log () { int n=0; for (int i=0,j=0;i<2;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    HYPERBOLIC Conjugate(); 
    HYPERBOLIC Involute();
    float norm();
    float inorm();
    HYPERBOLIC normalized();
  private:  
    float mvec[2];
};


//***********************
// HYPERBOLIC.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline HYPERBOLIC operator ~ (const HYPERBOLIC &a) {
  HYPERBOLIC res;
  res[0]=a[0];
  res[1]=a[1];
  return res;
};

//***********************
// HYPERBOLIC.Dual : res = !a
// Poincare duality operator.
//***********************
inline HYPERBOLIC operator ! (const HYPERBOLIC &a) {
  HYPERBOLIC res;
  res[0]=a[1];
  res[1]=a[0];
  return res;
};

//***********************
// HYPERBOLIC.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline HYPERBOLIC HYPERBOLIC::Conjugate () {
  HYPERBOLIC res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  return res;
};

//***********************
// HYPERBOLIC.Involute : res = a.Involute()
// Main involution
//***********************
inline HYPERBOLIC HYPERBOLIC::Involute () {
  HYPERBOLIC res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  return res;
};

//***********************
// HYPERBOLIC.Mul : res = a * b 
// The geometric product.
//***********************
inline HYPERBOLIC operator * (const HYPERBOLIC &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
  res[0]=b[0]*a[0]+b[1]*a[1];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// HYPERBOLIC.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline HYPERBOLIC operator ^ (const HYPERBOLIC &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// HYPERBOLIC.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline HYPERBOLIC operator & (const HYPERBOLIC &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
  res[1]=b[1]*a[1];
  res[0]=b[0]*a[1]+b[1]*a[0];
  return res;
};

//***********************
// HYPERBOLIC.Dot : res = a | b 
// The inner product.
//***********************
inline HYPERBOLIC operator | (const HYPERBOLIC &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
  res[0]=b[0]*a[0]+b[1]*a[1];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// HYPERBOLIC.Add : res = a + b 
// Multivector addition
//***********************
inline HYPERBOLIC operator + (const HYPERBOLIC &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
      res[0] = a[0]+b[0];
    res[1] = a[1]+b[1];
  return res;
};

//***********************
// HYPERBOLIC.Sub : res = a - b 
// Multivector subtraction
//***********************
inline HYPERBOLIC operator - (const HYPERBOLIC &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
      res[0] = a[0]-b[0];
    res[1] = a[1]-b[1];
  return res;
};

//***********************
// HYPERBOLIC.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline HYPERBOLIC operator * (const float &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
      res[0] = a*b[0];
    res[1] = a*b[1];
  return res;
};

//***********************
// HYPERBOLIC.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline HYPERBOLIC operator * (const HYPERBOLIC &a, const float &b) {
  HYPERBOLIC res;
      res[0] = a[0]*b;
    res[1] = a[1]*b;
  return res;
};

//***********************
// HYPERBOLIC.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline HYPERBOLIC operator + (const float &a, const HYPERBOLIC &b) {
  HYPERBOLIC res;
    res[0] = a+b[0];
      res[1] = b[1];
  return res;
};

//***********************
// HYPERBOLIC.adds : res = a + b 
// multivector/scalar addition
//***********************
inline HYPERBOLIC operator + (const HYPERBOLIC &a, const float &b) {
  HYPERBOLIC res;
    res[0] = a[0]+b;
      res[1] = a[1];
  return res;
};


inline float HYPERBOLIC::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float HYPERBOLIC::inorm() { return (!(*this)).norm(); }
inline HYPERBOLIC HYPERBOLIC::normalized() { return (*this) * (1/norm()); }


static HYPERBOLIC e1(1.0f,1);


int main (int argc, char **argv) {
  
  printf("e1*e1         : "); (e1*e1).log();
  printf("pss           : "); e1.log();
  printf("pss*pss       : "); (e1*e1).log();

  return 0;
}