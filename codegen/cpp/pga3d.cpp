// 3D Projective Geometric Algebra
// Written by a generator written by enki.
#include <stdio.h>
#include <cmath>
#include <array>

#define PI 3.14159265358979323846

static const char* basis[] = { "1","e0","e1","e2","e3","e01","e02","e03","e12","e31","e23","e021","e013","e032","e123","e0123" };

class PGA3D {
  public:
    PGA3D ()  { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); }
    PGA3D (float f, int idx=0) { std::fill( mvec, mvec + sizeof( mvec )/4, 0.0f ); mvec[idx] = f; }
    float& operator [] (size_t idx) { return mvec[idx]; }
    const float& operator [] (size_t idx) const { return mvec[idx]; }
    PGA3D log () { int n=0; for (int i=0,j=0;i<16;i++) if (mvec[i]!=0.0f) { n++; printf("%s%0.7g%s",(j>0)?" + ":"",mvec[i],(i==0)?"":basis[i]); j++; };if (n==0) printf("0");  printf("\n"); return *this; }
    PGA3D Conjugate(); 
    PGA3D Involute();
    float norm();
    float inorm();
    PGA3D normalized();
  private:  
    float mvec[16];
};


//***********************
// PGA3D.Reverse : res = ~a
// Reverse the order of the basis blades.
//***********************
inline PGA3D operator ~ (const PGA3D &a) {
  PGA3D res;
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
// PGA3D.Dual : res = !a
// Poincare duality operator.
//***********************
inline PGA3D operator ! (const PGA3D &a) {
  PGA3D res;
  res[0]=a[15];
  res[1]=a[14];
  res[2]=a[13];
  res[3]=a[12];
  res[4]=a[11];
  res[5]=a[10];
  res[6]=a[9];
  res[7]=a[8];
  res[8]=a[7];
  res[9]=a[6];
  res[10]=a[5];
  res[11]=a[4];
  res[12]=a[3];
  res[13]=a[2];
  res[14]=a[1];
  res[15]=a[0];
  return res;
};

//***********************
// PGA3D.Conjugate : res = a.Conjugate()
// Clifford Conjugation
//***********************
inline PGA3D PGA3D::Conjugate () {
  PGA3D res;
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
// PGA3D.Involute : res = a.Involute()
// Main involution
//***********************
inline PGA3D PGA3D::Involute () {
  PGA3D res;
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
// PGA3D.Mul : res = a * b 
// The geometric product.
//***********************
inline PGA3D operator * (const PGA3D &a, const PGA3D &b) {
  PGA3D res;
  res[0]=b[0]*a[0]+b[2]*a[2]+b[3]*a[3]+b[4]*a[4]-b[8]*a[8]-b[9]*a[9]-b[10]*a[10]-b[14]*a[14];
  res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]-b[7]*a[4]+b[2]*a[5]+b[3]*a[6]+b[4]*a[7]+b[11]*a[8]+b[12]*a[9]+b[13]*a[10]+b[8]*a[11]+b[9]*a[12]+b[10]*a[13]+b[15]*a[14]-b[14]*a[15];
  res[2]=b[2]*a[0]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]+b[3]*a[8]-b[4]*a[9]-b[14]*a[10]-b[10]*a[14];
  res[3]=b[3]*a[0]+b[8]*a[2]+b[0]*a[3]-b[10]*a[4]-b[2]*a[8]-b[14]*a[9]+b[4]*a[10]-b[9]*a[14];
  res[4]=b[4]*a[0]-b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[14]*a[8]+b[2]*a[9]-b[3]*a[10]-b[8]*a[14];
  res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]-b[11]*a[3]+b[12]*a[4]+b[0]*a[5]-b[8]*a[6]+b[9]*a[7]+b[6]*a[8]-b[7]*a[9]-b[15]*a[10]-b[3]*a[11]+b[4]*a[12]+b[14]*a[13]-b[13]*a[14]-b[10]*a[15];
  res[6]=b[6]*a[0]+b[3]*a[1]+b[11]*a[2]-b[1]*a[3]-b[13]*a[4]+b[8]*a[5]+b[0]*a[6]-b[10]*a[7]-b[5]*a[8]-b[15]*a[9]+b[7]*a[10]+b[2]*a[11]+b[14]*a[12]-b[4]*a[13]-b[12]*a[14]-b[9]*a[15];
  res[7]=b[7]*a[0]+b[4]*a[1]-b[12]*a[2]+b[13]*a[3]-b[1]*a[4]-b[9]*a[5]+b[10]*a[6]+b[0]*a[7]-b[15]*a[8]+b[5]*a[9]-b[6]*a[10]+b[14]*a[11]-b[2]*a[12]+b[3]*a[13]-b[11]*a[14]-b[8]*a[15];
  res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[14]*a[4]+b[0]*a[8]+b[10]*a[9]-b[9]*a[10]+b[4]*a[14];
  res[9]=b[9]*a[0]-b[4]*a[2]+b[14]*a[3]+b[2]*a[4]-b[10]*a[8]+b[0]*a[9]+b[8]*a[10]+b[3]*a[14];
  res[10]=b[10]*a[0]+b[14]*a[2]+b[4]*a[3]-b[3]*a[4]+b[9]*a[8]-b[8]*a[9]+b[0]*a[10]+b[2]*a[14];
  res[11]=b[11]*a[0]-b[8]*a[1]+b[6]*a[2]-b[5]*a[3]+b[15]*a[4]-b[3]*a[5]+b[2]*a[6]-b[14]*a[7]-b[1]*a[8]+b[13]*a[9]-b[12]*a[10]+b[0]*a[11]+b[10]*a[12]-b[9]*a[13]+b[7]*a[14]-b[4]*a[15];
  res[12]=b[12]*a[0]-b[9]*a[1]-b[7]*a[2]+b[15]*a[3]+b[5]*a[4]+b[4]*a[5]-b[14]*a[6]-b[2]*a[7]-b[13]*a[8]-b[1]*a[9]+b[11]*a[10]-b[10]*a[11]+b[0]*a[12]+b[8]*a[13]+b[6]*a[14]-b[3]*a[15];
  res[13]=b[13]*a[0]-b[10]*a[1]+b[15]*a[2]+b[7]*a[3]-b[6]*a[4]-b[14]*a[5]-b[4]*a[6]+b[3]*a[7]+b[12]*a[8]-b[11]*a[9]-b[1]*a[10]+b[9]*a[11]-b[8]*a[12]+b[0]*a[13]+b[5]*a[14]-b[2]*a[15];
  res[14]=b[14]*a[0]+b[10]*a[2]+b[9]*a[3]+b[8]*a[4]+b[4]*a[8]+b[3]*a[9]+b[2]*a[10]+b[0]*a[14];
  res[15]=b[15]*a[0]+b[14]*a[1]+b[13]*a[2]+b[12]*a[3]+b[11]*a[4]+b[10]*a[5]+b[9]*a[6]+b[8]*a[7]+b[7]*a[8]+b[6]*a[9]+b[5]*a[10]-b[4]*a[11]-b[3]*a[12]-b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
  return res;
};

//***********************
// PGA3D.Wedge : res = a ^ b 
// The outer product. (MEET)
//***********************
inline PGA3D operator ^ (const PGA3D &a, const PGA3D &b) {
  PGA3D res;
  res[0]=b[0]*a[0];
  res[1]=b[1]*a[0]+b[0]*a[1];
  res[2]=b[2]*a[0]+b[0]*a[2];
  res[3]=b[3]*a[0]+b[0]*a[3];
  res[4]=b[4]*a[0]+b[0]*a[4];
  res[5]=b[5]*a[0]+b[2]*a[1]-b[1]*a[2]+b[0]*a[5];
  res[6]=b[6]*a[0]+b[3]*a[1]-b[1]*a[3]+b[0]*a[6];
  res[7]=b[7]*a[0]+b[4]*a[1]-b[1]*a[4]+b[0]*a[7];
  res[8]=b[8]*a[0]+b[3]*a[2]-b[2]*a[3]+b[0]*a[8];
  res[9]=b[9]*a[0]-b[4]*a[2]+b[2]*a[4]+b[0]*a[9];
  res[10]=b[10]*a[0]+b[4]*a[3]-b[3]*a[4]+b[0]*a[10];
  res[11]=b[11]*a[0]-b[8]*a[1]+b[6]*a[2]-b[5]*a[3]-b[3]*a[5]+b[2]*a[6]-b[1]*a[8]+b[0]*a[11];
  res[12]=b[12]*a[0]-b[9]*a[1]-b[7]*a[2]+b[5]*a[4]+b[4]*a[5]-b[2]*a[7]-b[1]*a[9]+b[0]*a[12];
  res[13]=b[13]*a[0]-b[10]*a[1]+b[7]*a[3]-b[6]*a[4]-b[4]*a[6]+b[3]*a[7]-b[1]*a[10]+b[0]*a[13];
  res[14]=b[14]*a[0]+b[10]*a[2]+b[9]*a[3]+b[8]*a[4]+b[4]*a[8]+b[3]*a[9]+b[2]*a[10]+b[0]*a[14];
  res[15]=b[15]*a[0]+b[14]*a[1]+b[13]*a[2]+b[12]*a[3]+b[11]*a[4]+b[10]*a[5]+b[9]*a[6]+b[8]*a[7]+b[7]*a[8]+b[6]*a[9]+b[5]*a[10]-b[4]*a[11]-b[3]*a[12]-b[2]*a[13]-b[1]*a[14]+b[0]*a[15];
  return res;
};

//***********************
// PGA3D.Vee : res = a & b 
// The regressive product. (JOIN)
//***********************
inline PGA3D operator & (const PGA3D &a, const PGA3D &b) {
  PGA3D res;
  res[15]=b[15]*a[15];
  res[14]=b[14]*a[15]+b[15]*a[14];
  res[13]=b[13]*a[15]+b[15]*a[13];
  res[12]=b[12]*a[15]+b[15]*a[12];
  res[11]=b[11]*a[15]+b[15]*a[11];
  res[10]=b[10]*a[15]+b[13]*a[14]-b[14]*a[13]+b[15]*a[10];
  res[9]=b[9]*a[15]+b[12]*a[14]-b[14]*a[12]+b[15]*a[9];
  res[8]=b[8]*a[15]+b[11]*a[14]-b[14]*a[11]+b[15]*a[8];
  res[7]=b[7]*a[15]+b[12]*a[13]-b[13]*a[12]+b[15]*a[7];
  res[6]=b[6]*a[15]-b[11]*a[13]+b[13]*a[11]+b[15]*a[6];
  res[5]=b[5]*a[15]+b[11]*a[12]-b[12]*a[11]+b[15]*a[5];
  res[4]=b[4]*a[15]-b[7]*a[14]+b[9]*a[13]-b[10]*a[12]-b[12]*a[10]+b[13]*a[9]-b[14]*a[7]+b[15]*a[4];
  res[3]=b[3]*a[15]-b[6]*a[14]-b[8]*a[13]+b[10]*a[11]+b[11]*a[10]-b[13]*a[8]-b[14]*a[6]+b[15]*a[3];
  res[2]=b[2]*a[15]-b[5]*a[14]+b[8]*a[12]-b[9]*a[11]-b[11]*a[9]+b[12]*a[8]-b[14]*a[5]+b[15]*a[2];
  res[1]=b[1]*a[15]+b[5]*a[13]+b[6]*a[12]+b[7]*a[11]+b[11]*a[7]+b[12]*a[6]+b[13]*a[5]+b[15]*a[1];
  res[0]=b[0]*a[15]+b[1]*a[14]+b[2]*a[13]+b[3]*a[12]+b[4]*a[11]+b[5]*a[10]+b[6]*a[9]+b[7]*a[8]+b[8]*a[7]+b[9]*a[6]+b[10]*a[5]-b[11]*a[4]-b[12]*a[3]-b[13]*a[2]-b[14]*a[1]+b[15]*a[0];
  return res;
};

//***********************
// PGA3D.Dot : res = a | b 
// The inner product.
//***********************
inline PGA3D operator | (const PGA3D &a, const PGA3D &b) {
  PGA3D res;
  res[0]=b[0]*a[0]+b[2]*a[2]+b[3]*a[3]+b[4]*a[4]-b[8]*a[8]-b[9]*a[9]-b[10]*a[10]-b[14]*a[14];
  res[1]=b[1]*a[0]+b[0]*a[1]-b[5]*a[2]-b[6]*a[3]-b[7]*a[4]+b[2]*a[5]+b[3]*a[6]+b[4]*a[7]+b[11]*a[8]+b[12]*a[9]+b[13]*a[10]+b[8]*a[11]+b[9]*a[12]+b[10]*a[13]+b[15]*a[14]-b[14]*a[15];
  res[2]=b[2]*a[0]+b[0]*a[2]-b[8]*a[3]+b[9]*a[4]+b[3]*a[8]-b[4]*a[9]-b[14]*a[10]-b[10]*a[14];
  res[3]=b[3]*a[0]+b[8]*a[2]+b[0]*a[3]-b[10]*a[4]-b[2]*a[8]-b[14]*a[9]+b[4]*a[10]-b[9]*a[14];
  res[4]=b[4]*a[0]-b[9]*a[2]+b[10]*a[3]+b[0]*a[4]-b[14]*a[8]+b[2]*a[9]-b[3]*a[10]-b[8]*a[14];
  res[5]=b[5]*a[0]-b[11]*a[3]+b[12]*a[4]+b[0]*a[5]-b[15]*a[10]-b[3]*a[11]+b[4]*a[12]-b[10]*a[15];
  res[6]=b[6]*a[0]+b[11]*a[2]-b[13]*a[4]+b[0]*a[6]-b[15]*a[9]+b[2]*a[11]-b[4]*a[13]-b[9]*a[15];
  res[7]=b[7]*a[0]-b[12]*a[2]+b[13]*a[3]+b[0]*a[7]-b[15]*a[8]-b[2]*a[12]+b[3]*a[13]-b[8]*a[15];
  res[8]=b[8]*a[0]+b[14]*a[4]+b[0]*a[8]+b[4]*a[14];
  res[9]=b[9]*a[0]+b[14]*a[3]+b[0]*a[9]+b[3]*a[14];
  res[10]=b[10]*a[0]+b[14]*a[2]+b[0]*a[10]+b[2]*a[14];
  res[11]=b[11]*a[0]+b[15]*a[4]+b[0]*a[11]-b[4]*a[15];
  res[12]=b[12]*a[0]+b[15]*a[3]+b[0]*a[12]-b[3]*a[15];
  res[13]=b[13]*a[0]+b[15]*a[2]+b[0]*a[13]-b[2]*a[15];
  res[14]=b[14]*a[0]+b[0]*a[14];
  res[15]=b[15]*a[0]+b[0]*a[15];
  return res;
};

//***********************
// PGA3D.Add : res = a + b 
// Multivector addition
//***********************
inline PGA3D operator + (const PGA3D &a, const PGA3D &b) {
  PGA3D res;
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
// PGA3D.Sub : res = a - b 
// Multivector subtraction
//***********************
inline PGA3D operator - (const PGA3D &a, const PGA3D &b) {
  PGA3D res;
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
// PGA3D.smul : res = a * b 
// scalar/multivector multiplication
//***********************
inline PGA3D operator * (const float &a, const PGA3D &b) {
  PGA3D res;
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
// PGA3D.muls : res = a * b 
// multivector/scalar multiplication
//***********************
inline PGA3D operator * (const PGA3D &a, const float &b) {
  PGA3D res;
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
// PGA3D.sadd : res = a + b 
// scalar/multivector addition
//***********************
inline PGA3D operator + (const float &a, const PGA3D &b) {
  PGA3D res;
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
// PGA3D.adds : res = a + b 
// multivector/scalar addition
//***********************
inline PGA3D operator + (const PGA3D &a, const float &b) {
  PGA3D res;
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


inline float PGA3D::norm() { return sqrt(abs(((*this)*Conjugate()).mvec[0])); }
inline float PGA3D::inorm() { return (!(*this)).norm(); }
inline PGA3D PGA3D::normalized() { return (*this) * (1/norm()); }


// A rotor (Euclidean line) and translator (Ideal line)
static PGA3D rotor(float angle, PGA3D line) { return cos(angle/2.0f) + sin(angle/2.0f)*line.normalized(); }
static PGA3D translator(float dist, PGA3D line) { return 1.0f + dist/2.0f*line; }

// PGA is plane based. Vectors are planes. (think linear functionals)
static PGA3D e0(1.0f,1), e1(1.0f,2), e2(1.0f,3), e3(1.0f,4);

// A plane is defined using its homogenous equation ax + by + cz + d = 0
static PGA3D plane(float a,float b,float c,float d) { return a*e1 + b*e2 + c*e3 + d*e0; }

// PGA points are trivectors.
static PGA3D e123 = e1^e2^e3, e032 = e0^e3^e2, e013 = e0^e1^e3, e021 = e0^e2^e1;

// A point is just a homogeneous point, euclidean coordinates plus the origin
static PGA3D point(float x, float y, float z) { return e123 + x*e032 + y*e013 + z*e021; }

// for our toy problem (generate points on the surface of a torus)
// we start with a function that generates motors.
// circle(t) with t going from 0 to 1.
static PGA3D circle(float t, float radius, PGA3D line) {
  return rotor(t*2.0f*PI,line) * translator(radius,e1*e0);
}

// a torus is now the product of two circles.
static PGA3D torus(float s, float t, float r1, PGA3D l1, float r2, PGA3D l2) {
  return circle(s,r2,l2)*circle(t,r1,l1);
}

// and to sample its points we simply sandwich the origin ..
static PGA3D point_on_torus(float s, float t) {
  PGA3D to = torus(s,t,0.25f,e1*e2,0.6f,e1*e3);
  return to * e123 * ~to;
}


int main (int argc, char **argv) {
  
  // Elements of the even subalgebra (scalar + bivector + pss) of unit length are motors
  PGA3D rot = rotor( PI/2.0f, e1 * e2 );
  
  // The outer product ^ is the MEET. Here we intersect the yz (x=0) and xz (y=0) planes.
  PGA3D ax_z = e1 ^ e2;
  
  // line and plane meet in point. We intersect the line along the z-axis (x=0,y=0) with the xy (z=0) plane.
  PGA3D orig = ax_z ^ e3;
  
  // We can also easily create points and join them into a line using the regressive (vee, &) product.
  PGA3D px = point(1.0,0.0,0.0);
  PGA3D line = orig & px;
  
  // Lets also create the plane with equation 2x + z - 3 = 0
  PGA3D p = plane(2,0,1,-3);
  
  // rotations work on all elements
  PGA3D rotated_plane = rot * p * ~rot;
  PGA3D rotated_line  = rot * line * ~rot;
  PGA3D rotated_point = rot * px * ~rot;
  
  // See the 3D PGA Cheat sheet for a huge collection of useful formulas
  PGA3D point_on_plane = (p | px) * p;
  
  // Some output.
  printf("a point       : "); px.log();
  printf("a line        : "); line.log();
  printf("a plane       : "); p.log();
  printf("a rotor       : "); rot.log();
  printf("rotated line  : "); rotated_line.log();
  printf("rotated point : "); rotated_point.log();
  printf("rotated plane : "); rotated_plane.log();
  printf("point on plane: "); point_on_plane.normalized().log();
  printf("point on torus: "); point_on_torus(0.0f,0.0f).log();

  return 0;
}