import 'package:flutter/material.dart';

import '../befui/label.dart';
import '../befui/phone_input.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  BefPhoneValue? v;

  @override
  Widget build(BuildContext context) {
    final bad = v != null && v!.national.isNotEmpty && !v!.valid;
    return _groups(context, [
      (
        'Mobile number',
        BefField(
          label: 'Mobile number',
          error: bad ? 'Number looks incomplete.' : null,
          hint: v?.valid == true ? 'Saved as ${v!.e164}' : 'We only use this for sign-in codes.',
          child: BefPhoneInput(value: v, onChanged: (x) => setState(() => v = x), invalid: bad),
        ),
      ),
    ]);
  }
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
