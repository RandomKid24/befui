import 'package:flutter/material.dart';

import '../befui/order_tracker.dart';

Widget example(BuildContext context) => const BefOrderTracker(
  current: 2,
  steps: [
    BefOrderStep(label: 'Ordered', time: '10 Oct, 9:12 am'),
    BefOrderStep(label: 'Packed', time: '10 Oct, 6:40 pm'),
    BefOrderStep(label: 'Shipped', description: 'Pune hub', time: '11 Oct, 8:05 am'),
    BefOrderStep(label: 'Out for delivery'),
    BefOrderStep(label: 'Delivered'),
  ],
);
