import 'package:flutter/material.dart';

import 'avatar.dart';
import 'button.dart';
import 'input.dart';
import 'theme.dart';

class BefComment {
  const BefComment({
    required this.id,
    required this.author,
    required this.time,
    required this.body,
    this.replies = const [],
  });
  final String id, author, time, body;
  final List<BefComment> replies;
}

/// Nested comments with a Reply action (up to three levels). [onReply] gets the parent id and the text; add the new comment to your list.
class BefCommentThread extends StatelessWidget {
  const BefCommentThread({super.key, required this.comments, this.onReply});
  final List<BefComment> comments;
  final void Function(String parentId, String text)? onReply;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < comments.length; i++) ...[
        if (i > 0) const SizedBox(height: 16),
        _Item(comment: comments[i], onReply: onReply, depth: 0),
      ],
    ],
  );
}

class _Item extends StatefulWidget {
  const _Item({required this.comment, required this.onReply, required this.depth});
  final BefComment comment;
  final void Function(String, String)? onReply;
  final int depth;
  @override
  State<_Item> createState() => _ItemState();
}

class _ItemState extends State<_Item> {
  bool _replying = false;
  final _text = TextEditingController();

  @override
  void dispose() {
    _text.dispose();
    super.dispose();
  }

  void _send() {
    final t = _text.text.trim();
    if (t.isEmpty) return;
    widget.onReply?.call(widget.comment.id, t);
    _text.clear();
    setState(() => _replying = false);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final k = widget.comment;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BefAvatar(name: k.author, size: BefAvatarSize.sm),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text.rich(
                    TextSpan(
                      style: BefText.style(context, size: 13, color: c.mutedForeground),
                      children: [
                        TextSpan(
                          text: k.author,
                          style: TextStyle(fontWeight: FontWeight.w600, color: c.foreground),
                        ),
                        TextSpan(text: ' · ${k.time}', style: const TextStyle(fontSize: 12)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(k.body, style: BefText.style(context, size: 13)),
                  if (widget.onReply != null && widget.depth < 3 && !_replying)
                    GestureDetector(
                      onTap: () => setState(() => _replying = true),
                      child: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          'Reply',
                          style: BefText.style(
                            context,
                            size: 12,
                            weight: FontWeight.w500,
                            color: c.mutedForeground,
                          ),
                        ),
                      ),
                    ),
                  if (_replying) ...[
                    const SizedBox(height: 8),
                    BefInput.textarea(
                      controller: _text,
                      placeholder: 'Reply to ${k.author}',
                      autofocus: true,
                      minHeight: 64,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        BefButton(label: 'Reply', size: BefButtonSize.xs, onPressed: _send),
                        const SizedBox(width: 8),
                        BefButton(
                          label: 'Cancel',
                          size: BefButtonSize.xs,
                          variant: BefButtonVariant.ghost,
                          onPressed: () => setState(() => _replying = false),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
        if (k.replies.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(left: 15, top: 12),
            child: Container(
              padding: const EdgeInsets.only(left: 16),
              decoration: BoxDecoration(
                border: Border(left: BorderSide(color: c.border)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (var i = 0; i < k.replies.length; i++) ...[
                    if (i > 0) const SizedBox(height: 16),
                    _Item(comment: k.replies[i], onReply: widget.onReply, depth: widget.depth + 1),
                  ],
                ],
              ),
            ),
          ),
      ],
    );
  }
}
