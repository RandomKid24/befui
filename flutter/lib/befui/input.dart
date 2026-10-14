import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core.dart';
import 'theme.dart';

/// A text field with the befui look: 36px tall, `input` border that turns `ring` on focus, optional [leading] icon and [trailing] widget.
/// Use [BefInput.textarea] for several lines.
class BefInput extends StatefulWidget {
  const BefInput({
    super.key,
    this.controller,
    this.initialValue,
    this.onChanged,
    this.onSubmitted,
    this.placeholder,
    this.leading,
    this.trailing,
    this.obscureText = false,
    this.keyboardType,
    this.textInputAction,
    this.enabled = true,
    this.readOnly = false,
    this.invalid = false,
    this.maxLength,
    this.focusNode,
    this.autofocus = false,
    this.inputFormatters,
    this.autofillHints,
    this.textAlign = TextAlign.start,
    this.semanticLabel,
  }) : multiline = false,
       minHeight = 36;

  /// A taller field that grows with its text (at least 80px, like the React `Textarea`).
  const BefInput.textarea({
    super.key,
    this.controller,
    this.initialValue,
    this.onChanged,
    this.placeholder,
    this.enabled = true,
    this.readOnly = false,
    this.invalid = false,
    this.maxLength,
    this.focusNode,
    this.autofocus = false,
    this.semanticLabel,
    this.minHeight = 80,
  }) : multiline = true,
       onSubmitted = null,
       leading = null,
       trailing = null,
       obscureText = false,
       keyboardType = TextInputType.multiline,
       textInputAction = TextInputAction.newline,
       inputFormatters = null,
       autofillHints = null,
       textAlign = TextAlign.start;

  final TextEditingController? controller;
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final String? placeholder;
  final Widget? leading;
  final Widget? trailing;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final bool enabled;
  final bool readOnly;

  /// Red border, like `aria-invalid`.
  final bool invalid;
  final int? maxLength;
  final FocusNode? focusNode;
  final bool autofocus;
  final List<TextInputFormatter>? inputFormatters;
  final Iterable<String>? autofillHints;
  final TextAlign textAlign;
  final String? semanticLabel;
  final bool multiline;
  final double minHeight;

  @override
  State<BefInput> createState() => _BefInputState();
}

class _BefInputState extends State<BefInput> {
  late final TextEditingController _controller =
      widget.controller ?? TextEditingController(text: widget.initialValue);
  late final FocusNode _focus = widget.focusNode ?? FocusNode();
  bool _hover = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    if (widget.controller == null) _controller.dispose();
    if (widget.focusNode == null) _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final focused = _focus.hasFocus;
    final border = widget.invalid
        ? c.destructive
        : focused
        ? c.ring
        : _hover && widget.enabled
        ? befOpacity(c.mutedForeground, 0.4)
        : c.input;
    final ring = focused
        ? [BoxShadow(color: befOpacity(widget.invalid ? c.destructive : c.ring, 0.25), spreadRadius: 3)]
        : const <BoxShadow>[];
    final style = BefText.style(context);
    return Opacity(
      opacity: widget.enabled ? 1 : 0.5,
      child: MouseRegion(
        onEnter: (_) => setState(() => _hover = true),
        onExit: (_) => setState(() => _hover = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          constraints: BoxConstraints(minHeight: widget.minHeight),
          decoration: BoxDecoration(
            color: c.background,
            borderRadius: BorderRadius.circular(BefRadius.md),
            border: Border.all(color: border),
            boxShadow: [
              const BoxShadow(color: Color(0x05000000), offset: Offset(0, 1), blurRadius: 1),
              ...ring,
            ],
          ),
          padding: EdgeInsets.symmetric(horizontal: 12, vertical: widget.multiline ? 8 : 0),
          child: Row(
            crossAxisAlignment: widget.multiline ? CrossAxisAlignment.start : CrossAxisAlignment.center,
            children: [
              if (widget.leading != null) ...[
                IconTheme.merge(
                  data: IconThemeData(size: 16, color: c.mutedForeground),
                  child: widget.leading!,
                ),
                const SizedBox(width: 8),
              ],
              Expanded(
                child: Semantics(
                  label: widget.semanticLabel ?? widget.placeholder,
                  child: TextField(
                    controller: _controller,
                    focusNode: _focus,
                    autofocus: widget.autofocus,
                    enabled: widget.enabled,
                    readOnly: widget.readOnly,
                    obscureText: widget.obscureText,
                    keyboardType: widget.keyboardType,
                    textInputAction: widget.textInputAction,
                    onChanged: widget.onChanged,
                    onSubmitted: widget.onSubmitted,
                    maxLength: widget.maxLength,
                    inputFormatters: widget.inputFormatters,
                    autofillHints: widget.autofillHints,
                    textAlign: widget.textAlign,
                    minLines: widget.multiline ? 3 : 1,
                    maxLines: widget.multiline ? null : 1,
                    cursorColor: c.primary,
                    cursorWidth: 1.5,
                    style: style.copyWith(height: widget.multiline ? 1.6 : null),
                    decoration: InputDecoration.collapsed(
                      hintText: widget.placeholder,
                      hintStyle: style.copyWith(color: befOpacity(c.mutedForeground, 0.7)),
                    ).copyWith(counterText: ''),
                  ),
                ),
              ),
              if (widget.trailing != null) ...[const SizedBox(width: 8), widget.trailing!],
            ],
          ),
        ),
      ),
    );
  }
}
