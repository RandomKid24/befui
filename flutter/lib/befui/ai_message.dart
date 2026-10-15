import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

enum BefFeedback { up, down }

/// One message in an AI conversation. [user] true is a right-aligned bubble; false is plain text with a sparkle avatar and an action row (copy when [plain] is set, regenerate, thumbs). While [streaming] a caret blinks at the end.
class BefAiMessage extends StatefulWidget {
  const BefAiMessage({
    super.key,
    required this.child,
    this.user = false,
    this.plain,
    this.streaming = false,
    this.onRegenerate,
    this.feedback,
    this.onFeedback,
  });
  final Widget child;
  final bool user, streaming;

  /// The message as text, copied by the Copy button.
  final String? plain;
  final VoidCallback? onRegenerate;
  final BefFeedback? feedback;
  final ValueChanged<BefFeedback?>? onFeedback;

  @override
  State<BefAiMessage> createState() => _BefAiMessageState();
}

class _BefAiMessageState extends State<BefAiMessage> with SingleTickerProviderStateMixin {
  late final AnimationController _blink = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  );
  bool _copied = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (widget.streaming && !befReduceMotion(context)) {
      _blink.repeat(reverse: true);
    } else {
      _blink.stop();
    }
  }

  @override
  void dispose() {
    _blink.dispose();
    super.dispose();
  }

  Future<void> _copy() async {
    await Clipboard.setData(ClipboardData(text: widget.plain ?? ''));
    if (!mounted) return;
    setState(() => _copied = true);
    await Future<void>.delayed(const Duration(milliseconds: 1500));
    if (mounted) setState(() => _copied = false);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    if (widget.user) {
      return Align(
        alignment: Alignment.centerRight,
        child: Container(
          constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.85),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: c.secondary,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(18),
              topRight: Radius.circular(18),
              bottomLeft: Radius.circular(18),
              bottomRight: Radius.circular(6),
            ),
          ),
          child: DefaultTextStyle.merge(
            style: BefText.style(context, color: c.secondaryForeground, height: 1.5),
            child: widget.child,
          ),
        ),
      );
    }
    Widget action(BefIconData i, String label, VoidCallback? tap, {Color? color}) => BefPressable(
      semanticLabel: label,
      onPressed: tap,
      builder: (context, s) => Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: s.contains(WidgetState.pressed) ? c.secondary : Colors.transparent,
          borderRadius: BorderRadius.circular(BefRadius.md),
        ),
        child: Center(child: BefIcon(i, size: 15, color: color ?? c.mutedForeground)),
      ),
    );
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 28,
          height: 28,
          margin: const EdgeInsets.only(top: 2),
          decoration: BoxDecoration(color: c.primary.withValues(alpha: 0.1), shape: BoxShape.circle),
          child: Center(child: BefIcon(BefIcons.sparkle, size: 14, color: c.primary)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DefaultTextStyle.merge(
                style: BefText.style(context, height: 1.6, color: c.foreground),
                child: widget.streaming
                    ? Wrap(
                        crossAxisAlignment: WrapCrossAlignment.end,
                        children: [
                          widget.child,
                          FadeTransition(
                            opacity: _blink,
                            child: Container(
                              width: 2,
                              height: 16,
                              margin: const EdgeInsets.only(left: 2, bottom: 3),
                              color: c.primary,
                            ),
                          ),
                        ],
                      )
                    : widget.child,
              ),
              if (!widget.streaming &&
                  (widget.plain != null || widget.onRegenerate != null || widget.onFeedback != null))
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Row(
                    children: [
                      if (widget.plain != null)
                        action(
                          _copied ? BefIcons.check : BefIcons.copy,
                          'Copy',
                          _copy,
                          color: _copied ? c.success : null,
                        ),
                      if (widget.onRegenerate != null)
                        action(BefIcons.refresh, 'Regenerate', widget.onRegenerate),
                      if (widget.onFeedback != null) ...[
                        action(
                          BefIcons.thumbsUp,
                          'Good response',
                          () => widget.onFeedback!(widget.feedback == BefFeedback.up ? null : BefFeedback.up),
                          color: widget.feedback == BefFeedback.up ? c.primary : null,
                        ),
                        action(
                          BefIcons.thumbsDown,
                          'Bad response',
                          () => widget.onFeedback!(
                            widget.feedback == BefFeedback.down ? null : BefFeedback.down,
                          ),
                          color: widget.feedback == BefFeedback.down ? c.primary : null,
                        ),
                      ],
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
