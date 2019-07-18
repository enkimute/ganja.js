"""Tests for the python code.

Does some simple testing on R2 to make sure the generated code runs as expected.
"""

import numpy as np
from pytest import raises

from r2 import R2

def test_numpy_init():
    a = np.array([1, 3, 4, 2, 4])
    with raises(TypeError):
        # Length is not a match for R2
        complex = R2.fromarray(a)
    a = np.array([1, 3, 4, 2])
    complex = R2.fromarray(a)
    assert complex.mvec is a


def test_list_init():
    """Init from a list.

    Does not work for multidimensional lists, since those don't have
    operator overloading.
    """
    a = [1, 3, 4, 2, 4]
    with raises(TypeError):
        # Length is not a match for R2
        complex = R2.fromarray(a)
    a = [1, 3, 4, 2]
    complex = R2.fromarray(a)
    assert complex.mvec is a

def test_multidimensional_array():
    """
    Lets add an extra dimension to test if we have the magic of operator
    overloading.
    """
    # Generate some arrays, to mimick complex numbers
    a = np.zeros(shape=(4, 3))
    b = np.zeros(shape=(4, 3))
    a[0] = np.linspace(0, 10, 3)
    b[0] = np.linspace(0, 1, 3)
    a[-1] = np.linspace(10, 20, 3)
    b[-1] = np.linspace(10, 11, 3)

    # Turn them into complex numbers
    a_complex = a[0] + 1j * a[3]
    b_complex = b[0] + 1j * b[3]
    a_alg = R2.fromarray(a)
    b_alg = R2.fromarray(b)

    # Firstly, check if the shapes haven't been mangled
    for i, (a_i, b_i) in enumerate(zip(a_alg, b_alg)):
        np.testing.assert_equal(a_i, a[i])
        np.testing.assert_equal(b_i, b[i])

    # Test norm
    norm2_a = a_complex * a_complex.conj()
    norm2_a_alg = a_alg * a_alg.Conjugate()

    np.testing.assert_almost_equal(np.real(norm2_a), norm2_a_alg[0])
    np.testing.assert_almost_equal(np.real(norm2_a), a_alg.norm()**2)
    for i in range(1, 4):
        np.testing.assert_almost_equal(norm2_a_alg[i], np.zeros(shape=3))

    # Test the operators which should give the same results for complex and
    # the algebra
    operators = ['__mul__', '__add__', '__sub__']
    for operator in operators:
        complex_result = getattr(a_complex, operator)(b_complex)
        result = getattr(a_alg, operator)(b_alg)
        np.testing.assert_almost_equal(np.real(complex_result), result[0])
