// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e1","e2","e12" };

class R2 {
  public:
    R2 ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    R2 (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    R2 log () { int n=0; for (int i=0,j=0;i<4;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    R2 Conjugate(); 
    R2 Involute();
    float norm();
    float inorm();
    R2 normalized();
  private:  
    float mvec[4];
};


//***********************
// R2.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline R2 operator ~ (const R2 &a) {
  R2 res;
  res[0]=a[0];
  res[1]=a[1];
  res[2]=a[2];
  res[3]=-a[3];
  return res;
};

//***********************
// R2.Dual : res = !a
// Poincare duality operator.
//***********************
inline R2 operator ! (const R2 &a) {
  R2 res;
  res[0]=-a[3];
  res[1]=a[2];
  res[2]=-a[1];
  res[3]=a[0];
  return res;
};

//***********************
// R2.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline R2 R2::Conjugate () {
  R2 res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=-this->mvec[3];
  return res;
};

//***********************
// R2.Involute : res = a.Involute()
// Main involution
//***********************
inline R2 R2::Involute () {
  R2 res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  res[2]=-this->mvec[2];
  res[3]=this->mvec[3];
  return res;
};

//***********************
// R2.Mul : res = a * b 
// The geometric product.
//***********************
inline R2 operator * (const R2 &a, const R2 &b) {
  R2 res;
  res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]-b[3]*a[3];
  res[1]=b[1]*a[0]+b[0]*a[1]-b[3]*a[2]+b[2]*a[3];
  res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3];
  res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
  return res;
};

//***********************
// R2.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline R2 operator ^ (const R2 &a, const R2 &b) {
  R2 res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  res[2]=b[2]*a[0]+b[0]*a[2];
  res[3]=b[3]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[3];
  return res;
};

//***********************
// R2.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline R2 operator & (const R2 &a, const R2 &b) {
  R2 res;
  res[3]=1*(a[3]*b[3]);
  res[2]=-1*(a[2]*-1*b[3]+a[3]*b[2]*-1);
  res[1]=1*(a[1]*b[3]+a[3]*b[1]);
  res[0]=1*(a[0]*b[3]+a[1]*b[2]*-1-a[2]*-1*b[1]+a[3]*b[0]);
  return res;
};

//***********************
// R2.Dot : res = a | b 
// The inner product.
//***********************
inline R2 operator | (const R2 &a, const R2 &b) {
  R2 res;
  res[0]=b[0]*a[0]+b[1]*a[1]+b[2]*a[2]-b[3]*a[3];
  res[1]=b[1]*a[0]+b[0]*a[1]-b[3]*a[2]+b[2]*a[3];
  res[2]=b[2]*a[0]+b[3]*a[1]+b[0]*a[2]-b[1]*a[3];
  res[3]=b[3]*a[0]+b[0]*a[3];
  return res;
};

//***********************
// R2.Add : res = a + b 
// Multivector addition
//***********************
inline R2 operator + (const R2 &a, const R2 &b) {
  R2 res;
      res[0] = a[0]+b[0];
    res[1] = a[1]+b[1];
    res[2] = a[2]+b[2];
    res[3] = a[3]+b[3];
  return res;
};

//***********************
// R2.Sub : res = a - b 
// Multivector subtraction
//***********************
inline R2 operator - (const R2 &a, const R2 &b) {
  R2 res;
      res[0] = a[0]-b[0];
    res[1] = a[1]-b[1];
    res[2] = a[2]-b[2];
    res[3] = a[3]-b[3];
  return res;
};

//***********************
// R2.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline R2 operator * (const float &a, const R2 &b) {
  R2 res;
      res[0] = a*b[0];
    res[1] = a*b[1];
    res[2] = a*b[2];
    res[3] = a*b[3];
  return res;
};

//***********************
// R2.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline R2 operator * (const R2 &a, const float &b) {
  R2 res;
      res[0] = a[0]*b;
    res[1] = a[1]*b;
    res[2] = a[2]*b;
    res[3] = a[3]*b;
  return res;
};

//***********************
// R2.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline R2 operator + (const float &a, const R2 &b) {
  R2 res;
    res[0] = a+b[0];
      res[1] = b[1];
    res[2] = b[2];
    res[3] = b[3];
  return res;
};

//***********************
// R2.adds : res = a + b 
// multivector/scalar addition
//***********************
inline R2 operator + (const R2 &a, const float &b) {
  R2 res;
    res[0] = a[0]+b;
      res[1] = a[1];
    res[2] = a[2];
    res[3] = a[3];
  return res;
};

//***********************
// R2.ssub : res = a - b 
// scalar/multivector subtraction
//***********************
inline R2 operator - (const float &a, const R2 &b) {
  R2 res;
    res[0] = a-b[0];
      res[1] = -b[1];
    res[2] = -b[2];
    res[3] = -b[3];
  return res;
};

//***********************
// R2.subs : res = a - b 
// multivector/scalar subtraction
//***********************
inline R2 operator - (const R2 &a, const float &b) {
  R2 res;
    res[0] = a[0]-b;
      res[1] = a[1];
    res[2] = a[2];
    res[3] = a[3];
  return res;
};


inline float R2::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float R2::inorm() { return (!(*this)).norm(); }
inline R2 R2::normalized() { return (*this) * (1/norm()); }


static R2 e1(1.0f,1);
static R2 e2(1.0f,2);
static R2 e12(1.0f,3);


int main (int argc, char **argv) {
  
  printf("e1*e1         : "); (e1*e1).log();
  printf("pss           : "); e12.log();
  printf("pss*pss       : "); (e12*e12).log();

  return 0;
}