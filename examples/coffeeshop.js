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
    var container, id, res = _Algebra(...args);
    
    if (res && res.parentElement) {
      res.parentElement.classList.add('trap');
      id = res.parentElement.id;
      if (document.body.children.length == 2) {
        res.style.width = res.style.height = '100%';
        document.body.overflow = 'hidden';
      }
    } else if (res) {
      
      if (res instanceof HTMLCanvasElement || res instanceof SVGElement) {
        if (!window.isNotebook) {
          res.style.width = res.style.height = '100%';
          document.body.appendChild(res);
        } else {  
          container = document.createElement('div');
          container.classList.add('trap');
          id = 'cont_'+(Math.random()*10000|0);
          container.id = id;
          container.appendChild(res);
          document.body.appendChild(container);
        } 
      }
      
      if (res && res instanceof Array)
        document.body.innerHTML += `<PRE>[${res+''}]</PRE>`;
      else if (res && !(res instanceof Object))
        document.body.innerHTML += `<PRE>${res+''}</PRE>`;
    }    

    if (window.inView && id) {
      // Store original animation flag and turn everything of. 
      if (res && res.options) { res.options.origAnimate = res.options.animate; res.options.animate = false; }
      
      // Now make sure in-view items are turned on.
      inView('#'+id)
          .on('enter', (x)=>{ 
             x=x.firstChild; if(!x) return; 
             if (x.options) {
               if (x.options.origAnimate == undefined) x.options.origAnimate = x.options.animate;
               x.options.animate=x.options.origAnimate; 
               if (x.options.animate) {
                 if (x.remake)  x=x.remake(true); 
                 if (x.update)  x.update(x.value);
                 console.log('svg on '+x.parentElement.id);  
               }
             }  
          })
          .on('exit', (x)=>{ 
             x=x.firstChild; if(!x) return; 
             if(x.options) {
               x.options.animate=false; 
               if (x.options.origAnimate) {
                 if(x.remake) x=x.remake(false); 
                 console.log('svg off '+x.parentElement.id); 
               }  
             }  
          });         
    }     
    
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
    window.isNotebook = true;
    document.body.classList.add("notebook");
    document.body.parentElement.classList.add("notebook");
    marked.setOptions({
      highlight: function(code, lang) {
        return hljs.highlight("javascript",code).value;
      }
    });
  }

})()