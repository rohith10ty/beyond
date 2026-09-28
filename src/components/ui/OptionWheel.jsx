'use client';

import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';

const DEFAULT_ITEMS = [
  'Tokyo (HND)',
  'Zurich (ZRH)',
  'Malé (MLE)',
  'Paris (CDG)',
  'Dubai (DXB)',
  'Singapore (SIN)',
  'New York (JFK)',
  'London (LHR)',
  'Sydney (SYD)',
  'Milan (MXP)'
];

const OptionWheel = forwardRef(function OptionWheel(
  {
    items = DEFAULT_ITEMS,
    defaultSelected = 0,
    controlledTarget = null,
    onChange,
    textColor = 'rgba(255, 255, 255, 0.35)',
    activeColor = '#ffffff',
    side = 'right',
    fontSize = 2.4,
    spacing = 1.35,
    curve = 1,
    tilt = 6,
    blur = 1.5,
    fade = 0.28,
    minOpacity = 0.05,
    smoothing = 200,
    inset = 40,
    loop = false,
    draggable = true,
    soundUrl = '',
    soundVolume = 0.5,
    className = ''
  },
  ref
) {
  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef(null);
  const dragRef = useRef(null);
  const dragMovedRef = useRef(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef('');
  const lastTickRef = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  const remPx = typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16;

  onChangeRef.current = onChange;
  cfgRef.current = {
    count: items.length,
    items,
    rowH: Math.max(fontSize * spacing * remPx, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    soundUrl,
    soundVolume
  };

  // Direct layout renderer for given position
  const renderLayout = useCallback((pos) => {
    const cfg = cfgRef.current;
    const els = itemRefs.current;
    const n = cfg.count;
    const isCenter = cfg.side === 'center';
    const mirror = cfg.side === 'right' ? -1 : 1;
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;

    for (let i = 0; i < n; i++) {
      const el = els[i];
      if (!el) continue;
      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const dist = Math.abs(d);
      let x = 0;
      let y = d * cfg.rowH;
      let rot = 0;
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        if (!isCenter) {
          x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
          rot = (mirror * ang * 180) / Math.PI;
        }
      }
      
      if (isCenter) {
        el.style.left = "50%";
        el.style.right = "auto";
        el.style.transform = `translate(-50%, calc(${y.toFixed(2)}px - 50%))`;
        el.style.textAlign = "center";
        el.style.transformOrigin = "center center";
      } else if (cfg.side === 'right') {
        el.style.left = "auto";
        el.style.right = "var(--ow-inset)";
        el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
        el.style.textAlign = "right";
        el.style.transformOrigin = "right center";
      } else {
        el.style.left = "var(--ow-inset)";
        el.style.right = "auto";
        el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
        el.style.textAlign = "left";
        el.style.transformOrigin = "left center";
      }
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
    }

    const currentRounded = Math.min(Math.max(Math.round(pos), 0), n - 1);
    if (currentRounded !== selectedRef.current) {
      selectedRef.current = currentRounded;
      setSelectedIndex(currentRounded);
      onChangeRef.current?.(currentRounded, cfg.items[currentRounded]);
    }
  }, []);

  // Single rAF loop that eases the wheel position toward its target with
  // frame-rate independent exponential smoothing
  const runFrame = useCallback(
    (now) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const cfg = cfgRef.current;
      const tau = Math.max(cfg.smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      const target = targetRef.current;
      const cur = posRef.current;
      let next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0005;
      if (settled) next = target;
      posRef.current = next;

      renderLayout(next);

      if (!settled) {
        rafRef.current = requestAnimationFrame(runFrame);
      } else {
        rafRef.current = null;
      }
    },
    [renderLayout]
  );

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  // Sound tick
  const playTick = useCallback(() => {
    const { soundUrl, soundVolume } = cfgRef.current;
    if (!soundUrl) return;
    const now = performance.now();
    if (now - lastTickRef.current < 70) return;
    lastTickRef.current = now;
    if (!audioRef.current || audioUrlRef.current !== soundUrl) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.preload = 'auto';
      audioUrlRef.current = soundUrl;
    }
    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(soundVolume, 0), 1);
    audio.currentTime = 0;
    audio.play()?.catch(() => {});
  }, []);

  const applyTarget = useCallback(
    (value, snap = false) => {
      const cfg = cfgRef.current;
      let v = value;
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
      if (snap) v = Math.round(v);
      targetRef.current = v;
      startLoop();
    },
    [startLoop]
  );

  const setImmediate = useCallback(
    (value) => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const cfg = cfgRef.current;
      let v = value;
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
      targetRef.current = v;
      posRef.current = v;
      renderLayout(v);
    },
    [renderLayout]
  );

  // Expose imperative methods to parent for high-performance zero-lag scroll integration
  useImperativeHandle(
    ref,
    () => ({
      setImmediate,
      setTarget: applyTarget,
      getPosition: () => posRef.current,
      getTarget: () => targetRef.current
    }),
    [setImmediate, applyTarget]
  );

  // Wheel / touchpad scrolling, ONLY enabled if not in controlled mode
  useEffect(() => {
    if (controlledTarget !== null && controlledTarget !== undefined) return;
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const cfg = cfgRef.current;
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [controlledTarget, applyTarget]);

  const handlePointerDown = useCallback((e) => {
    if (!cfgRef.current.draggable) return;
    dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(dy) > 4) {
        dragMovedRef.current = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (dragMovedRef.current) applyTarget(drag.start - dy / cfgRef.current.rowH, false);
    },
    [applyTarget]
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleItemClick = useCallback(
    (index) => {
      if (dragMovedRef.current) return;
      const cfg = cfgRef.current;
      const cur = targetRef.current;
      let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
      if (cfg.loop && cfg.count > 1) {
        if (d > cfg.count / 2) d -= cfg.count;
        else if (d < -cfg.count / 2) d += cfg.count;
      }
      applyTarget(cur + d, true);
    },
    [applyTarget]
  );

  const handleKeyDown = useCallback(
    (e) => {
      let delta = null;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
      if (delta == null) return;
      e.preventDefault();
      applyTarget(Math.round(targetRef.current) + delta, true);
    },
    [applyTarget]
  );

  // Initial layout render
  useEffect(() => {
    renderLayout(posRef.current);
  }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, renderLayout]);

  useEffect(() => {
    if (controlledTarget !== null && controlledTarget !== undefined) {
      setImmediate(controlledTarget);
    }
  }, [controlledTarget, setImmediate]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      audioRef.current?.pause();
    },
    []
  );

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Option wheel"
      className={`relative h-full w-full select-none overflow-hidden outline-none ${
        draggable ? '[touch-action:none]' : '[touch-action:pan-y] pointer-events-none'
      } ${
        isDragging ? 'cursor-grabbing' : draggable ? 'cursor-grab' : 'cursor-default'
      }${className ? ` ${className}` : ''}`}
      style={{
        '--ow-text-color': textColor,
        '--ow-active-color': activeColor,
        '--ow-font-size': `${fontSize}rem`,
        '--ow-inset': `${inset}px`
      }}
      onPointerDown={draggable ? handlePointerDown : undefined}
      onPointerMove={draggable ? handlePointerMove : undefined}
      onPointerUp={draggable ? handlePointerEnd : undefined}
      onPointerCancel={draggable ? handlePointerEnd : undefined}
      onKeyDown={draggable ? handleKeyDown : undefined}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          role="option"
          aria-selected={selectedIndex === index}
          className={`absolute top-1/2 cursor-pointer whitespace-nowrap leading-none will-change-[transform,opacity,filter] [font-size:var(--ow-font-size)] [color:color-mix(in_srgb,var(--ow-active-color)_calc(var(--ow-p,0)*100%),var(--ow-text-color))] ${
            selectedIndex === index
              ? 'font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]'
              : 'font-light tracking-normal'
          }`}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
});

export default OptionWheel;
