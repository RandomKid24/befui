import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'theme.dart';

class BefLineSeries {
  const BefLineSeries({required this.name, required this.data, this.color});
  final String name;
  final List<double> data;
  final Color? color;
}

/// Multi-series line chart with grid, y-axis labels and a legend. [area] fills under the lines. Touch and drag to read the values at a point. [labels] are the x-axis names, one per data point.
class BefLineChart extends StatefulWidget {
  const BefLineChart({
    super.key,
    required this.series,
    required this.labels,
    this.area = false,
    this.format,
    this.height = 200,
  });
  final List<BefLineSeries> series;
  final List<String> labels;
  final bool area;
  final String Function(double)? format;
  final double height;

  @override
  State<BefLineChart> createState() => _BefLineChartState();
}

class _BefLineChartState extends State<BefLineChart> {
  int? _hover;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final fmt = widget.format ?? (double n) => n.round().toString();
    final colors = [c.primary, c.info, c.success, c.warning];
    final tones = [
      for (var i = 0; i < widget.series.length; i++) widget.series[i].color ?? colors[i % colors.length],
    ];
    final n = widget.labels.length;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: widget.height,
          child: LayoutBuilder(
            builder: (context, box) {
              void touch(Offset p) {
                const l = 40.0, r = 12.0;
                final w = box.maxWidth - l - r;
                final i = n <= 1 ? 0 : ((p.dx - l) / w * (n - 1)).round().clamp(0, n - 1);
                setState(() => _hover = i);
              }

              return GestureDetector(
                onPanStart: (d) => touch(d.localPosition),
                onPanUpdate: (d) => touch(d.localPosition),
                onTapDown: (d) => touch(d.localPosition),
                onPanEnd: (_) => setState(() => _hover = null),
                onTapUp: (_) => Future<void>.delayed(const Duration(seconds: 2), () {
                  if (mounted) setState(() => _hover = null);
                }),
                child: CustomPaint(
                  size: Size(box.maxWidth, widget.height),
                  painter: _LinePainter(
                    series: widget.series,
                    tones: tones,
                    labels: widget.labels,
                    area: widget.area,
                    fmt: fmt,
                    hover: _hover,
                    grid: c.border,
                    text: BefText.style(context, size: 11, color: c.mutedForeground),
                    tipBg: c.popover,
                    tipText: BefText.style(context, size: 11, color: c.popoverForeground),
                    tipBorder: c.border,
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 16,
          runSpacing: 6,
          children: [
            for (var i = 0; i < widget.series.length; i++)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(shape: BoxShape.circle, color: tones[i]),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    widget.series[i].name,
                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                  ),
                ],
              ),
          ],
        ),
      ],
    );
  }
}

double _nice(double max) {
  if (max <= 0) return 1;
  final p = math.pow(10, (math.log(max) / math.ln10).floor()).toDouble();
  final v = (max / p / 2).ceil() * p * 2;
  return v == 0 ? 1 : v;
}

class _LinePainter extends CustomPainter {
  _LinePainter({
    required this.series,
    required this.tones,
    required this.labels,
    required this.area,
    required this.fmt,
    required this.hover,
    required this.grid,
    required this.text,
    required this.tipBg,
    required this.tipText,
    required this.tipBorder,
  });
  final List<BefLineSeries> series;
  final List<Color> tones;
  final List<String> labels;
  final bool area;
  final String Function(double) fmt;
  final int? hover;
  final Color grid, tipBg, tipBorder;
  final TextStyle text, tipText;

  void _text(Canvas canvas, String s, Offset at, TextStyle st, {TextAlign align = TextAlign.left}) {
    final tp = TextPainter(
      text: TextSpan(text: s, style: st),
      textDirection: TextDirection.ltr,
    )..layout();
    final dx = align == TextAlign.right
        ? -tp.width
        : align == TextAlign.center
        ? -tp.width / 2
        : 0;
    tp.paint(canvas, at + Offset(dx.toDouble(), -tp.height / 2));
  }

  @override
  void paint(Canvas canvas, Size size) {
    const l = 40.0, r = 12.0, t = 12.0, b = 26.0;
    final w = size.width - l - r, h = size.height - t - b;
    final top = _nice(series.expand((s) => s.data).fold<double>(0, (m, v) => v > m ? v : m));
    final n = labels.length;
    double x(int i) => l + (n <= 1 ? 0 : i / (n - 1) * w);
    double y(double v) => t + h - v / top * h;
    final gp = Paint()
      ..color = grid
      ..strokeWidth = 1;
    for (var k = 0; k <= 4; k++) {
      final gy = t + h - k / 4 * h;
      canvas.drawLine(Offset(l, gy), Offset(size.width - r, gy), gp);
      _text(canvas, fmt(top * k / 4), Offset(l - 6, gy), text, align: TextAlign.right);
    }
    for (var i = 0; i < n; i++) {
      _text(canvas, labels[i], Offset(x(i), size.height - 8), text, align: TextAlign.center);
    }
    for (var s = 0; s < series.length; s++) {
      final d = series[s].data;
      final path = Path();
      for (var i = 0; i < d.length; i++) {
        final p = Offset(x(i), y(d[i]));
        i == 0 ? path.moveTo(p.dx, p.dy) : path.lineTo(p.dx, p.dy);
      }
      if (area) {
        final fill = Path.from(path)
          ..lineTo(x(d.length - 1), t + h)
          ..lineTo(x(0), t + h)
          ..close();
        canvas.drawPath(
          fill,
          Paint()
            ..shader = LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [tones[s].withValues(alpha: 0.25), tones[s].withValues(alpha: 0)],
            ).createShader(Rect.fromLTWH(l, t, w, h)),
        );
      }
      canvas.drawPath(
        path,
        Paint()
          ..color = tones[s]
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2
          ..strokeJoin = StrokeJoin.round
          ..strokeCap = StrokeCap.round,
      );
    }
    final hv = hover;
    if (hv != null && hv < n) {
      canvas.drawLine(Offset(x(hv), t), Offset(x(hv), t + h), gp..color = grid.withValues(alpha: 0.9));
      for (var s = 0; s < series.length; s++) {
        if (hv >= series[s].data.length) continue;
        canvas.drawCircle(Offset(x(hv), y(series[s].data[hv])), 4, Paint()..color = tipBg);
        canvas.drawCircle(
          Offset(x(hv), y(series[s].data[hv])),
          4,
          Paint()
            ..color = tones[s]
            ..style = PaintingStyle.stroke
            ..strokeWidth = 2,
        );
      }
      final lines = [
        labels[hv],
        for (var s = 0; s < series.length; s++)
          if (hv < series[s].data.length) '${series[s].name}  ${fmt(series[s].data[hv])}',
      ];
      final tps = [
        for (final s in lines)
          TextPainter(
            text: TextSpan(text: s, style: tipText),
            textDirection: TextDirection.ltr,
          )..layout(),
      ];
      final bw = tps.fold<double>(0, (m, p) => p.width > m ? p.width : m) + 16;
      final bh = tps.length * 16.0 + 10;
      var bx = x(hv) + 10;
      if (bx + bw > size.width) bx = x(hv) - 10 - bw;
      final box = RRect.fromRectAndRadius(Rect.fromLTWH(bx, t, bw, bh), const Radius.circular(6));
      canvas.drawRRect(box, Paint()..color = tipBg);
      canvas.drawRRect(
        box,
        Paint()
          ..color = tipBorder
          ..style = PaintingStyle.stroke,
      );
      for (var i = 0; i < tps.length; i++) {
        tps[i].paint(canvas, Offset(bx + 8, t + 5 + i * 16));
      }
    }
  }

  @override
  bool shouldRepaint(_LinePainter o) => true;
}
