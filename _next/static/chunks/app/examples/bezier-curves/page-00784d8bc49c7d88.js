(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[941],{1377:(e,t,n)=>{Promise.resolve().then(n.bind(n,4274))},4274:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>p});var r=n(4568),a=n(7620),o=n(5770),s=n.n(o),c=n(6643),l=n(5988),i=n(2339),d=n(3566),h=n(7282),u=n(3437),x=n(9991),g=n(8332),m=n(4295);function p(){let e=(0,a.useRef)(null),t=(0,a.useRef)(null),n=(0,a.useRef)(null),[o,p]=(0,a.useState)("quadratic"),[f,y]=(0,a.useState)("#1d4ed8"),[j,v]=(0,a.useState)(2),[N,b]=(0,a.useState)({width:800,height:500}),[w,M]=(0,a.useState)({start:{x:100,y:250,isDragging:!1},control:{x:400,y:50,isDragging:!1},end:{x:700,y:250,isDragging:!1}}),[C,D]=(0,a.useState)({start:{x:100,y:250,isDragging:!1},control1:{x:250,y:50,isDragging:!1},control2:{x:550,y:450,isDragging:!1},end:{x:700,y:250,isDragging:!1}});(0,a.useEffect)(()=>{if(!e.current)return;let t=new c.G;t.use(new d.A),t.use(new l.r);let r=new i.K({context:{canvas:e.current,contextType:"2d"},antialias:!0,autoClear:!0});return t.renderer.register(r),t.renderer.setActive("canvas"),n.current=t,()=>{n.current}},[]),(0,a.useEffect)(()=>{let e=()=>{t.current&&b({width:t.current.clientWidth,height:Math.min(500,window.innerHeight-200)})};return e(),window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}},[]),(0,a.useEffect)(()=>{if(!n.current)return;let e=n.current,t=e.scene.create(),r=e.getPlugin("shape");if(!r)return;for(;t.root.children.length>0;)t.root.removeChild(t.root.children[0]);let a=r.createShape("path",{points:[],style:{strokeColor:f,strokeWidth:j}});if("quadratic"===o){a.addPoint(w.start.x,w.start.y,"move"),a.addQuadraticCurve(w.control.x,w.control.y,w.end.x,w.end.y);let n=r.createShape("path",{points:[{x:w.start.x,y:w.start.y,type:"move"},{x:w.control.x,y:w.control.y,type:"line"},{x:w.end.x,y:w.end.y,type:"line"}],style:{strokeColor:"#94a3b8",strokeWidth:1,strokeDashArray:[5,5]}}),o=[{x:w.start.x,y:w.start.y},{x:w.control.x,y:w.control.y},{x:w.end.x,y:w.end.y}].map((e,t)=>r.createShape("circle",{centerX:e.x,centerY:e.y,radius:6,style:{fillColor:1===t?"#3b82f6":"#ef4444",strokeColor:"#ffffff",strokeWidth:2}})),s=new h.u("control-lines",e.events.createNamespace("control-lines"));s.data=n,t.root.addChild(s),o.forEach((n,r)=>{let a=new h.u("control-point-".concat(r),e.events.createNamespace("control-point-".concat(r)));a.data=n,t.root.addChild(a)})}else{a.addPoint(C.start.x,C.start.y,"move"),a.addCubicCurve(C.control1.x,C.control1.y,C.control2.x,C.control2.y,C.end.x,C.end.y);let n=r.createShape("path",{points:[{x:C.start.x,y:C.start.y,type:"move"},{x:C.control1.x,y:C.control1.y,type:"line"},{x:C.control2.x,y:C.control2.y,type:"line"},{x:C.end.x,y:C.end.y,type:"line"}],style:{strokeColor:"#94a3b8",strokeWidth:1,strokeDashArray:[5,5]}}),o=[{x:C.start.x,y:C.start.y},{x:C.control1.x,y:C.control1.y},{x:C.control2.x,y:C.control2.y},{x:C.end.x,y:C.end.y}].map((e,t)=>r.createShape("circle",{centerX:e.x,centerY:e.y,radius:6,style:{fillColor:1===t||2===t?"#3b82f6":"#ef4444",strokeColor:"#ffffff",strokeWidth:2}})),s=new h.u("control-lines",e.events.createNamespace("control-lines"));s.data=n,t.root.addChild(s),o.forEach((n,r)=>{let a=new h.u("control-point-".concat(r),e.events.createNamespace("control-point-".concat(r)));a.data=n,t.root.addChild(a)})}let s=new h.u("bezier-curve",e.events.createNamespace("bezier-curve"));s.data=a,t.root.addChild(s);let c=a.bounds,l=r.createShape("rectangle",{x:c.x,y:c.y,width:c.width,height:c.height,style:{strokeColor:"#94a3b8",strokeWidth:1,strokeDashArray:[4,4],fillColor:"transparent"}}),i=new h.u("bounds",e.events.createNamespace("bounds"));i.data=l,t.root.addChild(i),e.renderer.render(t)},[o,f,j,w,C]);let k=()=>{"quadratic"===o?M(e=>({...e,start:{...e.start,isDragging:!1},control:{...e.control,isDragging:!1},end:{...e.end,isDragging:!1}})):D(e=>({...e,start:{...e.start,isDragging:!1},control1:{...e.control1,isDragging:!1},control2:{...e.control2,isDragging:!1},end:{...e.end,isDragging:!1}}))};return(0,r.jsxs)("div",{className:"flex min-h-screen flex-col",children:[(0,r.jsx)("header",{className:"sticky top-0 z-40 w-full border-b bg-background",children:(0,r.jsx)("div",{className:"container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0",children:(0,r.jsxs)("div",{className:"flex gap-6 md:gap-10",children:[(0,r.jsx)(s(),{href:"/",className:"flex items-center space-x-2",children:(0,r.jsx)("span",{className:"inline-block font-bold",children:"Modern Vector.js"})}),(0,r.jsxs)("nav",{className:"flex gap-6",children:[(0,r.jsx)(s(),{href:"/docs",className:"flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",children:"Documentation"}),(0,r.jsx)(s(),{href:"/api-docs",className:"flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",children:"API Reference"}),(0,r.jsx)(s(),{href:"/examples",className:"flex items-center text-sm font-medium text-foreground transition-colors hover:text-foreground",children:"Examples"})]})]})})}),(0,r.jsx)("main",{className:"flex-1 container py-6",children:(0,r.jsxs)("div",{className:"flex flex-col space-y-6",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"베지어 곡선 예제"}),(0,r.jsx)("p",{className:"text-muted-foreground mt-2",children:"Modern Vector.js를 사용하여 2차와 3차 베지어 곡선을 생성하고 조작하는 방법을 보여주는 인터랙티브 예제입니다."})]}),(0,r.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-4 gap-6",children:[(0,r.jsx)(u.Zp,{className:"lg:col-span-3",children:(0,r.jsx)(u.Wu,{className:"p-4",ref:t,children:(0,r.jsx)("canvas",{ref:e,width:N.width,height:N.height,className:"border rounded bg-white dark:bg-gray-800 w-full h-auto cursor-pointer",onMouseDown:t=>{var n;let r=null===(n=e.current)||void 0===n?void 0:n.getBoundingClientRect();if(!r)return;let a=t.clientX-r.left,s=t.clientY-r.top,c=e=>{let t=e.x-a,n=e.y-s;return 10>Math.sqrt(t*t+n*n)};"quadratic"===o?c(w.start)?M(e=>({...e,start:{...e.start,isDragging:!0}})):c(w.control)?M(e=>({...e,control:{...e.control,isDragging:!0}})):c(w.end)&&M(e=>({...e,end:{...e.end,isDragging:!0}})):c(C.start)?D(e=>({...e,start:{...e.start,isDragging:!0}})):c(C.control1)?D(e=>({...e,control1:{...e.control1,isDragging:!0}})):c(C.control2)?D(e=>({...e,control2:{...e.control2,isDragging:!0}})):c(C.end)&&D(e=>({...e,end:{...e.end,isDragging:!0}}))},onMouseMove:t=>{var n;let r=null===(n=e.current)||void 0===n?void 0:n.getBoundingClientRect();if(!r)return;let a=t.clientX-r.left,s=t.clientY-r.top;"quadratic"===o?w.start.isDragging?M(e=>({...e,start:{...e.start,x:a,y:s}})):w.control.isDragging?M(e=>({...e,control:{...e.control,x:a,y:s}})):w.end.isDragging&&M(e=>({...e,end:{...e.end,x:a,y:s}})):C.start.isDragging?D(e=>({...e,start:{...e.start,x:a,y:s}})):C.control1.isDragging?D(e=>({...e,control1:{...e.control1,x:a,y:s}})):C.control2.isDragging?D(e=>({...e,control2:{...e.control2,x:a,y:s}})):C.end.isDragging&&D(e=>({...e,end:{...e.end,x:a,y:s}}))},onMouseUp:k,onMouseLeave:k})})}),(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsxs)(u.Zp,{children:[(0,r.jsx)(u.aR,{children:(0,r.jsx)(u.ZB,{children:"곡선 타입"})}),(0,r.jsx)(u.Wu,{children:(0,r.jsxs)(x.tU,{value:o,onValueChange:e=>p(e),children:[(0,r.jsxs)(x.j7,{className:"w-full grid grid-cols-2",children:[(0,r.jsx)(x.Xi,{value:"quadratic",children:"2차 베지어"}),(0,r.jsx)(x.Xi,{value:"cubic",children:"3차 베지어"})]}),(0,r.jsx)("div",{className:"mt-4",children:(0,r.jsx)("p",{className:"text-sm text-muted-foreground",children:"quadratic"===o?"2차 베지어 곡선은 하나의 제어점을 사용하여 부드러운 곡선을 생성합니다.":"3차 베지어 곡선은 두 개의 제어점을 사용하여 더 복잡하고 유연한 곡선을 생성합니다."})})]})})]}),(0,r.jsxs)(u.Zp,{children:[(0,r.jsx)(u.aR,{children:(0,r.jsx)(u.ZB,{children:"곡선 속성"})}),(0,r.jsxs)(u.Wu,{className:"space-y-4",children:[(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsx)("label",{className:"text-sm font-medium",children:"선 색상"}),(0,r.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,r.jsx)("div",{className:"w-8 h-8 rounded-md border overflow-hidden",children:(0,r.jsx)("input",{type:"color",value:f,onChange:e=>y(e.target.value),className:"w-10 h-10 transform -translate-x-1 -translate-y-1 cursor-pointer"})}),(0,r.jsx)(m.p,{value:f,onChange:e=>y(e.target.value)})]})]}),(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("div",{className:"flex justify-between",children:[(0,r.jsx)("label",{className:"text-sm font-medium",children:"선 두께"}),(0,r.jsxs)("span",{className:"text-sm text-muted-foreground",children:[j,"px"]})]}),(0,r.jsx)(g.A,{min:1,max:10,step:1,value:[j],onValueChange:e=>v(e[0])})]})]})]}),(0,r.jsxs)(u.Zp,{children:[(0,r.jsx)(u.aR,{children:(0,r.jsx)(u.ZB,{children:"코드 예제"})}),(0,r.jsx)(u.Wu,{children:(0,r.jsx)("pre",{className:"bg-muted p-3 rounded-md font-mono text-xs overflow-auto max-h-60",children:(0,r.jsx)("code",{children:"quadratic"===o?"// 2차 베지어 곡선 생성 예제\nconst shapePlugin = engine.getPlugin('shape');\nconst path = shapePlugin.createShape('path', {\n  points: [],\n  style: {\n    strokeColor: '".concat(f,"',\n    strokeWidth: ").concat(j,"\n  }\n});\n\n// 시작점 추가\npath.addPoint(").concat(Math.round(w.start.x),", ").concat(Math.round(w.start.y),", 'move');\n\n// 2차 베지어 곡선 추가\npath.addQuadraticCurve(\n  ").concat(Math.round(w.control.x),", ").concat(Math.round(w.control.y),",\n  ").concat(Math.round(w.end.x),", ").concat(Math.round(w.end.y),'\n);\n\n// SVG path 문자열로 변환\nconst svgPath = path.toSVGPath();\n// 결과: "M').concat(Math.round(w.start.x),",").concat(Math.round(w.start.y)," Q").concat(Math.round(w.control.x),",").concat(Math.round(w.control.y)," ").concat(Math.round(w.end.x),",").concat(Math.round(w.end.y),'"'):"// 3차 베지어 곡선 생성 예제\nconst shapePlugin = engine.getPlugin('shape');\nconst path = shapePlugin.createShape('path', {\n  points: [],\n  style: {\n    strokeColor: '".concat(f,"',\n    strokeWidth: ").concat(j,"\n  }\n});\n\n// 시작점 추가\npath.addPoint(").concat(Math.round(C.start.x),", ").concat(Math.round(C.start.y),", 'move');\n\n// 3차 베지어 곡선 추가\npath.addCubicCurve(\n  ").concat(Math.round(C.control1.x),", ").concat(Math.round(C.control1.y),",\n  ").concat(Math.round(C.control2.x),", ").concat(Math.round(C.control2.y),",\n  ").concat(Math.round(C.end.x),", ").concat(Math.round(C.end.y),'\n);\n\n// SVG path 문자열로 변환\nconst svgPath = path.toSVGPath();\n// 결과: "M').concat(Math.round(C.start.x),",").concat(Math.round(C.start.y)," C").concat(Math.round(C.control1.x),",").concat(Math.round(C.control1.y)," ").concat(Math.round(C.control2.x),",").concat(Math.round(C.control2.y)," ").concat(Math.round(C.end.x),",").concat(Math.round(C.end.y),'"')})})})]})]})]}),(0,r.jsx)(u.Zp,{className:"mt-4",children:(0,r.jsxs)(u.Wu,{className:"p-6",children:[(0,r.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"베지어 곡선 사용하기"}),(0,r.jsx)("p",{className:"mb-4",children:"베지어 곡선은 부드러운 곡선을 생성하는 데 사용되는 매개변수 곡선입니다. Modern Vector.js는 2차와 3차 베지어 곡선을 지원하며, 이를 통해 복잡한 형태의 경로를 만들 수 있습니다."}),(0,r.jsx)("p",{className:"mb-4",children:"위 인터랙티브 데모에서는 다음과 같은 기능을 사용할 수 있습니다:"}),(0,r.jsxs)("ul",{className:"list-disc pl-6 mb-4 space-y-1",children:[(0,r.jsx)("li",{children:"2차 또는 3차 베지어 곡선 선택"}),(0,r.jsx)("li",{children:"제어점을 드래그하여 곡선 모양 조정"}),(0,r.jsx)("li",{children:"선 색상 및 두께 설정"}),(0,r.jsx)("li",{children:"실시간으로 생성되는 코드 예제 확인"})]}),(0,r.jsxs)("p",{children:["베지어 곡선은 SVG path 문자열로도 표현할 수 있으며, Modern Vector.js는 SVG path 문자열과의 상호 변환을 지원합니다. 자세한 내용은 ",(0,r.jsx)(s(),{href:"/docs",className:"text-blue-600 dark:text-blue-400 hover:underline",children:"문서"}),"를 참조하세요."]})]})})]})}),(0,r.jsx)("footer",{className:"border-t py-6 md:py-0",children:(0,r.jsx)("div",{className:"container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row",children:(0,r.jsx)("p",{className:"text-center text-sm leading-loose text-muted-foreground md:text-left",children:"Built with Next.js, Tailwind CSS, and shadcn/ui."})})})]})}},4295:(e,t,n)=>{"use strict";n.d(t,{p:()=>s});var r=n(4568),a=n(7620),o=n(2393);let s=a.forwardRef((e,t)=>{let{className:n,type:a,...s}=e;return(0,r.jsx)("input",{type:a,className:(0,o.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",n),ref:t,...s})});s.displayName="Input"}},e=>{var t=t=>e(e.s=t);e.O(0,[770,846,842,753,587,855,358],()=>t(1377)),_N_E=e.O()}]);