import 'package:flutter/material.dart';

import '../befui/avatar.dart';
import '../befui/icons.dart';
import '../befui/swipe_actions.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  Widget row(String name, String subject, String preview) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: BefSwipeActions(
      actions: [
        BefSwipeAction(label: 'Star', icon: BefIcons.star, tone: BefSwipeTone.warning, onPressed: () {}),
        BefSwipeAction(
          label: 'Archive',
          icon: BefIcons.archive,
          tone: BefSwipeTone.primary,
          onPressed: () {},
        ),
        BefSwipeAction(label: 'Delete', icon: BefIcons.trash, tone: BefSwipeTone.danger, onPressed: () {}),
      ],
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            BefAvatar(name: name, size: BefAvatarSize.md),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    subject,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: BefText.style(context, size: 13, weight: FontWeight.w500),
                  ),
                  Text(
                    '$name · $preview',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
  );
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      row('Diya Rao', 'Offer letter for Kabir', 'Sent it this morning.'),
      row('Finance', 'September payroll is ready', 'Please review and approve.'),
      row('Rohan Das', 'Laptop request', 'Need a 16 GB machine.'),
      Text('Swipe a row left.', style: BefText.style(context, size: 12, color: c.mutedForeground)),
    ],
  );
}
