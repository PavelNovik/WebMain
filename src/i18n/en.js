export default {
  code: 'en',
  locale: 'en_US',
  label: 'EN',
  name: 'English',

  meta: {
    title: 'Pixel Studio — websites in 7 days | Business card sites, landing pages, SPA',
    description:
      'We build business card websites, landing pages and single-page apps in 7 days. Fixed price, responsive design, WCAG accessibility, SEO and post-launch support. Free quote.',
    tagline: 'Websites that launch in a week',
  },

  nav: {
    items: ['Why us', 'Services', 'Process', 'Work', 'FAQ', 'Contact'],
    label: 'Main navigation',
    cta: 'Get a quote',
    skip: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    lang: 'Choose language',
    home: 'Home',
  },

  hero: {
    badge: 'Now booking projects for this month',
    title: ['Your website', 'in 7 days'],
    text: 'We build business card websites, landing pages and single-page web apps. Fast, polished and at a fixed price — no months of waiting and endless approvals.',
    cta: 'Discuss your project',
    secondary: 'See pricing',
    stats: [
      { value: '7', label: 'days to launch' },
      { value: '100%', label: 'mobile-friendly' },
      { value: '0 zł', label: 'for the first revisions' },
    ],
    scroll: 'Scroll down',
  },


  advantages: {
    eyebrow: 'Why us',
    title: 'Fast doesn’t mean sloppy',
    text: 'We specialise in small projects and have refined our process: every day of work is planned, and you see progress in real time.',
    items: [
      { icon: '⚡', title: 'Launch in a week', text: 'A clear day-by-day plan: after 7 days your site is live and bringing in clients.' },
      { icon: '🏷️', title: 'Fixed price', text: 'You know the cost before we start. No “oh, that’s extra” surprises.' },
      { icon: '📱', title: 'Every screen', text: 'Phone, tablet, laptop — we test on real devices.' },
      { icon: '🔍', title: 'SEO & AI ready', text: 'Meta tags, structured data and speed — so Google and AI assistants can find you.' },
      { icon: '♿', title: 'WCAG accessibility', text: 'Sites that work for people with disabilities: contrast, keyboard, screen readers.' },
      { icon: '🛟', title: 'Revisions & support', text: 'Two revision rounds included and a month of free support after launch.' },
    ],
  },

  services: {
    eyebrow: 'Services & pricing',
    title: 'Pick a format',
    text: 'The price is fixed after the brief and doesn’t change along the way. Need something custom? We’ll quote it individually.',
    featured: 'Most popular',
    term: 'Timeline',
    order: 'Order',
    items: [
      {
        title: 'Business card site',
        price: 'from 1,500 PLN',
        term: '3–5 days',
        features: ['Up to 3 pages', 'Contacts and map', 'Responsive layout', 'Domain setup'],
      },
      {
        title: 'Landing page',
        price: 'from 2,500 PLN',
        term: '5–7 days',
        features: ['Conversion-focused structure', 'Animations and effects', 'Contact form', 'Analytics and goals'],
        featured: true,
      },
      {
        title: 'SPA / web app',
        price: 'from 4,500 PLN',
        term: '7–14 days',
        features: ['Interactive interface', 'Calculators, quizzes', 'API integrations', 'Simple client area'],
      },
    ],
  },

  process: {
    eyebrow: 'How we work',
    title: '7 days from idea to launch',
    text: 'A transparent process with no surprises: you always know what’s happening with your project today.',
    steps: [
      { day: 'Day 1', title: 'Brief & structure', text: 'We talk, break down the task, gather materials and agree on the site structure.' },
      { day: 'Day 2', title: 'Prototype', text: 'We show a wireframe — where each block goes and what visitors will see.' },
      { day: 'Day 3–4', title: 'Design', text: 'We design in your style and iterate until you approve.' },
      { day: 'Day 5–6', title: 'Development', text: 'We code it, add animations, connect forms and analytics.' },
      { day: 'Day 7', title: 'Launch', text: 'We test on all devices, publish on your domain and hand over access.' },
    ],
  },

  portfolio: {
    eyebrow: 'Portfolio',
    title: 'Recent projects',
    visit: 'Visit site',
    items: [
      { title: 'MK Photography', type: 'Photographer website' },
      { title: '“Ziarno” coffee shop', type: 'Landing page' },
      { title: 'KOWAL personal trainer', type: 'Landing page' },
      { title: '“Profesjonalista” renovations', type: 'SPA + calculator' },
      { title: 'MOST language school', type: 'Landing page' },
      { title: 'AUTO 61 car repair shop', type: 'Landing page' },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      { q: 'Can you really build a website in 7 days?', a: 'Yes. Business card sites and landing pages take 3–7 working days once we have your materials. Larger SPA projects take up to 14 days.' },
      { q: 'How much does a website cost?', a: 'A business card site starts at 1,500 PLN, a landing page at 2,500 PLN and an SPA at 4,500 PLN. We give you an exact fixed price after a short brief.' },
      { q: 'Will the site work on phones and tablets?', a: 'Yes. Every site is fully responsive and tested on phones, tablets and desktops.' },
      { q: 'Will the site be visible in Google and to AI assistants?', a: 'Yes. We add meta tags, Schema.org structured data, a sitemap and an llms.txt file, and we optimise loading speed.' },
      { q: 'Will the site be accessible to people with disabilities?', a: 'Yes. We follow WCAG 2.2: proper contrast, keyboard navigation, screen reader support and reduced motion.' },
      { q: 'What if I want to change something?', a: 'Two revision rounds are included in the price, and we provide free support for a month after launch.' },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about your project',
    text: 'We reply within an hour during business hours, suggest a solution and give you an exact price.',
    name: 'Name',
    namePh: 'Anna',
    contact: 'Phone, email or Telegram',
    contactPh: '@username',
    type: 'What do you need?',
    types: ['Business card site', 'Landing page', 'SPA / web app', 'Not sure yet'],
    message: 'A few words about the task',
    messagePh: 'What you do, which websites you like, any deadlines…',
    required: 'required',
    errName: 'How should we address you?',
    errContact: 'Please leave a phone, email or Telegram',
    submit: 'Send request',
    note: 'By submitting the form, you consent to the processing of your personal data in order to respond to your enquiry.',
    successTitle: 'Request sent!',
    successText: 'We’ll get back to you shortly.',
    again: 'Send another',
    phone: 'Phone',
    newTab: '(opens in a new tab)',
  },

  footer: {
    top: 'Back to top',
    cookies: 'Cookie settings',
  },

  cookies: {
    title: 'We respect your privacy',
    text: 'We use cookies that are necessary for the site to work and, with your consent, analytics and marketing cookies. You can change your choice at any time in the footer.',
    acceptAll: 'Accept all',
    rejectAll: 'Necessary only',
    settings: 'Settings',
    dialogTitle: 'Cookie settings',
    save: 'Save choice',
    close: 'Close',
    always: 'Always active',
    categories: {
      necessary: { title: 'Necessary', text: 'Enable core site functions, such as remembering your cookie choice.' },
      analytics: { title: 'Analytics', text: 'Help us understand how you use the site so we can improve it.' },
      marketing: { title: 'Marketing', text: 'Used to show you relevant ads on other websites.' },
    },
  },
}
