import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/error_state.dart';
import '../befui/icons.dart';

Widget example(BuildContext context) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefErrorState(
        code: '404',
        title: 'Page not found',
        description: 'The page you are looking for was moved or never existed.',
        actions: [
          BefButton(label: 'Go back', variant: BefButtonVariant.outline, onPressed: () {}),
          BefButton(label: 'Home', onPressed: () {}),
        ],
      ),
      BefErrorState(
        title: 'We could not load payroll',
        description: 'The server did not respond. Your data is safe. Try again in a moment.',
        actions: [
          BefButton(
            label: 'Try again',
            variant: BefButtonVariant.outline,
            leading: const BefIcon(BefIcons.refresh),
            onPressed: () {},
          ),
        ],
      ),
    ],
  );
}
