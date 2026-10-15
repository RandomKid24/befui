import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefOrderStep {
  const BefOrderStep({required this.label, this.description, this.time});
  final String label;
  final String? description, time;
}

/// Delivery progress, vertical. Steps before [current] are done, [current] pulses, the rest are upcoming.
class BefOrderTracker extends StatelessWidget {
  const BefOrderTracker({super.key, required this.steps, required this.current});
  final List<BefOrderStep> steps;
  final int current;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Column(
      children: [
        for (var i = 0; i < steps.length; i++)
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  width: 24,
                  child: Column(
                    children: [
                      _dot(c, i),
                      if (i < steps.length - 1)
                        Expanded(child: Container(width: 2, color: i < current ? c.primary : c.border)),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(bottom: i < steps.length - 1 ? 20 : 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          steps[i].label,
                          style: BefText.style(
                            context,
                            weight: FontWeight.w500,
                            color: i <= current ? c.foreground : c.mutedForeground,
                          ),
                        ),
                        if (steps[i].description != null)
                          Text(
                            steps[i].description!,
                            style: BefText.style(context, size: 13, color: c.mutedForeground),
                          ),
                        if (steps[i].time != null)
                          Text(
                            steps[i].time!,
                            style: BefText.style(context, size: 12, color: c.mutedForeground),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _dot(BefColors c, int i) {
    if (i < current) {
      return Container(
        width: 24,
        height: 24,
        decoration: BoxDecoration(shape: BoxShape.circle, color: c.primary),
        child: Center(child: BefIcon(BefIcons.check, size: 14, color: c.primaryForeground, weight: 2.5)),
      );
    }
    if (i == current) return _Pulse(color: c.primary, fg: c.primaryForeground);
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: c.background,
        border: Border.all(color: c.border, width: 2),
      ),
    );
  }
}

class _Pulse extends StatefulWidget {
  const _Pulse({required this.color, required this.fg});
  final Color color, fg;
  @override
  State<_Pulse> createState() => _PulseState();
}

class _PulseState extends State<_Pulse> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1600),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (befReduceMotion(context)) {
      _c.stop();
    } else if (!_c.isAnimating) {
      _c.repeat();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _c,
    builder: (context, _) => Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: widget.color,
        boxShadow: [
          BoxShadow(
            color: widget.color.withValues(alpha: 0.4 * (1 - _c.value)),
            spreadRadius: 6 * _c.value,
          ),
        ],
      ),
      child: Center(
        child: Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(shape: BoxShape.circle, color: widget.fg),
        ),
      ),
    ),
  );
}
