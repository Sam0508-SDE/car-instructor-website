(function(){
  var d=document, root=d.documentElement;
  root.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var y=d.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // header
  var header=d.querySelector('.site-header'), btn=d.querySelector('.menu-btn'), nav=d.getElementById('nav');
  function setMenu(o){btn.setAttribute('aria-expanded',o);nav.classList.toggle('open',o);}
  btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true');});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);btn.focus();}});

  // reveal
  var items=[].slice.call(d.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){io.observe(el);});
  } else items.forEach(function(el){el.classList.add('in');});

  // route draw on scroll
  var route=d.querySelector('[data-route]');
  var svgs=[].slice.call(route.querySelectorAll('.route-svg'));
  function draw(){
    var r=route.getBoundingClientRect(), vh=window.innerHeight;
    var p=reduce?1:Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.25)));
    p=Math.min(1,p*1.12);
    svgs.forEach(function(s){
      s.querySelector('.trail').style.strokeDashoffset=(1-p).toFixed(4);
      [].forEach.call(s.querySelectorAll('.stop'),function(g){g.classList.toggle('on',p>=parseFloat(g.dataset.at)-.001&&p>0.001||(g.dataset.at==='0'&&p>0));});
    });
  }
  var tick=false;
  function onScroll(){
    header.classList.toggle('scrolled',window.scrollY>8);
    if(!tick){tick=true;requestAnimationFrame(function(){draw();tick=false;});}
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  onScroll();

  // pricing -> form preselect
  [].forEach.call(d.querySelectorAll('[data-pick]'),function(a){a.addEventListener('click',function(){
    var s=d.getElementById('topic'); s.value=a.dataset.pick;});});

  // form
  var form=d.getElementById('form'), status=d.getElementById('status');
  var rules={
    name:function(v){return v.trim().length<2?'Please tell us your name.':'';},
    phone:function(v){return v.replace(/[^\d]/g,'').length<8?'Please enter a phone number we can reach you on.':'';},
    email:function(v){return v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'That email address does not look quite right.':'';}
  };
  function check(f){
    var i=form.elements[f], m=rules[f](i.value), e=d.getElementById(f+'-e');
    e.textContent=m; i.closest('.field').classList.toggle('invalid',!!m);
    if(m)i.setAttribute('aria-invalid','true'); else i.removeAttribute('aria-invalid');
    return !m;
  }
  Object.keys(rules).forEach(function(f){
    form.elements[f].addEventListener('blur',function(){check(f);});
    form.elements[f].addEventListener('input',function(){if(form.elements[f].closest('.invalid'))check(f);});
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=Object.keys(rules).filter(function(f){return !check(f);});
    if(bad.length){form.elements[bad[0]].focus();status.textContent='Please fix the highlighted fields.';return;}
    var el=form.elements;
    var body=['Name: '+el.name.value.trim(),'Phone: '+el.phone.value.trim(),el.email.value?'Email: '+el.email.value.trim():'','Car type: '+el.gear.value,'Interested in: '+el.topic.value,'','Message:',el.msg.value.trim()].filter(function(l,i){return l!==''||i>3;}).join('\n');
    var url='mailto:info@veesdrivingschool.com.au?subject='+encodeURIComponent('Lesson enquiry from '+el.name.value.trim())+'&body='+encodeURIComponent(body);
    status.textContent='Opening your email app. If nothing happens, email info@veesdrivingschool.com.au or call 0470 380 859.';
    window.location.href=url;
  });
})();
