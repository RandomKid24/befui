import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefRadarSeries {
  const BefRadarSeries({required this.name, required this.data, this.color});
  final String name;
  final List<double> data;
  final Color? color;
}

/// Spider chart: one axis per entry in [axes], one filled shape per series, on rings up to [max].
class BefRadarChart extends StatelessWidget {
  const BefRadarChart({super.key, required this.axes, required this.series, this.max = 100, this.size = 240});
  final List<String> axes;
  final List<BefRadarSeries> series;
  final double max, size;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final palette = [c.primary, c.warning, c.success, c.info];
    final tones = [for (var i = 0; i < series.length; i++) series[i].color ?? palette[i % palette.length]];
    return Column(
      children: [
        TweenAnimationBuilder<double>(
          tween: Tween(end: 1),
          duration: befReduceMotion(context) ? Duration.zero : const Duration(milliseconds: 800),
          curve: Curves.easeOutCubic,
          builder: (context, t, _) => SizedBox(
            width: size,
            height: size,
            child: CustomPaint(
              painter: _RadarPainter(
                axes,
                series,
                tones,
                max,
                t,
                c.border,
                BefText.style(context, size: 11, color: c.mutedForeground),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 16,
          runSpacing: 6,
          children: [
            for (var s = 0; s < series.length; s++)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(color: tones[s], shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 6),
                  Text(series[s].name, style: BefText.style(context, size: 12, color: c.mutedForeground)),
                ],
              ),
          ],
        ),
      ],
    );
  }
}

class _RadarPainter extends CustomPainter {
  _RadarPainter(this.axes, this.series, this.tones, this.max, this.t, this.grid, this.text);
  final List<String> axes;
  final List<BefRadarSeries> series;
  final List<Color> tones;
  final double max, t;
  final Color grid;
  final TextStyle text;

  @override
  void paint(Canvas canvas, Size size) {
    final n = axes.length;
    final center = size.center(Offset.zero);
    final r = size.width / 2 - 34;
    Offset at(int i, double f) {
      final a = -math.pi / 2 + i * 2 * math.pi / n;
      return center + Offset(math.cos(a), math.sin(a)) * r * f;
    }

    final line = Paint()
      ..color = grid
      ..style = PaintingStyle.stroke;
    for (var ring = 1; ring <= 4; ring++) {
      final path = Path();
      for (var i = 0; i < n; i++) {
        final p = at(i, ring / 4);
        i == 0 ? path.moveTo(p.dx, p.dy) : path.lineTo(p.dx, p.dy);
      }
      canvas.drawPath(path..close(), line);
    }
    for (var i = 0; i < n; i++) {
      canvas.drawLine(center, at(i, 1), line);
      final tp = TextPainter(
        text: TextSpan(text: axes[i], style: text),
        textDirection: TextDirection.ltr,
      )..layout();
      final p = at(i, 1.18);
      tp.paint(canvas, p - Offset(tp.width / 2, tp.height / 2));
    }
    for (var s = 0; s < series.length; s++) {
      final path = Path();
      for (var i = 0; i < n; i++) {
        final p = at(i, (series[s].data[i] / max).clamp(0, 1) * t);
        i == 0 ? path.moveTo(p.dx, p.dy) : path.lineTo(p.dx, p.dy);
      }
      path.close();
      canvas.drawPath(path, Paint()..color = tones[s].withValues(alpha: 0.18));
      canvas.drawPath(
        path,
        Paint()
          ..color = tones[s]
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2
          ..strokeJoin = StrokeJoin.round,
      );
      for (var i = 0; i < n; i++) {
        canvas.drawCircle(at(i, (series[s].data[i] / max).clamp(0, 1) * t), 3, Paint()..color = tones[s]);
      }
    }
  }

  @override
  bool shouldRepaint(_RadarPainter o) => o.t != t;
}
