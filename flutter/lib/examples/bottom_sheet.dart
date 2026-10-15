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
