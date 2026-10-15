import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

enum BefGaugeTone { primary, success, warning, danger }

/// Half-circle meter with a needle that swings to the value. The colour follows the value (red, amber, green) unless you pass a [tone].
class BefGauge extends StatelessWidget {
  const BefGauge({super.key, required this.value, this.max = 100, this.label, this.size = 200, this.tone});
  final double value, max, size;
  final String? label;
  final BefGaugeTone? tone;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final pct = (value / max).clamp(0.0, 1.0);
    final t =
        tone ??
        (pct < 0.34
            ? BefGaugeTone.danger
            : pct < 0.67
            ? BefGaugeTone.warning
            : BefGaugeTone.success);
    final color = switch (t) {
      BefGaugeTone.primary => c.primary,
      BefGaugeTone.success => c.success,
      BefGaugeTone.warning => c.warning,
      BefGaugeTone.danger => c.destructive,
    };
    final duration = befReduceMotion(context) ? Duration.zero : const Duration(milliseconds: 1000);
    return Semantics(
      label: label,
      value: '${value.round()} of ${max.round()}',
      child: TweenAnimationBuilder<double>(
        tween: Tween(end: pct),
        duration: duration,
        curve: const Cubic(0.34, 1.3, 0.64, 1),
        builder: (context, p, _) => SizedBox(
          width: size,
          height: size * 0.56,
          child: CustomPaint(painter: _GaugePainter(p, color, c.secondary, c.foreground, c.card)),
        ),
      ),
    );
  }
}

class _GaugePainter extends CustomPainter {
  _GaugePainter(this.p, this.color, this.track, this.needle, this.hub);
  final double p;
  final Color color, track, needle, hub;

  @override
  void paint(Canvas canvas, Size size) {
    final k = size.width / 200;
    canvas.save();
    canvas.scale(k);
    const c = Offset(100, 100);
    final rect = Rect.fromCircle(center: c, radius: 80);
    final stroke = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 14
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(rect, math.pi, math.pi, false, stroke..color = track);
    // the arc is clamped so a tiny value still shows a dot
    canvas.drawArc(rect, math.pi, math.pi * p.clamp(0.0, 1.2), false, stroke..color = color);
    final a = math.pi + math.pi * p;
    final tip = c + Offset(math.cos(a), math.sin(a)) * 62;
    canvas.drawLine(
      c,
      tip,
      Paint()
        ..color = needle
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round,
    );
    canvas.drawCircle(c, 7, Paint()..color = needle);
    canvas.drawCircle(c, 3, Paint()..color = hub);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_GaugePainter o) => o.p != p || o.color != color;
}
