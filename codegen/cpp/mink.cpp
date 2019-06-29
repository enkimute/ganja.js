// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e1","e2","e12" };

class MINK {
  public:
    MINK ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    MINK (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    MINK log () { int n=0; for (int i=0,j=0;i<4;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    MINK Conjugate(); 
    MINK Involute();
    float norm();
    float inorm();
    MINK normalized();
  private:  
    float mvec[4];
};


//***********************
// MINK.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline MINK operator ~ (const MINK &a) {
  MINK res;
  res[0]=a[0];
  res[1]=a[1];
  res[2]=a[2];
  res[3]=-a[3];
  return res;
};

//***********************
// MINK.Dual : res = !a
// Poincare duality operator.
//***********************
inline MINK operator ! (const MINK &a) {
  MINK res;
  res[0]=a[3];
  res[1]=-a[2];
  res[2]=-a[1];
  res[3]=a[0];
  return res;
};

//***********************
// MINK.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline MINK MINK::Conjugate () {
  MINK res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=-this->mvec[3];
  return res;
};

//***********************
// MINK.Involute : res = a.Involute()
// Main involution
//***********************
inline MINK MINK::Involute () {
  MINK res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=this->mvec[3];
  return res;
};

//***********************
// MINK.Mul : res = a * b 
// The geometric product.
//***********************
inline MINK operator * (const MINK &a, const MINK &b) {
  MINK res;
  res[0]=b[0]*a[0]+b[1]*a[1]-b[2]*a[2]+b[3]*a[3];
  res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
  res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3];
  res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
  return res;
};

//***********************
// MINK.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline MINK operator ^ (const MINK &a, const MINK &b) {
  MINK res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  res[2]=b[2]*a[0]+b[0]*a[2];
  res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
  return res;
};

//***********************
// MINK.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline MINK operator & (const MINK &a, const MINK &b) {
  MINK res;
  res[3]=b[3]*a[3];
  res[2]=b[2]*a[3]+b[3]*a[2];
  res[1]=b[1]*a[3]+b[3]*a[1];
  res[0]=b[0]*a[3]+b[1]*a[2]-b[2]*a[1]+b[3]*a[0];
  return res;
};

//***********************
// MINK.Dot : res = a | b 
// The inner product.
//***********************
inline MINK operator | (const MINK &a, const MINK &b) {
  MINK res;
  res[0]=b[0]*a[0]+b[1]*a[1]-b[2]*a[2]+b[3]*a[3];
  res[1]=b[1]*a[0]+b[0]*a[1]+b[3]*a[2]-b[2]*a[3];
  res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3];
  res[3]=b[3]*a[0]+b[0]*a[3];
  return res;
};

//***********************
// MINK.Add : res = a + b 
// Multivector addition
//***********************
inline MINK operator + (const MINK &a, const MINK &b) {
  MINK res;
      res[0] = a[0]+b[0];
    res[1] = a[1]+b[1];
    res[2] = a[2]+b[2];
    res[3] = a[3]+b[3];
  return res;
};

//***********************
// MINK.Sub : res = a - b 
// Multivector subtraction
//***********************
inline MINK operator - (const MINK &a, const MINK &b) {
  MINK res;
      res[0] = a[0]-b[0];
    res[1] = a[1]-b[1];
    res[2] = a[2]-b[2];
    res[3] = a[3]-b[3];
  return res;
};

//***********************
// MINK.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline MINK operator * (const float &a, const MINK &b) {
  MINK res;
      res[0] = a*b[0];
    res[1] = a*b[1];
    res[2] = a*b[2];
    res[3] = a*b[3];
  return res;
};

//***********************
// MINK.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline MINK operator * (const MINK &a, const float &b) {
  MINK res;
      res[0] = a[0]*b;
    res[1] = a[1]*b;
    res[2] = a[2]*b;
    res[3] = a[3]*b;
  return res;
};

//***********************
// MINK.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline MINK operator + (const float &a, const MINK &b) {
  MINK res;
    res[0] = a+b[0];
      res[1] = b[1];
    res[2] = b[2];
    res[3] = b[3];
  return res;
};

//***********************
// MINK.adds : res = a + b 
// multivector/scalar addition
//***********************
inline MINK operator + (const MINK &a, const float &b) {
  MINK res;
    res[0] = a[0]+b;
      res[1] = a[1];
    res[2] = a[2];
    res[3] = a[3];
  return res;
};


inline float MINK::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float MINK::inorm() { return (!(*this)).norm(); }
inline MINK MINK::normalized() { return (*this) * (1/norm()); }


static MINK e1(1.0f,1);
static MINK e2(1.0f,2);
static MINK e12(1.0f,3);


int main (int argc, char **argv) {
  
  printf("e1*e1         : "); (e1*e1).log();
  printf("pss           : "); e12.log();
  printf("pss*pss       : "); (e12*e12).log();

  return 0;
}