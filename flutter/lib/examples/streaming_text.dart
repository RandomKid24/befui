import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/streaming_text.dart';
import '../befui/theme.dart';

const _answer =
    'Carry-forward is capped at 12 days a year. Anything above that lapses on 31 March, and casual leave does not carry forward at all.';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  int run = 0;

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Word by word, with a caret',
      SizedBox(
        height: 120,
        child: BefStreamingText(key: ValueKey(run), text: _answer, speed: 12),
      ),
    ),
    (
      'Replay',
      Align(
        alignment: Alignment.centerLeft,
        child: BefButton(
          label: 'Replay',
          size: BefButtonSize.sm,
          variant: BefButtonVariant.outline,
          onPressed: () => setState(() => run++),
        ),
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
