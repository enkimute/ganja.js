// elm Template for the preamble
let getIndex = (str) => str.match(/res\[(\d+)\]\ ?=/)[1]*1
let getElmExprs = (code) => code.split('\n').sort((a, b) => getIndex(a) - getIndex(b)).map(x=>'(' + x.replace(/^.*=\ ?/g,'').replace(/[;\[\]]/g,'').replace(/\*/g,' * ').replace(/\+/g,' + ').replace(/(?<=.)\-/g,' - ').replace(/ \- 1/g, '-1') + ')')

let preamble = (basis, classname) => {
let typename = classname[0].toUpperCase() + classname.substring(1).toLowerCase();
let basisCases = basis.map(x=>x == '1' ? 'Scalar' : x.toUpperCase())
let valName = (x) => (x == "Scalar" ? "unitScalar" : x.toLowerCase())

return `module Ganja.${typename} exposing (${typename}Basis(..), basisList, basisCount, basisName, ${typename}(..), zero, get, set, new, toString, fromList, toList, reverse, dual, conjugate, involute, mul, wedge, vee, dot, add, sub, smul, muls, sadd, adds, ssub, subs, norm, inorm, normalized, ${basisCases.map((x,i)=>valName(x)).join(', ')})
{-| Clifford Algebra: ${typename}

Generated with ganja.js written by enki.

# Basis
@docs ${typename}Basis, basisList, basisCount, basisName

# Multivector
@docs ${typename}, zero, get, set, new

# Basis multivectors
@docs  ${basisCases.map((x,i)=>valName(x)).join(', ')}

# Conversion
@docs toString, fromList, toList

# Unary Operators
@docs reverse, dual, conjugate, involute

# Binary Operators
@docs mul, wedge, vee, dot, add, sub, smul, muls, sadd, adds, ssub, subs

# Norm
@docs norm, inorm, normalized
-}

{-| Basis type -}
type ${typename}Basis =
    ${basisCases.join('\n    | ')}


{-| Basis list -}
basisList : List ${typename}Basis
basisList = 
    [ ${basisCases.join(', ')} ]


{-| Number of coefficients -}
basisCount : Int
basisCount = 
    ${basis.length}


{-| Basis name -}
basisName : ${typename}Basis -> String
basisName basis =
    case basis of
        ${basisCases.map((x, i) => x + ' -> \n            '+ (i == 0 ? '"1"' : '"' + x.toLowerCase() + '"')).join('\n\n        ')}


{-| Multivector -}
type ${typename} =
    ${typename} ${basis.map(x => "Float").join(' ')}


{-| Zero value -}
zero : ${typename}
zero =
    ${typename} ${basis.map(x => "0").join(' ')}


{-| Get coefficient -}
get : ${typename}Basis -> ${typename} -> Float
get basis (${typename} ${basis.map((x, i) => "v" + i).join(' ')}) =
    case basis of
        ${basisCases.map((x, i) => x + ' -> \n            v'+i).join('\n\n        ')}


{-| Update coefficient -}
set : ${typename}Basis -> Float -> ${typename} -> ${typename}
set basis value (${typename} ${basis.map((x, i) => "v" + i).join(' ')}) =
    case basis of
        ${basisCases.map((x, i) => x + ' -> \n            ' + typename + ' ' + basis.map((y, j) => i == j ? 'value' : 'v'+j).join(' ')).join('\n\n        ')}


{-| Multivector with one coefficient -}
new : Float -> ${typename}Basis -> ${typename}
new value basis =
    set basis value zero


{-| Convert multivector to string -}
toString : ${typename} -> String
toString a =
    let 
        values =
            toList a

        basisNames =
            basisList |> List.map basisName |> List.map (\\x -> if x == "1" then "" else x)
        
        roundFloat x =
            toFloat (round (x * 10000000)) / 10000000

        formatCoefficient v b =
            if (abs v > 0.000001) then (String.fromFloat (roundFloat v) ++ b) else ""
    in
        List.map2 formatCoefficient values basisNames 
            |> List.filter ((/=) "")
            |> String.join " + "
            |> (\\s -> if s == "" then "0" else s)    


{-| Convert list of coefficients to multivector -}
fromList : List Float -> Maybe ${typename}
fromList list =
    case ${basis.map((x, i)=> '( List.head <| List.drop '+i+' list ').join(', ')}${basis.map(x=>')').join('')} of
        ${basis.map((x, i)=> '( Just v'+i+' ').join(', ')}${basis.map(x=>')').join('')} ->
            Just (${typename} ${basis.map((x, i)=> 'v'+i).join(' ')})

        _ ->
            Nothing


{-| Convert multivector to list of coefficients -}
toList : ${typename} -> List Float
toList (${typename} ${basis.map((x, i) => "v" + i).join(' ')}) =
    [ ${basis.map((x, i) => "v" + i).join(', ')} ]

`;
};

// elm Template for our binary operators
let binary = (classname, symbol, name, name_a, name_b, name_ret, code, classname_a=classname, classname_b=classname, desc)=>{
let typename = classname[0].toUpperCase() + classname.substring(1).toLowerCase();
let elmExprs = getElmExprs(code)
let pattern = n => `(${typename} ${code.split('\n').map((x, i) => n + i).join(' ')})`
let funName = name.toLowerCase()
let funType
let funArgs
if (name.match(/^s[^u]/)) {
    funType = `Float -> ${typename} -> ${typename}`
    funArgs = `${name_a} ${pattern(name_b)}`
} else if (name.match(/s$/)) {
    funType = `${typename} -> Float -> ${typename}`
    funArgs = `${pattern(name_a)} ${name_b}`
} else {
    funType = `${typename} -> ${typename} -> ${typename}`
    funArgs = `${pattern(name_a)} ${pattern(name_b)}`
};
return `{-| ${desc} -}
${funName} : ${funType}
${funName} ${funArgs} =
    ${typename}
        ${elmExprs.join('\n        ')}
`;
};

// elm Template for our binary operators
let unary = (classname, symbol, name, name_a, name_ret, code, classname_a=classname,desc)=> {
let typename = classname[0].toUpperCase() + classname.substring(1).toLowerCase();
let elmExprs = getElmExprs(code)
let funName = name.toLowerCase()
return `{-| ${desc} -}
${funName} : ${typename} -> ${typename}
${funName} (${typename} ${code.split('\n').map((x, i) => name_a + i).join(' ')}) =
    ${typename}
        ${elmExprs.join('\n        ')}
`};


// elm template for algebras without example
let GENERIC = (basis,classname)=>{
let typename = classname[0].toUpperCase() + classname.substring(1).toLowerCase();
let basisCases = basis.map(x=>x == '1' ? 'Scalar' : x.toUpperCase())
let valName = (x) => (x == "Scalar" ? "unitScalar" : x.toLowerCase())
return {
preamble:`
`,
amble: basisCases.map((x,i)=>`
{-| Basis multivector -}
${valName(x)} : ${typename}
${valName(x)} =
    set ${x} 1 zero
`).join('\n')
}}

// elm Template for the postamble
let postamble = (basis,classname,example)=>{
let typename = classname[0].toUpperCase() + classname.substring(1).toLowerCase();
return `{-| Norm -}
norm : ${typename} -> Float
norm a =
    sqrt <| abs <| get Scalar <| mul a <| conjugate a


{-| Norm of dual -}
inorm : ${typename} -> Float
inorm a =
    norm (dual a)


{-| Normalized multivector -}
normalized : ${typename} -> ${typename}
normalized a =
    muls a (1 / norm a)

${example.amble}`
};

Object.assign(exports,{preamble,postamble,unary,binary,desc:"elm",GENERIC});
