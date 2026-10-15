import 'dart:async';

import 'package:flutter/material.dart';

import '../befui/ai_chat.dart';
import '../befui/icons.dart';
import '../befui/prompt_suggestions.dart';
import '../befui/streaming_text.dart';

const _suggestions = [
  BefSuggestion(
    id: '1',
    label: 'Summarise this week',
    hint: 'Attendance, leave and approvals',
    icon: BefIcon(BefIcons.calendar),
  ),
  BefSuggestion(
    id: '2',
    label: 'Draft an offer letter',
    hint: 'From a role and a salary',
    icon: BefIcon(BefIcons.fileText),
  ),
  BefSuggestion(
    id: '3',
    label: 'Who is out tomorrow?',
    hint: 'Across all teams',
    icon: BefIcon(BefIcons.users),
  ),
];

const _replies = [
  'Here is the short version: 142 people are in, 9 are on leave, and 6 approvals are waiting for you.',
  'Sure. I would start with the role, the band and the joining date, then add the notice period and the probation terms.',
];

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  final text = TextEditingController();
  var messages = <BefChatEntry>[];
  bool thinking = false, streaming = false;
  int n = 0;
  Timer? timer;

  @override
  void dispose() {
    timer?.cancel();
    text.dispose();
    super.dispose();
  }

  void send(String t) {
    final reply = _replies[n++ % _replies.length];
    text.clear();
    setState(() {
      messages = [...messages, BefChatEntry(id: 'u${messages.length}', user: true, child: Text(t))];
      thinking = true;
      streaming = true;
    });
    timer = Timer(const Duration(milliseconds: 1400), () {
      if (!mounted) return;
      setState(() {
        thinking = false;
        messages = [
          ...messages,
          BefChatEntry(
            id: 'a${messages.length}',
            plain: reply,
            child: BefStreamingText(
              text: reply,
              speed: 16,
              caret: false,
              onDone: () => mounted ? setState(() => streaming = false) : null,
            ),
          ),
        ];
      });
    });
  }

  void stop() {
    timer?.cancel();
    setState(() {
      thinking = false;
      streaming = false;
    });
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 520,
    child: BefAiChat(
      messages: messages,
      controller: text,
      onSubmit: send,
      onStop: stop,
      thinking: thinking,
      streaming: streaming,
      greeting: 'What are you working on?',
      suggestions: _suggestions,
      onSuggestion: (s) => send(s.label),
    ),
  );
}
