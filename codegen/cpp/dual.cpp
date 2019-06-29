// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e0" };

class DUAL {
  public:
    DUAL ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    DUAL (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    DUAL log () { int n=0; for (int i=0,j=0;i<2;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    DUAL Conjugate(); 
    DUAL Involute();
    float norm();
    float inorm();
    DUAL normalized();
  private:  
    float mvec[2];
};


//***********************
// DUAL.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline DUAL operator ~ (const DUAL &a) {
  DUAL res;
  res[0]=a[0];
  res[1]=a[1];
  return res;
};

//***********************
// DUAL.Dual : res = !a
// Poincare duality operator.
//***********************
inline DUAL operator ! (const DUAL &a) {
  DUAL res;
  res[0]=a[1];
  res[1]=a[0];
  return res;
};

//***********************
// DUAL.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline DUAL DUAL::Conjugate () {
  DUAL res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  return res;
};

//***********************
// DUAL.Involute : res = a.Involute()
// Main involution
//***********************
inline DUAL DUAL::Involute () {
  DUAL res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  return res;
};

//***********************
// DUAL.Mul : res = a * b 
// The geometric product.
//***********************
inline DUAL operator * (const DUAL &a, const DUAL &b) {
  DUAL res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// DUAL.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline DUAL operator ^ (const DUAL &a, const DUAL &b) {
  DUAL res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// DUAL.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline DUAL operator & (const DUAL &a, const DUAL &b) {
  DUAL res;
  res[1]=b[1]*a[1];
  res[0]=b[0]*a[1]+b[1]*a[0];
  return res;
};

//***********************
// DUAL.Dot : res = a | b 
// The inner product.
//***********************
inline DUAL operator | (const DUAL &a, const DUAL &b) {
  DUAL res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// DUAL.Add : res = a + b 
// Multivector addition
//***********************
inline DUAL operator + (const DUAL &a, const DUAL &b) {
  DUAL res;
      res[0] = a[0]+b[0];
    res[1] = a[1]+b[1];
  return res;
};

//***********************
// DUAL.Sub : res = a - b 
// Multivector subtraction
//***********************
inline DUAL operator - (const DUAL &a, const DUAL &b) {
  DUAL res;
      res[0] = a[0]-b[0];
    res[1] = a[1]-b[1];
  return res;
};

//***********************
// DUAL.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline DUAL operator * (const float &a, const DUAL &b) {
  DUAL res;
      res[0] = a*b[0];
    res[1] = a*b[1];
  return res;
};

//***********************
// DUAL.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline DUAL operator * (const DUAL &a, const float &b) {
  DUAL res;
      res[0] = a[0]*b;
    res[1] = a[1]*b;
  return res;
};

//***********************
// DUAL.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline DUAL operator + (const float &a, const DUAL &b) {
  DUAL res;
    res[0] = a+b[0];
      res[1] = b[1];
  return res;
};

//***********************
// DUAL.adds : res = a + b 
// multivector/scalar addition
//***********************
inline DUAL operator + (const DUAL &a, const float &b) {
  DUAL res;
    res[0] = a[0]+b;
      res[1] = a[1];
  return res;
};


inline float DUAL::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float DUAL::inorm() { return (!(*this)).norm(); }
inline DUAL DUAL::normalized() { return (*this) * (1/norm()); }


static DUAL e0(1.0f,1);


int main (int argc, char **argv) {
  
  printf("e0*e0         : "); (e0*e0).log();
  printf("pss           : "); e0.log();
  printf("pss*pss       : "); (e0*e0).log();

  return 0;
}