// Site and presentation content shared by the home page and /deck (exported to PDF with `npm run pdf`).
// Project basics feed the home page sections; intro, meta and highlights come from each case study page.

export const projects = [
  {
    slug: 'crm', eyebrow: 'Lampara · Sales and projects', title: 'Inquiry to after-sales',
    description: 'Leads, site inspections, quotes, contracts, installations and service tickets in one pipeline that moves itself.',
    roles: 'Owner · Admin · Field technician',
    laptop: { src: '/assets/work/crm/dashboard.webp', alt: 'Lampara CRM dashboard with project totals, recent projects and upcoming inspections' },
  },
  {
    slug: 'warehouse', eyebrow: 'Lampara · Warehouse', title: 'Every item, accounted for',
    description: 'Stock, material requests, approvals, releases, returns and inverter serials, with a name next to every item.',
    roles: 'Manager · Warehouse staff · Engineer',
    laptop: { src: '/assets/work/warehouse/stock.webp', alt: 'Warehouse stock list with quantities per item' },
  },
  {
    slug: 'hr', eyebrow: 'Lampara · HR and payroll', title: 'Payroll on your rules',
    description: 'Attendance from the phone, manpower plans, timesheets and payroll computed on the company’s own rules.',
    roles: 'HR · Manager · Crew leader · Employee',
    laptop: { src: '/assets/work/hr/payroll.webp', alt: 'Payroll run with computed pay per employee' },
    phone: { src: '/assets/work/hr/m-time-in.webp', alt: 'Time-in screen on the phone app' },
  },
  {
    slug: 'website', eyebrow: 'Lampara · Website', title: 'A storefront that books installs',
    description: 'A savings calculator, real install gallery and booking calendar that turn visitors into inquiries.',
    roles: 'Homeowners · Businesses · Lampara team',
    laptop: { src: '/assets/work/website/hero.webp', alt: 'Lampara website home page' },
    phone: { src: '/assets/work/website/m-hero.webp', alt: 'Lampara website on a phone' },
  },
];

export const projectDetails: Record<string, { intro: string; meta: [string, string][]; highlights: { src: string; title: string; text: string }[] }> = {
  "crm": {
    "intro": "Lampara sells and installs solar systems across Metro Manila and CALABARZON. Every job used to live in notebooks, Excel quotes and group chats. I built one system that follows each customer from the first inquiry to after-sales service.",
    "meta": [
      [
        "Client",
        "Lampara Electrical Installation Services"
      ],
      [
        "Industry",
        "Solar installation, Philippines"
      ],
      [
        "Platforms",
        "Web and Android app"
      ],
      [
        "Used by",
        "Owner, office staff, field technicians"
      ]
    ],
    "highlights": [
      {
        "src": "/assets/work/crm/inspection-report.webp",
        "title": "The paper inspection form, now on a phone",
        "text": "The site inspection report mirrors the printed form the surveyors already used: roof, mounting, electrical, photos per section."
      },
      {
        "src": "/assets/work/crm/quote-items.webp",
        "title": "Quotes built from packages",
        "text": "Start from a saved package, adjust items and prices, and keep every version. Approving a quote locks its numbers."
      },
      {
        "src": "/assets/work/crm/contract.webp",
        "title": "Contracts generated from the approved quote",
        "text": "Contract details, materials and payment terms come straight from the approved quote and print as a PDF. The signed copy is uploaded back."
      },
      {
        "src": "/assets/work/crm/service-tickets.webp",
        "title": "After-sales and warranty",
        "text": "Every customer keeps a service history, with warranty status on each ticket."
      }
    ]
  },
  "warehouse": {
    "intro": "Lampara’s warehouse supplies every installation: panels, inverters, batteries, cables and tools. Materials went out to sites and did not always come back on paper. This module puts every item, request and release on record.",
    "meta": [
      [
        "Client",
        "Lampara Electrical Installation Services"
      ],
      [
        "Area",
        "Warehouse and inventory"
      ],
      [
        "Platforms",
        "Web and Android app"
      ],
      [
        "Used by",
        "Manager, warehouse staff, engineers, admin"
      ]
    ],
    "highlights": [
      {
        "src": "/assets/work/warehouse/receive-delivery.webp",
        "title": "Receive deliveries",
        "text": "Log what arrived, from which supplier, against which PO, in one step."
      },
      {
        "src": "/assets/work/warehouse/request-approval.webp",
        "title": "Approve before anything leaves",
        "text": "A manager approves each request. Approved items are reserved, so two projects cannot claim the same stock."
      },
      {
        "src": "/assets/work/warehouse/release-return.webp",
        "title": "Releases and returns, on record",
        "text": "Every release names who picked it up. Serial numbers are captured on release, and returns are reviewed before going back into stock."
      },
      {
        "src": "/assets/work/warehouse/serial-numbers.webp",
        "title": "Every inverter serial, traceable",
        "text": "Look up any serial number: when it was received, and which project it was released to."
      }
    ]
  },
  "hr": {
    "intro": "Lampara’s crews work across many sites each day. Attendance arrived by message, and payroll was computed by hand from HR’s spreadsheet every cutoff. This module takes attendance from phones and computes payroll the way HR already did.",
    "meta": [
      [
        "Client",
        "Lampara Electrical Installation Services"
      ],
      [
        "Area",
        "HR, attendance and payroll"
      ],
      [
        "Platforms",
        "Web and Android app"
      ],
      [
        "Used by",
        "HR, managers, crew leaders, employees"
      ]
    ],
    "highlights": [
      {
        "src": "/assets/work/hr/today.webp",
        "title": "Today, at a glance",
        "text": "Who is in, who is late, and who has not timed out yet, grouped by today’s site plan."
      },
      {
        "src": "/assets/work/hr/approvals.webp",
        "title": "One queue for approvals",
        "text": "Overtime, time corrections, manual entries, leave and expenses, each approved or rejected with a reason."
      },
      {
        "src": "/assets/work/hr/timesheet.webp",
        "title": "Timesheet per cutoff",
        "text": "A grid of every employee and every day in the cutoff, with lates, absences and missing time-outs marked."
      },
      {
        "src": "/assets/work/hr/pay-settings.webp",
        "title": "The pay rules, as settings",
        "text": "Rest day, special and regular holiday multipliers, contributions, and late and undertime rules, taken from HR’s own sheet."
      }
    ]
  },
  "website": {
    "intro": "lamparaeis.com is Lampara’s public website. It shows real installations, estimates savings from a customer’s electric bill, and lets them request a quote or book an installation date.",
    "meta": [
      [
        "Client",
        "Lampara Electrical Installation Services"
      ],
      [
        "Type",
        "Marketing website with admin"
      ],
      [
        "Platforms",
        "Web, built for phones first"
      ]
    ],
    "highlights": [
      {
        "src": "/assets/work/website/calculator.webp",
        "title": "Savings calculator",
        "text": "Enter a monthly electric bill and see the recommended system size, monthly savings and payback, with the assumptions stated plainly."
      },
      {
        "src": "/assets/work/website/gallery.webp",
        "title": "Real installations",
        "text": "A portfolio of completed projects, filterable by residential, commercial and industrial, with photos for each."
      },
      {
        "src": "/assets/work/website/booking.webp",
        "title": "Book an installation date",
        "text": "Customers see monthly availability and request a slot directly."
      },
      {
        "src": "/assets/work/website/faq.webp",
        "title": "Answers before the first message",
        "text": "Common questions on savings, brownouts, warranties and permits, then a free consultation request."
      }
    ]
  }
};

export const problems = [
  ['Excel files everywhere', 'Five versions of the same sheet, and nobody knows which one is right.'],
  ['Updates live in group chats', 'Where is that project? Ask around, scroll up, hope someone remembers.'],
  ['Stock that doesn’t add up', 'Materials go out to sites and never quite come back on paper.'],
  ['Payroll eats the week', 'Time sheets, rounding rules and deductions, all computed by hand every cutoff.'],
];

export const services = [
  ['Sales and project systems', 'For solar, construction, electrical, aircon and fit-out businesses: lead and job pipeline, site reports on mobile, quotes, contracts, service and warranty.'],
  ['Warehouse and inventory', 'For hardware, supplies, trading and logistics: inventory and counts, requests and approvals, releases and returns, serial and batch tracking.'],
  ['HR, attendance and payroll', 'For any growing company: employee records, attendance and DTR, payroll computed on your own rules, payslips and reports.'],
  ['Websites and landing pages', 'A site that turns visitors into inquiries: your real projects, a quote or booking form, and an admin page so your team keeps it current.'],
  ['Monthly care', 'Hosting, fixes, support and small improvements every month, as your business changes.'],
];

export const steps = [
  ['Map your process', 'We sit with your team and collect the forms, sheets and steps you use today.'],
  ['Build in weeks', 'You see working screens early and often, not one big reveal at the end.'],
  ['Test safely', 'Every change is tried on a test copy first, so your live data is never at risk.'],
  ['Launch and grow', 'Staff training, then ongoing updates as your business changes.'],
];
