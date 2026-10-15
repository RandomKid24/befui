import 'package:flutter/material.dart';

import '../befui/checkbox.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final items = _items;
      final all = items.values.every((v) => v);
      final some = items.values.any((v) => v);
      return _groups(context, [
        (
          'Parent with a mixed state',
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BefCheckbox(
                value: all ? true : (some ? null : false),
                label: 'Notify me by',
                labelWeight: FontWeight.w600,
                onChanged: (v) => set(() => items.updateAll((k, _) => v)),
              ),
              for (final k in items.keys) ...[
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.only(left: 24),
                  child: BefCheckbox(
                    value: items[k],
                    label: k[0].toUpperCase() + k.substring(1),
                    onChanged: (v) => set(() => items[k] = v),
                  ),
                ),
              ],
            ],
          ),
        ),
        (
          'Disabled',
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BefCheckbox(value: false, label: 'Unchecked'),
              SizedBox(height: 12),
              BefCheckbox(value: true, label: 'Checked'),
            ],
          ),
        ),
      ]);
    },
  );
}

final _items = {'email': true, 'sms': false, 'push': false};

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
