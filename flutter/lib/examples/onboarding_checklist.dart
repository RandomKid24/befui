import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/onboarding_checklist.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var items = [
    const BefChecklistItem(id: 'profile', title: 'Complete your profile', done: true),
    BefChecklistItem(
      id: 'team',
      title: 'Invite your team',
      description: 'Add colleagues by email so they can see shared reports.',
      done: false,
      action: BefButton(label: 'Invite people', size: BefButtonSize.xs, onPressed: () {}),
    ),
    BefChecklistItem(
      id: 'data',
      title: 'Import employees',
      description: 'Upload a CSV or connect your payroll tool.',
      done: false,
      action: BefButton(
        label: 'Upload CSV',
        size: BefButtonSize.xs,
        variant: BefButtonVariant.outline,
        onPressed: () {},
      ),
    ),
    const BefChecklistItem(id: 'leave', title: 'Set up leave policies', done: false),
  ];

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Tap the circles to tick items off',
      BefOnboardingChecklist(
        items: items,
        onToggle: (id, done) => setState(
          () => items = [
            for (final i in items)
              i.id == id
                  ? BefChecklistItem(
                      id: i.id,
                      title: i.title,
                      description: i.description,
                      action: i.action,
                      done: done,
                    )
                  : i,
          ],
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
