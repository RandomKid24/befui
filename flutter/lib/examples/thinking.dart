import 'package:flutter/material.dart';

import '../befui/thinking.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  ('Plain', const BefThinking()),
  (
    'With steps, tap to open',
    const BefThinking(
      label: 'Searching the handbook',
      steps: [
        BefThinkingStep('Read the question', done: true),
        BefThinkingStep('Search leave policy', done: true),
        BefThinkingStep('Compare with your balance'),
      ],
    ),
  ),
  (
    'Done',
    const BefThinking(
      done: true,
      took: '4s',
      steps: [
        BefThinkingStep('Read the question', done: true),
        BefThinkingStep('Wrote the answer', done: true),
      ],
    ),
  ),
]);

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
