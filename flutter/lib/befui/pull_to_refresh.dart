import 'package:flutter/material.dart';

import 'theme.dart';

/// Scrolling area you pull down from the top to refresh. [onRefresh] returns a future; the spinner stays until it completes. Give it a height (or put it in an Expanded).
class BefPullToRefresh extends StatelessWidget {
  const BefPullToRefresh({super.key, required this.onRefresh, required this.children, this.padding});
  final Future<void> Function() onRefresh;
  final List<Widget> children;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: c.primary,
      backgroundColor: c.card,
      strokeWidth: 2.5,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: padding ?? EdgeInsets.zero,
        children: children,
      ),
    );
  }
}
