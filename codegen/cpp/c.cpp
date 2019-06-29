// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e1" };

class C {
  public:
    C ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    C (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    C log () { int n=0; for (int i=0,j=0;i<2;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    C Conjugate(); 
    C Involute();
    float norm();
    float inorm();
    C normalized();
  private:  
    float mvec[2];
};


//***********************
// C.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline C operator ~ (const C &a) {
  C res;
  res[0]=a[0];
  res[1]=a[1];
  return res;
};

//***********************
// C.Dual : res = !a
// Poincare duality operator.
//***********************
inline C operator ! (const C &a) {
  C res;
  res[0]=-a[1];
  res[1]=a[0];
  return res;
};

//***********************
// C.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline C C::Conjugate () {
  C res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  return res;
};

//***********************
// C.Involute : res = a.Involute()
// Main involution
//***********************
inline C C::Involute () {
  C res;
  res[0]=this->mvec[0];
  res[1]=-this->mvec[1];
  return res;
};

//***********************
// C.Mul : res = a * b 
// The geometric product.
//***********************
inline C operator * (const C &a, const C &b) {
  C res;
  res[0]=b[0]*a[0]-b[1]*a[1];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// C.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline C operator ^ (const C &a, const C &b) {
  C res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// C.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline C operator & (const C &a, const C &b) {
  C res;
  res[1]=b[1]*a[1];
  res[0]=b[0]*a[1]+b[1]*a[0];
  return res;
};

//***********************
// C.Dot : res = a | b 
// The inner product.
//***********************
inline C operator | (const C &a, const C &b) {
  C res;
  res[0]=b[0]*a[0]-b[1]*a[1];
  res[1]=b[1]*a[0]+b[0]*a[1];
  return res;
};

//***********************
// C.Add : res = a + b 
// Multivector addition
//***********************
inline C operator + (const C &a, const C &b) {
  C res;
      res[0] = a[0]+b[0];
    res[1] = a[1]+b[1];
  return res;
};

//***********************
// C.Sub : res = a - b 
// Multivector subtraction
//***********************
inline C operator - (const C &a, const C &b) {
  C res;
      res[0] = a[0]-b[0];
    res[1] = a[1]-b[1];
  return res;
};

//***********************
// C.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline C operator * (const float &a, const C &b) {
  C res;
      res[0] = a*b[0];
    res[1] = a*b[1];
  return res;
};

//***********************
// C.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline C operator * (const C &a, const float &b) {
  C res;
      res[0] = a[0]*b;
    res[1] = a[1]*b;
  return res;
};

//***********************
// C.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline C operator + (const float &a, const C &b) {
  C res;
    res[0] = a+b[0];
      res[1] = b[1];
  return res;
};

//***********************
// C.adds : res = a + b 
// multivector/scalar addition
//***********************
inline C operator + (const C &a, const float &b) {
  C res;
    res[0] = a[0]+b;
      res[1] = a[1];
  return res;
};


inline float C::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float C::inorm() { return (!(*this)).norm(); }
inline C C::normalized() { return (*this) * (1/norm()); }


static C e1(1.0f,1);


int main (int argc, char **argv) {
  
  printf("e1*e1         : "); (e1*e1).log();
  printf("pss           : "); e1.log();
  printf("pss*pss       : "); (e1*e1).log();

  return 0;
}