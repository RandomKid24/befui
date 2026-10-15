import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/prompt_suggestions.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  String? picked;

  @override
  Widget build(BuildContext context) {
    const items = [
      BefSuggestion(
        id: '1',
        label: 'Summarise this week',
        hint: 'Attendance, leave and approvals',
        icon: BefIcon(BefIcons.calendar),
      ),
      BefSuggestion(
        id: '2',
        label: 'Draft an offer letter',
        hint: 'From a role and a salary',
        icon: BefIcon(BefIcons.fileText),
      ),
      BefSuggestion(
        id: '3',
        label: 'Who is out tomorrow?',
        hint: 'Across all teams',
        icon: BefIcon(BefIcons.users),
      ),
    ];
    return _groups(context, [
      ('Cards', BefPromptSuggestions(items: items, onSelect: (s) => setState(() => picked = s.label))),
      (
        'Chips',
        BefPromptSuggestions(
          chips: true,
          items: const [
            BefSuggestion(id: '1', label: 'Summarise this week'),
            BefSuggestion(id: '2', label: 'Draft an offer letter'),
            BefSuggestion(id: '3', label: 'Who is out tomorrow?'),
          ],
          onSelect: (s) => setState(() => picked = s.label),
        ),
      ),
      (
        'Picked',
        Text(
          picked ?? 'Pick one.',
          style: BefText.style(context, size: 12, color: context.bef.mutedForeground),
        ),
      ),
    ]);
  }
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
