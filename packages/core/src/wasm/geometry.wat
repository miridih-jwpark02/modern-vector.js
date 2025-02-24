(module
  ;; Memory
  (memory (export "memory") 1)

  ;; Constants
  (global $EPSILON f64 (f64.const 0.0000001))

  ;; Helper functions
  (func $isAlmostEqual (param f64 f64) (result i32)
    (f64.lt 
      (f64.abs 
        (f64.sub 
          (local.get 0) 
          (local.get 1)
        )
      )
      (global.get $EPSILON)
    )
  )

  ;; Line intersection
  (func $lineIntersection 
    (param $x1 f64) (param $y1 f64) 
    (param $x2 f64) (param $y2 f64)
    (param $x3 f64) (param $y3 f64) 
    (param $x4 f64) (param $y4 f64)
    (result f64 f64 i32)
    (local $denominator f64)
    (local $ua f64)
    (local $ub f64)
    (local $x f64)
    (local $y f64)

    ;; Calculate denominator
    (local.set $denominator
      (f64.sub
        (f64.mul
          (f64.sub (local.get $x2) (local.get $x1))
          (f64.sub (local.get $y4) (local.get $y3))
        )
        (f64.mul
          (f64.sub (local.get $y2) (local.get $y1))
          (f64.sub (local.get $x4) (local.get $x3))
        )
      )
    )

    ;; Check if lines are parallel
    (if (call $isAlmostEqual (local.get $denominator) (f64.const 0))
      (then
        (return (f64.const 0) (f64.const 0) (i32.const 0))
      )
    )

    ;; Calculate ua
    (local.set $ua
      (f64.div
        (f64.sub
          (f64.mul
            (f64.sub (local.get $x4) (local.get $x3))
            (f64.sub (local.get $y1) (local.get $y3))
          )
          (f64.mul
            (f64.sub (local.get $y4) (local.get $y3))
            (f64.sub (local.get $x1) (local.get $x3))
          )
        )
        (local.get $denominator)
      )
    )

    ;; Calculate ub
    (local.set $ub
      (f64.div
        (f64.sub
          (f64.mul
            (f64.sub (local.get $x2) (local.get $x1))
            (f64.sub (local.get $y1) (local.get $y3))
          )
          (f64.mul
            (f64.sub (local.get $y2) (local.get $y1))
            (f64.sub (local.get $x1) (local.get $x3))
          )
        )
        (local.get $denominator)
      )
    )

    ;; Check if intersection is within line segments
    (if (i32.or
          (i32.or
            (f64.lt (local.get $ua) (f64.const 0))
            (f64.gt (local.get $ua) (f64.const 1))
          )
          (i32.or
            (f64.lt (local.get $ub) (f64.const 0))
            (f64.gt (local.get $ub) (f64.const 1))
          )
        )
      (then
        (return (f64.const 0) (f64.const 0) (i32.const 0))
      )
    )

    ;; Calculate intersection point
    (local.set $x
      (f64.add
        (local.get $x1)
        (f64.mul
          (local.get $ua)
          (f64.sub (local.get $x2) (local.get $x1))
        )
      )
    )

    (local.set $y
      (f64.add
        (local.get $y1)
        (f64.mul
          (local.get $ua)
          (f64.sub (local.get $y2) (local.get $y1))
        )
      )
    )

    (return (local.get $x) (local.get $y) (i32.const 1))
  )

  ;; Cubic curve subdivision
  (func $subdivideCubicBezier
    (param $t f64)
    (param $x0 f64) (param $y0 f64)
    (param $x1 f64) (param $y1 f64)
    (param $x2 f64) (param $y2 f64)
    (param $x3 f64) (param $y3 f64)
    (result f64 f64 f64 f64 f64 f64 f64 f64)
    (local $u f64)
    (local $x01 f64) (local $y01 f64)
    (local $x12 f64) (local $y12 f64)
    (local $x23 f64) (local $y23 f64)
    (local $x012 f64) (local $y012 f64)
    (local $x123 f64) (local $y123 f64)
    (local $x0123 f64) (local $y0123 f64)

    ;; Calculate u = 1 - t
    (local.set $u
      (f64.sub (f64.const 1) (local.get $t))
    )

    ;; First level
    (local.set $x01
      (f64.add
        (f64.mul (local.get $u) (local.get $x0))
        (f64.mul (local.get $t) (local.get $x1))
      )
    )
    (local.set $y01
      (f64.add
        (f64.mul (local.get $u) (local.get $y0))
        (f64.mul (local.get $t) (local.get $y1))
      )
    )

    (local.set $x12
      (f64.add
        (f64.mul (local.get $u) (local.get $x1))
        (f64.mul (local.get $t) (local.get $x2))
      )
    )
    (local.set $y12
      (f64.add
        (f64.mul (local.get $u) (local.get $y1))
        (f64.mul (local.get $t) (local.get $y2))
      )
    )

    (local.set $x23
      (f64.add
        (f64.mul (local.get $u) (local.get $x2))
        (f64.mul (local.get $t) (local.get $x3))
      )
    )
    (local.set $y23
      (f64.add
        (f64.mul (local.get $u) (local.get $y2))
        (f64.mul (local.get $t) (local.get $y3))
      )
    )

    ;; Second level
    (local.set $x012
      (f64.add
        (f64.mul (local.get $u) (local.get $x01))
        (f64.mul (local.get $t) (local.get $x12))
      )
    )
    (local.set $y012
      (f64.add
        (f64.mul (local.get $u) (local.get $y01))
        (f64.mul (local.get $t) (local.get $y12))
      )
    )

    (local.set $x123
      (f64.add
        (f64.mul (local.get $u) (local.get $x12))
        (f64.mul (local.get $t) (local.get $x23))
      )
    )
    (local.set $y123
      (f64.add
        (f64.mul (local.get $u) (local.get $y12))
        (f64.mul (local.get $t) (local.get $y23))
      )
    )

    ;; Final level
    (local.set $x0123
      (f64.add
        (f64.mul (local.get $u) (local.get $x012))
        (f64.mul (local.get $t) (local.get $x123))
      )
    )
    (local.set $y0123
      (f64.add
        (f64.mul (local.get $u) (local.get $y012))
        (f64.mul (local.get $t) (local.get $y123))
      )
    )

    ;; Return both curves
    (return
      (local.get $x0) (local.get $y0)
      (local.get $x01) (local.get $y01)
      (local.get $x012) (local.get $y012)
      (local.get $x0123) (local.get $y0123)
    )
  )

  ;; Exports
  (export "lineIntersection" (func $lineIntersection))
  (export "subdivideCubicBezier" (func $subdivideCubicBezier))
)