import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/timeline.dart';

Widget example(BuildContext context) {
  return const BefTimeline(
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
  );
}
