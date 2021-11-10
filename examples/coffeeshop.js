// Some utilities that are exposed inside the coffeeshop examples.
// 
// - Overload the Algebra call and process the return value to automatically add it to the page.
// - Test MD/Katex integration for a simple notebook setup.
//
// This script should be loaded _after_ ganja.js

if (window.Algebra === undefined) console.warning("coffeeshop.js hould be loaded after ganja.js");
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

  // Install MD and Katex handlers.
  window.md = function(...args) {
    var div = document.createElement('div');
    div.innerHTML = marked.parse(...args);
    document.body.appendChild(div);
    if (window.renderMathInElement) renderMathInElement(document.body, {
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
  }
  

})()