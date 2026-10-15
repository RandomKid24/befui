import 'package:flutter/material.dart';

import '../befui/bottom_sheet.dart';
import '../befui/button.dart';
import '../befui/theme.dart';
import '../befui/toast.dart';

const _options = ['Casual leave', 'Sick leave', 'Earned leave', 'Work from home'];

Widget _list(BuildContext context, ValueChanged<String> onPick) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      for (final o in _options)
        InkWell(
          borderRadius: BorderRadius.circular(BefRadius.lg),
          onTap: () => onPick(o),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            child: Text(
              o,
              style: BefText.style(context, weight: FontWeight.w500, color: c.foreground),
            ),
          ),
        ),
    ],
  );
}

Widget example(BuildContext context) {
  return _groups(context, [('Tap to open', _trigger(context))]);
}

Widget _trigger(BuildContext context) {
  return BefButton(
    label: 'Apply for leave',
    variant: BefButtonVariant.outline,
    onPressed: () => showBefBottomSheet<void>(
      context: context,
      title: 'Apply for',
      description: 'Drag the handle down to dismiss.',
      builder: (sheet) => _list(sheet, (o) {
        Navigator.of(sheet).pop();
        BefToast.success(context, 'Selected', o);
      }),
    ),
  );
}

Widget preview(BuildContext context) {
  return BefBottomSheet(
    title: 'Apply for',
    description: 'Drag the handle down to dismiss.',
    child: _list(context, (_) {}),
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
