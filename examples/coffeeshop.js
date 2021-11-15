// Some utilities that are exposed inside the coffeeshop examples.
// 
// - Overload the Algebra call and process the return value to automatically add it to the page.
// - Test MD/Katex integration for a simple notebook setup.
//
// This script should be loaded _after_ ganja.js

if (window.Algebra === undefined) console.warn("coffeeshop.js should be loaded after ganja.js");
else (function (){

  // Overload Algebra call.
  var _Algebra = window.Algebra;
  
  window.Algebra = function(...args) {
    
    console.log('_Algebra ', args);
    
    var res = _Algebra(...args);
    
    if (res instanceof HTMLCanvasElement || res instanceof SVGElement)
      document.body.appendChild(res);
      
    if (res && !(res instanceof Object))
      document.body.innerHTML += `<PRE>${res+''}</PRE>`;
    
    return res;  
  }

  window.applyKatex = function() {
    if (!window.renderMathInElement) {
      console.warn('window.renderMathInElement not defined');
      return;
    }
    renderMathInElement(document.body, {
      // customised options
      // • auto-render specific keys, e.g.:
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      // • rendering keys, e.g.:
      throwOnError : false
    });
  }

  // Install MD and Katex handlers.
  window.md = function(...args) {
    var div;
    var lambda = args[0];
    if (lambda instanceof Function) {
      div = md(lambda());
      divLambdas.push([div, lambda]);
    } else {
      div = document.createElement('div');
      div.innerHTML = marked.parse(...args);
      document.body.appendChild(div);
      applyKatex();
    }
    return div;
  }
  
  window.divLambdas = [];

  // Notebook option
  window.notebook = function(title) {
    window.title = title;
    document.body.classList.add("notebook");
    document.body.parentElement.classList.add("notebook");
    marked.setOptions({
      highlight: function(code, lang) {
        return hljs.highlight("javascript",code).value;
      }
    });
    divLambdas.length = 0;
  }
  
  window.reEval = function() {
    for (var [div, lambda] of divLambdas) {
      var val = lambda();
      div.innerHTML = marked.parse(val);
    }
    applyKatex();
  }

  window.Button = function(text, onclick) {
    var button = document.createElement("button");
    button.innerText = text;
    button.onclick = () => {
      onclick();
      reEval();
    };
    document.body.appendChild(button);
    return button;
  }

  window.Input = function(str, lambda) {
    var input = document.createElement("input");
    document.body.appendChild(input);
    input.value = str;
    input.oninput = () => {
      lambda(input.value);
      reEval();
    }
    return input;
  }

})()