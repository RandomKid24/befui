import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/stepper.dart';
import '../befui/theme.dart';

const _steps = [
  BefStep(title: 'Details', description: 'Basics'),
  BefStep(title: 'Role', description: 'Team & level'),
  BefStep(title: 'Documents'),
  BefStep(title: 'Review'),
];

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return _groups(context, [
        ('Onboarding steps', BefStepper(steps: _steps, current: _current)),
        (
          'Move through them',
          Row(
            children: [
              BefButton(
                label: 'Back',
                size: BefButtonSize.sm,
                variant: BefButtonVariant.outline,
                onPressed: _current == 0 ? null : () => set(() => _current--),
              ),
              const SizedBox(width: 8),
              BefButton(
                label: 'Next',
                size: BefButtonSize.sm,
                onPressed: _current == _steps.length ? null : () => set(() => _current++),
              ),
            ],
          ),
        ),
      ]);
    },
  );
}

int _current = 1;

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
