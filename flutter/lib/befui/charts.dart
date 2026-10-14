import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// A tiny trend line with a soft fill. Give it a size with a [SizedBox]; it takes [color] or `primary`.
class BefSparkline extends StatelessWidget {
  const BefSparkline({super.key, required this.data, this.color, this.fill = true});
  final List<double> data;
  final Color? color;
  final bool fill;

  @override
  Widget build(BuildContext context) {
    final col = color ?? context.bef.primary;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: befReduceMotion(context) ? 1 : 0, end: 1),
      duration: const Duration(milliseconds: 900),
      curve: Curves.easeOutCubic,
      builder: (context, t, _) =>
          CustomPaint(size: Size.infinite, painter: _SparkPainter(data, col, fill, t)),
    );
  }
}

class _SparkPainter extends CustomPainter {
  _SparkPainter(this.data, this.color, this.fill, this.t);
  final List<double> data;
  final Color color;
  final bool fill;
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    if (data.length < 2) return;
    final mn = data.reduce((a, b) => a < b ? a : b), mx = data.reduce((a, b) => a > b ? a : b);
    final span = mx == mn ? 1 : mx - mn;
    final pts = [
      for (var i = 0; i < data.length; i++)
        Offset(
          i / (data.length - 1) * size.width,
          size.height - 2 - (data[i] - mn) / span * (size.height - 4),
        ),
    ];
    final line = Path()..moveTo(pts.first.dx, pts.first.dy);
    for (final p in pts.skip(1)) {
      line.lineTo(p.dx, p.dy);
    }
    canvas.save();
    canvas.clipRect(Rect.fromLTWH(0, -4, size.width * t, size.height + 8));
    if (fill) {
      final area = Path.from(line)
        ..lineTo(size.width, size.height)
        ..lineTo(0, size.height)
        ..close();
      canvas.drawPath(
        area,
        Paint()
          ..shader = LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [color.withValues(alpha: 0.25), color.withValues(alpha: 0)],
          ).createShader(Offset.zero & size),
      );
    }
    canvas.drawPath(
      line,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5
        ..strokeJoin = StrokeJoin.round
        ..strokeCap = StrokeCap.round,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(_SparkPainter old) => old.data != data || old.color != color || old.t != t;
}

class BefChartPoint {
  const BefChartPoint(this.label, this.value, {this.color});
  final String label;
  final double value;
  final Color? color;
}

/// Vertical bars with labels underneath. Tap a bar to read its value.
class BefBarChart extends StatefulWidget {
  const BefBarChart({super.key, required this.data, this.height = 160, this.color});
  final List<BefChartPoint> data;
  final double height;
  final Color? color;

  @override
  State<BefBarChart> createState() => _BefBarChartState();
}

class _BefBarChartState extends State<BefBarChart> {
  int? _active;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final col = widget.color ?? c.primary;
    final mx = widget.data.map((d) => d.value).reduce((a, b) => a > b ? a : b);
    return SizedBox(
      height: widget.height,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (var i = 0; i < widget.data.length; i++) ...[
            if (i > 0) const SizedBox(width: 8),
            Expanded(
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () => setState(() => _active = _active == i ? null : i),
                child: Column(
                  children: [
                    Expanded(
                      child: LayoutBuilder(
                        builder: (context, box) {
                          final h = box.maxHeight * widget.data[i].value / (mx == 0 ? 1 : mx);
                          return Stack(
                            alignment: Alignment.bottomCenter,
                            children: [
                              TweenAnimationBuilder<double>(
                                tween: Tween(begin: befReduceMotion(context) ? 1 : 0, end: 1),
                                duration: Duration(milliseconds: 700 + i * 60),
                                curve: Curves.easeOutCubic,
                                builder: (context, t, _) => Container(
                                  height: (h * t).clamp(2, double.infinity),
                                  decoration: BoxDecoration(
                                    color: col.withValues(alpha: _active == null || _active == i ? 0.9 : 0.3),
                                    borderRadius: const BorderRadius.vertical(
                                      top: Radius.circular(BefRadius.md),
                                    ),
                                  ),
                                ),
                              ),
                              if (_active == i)
                                Positioned(
                                  bottom: h + 4,
                                  child: Text(
                                    widget.data[i].value.toStringAsFixed(
                                      widget.data[i].value % 1 == 0 ? 0 : 1,
                                    ),
                                    style: BefText.style(context, size: 11, weight: FontWeight.w500),
                                  ),
                                ),
                            ],
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      widget.data[i].label,
                      style: BefText.style(context, size: 11, color: c.mutedForeground),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

const _palette = [
  Color(0xFF3B82F6),
  Color(0xFF10B981),
  Color(0xFFF59E0B),
  Color(0xFF8B5CF6),
  Color(0xFFF43F5E),
  Color(0xFF06B6D4),
];

/// A ring split by value, with a legend. [center] sits in the hole.
class BefDonutChart extends StatelessWidget {
  const BefDonutChart({super.key, required this.data, this.size = 140, this.thickness = 14, this.center});
  final List<BefChartPoint> data;
  final double size, thickness;
  final Widget? center;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final total = data.fold<double>(0, (s, d) => s + d.value);
    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 24,
      runSpacing: 16,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              TweenAnimationBuilder<double>(
                tween: Tween(begin: befReduceMotion(context) ? 1 : 0, end: 1),
                duration: const Duration(milliseconds: 900),
                curve: Curves.easeOutCubic,
                builder: (context, t, _) => CustomPaint(
                  size: Size(size, size),
                  painter: _DonutPainter(data, total, thickness, c.secondary, t),
                ),
              ),
              ?center,
            ],
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < data.length; i++)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 3),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: data[i].color ?? _palette[i % _palette.length],
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(data[i].label, style: BefText.style(context, size: 13, color: c.mutedForeground)),
                    const SizedBox(width: 12),
                    Text(
                      data[i].value.toStringAsFixed(data[i].value % 1 == 0 ? 0 : 1),
                      style: BefText.style(context, size: 13, weight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ],
    );
  }
}

class _DonutPainter extends CustomPainter {
  _DonutPainter(this.data, this.total, this.thickness, this.track, this.t);
  final List<BefChartPoint> data;
  final double total, thickness, t;
  final Color track;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = (Offset.zero & size).deflate(thickness / 2);
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = thickness;
    canvas.drawArc(rect, 0, 6.283185307, false, p..color = track);
    var start = -1.5707963;
    for (var i = 0; i < data.length; i++) {
      final sweep = data[i].value / (total == 0 ? 1 : total) * 6.283185307;
      final len = (sweep - 2 / (rect.width / 2)).clamp(0, sweep) * t;
      canvas.drawArc(
        rect,
        start,
        len.toDouble(),
        false,
        p..color = data[i].color ?? _palette[i % _palette.length],
      );
      start += sweep;
    }
  }

  @override
  bool shouldRepaint(_DonutPainter old) => old.t != t || old.data != data;
}
