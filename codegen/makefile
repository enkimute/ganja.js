## Minimalistic, I'm using this on ubuntu, with g++ and mono default installs and node v11
ALL: c hyperbolic dual r2 r3 mink quat r111 spacetime cga pga3d

ALL:
	@echo "done !"

%:
	@node generate `echo $*| tr "[a-z]" "[A-Z]"`
	@mcs -out:$*_cs.exe $*.cs
	@g++ -o $*_cpp $*.cpp -std=c++11
	@rustc -o $*_rust $*.rs
	@echo "CPP" $* > out1; ./$*_cpp >> out1
	@echo "C#" $* > out2; mono $*_cs.exe >> out2
	@echo "PYTHON" $* > out3; python $*.py >> out3
	@echo "RUST" $* > out4; ./$*_rust >> out4
	@diff -y out1 out2 -W 110 > out12 || true; diff -y out3 out4 -W 110 > out34 || true; colordiff -yW 220 out12 out34 || true; rm out1 out2 out3 out4 out12 out34
	@echo

## rough clean generated files	
clean:
	@echo "cleaning .."
	-@rm pga* cga* r3* r2* quat* spacetime* c_* c.* mink* *.cs *.cpp *.py *.exe *.rs *_cpp *_rust  -f
	-@rm *~ -f
