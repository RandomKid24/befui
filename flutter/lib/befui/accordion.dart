import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefAccordionItem {
  const BefAccordionItem({required this.id, required this.title, required this.content});
  final String id;
  final String title;
  final Widget content;
}

/// A stack of sections that open and close. [multiple] lets several stay open.
class BefAccordion extends StatefulWidget {
  const BefAccordion({super.key, required this.items, this.multiple = false, this.initiallyOpen = const []});
  final List<BefAccordionItem> items;
  final bool multiple;
  final List<String> initiallyOpen;

  @override
  State<BefAccordion> createState() => _BefAccordionState();
}

class _BefAccordionState extends State<BefAccordion> {
  late List<String> _open = [...widget.initiallyOpen];

  void _toggle(String id) => setState(
    () => _open = _open.contains(id)
        ? _open.where((x) => x != id).toList()
        : (widget.multiple ? [..._open, id] : [id]),
  );

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          for (var i = 0; i < widget.items.length; i++) ...[
            if (i > 0) Divider(height: 1, thickness: 1, color: c.border),
            _item(context, c, widget.items[i]),
          ],
        ],
      ),
    );
  }

  Widget _item(BuildContext context, BefColors c, BefAccordionItem it) {
    final open = _open.contains(it.id);
    return Column(
      children: [
        Semantics(
          expanded: open,
          child: BefPressable(
            semanticsRole: true,
            semanticLabel: it.title,
            pressScale: 1,
            onPressed: () => _toggle(it.id),
            builder: (context, states) => Container(
              color: states.contains(WidgetState.hovered) || states.contains(WidgetState.focused)
                  ? c.muted
                  : Colors.transparent,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Row(
                children: [
                  Expanded(
                    child: Text(it.title, style: BefText.style(context, weight: FontWeight.w500)),
                  ),
                  const SizedBox(width: 16),
                  AnimatedRotation(
                    turns: open ? 0.5 : 0,
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOut,
                    child: BefIcon(
                      BefIcons.chevronDown,
                      size: 16,
                      color: open ? c.foreground : c.mutedForeground,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        AnimatedSize(
          duration: const Duration(milliseconds: 300),
          curve: const Cubic(0.22, 1, 0.36, 1),
          alignment: Alignment.topCenter,
          child: open
              ? Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: SizedBox(
                    width: double.infinity,
                    child: DefaultTextStyle.merge(
                      style: BefText.style(context, color: c.mutedForeground),
                      child: it.content,
                    ),
                  ),
                )
              : const SizedBox(width: double.infinity),
        ),
      ],
    );
  }
}
