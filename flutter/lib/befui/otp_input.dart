import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'theme.dart';

/// One-time code boxes. Type or paste digits; [onComplete] fires when all are filled.
class BefOtpInput extends StatefulWidget {
  const BefOtpInput({
    super.key,
    required this.value,
    required this.onChanged,
    this.length = 6,
    this.onComplete,
    this.invalid = false,
  });
  final String value;
  final ValueChanged<String> onChanged;
  final ValueChanged<String>? onComplete;
  final int length;
  final bool invalid;

  @override
  State<BefOtpInput> createState() => _BefOtpInputState();
}

class _BefOtpInputState extends State<BefOtpInput> {
  late final TextEditingController _text = TextEditingController(text: widget.value);
  final FocusNode _focus = FocusNode();

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {}));
  }

  @override
  void didUpdateWidget(BefOtpInput old) {
    super.didUpdateWidget(old);
    if (_text.text != widget.value) {
      _text.value = TextEditingValue(
        text: widget.value,
        selection: TextSelection.collapsed(offset: widget.value.length),
      );
    }
  }

  @override
  void dispose() {
    _text.dispose();
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final v = widget.value;
    return Semantics(
      label: 'One-time code',
      textField: true,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _focus.requestFocus,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (var i = 0; i < widget.length; i++) ...[
                  if (i > 0) const SizedBox(width: 8),
                  _box(context, c, i, v),
                ],
              ],
            ),
            Positioned.fill(
              child: Opacity(
                opacity: 0,
                child: TextField(
                  controller: _text,
                  focusNode: _focus,
                  keyboardType: TextInputType.number,
                  autofillHints: const [AutofillHints.oneTimeCode],
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(widget.length),
                  ],
                  showCursor: false,
                  onChanged: (t) {
                    widget.onChanged(t);
                    if (t.length == widget.length) widget.onComplete?.call(t);
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _box(BuildContext context, BefColors c, int i, String v) {
    final filled = i < v.length;
    final focused = _focus.hasFocus && i == (v.length < widget.length ? v.length : widget.length - 1);
    final border = widget.invalid
        ? c.destructive
        : (focused ? c.ring : (filled ? c.primary.withValues(alpha: 0.5) : c.border));
    return AnimatedScale(
      duration: const Duration(milliseconds: 150),
      scale: focused ? 1.05 : 1,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: 44,
        height: 44,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: filled ? c.accent : c.background,
          borderRadius: BorderRadius.circular(BefRadius.lg),
          border: Border.all(color: border),
          boxShadow: focused
              ? [
                  BoxShadow(
                    color: (widget.invalid ? c.destructive : c.ring).withValues(alpha: 0.15),
                    spreadRadius: 4,
                  ),
                ]
              : null,
        ),
        child: Text(
          filled ? v[i] : '',
          style: BefText.style(
            context,
            size: 18,
            weight: FontWeight.w600,
          ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
        ),
      ),
    );
  }
}
