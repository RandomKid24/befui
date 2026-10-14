import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/stepper.dart';

const _steps = [
  BefStep(title: 'Details', description: 'Basics'),
  BefStep(title: 'Role', description: 'Team & level'),
  BefStep(title: 'Documents'),
  BefStep(title: 'Review'),
];

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BefStepper(steps: _steps, current: _current),
          const SizedBox(height: 24),
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
        ],
      );
    },
  );
}

int _current = 1;
