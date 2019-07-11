## Using bash if syntax .. also changed to work on WSL
SHELL = /bin/bash

## Minimalistic, I'm using this on ubuntu, with g++ and mono default installs and node v11
ALL: c hyperbolic dual r2 r3 mink quat r111 spacetime cga pga3d
	@echo "done !"

## Generate all languages by default
GEN_LANG = "csharp cpp python rust"

%:
	@node generate `echo $*| tr "[a-z]" "[A-Z]"`
	@echo "CPP" $* > out1
	@echo "C#" $* > out2
	@echo "PYTHON" $* > out3
	@echo "RUST" $* > out4
	@if [[ $(GEN_LANG) == *"cpp"* ]]; then g++ -o cpp/$*_cpp cpp/$*.cpp -std=c++11; ./cpp/$*_cpp >> out1; fi
	@if [[ $(GEN_LANG) == *"csharp"* ]]; then mcs -out:csharp/$*_cs.exe csharp/$*.cs;  mono ./csharp/$*_cs.exe >> out2; fi
	@if [[ $(GEN_LANG) == *"python"* ]]; then python ./python/$*.py >> out3; fi
	@if [[ $(GEN_LANG) == *"rust"* ]]; then rustc -o rust/$*_rust rust/$*.rs; ./rust/$*_rust >> out4; fi
	@diff -y out1 out2 -W 110 > out12 || true; diff -y out3 out4 -W 110 > out34 || true; colordiff -yW 220 out12 out34 || true; rm out1 out2 out3 out4 out12 out34
	@echo

## rough clean generated files	
clean:
	@echo "cleaning .."
	-@rm {csharp,cpp,python,rust}/*{.cs,.cpp,.py,.exe,.rs,_cpp,_rust}  -f
	-@rm *~ -f
