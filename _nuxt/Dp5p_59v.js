import{u as P,q as w,_ as S,a as L}from"./Dg0LERvf.js";import{_ as V}from"./Dp_9NVa3.js";import{u as q,e as A,f as D,c as f,o as r,g as x,h as k,w as C,a as t,t as d,i as E,j as F,k as I,l as m,m as u,F as j,r as H,b as $}from"./Dfo0_R2Z.js";function T(p,e){const{title:s,titleTemplate:n,...l}=p;return q({title:s,titleTemplate:n,_flatMeta:l},{...e,transform(i){const _=A({...i._flatMeta});return delete i._flatMeta,{...i,meta:_}}})}const U={class:"grid grid-cols-2 gap-40 mt-6"},z={class:"text-sm font-semibold text-gray-800 mt-1 truncate w-full"},G={class:"text-sm font-semibold text-gray-800 mt-1 truncate w-full"},J=D({__name:"PostNavigation",props:{previousPost:{},nextPost:{}},setup(p){return(e,s)=>{const n=V;return r(),f("div",U,[e.previousPost?(r(),x(n,{key:0,to:e.previousPost.path,class:"block p-2 border rounded-md shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 bg-gray-50 w-full"},{default:C(()=>[s[0]||(s[0]=t("div",{class:"text-xs text-gray-500"},"Previous Post",-1)),t("div",z,d(e.previousPost.title),1)]),_:1},8,["to"])):k("",!0),e.nextPost?(r(),x(n,{key:1,to:e.nextPost.path,class:"block p-2 border rounded-md shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 bg-gray-50 text-right w-full"},{default:C(()=>[s[1]||(s[1]=t("div",{class:"text-xs text-gray-500"},"Next Post",-1)),t("div",G,d(e.nextPost.title),1)]),_:1},8,["to"])):k("",!0)])}}}),K={class:"container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8"},O={class:"flex-1"},Q={class:"mb-12"},W={class:"text-4xl font-bold text-gray-800 mb-2"},X={class:"text-sm text-gray-500 mt-5"},Y=["datetime"],Z={class:"mt-7 border-b pb-7"},tt={class:"flex flex-wrap gap-2"},et={class:"mb-7"},st={class:"border-t border-gray-200"},rt=D({__name:"[...slug]",async setup(p){var g,y;let e,s;const{public:{author:n}}=E(),l=F(),[i,_]=([e,s]=I(()=>Promise.all([P(`page-${l.path}`,()=>w("contents").path(l.path).first()),P("all-posts",()=>w("contents").select("title","path","date").order("date","DESC").all())])),e=await e,s(),e),o=i.data,c=_.data;T({title:(g=o.value)==null?void 0:g.title,description:(y=o.value)==null?void 0:y.description});const N=m(()=>{var v;return(v=o.value)!=null&&v.date?new Date(o.value.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):""}),h=m(()=>c.value.findIndex(a=>a.path===l.path)),B=m(()=>{const a=h.value;return a>0?c.value[a-1]:null}),M=m(()=>{const a=h.value;return a<c.value.length-1?c.value[a+1]:null});return(a,v)=>{const R=S;return r(),f("div",K,[t("main",O,[t("div",Q,[t("h1",W,d(u(o).title),1),t("div",X,[t("div",null,[t("time",{datetime:u(o).date},d(N.value),9,Y)]),t("div",null," By "+d(u(n)),1)]),t("div",Z,[t("div",tt,[(r(!0),f(j,null,H(u(o).tags,b=>(r(),x(L,{key:b,tag:b},null,8,["tag"]))),128))])])]),t("article",et,[$(R,{value:u(o)},null,8,["value"])]),t("div",st,[$(J,{"previous-post":M.value,"next-post":B.value},null,8,["previous-post","next-post"])])])])}}});export{rt as default};
