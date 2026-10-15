import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'button.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

String _mmss(double s) {
  final t = s.ceil();
  return '${(t ~/ 60).toString().padLeft(2, '0')}:${(t % 60).toString().padLeft(2, '0')}';
}

/// A countdown timer with preset lengths, a ring and start / pause / reset.
class BefTimer extends StatefulWidget {
  const BefTimer({super.key, this.presets = const [1, 5, 10, 25], this.defaultMinutes = 5, this.onDone});
  final List<int> presets;
  final int defaultMinutes;
  final VoidCallback? onDone;

  @override
  State<BefTimer> createState() => _BefTimerState();
}

class _BefTimerState extends State<BefTimer> {
  late int _total = widget.defaultMinutes * 60;
  late double _left = _total.toDouble();
  bool _running = false;
  Timer? _t;
  DateTime? _end;

  void _tick() {
    final l = _end!.difference(DateTime.now()).inMilliseconds / 1000;
    if (l <= 0) {
      _t?.cancel();
      setState(() {
        _left = 0;
        _running = false;
      });
      widget.onDone?.call();
    } else {
      setState(() => _left = l);
    }
  }

  void _toggle() {
    if (_left <= 0) return _choose(_total ~/ 60);
    if (_running) {
      _t?.cancel();
      setState(() => _running = false);
    } else {
      _end = DateTime.now().add(Duration(milliseconds: (_left * 1000).round()));
      _t = Timer.periodic(const Duration(milliseconds: 50), (_) => _tick());
      setState(() => _running = true);
    }
  }

  void _choose(int min) {
    _t?.cancel();
    setState(() {
      _running = false;
      _total = min * 60;
      _left = _total.toDouble();
    });
  }

  @override
  void dispose() {
    _t?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final finished = _left <= 0;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 144,
          height: 144,
          child: Semantics(
            label: _mmss(_left),
            child: Stack(
              alignment: Alignment.center,
              children: [
                CustomPaint(
                  size: const Size(144, 144),
                  painter: _TimerRing(c.secondary, finished ? c.success : c.primary, _left / _total),
                ),
                Text(
                  finished ? 'Done' : _mmss(_left),
                  style: BefText.style(
                    context,
                    size: 30,
                    weight: FontWeight.w600,
                    mono: true,
                  ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 6,
          children: [
            for (final p in widget.presets)
              BefPressable(
                pressScale: 0.95,
                onPressed: () => _choose(p),
                builder: (context, states) => Container(
                  height: 28,
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(BefRadius.full),
                    border: Border.all(color: _total == p * 60 ? c.primary : c.border),
                    color: _total == p * 60 ? c.accent : null,
                  ),
                  child: Text(
                    '$p min',
                    style: BefText.style(
                      context,
                      size: 12,
                      weight: FontWeight.w500,
                      color: _total == p * 60 ? c.accentForeground : c.mutedForeground,
                      height: 1,
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            BefButton(
              leading: BefIcon(_running ? BefIcons.pause : BefIcons.play),
              label: _running ? 'Pause' : (finished ? 'Again' : (_left < _total ? 'Resume' : 'Start')),
              onPressed: _toggle,
            ),
            const SizedBox(width: 8),
            BefButton(
              size: BefButtonSize.icon,
              variant: BefButtonVariant.ghost,
              semanticLabel: 'Reset',
              onPressed: () => _choose(_total ~/ 60),
              child: const BefIcon(BefIcons.refresh),
            ),
          ],
        ),
      ],
    );
  }
}

class _TimerRing extends CustomPainter {
  _TimerRing(this.track, this.color, this.t);
  final Color track, color;
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = (Offset.zero & size).deflate(7 * size.width / 120 / 2 + 3);
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 7 * size.width / 120
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(rect, 0, math.pi * 2, false, p..color = track);
    canvas.drawArc(rect, -math.pi / 2, math.pi * 2 * t.clamp(0, 1), false, p..color = color);
  }

  @override
  bool shouldRepaint(_TimerRing old) => old.t != t || old.color != color;
}
