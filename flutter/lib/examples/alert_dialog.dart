import 'package:flutter/material.dart';

import '../befui/alert_dialog.dart';
import '../befui/button.dart';
import '../befui/icons.dart';
import '../befui/toast.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return _groups(context, [('Tap to open', _trigger(context))]);
}

Widget _trigger(BuildContext context) {
  return BefButton(
    label: 'Delete employee',
    variant: BefButtonVariant.destructive,
    leading: const BefIcon(BefIcons.trash),
    onPressed: () async {
      final ok = await showBefAlertDialog(
        context: context,
        title: 'Delete this employee?',
        description: 'Their records are removed from payroll and cannot be recovered.',
        confirmLabel: 'Delete',
        destructive: true,
      );
      if (ok == true && context.mounted) BefToast.success(context, 'Employee deleted');
    },
  );
}

Widget preview(BuildContext context) {
  return BefAlertDialog(
    title: 'Delete this employee?',
    description: 'Their records are removed from payroll and cannot be recovered.',
    confirmLabel: 'Delete',
    destructive: true,
    onResult: (_) {},
  );
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
