import 'package:flutter/material.dart';

import 'button.dart';
import 'theme.dart';

/// Draw-your-signature area. Finger, stylus or mouse. [onChanged] gets the strokes (each a list of points) after every stroke, or an empty list after Clear. Turn the strokes into an image yourself if you need a file.
class BefSignaturePad extends StatefulWidget {
  const BefSignaturePad({super.key, this.onChanged, this.height = 160, this.label = 'Sign here'});
  final ValueChanged<List<List<Offset>>>? onChanged;
  final double height;
  final String label;

  @override
  State<BefSignaturePad> createState() => _BefSignaturePadState();
}

class _BefSignaturePadState extends State<BefSignaturePad> {
  final List<List<Offset>> _strokes = [];

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: widget.height,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            color: c.background,
            borderRadius: BorderRadius.circular(BefRadius.lg),
            border: Border.all(color: c.input),
          ),
          child: GestureDetector(
            onPanStart: (d) => setState(() => _strokes.add([d.localPosition])),
            onPanUpdate: (d) => setState(() => _strokes.last.add(d.localPosition)),
            onPanEnd: (_) => widget.onChanged?.call([
              for (final s in _strokes) [...s],
            ]),
            child: CustomPaint(
              painter: _PadPainter(
                _strokes,
                c.foreground,
                c.border,
                c.mutedForeground,
                _strokes.isEmpty ? widget.label : null,
                BefText.style(context, size: 13, color: c.mutedForeground),
              ),
              size: Size.infinite,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Align(
          alignment: Alignment.centerRight,
          child: BefButton(
            label: 'Clear',
            size: BefButtonSize.sm,
            variant: BefButtonVariant.ghost,
            onPressed: _strokes.isEmpty
                ? null
                : () {
                    setState(_strokes.clear);
                    widget.onChanged?.call([]);
                  },
          ),
        ),
      ],
    );
  }
}

class _PadPainter extends CustomPainter {
  _PadPainter(this.strokes, this.ink, this.line, this.muted, this.hint, this.hintStyle);
  final List<List<Offset>> strokes;
  final Color ink, line, muted;
  final String? hint;
  final TextStyle hintStyle;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawLine(
      Offset(16, size.height - 36),
      Offset(size.width - 16, size.height - 36),
      Paint()
        ..color = line
        ..strokeWidth = 1,
    );
    if (hint != null) {
      final tp = TextPainter(
        text: TextSpan(text: hint, style: hintStyle),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset((size.width - tp.width) / 2, size.height - 28));
    }
    final p = Paint()
      ..color = ink
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    for (final s in strokes) {
      if (s.length == 1) {
        canvas.drawCircle(s.first, 1.2, Paint()..color = ink);
        continue;
      }
      final path = Path()..moveTo(s.first.dx, s.first.dy);
      for (var i = 1; i < s.length - 1; i++) {
        final mid = (s[i] + s[i + 1]) / 2;
        path.quadraticBezierTo(s[i].dx, s[i].dy, mid.dx, mid.dy);
      }
      path.lineTo(s.last.dx, s.last.dy);
      canvas.drawPath(path, p);
    }
  }

  @override
  bool shouldRepaint(_PadPainter old) => true;
}
