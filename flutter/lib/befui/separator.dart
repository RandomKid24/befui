import 'package:flutter/material.dart';

import 'theme.dart';

/// A 1px line in the `border` colour. Vertical separators need a parent with a height.
class BefSeparator extends StatelessWidget {
  const BefSeparator({super.key, this.vertical = false});
  final bool vertical;

  @override
  Widget build(BuildContext context) {
    final line = ColoredBox(color: context.bef.border);
    return vertical
        ? SizedBox(width: 1, height: double.infinity, child: line)
        : SizedBox(height: 1, width: double.infinity, child: line);
  }
}
