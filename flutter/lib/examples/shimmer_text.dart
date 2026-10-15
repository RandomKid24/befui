import 'package:flutter/material.dart';

import '../befui/shimmer_text.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => BefShimmerText(
  'Generating your report…',
  style: BefText.style(context, size: 18, weight: FontWeight.w600),
);
