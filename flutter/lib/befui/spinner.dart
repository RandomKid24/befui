import 'package:flutter/material.dart';

import 'core.dart';

/// A ring that spins. Takes the surrounding text colour like the React `Spinner`; set [color] to override.
class BefSpinner extends StatelessWidget {
  const BefSpinner({
    super.key,
    this.size = 16,
    this.strokeWidth = 2,
    this.color,
  });
  final double size;
  final double strokeWidth;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final c =
        color ??
        DefaultTextStyle.of(context).style.color ??
        IconTheme.of(context).color ??
        const Color(0xFF000000);
    return Semantics(
      label: 'Loading',
      child: BefSpin(
        child: SizedBox(
          width: size,
          height: size,
          child: CustomPaint(painter: _RingPainter(c, strokeWidth)),
        ),
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  _RingPainter(this.color, this.width);
  final Color color;
  final double width;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = width;
    // border-2 border-current border-t-transparent: three quarters of a ring
    canvas.drawArc(rect.deflate(width / 2), 0, 4.71238898, false, paint);
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.color != color || old.width != width;
}
