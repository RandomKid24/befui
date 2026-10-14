import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/input.dart';
import '../befui/label.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      const BefField(
        label: 'Full name',
        required: true,
        hint: 'As it appears on the offer letter.',
        child: BefInput(placeholder: 'Aarav Mehta'),
      ),
      const SizedBox(height: 16),
      const BefField(
        label: 'Work email',
        child: BefInput(
          placeholder: 'you@company.com',
          keyboardType: TextInputType.emailAddress,
          leading: BefIcon(BefIcons.mail),
        ),
      ),
      const SizedBox(height: 16),
      const BefField(
        label: 'Employee ID',
        error: 'This ID is already taken.',
        child: BefInput(initialValue: 'EMP-0042', invalid: true),
      ),
      const SizedBox(height: 16),
      BefInput(placeholder: 'Search...', leading: const BefIcon(BefIcons.search), trailing: _Kbd('/')),
      const SizedBox(height: 16),
      const BefField(
        label: 'Notes',
        child: BefInput.textarea(placeholder: 'Anything the approver should know'),
      ),
      const SizedBox(height: 16),
      const BefInput(placeholder: 'Disabled', enabled: false),
    ],
  );
}

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
