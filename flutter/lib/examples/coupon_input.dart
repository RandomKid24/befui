import 'package:flutter/material.dart';

import '../befui/coupon_input.dart';
import '../befui/theme.dart';

const _codes = {'WELCOME10': 'You save 10% on this order', 'FESTIVE250': 'You save ₹250'};

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      (
        'Apply a code',
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BefCouponInput(
              applied: _applied,
              hint: _applied == null ? null : _codes[_applied],
              onApply: (c) async {
                await Future<void>.delayed(const Duration(milliseconds: 600));
                if (!_codes.containsKey(c)) return false;
                set(() => _applied = c);
                return true;
              },
              onRemove: () => set(() => _applied = null),
            ),
            if (_applied == null)
              Padding(
                padding: const EdgeInsets.fromLTRB(4, 8, 4, 0),
                child: Text(
                  'Try WELCOME10 or FESTIVE250.',
                  style: BefText.style(context, size: 12, color: context.bef.mutedForeground),
                ),
              ),
          ],
        ),
      ),
    ]),
  );
}

String? _applied;

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
