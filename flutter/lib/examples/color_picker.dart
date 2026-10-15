import 'package:flutter/material.dart';

import '../befui/color_picker.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return Wrap(
        spacing: 32,
        runSpacing: 16,
        children: [
          BefColorPicker(value: _c, onChanged: (v) => set(() => _c = v)),
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: 128,
            height: 96,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Color(int.parse('FF${_c.substring(1)}', radix: 16)),
              borderRadius: BorderRadius.circular(BefRadius.xl),
            ),
            child: Text(
              'Preview',
              style: BefText.style(context, weight: FontWeight.w500, color: Colors.white),
            ),
          ),
        ],
      );
    },
  );
}

String _c = '#2563eb';
