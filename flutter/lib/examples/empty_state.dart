import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/empty_state.dart';
import '../befui/icons.dart';

Widget example(BuildContext context) {
  return BefEmptyState(
    icon: const BefIcon(BefIcons.inbox),
    title: 'No leave requests',
    description: 'When someone on your team applies for leave, it shows up here.',
    action: BefButton(
      label: 'Invite teammate',
      size: BefButtonSize.sm,
      variant: BefButtonVariant.outline,
      onPressed: () {},
    ),
  );
}
