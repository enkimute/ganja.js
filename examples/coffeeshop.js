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
  
  window.allTex = '';
  var macros = {};
  window.macros = function(...s) {
    s = String.raw(...s);
    allTex += s+'\n';
    katex.renderToString(
      s,
      {macros, globalGroup: true}
    );
  }
  
  window.resolve_references = ()=>{
  // equations
    var eqn = [...document.querySelectorAll('.equation')]
              .map((x,i)=>({ el:x, nr:i+1, name: x.querySelector('.label')?.name}))
    eqn.forEach(e=>{
       var s = document.createElement('span');
       s.style.position = 'absolute';
       s.style.top = s.style.right = '5px';
       e.el.appendChild(s); e.el.style.position='relative';
       s.innerHTML=`(${e.nr})`
    });
  
  // Now try numbering the sections.
    var sects = [...document.querySelectorAll('h2')]
               .map((x,i)=>({ el:x, nr:i+1, name: x.querySelector('.label')?.name}))
  // resolve the references.  
    var ref = [...document.querySelectorAll('.ref')]    
    ref.forEach(r=>{
      var eq = eqn.find(x=>x.name == r.name);
      if (eq) r.innerHTML = 'eqn '+eq.nr;
      var eq = sects.find(x=>x.name == r.name);
      if (eq) r.innerHTML = 'section '+eq.nr;
    })
  }
  
  window.rerun = ()=>{
    var script = document.body.querySelector('script');
    allTex = '';
    if (script) {
      document.body.innerHTML='';
      var s2 = document.createElement('script');
      s2.innerHTML = script.innerHTML;
      document.body.appendChild(s2);
    } else if (top.run) top.run.click(); 
  }
  
  window.button = (name, func)=>{
    var e = document.createElement('input');
    e.type = 'button';
    e.value = name;
    e.onclick = func;
    return document.body.appendChild(e);
  }
  
  window.checkbox = (name, options)=>{
    if (options === undefined) return localStorage[name]=="1";
    var i = document.createElement('input');
    i.type = 'checkbox';
    if (localStorage[name] == "1" || (localStorage[name]===undefined && options.checked)) i.checked = true;
    localStorage[name] = i.checked ? 1:0;
    i.onchange = ()=>{ localStorage[name] =  i.checked ? 1:0; rerun(); }
    var l = document.createElement('label');
    l.innerHTML = ' ' + (String.raw`${options.description}`|| name);
    l.insertBefore(i,l.firstChild);
    return document.body.appendChild(l);
  }
  
  window.embed = (el)=>{
    var parent = el.parentElement;
    if (parent) parent.removeChild(el);
    var id = 'id_'+(performance.now()|0)+(Math.random()*1000|0);
    setTimeout(()=>{
      var div = document.getElementById(id);
      el.onwheel = undefined;
      div.appendChild(el);
      if (el.options && el.options.animate) (el.render||el.update||el.remake)(el.value);
      if (el.style.height == '100%') el.style.height = '400px';

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





    },1);
    if (el instanceof HTMLLabelElement) return `<SPAN ID="${id}"></SPAN>`;
    return `<DIV ID="${id}" CLASS="embed_image" STYLE="width:100%;${ el.style.height=='100%'?'min-height:400px; height:400px':''}"></DIV>`;
  
  }
  
  window.saveTex = function(){
    [...document.querySelectorAll(".embed_image")].map(x=>x.firstChild).filter(x=>x).map((x,i)=>{
      var id = x.parentElement.id;
      var s = `<DIV ID="${id}" CLASS="embed_image" STYLE="width:100%;"></DIV>`;
      allTex = allTex.replace(s,'image_'+i+'.png');
      var s = getComputedStyle(x);
      var w = parseFloat(s.width);
      var h = parseFloat(s.height);
      var nw = 1920;
      var nh = (nw/w*h)|0;
      nw*=2;
      nh*=2;
      var c = document.createElement('canvas');
      c.width  = nw;
      c.height = nh;
      var ctx = c.getContext('2d');
      var img = new Image();
      var copy = x.cloneNode(true);
      var data = (new XMLSerializer()).serializeToString(copy);
      data = data.replace('viewBox="-2 -2 4 4"',`viewBox="-${2*w/h} -2 ${4*w/h} 4"`);
      console.log (i,`viewBox="-${2*w/h} -2 ${4*w/h} 4"`)
      var DOMURL = window.URL || window.webkitURL || window;
      var img = new Image();
      var svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
      var url = DOMURL.createObjectURL(svgBlob);
      img.src = url;
      img.onerror = function(e){
        console.warn(i,'error',e)
      }
      img.onload = function () {
        console.log('saving ',i);
        var w2 = img.naturalWidth * (nh/nw);
        img.width = w;
        img.height = h;
        ctx.drawImage(img, 0, 0, nw, nh);
        var a = document.createElement("a");
        a.download = `image_${i}.png`;
        a.href = c.toDataURL("image/png",1.0);
        a.click();
        a.innerHTML=`<BR>image_${i}.png`;
        document.body.appendChild(a);
      };
    })      
    var DOMURL = window.URL || window.webkitURL || window;
    var texBlob = new Blob([allTex],{type:"text/plain"});
    var a = document.createElement("a");
    a.download = "article.tex";
    a.href = DOMURL.createObjectURL(texBlob);
    a.click();
  }

  // Preamble just for tex output
  window.preamble = function(...args) {
    if (args[0] instanceof Array) args = [String.raw(...args).replace(/\\`/g,'`')]
    allTex+= args[0]+allTex;
  }

  // Install MD and Katex handlers.
  window.md = function(...args) {
    if (args[0] instanceof Array) args = [String.raw(...args).replace(/\\`/g,'`')]

    if (args[0].indexOf("\\include{") != -1) {
       var fileName = args[0].match(/\\include\{(.*?)\}/)[1];
       console.log(fileName);
       var x = new XMLHttpRequest();
       x.open('GET', fileName, false);  // `false` makes the request synchronous
       x.send(null);
       if (x.status === 200) {
        window.macros`${x.responseText}`;
        args[0] = args[0].replace(/\\include\{.*?\}/g,'');
       }
    }

    allTex += args[0]+'\n';
    args[0] = args[0]
              .replace(/\%\%.*/g,'')
              .replace(/\\title\s*\{(.*?({.*?}.*?)*)\}/gs,"<CENTER><H1>$1</H1></CENTER>")
              .replace(/\\ref\s*\{(.*?({.*?}.*?)*)\}/g,"<A CLASS='ref' NAME='$1'>[?]</A>")
              .replace(/\\cref\s*\{(.*?({.*?}.*?)*)\}/g,"<A CLASS='ref' NAME='$1'>[?]</A>")
              .replace(/\\section\s*\{(.*?({.*?}.*?)*)\}/g,"## $1")
              .replace(/\\subsection\s*\{(.*?({.*?}.*?)*)\}/g,"### $1")
              .replace(/\\subsubsection\s*\{(.*?({.*?}.*?)*)\}/g,"#### $1")
              .replace(/\\begin\s*\{equation\}(.*?)\\end\{equation\}/gs,"<DIV CLASS='equation'>$$$$$1$$$$</DIV>")
              .replace(/\\\[(.*?)\\\]/gs,"$$$$$1$$$$")
              .replace(/\$\$\s*(\\label{.*?})/g,"$1 $$$$")
              .replace(/\\label{(.*?)}/g,"<A NAME='$1' CLASS='label'></A>")
              .replace(/\\emph{(.*?({.*?}.*?)*)}/gs,'**$1**')
              .replace(/\\begin\s*{tabular}\s*{(.*?)}(.*?)\\end{tabular}/gs,function(t,a,b){
                  b = b.split('\n').filter(x=>x.match(/&/)).map(x=>x.replace(/\\\\/g,'').split('&'));
                  b = b.map(r=>'<TR>'+r.map(c=>'<TD>'+c+'</TD>').join('')+'</TR>').join('\n')
                  return `<TABLE>${b}</TABLE>`;
              })
              .replace(/\\begin{center}(.*?)\\end{center}/gs,"<CENTER>$1</CENTER>")
              .replace(/\\begin\s*\{lstlisting\}(\[.*?\]){0,1}(.*?)\\end\s*\{lstlisting\}/gs,function(t,a,b){
                  return "```"+b+"```";
              })
              .replace(/\\begin\{minted\}(\[.*?\]){0,1}\{(.*?)\}(.*?)\\end\{minted\}/gs,function(t,a,b,c){
                  return "```"+c+"```";
              })
              .replace(/\\includegraphics(\[.*?\]){0,1}\{(.*?)\}/gs,"$2")
              .replace(/\\caption\w*\{(.*?)\}/gs,"<CENTER CLASS='caption'><SMALL>$1</SMALL></CENTER>")
              .replace(/\\author{(.*?)}/g, "<CENTER><B>$1</B></CENTER>")
              .replace(/\\date{(.*?)}/g, "<CENTER><I>$1</I></CENTER>")
              .replace(/\\begin{itemize}(.*?)\\end{itemize}/s,(t,a)=>a.split('\\item').filter(x=>!x.match(/^\s*$/)).map(x=>'* '+x+'\n').join(''))
              .replace(/\\maketitle/g, "")
              .replace(/(?:\\fcolorbox{[^{]*?})(?:{.*?}){(.*?{[^{]*}.*)}/g,"$1")
              .replace(/(?:\\scalebox{[^{]*?}){([^\\\n].*?{[^{]*}.*)}/gs,"$1")
              .replace(/(?:\\multirow{[^{]*?})(?:{[^}]*}){(.*?{[^{]*}.*)}/gs,"$1")
              .replace(/(?:<TD>\s*\\multicolumn{[^{]*?})(?:{.*?}){(.*?{[^{]*}.*)(?:})/g,"<TD colspan=2 align=center>$1")
//              .replace(/(?:<TD>\s*\\multicolumn{[^{]*?})(?:{.*?}){(.*?{[^{]*}.*)(?:})/gs,"<TD colspan=2 align=center>$1")
              .replace(/\\bf\s*?{([^{]*?)}/gs,"<B>$1</B>")
              .replace(/\\bf\s/gs,"<B>")
              .replace(/\\textbf\s*?{([^{]*?)}/gs,"<B>$1</B>")
              .replace(/\\begin\s*{document}/gs, "")
              .replace(/\\end\s*{document}.*/gs, "")
    var div = document.createElement('div');
    div.innerHTML = marked.parse(...args);
    document.body.appendChild(div);
    if (window.renderMathInElement) renderMathInElement(document.body, {
          // customised options
          macros, globalGroup:true,
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
    allTex = '';
    macros = {};
    marked.setOptions({
      highlight: function(code, lang) {
        return hljs.highlight("javascript",code).value;
      }
    });
  }

})()