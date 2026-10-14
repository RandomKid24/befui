import 'package:flutter/material.dart';

import '../befui/accordion.dart';

Widget example(BuildContext context) {
  return const BefAccordion(
    initiallyOpen: ['a'],
    items: [
      BefAccordionItem(
        id: 'a',
        title: 'How are leave balances calculated?',
        content: Text('Accrual runs on the first of every month, pro-rated for new joiners.'),
      ),
      BefAccordionItem(
        id: 'b',
        title: 'Can managers delegate approvals?',
        content: Text('Yes. Set a delegate for any date range from the approvals page.'),
      ),
      BefAccordionItem(
        id: 'c',
        title: 'Where is payroll data stored?',
        content: Text('Encrypted at rest, in the region you pick at signup.'),
      ),
    ],
  );
}
