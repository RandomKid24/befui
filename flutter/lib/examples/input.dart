import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/input.dart';
import '../befui/label.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Required, with a hint',
    const BefField(
      label: 'Full name',
      required: true,
      hint: 'As it appears on the offer letter.',
      child: BefInput(placeholder: 'Aarav Mehta'),
    ),
  ),
  (
    'Leading icon',
    const BefField(
      label: 'Work email',
      child: BefInput(
        placeholder: 'you@company.com',
        keyboardType: TextInputType.emailAddress,
        leading: BefIcon(BefIcons.mail),
      ),
    ),
  ),
  (
    'Invalid',
    const BefField(
      label: 'Employee ID',
      error: 'This ID is already taken.',
      child: BefInput(initialValue: 'EMP-0042', invalid: true),
    ),
  ),
  (
    'With a trailing hint',
    BefInput(placeholder: 'Search...', leading: const BefIcon(BefIcons.search), trailing: _Kbd('/')),
  ),
  (
    'Multi-line',
    const BefField(
      label: 'Notes',
      child: BefInput.textarea(placeholder: 'Anything the approver should know'),
    ),
  ),
  ('Disabled', const BefInput(placeholder: 'Disabled', enabled: false)),
]);

class _Kbd extends StatelessWidget {
  const _Kbd(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
      decoration: BoxDecoration(
        color: c.muted,
        border: Border.all(color: c.border),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Text(text, style: BefText.style(context, size: 11, color: c.mutedForeground, mono: true)),
    );
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
