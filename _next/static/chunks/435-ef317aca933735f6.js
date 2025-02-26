"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[435],{1271:(e,t,n)=>{n.d(t,{m:()=>r});function r(e,t,{checkForDefaultPrevented:n=!0}={}){return function(r){if(e?.(r),!1===n||!r.defaultPrevented)return t?.(r)}}},2259:(e,t,n)=>{n.d(t,{A:()=>u,q:()=>i});var r=n(7620),o=n(4568);function i(e,t){let n=r.createContext(t),i=e=>{let{children:t,...i}=e,u=r.useMemo(()=>i,Object.values(i));return(0,o.jsx)(n.Provider,{value:u,children:t})};return i.displayName=e+"Provider",[i,function(o){let i=r.useContext(n);if(i)return i;if(void 0!==t)return t;throw Error(`\`${o}\` must be used within \`${e}\``)}]}function u(e,t=[]){let n=[],i=()=>{let t=n.map(e=>r.createContext(e));return function(n){let o=n?.[e]||t;return r.useMemo(()=>({[`__scope${e}`]:{...n,[e]:o}}),[n,o])}};return i.scopeName=e,[function(t,i){let u=r.createContext(i),a=n.length;n=[...n,i];let l=t=>{let{scope:n,children:i,...l}=t,s=n?.[e]?.[a]||u,d=r.useMemo(()=>l,Object.values(l));return(0,o.jsx)(s.Provider,{value:d,children:i})};return l.displayName=t+"Provider",[l,function(n,o){let l=o?.[e]?.[a]||u,s=r.useContext(l);if(s)return s;if(void 0!==i)return i;throw Error(`\`${n}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let n=()=>{let n=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let o=n.reduce((t,{useScope:n,scopeName:r})=>{let o=n(e)[`__scope${r}`];return{...t,...o}},{});return r.useMemo(()=>({[`__scope${t.scopeName}`]:o}),[o])}};return n.scopeName=t.scopeName,n}(i,...t)]}},5814:(e,t,n)=>{n.d(t,{UC:()=>et,VY:()=>er,ZL:()=>Q,bL:()=>K,bm:()=>eo,hE:()=>en,hJ:()=>ee,l9:()=>Y});var r=n(7620),o=n(1271),i=n(7211),u=n(2259),a=n(5188),l=n(6455),s=n(2072),d=n(7969),c=n(596),f=n(3979),p=n(877),m=n(3147),v=n(2871),g=n(3416),y=n(1217),N=n(4568),h="Dialog",[x,b]=(0,u.A)(h),[w,D]=x(h),O=e=>{let{__scopeDialog:t,children:n,open:o,defaultOpen:i,onOpenChange:u,modal:s=!0}=e,d=r.useRef(null),c=r.useRef(null),[f=!1,p]=(0,l.i)({prop:o,defaultProp:i,onChange:u});return(0,N.jsx)(w,{scope:t,triggerRef:d,contentRef:c,contentId:(0,a.B)(),titleId:(0,a.B)(),descriptionId:(0,a.B)(),open:f,onOpenChange:p,onOpenToggle:r.useCallback(()=>p(e=>!e),[p]),modal:s,children:n})};O.displayName=h;var C="DialogTrigger",R=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,u=D(C,n),a=(0,i.s)(t,u.triggerRef);return(0,N.jsx)(p.sG.button,{type:"button","aria-haspopup":"dialog","aria-expanded":u.open,"aria-controls":u.contentId,"data-state":V(u.open),...r,ref:a,onClick:(0,o.m)(e.onClick,u.onOpenToggle)})});R.displayName=C;var E="DialogPortal",[j,I]=x(E,{forceMount:void 0}),M=e=>{let{__scopeDialog:t,forceMount:n,children:o,container:i}=e,u=D(E,t);return(0,N.jsx)(j,{scope:t,forceMount:n,children:r.Children.map(o,e=>(0,N.jsx)(f.C,{present:n||u.open,children:(0,N.jsx)(c.Z,{asChild:!0,container:i,children:e})}))})};M.displayName=E;var _="DialogOverlay",A=r.forwardRef((e,t)=>{let n=I(_,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,i=D(_,e.__scopeDialog);return i.modal?(0,N.jsx)(f.C,{present:r||i.open,children:(0,N.jsx)(P,{...o,ref:t})}):null});A.displayName=_;var P=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=D(_,n);return(0,N.jsx)(v.A,{as:y.DX,allowPinchZoom:!0,shards:[o.contentRef],children:(0,N.jsx)(p.sG.div,{"data-state":V(o.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),T="DialogContent",k=r.forwardRef((e,t)=>{let n=I(T,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,i=D(T,e.__scopeDialog);return(0,N.jsx)(f.C,{present:r||i.open,children:i.modal?(0,N.jsx)(F,{...o,ref:t}):(0,N.jsx)(S,{...o,ref:t})})});k.displayName=T;var F=r.forwardRef((e,t)=>{let n=D(T,e.__scopeDialog),u=r.useRef(null),a=(0,i.s)(t,n.contentRef,u);return r.useEffect(()=>{let e=u.current;if(e)return(0,g.Eq)(e)},[]),(0,N.jsx)(U,{...e,ref:a,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,o.m)(e.onCloseAutoFocus,e=>{var t;e.preventDefault(),null===(t=n.triggerRef.current)||void 0===t||t.focus()}),onPointerDownOutside:(0,o.m)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,n=0===t.button&&!0===t.ctrlKey;(2===t.button||n)&&e.preventDefault()}),onFocusOutside:(0,o.m)(e.onFocusOutside,e=>e.preventDefault())})}),S=r.forwardRef((e,t)=>{let n=D(T,e.__scopeDialog),o=r.useRef(!1),i=r.useRef(!1);return(0,N.jsx)(U,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{var r,u;null===(r=e.onCloseAutoFocus)||void 0===r||r.call(e,t),t.defaultPrevented||(o.current||null===(u=n.triggerRef.current)||void 0===u||u.focus(),t.preventDefault()),o.current=!1,i.current=!1},onInteractOutside:t=>{var r,u;null===(r=e.onInteractOutside)||void 0===r||r.call(e,t),t.defaultPrevented||(o.current=!0,"pointerdown"!==t.detail.originalEvent.type||(i.current=!0));let a=t.target;(null===(u=n.triggerRef.current)||void 0===u?void 0:u.contains(a))&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&i.current&&t.preventDefault()}})}),U=r.forwardRef((e,t)=>{let{__scopeDialog:n,trapFocus:o,onOpenAutoFocus:u,onCloseAutoFocus:a,...l}=e,c=D(T,n),f=r.useRef(null),p=(0,i.s)(t,f);return(0,m.Oh)(),(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(d.n,{asChild:!0,loop:!0,trapped:o,onMountAutoFocus:u,onUnmountAutoFocus:a,children:(0,N.jsx)(s.qW,{role:"dialog",id:c.contentId,"aria-describedby":c.descriptionId,"aria-labelledby":c.titleId,"data-state":V(c.open),...l,ref:p,onDismiss:()=>c.onOpenChange(!1)})}),(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(H,{titleId:c.titleId}),(0,N.jsx)(J,{contentRef:f,descriptionId:c.descriptionId})]})]})}),L="DialogTitle",$=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=D(L,n);return(0,N.jsx)(p.sG.h2,{id:o.titleId,...r,ref:t})});$.displayName=L;var W="DialogDescription",B=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=D(W,n);return(0,N.jsx)(p.sG.p,{id:o.descriptionId,...r,ref:t})});B.displayName=W;var G="DialogClose",q=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,i=D(G,n);return(0,N.jsx)(p.sG.button,{type:"button",...r,ref:t,onClick:(0,o.m)(e.onClick,()=>i.onOpenChange(!1))})});function V(e){return e?"open":"closed"}q.displayName=G;var X="DialogTitleWarning",[Z,z]=(0,u.q)(X,{contentName:T,titleName:L,docsSlug:"dialog"}),H=e=>{let{titleId:t}=e,n=z(X),o="`".concat(n.contentName,"` requires a `").concat(n.titleName,"` for the component to be accessible for screen reader users.\n\nIf you want to hide the `").concat(n.titleName,"`, you can wrap it with our VisuallyHidden component.\n\nFor more information, see https://radix-ui.com/primitives/docs/components/").concat(n.docsSlug);return r.useEffect(()=>{t&&!document.getElementById(t)&&console.error(o)},[o,t]),null},J=e=>{let{contentRef:t,descriptionId:n}=e,o=z("DialogDescriptionWarning"),i="Warning: Missing `Description` or `aria-describedby={undefined}` for {".concat(o.contentName,"}.");return r.useEffect(()=>{var e;let r=null===(e=t.current)||void 0===e?void 0:e.getAttribute("aria-describedby");n&&r&&!document.getElementById(n)&&console.warn(i)},[i,t,n]),null},K=O,Y=R,Q=M,ee=A,et=k,en=$,er=B,eo=q},5188:(e,t,n)=>{n.d(t,{B:()=>l});var r,o=n(7620),i=n(5330),u=(r||(r=n.t(o,2)))["useId".toString()]||(()=>void 0),a=0;function l(e){let[t,n]=o.useState(u());return(0,i.N)(()=>{e||n(e=>e??String(a++))},[e]),e||(t?`radix-${t}`:"")}},3979:(e,t,n)=>{n.d(t,{C:()=>u});var r=n(7620),o=n(7211),i=n(5330),u=e=>{let{present:t,children:n}=e,u=function(e){var t,n;let[o,u]=r.useState(),l=r.useRef({}),s=r.useRef(e),d=r.useRef("none"),[c,f]=(t=e?"mounted":"unmounted",n={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},r.useReducer((e,t)=>{let r=n[e][t];return null!=r?r:e},t));return r.useEffect(()=>{let e=a(l.current);d.current="mounted"===c?e:"none"},[c]),(0,i.N)(()=>{let t=l.current,n=s.current;if(n!==e){let r=d.current,o=a(t);e?f("MOUNT"):"none"===o||(null==t?void 0:t.display)==="none"?f("UNMOUNT"):n&&r!==o?f("ANIMATION_OUT"):f("UNMOUNT"),s.current=e}},[e,f]),(0,i.N)(()=>{if(o){var e;let t;let n=null!==(e=o.ownerDocument.defaultView)&&void 0!==e?e:window,r=e=>{let r=a(l.current).includes(e.animationName);if(e.target===o&&r&&(f("ANIMATION_END"),!s.current)){let e=o.style.animationFillMode;o.style.animationFillMode="forwards",t=n.setTimeout(()=>{"forwards"===o.style.animationFillMode&&(o.style.animationFillMode=e)})}},i=e=>{e.target===o&&(d.current=a(l.current))};return o.addEventListener("animationstart",i),o.addEventListener("animationcancel",r),o.addEventListener("animationend",r),()=>{n.clearTimeout(t),o.removeEventListener("animationstart",i),o.removeEventListener("animationcancel",r),o.removeEventListener("animationend",r)}}f("ANIMATION_END")},[o,f]),{isPresent:["mounted","unmountSuspended"].includes(c),ref:r.useCallback(e=>{e&&(l.current=getComputedStyle(e)),u(e)},[])}}(t),l="function"==typeof n?n({present:u.isPresent}):r.Children.only(n),s=(0,o.s)(u.ref,function(e){var t,n;let r=null===(t=Object.getOwnPropertyDescriptor(e.props,"ref"))||void 0===t?void 0:t.get,o=r&&"isReactWarning"in r&&r.isReactWarning;return o?e.ref:(o=(r=null===(n=Object.getOwnPropertyDescriptor(e,"ref"))||void 0===n?void 0:n.get)&&"isReactWarning"in r&&r.isReactWarning)?e.props.ref:e.props.ref||e.ref}(l));return"function"==typeof n||u.isPresent?r.cloneElement(l,{ref:s}):null};function a(e){return(null==e?void 0:e.animationName)||"none"}u.displayName="Presence"},877:(e,t,n)=>{n.d(t,{hO:()=>l,sG:()=>a});var r=n(7620),o=n(7509),i=n(1217),u=n(4568),a=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,t)=>{let n=r.forwardRef((e,n)=>{let{asChild:r,...o}=e,a=r?i.DX:t;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,u.jsx)(a,{...o,ref:n})});return n.displayName=`Primitive.${t}`,{...e,[t]:n}},{});function l(e,t){e&&o.flushSync(()=>e.dispatchEvent(t))}},3167:(e,t,n)=>{n.d(t,{c:()=>o});var r=n(7620);function o(e){let t=r.useRef(e);return r.useEffect(()=>{t.current=e}),r.useMemo(()=>(...e)=>t.current?.(...e),[])}},6455:(e,t,n)=>{n.d(t,{i:()=>i});var r=n(7620),o=n(3167);function i({prop:e,defaultProp:t,onChange:n=()=>{}}){let[i,u]=function({defaultProp:e,onChange:t}){let n=r.useState(e),[i]=n,u=r.useRef(i),a=(0,o.c)(t);return r.useEffect(()=>{u.current!==i&&(a(i),u.current=i)},[i,u,a]),n}({defaultProp:t,onChange:n}),a=void 0!==e,l=a?e:i,s=(0,o.c)(n);return[l,r.useCallback(t=>{if(a){let n="function"==typeof t?t(e):t;n!==e&&s(n)}else u(t)},[a,e,u,s])]}},5330:(e,t,n)=>{n.d(t,{N:()=>o});var r=n(7620),o=globalThis?.document?r.useLayoutEffect:()=>{}},3387:()=>{},47:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(6922).A)("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]])},3312:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(6922).A)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])}}]);