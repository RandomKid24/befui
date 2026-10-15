import 'package:flutter/material.dart';

import '../befui/chat.dart';

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
  Widget build(BuildContext context) => SizedBox(
    height: 420,
    child: BefChat(me: 'You', messages: messages, onSend: send, typing: typing),
  );
}
