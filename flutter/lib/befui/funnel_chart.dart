import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefFunnelStage {
  const BefFunnelStage(this.label, this.value);
  final String label;
  final double value;
}

/// Conversion funnel: each stage is a bar as wide as its value, with the share of the first stage and the drop from the previous one.
class BefFunnelChart extends StatelessWidget {
  const BefFunnelChart({super.key, required this.stages});
  final List<BefFunnelStage> stages;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final first = stages.first.value == 0 ? 1.0 : stages.first.value;
    final dur = befReduceMotion(context) ? Duration.zero : const Duration(milliseconds: 700);
    return Column(
      children: [
        for (var i = 0; i < stages.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                SizedBox(
                  width: 84,
                  child: Text(
                    stages[i].label,
                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                  ),
                ),
                Expanded(
                  child: TweenAnimationBuilder<double>(
                    tween: Tween(end: stages[i].value / first),
                    duration: dur,
                    curve: Curves.easeOutCubic,
                    builder: (context, t, _) => Align(
                      alignment: Alignment.center,
                      child: FractionallySizedBox(
                        widthFactor: t.clamp(0.04, 1.0),
                        child: Container(
                          height: 30,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: c.primary.withValues(alpha: 1 - i * (0.55 / stages.length)),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            stages[i].value.round().toString(),
                            style: BefText.style(
                              context,
                              size: 12,
                              weight: FontWeight.w600,
                              color: c.primaryForeground,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                SizedBox(
                  width: 64,
                  child: Text(
                    i == 0
                        ? '100%'
                        : '${(stages[i].value / first * 100).round()}%  ·  -${((1 - stages[i].value / (stages[i - 1].value == 0 ? 1 : stages[i - 1].value)) * 100).round()}%',
                    textAlign: TextAlign.right,
                    style: BefText.style(context, size: 11, color: c.mutedForeground),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
