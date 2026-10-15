import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/toast.dart';

Widget example(BuildContext context) {
  return Wrap(
    spacing: 8,
    runSpacing: 8,
    children: [
      BefButton(
        label: 'Success',
        variant: BefButtonVariant.outline,
        onPressed: () => BefToast.success(context, 'Saved', 'Your changes are live.'),
      ),
      BefButton(
        label: 'Error',
        variant: BefButtonVariant.outline,
        onPressed: () => BefToast.error(context, 'Could not save', 'Check your connection.'),
      ),
      BefButton(
        label: 'Info',
        variant: BefButtonVariant.outline,
        onPressed: () => BefToast.info(context, 'Heads up'),
      ),
    ],
  );
}
