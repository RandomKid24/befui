import 'package:flutter/material.dart';

import 'ai_message.dart';
import 'icons.dart';
import 'prompt_input.dart';
import 'prompt_suggestions.dart';
import 'thinking.dart';
import 'theme.dart';

class BefChatEntry {
  const BefChatEntry({
    required this.id,
    required this.child,
    this.user = false,
    this.plain,
    this.streaming = false,
  });
  final String id;
  final Widget child;
  final bool user, streaming;

  /// Plain text of an assistant message, for its Copy button.
  final String? plain;
}

/// A whole AI chat in one piece: the conversation (follows the newest message, with a "Latest" button when you scroll up), a greeting and starter prompts while empty, a Thinking row while [thinking], and the prompt box pinned at the bottom. Give it a height. Controlled: you own [messages] and the [controller].
class BefAiChat extends StatefulWidget {
  const BefAiChat({
    super.key,
    required this.messages,
    required this.controller,
    required this.onSubmit,
    this.onStop,
    this.streaming = false,
    this.thinking = false,
    this.greeting = 'How can I help?',
    this.suggestions = const [],
    this.onSuggestion,
    this.placeholder = 'Message the assistant',
  });
  final List<BefChatEntry> messages;
  final TextEditingController controller;
  final ValueChanged<String> onSubmit;
  final VoidCallback? onStop;
  final bool streaming, thinking;
  final String greeting;
  final List<BefSuggestion> suggestions;
  final ValueChanged<BefSuggestion>? onSuggestion;
  final String placeholder;

  @override
  State<BefAiChat> createState() => _BefAiChatState();
}

class _BefAiChatState extends State<BefAiChat> {
  final _scroll = ScrollController();
  bool _away = false;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      if (!_scroll.hasClients) return;
      final far = _scroll.position.maxScrollExtent - _scroll.offset > 80;
      if (far != _away) setState(() => _away = far);
    });
  }

  @override
  void didUpdateWidget(BefAiChat old) {
    super.didUpdateWidget(old);
    if (!_away && (old.messages.length != widget.messages.length || old.thinking != widget.thinking)) {
      _toEnd();
    }
  }

  void _toEnd() => WidgetsBinding.instance.addPostFrameCallback((_) {
    if (_scroll.hasClients) {
      _scroll.animateTo(
        _scroll.position.maxScrollExtent,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    }
  });

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final empty = widget.messages.isEmpty && !widget.thinking;
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.background,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: c.border),
      ),
      child: Stack(
        children: [
          Column(
            children: [
              Expanded(
                child: empty
                    ? ListView(
                        padding: const EdgeInsets.all(20),
                        children: [
                          const SizedBox(height: 24),
                          Center(
                            child: Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: c.primary.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Center(child: BefIcon(BefIcons.sparkle, size: 20, color: c.primary)),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Center(
                            child: Text(
                              widget.greeting,
                              style: BefText.style(
                                context,
                                size: 18,
                                weight: FontWeight.w600,
                                letterSpacing: -0.3,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          if (widget.suggestions.isNotEmpty)
                            BefPromptSuggestions(
                              items: widget.suggestions,
                              onSelect: (s) => widget.onSuggestion?.call(s),
                            ),
                        ],
                      )
                    : ListView(
                        controller: _scroll,
                        padding: const EdgeInsets.all(16),
                        children: [
                          for (final m in widget.messages)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 20),
                              child: BefAiMessage(
                                user: m.user,
                                plain: m.plain,
                                streaming: m.streaming,
                                child: m.child,
                              ),
                            ),
                          if (widget.thinking)
                            const Padding(
                              padding: EdgeInsets.only(left: 40, bottom: 12),
                              child: BefThinking(),
                            ),
                        ],
                      ),
              ),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  border: Border(top: BorderSide(color: c.border)),
                ),
                child: BefPromptInput(
                  controller: widget.controller,
                  onSubmit: widget.onSubmit,
                  onStop: widget.onStop,
                  streaming: widget.streaming,
                  placeholder: widget.placeholder,
                ),
              ),
            ],
          ),
          if (_away)
            Positioned(
              bottom: 112,
              left: 0,
              right: 0,
              child: Center(
                child: GestureDetector(
                  onTap: _toEnd,
                  child: Semantics(
                    button: true,
                    label: 'Jump to latest',
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: c.background,
                        borderRadius: BorderRadius.circular(BefRadius.full),
                        border: Border.all(color: c.border),
                        boxShadow: BefShadow.md,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          BefIcon(BefIcons.arrowDown, size: 14),
                          const SizedBox(width: 6),
                          Text('Latest', style: BefText.style(context, size: 12, weight: FontWeight.w500)),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
