import 'package:flutter/material.dart';

import 'avatar.dart';
import 'icons.dart';
import 'input.dart';
import 'theme.dart';

class BefChatMessage {
  const BefChatMessage({required this.id, required this.from, required this.text, required this.at});
  final String id, from, text;
  final DateTime at;
}

String _clock(DateTime d) {
  final h = d.hour % 12 == 0 ? 12 : d.hour % 12;
  return '$h:${d.minute.toString().padLeft(2, '0')} ${d.hour < 12 ? 'am' : 'pm'}';
}

/// Message list with a composer. [me] is your name: those bubbles sit right in the primary colour, the rest on the left with an avatar. Scrolls to the newest message; [typing] (a name) shows "is typing". Give it a height.
class BefChat extends StatefulWidget {
  const BefChat({
    super.key,
    required this.messages,
    required this.me,
    required this.onSend,
    this.typing,
    this.placeholder = 'Write a message',
  });
  final List<BefChatMessage> messages;
  final String me;
  final ValueChanged<String> onSend;
  final String? typing;
  final String placeholder;

  @override
  State<BefChat> createState() => _BefChatState();
}

class _BefChatState extends State<BefChat> {
  final _scroll = ScrollController();
  final _text = TextEditingController();

  @override
  void didUpdateWidget(BefChat old) {
    super.didUpdateWidget(old);
    if (old.messages.length != widget.messages.length || old.typing != widget.typing) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scroll.hasClients)
          _scroll.animateTo(
            _scroll.position.maxScrollExtent,
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOut,
          );
      });
    }
  }

  @override
  void dispose() {
    _scroll.dispose();
    _text.dispose();
    super.dispose();
  }

  void _send() {
    final t = _text.text.trim();
    if (t.isEmpty) return;
    widget.onSend(t);
    _text.clear();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final m = widget.messages;
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
      ),
      child: Column(
        children: [
          Expanded(
            child: ListView(
              controller: _scroll,
              padding: const EdgeInsets.all(16),
              children: [
                for (var i = 0; i < m.length; i++) _bubble(context, m, i),
                if (widget.typing != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      '${widget.typing} is typing…',
                      style: BefText.style(context, size: 12, color: c.mutedForeground),
                    ),
                  ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: c.border)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: BefInput(
                    controller: _text,
                    placeholder: widget.placeholder,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _send(),
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: _send,
                  child: Semantics(
                    button: true,
                    label: 'Send',
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: c.primary,
                        borderRadius: BorderRadius.circular(BefRadius.md),
                      ),
                      child: Center(child: BefIcon(BefIcons.send, size: 16, color: c.primaryForeground)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _bubble(BuildContext context, List<BefChatMessage> m, int i) {
    final c = context.bef;
    final msg = m[i];
    final mine = msg.from == widget.me;
    final firstOfRun = i == 0 || m[i - 1].from != msg.from;
    final lastOfRun = i == m.length - 1 || m[i + 1].from != msg.from;
    return Padding(
      padding: EdgeInsets.only(top: firstOfRun && i > 0 ? 12 : 4),
      child: Row(
        mainAxisAlignment: mine ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!mine)
            SizedBox(
              width: 32,
              child: lastOfRun ? BefAvatar(name: msg.from, size: BefAvatarSize.sm) : null,
            ),
          if (!mine) const SizedBox(width: 8),
          Flexible(
            child: Column(
              crossAxisAlignment: mine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                Container(
                  constraints: const BoxConstraints(maxWidth: 260),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: mine ? c.primary : c.secondary,
                    borderRadius: BorderRadius.circular(16).copyWith(
                      bottomRight: mine && lastOfRun ? const Radius.circular(4) : null,
                      bottomLeft: !mine && lastOfRun ? const Radius.circular(4) : null,
                    ),
                  ),
                  child: Text(
                    msg.text,
                    style: BefText.style(context, color: mine ? c.primaryForeground : c.secondaryForeground),
                  ),
                ),
                if (lastOfRun)
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: Text(
                      _clock(msg.at),
                      style: BefText.style(context, size: 11, color: c.mutedForeground),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
