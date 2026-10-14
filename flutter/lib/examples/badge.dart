import 'package:flutter/material.dart';

import '../befui/badge.dart';

Widget example(BuildContext context) {
  return const Wrap(
    spacing: 8,
    runSpacing: 8,
    children: [
      BefBadge(label: 'Default'),
      BefBadge(label: 'Outline', variant: BefBadgeVariant.outline),
      BefBadge(label: 'Primary', variant: BefBadgeVariant.primary),
      BefBadge(label: 'Active', variant: BefBadgeVariant.success, dot: true),
      BefBadge(label: 'Pending', variant: BefBadgeVariant.warning, dot: true),
      BefBadge(label: 'Failed', variant: BefBadgeVariant.danger, dot: true),
      BefBadge(label: 'Info', variant: BefBadgeVariant.info),
    ],
  );
}
