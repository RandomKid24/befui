import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

String _grouped(double v, int decimals) {
  final fixed = v.toStringAsFixed(decimals);
  final parts = fixed.split('.');
  final d = parts[0];
  String g;
  if (d.length <= 3) {
    g = d;
  } else {
    final head = d.substring(0, d.length - 3);
    g = '${head.replaceAllMapped(RegExp(r'\B(?=(\d{2})+(?!\d))'), (_) => ',')},${d.substring(d.length - 3)}';
  }
  return parts.length > 1 ? '$g.${parts[1]}' : g;
}

/// A number that counts up to [value] when it first appears (Indian digit grouping).
class BefNumberTicker extends StatelessWidget {
  const BefNumberTicker({
    super.key,
    required this.value,
    this.duration = const Duration(milliseconds: 1200),
    this.decimals = 0,
    this.prefix = '',
    this.suffix = '',
    this.style,
  });
  final double value;
  final Duration duration;
  final int decimals;
  final String prefix, suffix;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final s =
        (style ?? BefText.style(context, size: 36, weight: FontWeight.w600, letterSpacing: -0.9, height: 1.1))
            .copyWith(fontFeatures: const [FontFeature.tabularFigures()]);
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: befReduceMotion(context) ? value : 0, end: value),
      duration: duration,
      curve: Curves.easeOutCubic,
      builder: (context, v, _) => Semantics(
        label: '$prefix${_grouped(value, decimals)}$suffix',
        excludeSemantics: true,
        child: Text('$prefix${_grouped(v, decimals)}$suffix', style: s),
      ),
    );
  }
}
