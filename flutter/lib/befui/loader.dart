import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'theme.dart';

enum BefLoaderVariant { ring, dots, bars, pulse, orbit, dual }

enum BefLoaderSize { sm, md, lg }

/// Six loading animations. They take the `primary` colour unless you pass [color].
class BefLoader extends StatefulWidget {
  const BefLoader({
    super.key,
    this.variant = BefLoaderVariant.ring,
    this.size = BefLoaderSize.md,
    this.color,
    this.label = 'Loading',
  });
  final BefLoaderVariant variant;
  final BefLoaderSize size;
  final Color? color;
  final String label;

  @override
  State<BefLoader> createState() => _BefLoaderState();
}

class _BefLoaderState extends State<BefLoader> with SingleTickerProviderStateMixin {
  late final AnimationController _c;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? context.bef.primary;
    final px = switch (widget.size) {
      BefLoaderSize.sm => 16.0,
      BefLoaderSize.md => 24.0,
      BefLoaderSize.lg => 40.0,
    };
    return Semantics(
      label: widget.label,
      child: SizedBox(
        width: px,
        height: px,
        child: AnimatedBuilder(
          animation: _c,
          builder: (context, _) => CustomPaint(painter: _LoaderPainter(widget.variant, color, _c.value)),
        ),
      ),
    );
  }
}

class _LoaderPainter extends CustomPainter {
  _LoaderPainter(this.v, this.color, this.t);
  final BefLoaderVariant v;
  final Color color;
  final double t;

  double _wave(double phase) => (math.sin((t - phase) * 2 * math.pi) + 1) / 2;

  @override
  void paint(Canvas canvas, Size s) {
    final p = Paint()..color = color;
    final r = Offset.zero & s;
    final stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    switch (v) {
      case BefLoaderVariant.ring:
        canvas.drawArc(r.deflate(1), 0, math.pi * 2, false, stroke..color = color.withValues(alpha: 0.2));
        canvas.drawArc(
          r.deflate(1),
          t * math.pi * 2 - math.pi / 2,
          math.pi / 2,
          false,
          stroke..color = color,
        );
      case BefLoaderVariant.dots:
        for (var i = 0; i < 3; i++) {
          final k = 0.5 + 0.5 * _wave(i * 0.13);
          final d = s.width * 0.28 * k;
          canvas.drawCircle(
            Offset(s.width * (0.14 + i * 0.36), s.height / 2),
            d / 2 + s.width * 0.04,
            p..color = color.withValues(alpha: 0.4 + 0.6 * k),
          );
        }
      case BefLoaderVariant.bars:
        for (var i = 0; i < 4; i++) {
          final h = s.height * (0.35 + 0.65 * _wave(i * 0.1));
          final w = s.width * 0.16;
          canvas.drawRRect(
            RRect.fromRectAndRadius(
              Rect.fromCenter(center: Offset(s.width * (0.08 + i * 0.28), s.height / 2), width: w, height: h),
              Radius.circular(w),
            ),
            p,
          );
        }
      case BefLoaderVariant.pulse:
        for (var i = 0; i < 2; i++) {
          final k = (t + i * 0.5) % 1;
          canvas.drawCircle(
            s.center(Offset.zero),
            s.width / 2 * (0.4 + 0.6 * k),
            stroke..color = color.withValues(alpha: 0.9 * (1 - k)),
          );
        }
        canvas.drawCircle(s.center(Offset.zero), s.width * 0.14, p);
      case BefLoaderVariant.orbit:
        canvas.save();
        canvas.translate(s.width / 2, s.height / 2);
        canvas.rotate(t * math.pi * 2);
        final d = s.width * 0.12;
        canvas.drawCircle(Offset(0, -s.height / 2 + d), d, p);
        canvas.drawCircle(Offset(0, s.height / 2 - d), d, p..color = color.withValues(alpha: 0.5));
        canvas.restore();
      case BefLoaderVariant.dual:
        canvas.drawArc(r.deflate(1), t * math.pi * 2, math.pi * 1.5, false, stroke..color = color);
        canvas.drawArc(
          r.deflate(s.width * 0.22),
          -t * math.pi * 2 * 1.4,
          math.pi * 1.5,
          false,
          stroke..color = color.withValues(alpha: 0.6),
        );
    }
  }

  @override
  bool shouldRepaint(_LoaderPainter old) => old.t != t || old.v != v || old.color != color;
}

/// A thin bar: with [value] (0 to 100) it fills, without it a segment runs back and forth.
class BefBarLoader extends StatefulWidget {
  const BefBarLoader({super.key, this.value});
  final double? value;

  @override
  State<BefBarLoader> createState() => _BefBarLoaderState();
}

class _BefBarLoaderState extends State<BefBarLoader> with SingleTickerProviderStateMixin {
  late final AnimationController _c;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1400));
    if (widget.value == null) _c.repeat();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Semantics(
      label: 'Loading',
      value: widget.value == null ? null : '${widget.value!.round()}%',
      child: Container(
        height: 4,
        width: double.infinity,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          color: c.primary.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(BefRadius.full),
        ),
        child: LayoutBuilder(
          builder: (context, box) {
            final w = box.maxWidth;
            if (widget.value != null) {
              return Align(
                alignment: Alignment.centerLeft,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: w * widget.value!.clamp(0, 100) / 100,
                  decoration: BoxDecoration(
                    color: c.primary,
                    borderRadius: BorderRadius.circular(BefRadius.full),
                  ),
                ),
              );
            }
            return AnimatedBuilder(
              animation: _c,
              builder: (context, _) => Transform.translate(
                offset: Offset(-w * 0.4 + _c.value * w * 1.4, 0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    width: w * 0.4,
                    decoration: BoxDecoration(
                      color: c.primary,
                      borderRadius: BorderRadius.circular(BefRadius.full),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

/// Dims and blurs [child] while [loading], with a loader and an optional [label] on top.
class BefLoadingOverlay extends StatelessWidget {
  const BefLoadingOverlay({
    super.key,
    required this.loading,
    required this.child,
    this.label,
    this.variant = BefLoaderVariant.ring,
  });
  final bool loading;
  final Widget child;
  final String? label;
  final BefLoaderVariant variant;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Stack(
      alignment: Alignment.center,
      children: [
        AnimatedOpacity(
          duration: const Duration(milliseconds: 200),
          opacity: loading ? 0.4 : 1,
          child: IgnorePointer(ignoring: loading, child: child),
        ),
        if (loading)
          Positioned.fill(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                BefLoader(variant: variant, size: BefLoaderSize.lg, label: label ?? 'Loading'),
                if (label != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    label!,
                    style: BefText.style(
                      context,
                      size: 12,
                      weight: FontWeight.w500,
                      color: c.mutedForeground,
                    ),
                  ),
                ],
              ],
            ),
          ),
      ],
    );
  }
}
