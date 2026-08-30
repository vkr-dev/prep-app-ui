import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/** Matches the shape returned by public/liquid-glass.js (window.liquidGlass). */
interface LiquidGlassInstance {
  supported: boolean;
  refresh: () => void;
  destroy: () => void;
}

type LiquidGlassFn = (el: Element, opts?: Record<string, number>) => LiquidGlassInstance;

/**
 * Applies the real Apple-style "liquid glass" refraction effect (see
 * public/liquid-glass.js) to the host element - real SVG-displacement
 * refraction in Chromium, automatic frosted-blur fallback in Safari/Firefox
 * (they can't apply SVG filters via backdrop-filter, so they just get the
 * flatter glassmorphism look this app already has everywhere via CSS).
 *
 * Usage: <div class="login-card" appLiquidGlass>...</div>
 */
@Directive({
  selector: '[appLiquidGlass]',
})
export class LiquidGlassDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private instance: LiquidGlassInstance | null = null;

  ngAfterViewInit(): void {
    const liquidGlass = (window as unknown as { liquidGlass?: LiquidGlassFn }).liquidGlass;
    if (typeof liquidGlass === 'function') {
      this.instance = liquidGlass(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
