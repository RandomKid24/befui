import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/onboarding_carousel.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'First-run intro',
    SizedBox(
      height: 460,
      child: BefOnboardingCarousel(
        onFinish: () {},
        slides: const [
          BefOnboardingSlide(
            title: 'Apply for leave in seconds',
            description: 'Pick your dates, choose an approver and send. No emails, no spreadsheets.',
            visual: BefIcon(BefIcons.calendar, size: 48),
          ),
          BefOnboardingSlide(
            title: 'Know where your team is',
            description: 'See who is in, out or on leave today, right from the home screen.',
            visual: BefIcon(BefIcons.users, size: 48),
          ),
          BefOnboardingSlide(
            title: 'Never miss an approval',
            description: 'Get a nudge when something needs your attention, and none when it does not.',
            visual: BefIcon(BefIcons.bell, size: 48),
          ),
        ],
      ),
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
