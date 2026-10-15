import 'package:flutter/material.dart';

import 'theme.dart';

/// A field with fixed text or an icon stuck to its start and/or end: `https://` + name, an amount + `INR`. Put a plain [TextField] (or any widget) in [child]; the group draws the shared border.
class BefInputGroup extends StatelessWidget {
  const BefInputGroup({super.key, required this.child, this.prefix, this.suffix});
  final Widget child;
  final Widget? prefix, suffix;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    Widget addon(Widget w, {required bool start}) => Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: c.muted,
        border: Border(
          left: start ? BorderSide.none : BorderSide(color: c.input),
          right: start ? BorderSide(color: c.input) : BorderSide.none,
        ),
      ),
      child: DefaultTextStyle(
        style: BefText.style(context, size: 13, color: c.mutedForeground),
        child: IconTheme(
          data: IconThemeData(color: c.mutedForeground, size: 16),
          child: w,
        ),
      ),
    );
    return Container(
      height: 40,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.background,
        borderRadius: BorderRadius.circular(BefRadius.md),
        border: Border.all(color: c.input),
      ),
      child: Row(
        children: [
          if (prefix != null) addon(prefix!, start: true),
          Expanded(
            child: Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: child),
          ),
          if (suffix != null) addon(suffix!, start: false),
        ],
      ),
    );
  }
}
