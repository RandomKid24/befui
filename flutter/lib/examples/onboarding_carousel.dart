import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/onboarding_carousel.dart';

Widget example(BuildContext context) => SizedBox(
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
);
