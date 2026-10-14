import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

class BefStep {
  const BefStep({required this.title, this.description});
  final String title;
  final String? description;
}

/// A row of numbered steps. Steps before [current] show a check, [current] is highlighted.
class BefStepper extends StatelessWidget {
  const BefStepper({super.key, required this.steps, required this.current});
  final List<BefStep> steps;
  final int current;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < steps.length; i++) ...[
          _step(context, c, i),
          if (i < steps.length - 1)
            Expanded(
              child: Container(
                margin: const EdgeInsets.only(top: 14, left: 8, right: 8),
                height: 2,
                decoration: BoxDecoration(
                  color: i < current ? c.primary : c.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
        ],
      ],
    );
  }

  Widget _step(BuildContext context, BefColors c, int i) {
    final done = i < current, active = i == current;
    final s = steps[i];
    return Semantics(
      label:
          '${s.title}, step ${i + 1} of ${steps.length}${done
              ? ', done'
              : active
              ? ', current'
              : ''}',
      child: Column(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: 28,
            height: 28,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: done ? c.primary : (active ? c.accent : c.background),
              border: Border.all(color: done || active ? c.primary : c.border),
              boxShadow: active
                  ? [BoxShadow(color: c.primary.withValues(alpha: 0.1), spreadRadius: 4)]
                  : null,
            ),
            child: done
                ? BefIcon(BefIcons.check, size: 14, color: c.primaryForeground, weight: 3)
                : Text(
                    '${i + 1}',
                    style: BefText.style(
                      context,
                      size: 12,
                      weight: FontWeight.w600,
                      color: active ? c.accentForeground : c.mutedForeground,
                      height: 1,
                    ),
                  ),
          ),
          const SizedBox(height: 6),
          Text(
            s.title,
            style: BefText.style(
              context,
              size: 12,
              weight: FontWeight.w500,
              color: !done && !active ? c.mutedForeground : c.foreground,
            ),
          ),
          if (s.description != null)
            Text(s.description!, style: BefText.style(context, size: 11, color: c.mutedForeground)),
        ],
      ),
    );
  }
}
