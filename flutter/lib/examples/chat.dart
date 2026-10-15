import 'package:flutter/material.dart';

import '../befui/chat.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  static BefChatMessage m(String id, String from, String text, int ago) => BefChatMessage(
    id: id,
    from: from,
    text: text,
    at: DateTime.now().subtract(Duration(minutes: ago)),
  );

  late var messages = [
    m('1', 'Diya Rao', 'Hey! Did the offer letter go out to Kabir?', 14),
    m('2', 'Diya Rao', 'He is asking about the joining date.', 13),
    m('3', 'You', 'Sent it this morning. Joining is 3 Nov.', 9),
    m('4', 'Diya Rao', 'Perfect, I will update the onboarding board.', 8),
  ];
  String? typing;

  void send(String text) {
    setState(() {
      messages = [
        ...messages,
        BefChatMessage(id: '${messages.length + 1}', from: 'You', text: text, at: DateTime.now()),
      ];
      typing = 'Diya Rao';
    });
    Future<void>.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      setState(() {
        typing = null;
        messages = [
          ...messages,
          BefChatMessage(
            id: '${messages.length + 1}',
            from: 'Diya Rao',
            text: 'Got it, thanks!',
            at: DateTime.now(),
          ),
        ];
      });
    });
  }

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Send a message, a reply follows',
      SizedBox(
        height: 420,
        child: BefChat(me: 'You', messages: messages, onSend: send, typing: typing),
      ),
    ),
  ]);
}

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
