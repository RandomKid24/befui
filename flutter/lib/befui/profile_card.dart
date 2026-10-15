import 'package:flutter/material.dart';

import 'avatar.dart';
import 'theme.dart';

class BefProfileStat {
  const BefProfileStat({required this.label, required this.value});
  final String label;
  final String value;
}

/// A person card: tinted banner, overlapping avatar, name, role, location and a row of stats. [actions] go at the bottom.
class BefProfileCard extends StatelessWidget {
  const BefProfileCard({
    super.key,
    required this.name,
    this.role,
    this.location,
    this.status,
    this.stats = const [],
    this.actions = const [],
    this.width = 288,
  });
  final String name;
  final String? role, location, status;
  final List<BefProfileStat> stats;
  final List<Widget> actions;
  final double width;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      width: width,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
        boxShadow: BefShadow.sm,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(height: 80, color: c.primary.withValues(alpha: 0.1)),
          Transform.translate(
            offset: const Offset(0, -36),
            child: Container(
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(shape: BoxShape.circle, color: c.card),
              child: BefAvatar(name: name, size: BefAvatarSize.xl),
            ),
          ),
          Transform.translate(
            offset: const Offset(0, -28),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  name,
                  style: BefText.style(context, size: 15, weight: FontWeight.w600, color: c.cardForeground),
                ),
                if (status != null) Text(status!, style: BefText.style(context, size: 12, color: c.success)),
                if (role != null)
                  Text(role!, style: BefText.style(context, size: 13, color: c.mutedForeground)),
                if (location != null)
                  Text(location!, style: BefText.style(context, size: 12, color: c.mutedForeground)),
              ],
            ),
          ),
          if (stats.isNotEmpty)
            Container(
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: c.border)),
              ),
              child: IntrinsicHeight(
                child: Row(
                  children: [
                    for (var i = 0; i < stats.length; i++) ...[
                      if (i > 0) VerticalDivider(width: 1, color: c.border),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Column(
                            children: [
                              Text(
                                stats[i].value,
                                style: BefText.style(
                                  context,
                                  weight: FontWeight.w600,
                                  color: c.cardForeground,
                                ),
                              ),
                              Text(
                                stats[i].label,
                                style: BefText.style(context, size: 12, color: c.mutedForeground),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          if (actions.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  for (var i = 0; i < actions.length; i++) ...[
                    if (i > 0) const SizedBox(width: 8),
                    Expanded(child: actions[i]),
                  ],
                ],
              ),
            ),
        ],
      ),
    );
  }
}
