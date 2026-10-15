import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/dialog.dart';
import '../befui/input.dart';
import '../befui/label.dart';

Widget _panel(BuildContext context, {VoidCallback? onClose}) {
  return BefDialog(
    title: 'Reject leave request',
    description: 'The employee gets an email with your reason.',
    onClose: onClose,
    actions: [
      BefButton(label: 'Cancel', variant: BefButtonVariant.ghost, onPressed: onClose),
      BefButton(label: 'Reject', variant: BefButtonVariant.destructive, onPressed: onClose),
    ],
    child: const BefField(
      label: 'Reason',
      child: BefInput(placeholder: 'Team is short staffed that week'),
    ),
  );
}

/// Tap the button to open it.
Widget example(BuildContext context) {
  return BefButton(
    label: 'Open dialog',
    variant: BefButtonVariant.outline,
    onPressed: () => showBefDialog<void>(
      context: context,
      builder: (context) => _panel(context, onClose: () => Navigator.of(context).pop()),
    ),
  );
}

/// The open dialog, for the screenshot.
Widget preview(BuildContext context) => _panel(context, onClose: () {});
