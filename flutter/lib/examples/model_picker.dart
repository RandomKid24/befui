import 'package:flutter/material.dart';

import '../befui/model_picker.dart';
import '../befui/theme.dart';

const _models = [
  BefModel(
    id: 'fast',
    name: 'Swift',
    description: 'Quick answers for everyday questions.',
    context: '128K',
    tags: ['Fast', 'Low cost'],
  ),
  BefModel(
    id: 'balanced',
    name: 'Balanced',
    description: 'The default: good at writing, analysis and code.',
    context: '200K',
    tags: ['Vision', 'Tools'],
  ),
  BefModel(
    id: 'deep',
    name: 'Deep',
    description: 'Slower, for hard problems and long documents.',
    context: '1M',
    tags: ['Reasoning', 'Vision', 'Tools'],
  ),
];

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  String id = 'balanced';

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Tap to choose',
      Row(
        children: [
          BefModelPicker(models: _models, value: id, onChanged: (v) => setState(() => id = v)),
          const SizedBox(width: 12),
          Text('Selected: $id', style: BefText.style(context, size: 12, color: context.bef.mutedForeground)),
        ],
      ),
    ),
  ]);
}

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
