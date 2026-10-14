import 'package:flutter/material.dart';

import '../befui/otp_input.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return Column(
        mainAxisSize: MainAxisSize.min,
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
            'Try 123456, or paste any code.',
            style: BefText.style(context, size: 12, color: context.bef.mutedForeground),
          ),
        ],
      );
    },
  );
}

String _v = '';
bool _bad = false;
