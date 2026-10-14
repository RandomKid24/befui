import 'package:flutter/material.dart';

import 'theme.dart';

enum BefProgressTone { primary, success, warning, danger }

/// A thin progress bar. [value] is 0 to 100.
class BefProgress extends StatelessWidget {
  const BefProgress({
    super.key,
    required this.value,
    this.tone = BefProgressTone.primary,
    this.semanticLabel,
  });
  final double value;
  final BefProgressTone tone;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final color = switch (tone) {
      BefProgressTone.primary => c.primary,
      BefProgressTone.success => c.success,
      BefProgressTone.warning => c.warning,
      BefProgressTone.danger => c.destructive,
    };
    final v = value.clamp(0, 100) / 100;
    return Semantics(
      label: semanticLabel,
      value: '${(v * 100).round()}%',
      child: Container(
        height: 6,
        width: double.infinity,
        decoration: BoxDecoration(color: c.secondary, borderRadius: BorderRadius.circular(BefRadius.full)),
        clipBehavior: Clip.antiAlias,
        alignment: Alignment.centerLeft,
        child: TweenAnimationBuilder<double>(
          tween: Tween(end: v),
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeOut,
          builder: (context, t, _) => FractionallySizedBox(
            widthFactor: t,
            child: Container(
              decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(BefRadius.full)),
            ),
          ),
        ),
      ),
    );
  }
}
