import 'dart:async';

import 'package:flutter/material.dart';

import 'theme.dart';

/// Days, hours, minutes and seconds left until [to]. [onDone] fires once at zero.
class BefCountdown extends StatefulWidget {
  const BefCountdown({super.key, required this.to, this.onDone});
  final DateTime to;
  final VoidCallback? onDone;

  @override
  State<BefCountdown> createState() => _BefCountdownState();
}

class _BefCountdownState extends State<BefCountdown> {
  late Timer _t;
  late Duration _left = _remaining();
  bool _fired = false;

  Duration _remaining() {
    final d = widget.to.difference(DateTime.now());
    return d.isNegative ? Duration.zero : d;
  }

  @override
  void initState() {
    super.initState();
    _t = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() => _left = _remaining());
      if (_left == Duration.zero && !_fired) {
        _fired = true;
        widget.onDone?.call();
      }
    });
  }

  @override
  void dispose() {
    _t.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final parts = [
      ('days', _left.inDays),
      ('hrs', _left.inHours % 24),
      ('min', _left.inMinutes % 60),
      ('sec', _left.inSeconds % 60),
    ];
    return Semantics(
      label: 'Time left: ${_left.inDays} days, ${_left.inHours % 24} hours, ${_left.inMinutes % 60} minutes',
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < parts.length; i++) ...[
            if (i > 0) const SizedBox(width: 12),
            Container(
              width: 64,
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: c.card,
                borderRadius: BorderRadius.circular(BefRadius.lg),
                border: Border.all(color: c.border),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    parts[i].$2.toString().padLeft(2, '0'),
                    style: BefText.style(
                      context,
                      size: 24,
                      weight: FontWeight.w600,
                      height: 1,
                    ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    parts[i].$1.toUpperCase(),
                    style: BefText.style(
                      context,
                      size: 10,
                      weight: FontWeight.w500,
                      color: c.mutedForeground,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
