import 'package:flutter/material.dart';

import '../befui/otp_input.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      (
        'Six digits, try 123456',
        Column(
          children: [
            BefOtpInput(
              value: _v,
              invalid: _bad,
              onChanged: (x) => set(() {
                _v = x;
                _bad = false;
              }),
              onComplete: (x) {
                if (x != '123456') {
                  set(() => _bad = true);
                  Future.delayed(const Duration(milliseconds: 500), () => set(() => _v = ''));
                }
              },
            ),
            const SizedBox(height: 12),
            Text(
              'A wrong code shakes and clears. You can paste a code too.',
              style: BefText.style(context, size: 12, color: context.bef.mutedForeground),
            ),
          ],
        ),
      ),
    ]),
  );
}

String _v = '';
bool _bad = false;

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
