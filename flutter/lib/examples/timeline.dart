import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/theme.dart';
import '../befui/timeline.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Hiring history',
    const BefTimeline(
      items: [
        BefTimelineItem(
          title: 'Offer accepted',
          description: 'Signed digitally by the candidate.',
          time: '2h ago',
          tone: BefTimelineTone.success,
          icon: BefIcon(BefIcons.check),
        ),
        BefTimelineItem(
          title: 'Documents uploaded',
          time: 'Yesterday',
          tone: BefTimelineTone.info,
          icon: BefIcon(BefIcons.file),
        ),
        BefTimelineItem(
          title: 'Background check failed',
          description: 'Address could not be verified.',
          time: 'Mon',
          tone: BefTimelineTone.danger,
          icon: BefIcon(BefIcons.x),
        ),
        BefTimelineItem(title: 'Application received', time: 'Last week', icon: BefIcon(BefIcons.userPlus)),
      ],
    ),
  ),
]);

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
