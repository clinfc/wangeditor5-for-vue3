import{i as g,_ as z}from"./base.7f9fbc65.js";import{C as J,B as k,k as m,aF as G,r as N,ay as Q,p as $,a7 as Y,d as X,a2 as ee,w as S,q as I,t as te,J as ne}from"./index.91ef4e92.js";import{i as oe}from"./event.63ee1cda.js";let T;const ye=e=>{var t;if(!g)return 0;if(T!==void 0)return T;const n=document.createElement("div");n.className=`${e}-scrollbar__wrap`,n.style.visibility="hidden",n.style.width="100px",n.style.position="absolute",n.style.top="-9999px",document.body.appendChild(n);const a=n.offsetWidth;n.style.overflow="scroll";const s=document.createElement("div");s.style.width="100%",n.appendChild(s);const c=s.offsetWidth;return(t=n.parentNode)==null||t.removeChild(n),T=a-c,T};function we(e,t){if(!g)return;if(!t){e.scrollTop=0;return}const n=[];let a=t.offsetParent;for(;a!==null&&e!==a&&e.contains(a);)n.push(a),a=a.offsetParent;const s=t.offsetTop+n.reduce((b,v)=>b+v.offsetTop,0),c=s+t.offsetHeight,f=e.scrollTop,h=f+e.clientHeight;s<f?e.scrollTop=s:c>h&&(e.scrollTop=c-e.clientHeight)}const j={tab:"Tab",enter:"Enter",space:"Space",left:"ArrowLeft",up:"ArrowUp",right:"ArrowRight",down:"ArrowDown",esc:"Escape",delete:"Delete",backspace:"Backspace",numpadEnter:"NumpadEnter",pageUp:"PageUp",pageDown:"PageDown",home:"Home",end:"End"};var ae={name:"en",el:{colorpicker:{confirm:"OK",clear:"Clear",defaultLabel:"color picker",description:"current color is {color}. press enter to select a new color."},datepicker:{now:"Now",today:"Today",cancel:"Cancel",clear:"Clear",confirm:"OK",dateTablePrompt:"Use the arrow keys and enter to select the day of the month",monthTablePrompt:"Use the arrow keys and enter to select the month",yearTablePrompt:"Use the arrow keys and enter to select the year",selectedDate:"Selected date",selectDate:"Select date",selectTime:"Select time",startDate:"Start Date",startTime:"Start Time",endDate:"End Date",endTime:"End Time",prevYear:"Previous Year",nextYear:"Next Year",prevMonth:"Previous Month",nextMonth:"Next Month",year:"",month1:"January",month2:"February",month3:"March",month4:"April",month5:"May",month6:"June",month7:"July",month8:"August",month9:"September",month10:"October",month11:"November",month12:"December",week:"week",weeks:{sun:"Sun",mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat"},weeksFull:{sun:"Sunday",mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday"},months:{jan:"Jan",feb:"Feb",mar:"Mar",apr:"Apr",may:"May",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dec"}},inputNumber:{decrease:"decrease number",increase:"increase number"},select:{loading:"Loading",noMatch:"No matching data",noData:"No data",placeholder:"Select"},dropdown:{toggleDropdown:"Toggle Dropdown"},cascader:{noMatch:"No matching data",loading:"Loading",placeholder:"Select",noData:"No data"},pagination:{goto:"Go to",pagesize:"/page",total:"Total {total}",pageClassifier:"",deprecationWarning:"Deprecated usages detected, please refer to the el-pagination documentation for more details"},dialog:{close:"Close this dialog"},drawer:{close:"Close this dialog"},messagebox:{title:"Message",confirm:"OK",cancel:"Cancel",error:"Illegal input",close:"Close this dialog"},upload:{deleteTip:"press delete to remove",delete:"Delete",preview:"Preview",continue:"Continue"},slider:{defaultLabel:"slider between {min} and {max}",defaultRangeStartLabel:"pick start value",defaultRangeEndLabel:"pick end value"},table:{emptyText:"No Data",confirmFilter:"Confirm",resetFilter:"Reset",clearFilter:"All",sumText:"Sum"},tree:{emptyText:"No Data"},transfer:{noMatch:"No matching data",noData:"No data",titles:["List 1","List 2"],filterPlaceholder:"Enter keyword",noCheckedFormat:"{total} items",hasCheckedFormat:"{checked}/{total} checked"},image:{error:"FAILED"},pageHeader:{title:"Back"},popconfirm:{confirmButtonText:"Yes",cancelButtonText:"No"}}};const se=e=>(t,n)=>re(t,n,m(e)),re=(e,t,n)=>Q(n,e,e).replace(/\{(\w+)\}/g,(a,s)=>{var c;return`${(c=t==null?void 0:t[s])!=null?c:`{${s}}`}`}),ce=e=>{const t=k(()=>m(e).name),n=G(e)?e:N(e);return{lang:t,locale:n,t:se(e)}},Fe=()=>{const e=J("locale");return ce(k(()=>e.value||ae))};let p=[];const O=e=>{const t=e;t.key===j.esc&&p.forEach(n=>n(t))},ie=e=>{$(()=>{p.length===0&&document.addEventListener("keydown",O),g&&p.push(e)}),Y(()=>{p=p.filter(t=>t!==e),p.length===0&&g&&document.removeEventListener("keydown",O)})},M=N(0),Se=()=>{const e=J("zIndex",2e3),t=k(()=>e.value+M.value);return{initialZIndex:e,currentZIndex:t,nextZIndex:()=>(M.value++,t.value)}},V=e=>{const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:a=>{const s=a.tagName==="INPUT"&&a.type==="hidden";return a.disabled||a.hidden||s?NodeFilter.FILTER_SKIP:a.tabIndex>=0||a===document.activeElement?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t},R=(e,t)=>{for(const n of e)if(!le(n,t))return n},le=(e,t)=>{if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1},ue=e=>{const t=V(e),n=R(t,e),a=R(t.reverse(),e);return[n,a]},de=e=>e instanceof HTMLInputElement&&"select"in e,d=(e,t)=>{if(e&&e.focus){const n=document.activeElement;e.focus({preventScroll:!0}),e!==n&&de(e)&&t&&e.select()}};function K(e,t){const n=[...e],a=e.indexOf(t);return a!==-1&&n.splice(a,1),n}const fe=()=>{let e=[];return{push:a=>{const s=e[0];s&&a!==s&&s.pause(),e=K(e,a),e.unshift(a)},remove:a=>{var s,c;e=K(e,a),(c=(s=e[0])==null?void 0:s.resume)==null||c.call(s)}}},pe=(e,t=!1)=>{const n=document.activeElement;for(const a of e)if(d(a,t),document.activeElement!==n)return},U=fe(),C="focus-trap.focus-after-trapped",_="focus-trap.focus-after-released",B={cancelable:!0,bubbles:!1},H="focusAfterTrapped",W="focusAfterReleased",me=Symbol("elFocusTrap"),he=X({name:"ElFocusTrap",inheritAttrs:!1,props:{loop:Boolean,trapped:Boolean,focusTrapEl:Object,focusStartEl:{type:[Object,String],default:"first"}},emits:[H,W,"focusin","focusout","focusout-prevented","release-requested"],setup(e,{emit:t}){const n=N();let a,s;ie(o=>{e.trapped&&!c.paused&&t("release-requested",o)});const c={paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}},f=o=>{if(!e.loop&&!e.trapped||c.paused)return;const{key:r,altKey:i,ctrlKey:l,metaKey:u,currentTarget:Z,shiftKey:P}=o,{loop:A}=e,q=r===j.tab&&!i&&!l&&!u,E=document.activeElement;if(q&&E){const y=Z,[w,F]=ue(y);w&&F?!P&&E===F?(o.preventDefault(),A&&d(w,!0),t("focusout-prevented")):P&&[w,y].includes(E)&&(o.preventDefault(),A&&d(F,!0),t("focusout-prevented")):E===y&&(o.preventDefault(),t("focusout-prevented"))}};ee(me,{focusTrapRef:n,onKeydown:f}),S(()=>e.focusTrapEl,o=>{o&&(n.value=o)},{immediate:!0}),S([n],([o],[r])=>{o&&(o.addEventListener("keydown",f),o.addEventListener("focusin",v),o.addEventListener("focusout",L)),r&&(r.removeEventListener("keydown",f),r.removeEventListener("focusin",v),r.removeEventListener("focusout",L))});const h=o=>{t(H,o)},b=o=>t(W,o),v=o=>{const r=m(n);if(!r)return;const i=o.target,l=i&&r.contains(i);l&&t("focusin",o),!c.paused&&e.trapped&&(l?s=i:d(s,!0))},L=o=>{const r=m(n);if(!(c.paused||!r))if(e.trapped){const i=o.relatedTarget;!oe(i)&&!r.contains(i)&&setTimeout(()=>{!c.paused&&e.trapped&&d(s,!0)},0)}else{const i=o.target;i&&r.contains(i)||t("focusout",o)}};async function D(){await I();const o=m(n);if(o){U.push(c);const r=document.activeElement;if(a=r,!o.contains(r)){const l=new Event(C,B);o.addEventListener(C,h),o.dispatchEvent(l),l.defaultPrevented||I(()=>{let u=e.focusStartEl;te(u)||(d(u),document.activeElement!==u&&(u="first")),u==="first"&&pe(V(o),!0),(document.activeElement===r||u==="container")&&d(o)})}}}function x(){const o=m(n);if(o){o.removeEventListener(C,h);const r=new Event(_,B);o.addEventListener(_,b),o.dispatchEvent(r),r.defaultPrevented||d(a!=null?a:document.body,!0),o.removeEventListener(_,h),U.remove(c)}}return $(()=>{e.trapped&&D(),S(()=>e.trapped,o=>{o?D():x()})}),Y(()=>{e.trapped&&x()}),{onKeydown:f}}});function ve(e,t,n,a,s,c){return ne(e.$slots,"default",{handleKeydown:e.onKeydown})}var Ce=z(he,[["render",ve],["__file","/home/runner/work/element-plus/element-plus/packages/components/focus-trap/src/focus-trap.vue"]]);export{Ce as E,me as F,j as a,Fe as b,ye as g,we as s,Se as u};