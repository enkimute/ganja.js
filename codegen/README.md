# Ganja.js code generator for C++, C#, RUST, PYTHON

This folder contains a small nodeJS transpiler that uses templates to generate Geometric Algebra implementations
for c++, c#, rust and python. It supports any signature and provides a clean reference implementation with operator
overloading and flat storage.

## Install / Use

To be able to compile for all languages, you need :

* nodeJS 11
* mono
* c++ (>11)
* python
* rust (nightly) (run "rustup default nightly" in the project folder)

With those installed, simply run the makefile.

## Pregenerated sources

The cpp, csharp, rust and python folder contain the pregenerated files for the following algebras :

| sig   | filename     | name                         |
|-------|--------------|------------------------------|
| 0,1   | c            | complex numbers              |
| 1,0   | hyperbolic   | hyperbolic numbers           |
| 0,0,1 | dual         | dual numbers                 |
| 2,0   | r2           | 2D Vectors                   |
| 3,0   | r3           | 3D Vectors                   |
| 1,1   | mink         | Minkowski                    | 
| 0,2   | quat         | Quaternion                   |
| 3,1   | spacetime    | Spacetime                    | 
| 4,1   | cga          | Conformal Geometric Algebra  |
| 3,0,1 | pga3d        | Projective Geometric Algebra |

## templates

| language | author              |
|----------|---------------------|
| c++      | Steven De Keninck   |
| c#       | Frank Verheyen      |
| rust     | Utensil Song        |
| python   | Steven De Keninck   |

## New templates

Feel free, and reach out for help if needed !