import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

const _defaultSwatches = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#e11d48',
  '#ea580c',
  '#d97706',
  '#059669',
  '#0891b2',
  '#475569',
  '#0f172a',
];

Color _hex(String h) => Color(int.parse('FF${h.substring(1)}', radix: 16));

/// Pick a colour from swatches or type a hex value. [value] is `#rrggbb`.
class BefColorPicker extends StatefulWidget {
  const BefColorPicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.swatches = _defaultSwatches,
  });
  final String value;
  final ValueChanged<String> onChanged;
  final List<String> swatches;

  @override
  State<BefColorPicker> createState() => _BefColorPickerState();
}

class _BefColorPickerState extends State<BefColorPicker> {
  late final TextEditingController _text = TextEditingController(text: widget.value);

  @override
  void didUpdateWidget(BefColorPicker old) {
    super.didUpdateWidget(old);
    if (_text.text.toLowerCase() != widget.value.toLowerCase()) _text.text = widget.value;
  }

  @override
  void dispose() {
    _text.dispose();
    super.dispose();
  }

  void _commit(String v) {
    final hex = v.startsWith('#') ? v : '#$v';
    if (RegExp(r'^#[0-9a-fA-F]{6}$').hasMatch(hex)) {
      widget.onChanged(hex.toLowerCase());
    } else {
      _text.text = widget.value;
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 5 * 32 + 4 * 8,
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final s in widget.swatches)
                Semantics(
                  inMutuallyExclusiveGroup: true,
                  checked: widget.value.toLowerCase() == s,
                  label: s,
                  child: BefPressable(
                    semanticsRole: false,
                    pressScale: 1,
                    onPressed: () => widget.onChanged(s),
                    builder: (context, states) {
                      final on = widget.value.toLowerCase() == s;
                      return AnimatedScale(
                        duration: const Duration(milliseconds: 150),
                        scale: on || states.contains(WidgetState.hovered) ? 1.1 : 1,
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: _hex(s),
                            shape: BoxShape.circle,
                            boxShadow: on
                                ? [
                                    BoxShadow(color: c.background, spreadRadius: 2),
                                    BoxShadow(color: c.ring, spreadRadius: 4),
                                  ]
                                : null,
                          ),
                          alignment: Alignment.center,
                          child: AnimatedScale(
                            duration: const Duration(milliseconds: 150),
                            scale: on ? 1 : 0.5,
                            child: AnimatedOpacity(
                              duration: const Duration(milliseconds: 150),
                              opacity: on ? 1 : 0,
                              child: const BefIcon(BefIcons.check, size: 14, color: Colors.white, weight: 3),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: RegExp(r'^#[0-9a-fA-F]{6}$').hasMatch(widget.value) ? _hex(widget.value) : c.muted,
                borderRadius: BorderRadius.circular(BefRadius.md),
                border: Border.all(color: c.border),
              ),
            ),
            const SizedBox(width: 8),
            SizedBox(
              width: 112,
              height: 36,
              child: TextField(
                controller: _text,
                maxLength: 7,
                textCapitalization: TextCapitalization.characters,
                onSubmitted: _commit,
                onTapOutside: (_) => _commit(_text.text),
                cursorColor: c.primary,
                style: BefText.style(context, mono: true),
                decoration: InputDecoration(
                  counterText: '',
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(BefRadius.md),
                    borderSide: BorderSide(color: c.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(BefRadius.md),
                    borderSide: BorderSide(color: c.ring),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
