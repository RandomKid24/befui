import 'package:flutter/material.dart';

import '../befui/countdown.dart';

Widget example(BuildContext context) =>
    BefCountdown(to: DateTime.now().add(const Duration(days: 3, hours: 4)));
