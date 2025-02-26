(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[280],{854:(e,n,r)=>{Promise.resolve().then(r.bind(r,1889))},1889:(e,n,r)=>{"use strict";r.r(n),r.d(n,{default:()=>f});var t=r(4568),s=r(7620),a=r(5770),c=r.n(a),l=r(6643),i=r(5988),o=r(2339),d=r(3566),h=r(4122),x=r(7282),p=r(3437),u=r(9991),m=r(8332);function f(){let e=(0,s.useRef)(null),n=(0,s.useRef)(null),r=(0,s.useRef)(null),[a,f]=(0,s.useState)("comparison"),[j,g]=(0,s.useState)(8),[b,C]=(0,s.useState)(!1),[v,P]=(0,s.useState)(!0),[N,w]=(0,s.useState)(100);(0,s.useEffect)(()=>{let t=()=>{if(e.current&&n.current){let{width:t,height:s}=n.current.getBoundingClientRect();if(e.current.width=t,e.current.height=s,r.current){let n=e.current;n.width=t,n.height=s,k()}}};return t(),window.addEventListener("resize",t),()=>{window.removeEventListener("resize",t)}},[]),(0,s.useEffect)(()=>{if(e.current){let n=new l.G;n.use(new d.A),n.use(new i.r);let t=new o.K({context:{canvas:e.current,contextType:"2d"},antialias:!0,autoClear:!0});n.renderer.register(t),n.renderer.setActive("canvas"),r.current=n,k()}return()=>{r.current&&(r.current=null)}},[]),(0,s.useEffect)(()=>{r.current&&k()},[a,j,b,v,N]);let k=()=>{var n,t;if(!r.current)return;let s=r.current,c=(null===(n=e.current)||void 0===n?void 0:n.width)||600,l=(null===(t=e.current)||void 0===t?void 0:t.height)||400,i=c/2,o=l/2,d=s.scene.create(),p=s.getPlugin("shape");if(p){if(d.root&&d.root.children)for(;d.root.children.length>0;)d.root.removeChild(d.root.children[0]);if("circle"===a||"comparison"===a){let e=new h.j({centerX:i-("comparison"===a?N+20:0),centerY:o,radius:N,style:{fillColor:"comparison"===a?"rgba(65, 105, 225, 0.2)":"rgba(65, 105, 225, 0.6)",strokeColor:"royalblue",strokeWidth:2}}),n=new x.u("circle",s.events.createNamespace("circle"));n.data=e,d.root.addChild(n)}if("bezier-path"===a||"comparison"===a){let e=new h.j({centerX:i+("comparison"===a?N+20:0),centerY:o,radius:N}).toPath(j,!0),n=p.createShape("path",{points:e,style:{fillColor:"rgba(220, 20, 60, 0.2)",strokeColor:"crimson",strokeWidth:2}}),r=new x.u("bezier-path",s.events.createNamespace("bezier-path"));r.data=n,d.root.addChild(r),b&&e.forEach((e,n)=>{if("cubic"===e.type&&e.controlPoint1&&e.controlPoint2){let r=new h.j({centerX:e.controlPoint1.x,centerY:e.controlPoint1.y,radius:4,style:{fillColor:"orange",strokeColor:"white",strokeWidth:1}}),t=new x.u("cp1-".concat(n),s.events.createNamespace("cp1-".concat(n)));t.data=r,d.root.addChild(t);let a=new h.j({centerX:e.controlPoint2.x,centerY:e.controlPoint2.y,radius:4,style:{fillColor:"orange",strokeColor:"white",strokeWidth:1}}),c=new x.u("cp2-".concat(n),s.events.createNamespace("cp2-".concat(n)));c.data=a,d.root.addChild(c)}})}if("linear-path"===a||"comparison"===a){let e=new h.j({centerX:i,centerY:o,radius:N}).toPath(j,!1),n=p.createShape("path",{points:e,style:{fillColor:"rgba(50, 205, 50, 0.2)",strokeColor:"limegreen",strokeWidth:2}}),r=new x.u("linear-path",s.events.createNamespace("linear-path"));r.data=n,d.root.addChild(r)}v&&"circle"!==a&&new h.j({centerX:i+("comparison"===a?N+20:0),centerY:o,radius:N}).toPath(j,"bezier-path"===a||"comparison"===a).forEach((e,n)=>{let r=new h.j({centerX:e.x,centerY:e.y,radius:3,style:{fillColor:"white",strokeColor:"black",strokeWidth:1}}),t=new x.u("path-point-".concat(n),s.events.createNamespace("path-point-".concat(n)));t.data=r,d.root.addChild(t)}),s.renderer.render(d)}};return(0,t.jsxs)("div",{className:"flex min-h-screen flex-col",children:[(0,t.jsx)("header",{className:"sticky top-0 z-40 w-full border-b bg-background",children:(0,t.jsx)("div",{className:"container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0",children:(0,t.jsxs)("div",{className:"flex gap-6 md:gap-10",children:[(0,t.jsx)(c(),{href:"/",className:"flex items-center space-x-2",children:(0,t.jsx)("span",{className:"inline-block font-bold",children:"Modern Vector.js"})}),(0,t.jsxs)("nav",{className:"flex gap-6",children:[(0,t.jsx)(c(),{href:"/docs",className:"flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",children:"Documentation"}),(0,t.jsx)(c(),{href:"/examples",className:"flex items-center text-sm font-medium text-foreground transition-colors hover:text-foreground",children:"Examples"})]})]})})}),(0,t.jsx)("main",{className:"flex-1 container py-6",children:(0,t.jsxs)("div",{className:"flex flex-col space-y-8",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"Circle toPath Method"}),(0,t.jsx)("p",{className:"text-muted-foreground mt-2",children:"Circle 클래스의 toPath 메서드를 사용하여 원을 다양한 방식으로 렌더링하는 예제입니다."})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,t.jsx)("div",{className:"lg:col-span-2",children:(0,t.jsxs)(p.Zp,{children:[(0,t.jsxs)(p.aR,{children:[(0,t.jsx)(p.ZB,{children:"렌더링 결과"}),(0,t.jsx)(p.BT,{children:(()=>{switch(a){case"circle":return"일반 Circle 객체를 직접 렌더링합니다. 표준 원 렌더링 방식입니다.";case"bezier-path":return"Circle.toPath(segments, true)를 사용하여 베지어 곡선으로 원을 근사합니다. 4개의 3차 베지어 곡선을 사용하여 정확한 원을 표현합니다.";case"linear-path":return"Circle.toPath(segments, false)를 사용하여 직선 세그먼트로 원을 근사합니다. 세그먼트 수가 많을수록 더 부드러운 원형을 얻을 수 있습니다.";case"comparison":return"세 가지 렌더링 방식을 비교합니다. 파란색: 일반 Circle, 빨간색: 베지어 곡선, 녹색: 직선 세그먼트";default:return""}})()})]}),(0,t.jsx)(p.Wu,{children:(0,t.jsx)("div",{ref:n,className:"w-full h-[400px] border rounded-md bg-slate-50 dark:bg-slate-900 relative",children:(0,t.jsx)("canvas",{ref:e,className:"w-full h-full"})})})]})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)(p.Zp,{children:[(0,t.jsxs)(p.aR,{children:[(0,t.jsx)(p.ZB,{children:"렌더링 설정"}),(0,t.jsx)(p.BT,{children:"원 표시 방법을 변경해보세요"})]}),(0,t.jsxs)(p.Wu,{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("div",{children:"렌더링 모드"}),(0,t.jsx)(u.tU,{defaultValue:a,onValueChange:e=>f(e),children:(0,t.jsxs)(u.j7,{className:"w-full grid grid-cols-2 h-auto",children:[(0,t.jsx)(u.Xi,{value:"circle",children:"Circle"}),(0,t.jsx)(u.Xi,{value:"bezier-path",children:"Bezier"}),(0,t.jsx)(u.Xi,{value:"linear-path",children:"Linear"}),(0,t.jsx)(u.Xi,{value:"comparison",children:"비교"})]})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("div",{children:"반지름"}),(0,t.jsxs)("span",{className:"text-sm text-muted-foreground",children:[N,"px"]})]}),(0,t.jsx)(m.A,{min:20,max:150,step:1,value:[N],onValueChange:e=>w(e[0])})]}),("linear-path"===a||"comparison"===a)&&(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("div",{children:"세그먼트 수"}),(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:j})]}),(0,t.jsx)(m.A,{min:3,max:64,step:1,value:[j],onValueChange:e=>g(e[0])})]}),(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)("input",{type:"checkbox",id:"show-path-points",checked:v,onChange:e=>P(e.target.checked)}),(0,t.jsx)("label",{htmlFor:"show-path-points",children:"경로 포인트 표시"})]}),("bezier-path"===a||"comparison"===a)&&(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)("input",{type:"checkbox",id:"show-control-points",checked:b,onChange:e=>C(e.target.checked)}),(0,t.jsx)("label",{htmlFor:"show-control-points",children:"베지어 제어점 표시"})]})]})]}),(0,t.jsxs)(p.Zp,{className:"mt-6",children:[(0,t.jsxs)(p.aR,{children:[(0,t.jsx)(p.ZB,{children:"코드 예제"}),(0,t.jsx)(p.BT,{children:"현재 설정의 코드 구현 예시"})]}),(0,t.jsx)(p.Wu,{children:(0,t.jsx)("pre",{className:"bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-md text-xs overflow-auto max-h-[300px]",children:(0,t.jsx)("code",{children:"circle"===a?"// 일반 Circle 객체 생성\nconst circle = new Circle({\n  centerX: 300,\n  centerY: 200,\n  radius: ".concat(N,',\n  style: {\n    fillColor: "rgba(65, 105, 225, 0.6)",\n    strokeColor: "royalblue",\n    strokeWidth: 2\n  }\n});\n\n// Scene에 추가\nengine.scene.add({\n  id: "circle",\n  name: "Regular Circle",\n  shape: circle\n});'):"bezier-path"===a?"// Circle 객체 생성\nconst circle = new Circle({\n  centerX: 300,\n  centerY: 200,\n  radius: ".concat(N,'\n});\n\n// toPath 메서드로 베지어 곡선 경로 얻기\nconst pathPoints = circle.toPath(undefined, true);\n// 첫 번째 인자는 세그먼트 수로, 베지어 곡선에서는 무시됨\n// 두 번째 인자 true는 베지어 곡선을 사용하도록 지정\n\n// Path 객체 생성 - ShapePlugin 사용\nconst path = shapePlugin.createShape(\'path\', {\n  points: pathPoints,\n  style: {\n    fillColor: "rgba(220, 20, 60, 0.2)",\n    strokeColor: "crimson",\n    strokeWidth: 2\n  }\n});\n\n// Scene에 추가\nengine.scene.add({\n  id: "bezier-path",\n  name: "Bezier Path Circle",\n  shape: path\n});'):"linear-path"===a?"// Circle 객체 생성\nconst circle = new Circle({\n  centerX: 300,\n  centerY: 200,\n  radius: ".concat(N,"\n});\n\n// toPath 메서드로 선형 세그먼트 경로 얻기\nconst pathPoints = circle.toPath(").concat(j,", false);\n// 첫 번째 인자 ").concat(j,'는 선분의 수를 지정\n// 두 번째 인자 false는 직선 세그먼트를 사용하도록 지정\n\n// Path 객체 생성 - ShapePlugin 사용\nconst path = shapePlugin.createShape(\'path\', {\n  points: pathPoints,\n  style: {\n    fillColor: "rgba(50, 205, 50, 0.2)",\n    strokeColor: "limegreen",\n    strokeWidth: 2\n  }\n});\n\n// Scene에 추가\nengine.scene.add({\n  id: "linear-path",\n  name: "Linear Path Circle",\n  shape: path\n});'):"// 세 가지 방식의 원 렌더링 비교\n// 1. 일반 Circle 객체\nconst circle = new Circle({\n  centerX: 150,\n  centerY: 200,\n  radius: ".concat(N,',\n  style: {\n    fillColor: "rgba(65, 105, 225, 0.2)",\n    strokeColor: "royalblue",\n    strokeWidth: 2\n  }\n});\n\n// 2. 베지어 곡선 경로\nconst bezierCircle = new Circle({\n  centerX: 450,\n  centerY: 200,\n  radius: ').concat(N,'\n});\nconst bezierPathPoints = bezierCircle.toPath(undefined, true);\nconst bezierPath = shapePlugin.createShape(\'path\', {\n  points: bezierPathPoints,\n  style: {\n    fillColor: "rgba(220, 20, 60, 0.2)",\n    strokeColor: "crimson", \n    strokeWidth: 2\n  }\n});\n\n// 3. 선형 세그먼트 경로\nconst linearCircle = new Circle({\n  centerX: 300,\n  centerY: 200,\n  radius: ').concat(N,"\n});\nconst linearPathPoints = linearCircle.toPath(").concat(j,', false);\nconst linearPath = shapePlugin.createShape(\'path\', {\n  points: linearPathPoints,\n  style: {\n    fillColor: "rgba(50, 205, 50, 0.2)",\n    strokeColor: "limegreen",\n    strokeWidth: 2\n  }\n});\n\n// Scene에 모두 추가\nengine.scene.add({ id: "circle", shape: circle });\nengine.scene.add({ id: "bezier-path", shape: bezierPath });\nengine.scene.add({ id: "linear-path", shape: linearPath });')})})})]})]})]}),(0,t.jsxs)(p.Zp,{children:[(0,t.jsxs)(p.aR,{children:[(0,t.jsx)(p.ZB,{children:"Circle.toPath 메서드 설명"}),(0,t.jsx)(p.BT,{children:"원을 Path 객체로 변환하는 방법에 대한 상세 설명"})]}),(0,t.jsxs)(p.Wu,{className:"space-y-4",children:[(0,t.jsxs)("p",{children:[(0,t.jsx)("code",{children:"Circle.toPath()"})," 메서드는 원을 Path 객체로 변환하는 기능을 제공합니다. 이 메서드는 원을 두 가지 방식으로 근사할 수 있습니다:"]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("h3",{className:"font-bold",children:"베지어 곡선 방식 (useBezier = true)"}),(0,t.jsx)("p",{children:"4개의 3차 베지어 곡선을 사용하여 원을 정확하게 표현합니다. 이 방식은 세그먼트 수에 관계없이 항상 정확한 원을 생성합니다. 베지어 곡선 제어점은 수학적으로 정확한 원을 그리기 위해 특별한 계수(0.5522847498)를 사용합니다."}),(0,t.jsx)("pre",{className:"bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 rounded-md text-xs",children:(0,t.jsx)("code",{children:"circle.toPath(undefined, true); // 세그먼트 수 인자는 무시됨"})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("h3",{className:"font-bold",children:"직선 세그먼트 방식 (useBezier = false)"}),(0,t.jsx)("p",{children:"지정된 수의 직선 세그먼트를 사용하여 원을 근사합니다. 세그먼트 수가 많을수록 더 부드러운 원이 생성되지만, 계산 비용이 증가합니다. 이 방식은 성능이 중요하거나 저해상도 렌더링에 유용합니다."}),(0,t.jsx)("pre",{className:"bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 rounded-md text-xs",children:(0,t.jsx)("code",{children:"circle.toPath(32, false); // 32개의 직선 세그먼트로 원 근사"})})]}),(0,t.jsxs)("div",{className:"bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 p-4 rounded-r-md",children:[(0,t.jsx)("h3",{className:"font-bold text-amber-800 dark:text-amber-400",children:"유의사항"}),(0,t.jsx)("p",{className:"text-amber-700 dark:text-amber-300",children:"대부분의 경우 베지어 곡선 방식(useBezier = true)이 권장됩니다. 베지어 곡선 방식은 세그먼트 수에 관계없이 항상 정확한 원을 생성하며, 4개의 곡선 세그먼트만 사용하기 때문에 일반적으로 더 효율적입니다. 직선 세그먼트 방식은 세그먼트 수가 적을 경우 각진 모양이 될 수 있습니다."})]})]})]})]})}),(0,t.jsx)("footer",{className:"border-t py-6 md:py-0",children:(0,t.jsx)("div",{className:"container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row",children:(0,t.jsx)("p",{className:"text-center text-sm leading-loose text-muted-foreground md:text-left",children:"Modern Vector.js - Circle Rendering Example"})})})]})}}},e=>{var n=n=>e(e.s=n);e.O(0,[770,846,842,753,587,855,358],()=>n(854)),_N_E=e.O()}]);