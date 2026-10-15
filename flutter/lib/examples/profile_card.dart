import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/profile_card.dart';

Widget example(BuildContext context) => const BefProfileCard(
  name: 'Aarav Mehta',
  role: 'Senior engineer, Platform',
  location: 'Pune, India',
  status: 'Online',
  stats: [
    BefProfileStat(label: 'Projects', value: '14'),
    BefProfileStat(label: 'Reports', value: '5'),
    BefProfileStat(label: 'Years', value: '4.5'),
  ],
  actions: [
    BefButton(label: 'Message', variant: BefButtonVariant.outline),
    BefButton(label: 'View profile'),
  ],
);
