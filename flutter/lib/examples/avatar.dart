import 'package:flutter/material.dart';

import '../befui/avatar.dart';

const _team = [
  'Aarav Mehta',
  'Diya Rao',
  'Kabir Shah',
  'Meera Iyer',
  'Rohan Das',
  'Isha Nair',
  'Vikram Joshi',
];

Widget example(BuildContext context) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          BefAvatar(name: 'Aarav Mehta', size: BefAvatarSize.xs),
          SizedBox(width: 12),
          BefAvatar(name: 'Diya Rao'),
          SizedBox(width: 12),
          BefAvatar(name: 'Kabir Shah', size: BefAvatarSize.md),
          SizedBox(width: 12),
          BefAvatar(name: 'Meera Iyer', size: BefAvatarSize.lg),
          SizedBox(width: 12),
          BefAvatar(name: 'Rohan Das', size: BefAvatarSize.xl),
        ],
      ),
      const SizedBox(height: 24),
      const Wrap(
        spacing: 16,
        runSpacing: 12,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          BefAvatar(name: 'Aarav Mehta', size: BefAvatarSize.md, status: BefPresence.online),
          BefAvatar(name: 'Diya Rao', size: BefAvatarSize.md, status: BefPresence.away),
          BefAvatar(name: 'Kabir Shah', size: BefAvatarSize.md, status: BefPresence.busy),
          BefAvatar(name: 'Meera Iyer', size: BefAvatarSize.md, status: BefPresence.offline),
          BefAvatar(name: 'Acme Labs', size: BefAvatarSize.md, shape: BefAvatarShape.square),
          BefAvatar(
            name: 'Globex',
            size: BefAvatarSize.md,
            shape: BefAvatarShape.square,
            status: BefPresence.online,
          ),
        ],
      ),
      const SizedBox(height: 24),
      const BefAvatarGroup(names: _team),
      const SizedBox(height: 24),
      const BefAvatarGroup(names: _team, max: 3, size: BefAvatarSize.md, shape: BefAvatarShape.square),
      const SizedBox(height: 24),
      const BefUserInfo(
        name: 'Aarav Mehta',
        subtitle: 'Senior engineer · Pune',
        status: BefPresence.online,
        size: BefAvatarSize.md,
      ),
      const SizedBox(height: 12),
      const BefUserInfo(name: 'Diya Rao', subtitle: 'diya.rao@acme.in'),
    ],
  );
}
