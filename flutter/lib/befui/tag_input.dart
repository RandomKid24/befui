import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// Type and press Enter or comma to add a tag. Backspace on an empty field removes the last one.
class BefTagInput extends StatefulWidget {
  const BefTagInput({
    super.key,
    required this.value,
    required this.onChanged,
    this.placeholder = 'Add a tag',
  });
  final List<String> value;
  final ValueChanged<List<String>> onChanged;
  final String placeholder;

  @override
  State<BefTagInput> createState() => _BefTagInputState();
}

class _BefTagInputState extends State<BefTagInput> {
  final TextEditingController _text = TextEditingController();
  final FocusNode _focus = FocusNode();

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _text.dispose();
    _focus.dispose();
    super.dispose();
  }

  void _commit() {
    final t = _text.text.replaceAll(',', '').trim();
    if (t.isNotEmpty && !widget.value.contains(t)) widget.onChanged([...widget.value, t]);
    _text.clear();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final focused = _focus.hasFocus;
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: _focus.requestFocus,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        constraints: const BoxConstraints(minHeight: 40),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          color: c.background,
          borderRadius: BorderRadius.circular(BefRadius.md),
          border: Border.all(color: focused ? c.ring : c.border),
          boxShadow: focused ? [BoxShadow(color: c.ring.withValues(alpha: 0.15), spreadRadius: 4)] : null,
        ),
        child: Wrap(
          spacing: 6,
          runSpacing: 6,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            for (final t in widget.value)
              Container(
                padding: const EdgeInsets.only(left: 10, top: 2, bottom: 2, right: 4),
                decoration: BoxDecoration(
                  color: c.secondary,
                  borderRadius: BorderRadius.circular(BefRadius.full),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(t, style: BefText.style(context, size: 12, weight: FontWeight.w500, height: 1.3)),
                    const SizedBox(width: 4),
                    BefPressable(
                      semanticLabel: 'Remove $t',
                      pressScale: 0.9,
                      onPressed: () => widget.onChanged(widget.value.where((x) => x != t).toList()),
                      builder: (_, _) => SizedBox(
                        width: 16,
                        height: 16,
                        child: Center(child: BefIcon(BefIcons.x, size: 12, color: c.foreground)),
                      ),
                    ),
                  ],
                ),
              ),
            ConstrainedBox(
              constraints: const BoxConstraints(minWidth: 96, maxWidth: 220),
              child: Focus(
                onKeyEvent: (node, e) {
                  if (e is KeyDownEvent &&
                      e.logicalKey == LogicalKeyboardKey.backspace &&
                      _text.text.isEmpty &&
                      widget.value.isNotEmpty) {
                    widget.onChanged(widget.value.sublist(0, widget.value.length - 1));
                    return KeyEventResult.handled;
                  }
                  return KeyEventResult.ignored;
                },
                child: TextField(
                  controller: _text,
                  focusNode: _focus,
                  cursorColor: c.primary,
                  style: BefText.style(context, size: 13),
                  textInputAction: TextInputAction.done,
                  onSubmitted: (_) {
                    _commit();
                    _focus.requestFocus();
                  },
                  onChanged: (t) {
                    if (t.endsWith(',')) _commit();
                  },
                  decoration: InputDecoration.collapsed(
                    hintText: widget.value.isEmpty ? widget.placeholder : '',
                    hintStyle: BefText.style(
                      context,
                      size: 13,
                      color: c.mutedForeground.withValues(alpha: 0.7),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
