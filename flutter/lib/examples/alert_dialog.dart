import 'package:flutter/material.dart';

import '../befui/alert_dialog.dart';
import '../befui/button.dart';
import '../befui/icons.dart';
import '../befui/toast.dart';

Widget example(BuildContext context) {
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
