import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// One section that opens and closes under a title.
class BefCollapsible extends StatefulWidget {
  const BefCollapsible({super.key, required this.title, required this.child, this.initiallyOpen = false});
  final String title;
  final Widget child;
  final bool initiallyOpen;

  @override
  State<BefCollapsible> createState() => _BefCollapsibleState();
}

class _BefCollapsibleState extends State<BefCollapsible> {
  late bool _open = widget.initiallyOpen;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Semantics(
          expanded: _open,
          child: BefPressable(
            pressScale: 1,
            semanticLabel: widget.title,
            onPressed: () => setState(() => _open = !_open),
            builder: (context, _) => Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(widget.title, style: BefText.style(context, weight: FontWeight.w500)),
                const SizedBox(width: 8),
                AnimatedRotation(
                  turns: _open ? 0.5 : 0,
                  duration: const Duration(milliseconds: 250),
                  child: BefIcon(BefIcons.chevronDown, size: 16, color: c.mutedForeground),
                ),
              ],
            ),
          ),
        ),
        AnimatedSize(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
          alignment: Alignment.topLeft,
          child: _open
              ? Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: DefaultTextStyle.merge(
                    style: BefText.style(context, color: c.mutedForeground),
                    child: widget.child,
                  ),
                )
              : const SizedBox(width: double.infinity),
        ),
      ],
    );
  }
}
