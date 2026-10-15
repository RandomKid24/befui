import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'input.dart';
import 'theme.dart';

/// Text you tap to edit in place. Enter or tapping away saves.
class BefInlineEdit extends StatefulWidget {
  const BefInlineEdit({
    super.key,
    required this.value,
    required this.onSaved,
    this.placeholder = 'Tap to edit',
  });
  final String value;
  final ValueChanged<String> onSaved;
  final String placeholder;

  @override
  State<BefInlineEdit> createState() => _BefInlineEditState();
}

class _BefInlineEditState extends State<BefInlineEdit> {
  bool _editing = false;
  late final TextEditingController _c = TextEditingController(text: widget.value);

  void _save() {
    final t = _c.text.trim();
    setState(() => _editing = false);
    if (t.isNotEmpty && t != widget.value) {
      widget.onSaved(t);
    } else {
      _c.text = widget.value;
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    if (_editing) {
      return TapRegion(
        onTapOutside: (_) => _save(),
        child: BefInput(controller: _c, autofocus: true, onSubmitted: (_) => _save()),
      );
    }
    return BefPressable(
      semanticLabel: 'Edit ${widget.value}',
      pressScale: 1,
      onPressed: () => setState(() {
        _c.text = widget.value;
        _editing = true;
      }),
      builder: (context, states) => Container(
        height: 36,
        padding: const EdgeInsets.symmetric(horizontal: 8),
        decoration: BoxDecoration(
          color: states.contains(WidgetState.hovered) ? c.secondary : null,
          borderRadius: BorderRadius.circular(BefRadius.md),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                widget.value.isEmpty ? widget.placeholder : widget.value,
                style: BefText.style(
                  context,
                  weight: FontWeight.w500,
                  color: widget.value.isEmpty ? c.mutedForeground : c.foreground,
                ),
              ),
            ),
            BefIcon(BefIcons.edit, size: 14, color: c.mutedForeground),
          ],
        ),
      ),
    );
  }
}
