import 'package:flutter/material.dart';

import '../befui/avatar.dart';
import '../befui/theme.dart';

const _team = [
  'Aarav Mehta',
  'Diya Rao',
  'Kabir Shah',
  'Meera Iyer',
  'Rohan Das',
  'Isha Nair',
  'Vikram Joshi',
];

Widget example(BuildContext context) => _groups(context, [
  (
    'Sizes',
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
  ),
  (
    'Presence',
    const Wrap(
      spacing: 16,
      runSpacing: 12,
      children: [
        BefAvatar(name: 'Aarav Mehta', size: BefAvatarSize.md, status: BefPresence.online),
        BefAvatar(name: 'Diya Rao', size: BefAvatarSize.md, status: BefPresence.away),
        BefAvatar(name: 'Kabir Shah', size: BefAvatarSize.md, status: BefPresence.busy),
        BefAvatar(name: 'Meera Iyer', size: BefAvatarSize.md, status: BefPresence.offline),
      ],
    ),
  ),
  (
    'Square',
    const Wrap(
      spacing: 16,
      children: [
        BefAvatar(name: 'Acme Labs', size: BefAvatarSize.md, shape: BefAvatarShape.square),
        BefAvatar(
          name: 'Globex',
          size: BefAvatarSize.md,
          shape: BefAvatarShape.square,
          status: BefPresence.online,
        ),
      ],
    ),
  ),
  ('Group', const BefAvatarGroup(names: _team)),
  (
    'Group, capped at three',
    const BefAvatarGroup(names: _team, max: 3, size: BefAvatarSize.md, shape: BefAvatarShape.square),
  ),
  (
    'With name and details',
    const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BefUserInfo(
          name: 'Aarav Mehta',
          subtitle: 'Senior engineer · Pune',
          status: BefPresence.online,
          size: BefAvatarSize.md,
        ),
        SizedBox(height: 12),
        BefUserInfo(name: 'Diya Rao', subtitle: 'diya.rao@acme.in'),
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
