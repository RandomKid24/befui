import 'package:flutter/material.dart';

import '../befui/bar_list.dart';

Widget example(BuildContext context) {
  return const BefBarList(
    items: [
      BefBarListItem(label: '/pricing', value: 12840),
      BefBarListItem(label: '/docs/getting-started', value: 9210),
      BefBarListItem(label: '/blog/launch-notes', value: 5632),
      BefBarListItem(label: '/signup', value: 3120),
      BefBarListItem(label: '/changelog', value: 1480),
    ],
  );
}
