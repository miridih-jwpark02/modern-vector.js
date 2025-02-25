class L {
  constructor(t = {}) {
    this.id = "canvas", this.capabilities = {
      maxTextureSize: 4096,
      supportsSVG: !1,
      supportsWebGL: !1,
      supports3D: !1
    }, this.displaySize = { width: 0, height: 0 }, this.options = {
      context: {
        canvas: t.context?.canvas || document.createElement("canvas"),
        contextType: t.context?.contextType || "2d",
        contextAttributes: t.context?.contextAttributes || {}
      },
      antialias: t.antialias ?? !0,
      alpha: t.alpha ?? !0,
      autoClear: t.autoClear ?? !0,
      backgroundColor: t.backgroundColor || "transparent",
      pixelRatio: t.pixelRatio || 1
    }, this.canvas = this.options.context.canvas;
    const e = this.canvas.getContext("2d", {
      alpha: this.options.alpha,
      ...this.options.context.contextAttributes
    });
    if (!e)
      throw new Error("Failed to get 2D context");
    this.context = e, this.options.antialias && (this.context.imageSmoothingEnabled = !0, this.context.imageSmoothingQuality = "high"), this.setSize(this.canvas.width, this.canvas.height);
  }
  /**
   * Canvas element 가져오기
   */
  getCanvas() {
    return this.canvas;
  }
  /**
   * Canvas context 가져오기
   */
  getContext() {
    return this.context;
  }
  /**
   * Canvas 크기 설정
   * @param width - Canvas 너비
   * @param height - Canvas 높이
   */
  setSize(t, e) {
    const s = this.options.pixelRatio;
    this.displaySize = {
      width: t,
      height: e
    }, this.canvas.width = t * s, this.canvas.height = e * s, this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.scale(s, s), this.context.imageSmoothingEnabled = this.options.antialias, this.context.imageSmoothingQuality = "high";
  }
  /**
   * Scene 렌더링
   * @param scene - 렌더링할 Scene
   */
  render(t) {
    this.options.autoClear && this.clear(), this.context.save(), t.root.childNodes.forEach((e) => {
      const s = e;
      this.renderShape(s);
    }), this.context.restore();
  }
  /**
   * Shape 렌더링
   * @param shape - 렌더링할 Shape
   */
  renderShape(t) {
    this.context.save();
    const e = t.transform.values;
    switch (this.context.transform(
      e[0],
      e[3],
      // a, b
      e[1],
      e[4],
      // c, d
      e[2],
      e[5]
      // e, f
    ), t.style.fillColor && (this.context.fillStyle = t.style.fillColor), t.style.strokeColor && (this.context.strokeStyle = t.style.strokeColor), t.style.strokeWidth && (this.context.lineWidth = t.style.strokeWidth), t.style.strokeDashArray && this.context.setLineDash(t.style.strokeDashArray), t.style.strokeDashOffset && (this.context.lineDashOffset = t.style.strokeDashOffset), t.style.strokeLineCap && (this.context.lineCap = t.style.strokeLineCap), t.style.strokeLineJoin && (this.context.lineJoin = t.style.strokeLineJoin), t.style.strokeMiterLimit && (this.context.miterLimit = t.style.strokeMiterLimit), t.style.fillOpacity !== void 0 && (this.context.globalAlpha = t.style.fillOpacity), t.type) {
      case "rectangle":
        this.renderRectangle(t);
        break;
      case "circle":
        this.renderCircle(t);
        break;
      case "line":
        this.renderLine(t);
        break;
      case "path":
        this.renderPath(t);
        break;
      case "text":
        this.renderText(t);
        break;
    }
    this.context.restore();
  }
  /**
   * Rectangle 렌더링
   * @param shape - 렌더링할 Rectangle
   */
  renderRectangle(t) {
    const e = t.bounds;
    t.style.fillColor && this.context.fillRect(e.x, e.y, e.width, e.height), t.style.strokeColor && this.context.strokeRect(e.x, e.y, e.width, e.height);
  }
  /**
   * Circle 렌더링
   * @param shape - 렌더링할 Circle
   */
  renderCircle(t) {
    const e = t.bounds, s = e.x + e.width / 2, i = e.y + e.height / 2, r = e.width / 2;
    this.context.beginPath(), this.context.arc(s, i, r, 0, Math.PI * 2), t.style.fillColor && this.context.fill(), t.style.strokeColor && this.context.stroke();
  }
  /**
   * Line 렌더링
   * @param shape - 렌더링할 Line
   */
  renderLine(t) {
    const e = t.bounds;
    this.context.beginPath(), this.context.moveTo(e.x, e.y), this.context.lineTo(e.x + e.width, e.y + e.height), t.style.strokeColor && this.context.stroke();
  }
  /**
   * Path 렌더링
   * @param shape - 렌더링할 Path
   */
  renderPath(t) {
    t.points && (this.context.beginPath(), t.points.forEach((e, s) => {
      e.type === "move" || s === 0 ? this.context.moveTo(e.x, e.y) : this.context.lineTo(e.x, e.y);
    }), t.style.fillColor && this.context.fill(), t.style.strokeColor && this.context.stroke());
  }
  /**
   * Text 렌더링
   * @param shape - 렌더링할 Text
   */
  renderText(t) {
    if (!t.text) return;
    t.font && t.fontSize && (this.context.font = `${t.fontSize}px ${t.font}`), t.textAlign && (this.context.textAlign = t.textAlign), t.textBaseline && (this.context.textBaseline = t.textBaseline);
    const e = t.bounds;
    t.style.fillColor && this.context.fillText(t.text, e.x, e.y), t.style.strokeColor && this.context.strokeText(t.text, e.x, e.y);
  }
  /**
   * Canvas 클리어
   */
  clear() {
    this.context.save(), this.context.setTransform(1, 0, 0, 1, 0, 0), this.options.backgroundColor === "transparent" ? this.context.clearRect(0, 0, this.canvas.width, this.canvas.height) : (this.context.fillStyle = this.options.backgroundColor, this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)), this.context.restore();
  }
  /**
   * 리소스 정리
   */
  dispose() {
    this.clear(), this.options.context.canvas.parentNode || typeof this.canvas.remove == "function" && this.canvas.remove();
  }
}
class Y {
  constructor(t = {}) {
    this.id = "svg", this.capabilities = {
      maxTextureSize: 1 / 0,
      supportsSVG: !0,
      supportsWebGL: !1,
      supports3D: !1
    }, this.displaySize = { width: 0, height: 0 }, this.svgNS = t.context?.namespace || "http://www.w3.org/2000/svg", this.options = {
      context: {
        svg: t.context?.svg || document.createElementNS(this.svgNS, "svg"),
        namespace: this.svgNS
      },
      antialias: t.antialias ?? !0,
      alpha: t.alpha ?? !0,
      autoClear: t.autoClear ?? !0,
      backgroundColor: t.backgroundColor || "transparent",
      pixelRatio: t.pixelRatio || 1,
      width: t.width || 100,
      height: t.height || 100,
      viewBox: t.viewBox || {
        x: 0,
        y: 0,
        width: t.width || 100,
        height: t.height || 100
      },
      preserveAspectRatio: t.preserveAspectRatio || "xMidYMid meet"
    }, this.svg = this.options.context.svg, this.setSize(this.options.width, this.options.height);
  }
  /**
   * SVG element 가져오기
   */
  getSVG() {
    return this.svg;
  }
  /**
   * SVG 크기 설정
   * @param width - SVG 너비
   * @param height - SVG 높이
   */
  setSize(t, e) {
    const s = this.options.pixelRatio;
    this.displaySize = {
      width: t,
      height: e
    }, this.svg.setAttribute("width", `${t * s}`), this.svg.setAttribute("height", `${e * s}`);
    const i = this.options.viewBox;
    this.svg.setAttribute("viewBox", `${i.x} ${i.y} ${i.width} ${i.height}`), this.svg.setAttribute("preserveAspectRatio", this.options.preserveAspectRatio);
  }
  /**
   * Scene 렌더링
   * @param scene - 렌더링할 Scene
   */
  render(t) {
    this.options.autoClear && this.clear(), t.root.childNodes.forEach((e) => {
      const s = e;
      this.renderShape(s);
    });
  }
  /**
   * Shape 렌더링
   * @param shape - 렌더링할 Shape
   */
  renderShape(t) {
    let e;
    switch (t.type) {
      case "rectangle":
        e = this.renderRectangle(t);
        break;
      case "circle":
        e = this.renderCircle(t);
        break;
      case "line":
        e = this.renderLine(t);
        break;
      case "path":
        e = this.renderPath(t);
        break;
      case "text":
        e = this.renderText(t);
        break;
      default:
        return;
    }
    const s = t.transform.values;
    e.setAttribute("transform", `matrix(${s[0]},${s[1]},${s[3]},${s[4]},${s[2]},${s[5]})`), t.style.fillColor && e.setAttribute("fill", t.style.fillColor), t.style.strokeColor && e.setAttribute("stroke", t.style.strokeColor), t.style.strokeWidth && e.setAttribute("stroke-width", t.style.strokeWidth.toString()), t.style.strokeDashArray && e.setAttribute("stroke-dasharray", t.style.strokeDashArray.join(",")), t.style.strokeDashOffset && e.setAttribute("stroke-dashoffset", t.style.strokeDashOffset.toString()), t.style.strokeLineCap && e.setAttribute("stroke-linecap", t.style.strokeLineCap), t.style.strokeLineJoin && e.setAttribute("stroke-linejoin", t.style.strokeLineJoin), t.style.strokeMiterLimit && e.setAttribute("stroke-miterlimit", t.style.strokeMiterLimit.toString()), t.style.fillOpacity !== void 0 && e.setAttribute("fill-opacity", t.style.fillOpacity.toString()), this.svg.appendChild(e);
  }
  /**
   * Rectangle 렌더링
   * @param shape - 렌더링할 Rectangle
   */
  renderRectangle(t) {
    const e = document.createElementNS(this.svgNS, "rect"), s = t.bounds;
    return e.setAttribute("x", s.x.toString()), e.setAttribute("y", s.y.toString()), e.setAttribute("width", s.width.toString()), e.setAttribute("height", s.height.toString()), e;
  }
  /**
   * Circle 렌더링
   * @param shape - 렌더링할 Circle
   */
  renderCircle(t) {
    const e = document.createElementNS(this.svgNS, "circle"), s = t.bounds, i = s.x + s.width / 2, r = s.y + s.height / 2, n = s.width / 2;
    return e.setAttribute("cx", i.toString()), e.setAttribute("cy", r.toString()), e.setAttribute("r", n.toString()), e;
  }
  /**
   * Line 렌더링
   * @param shape - 렌더링할 Line
   */
  renderLine(t) {
    const e = document.createElementNS(this.svgNS, "line"), s = t.bounds;
    return e.setAttribute("x1", s.x.toString()), e.setAttribute("y1", s.y.toString()), e.setAttribute("x2", (s.x + s.width).toString()), e.setAttribute("y2", (s.y + s.height).toString()), e;
  }
  /**
   * Path 렌더링
   * @param shape - 렌더링할 Path
   */
  renderPath(t) {
    const e = document.createElementNS(this.svgNS, "path");
    if (!t.points) return e;
    let s = "";
    return t.points.forEach((i, r) => {
      i.type === "move" || r === 0 ? s += `M ${i.x} ${i.y}` : s += `L ${i.x} ${i.y}`;
    }), e.setAttribute("d", s), e;
  }
  /**
   * Text 렌더링
   * @param shape - 렌더링할 Text
   */
  renderText(t) {
    const e = document.createElementNS(this.svgNS, "text");
    if (!t.text) return e;
    const s = t.bounds;
    return e.setAttribute("x", s.x.toString()), e.setAttribute("y", s.y.toString()), t.font && e.setAttribute("font-family", t.font), t.fontSize && e.setAttribute("font-size", t.fontSize.toString()), t.textAlign && e.setAttribute("text-anchor", this.getTextAnchor(t.textAlign)), t.textBaseline && e.setAttribute("dominant-baseline", this.getDominantBaseline(t.textBaseline)), e.textContent = t.text, e;
  }
  /**
   * SVG text-anchor 값 가져오기
   * @param textAlign - Text 정렬
   */
  getTextAnchor(t) {
    switch (t) {
      case "center":
        return "middle";
      case "right":
        return "end";
      default:
        return "start";
    }
  }
  /**
   * SVG dominant-baseline 값 가져오기
   * @param textBaseline - Text 기준선
   */
  getDominantBaseline(t) {
    switch (t) {
      case "middle":
        return "central";
      case "bottom":
        return "text-after-edge";
      default:
        return "text-before-edge";
    }
  }
  /**
   * SVG 클리어
   */
  clear() {
    for (; this.svg.firstChild; )
      this.svg.removeChild(this.svg.firstChild);
    if (this.options.backgroundColor !== "transparent") {
      const t = document.createElementNS(this.svgNS, "rect");
      t.setAttribute("x", "0"), t.setAttribute("y", "0"), t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("fill", this.options.backgroundColor), this.svg.appendChild(t);
    }
  }
  /**
   * 리소스 정리
   */
  dispose() {
    this.clear(), this.options.context.svg && !this.options.context.svg.parentNode && this.svg.remove();
  }
}
class a {
  constructor(t, e) {
    this.x = t, this.y = e, this.x = this.x === 0 ? 0 : this.x, this.y = this.y === 0 ? 0 : this.y;
  }
  /**
   * Create a new 2D vector
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns A new Vector2D instance
   */
  static create(t = 0, e = 0) {
    return new a(t, e);
  }
  /**
   * Add another vector to this one
   * @param other - Vector to add
   * @returns A new vector representing the sum
   */
  add(t) {
    return new a(this.x + t.x, this.y + t.y);
  }
  /**
   * Subtract another vector from this one
   * @param other - Vector to subtract
   * @returns A new vector representing the difference
   */
  subtract(t) {
    return new a(this.x - t.x, this.y - t.y);
  }
  /**
   * Scale the vector by a scalar value
   * @param scalar - Scale factor
   * @returns A new scaled vector
   */
  scale(t) {
    return new a(this.x * t, this.y * t);
  }
  /**
   * Calculate the dot product with another vector
   * @param other - Vector to calculate dot product with
   * @returns The dot product value
   */
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  /**
   * Get the length (magnitude) of the vector
   */
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Get a normalized (unit length) version of the vector
   * @returns A new normalized vector
   */
  normalize() {
    const t = this.length;
    return t === 0 ? a.create(0, 0) : this.scale(1 / t);
  }
  /**
   * Calculate the angle between this vector and another
   * @param other - Vector to calculate angle with
   * @returns Angle in radians
   */
  angle(t) {
    const s = this.dot(t) / (this.length * t.length);
    return Math.acos(Math.min(Math.max(s, -1), 1));
  }
  /**
   * Rotate the vector by an angle
   * @param angle - Angle in radians
   * @returns A new rotated vector
   */
  rotate(t) {
    const e = Math.cos(t), s = Math.sin(t);
    return new a(
      this.x * e - this.y * s,
      this.x * s + this.y * e
    );
  }
  /**
   * Get a perpendicular vector
   * @returns A new vector perpendicular to this one
   */
  perpendicular() {
    const t = -this.y === 0 ? 0 : -this.y, e = this.x === 0 ? 0 : this.x;
    return new a(t, e);
  }
  /**
   * Calculate the distance to another vector
   * @param other - Vector to calculate distance to
   * @returns The distance between the vectors
   */
  distanceTo(t) {
    return this.subtract(t).length;
  }
}
class c {
  constructor(t) {
    if (this._values = t, t.length !== 9)
      throw new Error("Matrix3x3 requires exactly 9 values");
  }
  /**
   * Get matrix values
   */
  get values() {
    return [...this._values];
  }
  /**
   * Create a new 3x3 matrix
   * @param values - Optional array of 9 values (row-major order)
   * @returns A new Matrix3x3 instance
   */
  static create(t) {
    return t ? new c([...t]) : new c([
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ]);
  }
  /**
   * Create a translation matrix
   * @param tx - X translation
   * @param ty - Y translation
   * @returns A new translation matrix
   */
  static translation(t, e) {
    return new c([
      1,
      0,
      t,
      0,
      1,
      e,
      0,
      0,
      1
    ]);
  }
  /**
   * Create a rotation matrix
   * @param angle - Rotation angle in radians
   * @returns A new rotation matrix
   */
  static rotation(t) {
    const e = Math.cos(t), s = Math.sin(t);
    return new c([
      e,
      -s,
      0,
      s,
      e,
      0,
      0,
      0,
      1
    ]);
  }
  /**
   * Create a scale matrix
   * @param sx - X scale factor
   * @param sy - Y scale factor
   * @returns A new scale matrix
   */
  static scale(t, e) {
    return new c([
      t,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      1
    ]);
  }
  /**
   * Multiply this matrix with another
   * @param other - Matrix to multiply with
   * @returns A new matrix representing the product
   */
  multiply(t) {
    const e = this._values, s = t._values, i = new Array(9);
    for (let r = 0; r < 3; r++)
      for (let n = 0; n < 3; n++) {
        let h = 0;
        for (let o = 0; o < 3; o++)
          h += e[r * 3 + o] * s[o * 3 + n];
        i[r * 3 + n] = h;
      }
    return new c(i);
  }
  /**
   * Calculate the determinant of this matrix
   * @returns The determinant value
   */
  determinant() {
    const [t, e, s, i, r, n, h, o, l] = this._values;
    return t * (r * l - n * o) - e * (i * l - n * h) + s * (i * o - r * h);
  }
  /**
   * Calculate the inverse of this matrix
   * @returns A new matrix representing the inverse
   * @throws Error if matrix is not invertible
   */
  inverse() {
    const t = this.determinant();
    if (Math.abs(t) < 1e-6)
      throw new Error("Matrix is not invertible");
    const [e, s, i, r, n, h, o, l, g] = this._values, v = n * g - h * l, w = i * l - s * g, b = s * h - i * n, S = h * o - r * g, k = e * g - i * o, _ = i * r - e * h, A = r * l - n * o, p = s * o - e * l, C = e * n - s * r, d = 1 / t;
    return new c([
      v * d,
      w * d,
      b * d,
      S * d,
      k * d,
      _ * d,
      A * d,
      p * d,
      C * d
    ]);
  }
}
class m {
  constructor(t, e = {}) {
    this.id = e.id || crypto.randomUUID(), this.type = t, this.transform = e.transform || c.create(), this.style = e.style || {}, this.scaleOrigin = e.scaleOrigin || "topLeft", this.customScaleOrigin = e.customScaleOriginPoint;
  }
  /**
   * Scale 기준점 설정
   * @param origin - Scale 기준점 ('center', 'topLeft', 'custom')
   * @param point - Custom 기준점일 경우 좌표
   */
  setScaleOrigin(t, e) {
    this.scaleOrigin = t, t === "custom" && e && (this.customScaleOrigin = e);
  }
  /**
   * Scale 기준점 가져오기
   * @returns Scale 기준점 좌표
   */
  getScaleOriginPoint() {
    const t = this.getLocalBounds();
    switch (this.scaleOrigin) {
      case "center":
        return {
          x: t.x + t.width / 2,
          y: t.y + t.height / 2
        };
      case "topLeft":
        return {
          x: t.x,
          y: t.y
        };
      case "custom":
        return this.customScaleOrigin || this.getScaleOriginPoint();
      default:
        return this.getScaleOriginPoint();
    }
  }
  /**
   * 기본 충돌 검사 구현 (Bounds 기반)
   * @param other - 충돌 검사할 다른 Shape
   */
  intersects(t) {
    const e = this.bounds, s = t.bounds;
    return !(s.x > e.x + e.width || s.x + s.width < e.x || s.y > e.y + e.height || s.y + s.height < e.y);
  }
  /**
   * Scale 행렬 추출
   * @param matrix - Scale을 추출할 행렬 (기본값: this.transform)
   */
  getTransformScale(t = this.transform) {
    const e = Math.sqrt(
      t.values[0] * t.values[0] + t.values[1] * t.values[1]
    ), s = Math.sqrt(
      t.values[3] * t.values[3] + t.values[4] * t.values[4]
    );
    return { scaleX: e, scaleY: s };
  }
  /**
   * 지정된 기준점으로 변환 행렬 계산
   * @param matrix - 적용할 변환 행렬
   * @param originX - 기준점 X 좌표
   * @param originY - 기준점 Y 좌표
   */
  getTransformAroundPoint(t, e, s) {
    const i = c.translation(e, s), r = c.translation(-e, -s);
    return i.multiply(t).multiply(r).multiply(this.transform);
  }
}
class y extends m {
  constructor(t = {}) {
    super("rectangle", t), this._x = t.x || 0, this._y = t.y || 0, this._width = t.width || 0, this._height = t.height || 0;
  }
  getLocalBounds() {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    };
  }
  get bounds() {
    const t = [
      a.create(this._x, this._y),
      a.create(this._x + this._width, this._y),
      a.create(this._x + this._width, this._y + this._height),
      a.create(this._x, this._y + this._height)
    ].map((o) => {
      const l = this.transform.multiply(c.translation(o.x, o.y));
      return a.create(l.values[2], l.values[5]);
    }), e = t.map((o) => o.x), s = t.map((o) => o.y), i = Math.min(...e), r = Math.min(...s), n = Math.max(...e), h = Math.max(...s);
    return {
      x: i,
      y: r,
      width: n - i,
      height: h - r
    };
  }
  clone() {
    return new y({
      id: crypto.randomUUID(),
      transform: c.create(this.transform.values),
      style: { ...this.style },
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    });
  }
  applyTransform(t) {
    const e = this.getTransformScale(t);
    if (e.scaleX !== 1 || e.scaleY !== 1) {
      let s;
      switch (this.scaleOrigin) {
        case "center":
          s = {
            x: this._x + this._width / 2,
            y: this._y + this._height / 2
          };
          break;
        case "custom":
          s = this.customScaleOrigin || {
            x: this._x,
            y: this._y
          };
          break;
        default:
          s = {
            x: this._x,
            y: this._y
          };
      }
      return new y({
        id: this.id,
        transform: this.getTransformAroundPoint(t, s.x, s.y),
        style: { ...this.style },
        x: this._x,
        y: this._y,
        width: this._width,
        height: this._height,
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin
      });
    }
    return new y({
      id: this.id,
      transform: t.multiply(this.transform),
      style: { ...this.style },
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
  }
  containsPoint(t) {
    const s = this.transform.inverse().multiply(c.translation(t.x, t.y)), i = s.values[2], r = s.values[5];
    return i >= this._x && i <= this._x + this._width && r >= this._y && r <= this._y + this._height;
  }
  intersects(t) {
    const e = this.bounds, s = t.bounds;
    return !(s.x > e.x + e.width || s.x + s.width < e.x || s.y > e.y + e.height || s.y + s.height < e.y);
  }
  /**
   * Rectangle을 Path로 변환
   * @returns Path points
   */
  toPath() {
    const t = this.bounds;
    return [
      { x: t.x, y: t.y, type: "move" },
      { x: t.x + t.width, y: t.y, type: "line" },
      { x: t.x + t.width, y: t.y + t.height, type: "line" },
      { x: t.x, y: t.y + t.height, type: "line" },
      { x: t.x, y: t.y, type: "line" }
    ];
  }
}
class O {
  create(t) {
    return new y(t);
  }
}
class x extends m {
  constructor(t = {}) {
    super("circle", t), this._centerX = t.centerX || 0, this._centerY = t.centerY || 0, this._radius = t.radius || 0;
  }
  getLocalBounds() {
    return {
      x: this._centerX - this._radius,
      y: this._centerY - this._radius,
      width: this._radius * 2,
      height: this._radius * 2
    };
  }
  get bounds() {
    const t = this.transform.multiply(c.translation(this._centerX, this._centerY)), e = t.values[2], s = t.values[5], { scaleX: i, scaleY: r } = this.getTransformScale(), n = Math.max(i, r) * this._radius;
    return {
      x: e - n,
      y: s - n,
      width: n * 2,
      height: n * 2
    };
  }
  clone() {
    return new x({
      id: crypto.randomUUID(),
      transform: c.create(this.transform.values),
      style: { ...this.style },
      centerX: this._centerX,
      centerY: this._centerY,
      radius: this._radius
    });
  }
  applyTransform(t) {
    const e = this.getTransformScale(t);
    if (e.scaleX !== 1 || e.scaleY !== 1) {
      let s;
      switch (this.scaleOrigin) {
        case "center":
          s = {
            x: this._centerX,
            y: this._centerY
          };
          break;
        case "custom":
          s = this.customScaleOrigin || {
            x: this._centerX - this._radius,
            y: this._centerY - this._radius
          };
          break;
        default:
          s = {
            x: this._centerX - this._radius,
            y: this._centerY - this._radius
          };
      }
      return new x({
        id: this.id,
        transform: this.getTransformAroundPoint(t, s.x, s.y),
        style: { ...this.style },
        centerX: this._centerX,
        centerY: this._centerY,
        radius: this._radius,
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin
      });
    }
    return new x({
      id: this.id,
      transform: t.multiply(this.transform),
      style: { ...this.style },
      centerX: this._centerX,
      centerY: this._centerY,
      radius: this._radius,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
  }
  containsPoint(t) {
    const e = this.transform.multiply(c.translation(this._centerX, this._centerY)), s = e.values[2], i = e.values[5], r = t.x - s, n = t.y - i, h = Math.sqrt(r * r + n * n), { scaleX: o, scaleY: l } = this.getTransformScale(), g = Math.max(o, l) * this._radius;
    return h <= g;
  }
  intersects(t) {
    const e = this.bounds, s = t.bounds;
    return !(s.x > e.x + e.width || s.x + s.width < e.x || s.y > e.y + e.height || s.y + s.height < e.y);
  }
  /**
   * Circle을 Path로 변환
   * @param segments - 원을 근사할 선분의 수 (기본값: 32)
   * @returns Path points
   */
  toPath(t = 32) {
    const e = this.bounds, s = e.x + e.width / 2, i = e.y + e.height / 2, r = e.width / 2, n = [];
    n.push({
      x: s + r,
      y: i,
      type: "move"
    });
    for (let h = 1; h <= t; h++) {
      const o = h * 2 * Math.PI / t;
      n.push({
        x: s + r * Math.cos(o),
        y: i + r * Math.sin(o),
        type: "line"
      });
    }
    return n.push({
      x: s + r,
      y: i,
      type: "line"
    }), n;
  }
}
class E {
  create(t) {
    return new x(t);
  }
}
class $ {
  constructor() {
    this.id = "shape", this.version = "1.0.0", this.dependencies = ["math"], this.factories = /* @__PURE__ */ new Map(), this.registerShape("rectangle", new O()), this.registerShape("circle", new E());
  }
  install(t) {
  }
  uninstall(t) {
    this.factories.clear();
  }
  /**
   * Register a new shape type
   * @param type - Shape type identifier
   * @param factory - Shape factory instance
   */
  registerShape(t, e) {
    if (this.factories.has(t))
      throw new Error(`Shape type '${t}' is already registered`);
    this.factories.set(t, e);
  }
  /**
   * Create a new shape instance
   * @param type - Shape type identifier
   * @param options - Shape creation options
   * @returns New shape instance
   */
  createShape(t, e) {
    const s = this.factories.get(t);
    if (!s)
      throw new Error(`Unknown shape type: ${t}`);
    return s.create(e);
  }
  /**
   * Check if a shape type is registered
   * @param type - Shape type identifier
   * @returns True if the shape type is registered
   */
  hasShape(t) {
    return this.factories.has(t);
  }
}
class M {
  constructor() {
    this.renderers = /* @__PURE__ */ new Map(), this.activeRenderer = null;
  }
  /**
   * Register a new renderer
   * @param renderer - The renderer to register
   */
  register(t) {
    if (this.renderers.has(t.id))
      throw new Error(`Renderer with id ${t.id} is already registered`);
    this.renderers.set(t.id, t), this.activeRenderer || (this.activeRenderer = t);
  }
  /**
   * Set the active renderer
   * @param rendererId - ID of the renderer to set as active
   */
  setActive(t) {
    const e = this.renderers.get(t);
    if (!e)
      throw new Error(`No renderer found with id ${t}`);
    this.activeRenderer = e;
  }
  /**
   * Render a scene using the active renderer
   * @param scene - The scene to render
   */
  render(t) {
    if (!this.activeRenderer)
      throw new Error("No active renderer available");
    this.activeRenderer.render(t);
  }
}
class f {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    this.handlers.has(t) || this.handlers.set(t, /* @__PURE__ */ new Set()), this.handlers.get(t).add(e);
  }
  off(t, e) {
    const s = this.handlers.get(t);
    s && (s.delete(e), s.size === 0 && this.handlers.delete(t));
  }
  emit(t, e) {
    const s = this.handlers.get(t);
    s && s.forEach((i) => i(e));
  }
}
class T extends f {
  constructor() {
    super(...arguments), this.namespaces = /* @__PURE__ */ new Map();
  }
  /**
   * Create a new event namespace
   * @param name - Namespace name
   * @returns A new event emitter for the namespace
   */
  createNamespace(t) {
    return this.namespaces.has(t) || this.namespaces.set(t, new f()), this.namespaces.get(t);
  }
}
class R {
  constructor(t, e) {
    this.engine = t, this.root = document.createElement("div"), this.plugins = /* @__PURE__ */ new Map(), this.eventEmitter = e;
  }
  get renderer() {
    return this.engine.renderer;
  }
  on(t, e) {
    this.eventEmitter.on(t, e);
  }
  off(t, e) {
    this.eventEmitter.off(t, e);
  }
  emit(t, e) {
    this.eventEmitter.emit(t, e);
  }
}
class P {
  constructor(t) {
    this.engine = t, this.scenes = /* @__PURE__ */ new Set(), this.activeScene = null;
  }
  /**
   * Create a new scene
   * @returns The newly created scene
   */
  create() {
    const t = new R(this.engine, this.engine.events.createNamespace("scene"));
    return this.scenes.add(t), this.activeScene || (this.activeScene = t), t;
  }
  /**
   * Get the active scene
   * @returns The active scene
   */
  getActive() {
    if (!this.activeScene)
      throw new Error("No active scene available");
    return this.activeScene;
  }
  /**
   * Set the active scene
   * @param scene - The scene to set as active
   */
  setActive(t) {
    if (!this.scenes.has(t))
      throw new Error("Scene is not managed by this service");
    this.activeScene = t;
  }
}
class N {
  constructor() {
    this.plugins = /* @__PURE__ */ new Map(), this.renderer = new M(), this.events = new T(), this.scene = new P(this);
  }
  /**
   * Install a plugin into the engine
   * @param plugin - The plugin to install
   * @throws Error if plugin dependencies are not met
   */
  use(t) {
    if (t.dependencies) {
      for (const e of t.dependencies)
        if (!this.plugins.has(e))
          throw new Error(`Plugin ${t.id} requires ${e} to be installed first`);
    }
    t.install(this), this.plugins.set(t.id, t);
  }
  /**
   * Remove a plugin from the engine
   * @param pluginId - ID of the plugin to remove
   */
  remove(t) {
    const e = this.plugins.get(t);
    if (e) {
      for (const [s, i] of this.plugins)
        if (i.dependencies?.includes(t))
          throw new Error(`Cannot remove plugin ${t}: plugin ${s} depends on it`);
      e.uninstall(this), this.plugins.delete(t);
    }
  }
  /**
   * Get a plugin by ID
   * @param id - Plugin ID
   * @returns The plugin instance or null if not found
   */
  getPlugin(t) {
    return this.plugins.get(t) || null;
  }
}
export {
  L as CanvasRenderer,
  c as Matrix3x3,
  Y as SVGRenderer,
  $ as ShapePlugin,
  a as Vector2D,
  N as VectorEngine
};
//# sourceMappingURL=modern-vector.js.map
