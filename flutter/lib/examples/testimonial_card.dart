import 'package:flutter/material.dart';

import '../befui/testimonial_card.dart';

Widget example(BuildContext context) => const BefTestimonialCard(
  rating: 5,
  name: 'Ananya Rao',
  role: 'Head of People, Northwind',
  quote: 'We replaced three spreadsheets with one screen. Approvals that took a day now take minutes.',
);
