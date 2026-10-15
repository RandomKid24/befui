import 'package:flutter/material.dart';

import '../befui/comment_thread.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var comments = const [
    BefComment(
      id: '1',
      author: 'Meera Shah',
      time: '2h ago',
      body: 'Can we move the review to Thursday?',
      replies: [BefComment(id: '2', author: 'Rohan Iyer', time: '1h ago', body: 'Thursday works for me.')],
    ),
    BefComment(id: '3', author: 'Kabir Anand', time: '30m ago', body: 'Added the updated budget sheet.'),
  ];

  List<BefComment> add(List<BefComment> list, String parent, BefComment c) => [
    for (final x in list)
      x.id == parent
          ? BefComment(id: x.id, author: x.author, time: x.time, body: x.body, replies: [...x.replies, c])
          : BefComment(
              id: x.id,
              author: x.author,
              time: x.time,
              body: x.body,
              replies: add(x.replies, parent, c),
            ),
  ];

  @override
  Widget build(BuildContext context) => BefCommentThread(
    comments: comments,
    onReply: (p, text) => setState(
      () => comments = add(
        comments,
        p,
        BefComment(
          id: '${DateTime.now().microsecondsSinceEpoch}',
          author: 'You',
          time: 'just now',
          body: text,
        ),
      ),
    ),
  );
}
