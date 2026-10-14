import 'package:flutter/material.dart';

import '../befui/checkbox.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final items = _items;
      final all = items.values.every((v) => v);
      final some = items.values.any((v) => v);
      return Column(
        mainAxisSize: MainAxisSize.min,
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
      );
    },
  );
}

final _items = {'email': true, 'sms': false, 'push': false};
