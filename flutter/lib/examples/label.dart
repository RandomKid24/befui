import 'package:flutter/material.dart';

import '../befui/input.dart';
import '../befui/label.dart';

Widget example(BuildContext context) {
  return const Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      BefField(
        label: 'Email',
        hint: 'We never share it.',
        child: BefInput(placeholder: 'you@example.com'),
      ),
      SizedBox(height: 16),
      BefField(
        label: 'Password',
        required: true,
        error: 'Must be at least 8 characters',
        child: BefInput(obscureText: true, initialValue: 'abc', invalid: true),
      ),
      SizedBox(height: 16),
      BefLabel('Standalone label'),
    ],
  );
}
