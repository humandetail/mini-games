import{d as m,u as p,i as h,r as v,G as f,o as t,c as C,a as e,b as c,e as y,n as g,f as l,t as k,g as b,F as M,h as x,T as B,_ as S}from"./index-0dd9c990.js";const w={class:"mode-list"},z=["onClick"],F=m({__name:"ChooseMode",emits:["close"],setup(G,{emit:d}){const i=d,_=p(),o=h("mode",v(f.easy)),u=a=>{o.value!==a&&(o.value=a,n())},n=()=>{i("close")};return(a,r)=>(t(),C(B,{to:"body"},[e("div",{class:"choose-mode-modal",style:x({transform:l(_).isRotate?"translate(-50%, -50%) rotate(90deg)":"translate(-50%, -50%) rotate(0deg)"})},[e("header",{class:"header"},[r[0]||(r[0]=e("h2",{class:"title"},"选择模式",-1)),e("div",{class:"btn-close",onClick:n}," × ")]),e("ul",w,[(t(!0),c(M,null,y(l(b),s=>(t(),c("li",{key:s.value,class:g(["item",{current:l(o)===s.value}]),onClick:T=>u(s.value)},k(s.label),11,z))),128))])],4)]))}});const D=S(F,[["__scopeId","data-v-b0d70844"]]);export{D as default};
