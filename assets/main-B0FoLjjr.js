(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const l={"basic-shapes":{title:"기본 도형",description:"사각형, 원, 선, 다각형 등 기본 도형 그리기",code:`// Canvas 요소 가져오기
const canvas = document.getElementById('canvas');
const engine = new VectorEngine();

// 렌더러 설정
engine.use(CanvasRendererPlugin);

// 도형 생성
const rect = engine.scene.createRect({
  x: 50,
  y: 50,
  width: 100,
  height: 80,
  fill: '#3498db',
  stroke: '#2980b9',
  strokeWidth: 2
});

const circle = engine.scene.createCircle({
  x: 250,
  y: 100,
  radius: 50,
  fill: '#e74c3c',
  stroke: '#c0392b',
  strokeWidth: 2
});

const line = engine.scene.createLine({
  x1: 50,
  y1: 200,
  x2: 350,
  y2: 200,
  stroke: '#2ecc71',
  strokeWidth: 3
});

// 렌더링
engine.renderer.render();`,setupFunction:"setupBasicShapes"},transformations:{title:"변환",description:"이동, 회전, 크기 조절 등 변환 적용하기",code:`// Canvas 요소 가져오기
const canvas = document.getElementById('canvas');
const engine = new VectorEngine();

// 렌더러 설정
engine.use(CanvasRendererPlugin);

// 도형 생성
const rect = engine.scene.createRect({
  x: 150,
  y: 100,
  width: 100,
  height: 80,
  fill: '#3498db'
});

// 변환 적용
rect.translate(50, 0);
rect.rotate(45);
rect.scale(1.5, 1);

// 렌더링
engine.renderer.render();`,setupFunction:"setupTransformations"},"path-operations":{title:"패스 연산",description:"합집합, 교집합, 차집합 등 패스 연산",code:`// Canvas 요소 가져오기
const canvas = document.getElementById('canvas');
const engine = new VectorEngine();

// 렌더러 및 패스 연산 플러그인 설정
engine.use(CanvasRendererPlugin);
engine.use(PathOperationsPlugin);

// 도형 생성
const circle1 = engine.scene.createCircle({
  x: 120,
  y: 100,
  radius: 60,
  fill: 'rgba(52, 152, 219, 0.7)'
});

const circle2 = engine.scene.createCircle({
  x: 180,
  y: 100,
  radius: 60,
  fill: 'rgba(231, 76, 60, 0.7)'
});

// 패스 연산
const union = engine.scene.pathOp.union(circle1, circle2);
union.fill = '#2ecc71';
union.translate(0, 150);

// 렌더링
engine.renderer.render();`,setupFunction:"setupPathOperations"},"svg-renderer":{title:"SVG 렌더러",description:"SVG 렌더링 엔진을 사용한 벡터 그래픽",code:`// SVG 요소 가져오기
const svgContainer = document.getElementById('svg-container');
const engine = new VectorEngine();

// SVG 렌더러 설정
engine.use(SVGRendererPlugin);

// 도형 생성
const rect = engine.scene.createRect({
  x: 50,
  y: 50,
  width: 100,
  height: 80,
  fill: '#3498db',
  rx: 10,
  ry: 10
});

const circle = engine.scene.createCircle({
  x: 250,
  y: 100,
  radius: 50,
  fill: 'url(#gradient)'
});

// 그라디언트 정의
const gradient = engine.renderer.createLinearGradient({
  id: 'gradient',
  x1: 0,
  y1: 0,
  x2: 1,
  y2: 1,
  stops: [
    { offset: 0, color: '#e74c3c' },
    { offset: 1, color: '#f39c12' }
  ]
});

// 렌더링
engine.renderer.render();`,setupFunction:"setupSVGRenderer"}};function v(){console.log("예제 데이터 로드됨:",Object.keys(l).length)}function d(n){return l[n]}function w(){return l}class y{constructor(){this.renderers=new Map,this.activeRenderer=null}register(e){if(this.renderers.has(e.id))throw new Error(`Renderer with id ${e.id} is already registered`);this.renderers.set(e.id,e),this.activeRenderer||(this.activeRenderer=e)}setActive(e){const t=this.renderers.get(e);if(!t)throw new Error(`No renderer found with id ${e}`);this.activeRenderer=t}render(e){if(!this.activeRenderer)throw new Error("No active renderer available");this.activeRenderer.render(e)}}class h{constructor(){this.handlers=new Map}on(e,t){this.handlers.has(e)||this.handlers.set(e,new Set),this.handlers.get(e).add(t)}off(e,t){const s=this.handlers.get(e);s&&(s.delete(t),s.size===0&&this.handlers.delete(e))}emit(e,t){const s=this.handlers.get(e);s&&s.forEach(i=>i(t))}}class x extends h{constructor(){super(...arguments),this.namespaces=new Map}createNamespace(e){return this.namespaces.has(e)||this.namespaces.set(e,new h),this.namespaces.get(e)}}class E{constructor(e,t){this.engine=e,this.root=document.createElement("div"),this.plugins=new Map,this.eventEmitter=t}get renderer(){return this.engine.renderer}on(e,t){this.eventEmitter.on(e,t)}off(e,t){this.eventEmitter.off(e,t)}emit(e,t){this.eventEmitter.emit(e,t)}}class C{constructor(e){this.engine=e,this.scenes=new Set,this.activeScene=null}create(){const e=new E(this.engine,this.engine.events.createNamespace("scene"));return this.scenes.add(e),this.activeScene||(this.activeScene=e),e}getActive(){if(!this.activeScene)throw new Error("No active scene available");return this.activeScene}setActive(e){if(!this.scenes.has(e))throw new Error("Scene is not managed by this service");this.activeScene=e}}class o{constructor(){this.plugins=new Map,this.renderer=new y,this.events=new x,this.scene=new C(this)}use(e){if(e.dependencies){for(const t of e.dependencies)if(!this.plugins.has(t))throw new Error(`Plugin ${e.id} requires ${t} to be installed first`)}e.install(this),this.plugins.set(e.id,e)}remove(e){var s;const t=this.plugins.get(e);if(t){for(const[i,r]of this.plugins)if((s=r.dependencies)!=null&&s.includes(e))throw new Error(`Cannot remove plugin ${e}: plugin ${i} depends on it`);t.uninstall(this),this.plugins.delete(e)}}getPlugin(e){return this.plugins.get(e)||null}}const a={id:"canvas-renderer",dependencies:[],install(n){console.log("Canvas 렌더러 플러그인 설치됨")},uninstall(n){console.log("Canvas 렌더러 플러그인 제거됨")}},b={id:"svg-renderer",dependencies:[],install(n){console.log("SVG 렌더러 플러그인 설치됨")},uninstall(n){console.log("SVG 렌더러 플러그인 제거됨")}},S={id:"path-operations",dependencies:[],install(n){console.log("패스 연산 플러그인 설치됨"),n.scene.pathOp={union:(e,t)=>(console.log("합집합 연산 수행"),e),intersect:(e,t)=>(console.log("교집합 연산 수행"),e),subtract:(e,t)=>(console.log("차집합 연산 수행"),e)}},uninstall(n){console.log("패스 연산 플러그인 제거됨"),delete n.scene.pathOp}},p={setupBasicShapes:n=>{const e=document.createElement("canvas");e.width=n.clientWidth,e.height=n.clientHeight,n.appendChild(e);const t=new o;t.use(a),t.scene.createRect({x:50,y:50,width:100,height:80,fill:"#3498db",stroke:"#2980b9",strokeWidth:2}),t.scene.createCircle({x:250,y:100,radius:50,fill:"#e74c3c",stroke:"#c0392b",strokeWidth:2}),t.scene.createLine({x1:50,y1:200,x2:350,y2:200,stroke:"#2ecc71",strokeWidth:3}),t.renderer.render()},setupTransformations:n=>{const e=document.createElement("canvas");e.width=n.clientWidth,e.height=n.clientHeight,n.appendChild(e);const t=new o;t.use(a);const s=t.scene.createRect({x:150,y:100,width:100,height:80,fill:"#3498db"});s.translate(50,0),s.rotate(45),s.scale(1.5,1),t.renderer.render()},setupPathOperations:n=>{const e=document.createElement("canvas");e.width=n.clientWidth,e.height=n.clientHeight,n.appendChild(e);const t=new o;t.use(a),t.use(S);const s=t.scene.createCircle({x:120,y:100,radius:60,fill:"rgba(52, 152, 219, 0.7)"}),i=t.scene.createCircle({x:180,y:100,radius:60,fill:"rgba(231, 76, 60, 0.7)"});if(t.scene.pathOp){const r=t.scene.pathOp.union(s,i);r.fill="#2ecc71",r.translate(0,150)}t.renderer.render()},setupSVGRenderer:n=>{const e=document.createElement("div");e.style.width="100%",e.style.height="100%",n.appendChild(e);const t=new o;t.use(b);const s=t.renderer.createLinearGradient({id:"gradient",x1:0,y1:0,x2:1,y2:1,stops:[{offset:0,color:"#e74c3c"},{offset:1,color:"#f39c12"}]});t.scene.createRect({x:50,y:50,width:100,height:80,fill:"#3498db",rx:10,ry:10}),t.scene.createCircle({x:250,y:100,radius:50,fill:`url(#${s})`}),t.renderer.render()}};function L(n,e){const t=d(n);if(!t)return;const s=p[t.setupFunction];s&&s(e)}function R(n,e){const t=d(n);if(!t)return;const s=p[t.setupFunction];s&&s(e)}function I(){document.querySelectorAll('[data-action="view-example"]').forEach(s=>{s.addEventListener("click",i=>{i.preventDefault();const r=s.dataset.target;r&&m(r)})});const n=document.getElementById("back-to-examples");n&&n.addEventListener("click",()=>{f()});const e=document.querySelector(".close-modal");e&&e.addEventListener("click",()=>{g()});const t=document.getElementById("modal");t&&t.addEventListener("click",s=>{s.target===t&&g()}),window.addEventListener("hashchange",u),u()}function u(){var e;const n=window.location.hash.substring(1);if(n.startsWith("example-")){const t=n.substring(8);m(t)}else n==="examples"&&(f(),(e=document.getElementById("examples"))==null||e.scrollIntoView({behavior:"smooth"}))}function m(n){const e=d(n);if(!e)return;const t=document.getElementById("example-title");t&&(t.textContent=e.title);const s=document.getElementById("example-code");s&&(s.textContent=e.code);const i=document.getElementById("example-canvas");i&&(i.innerHTML="",L(n,i));const r=document.getElementById("examples"),c=document.getElementById("example-viewer");r&&r.classList.add("hidden"),c&&c.classList.remove("hidden"),window.location.hash=`example-${n}`}function f(){const n=document.getElementById("examples"),e=document.getElementById("example-viewer");n&&n.classList.remove("hidden"),e&&e.classList.add("hidden"),window.location.hash="examples"}function g(){const n=document.getElementById("modal");n&&(n.style.display="none")}function P(){const n=w();Object.keys(n).forEach(e=>{const t=document.getElementById(`${e}-preview`);t&&R(e,t)})}document.addEventListener("DOMContentLoaded",()=>{v(),I(),P(),console.log("Modern Vector.js 문서 사이트가 초기화되었습니다.")});
