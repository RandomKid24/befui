import 'package:flutter/material.dart';

import '../befui/relative_time.dart';

Widget example(BuildContext context) => BefRelativeTime(DateTime.now().subtract(const Duration(minutes: 3)));
