import 'package:flutter/material.dart';

import '../befui/color_picker.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      ('Pick a colour', BefColorPicker(value: _c, onChanged: (v) => set(() => _c = v))),
      (
        'Preview',
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          width: double.infinity,
          height: 72,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Color(int.parse('FF${_c.substring(1)}', radix: 16)),
            borderRadius: BorderRadius.circular(BefRadius.xl),
          ),
          child: Text(
            _c.toUpperCase(),
            style: BefText.style(context, weight: FontWeight.w500, color: Colors.white),
          ),
        ),
      ),
    ]),
  );
}

String _c = '#2563eb';

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
