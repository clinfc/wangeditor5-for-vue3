import"./base.7f9fbc65.js";import{E,a as D}from"./el-form-item.e35837bb.js";import{E as C}from"./el-button.af5a0551.js";import{d as F,I as g,r as h,a3 as j,u as A,_ as B,c as b,b as n,e as a,o as y,f as t,ac as I,x as v}from"./index.91ef4e92.js";import{I as k}from"./IPrism.36365e59.js";import"./index.595f45d8.js";const $=F({components:{IPage:g,IPrism:k},setup(){const o=h(null),e=j({json:"",html:""}),r={json:[{required:!0,message:"\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A",trigger:"change"}]},{handle:l,syncContent:m}=A({editable:{delay:5e3,config:{placeholder:"\u65E0\u64CD\u4F5C 5s \u540E\u624D\u4F1A\u540C\u6B65\u8868\u5355\u6570\u636E\uFF0C\u8868\u5355\u63D0\u4EA4\u524D\u4F7F\u7528 syncContent API \u5F3A\u5236\u540C\u6B65\u6570\u636E\uFF0C\u786E\u4FDD\u6570\u636E\u4E0D\u88AB\u4E22\u5931"}}});function i(){m(),o.value.validate(u=>{console.log({valid:u,...e})})}return{ruleForm:o,formData:e,formRule:r,handle:l,submit:i}}}),w=I("\u63D0\u4EA4\u8868\u5355"),N=v("br",null,null,-1);function P(o,e,r,l,m,i){const u=a("we-editor"),p=E,d=C,c=D,f=a("i-prism"),_=a("i-page");return y(),b(_,{title:"\u624B\u52A8\u540C\u6B65 v-model \u6570\u636E"},{default:n(()=>[t(c,{ref:"ruleForm","label-position":"top",model:o.formData,rules:o.formRule},{default:n(()=>[t(p,{label:"\u6587\u7AE0",prop:"json"},{default:n(()=>[t(u,{handle:o.handle,json:o.formData.json,"onUpdate:json":e[0]||(e[0]=s=>o.formData.json=s),jsonModifiers:{string:!0},html:o.formData.html,"onUpdate:html":e[1]||(e[1]=s=>o.formData.html=s)},null,8,["handle","json","html"])]),_:1}),t(p,null,{default:n(()=>[t(d,{type:"primary",onClick:o.submit},{default:n(()=>[w]),_:1},8,["onClick"])]),_:1})]),_:1},8,["model","rules"]),N,t(f,{lang:"json",content:o.formData.json},null,8,["content"])]),_:1})}const W=B($,[["render",P]]);export{W as default};
