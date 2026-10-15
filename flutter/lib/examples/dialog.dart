import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/dialog.dart';
import '../befui/input.dart';
import '../befui/label.dart';
import '../befui/theme.dart';

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
  return _groups(context, [('Tap to open', _trigger(context))]);
}

Widget _trigger(BuildContext context) {
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
