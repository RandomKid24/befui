import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'theme.dart';

/// A circular progress indicator with the percentage in the middle. [color] defaults to `primary`.
class BefProgressRing extends StatelessWidget {
  const BefProgressRing({
    super.key,
    required this.value,
    this.size = 96,
    this.stroke = 8,
    this.color,
    this.child,
    this.semanticLabel,
  });
  final double value;
  final double size, stroke;
  final Color? color;
  final Widget? child;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final v = value.clamp(0, 100).toDouble();
    return Semantics(
      label: semanticLabel,
      value: '${v.round()}%',
      child: SizedBox(
        width: size,
        height: size,
        child: Stack(
          alignment: Alignment.center,
          children: [
            TweenAnimationBuilder<double>(
              tween: Tween(end: v / 100),
              duration: const Duration(milliseconds: 700),
              curve: Curves.easeOut,
              builder: (context, t, _) => CustomPaint(
                size: Size(size, size),
                painter: _RingPainter(c.secondary, color ?? c.primary, stroke, t),
              ),
            ),
            child ??
                Text(
                  '${v.round()}%',
                  style: BefText.style(
                    context,
                    size: 18,
                    weight: FontWeight.w600,
                  ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                ),
          ],
        ),
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  _RingPainter(this.track, this.color, this.stroke, this.t);
  final Color track, color;
  final double stroke, t;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = (Offset.zero & size).deflate(stroke / 2);
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(rect, 0, math.pi * 2, false, p..color = track);
    canvas.drawArc(rect, -math.pi / 2, math.pi * 2 * t, false, p..color = color);
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.t != t || old.color != color || old.track != track || old.stroke != stroke;
}
