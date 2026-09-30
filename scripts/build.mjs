import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const official = 'https://www.renfrodental.com';
const booking = 'https://empower.apexdp.com/appointments/online_bookings/new?acct_codename=DFW-05';
const payment = `${official}/pay-online/`;
const maps = 'https://maps.app.goo.gl/UigaAH6z3gyc9nSu8';
const phone = '817-295-6141';

const serviceGroups = [
  {
    key: 'preventative-dentistry', title: 'Preventative dentistry', number: '01',
    eyebrow: 'Protect what you have',
    description: 'Regular care gives your dental team the chance to understand your needs and catch concerns early.',
    details: [
      ['Dental cleaning', '/services/preventative-dentistry/dental-cleaning/'],
      ['Dental exams', `${official}/services/preventative-dentistry/dental-exams/`],
      ['Dental sealants', `${official}/services/preventative-dentistry/dental-sealants/`],
      ['Fluoride treatments', `${official}/services/preventative-dentistry/fluoride-treatments/`],
      ['Gum disease care', `${official}/services/preventative-dentistry/gum-disease-scaling-and-root-planning/`],
    ],
  },
  {
    key: 'restorative-dentistry', title: 'Restorative dentistry', number: '02',
    eyebrow: 'Restore comfort and function',
    description: 'Explore options for repairing damaged teeth and replacing missing teeth with a care plan tailored to you.',
    details: [
      ['Composite fillings', `${official}/services/restorative-dentistry/composite-fillings/`],
      ['Crowns and bridges', `${official}/services/restorative-dentistry/dental-crowns-and-bridges/`],
      ['Root canal therapy', `${official}/services/restorative-dentistry/root-canal-therapy/`],
      ['Dentures', `${official}/services/restorative-dentistry/dentures/`],
      ['Dental implants', '/services/restorative-dentistry/dental-implants/'],
    ],
  },
  {
    key: 'cosmetic-dentistry', title: 'Cosmetic dentistry', number: '03',
    eyebrow: 'Feel good about your smile',
    description: 'Learn about treatments that can change the appearance of your smile while keeping your goals at the center.',
    details: [
      ['Dental veneers', `${official}/services/cosmetic-dentistry/dental-veneers/`],
      ['Teeth whitening', `${official}/services/cosmetic-dentistry/teeth-whitening/`],
      ['Aesthetic dentistry', `${official}/services/cosmetic-dentistry/aesthetic-dentistry/`],
    ],
  },
  {
    key: 'specialty-dentistry', title: 'Specialty care', number: '04',
    eyebrow: 'Help for specific concerns',
    description: 'Find a starting point for urgent dental concerns, comfort options, and more complex needs.',
    details: [
      ['Emergency dental services', '/services/specialty-dentistry/emergency-dental-services/'],
      ['Sedation dentistry', `${official}/services/specialty-dentistry/sedation-dentistry/`],
      ['Wisdom teeth removal', `${official}/services/specialty-dentistry/wisdom-teeth-removal/`],
      ['TMD care', `${official}/services/specialty-dentistry/temporomandibular-joint-dysfunction-tmd/`],
      ['Gum grafting', `${official}/services/specialty-dentistry/gum-grafting/`],
    ],
  },
  {
    key: 'orthodontic-dentistry', title: 'Orthodontic dentistry', number: '05',
    eyebrow: 'A straighter smile',
    description: 'Discover clear aligner options and begin a conversation about your smile goals.',
    details: [['Clear aligners', `${official}/services/orthodontic-dentistry/clear-aligners/`]],
  },
];

const doctors = [
  {
    slug: 'dr-jarrett-stone', name: 'Dr. Jarrett Stone', image: '/assets/dr-jarrett-stone.jpg',
    intro: 'Dr. Stone enjoys getting to know each patient personally and helping people feel more at ease with dental care.',
    story: 'From Palmer, Texas, Dr. Stone studied biology at Texas A&M University and dentistry at Texas A&M College of Dentistry. He values continuing education and a care experience that treats each patient as an individual.',
    outside: 'Outside the office, he enjoys time with family, the outdoors, and baseball.',
  },
  {
    slug: 'dr-ryker-ferraro', name: 'Dr. Ryker Ferraro', image: '/assets/dr-ryker-ferraro.jpg',
    intro: 'Dr. Ferraro focuses on a comfortable, judgment-free experience that helps patients feel confident seeking care.',
    story: 'Raised in the Fort Worth area, Dr. Ferraro earned a biology degree from the University of North Texas and his dental degree from Texas A&M College of Dentistry. His residency at the University of Nebraska Medical Center included care for patients with special needs and medical complications.',
    outside: 'Outside the office, he enjoys time with family and friends, hiking, kayaking, and camping.',
  },
];

const localRoutes = [
  '/', '/services/',
  ...serviceGroups.map((group) => `/services/${group.key}/`),
  '/services/preventative-dentistry/dental-cleaning/',
  '/services/restorative-dentistry/dental-implants/',
  '/services/specialty-dentistry/emergency-dental-services/',
  '/about/meet-your-dentists/',
  ...doctors.map((doctor) => `/about/meet-your-dentists/${doctor.slug}/`),
  '/first-visit/', '/wellness-plan/', '/contact-us/', '/pay-online/', '/coverage/',
];

function h(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
function link(href, text, className = '', extra = '') {
  const external = href.startsWith('http');
  return `<a href="${h(href)}" class="${className}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${extra}>${text}</a>`;
}
function book(text = 'Book an appointment', className = 'button button-primary') {
  return link(booking, `${h(text)}<span aria-hidden="true">↗</span>`, className, ' aria-label="Book an appointment on Renfro Family Dental’s scheduling portal"');
}
function header(active) {
  const nav = [
    ['/services/', 'Services', 'services'],
    ['/about/meet-your-dentists/', 'Our dentists', 'dentists'],
    ['/first-visit/', 'First visit', 'first'],
    ['/wellness-plan/', 'Wellness plan', 'wellness'],
    ['/contact-us/', 'Contact', 'contact'],
  ];
  const items = nav.map(([href, label, key]) => link(href, h(label), active === key ? 'nav-link active' : 'nav-link', active === key ? ' aria-current="page"' : '')).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
    <div class="concept-banner"><span>Independent website concept by <strong>CREATE SOMETHING</strong></span>${link(official, 'Visit Renfro’s official website <span aria-hidden="true">↗</span>')}</div>
    <header class="site-header"><div class="header-inner">
      ${link('/', '<img src="/assets/renfro-logo-color.svg" width="255" height="79" alt="Renfro Family Dental">', 'brand')}
      <nav class="desktop-nav" aria-label="Primary">${items}</nav>
      <div class="header-actions">${link(`tel:${phone.replaceAll('-', '')}`, phone, 'phone-link')}${book('Book online', 'button button-small button-primary')}</div>
      <details class="mobile-nav"><summary>Menu <span class="menu-icon" aria-hidden="true">☰</span></summary><nav aria-label="Mobile primary">${items}${link('/pay-online/', 'Pay online', 'nav-link')}${link(`tel:${phone.replaceAll('-', '')}`, `Call ${phone}`, 'nav-link')}</nav></details>
    </div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="shell footer-grid">
    <div><img src="/assets/renfro-logo-white.svg" width="210" height="105" alt="Renfro Family Dental" class="footer-logo"><p>A more welcoming path to dental care in Burleson.</p><p class="foot-note">Independent concept by CREATE SOMETHING. Renfro Family Dental has not endorsed or adopted this preview.</p></div>
    <div><h2>Explore</h2>${link('/services/', 'Services')}${link('/about/meet-your-dentists/', 'Our dentists')}${link('/first-visit/', 'First visit')}${link('/wellness-plan/', 'Wellness plan')}${link('/coverage/', 'Preview coverage')}</div>
    <div><h2>Visit & connect</h2>${link(maps, '141 NW Renfro St #101<br>Burleson, TX 76028')}${link(`tel:${phone.replaceAll('-', '')}`, phone)}<p>Mon–Thu, 7am–4pm<br>Fri–Sun, closed</p></div>
    <div><h2>Patient actions</h2>${link(booking, 'Book on Renfro’s portal')}${link(payment, 'Pay on Renfro’s official site')}${link(official, 'Official website')}</div>
  </div><div class="shell footer-bottom"><span>© ${new Date().getFullYear()} CREATE SOMETHING · Independent design study</span><span>Practice content and imagery used with stated permission · ${link(official, 'Official site')}</span></div></footer>`;
}
function page({ path, title, description, active = '', body }) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#153f43"><title>${h(title)} | Renfro Family Dental concept</title><meta name="description" content="${h(description)}"><link rel="icon" href="/assets/renfro-logo-color.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"></head><body>${header(active)}<main id="main">${body}</main>${footer()}</body></html>`;
  return { path, html };
}
function eyebrow(text) { return `<p class="eyebrow">${h(text)}</p>`; }
function titleBlock(label, title, description) {
  return `<section class="page-heading shell">${eyebrow(label)}<h1>${h(title)}</h1><p class="lead">${h(description)}</p></section>`;
}
function serviceCard(group) {
  return `${link(`/services/${group.key}/`, `<span class="card-number">${group.number}</span><span class="service-card-bottom"><span><span class="card-eyebrow">${h(group.eyebrow)}</span><strong>${h(group.title)}</strong></span><span class="card-go" aria-hidden="true">↗</span></span>`, 'service-card')}`;
}
function doctorCard(doctor) {
  return `<article class="doctor-card"><img src="${doctor.image}" alt="Portrait of ${h(doctor.name)}" width="500" height="500"><div><h3>${h(doctor.name)}</h3><p>${h(doctor.intro)}</p>${link(`/about/meet-your-dentists/${doctor.slug}/`, 'Meet the dentist <span aria-hidden="true">↗</span>', 'text-link')}</div></article>`;
}
function actionStrip() {
  return `<section class="action-strip"><div class="shell action-inner"><div>${eyebrow('Your next step')}<h2>Ready when you are.</h2><p>Schedule through Renfro’s existing portal or call the office directly.</p></div><div class="action-buttons">${book()}${link(`tel:${phone.replaceAll('-', '')}`, `Call ${phone}`, 'button button-outline-light')}</div></div></section>`;
}

const pages = [];
pages.push(page({
  path: '/', title: 'A dental home in Burleson', active: 'home',
  description: 'Explore an independent website concept for Renfro Family Dental in Burleson, Texas.',
  body: `<section class="hero"><div class="shell hero-grid"><div class="hero-copy">${eyebrow('Renfro Family Dental · Burleson, Texas')}<h1>A dental home that feels like <em>your own.</em></h1><p>Personal care, experienced dentists, and a clearer path to your next visit.</p><div class="hero-actions">${book()}${link('/services/', 'Explore services', 'button button-outline')}</div><div class="hero-proof"><span class="proof-line"></span><span>Serving Burleson for more than 40 years</span></div></div><div class="hero-photo"><img src="/assets/family-hero.jpg" alt="Family smiling together at home" width="1200" height="750" fetchpriority="high"><div class="photo-caption">Care for every chapter<br>of your smile.</div></div></div></section>
    <section class="quick-paths shell" aria-label="Common patient paths">${link('/first-visit/', '<span>01</span><strong>New to Renfro?</strong><small>Start with your first visit</small>')}${link('/services/', '<span>02</span><strong>Looking for care?</strong><small>Browse dental services</small>')}${link('/wellness-plan/', '<span>03</span><strong>No dental coverage?</strong><small>Explore the wellness plan</small>')}</section>
    <section class="section shell intro-section"><div class="section-image"><img src="/assets/office.jpg" alt="Exterior of the Renfro Family Dental office in Burleson" width="750" height="414" loading="lazy"><span class="image-tag">141 NW Renfro St #101</span></div><div class="section-copy">${eyebrow('A familiar place to begin')}<h2>Care built around the person in the chair.</h2><p>Renfro Family Dental describes its mission as providing a trustworthy, comfortable dental home. This concept makes it easier to understand your options and take the next step.</p>${link('/first-visit/', 'What to expect on your first visit <span aria-hidden="true">↗</span>', 'text-link')}</div></section>
    <section class="section services-section"><div class="shell"><div class="section-head">${eyebrow('Explore care')}<div><h2>Find the right place to start.</h2><p>Browse five care areas, then continue to Renfro’s official information or scheduling portal.</p></div></div><div class="service-grid">${serviceGroups.map(serviceCard).join('')}</div></div></section>
    <section class="section shell doctors-section"><div class="section-head">${eyebrow('Meet your dentists')}<div><h2>People you can get to know.</h2><p>Learn about the dentists and the approach they bring to patient care.</p></div></div><div class="doctor-grid">${doctors.map(doctorCard).join('')}</div></section>
    <section class="section plan-feature"><div class="shell plan-feature-inner"><div>${eyebrow('Patient information')}<h2>Options that make care easier to plan.</h2><p>Find out what your first visit may involve and explore Renfro’s in-house Aspire Dental Wellness Plan.</p></div><div class="feature-links">${link('/first-visit/', 'Plan your first visit <span aria-hidden="true">↗</span>')}${link('/wellness-plan/', 'Explore the wellness plan <span aria-hidden="true">↗</span>')}</div></div></section>${actionStrip()}`,
}));

pages.push(page({
  path: '/services/', title: 'Dental services', active: 'services',
  description: 'Browse preventative, restorative, cosmetic, specialty, and orthodontic dental care at Renfro Family Dental.',
  body: `${titleBlock('Services', 'Find care for what matters to you.', 'Start with the kind of care you need. Each category offers a simple overview and a path to more detailed information.')}
    <section class="shell section-tight"><div class="service-grid service-grid-page">${serviceGroups.map(serviceCard).join('')}</div></section>
    <section class="shell section editorial-split"><div>${eyebrow('Not sure where to begin?')}<h2>Tell the team what is going on.</h2></div><div><p>Whether you are due for routine care or have a specific concern, Renfro’s team can help you choose the right appointment.</p>${book('Book through Renfro')}</div></section>${actionStrip()}`,
}));

for (const group of serviceGroups) {
  const detailList = group.details.map(([label, href]) => `<li>${link(href, `<span>${h(label)}</span><span class="item-end">${href.startsWith('http') ? 'Official details' : 'Explore'} <span aria-hidden="true">↗</span></span>`)}</li>`).join('');
  pages.push(page({
    path: `/services/${group.key}/`, title: group.title, active: 'services',
    description: `${group.description} View ${group.title.toLowerCase()} at Renfro Family Dental.`,
    body: `<div class="breadcrumb shell">${link('/services/', 'Services')}<span aria-hidden="true">/</span><span>${h(group.title)}</span></div>${titleBlock(group.eyebrow, group.title, group.description)}
      <section class="shell section-tight detail-layout"><div><h2>Care in this area</h2><p>Choose a topic below. Some detailed treatment pages continue on Renfro’s official website.</p></div><ul class="detail-list">${detailList}</ul></section>
      <section class="shell section editorial-split"><div>${eyebrow('A personal next step')}<h2>Explore your options with a dentist.</h2></div><div><p>The right treatment depends on an individual exam and conversation. Renfro’s scheduling portal is the place to request a visit.</p>${book()}</div></section>${actionStrip()}`,
  }));
}

const treatmentPages = [
  {
    path: '/services/preventative-dentistry/dental-cleaning/', parent: 'preventative-dentistry',
    title: 'Dental cleaning', lead: 'Make regular care part of your routine.',
    text: 'A professional cleaning gives your dental team time to care for your teeth and talk through what they see. Renfro lists dental cleaning among its preventative services.',
    officialPath: '/services/preventative-dentistry/dental-cleaning/',
  },
  {
    path: '/services/restorative-dentistry/dental-implants/', parent: 'restorative-dentistry',
    title: 'Dental implants', lead: 'Explore a way to replace missing teeth.',
    text: 'Implants are one of the restorative options Renfro lists for replacing missing teeth. An appointment is the right place to discuss whether this option fits your needs.',
    officialPath: '/services/restorative-dentistry/dental-implants/',
  },
  {
    path: '/services/specialty-dentistry/emergency-dental-services/', parent: 'specialty-dentistry',
    title: 'Emergency dental services', lead: 'When something hurts, start with a call.',
    text: 'If you have a dental injury or sudden tooth pain, call Renfro to describe what happened and ask about the appropriate next step. Availability and treatment are confirmed by the practice.',
    officialPath: '/services/specialty-dentistry/emergency-dental-services/',
  },
];
for (const treatment of treatmentPages) {
  const group = serviceGroups.find((item) => item.key === treatment.parent);
  pages.push(page({
    path: treatment.path, title: treatment.title, active: 'services', description: `${treatment.title} at Renfro Family Dental in Burleson, Texas.`,
    body: `<div class="breadcrumb shell">${link('/services/', 'Services')}<span aria-hidden="true">/</span>${link(`/services/${group.key}/`, h(group.title))}<span aria-hidden="true">/</span><span>${h(treatment.title)}</span></div>
      <section class="page-heading shell treatment-heading">${eyebrow(group.title)}<h1>${h(treatment.lead)}</h1><p class="lead">${h(treatment.text)}</p><div class="hero-actions">${book()}${link(`${official}${treatment.officialPath}`, 'Read official treatment details <span aria-hidden="true">↗</span>', 'button button-outline')}</div></section>
      <section class="section shell editorial-split"><div>${eyebrow('Before you decide')}<h2>Your care starts with a conversation.</h2></div><div><p>This preview helps you navigate. Renfro’s own team can answer clinical questions and confirm available appointments.</p>${link('/contact-us/', 'Contact and location <span aria-hidden="true">↗</span>', 'text-link')}</div></section>${actionStrip()}`,
  }));
}

pages.push(page({
  path: '/about/meet-your-dentists/', title: 'Meet your dentists', active: 'dentists',
  description: 'Get to know Dr. Jarrett Stone and Dr. Ryker Ferraro at Renfro Family Dental.',
  body: `${titleBlock('The people behind your care', 'Meet your dentists.', 'Two dentists, individual approaches, and a shared focus on making patients feel cared for.')}
    <section class="shell section-tight"><div class="doctor-grid">${doctors.map(doctorCard).join('')}</div></section>${actionStrip()}`,
}));
for (const doctor of doctors) {
  pages.push(page({
    path: `/about/meet-your-dentists/${doctor.slug}/`, title: doctor.name, active: 'dentists',
    description: `Meet ${doctor.name} at Renfro Family Dental in Burleson, Texas.`,
    body: `<div class="breadcrumb shell">${link('/about/meet-your-dentists/', 'Our dentists')}<span aria-hidden="true">/</span><span>${h(doctor.name)}</span></div>
      <section class="profile-hero shell"><div><img src="${doctor.image}" alt="Portrait of ${h(doctor.name)}" width="500" height="500"></div><div>${eyebrow('Meet your dentist')}<h1>${h(doctor.name)}</h1><p class="lead">${h(doctor.intro)}</p>${book()}</div></section>
      <section class="shell section editorial-split"><div>${eyebrow('A little more about the doctor')}<h2>Care shaped by experience.</h2></div><div><p>${h(doctor.story)}</p><p>${h(doctor.outside)}</p>${link(`${official}/about/meet-your-dentists/${doctor.slug}/`, 'Read the full official biography <span aria-hidden="true">↗</span>', 'text-link')}</div></section>${actionStrip()}`,
  }));
}

pages.push(page({
  path: '/first-visit/', title: 'Your first visit', active: 'first',
  description: 'Plan your first visit to Renfro Family Dental in Burleson, Texas.',
  body: `${titleBlock('New patients', 'A first visit, made easier to picture.', 'Get acquainted with the office, the appointment experience, and the choices available for paying for care.')}
    <section class="shell section-tight steps"><article><span>01</span><h2>A warm welcome</h2><p>Meet the reception team and let them know what brings you in.</p></article><article><span>02</span><h2>A thorough exam</h2><p>Talk through your dental concerns and receive an examination tailored to your needs.</p></article><article><span>03</span><h2>A clear conversation</h2><p>Review findings, ask questions, and discuss a care plan with your dentist.</p></article></section>
    <section class="section shell editorial-split"><div>${eyebrow('Coverage and cost')}<h2>Know your options before you arrive.</h2></div><div><p>Renfro says it accepts most dental insurance and can help file claims. For patients without coverage, its in-house Aspire Dental Wellness Plan offers another option.</p><div class="inline-links">${link('/wellness-plan/', 'Explore the wellness plan <span aria-hidden="true">↗</span>', 'text-link')}${link(`${official}/first-visit/`, 'Read official first-visit details <span aria-hidden="true">↗</span>', 'text-link')}</div></div></section>${actionStrip()}`,
}));

pages.push(page({
  path: '/wellness-plan/', title: 'Aspire Dental Wellness Plan', active: 'wellness',
  description: 'Learn about Renfro Family Dental’s in-house Aspire Dental Wellness Plan.',
  body: `${titleBlock('Patient information', 'A simpler way to plan for care.', 'Renfro’s in-house Aspire Dental Wellness Plan is designed for patients looking for an alternative to traditional dental insurance.')}
    <section class="shell section-tight"><div class="plan-grid"><article><span class="plan-count">01</span><h2>Standard Adult</h2><p>Up to two cleanings per year, along with listed exams, X-rays, fluoride, and eligible treatment discounts.</p></article><article><span class="plan-count">02</span><h2>Child</h2><p>Up to two cleanings per year, with the listed preventive services and eligible treatment discounts.</p></article><article><span class="plan-count">03</span><h2>Gum Disease</h2><p>Up to four periodontal maintenance cleanings per year, based on your dentist’s recommendation.</p></article></div><p class="plan-note">This plan is not dental insurance. Benefits, prices, enrollment, and cancellation terms should be confirmed on Renfro’s official site.</p><div class="hero-actions">${link(`${official}/wellness-plan/`, 'View current plans and enrollment <span aria-hidden="true">↗</span>', 'button button-primary')}${link(`${official}/wellness-plan-terms/`, 'Read official plan terms <span aria-hidden="true">↗</span>', 'button button-outline')}</div></section>
    <section class="section shell editorial-split"><div>${eyebrow('Common questions')}<h2>Understand what the plan is.</h2></div><div class="faq-list"><details><summary>Is this dental insurance?</summary><p>No. Renfro describes Aspire as an in-house wellness plan. See its official terms for the full conditions.</p></details><details><summary>Can I use it with insurance?</summary><p>Renfro’s posted terms say plan benefits cannot be combined with dental insurance or other in-office discounts.</p></details><details><summary>Where can I enroll?</summary><p>Use the official Renfro wellness-plan page for current pricing and enrollment.</p></details></div></section>${actionStrip()}`,
}));

pages.push(page({
  path: '/contact-us/', title: 'Contact and location', active: 'contact',
  description: 'Call, locate, or book with Renfro Family Dental in Burleson, Texas.',
  body: `${titleBlock('Visit & connect', 'The next step is close to home.', 'Find the office, call the team, or schedule a visit through Renfro’s existing booking portal.')}
    <section class="shell section-tight contact-grid"><div class="contact-panel"><h2>Renfro Family Dental</h2><div class="contact-row"><span>Address</span>${link(maps, '141 NW Renfro St #101<br>Burleson, TX 76028 <span aria-hidden="true">↗</span>')}</div><div class="contact-row"><span>Phone</span>${link(`tel:${phone.replaceAll('-', '')}`, phone)}</div><div class="contact-row"><span>Hours</span><p>Monday–Thursday: 7am–4pm<br>Friday–Sunday: Closed</p></div><div class="hero-actions">${book()}${link(`tel:${phone.replaceAll('-', '')}`, 'Call the office', 'button button-outline')}</div></div><div class="contact-photo"><img src="/assets/office.jpg" width="750" height="414" alt="Renfro Family Dental office exterior in Burleson" loading="lazy"><p>This is an independent website concept. Use the official booking portal or call Renfro for appointment questions.</p></div></section>${actionStrip()}`,
}));

pages.push(page({
  path: '/pay-online/', title: 'Pay online',
  description: 'Continue to Renfro Family Dental’s official online payment page.',
  body: `${titleBlock('Patient action', 'Pay on Renfro’s official site.', 'For your security, this independent concept does not accept payments or collect account information.')}
    <section class="shell section-tight handoff-panel"><div><h2>You are leaving this concept preview.</h2><p>The button opens Renfro Family Dental’s current payment page in a new tab. Confirm the destination before entering payment information.</p></div>${link(payment, 'Continue to official payment page <span aria-hidden="true">↗</span>', 'button button-primary')}</section>`,
}));

pages.push(page({
  path: '/coverage/', title: 'Preview coverage',
  description: 'Understand which Renfro Family Dental pages are included in this independent preview.',
  body: `${titleBlock('About this concept', 'What this preview covers.', 'This is a focused concept, built to demonstrate a clearer patient journey. It is not Renfro’s full website or a live replacement.')}
    <section class="shell section-tight coverage-grid"><div><h2>Built in this preview</h2><ul><li>Home and service discovery</li><li>Five service-category overviews</li><li>Three representative treatment pages</li><li>Dentist profiles</li><li>First visit and wellness plan</li><li>Contact, official booking, and payment handoffs</li></ul></div><div><h2>Continue on the official site</h2><p>Renfro’s full library of treatment pages, articles, reviews, legal notices, and current membership enrollment remains on its official website.</p>${link(official, 'Explore Renfro’s official site <span aria-hidden="true">↗</span>', 'button button-outline')}</div></section>`,
}));

if (pages.length !== localRoutes.length || pages.some((entry) => !localRoutes.includes(entry.path))) {
  throw new Error('Route registry and generated pages are out of sync');
}
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'public'), dist, { recursive: true });
for (const { path, html } of pages) {
  const folder = join(dist, path);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'index.html'), html);
}
const notFound = page({
  path: '/404/', title: 'Page not found', description: 'This page is not part of the Renfro Family Dental concept preview.',
  body: `${titleBlock('Page not found', 'Let’s find your way back.', 'This focused concept does not include every page on Renfro’s official website.')}
    <section class="shell section-tight"><div class="hero-actions">${link('/', 'Return to the concept home', 'button button-primary')}${link(official, 'Visit Renfro’s official site <span aria-hidden="true">↗</span>', 'button button-outline')}</div></section>`,
});
await writeFile(join(dist, '404.html'), notFound.html);
await writeFile(join(dist, 'route-manifest.json'), JSON.stringify(localRoutes, null, 2));
console.log(`Built ${pages.length} routes in ${dist}`);
