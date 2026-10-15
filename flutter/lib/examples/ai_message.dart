import 'package:flutter/material.dart';

import '../befui/ai_message.dart';
import '../befui/sources.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  BefFeedback? fb;

  @override
  Widget build(BuildContext context) => _groups(context, [
    ('User bubble', const BefAiMessage(user: true, child: Text('How many leave days can I carry forward?'))),
    (
      'Answer with citations and actions',
      BefAiMessage(
        plain: 'Carry-forward is capped at 12 days a year.',
        onRegenerate: () {},
        feedback: fb,
        onFeedback: (v) => setState(() => fb = v),
        child: Text.rich(
          TextSpan(
            children: [
              const TextSpan(text: 'Carry-forward is capped at '),
              const TextSpan(
                text: '12 days',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const TextSpan(text: ' a year'),
              WidgetSpan(
                alignment: PlaceholderAlignment.middle,
                child: BefCite(n: 1, onTap: () {}),
              ),
              const TextSpan(text: ', and anything above lapses on 31 March'),
              WidgetSpan(
                alignment: PlaceholderAlignment.middle,
                child: BefCite(n: 2, onTap: () {}),
              ),
              const TextSpan(text: '.'),
            ],
          ),
        ),
      ),
    ),
    (
      'Streaming, with a caret',
      const BefAiMessage(streaming: true, child: Text('Checking the policy for the part about encashment')),
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
