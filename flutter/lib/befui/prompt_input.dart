import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// The box you type a prompt into: grows with the text up to [maxRows], the send button turns into Stop while [streaming]. Put attach buttons or a model picker in [leading]. Enter sends on hardware keyboards; on a phone use the send button. Controlled with a [controller].
class BefPromptInput extends StatefulWidget {
  const BefPromptInput({
    super.key,
    required this.controller,
    required this.onSubmit,
    this.onStop,
    this.streaming = false,
    this.placeholder = 'Ask anything',
    this.maxRows = 8,
    this.maxLength,
    this.leading,
  });
  final TextEditingController controller;
  final ValueChanged<String> onSubmit;
  final VoidCallback? onStop;
  final bool streaming;
  final String placeholder;
  final int maxRows;
  final int? maxLength;
  final Widget? leading;

  @override
  State<BefPromptInput> createState() => _BefPromptInputState();
}

class _BefPromptInputState extends State<BefPromptInput> {
  final _focus = FocusNode();

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_rebuild);
    _focus.addListener(_rebuild);
  }

  void _rebuild() => setState(() {});

  @override
  void dispose() {
    widget.controller.removeListener(_rebuild);
    _focus.dispose();
    super.dispose();
  }

  void _send() {
    final t = widget.controller.text.trim();
    if (t.isNotEmpty && !widget.streaming) widget.onSubmit(t);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final empty = widget.controller.text.trim().isEmpty;
    final len = widget.controller.text.length;
    final canTap = widget.streaming ? widget.onStop != null : !empty;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _focus.hasFocus ? c.ring : c.border),
        boxShadow: _focus.hasFocus
            ? [BoxShadow(color: c.ring.withValues(alpha: 0.15), spreadRadius: 3)]
            : BefShadow.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          CallbackShortcuts(
            bindings: {const SingleActivator(LogicalKeyboardKey.enter): _send},
            child: TextField(
              controller: widget.controller,
              focusNode: _focus,
              minLines: 1,
              maxLines: widget.maxRows,
              maxLength: widget.maxLength,
              keyboardType: TextInputType.multiline,
              textInputAction: TextInputAction.newline,
              style: BefText.style(context, height: 24 / 14),
              cursorColor: c.primary,
              buildCounter: (_, {required currentLength, required isFocused, maxLength}) => null,
              decoration: InputDecoration(
                border: InputBorder.none,
                isCollapsed: true,
                contentPadding: const EdgeInsets.fromLTRB(8, 6, 8, 6),
                hintText: widget.placeholder,
                hintStyle: BefText.style(context, color: c.mutedForeground, height: 24 / 14),
              ),
            ),
          ),
          Row(
            children: [
              if (widget.leading != null) widget.leading!,
              const Spacer(),
              if (widget.maxLength != null && len > widget.maxLength! * 0.8)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Text(
                    '$len/${widget.maxLength}',
                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                  ),
                ),
              BefPressable(
                semanticLabel: widget.streaming ? 'Stop generating' : 'Send',
                onPressed: canTap ? (widget.streaming ? widget.onStop : _send) : null,
                builder: (context, s) => AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(shape: BoxShape.circle, color: canTap ? c.primary : c.secondary),
                  child: Center(
                    child: widget.streaming
                        ? Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: c.primaryForeground,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          )
                        : BefIcon(
                            BefIcons.arrowUp,
                            size: 18,
                            color: canTap ? c.primaryForeground : c.mutedForeground,
                          ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
