import type { Lang } from '@/contexts/Language'
import type { Audience } from '@/lib/audience'

// Resolved to an actual href + button label in FaqPageClient, using
// AUDIENCE_CONFIG and the existing translated CTA strings — kept as a type
// tag here (not a literal URL or label) so content stays audience- and
// language-agnostic and nothing has to be translated three times.
export type FaqLinkType = 'themes' | 'makeup' | 'guide' | 'mehndiRsvp' | 'travelDetails' | 'switchAudience'

export interface FaqItem {
  id: string
  question: string
  answer: string
  // Omit to show on both guest pages. Travel & Arrival, Venues & Getting
  // Around, Food & Stay and Nearby Essentials only exist on the groom's
  // side (bride's guests have no Travel Details form, don't stay at the
  // hotel the same way, and the "when is it" question needs a different
  // date range per audience since bride's guests only attend the 20th and
  // 21st, not the 22nd checkout).
  audience?: Audience
  // Shows a button under the answer linking to the page/section it refers to.
  link?: FaqLinkType
}

export interface FaqCategory {
  id: string
  title: string
  items: FaqItem[]
}

// Answers are deliberately grounded only in copy and data that already
// exists elsewhere on the site (Language.tsx, content/wedding-content.json)
// or facts given directly for this FAQ (pickup window, venue distances,
// Rani Bagh) — nothing here introduces an unconfirmed fact.
export const faqContent: Record<Lang, FaqCategory[]> = {
  en: [
    {
      id: 'save-the-date',
      title: 'Save the Date',
      items: [
        {
          id: 'when-bride',
          audience: 'bride',
          question: 'When is the wedding?',
          answer: 'Our celebrations for you run Wednesday 20 to Thursday 21 January 2027, in Pitampura, Delhi.',
        },
        {
          id: 'early-arrival-bride',
          audience: 'bride',
          question: 'Can I arrive before the 20th?',
          answer: 'You’re welcome to — just note that our celebrations begin on Wednesday 20 January, not the day before. If you’re coming in earlier, please make your own travel and stay arrangements for those days.',
        },
        {
          id: 'event-dates-groom',
          audience: 'groom',
          question: 'What are the event dates?',
          answer: 'Our celebrations run Wednesday 20 to Friday 22 January 2027, in Pitampura, Delhi. The main celebrations are on the 20th and 21st — 22 January is checkout day, not a separate celebration. Our hosting and festivities begin on the 20th, not the day before.',
        },
        {
          id: 'wedding-date-groom',
          audience: 'groom',
          question: 'When is the wedding?',
          answer: 'The wedding ceremony itself is on Thursday, 21 January 2027. The celebrations begin a day earlier, on Wednesday 20 January, with the other wedding functions.',
        },
        {
          id: 'schedule',
          question: 'What’s the schedule of events?',
          answer: 'Four celebrations: Mehndi (20 January, morning), Engagement & Cocktail (20 January, evening), Haldi (21 January, morning), and the Wedding (21 January, evening). The Themes & What to Wear page has the full story behind each.',
          link: 'themes',
        },
        {
          id: 'hashtag',
          question: 'What’s #SakshiKoMilaKinara?',
          answer: 'Our wedding hashtag — feel free to use it if you’re sharing photos from the celebrations.',
        },
      ],
    },
    {
      id: 'travel',
      title: 'Travel & Arrival',
      items: [
        {
          id: 'confirm-travel',
          audience: 'groom',
          question: 'Do I need to confirm my travel details?',
          answer: 'Yes — please fill out the Travel Details form so we can plan your stay and, where applicable, coordinate your pickup within Delhi. Guests book and manage their own travel to Delhi.',
          link: 'travelDetails',
        },
        {
          id: 'who-books-travel',
          audience: 'groom',
          question: 'Do you book our tickets, or should we do that ourselves?',
          answer: 'Please go ahead and book whichever flight or train works best for you — getting to Delhi is on you. Once you’re here, your stay is taken care of, and we’ll coordinate your pickup from the airport/station during the supported arrival window — see the next question for details.',
        },
        {
          id: 'travel-deadline',
          audience: 'groom',
          question: 'By when should I submit my travel details?',
          answer: 'Sunday, 15 November 2026. Train tickets for a 19 January departure only open on 20 November, so if you haven’t booked yet, submit your best estimate by then and update the form once you have.',
        },
        {
          id: 'arrival-date-time',
          audience: 'groom',
          question: 'When should I plan to arrive?',
          answer: 'Please plan to arrive on Wednesday, 20 January 2027. Choose your best estimate on the form — if it falls in the 6 am–11 am pickup window, see the next question for how that works.',
        },
        {
          id: 'early-arrival',
          audience: 'groom',
          question: 'Can I arrive a day early, or before the 20th?',
          answer: 'You’re welcome to — but please note that our hosting begins on Wednesday 20 January, the day the functions start, not the day before. Our stay bookings, pickup and festivities all start from the 20th. If you’re coming in earlier, please arrange your own stay and transport for the extra days, and let us know in the notes field on the Travel Details form.',
          link: 'travelDetails',
        },
        {
          id: 'delhi-pickup',
          audience: 'groom',
          question: 'Is pickup arranged when I arrive in Delhi?',
          answer: 'Pickup window: 6:00 am – 11:00 am, Wednesday 20 January. During that window, we’ll coordinate your pickup from the Delhi airport or railway station, grouping guests by arrival timing wherever practical rather than arranging an individual cab for every arrival. Please submit accurate arrival details in advance so we can plan smoothly.',
        },
        {
          id: 'pickup-outside-window',
          audience: 'groom',
          question: 'What if I arrive outside the pickup window, or on another day?',
          answer: 'You’re absolutely welcome to — just know that organised pickups run only during the 6 am–11 am window on 20 January. Outside that window, or on another day (before the 20th, or on the 21st), please arrange your own transport to the hotel, and let us know your plans in the notes field on the form.',
        },
        {
          id: 'tickets-not-booked-yet',
          audience: 'groom',
          question: 'What if I haven’t booked my tickets yet?',
          answer: 'That’s completely fine, especially for trains — bookings for your route may only open a couple of months before travel. Submit the form now with your best estimate, and once you’ve booked, fill it out again with the same mobile number to update your details rather than create a duplicate. Flights can usually be booked further ahead, so feel free to add your flight number as soon as you have it.',
        },
        {
          id: 'train-booking-window',
          audience: 'groom',
          question: 'When do train tickets open for booking?',
          answer: 'Indian Railways opens reservations 60 days before the date your train leaves — at 8 am on IRCTC (website or app). For a Mumbai train leaving on the evening of Tuesday 19 January 2027 — the one that gets you to Delhi on the morning of the 20th — bookings open on Friday 20 November 2026. If you’re leaving a day earlier, on 18 January, bookings open on 19 November. Tickets for popular trains like the Rajdhani go quickly, so set a reminder and have your IRCTC login ready. Our travel-details deadline (15 November) comes before the window opens, so submit your best estimate now and update the form once you’ve booked.',
          link: 'travelDetails',
        },
        {
          id: 'mumbai-rajdhani',
          audience: 'groom',
          question: 'I’m coming from Mumbai by Rajdhani — which stations should I book?',
          answer: 'Board at Mumbai Central (MMCT) and get down at New Delhi (NDLS) — that’s the Mumbai Rajdhani (12951), which leaves Mumbai Central around 5:00 pm and reaches New Delhi around 8:30 am, right inside our 6–11 am pickup window on the 20th. Book it for Tuesday 19 January 2027. If Borivali is closer to you, the train also stops there shortly after leaving Mumbai Central. We’d suggest the 12951 over the August Kranti Rajdhani (12953), which goes to Hazrat Nizamuddin instead and runs on a different timing — the 12951 is the cleaner fit for our pickup window. Timings can change, so check the latest on IRCTC or NTES when you book.',
        },
        {
          id: 'which-airport-station',
          audience: 'groom',
          question: 'Which Delhi airport or station should I book into?',
          answer: 'For flights, Delhi’s Indira Gandhi International Airport (DEL) — it’s where almost everyone flies in, so that’s the one to pick. For trains, New Delhi (NDLS) is the main station and the best fit for our pickups. If your train ends at another Delhi station (Hazrat Nizamuddin, Old Delhi or Anand Vihar), that’s fine too — just let us know in the notes field on the Travel Details form so we can plan around it.',
        },
        {
          id: 'update-details',
          audience: 'groom',
          question: 'My plans changed — how do I update my travel details?',
          answer: 'Just fill out the Travel Details form again using the same mobile number — it updates your existing entry instead of creating a duplicate. You can do this as often as you need to, including once your tickets are booked.',
          link: 'travelDetails',
        },
        {
          id: 'id-upload',
          audience: 'groom',
          question: 'Why do I need to upload a photo of my ID?',
          answer: 'It’s used only to arrange your pickup and stay. Aadhar, Passport or Driving Licence all work, for yourself and anyone travelling with you. Please also carry the original ID — the hotel will ask for it at check-in.',
        },
        {
          id: 'checkout',
          audience: 'groom',
          question: 'When is checkout?',
          answer: '11 am on Friday, 22 January.',
        },
        {
          id: 'return-travel',
          audience: 'groom',
          question: 'When should I book my return?',
          answer: 'The Wedding is on the evening of Thursday 21 January and checkout is at 11 am on Friday 22 January — so plan your return for the 22nd, after checkout, rather than the night of the 21st. Fog can delay early-morning departures in January, so a slightly later departure on the 22nd gives you some cushion.',
        },
      ],
    },
    {
      id: 'venues',
      title: 'Venues & Getting Around',
      items: [
        {
          id: 'same-venue',
          audience: 'groom',
          question: 'Are all the events at the same venue?',
          answer: 'Almost all the celebrations are at the main venue/hotel, so you won’t need to travel between different places for most of the stay.',
        },
        {
          id: 'wedding-venue-location',
          audience: 'groom',
          question: 'Where is the Wedding venue?',
          answer: 'The Wedding on 21 January is at a separate venue, about 400 metres from the main venue/hotel.',
        },
        {
          id: 'wedding-venue-transport',
          audience: 'groom',
          question: 'Is transport to the Wedding venue arranged?',
          answer: 'Yes — we’ll arrange transport between the hotel/main venue and the Wedding venue, so you won’t need to organise this yourself.',
        },
      ],
    },
    {
      id: 'food-stay',
      title: 'Food & Stay',
      items: [
        {
          id: 'meals-arranged',
          audience: 'groom',
          question: 'Are meals being arranged during the celebrations?',
          answer: 'Yes — meals around the wedding celebrations are being arranged for our guests, so please don’t worry about going hungry. Scheduled meals, including lunch and other event meals, are part of the arrangements.',
        },
        {
          id: 'separate-orders',
          audience: 'groom',
          question: 'What if I order something separately from the hotel?',
          answer: 'Meals that are part of the wedding celebrations are taken care of by us. If you order anything extra for personal use — room service, beverages, or anything else from the hotel menu — please settle those charges directly with the hotel.',
        },
        {
          id: 'hotel-expenses',
          audience: 'groom',
          question: 'What personal hotel expenses should I pay myself?',
          answer: 'Your stay and the arrangements we’ve shared with you are taken care of. Personal extras — additional room-service orders, minibar or personal purchases, laundry, or other individually requested hotel services — should be settled directly with the hotel.',
        },
        {
          id: 'room-issue',
          audience: 'groom',
          question: 'What should I do if there’s an issue with my room?',
          answer: 'For anything related to your room — housekeeping, amenities, maintenance, room keys, or other hotel services — please contact the hotel reception directly, just as you would on any hotel stay. The hotel team is best placed to help you quickly, and it means we get to spend that time enjoying the celebrations together with you.',
        },
      ],
    },
    {
      id: 'nearby',
      title: 'Nearby Essentials',
      items: [
        {
          id: 'rani-bagh',
          audience: 'groom',
          question: 'Where can I get medicines, shopping or everyday essentials?',
          answer: 'Rani Bagh Market is about 400 metres away and is handy for medicines, personal essentials, shopping, or anything else you might need during your stay. E-rickshaws are easily available for the short ride over.',
        },
      ],
    },
    {
      id: 'mehndi',
      title: 'Mehndi',
      items: [
        {
          id: 'mehndi-when',
          question: 'When is the Mehndi?',
          answer: 'Wednesday 20 January 2027, 11 am – 2 pm.',
        },
        {
          id: 'mehndi-rsvp',
          question: 'How do I let you know I’m joining?',
          answer: 'Use the Mehndi RSVP section — share your name and whether you’re joining, unable to join, or not sure yet. You can add more than one guest at a time.',
          link: 'mehndiRsvp',
        },
        {
          id: 'mehndi-not-sure',
          question: 'What if I’m not sure whether I can make it yet?',
          answer: 'No problem — choose "Not Sure Yet" for now, and let us know once you’re certain.',
        },
      ],
    },
    {
      id: 'makeup',
      title: 'Getting Ready & Makeup',
      items: [
        {
          id: 'makeup-arranged',
          question: 'Is makeup arranged for us?',
          answer: 'Not directly — we’ve put together a guide to a few nearby Pitampura salons to make it easier, or you’re welcome to book an artist you already love.',
          link: 'makeup',
        },
        {
          id: 'makeup-window',
          question: 'When’s the window to get ready?',
          answer: '20 and 21 January, 3–5 pm — the full two-hour window covers the trip to the salon, your makeup, and the trip back. Please be back at the hotel by or before 5 pm.',
        },
        {
          id: 'makeup-pay',
          question: 'Who pays for the salon or artist?',
          answer: 'You contact, book and pay your chosen salon directly, and arrange your own ride from the hotel and back.',
        },
      ],
    },
    {
      id: 'wear',
      title: 'What to Wear',
      items: [
        {
          id: 'dress-code',
          question: 'Is there a dress code for each event?',
          answer: 'Yes. Mehndi is florals & pastels with a touch of green. Engagement & Cocktail is jewel-toned cocktail formal — gowns only for the ladies, no saree, lehenga or Indian separates. Haldi is shades of pink in easy, Haldi-friendly fabrics. The Wedding is Indian formal, in ivory, champagne and gold.',
        },
        {
          id: 'wear-more',
          question: 'Where can I see more detail and inspiration?',
          answer: 'The Themes & What to Wear page has the full story and look ideas for each celebration.',
          link: 'themes',
        },
        {
          id: 'guest-guide',
          question: 'Is there a downloadable guide?',
          answer: 'Yes — the Guest Guide PDF, linked in the footer, has everything in one place.',
          link: 'guide',
        },
      ],
    },
    {
      id: 'weather',
      title: 'Weather & Packing',
      items: [
        {
          id: 'weather-expect',
          question: 'What will the weather be like?',
          answer: 'Late January is peak winter in Delhi. Afternoons are usually sunny and pleasant, around 18–20°C. Mornings and nights are cold — typically 6–8°C, and it can dip lower in a cold spell — and fog is common in the early hours. Light winter showers are possible too. It’s worth checking the forecast a few days before you travel.',
        },
        {
          id: 'pack-clothes',
          question: 'What should I pack for the cold?',
          answer: 'Layers. Carry a warm jacket or coat, a shawl or stole, and thermals or warm innerwear for the mornings and evenings. Pick layers that go with your outfits: a shawl, wrap or cape over your gown or Indian outfit for the evening events, a blazer or jacket over a sherwani or suit, and a warm cardigan or wrap for the morning Haldi. The Mehndi (11 am – 2 pm) falls in the warmest part of the day.',
        },
        {
          id: 'pack-essentials',
          question: 'Anything else worth packing for a Delhi winter?',
          answer: 'Winter air is dry, so a good moisturiser, lip balm and sunscreen help. Warm socks and comfortable closed footwear for the early mornings, and a small umbrella in case of a winter shower.',
        },
        {
          id: 'fog-travel',
          audience: 'groom',
          question: 'Could fog delay my flight or train?',
          answer: 'It can — fog is common in Delhi in January, especially early in the morning, and flights and trains are sometimes delayed. Check your flight or train status before leaving for the airport or station, and if you have a choice, an arrival in the later half of the pickup window gives more cushion than the very first flight or train. Pickup runs 6–11 am on 20 January; if a delay pushes you past it, please arrange your own transport to the hotel — and if your plans change, update your arrival details on the Travel Details form using the same mobile number.',
          link: 'travelDetails',
        },
      ],
    },
    {
      id: 'good-to-know',
      title: 'Good to Know',
      items: [
        {
          id: 'languages',
          question: 'Is the site available in other languages?',
          answer: 'Yes — switch between English, Hindi and Gujarati using the language switcher in the header.',
        },
        {
          id: 'switch-side',
          question: 'I think I’m on the wrong guest page — can I switch?',
          answer: 'Yes — use the switch link in the header to move between Sakshi’s guests and Dr. Sahil’s guests.',
          link: 'switchAudience',
        },
        {
          id: 'contact',
          question: 'Who do I contact if I still have questions?',
          answer: 'Reach out to Ashok & Chetana Haria (Dr. Sahil’s parents) — they’re happy to help with anything not already covered here.',
        },
      ],
    },
  ],
  hi: [
    {
      id: 'save-the-date',
      title: 'तारीख़ नोट कर लें',
      items: [
        {
          id: 'when-bride',
          audience: 'bride',
          question: 'शादी कब है?',
          answer: 'आपके लिए हमारे उत्सव बुधवार 20 से गुरुवार 21 जनवरी 2027 तक, पितमपुरा, दिल्ली में होंगे।',
        },
        {
          id: 'early-arrival-bride',
          audience: 'bride',
          question: 'क्या मैं 20 तारीख़ से पहले आ सकता/सकती हूँ?',
          answer: 'आ सकते हैं — बस ध्यान रखें कि हमारे उत्सव बुधवार, 20 जनवरी से शुरू होते हैं, एक दिन पहले से नहीं। अगर आप पहले आ रहे हैं, तो उन दिनों के लिए कृपया यात्रा और रुकने की व्यवस्था ख़ुद करें।',
        },
        {
          id: 'event-dates-groom',
          audience: 'groom',
          question: 'उत्सव की तारीख़ें क्या हैं?',
          answer: 'हमारे उत्सव बुधवार 20 से शुक्रवार 22 जनवरी 2027 तक, पितमपुरा, दिल्ली में होंगे। मुख्य उत्सव 20 और 21 तारीख़ को हैं — 22 जनवरी सिर्फ़ चेकआउट का दिन है, कोई अलग उत्सव नहीं। हमारी मेज़बानी और उत्सव 20 तारीख़ से शुरू होते हैं, एक दिन पहले से नहीं।',
        },
        {
          id: 'wedding-date-groom',
          audience: 'groom',
          question: 'शादी कब है?',
          answer: 'शादी की रस्म गुरुवार, 21 जनवरी 2027 को है। उत्सव इससे एक दिन पहले, बुधवार 20 जनवरी से, बाक़ी शादी के कार्यक्रमों के साथ शुरू होते हैं।',
        },
        {
          id: 'schedule',
          question: 'कार्यक्रम का क्रम क्या है?',
          answer: 'चार उत्सव: मेहंदी (20 जनवरी, सुबह), सगाई और कॉकटेल (20 जनवरी, शाम), हल्दी (21 जनवरी, सुबह), और शादी (21 जनवरी, शाम)। हर उत्सव की पूरी कहानी थीम्स और पहनावा पेज पर है।',
          link: 'themes',
        },
        {
          id: 'hashtag',
          question: '#SakshiKoMilaKinara क्या है?',
          answer: 'हमारा शादी का हैशटैग — उत्सव की तस्वीरें साझा करते समय बेझिझक इसका उपयोग करें।',
        },
      ],
    },
    {
      id: 'travel',
      title: 'यात्रा और आगमन',
      items: [
        {
          id: 'confirm-travel',
          audience: 'groom',
          question: 'क्या मुझे अपनी यात्रा जानकारी की पुष्टि करनी होगी?',
          answer: 'हाँ — कृपया यात्रा विवरण फ़ॉर्म भरें ताकि हम आपके ठहरने की योजना बना सकें और, जहाँ लागू हो, दिल्ली के भीतर आपकी पिकअप की व्यवस्था कर सकें। दिल्ली तक की यात्रा बुक करना और उसकी व्यवस्था करना आपकी ज़िम्मेदारी है।',
          link: 'travelDetails',
        },
        {
          id: 'who-books-travel',
          audience: 'groom',
          question: 'क्या आप हमारी टिकट बुक करेंगे, या हमें खुद बुक करनी होगी?',
          answer: 'जो भी फ़्लाइट या ट्रेन आपके लिए सही रहे, बेझिझक उसकी बुकिंग करें — दिल्ली तक पहुँचना आपकी तरफ़ से है। यहाँ पहुँचने के बाद आपका ठहरना हमारी तरफ़ से है, और तय पिकअप समय के दौरान हम आपकी एयरपोर्ट/स्टेशन पिकअप की व्यवस्था करेंगे — पूरी जानकारी अगले सवाल में है।',
        },
        {
          id: 'travel-deadline',
          audience: 'groom',
          question: 'मुझे अपनी यात्रा जानकारी कब तक देनी चाहिए?',
          answer: 'रविवार, 15 नवंबर 2026। 19 जनवरी की रवानगी के लिए ट्रेन टिकट 20 नवंबर को ही खुलते हैं, इसलिए अगर आपने अभी बुक नहीं किया है, तो तब तक अपना सबसे अच्छा अंदाज़ा भर दें और बुकिंग के बाद फ़ॉर्म अपडेट करें।',
        },
        {
          id: 'arrival-date-time',
          audience: 'groom',
          question: 'मुझे किस तारीख़ को पहुँचने की योजना बनानी चाहिए?',
          answer: 'कृपया बुधवार, 20 जनवरी 2027 को पहुँचने की योजना बनाएं। फ़ॉर्म पर अपना अंदाज़ित समय बताएं — अगर यह सुबह 6 से 11 बजे के पिकअप समय में आता है, तो अगले सवाल में पूरी जानकारी है।',
        },
        {
          id: 'early-arrival',
          audience: 'groom',
          question: 'क्या मैं एक दिन पहले, या 20 तारीख़ से पहले आ सकता/सकती हूँ?',
          answer: 'बिल्कुल आ सकते हैं — बस ध्यान रखें कि हमारी मेज़बानी बुधवार, 20 जनवरी से शुरू होती है, यानी जिस दिन कार्यक्रम शुरू होते हैं, उससे एक दिन पहले नहीं। हमारी ओर से रुकने की बुकिंग, पिकअप और सभी उत्सव 20 तारीख़ से ही शुरू होंगे। अगर आप पहले आ रहे हैं, तो अतिरिक्त दिनों के लिए कृपया रुकने और आने-जाने की व्यवस्था ख़ुद करें, और यात्रा विवरण फ़ॉर्म के नोट्स वाले हिस्से में हमें बता दें।',
          link: 'travelDetails',
        },
        {
          id: 'delhi-pickup',
          audience: 'groom',
          question: 'दिल्ली पहुँचने पर क्या पिकअप की व्यवस्था है?',
          answer: 'पिकअप का समय: बुधवार, 20 जनवरी, सुबह 6 से 11 बजे तक। इस दौरान हम आपकी दिल्ली एयरपोर्ट या रेलवे स्टेशन से पिकअप की व्यवस्था करेंगे — जहाँ तक संभव हो, हर आगमन के लिए अलग कैब के बजाय आगमन समय के अनुसार मेहमानों को साथ में समूहबद्ध करेंगे। कृपया सही आगमन जानकारी पहले से दें ताकि हम इसे ठीक से योजनाबद्ध कर सकें।',
        },
        {
          id: 'pickup-outside-window',
          audience: 'groom',
          question: 'अगर मैं पिकअप समय के बाहर, या किसी और दिन पहुँचूं तो?',
          answer: 'आप बेझिझक आ सकते हैं — बस ध्यान रखें कि व्यवस्थित पिकअप केवल 20 जनवरी को सुबह 6 से 11 बजे के बीच ही उपलब्ध है। इस समय के बाहर, या किसी और दिन (20 तारीख़ से पहले, या 21 तारीख़ को) पहुँचने पर, कृपया होटल तक अपनी यात्रा ख़ुद तय करें, और फ़ॉर्म के नोट्स वाले हिस्से में हमें अपनी योजना बता दें।',
        },
        {
          id: 'tickets-not-booked-yet',
          audience: 'groom',
          question: 'अगर मैंने अभी तक अपनी टिकट बुक नहीं की है तो?',
          answer: 'यह बिल्कुल ठीक है, खासकर ट्रेन के लिए — आपके रूट की बुकिंग यात्रा से बस कुछ महीने पहले ही खुल सकती है। अभी अपने अंदाज़े के साथ फ़ॉर्म भर दें, और बुकिंग हो जाने के बाद उसी मोबाइल नंबर से दोबारा फ़ॉर्म भरें ताकि आपकी जानकारी अपडेट हो, नई एंट्री न बने। फ़्लाइट आमतौर पर पहले से बुक हो सकती है, तो बुकिंग होते ही अपना फ़्लाइट नंबर जोड़ दें।',
        },
        {
          id: 'train-booking-window',
          audience: 'groom',
          question: 'ट्रेन की टिकट बुकिंग कब खुलती है?',
          answer: 'भारतीय रेलवे आपकी ट्रेन के चलने की तारीख़ से 60 दिन पहले आरक्षण खोलता है — IRCTC (वेबसाइट या ऐप) पर सुबह 8 बजे। मुंबई से मंगलवार, 19 जनवरी 2027 की शाम चलने वाली ट्रेन के लिए — जो आपको 20 तारीख़ की सुबह दिल्ली पहुँचाती है — बुकिंग शुक्रवार, 20 नवंबर 2026 को खुलेगी। अगर आप एक दिन पहले, 18 जनवरी को निकल रहे हैं, तो बुकिंग 19 नवंबर को खुलेगी। राजधानी जैसी लोकप्रिय ट्रेनों की टिकटें जल्दी बिक जाती हैं, इसलिए रिमाइंडर लगा लें और अपना IRCTC लॉगिन तैयार रखें। यात्रा जानकारी की हमारी अंतिम तारीख़ (15 नवंबर) बुकिंग खुलने से पहले है, इसलिए अभी अपने अंदाज़े के साथ फ़ॉर्म भर दें और टिकट बुक होने पर उसे अपडेट कर दें।',
          link: 'travelDetails',
        },
        {
          id: 'mumbai-rajdhani',
          audience: 'groom',
          question: 'मैं मुंबई से राजधानी से आ रहा/रही हूँ — कौन-से स्टेशन बुक करूँ?',
          answer: 'मुंबई सेंट्रल (MMCT) से चढ़ें और नई दिल्ली (NDLS) पर उतरें — यानी मुंबई राजधानी (12951), जो मुंबई सेंट्रल से लगभग शाम 5:00 बजे चलती है और लगभग सुबह 8:30 बजे नई दिल्ली पहुँचती है, यानी 20 तारीख़ को हमारे सुबह 6 से 11 बजे के पिकअप समय के भीतर। इसे मंगलवार, 19 जनवरी 2027 के लिए बुक करें। अगर बोरीवली आपके नज़दीक है, तो ट्रेन मुंबई सेंट्रल के कुछ देर बाद वहाँ भी रुकती है। हम अगस्त क्रांति राजधानी (12953) के बजाय 12951 सुझाएँगे, क्योंकि वह हज़रत निज़ामुद्दीन जाती है और उसका समय अलग है — 12951 हमारे पिकअप समय के लिए ज़्यादा सही बैठती है। समय बदल सकते हैं, इसलिए बुकिंग करते समय IRCTC या NTES पर ताज़ा जानकारी देख लें।',
        },
        {
          id: 'which-airport-station',
          audience: 'groom',
          question: 'दिल्ली में किस एयरपोर्ट या स्टेशन के लिए बुक करूँ?',
          answer: 'फ़्लाइट के लिए दिल्ली का इंदिरा गांधी अंतरराष्ट्रीय हवाई अड्डा (DEL) — ज़्यादातर लोग इसी में उतरते हैं, इसलिए यही चुनें। ट्रेन के लिए नई दिल्ली (NDLS) मुख्य स्टेशन है और हमारे पिकअप के लिए सबसे अनुकूल है। अगर आपकी ट्रेन दिल्ली के किसी और स्टेशन (हज़रत निज़ामुद्दीन, पुरानी दिल्ली या आनंद विहार) पर ख़त्म होती है, तो भी ठीक है — बस यात्रा विवरण फ़ॉर्म के नोट्स वाले हिस्से में हमें बता दें ताकि हम उसके अनुसार योजना बना सकें।',
        },
        {
          id: 'update-details',
          audience: 'groom',
          question: 'मेरी योजना बदल गई — यात्रा जानकारी कैसे अपडेट करूँ?',
          answer: 'बस उसी मोबाइल नंबर से यात्रा विवरण फ़ॉर्म दोबारा भरें — इससे आपकी मौजूदा एंट्री अपडेट हो जाती है, नई डुप्लिकेट एंट्री नहीं बनती। आप जितनी बार ज़रूरत हो यह कर सकते हैं, टिकट बुक होने के बाद भी।',
          link: 'travelDetails',
        },
        {
          id: 'id-upload',
          audience: 'groom',
          question: 'मुझे अपने पहचान पत्र की फोटो क्यों अपलोड करनी है?',
          answer: 'इसका उपयोग केवल आपकी पिकअप और ठहरने की व्यवस्था के लिए किया जाता है। आधार, पासपोर्ट या ड्राइविंग लाइसेंस — अपने और साथ आने वाले सभी के लिए — मान्य हैं। कृपया असली पहचान पत्र भी साथ रखें — होटल चेक-इन पर इसे माँगेगा।',
        },
        {
          id: 'checkout',
          audience: 'groom',
          question: 'चेकआउट कब है?',
          answer: 'शुक्रवार, 22 जनवरी को सुबह 11 बजे।',
        },
        {
          id: 'return-travel',
          audience: 'groom',
          question: 'वापसी की यात्रा कब बुक करूँ?',
          answer: 'शादी गुरुवार, 21 जनवरी की शाम को है और चेकआउट शुक्रवार, 22 जनवरी को सुबह 11 बजे है — इसलिए वापसी की यात्रा 21 की रात के बजाय 22 तारीख़ को, चेकआउट के बाद की योजना बनाएं। जनवरी में कोहरे से सुबह की रवानगी देर हो सकती है, इसलिए 22 तारीख़ को थोड़ी देर की रवानगी ज़्यादा सुरक्षित रहती है।',
        },
      ],
    },
    {
      id: 'venues',
      title: 'वेन्यू और आना-जाना',
      items: [
        {
          id: 'same-venue',
          audience: 'groom',
          question: 'क्या सभी उत्सव एक ही वेन्यू पर हैं?',
          answer: 'लगभग सभी उत्सव मुख्य वेन्यू/होटल में ही हैं, तो ठहरने के दौरान ज़्यादातर समय आपको अलग-अलग जगहों पर आने-जाने की ज़रूरत नहीं पड़ेगी।',
        },
        {
          id: 'wedding-venue-location',
          audience: 'groom',
          question: 'शादी का वेन्यू कहाँ है?',
          answer: '21 जनवरी की शादी एक अलग वेन्यू पर है, मुख्य वेन्यू/होटल से लगभग 400 मीटर दूर।',
        },
        {
          id: 'wedding-venue-transport',
          audience: 'groom',
          question: 'क्या शादी के वेन्यू तक जाने की व्यवस्था है?',
          answer: 'जी हाँ — हम होटल/मुख्य वेन्यू और शादी के वेन्यू के बीच आने-जाने की व्यवस्था करेंगे, तो आपको इसकी व्यवस्था ख़ुद करने की ज़रूरत नहीं है।',
        },
      ],
    },
    {
      id: 'food-stay',
      title: 'खाना और ठहरना',
      items: [
        {
          id: 'meals-arranged',
          audience: 'groom',
          question: 'क्या उत्सवों के दौरान खाने की व्यवस्था है?',
          answer: 'जी हाँ — शादी के उत्सवों के आसपास मेहमानों के लिए खाने की व्यवस्था की जा रही है, तो भूखे रहने की चिंता बिल्कुल न करें। लंच सहित तय किए गए भोजन इन व्यवस्थाओं का हिस्सा हैं।',
        },
        {
          id: 'separate-orders',
          audience: 'groom',
          question: 'अगर मैं होटल से अलग से कुछ ऑर्डर करूं तो?',
          answer: 'शादी के उत्सवों का हिस्सा होने वाला खाना हमारी तरफ़ से है। अगर आप अपने लिए अलग से कुछ ऑर्डर करते हैं — रूम सर्विस, पेय पदार्थ, या होटल मेन्यू से कुछ और — तो कृपया उसका भुगतान सीधे होटल को करें।',
        },
        {
          id: 'hotel-expenses',
          audience: 'groom',
          question: 'होटल का कौन-सा निजी खर्च मुझे ख़ुद देना होगा?',
          answer: 'आपका ठहरना और हमने जो व्यवस्थाएं आपके साथ साझा की हैं, वे हमारी तरफ़ से हैं। निजी खर्च — अतिरिक्त रूम सर्विस, मिनीबार या निजी खरीदारी, लॉन्ड्री, या कोई और अलग से मांगी गई होटल सेवा — सीधे होटल को देने होंगे।',
        },
        {
          id: 'room-issue',
          audience: 'groom',
          question: 'अगर मेरे कमरे में कोई समस्या हो तो मुझे क्या करना चाहिए?',
          answer: 'कमरे से जुड़ी किसी भी बात के लिए — हाउसकीपिंग, सुविधाएं, मरम्मत, चाबी, या कोई और होटल सेवा — कृपया सीधे होटल रिसेप्शन से संपर्क करें, जैसा आप किसी भी होटल ठहराव में करते हैं। होटल टीम आपकी मदद सबसे तेज़ी से कर पाएगी, और इससे हमें भी आपके साथ उत्सव मनाने का पूरा समय मिल पाएगा।',
        },
      ],
    },
    {
      id: 'nearby',
      title: 'आस-पास की ज़रूरी चीज़ें',
      items: [
        {
          id: 'rani-bagh',
          audience: 'groom',
          question: 'दवाइयों, खरीदारी या रोज़मर्रा की ज़रूरी चीज़ों के लिए कहाँ जाएं?',
          answer: 'रानी बाग़ मार्केट लगभग 400 मीटर दूर है और दवाइयों, निजी ज़रूरतों, खरीदारी, या ठहरने के दौरान आपको जो भी चाहिए उसके लिए सुविधाजनक है। थोड़ी दूरी के लिए ई-रिक्शा आसानी से मिल जाते हैं।',
        },
      ],
    },
    {
      id: 'mehndi',
      title: 'मेहंदी',
      items: [
        {
          id: 'mehndi-when',
          question: 'मेहंदी कब है?',
          answer: 'बुधवार 20 जनवरी 2027, सुबह 11 – दोपहर 2 बजे।',
        },
        {
          id: 'mehndi-rsvp',
          question: 'मैं आपको कैसे बताऊं कि मैं शामिल हो रहा/रही हूँ?',
          answer: 'मेहंदी RSVP सेक्शन का उपयोग करें — अपना नाम बताएं और यह भी कि आप शामिल हो रही हैं, शामिल नहीं हो पाएंगी, या अभी तय नहीं है। आप एक साथ एक से ज़्यादा मेहमान भी जोड़ सकती हैं।',
          link: 'mehndiRsvp',
        },
        {
          id: 'mehndi-not-sure',
          question: 'अगर मुझे अभी तक पक्का नहीं पता कि मैं आ पाऊंगी या नहीं?',
          answer: 'कोई बात नहीं — अभी के लिए "अभी तय नहीं" चुनें, और पक्का होते ही हमें बता दें।',
        },
      ],
    },
    {
      id: 'makeup',
      title: 'तैयार होना और मेकअप',
      items: [
        {
          id: 'makeup-arranged',
          question: 'क्या हमारे लिए मेकअप की व्यवस्था की गई है?',
          answer: 'सीधे तौर पर नहीं — हमने आसानी के लिए पितमपुरा के कुछ नज़दीकी सैलून की एक गाइड तैयार की है, या आप अपनी पसंदीदा आर्टिस्ट भी बुक कर सकती हैं।',
          link: 'makeup',
        },
        {
          id: 'makeup-window',
          question: 'तैयार होने के लिए कितना समय है?',
          answer: '20 और 21 जनवरी, दोपहर 3–5 बजे — यह पूरी दो घंटे की समय-सीमा सैलून जाने, मेकअप कराने और वापस आने के लिए है। कृपया शाम 5 बजे तक या उससे पहले होटल लौट आएं।',
        },
        {
          id: 'makeup-pay',
          question: 'सैलून या आर्टिस्ट का भुगतान कौन करता है?',
          answer: 'आप अपने चुने हुए सैलून से सीधे संपर्क करें, बुकिंग करें और भुगतान करें, और होटल से आने-जाने की व्यवस्था स्वयं करें।',
        },
      ],
    },
    {
      id: 'wear',
      title: 'क्या पहनें',
      items: [
        {
          id: 'dress-code',
          question: 'क्या हर उत्सव के लिए अलग ड्रेस कोड है?',
          answer: 'जी हाँ। मेहंदी के लिए फूलों वाले और हल्के (पेस्टल) रंग, हल्की हरी झलक के साथ। सगाई और कॉकटेल के लिए जूल-टोन कॉकटेल फॉर्मल — महिलाओं के लिए सिर्फ़ गाउन, कोई साड़ी, लहंगा या भारतीय परिधान नहीं। हल्दी के लिए गुलाबी रंगों के आसान, हल्दी के अनुकूल कपड़े। शादी के लिए भारतीय फॉर्मल — आइवरी, शैम्पेन और गोल्ड रंगों में।',
        },
        {
          id: 'wear-more',
          question: 'मैं और जानकारी और प्रेरणा कहाँ देख सकती/सकता हूँ?',
          answer: 'थीम्स और पहनावा पेज पर हर उत्सव की पूरी कहानी और लुक के विचार मौजूद हैं।',
          link: 'themes',
        },
        {
          id: 'guest-guide',
          question: 'क्या कोई डाउनलोड करने योग्य गाइड है?',
          answer: 'जी हाँ — फ़ुटर में दिया गया गेस्ट गाइड PDF में सब कुछ एक ही जगह मौजूद है।',
          link: 'guide',
        },
      ],
    },
    {
      id: 'weather',
      title: 'मौसम और पैकिंग',
      items: [
        {
          id: 'weather-expect',
          question: 'मौसम कैसा रहेगा?',
          answer: 'जनवरी के आख़िर में दिल्ली में कड़ाके की सर्दी होती है। दोपहर आमतौर पर धूप वाली और सुहावनी होती है, लगभग 18–20°C। सुबह और रात ठंडी होती हैं — आमतौर पर 6–8°C, और ठंड की लहर में इससे नीचे भी जा सकता है — और तड़के कोहरा आम है। सर्दी की हल्की बौछार भी संभव है। यात्रा से कुछ दिन पहले मौसम का पूर्वानुमान देख लेना अच्छा रहेगा।',
        },
        {
          id: 'pack-clothes',
          question: 'ठंड के लिए क्या-क्या पैक करूँ?',
          answer: 'परतों में कपड़े रखें। गर्म जैकेट या कोट, शॉल या स्टोल, और सुबह-शाम के लिए थर्मल या गर्म इनरवियर साथ रखें। ऐसी परतें चुनें जो आपके पहनावे के साथ जँचें: शाम के कार्यक्रमों में गाउन या भारतीय परिधान के ऊपर शॉल, रैप या केप; शेरवानी या सूट के ऊपर ब्लेज़र या जैकेट; और सुबह की हल्दी के लिए गर्म कार्डिगन या शॉल। मेहंदी (सुबह 11 से दोपहर 2 बजे) दिन के सबसे गर्म समय में है।',
        },
        {
          id: 'pack-essentials',
          question: 'दिल्ली की सर्दी के लिए और क्या रखना चाहिए?',
          answer: 'सर्दियों की हवा सूखी होती है, इसलिए अच्छा मॉइस्चराइज़र, लिप बाम और सनस्क्रीन काम आएँगे। तड़के के लिए गर्म मोज़े और आरामदायक बंद जूते, और सर्दी की बौछार के लिए एक छोटी छतरी।',
        },
        {
          id: 'fog-travel',
          audience: 'groom',
          question: 'क्या कोहरे से मेरी फ़्लाइट या ट्रेन देर हो सकती है?',
          answer: 'हो सकती है — दिल्ली में जनवरी में कोहरा आम है, ख़ासकर तड़के, और फ़्लाइट व ट्रेनें कभी-कभी देर से चलती हैं। एयरपोर्ट या स्टेशन के लिए निकलने से पहले अपनी फ़्लाइट या ट्रेन की स्थिति देख लें, और विकल्प हो तो सबसे पहली फ़्लाइट या ट्रेन के बजाय पिकअप समय के उत्तरार्ध में पहुँचना ज़्यादा सुरक्षित रहता है। पिकअप का समय 20 जनवरी को सुबह 6 से 11 बजे है; अगर देरी से आप इस समय के बाहर पहुँचते हैं, तो कृपया होटल तक अपनी यात्रा ख़ुद तय करें — और योजना बदले तो उसी मोबाइल नंबर से यात्रा विवरण फ़ॉर्म में आगमन की जानकारी अपडेट कर दें।',
          link: 'travelDetails',
        },
      ],
    },
    {
      id: 'good-to-know',
      title: 'जानना ज़रूरी',
      items: [
        {
          id: 'languages',
          question: 'क्या यह साइट अन्य भाषाओं में भी उपलब्ध है?',
          answer: 'जी हाँ — हेडर में भाषा बदलने वाले बटन से अंग्रेज़ी, हिंदी और गुजराती के बीच बदल सकते हैं।',
        },
        {
          id: 'switch-side',
          question: 'लगता है मैं गलत मेहमान पेज पर हूँ — क्या मैं बदल सकता/सकती हूँ?',
          answer: 'जी हाँ — साक्षी के मेहमानों और डॉ. सहिल के मेहमानों के बीच जाने के लिए हेडर में दिया गया स्विच लिंक इस्तेमाल करें।',
          link: 'switchAudience',
        },
        {
          id: 'contact',
          question: 'अगर मेरे कोई और सवाल हैं तो मैं किससे संपर्क करूं?',
          answer: 'अशोक और चेतना हरिया (डॉ. सहिल के माता-पिता) से संपर्क करें — यहाँ न बताई गई किसी भी बात में वे मदद करने में खुशी महसूस करेंगे।',
        },
      ],
    },
  ],
  gu: [
    {
      id: 'save-the-date',
      title: 'તારીખ નોંધી લો',
      items: [
        {
          id: 'when-bride',
          audience: 'bride',
          question: 'લગ્ન ક્યારે છે?',
          answer: 'તમારા માટે અમારા ઉત્સવો બુધવાર 20 થી ગુરુવાર 21 જાન્યુઆરી 2027 સુધી, પિતમપુરા, દિલ્હીમાં યોજાશે.',
        },
        {
          id: 'early-arrival-bride',
          audience: 'bride',
          question: 'શું હું 20 તારીખ પહેલાં આવી શકું?',
          answer: 'આવી શકો — પણ ધ્યાન રાખો કે અમારા ઉત્સવો બુધવાર, 20 જાન્યુઆરીથી શરૂ થાય છે, આગલા દિવસથી નહીં. જો તમે વહેલા આવી રહ્યા હો, તો તે દિવસો માટે કૃપા કરી મુસાફરી અને રોકાણની વ્યવસ્થા જાતે કરો.',
        },
        {
          id: 'event-dates-groom',
          audience: 'groom',
          question: 'ઉત્સવોની તારીખો શું છે?',
          answer: 'અમારા ઉત્સવો બુધવાર 20 થી શુક્રવાર 22 જાન્યુઆરી 2027 સુધી, પિતમપુરા, દિલ્હીમાં યોજાશે. મુખ્ય ઉત્સવો 20મી અને 21મી તારીખે છે — 22 જાન્યુઆરી ફક્ત ચેકઆઉટનો દિવસ છે, અલગ ઉત્સવ નથી. અમારી મહેમાનગતિ અને ઉત્સવો 20 તારીખથી શરૂ થાય છે, આગલા દિવસથી નહીં.',
        },
        {
          id: 'wedding-date-groom',
          audience: 'groom',
          question: 'લગ્ન ક્યારે છે?',
          answer: 'લગ્નવિધિ ગુરુવાર, 21 જાન્યુઆરી 2027ના રોજ છે. ઉત્સવો તેના એક દિવસ પહેલાં, બુધવાર 20 જાન્યુઆરીથી, બાકીના લગ્ન કાર્યક્રમો સાથે શરૂ થાય છે.',
        },
        {
          id: 'schedule',
          question: 'કાર્યક્રમોનું શેડ્યૂલ શું છે?',
          answer: 'ચાર ઉત્સવો: મહેંદી (20 જાન્યુઆરી, સવારે), સગાઈ અને કૉકટેલ (20 જાન્યુઆરી, સાંજે), હળદી (21 જાન્યુઆરી, સવારે), અને લગ્ન (21 જાન્યુઆરી, સાંજે). દરેકની સંપૂર્ણ વાર્તા થીમ્સ અને પોશાક પાના પર છે.',
          link: 'themes',
        },
        {
          id: 'hashtag',
          question: '#SakshiKoMilaKinara શું છે?',
          answer: 'અમારો લગ્નનો હેશટેગ — ઉત્સવોના ફોટા શેર કરતી વખતે તેનો ઉપયોગ કરવા મુક્ત મન રાખો.',
        },
      ],
    },
    {
      id: 'travel',
      title: 'મુસાફરી અને આગમન',
      items: [
        {
          id: 'confirm-travel',
          audience: 'groom',
          question: 'શું મારે મારી મુસાફરીની વિગતોની પુષ્ટિ કરવાની જરૂર છે?',
          answer: 'હા — કૃપા કરી મુસાફરીની વિગતોનું ફોર્મ ભરો જેથી અમે તમારું રોકાણ આયોજિત કરી શકીએ અને, જ્યાં લાગુ પડે ત્યાં, દિલ્હીમાં તમારું પિકઅપ ગોઠવી શકીએ. દિલ્હી સુધીની મુસાફરી બુક કરવી અને ગોઠવવી એ તમારી જવાબદારી છે.',
          link: 'travelDetails',
        },
        {
          id: 'who-books-travel',
          audience: 'groom',
          question: 'શું તમે અમારી ટિકિટ બુક કરશો, કે અમારે જાતે બુક કરવાની રહેશે?',
          answer: 'તમારા માટે જે પણ ફ્લાઇટ કે ટ્રેન અનુકૂળ હોય તે બેધડક બુક કરો — દિલ્હી સુધી પહોંચવું તમારા તરફથી છે. અહીં પહોંચ્યા પછી તમારું રોકાણ અમારા તરફથી છે, અને નિર્ધારિત પિકઅપ સમય દરમિયાન અમે તમારું એરપોર્ટ/સ્ટેશન પિકઅપ ગોઠવીશું — સંપૂર્ણ વિગતો આગળના પ્રશ્નમાં છે.',
        },
        {
          id: 'travel-deadline',
          audience: 'groom',
          question: 'મારે મારી મુસાફરીની વિગતો ક્યાં સુધીમાં આપવી જોઈએ?',
          answer: 'રવિવાર, 15 નવેમ્બર 2026. 19 જાન્યુઆરીની રવાનગી માટે ટ્રેન ટિકિટ 20 નવેમ્બરે જ ખુલે છે, તેથી જો તમે હજુ બુક ન કર્યું હોય, તો ત્યાં સુધીમાં તમારો શ્રેષ્ઠ અંદાજ ભરી દો અને બુકિંગ પછી ફોર્મ અપડેટ કરો.',
        },
        {
          id: 'arrival-date-time',
          audience: 'groom',
          question: 'મારે કઈ તારીખે પહોંચવાનું આયોજન કરવું જોઈએ?',
          answer: 'કૃપા કરી બુધવાર, 20 જાન્યુઆરી 2027ના રોજ પહોંચવાનું આયોજન કરો. ફોર્મ પર તમારો અંદાજિત સમય જણાવો — જો તે સવારે 6 થી 11 વાગ્યાના પિકઅપ સમયમાં આવે, તો આગળના પ્રશ્નમાં સંપૂર્ણ વિગતો છે.',
        },
        {
          id: 'early-arrival',
          audience: 'groom',
          question: 'શું હું એક દિવસ વહેલો, અથવા 20 તારીખ પહેલાં આવી શકું?',
          answer: 'ચોક્કસ આવી શકો — પણ કૃપા કરી ધ્યાન રાખો કે અમારી મહેમાનગતિ બુધવાર, 20 જાન્યુઆરીથી શરૂ થાય છે, એટલે કે જે દિવસે કાર્યક્રમો શરૂ થાય છે, તેના આગલા દિવસથી નહીં. અમારા તરફથી રોકાણનું બુકિંગ, પિકઅપ અને બધા ઉત્સવો 20 તારીખથી જ શરૂ થશે. જો તમે વહેલા આવી રહ્યા હો, તો વધારાના દિવસો માટે કૃપા કરી રોકાણ અને અવરજવરની વ્યવસ્થા જાતે કરો, અને મુસાફરી વિગતો ફોર્મના નોંધ વિભાગમાં અમને જણાવો.',
          link: 'travelDetails',
        },
        {
          id: 'delhi-pickup',
          audience: 'groom',
          question: 'દિલ્હી પહોંચ્યા પછી પિકઅપની વ્યવસ્થા છે?',
          answer: 'પિકઅપ સમય: બુધવાર, 20 જાન્યુઆરી, સવારે 6 થી 11 વાગ્યા સુધી. આ સમય દરમિયાન અમે તમારું દિલ્હી એરપોર્ટ અથવા રેલવે સ્ટેશનથી પિકઅપ ગોઠવીશું — શક્ય હોય ત્યાં સુધી, દરેક આગમન માટે અલગ કેબને બદલે આગમન સમય મુજબ મહેમાનોને સાથે જૂથબદ્ધ કરીશું. કૃપા કરી સાચી આગમન વિગતો અગાઉથી આપો જેથી અમે તેનું યોગ્ય આયોજન કરી શકીએ.',
        },
        {
          id: 'pickup-outside-window',
          audience: 'groom',
          question: 'જો હું પિકઅપ સમય પછી, અથવા બીજા દિવસે પહોંચું તો?',
          answer: 'તમે બેધડક આવી શકો છો — ફક્ત ધ્યાન રાખો કે ગોઠવાયેલું પિકઅપ ફક્ત 20 જાન્યુઆરીએ સવારે 6 થી 11 વાગ્યા દરમિયાન જ ઉપલબ્ધ છે. આ સમય પછી, અથવા બીજા દિવસે (20 તારીખ પહેલાં, અથવા 21મીએ) પહોંચવા પર, કૃપા કરી હોટેલ સુધીની તમારી મુસાફરી જાતે ગોઠવો, અને ફોર્મના નોંધ વિભાગમાં અમને તમારી યોજના જણાવો.',
        },
        {
          id: 'tickets-not-booked-yet',
          audience: 'groom',
          question: 'જો મેં હજુ મારી ટિકિટ બુક ન કરી હોય તો?',
          answer: 'એ બિલકુલ ઠીક છે, ખાસ કરીને ટ્રેન માટે — તમારા રૂટની બુકિંગ મુસાફરીના થોડા મહિના પહેલાં જ ખુલી શકે છે. હમણાં તમારા અંદાજ સાથે ફોર્મ ભરો, અને બુકિંગ થઈ ગયા પછી એ જ મોબાઇલ નંબરથી ફરી ફોર્મ ભરો જેથી તમારી વિગતો અપડેટ થાય, નવી એન્ટ્રી ન બને. ફ્લાઇટ સામાન્ય રીતે વહેલી બુક કરી શકાય છે, તો બુકિંગ થતાં જ તમારો ફ્લાઇટ નંબર ઉમેરો.',
        },
        {
          id: 'train-booking-window',
          audience: 'groom',
          question: 'ટ્રેનની ટિકિટ બુકિંગ ક્યારે ખુલે છે?',
          answer: 'ભારતીય રેલવે તમારી ટ્રેન ઉપડવાની તારીખના 60 દિવસ પહેલાં રિઝર્વેશન ખોલે છે — IRCTC (વેબસાઇટ અથવા એપ) પર સવારે 8 વાગ્યે. મુંબઈથી મંગળવાર, 19 જાન્યુઆરી 2027ની સાંજે ઉપડતી ટ્રેન માટે — જે તમને 20 તારીખની સવારે દિલ્હી પહોંચાડે છે — બુકિંગ શુક્રવાર, 20 નવેમ્બર 2026ના રોજ ખુલશે. જો તમે એક દિવસ વહેલા, 18 જાન્યુઆરીએ નીકળો છો, તો બુકિંગ 19 નવેમ્બરે ખુલશે. રાજધાની જેવી લોકપ્રિય ટ્રેનોની ટિકિટ ઝડપથી વેચાઈ જાય છે, તેથી રિમાઇન્ડર મૂકી દો અને તમારું IRCTC લૉગિન તૈયાર રાખો. મુસાફરી વિગતો માટેની અમારી છેલ્લી તારીખ (15 નવેમ્બર) બુકિંગ ખુલે તે પહેલાં છે, તેથી હમણાં તમારા અંદાજ સાથે ફોર્મ ભરો અને ટિકિટ બુક થયા પછી તેને અપડેટ કરો.',
          link: 'travelDetails',
        },
        {
          id: 'mumbai-rajdhani',
          audience: 'groom',
          question: 'હું મુંબઈથી રાજધાનીમાં આવું છું — કયા સ્ટેશન બુક કરવા?',
          answer: 'મુંબઈ સેન્ટ્રલ (MMCT) થી ચડો અને નવી દિલ્હી (NDLS) ઊતરો — એટલે કે મુંબઈ રાજધાની (12951), જે મુંબઈ સેન્ટ્રલથી લગભગ સાંજે 5:00 વાગ્યે ઉપડે છે અને લગભગ સવારે 8:30 વાગ્યે નવી દિલ્હી પહોંચે છે, એટલે કે 20 તારીખે અમારા સવારે 6 થી 11 વાગ્યાના પિકઅપ સમયની અંદર. તેને મંગળવાર, 19 જાન્યુઆરી 2027 માટે બુક કરો. જો બોરીવલી તમારી નજીક હોય, તો ટ્રેન મુંબઈ સેન્ટ્રલ પછી થોડી વારે ત્યાં પણ ઊભી રહે છે. અમે ઑગસ્ટ ક્રાંતિ રાજધાની (12953) કરતાં 12951 સૂચવીશું, કારણ કે તે હઝરત નિઝામુદ્દીન જાય છે અને તેનો સમય અલગ છે — 12951 અમારા પિકઅપ સમય માટે વધુ યોગ્ય બેસે છે. સમય બદલાઈ શકે છે, તેથી બુકિંગ કરતી વખતે IRCTC અથવા NTES પર તાજી માહિતી જોઈ લો.',
        },
        {
          id: 'which-airport-station',
          audience: 'groom',
          question: 'દિલ્હીમાં કયા એરપોર્ટ કે સ્ટેશન માટે બુક કરવું?',
          answer: 'ફ્લાઇટ માટે દિલ્હીનું ઇન્દિરા ગાંધી ઇન્ટરનેશનલ એરપોર્ટ (DEL) — મોટાભાગના લોકો ત્યાં જ ઊતરે છે, તેથી તે જ પસંદ કરો. ટ્રેન માટે નવી દિલ્હી (NDLS) મુખ્ય સ્ટેશન છે અને અમારા પિકઅપ માટે સૌથી અનુકૂળ છે. જો તમારી ટ્રેન દિલ્હીના બીજા કોઈ સ્ટેશન (હઝરત નિઝામુદ્દીન, જૂની દિલ્હી કે આનંદ વિહાર) પર પૂરી થતી હોય, તો પણ ઠીક છે — ફક્ત મુસાફરી વિગતો ફોર્મના નોંધ વિભાગમાં અમને જણાવો જેથી અમે તે મુજબ આયોજન કરી શકીએ.',
        },
        {
          id: 'update-details',
          audience: 'groom',
          question: 'મારી યોજના બદલાઈ — મુસાફરીની વિગતો કેવી રીતે અપડેટ કરવી?',
          answer: 'ફક્ત એ જ મોબાઇલ નંબરથી મુસાફરી વિગતો ફોર્મ ફરી ભરો — તેનાથી તમારી હાલની એન્ટ્રી અપડેટ થાય છે, નવી ડુપ્લિકેટ એન્ટ્રી બનતી નથી. જરૂર પડે એટલી વાર તમે આ કરી શકો છો, ટિકિટ બુક થયા પછી પણ.',
          link: 'travelDetails',
        },
        {
          id: 'id-upload',
          audience: 'groom',
          question: 'મારે મારા ID નો ફોટો કેમ અપલોડ કરવો પડે છે?',
          answer: 'આનો ઉપયોગ ફક્ત તમારું પિકઅપ અને રોકાણ ગોઠવવા માટે થાય છે. આધાર, પાસપોર્ટ અથવા ડ્રાઇવિંગ લાઇસન્સ — તમારા માટે અને સાથે આવતા બધા માટે — ચાલશે. કૃપા કરી અસલ ID પણ સાથે રાખો — હોટેલ ચેક-ઇન વખતે તે માંગશે.',
        },
        {
          id: 'checkout',
          audience: 'groom',
          question: 'ચેકઆઉટ ક્યારે છે?',
          answer: 'શુક્રવાર, 22 જાન્યુઆરીએ સવારે 11 વાગ્યે.',
        },
        {
          id: 'return-travel',
          audience: 'groom',
          question: 'પાછા ફરવાની મુસાફરી ક્યારે બુક કરવી?',
          answer: 'લગ્ન ગુરુવાર, 21 જાન્યુઆરીની સાંજે છે અને ચેકઆઉટ શુક્રવાર, 22 જાન્યુઆરીએ સવારે 11 વાગ્યે છે — તેથી પાછા ફરવાની મુસાફરી 21ની રાત્રિને બદલે 22 તારીખે, ચેકઆઉટ પછી ગોઠવવાનું આયોજન કરો. જાન્યુઆરીમાં ધુમ્મસથી વહેલી સવારની રવાનગી મોડી પડી શકે છે, તેથી 22 તારીખે થોડી મોડી રવાનગી વધુ સલામત રહે છે.',
        },
      ],
    },
    {
      id: 'venues',
      title: 'વેન્યુ અને અવરજવર',
      items: [
        {
          id: 'same-venue',
          audience: 'groom',
          question: 'શું બધા ઉત્સવો એક જ વેન્યુ પર છે?',
          answer: 'લગભગ બધા ઉત્સવો મુખ્ય વેન્યુ/હોટેલમાં જ છે, તો રોકાણ દરમિયાન મોટાભાગે તમારે અલગ-અલગ જગ્યાએ જવાની જરૂર નહીં પડે.',
        },
        {
          id: 'wedding-venue-location',
          audience: 'groom',
          question: 'લગ્નનું વેન્યુ ક્યાં છે?',
          answer: '21 જાન્યુઆરીનાં લગ્ન એક અલગ વેન્યુ પર છે, મુખ્ય વેન્યુ/હોટેલથી લગભગ 400 મીટર દૂર.',
        },
        {
          id: 'wedding-venue-transport',
          audience: 'groom',
          question: 'લગ્નના વેન્યુ સુધી જવાની વ્યવસ્થા છે?',
          answer: 'હા — અમે હોટેલ/મુખ્ય વેન્યુ અને લગ્નના વેન્યુ વચ્ચે અવરજવરની વ્યવસ્થા કરીશું, તો તમારે આ જાતે ગોઠવવાની જરૂર નથી.',
        },
      ],
    },
    {
      id: 'food-stay',
      title: 'ભોજન અને રોકાણ',
      items: [
        {
          id: 'meals-arranged',
          audience: 'groom',
          question: 'શું ઉત્સવો દરમિયાન ભોજનની વ્યવસ્થા છે?',
          answer: 'હા — લગ્નના ઉત્સવોની આસપાસ મહેમાનો માટે ભોજનની વ્યવસ્થા કરવામાં આવી રહી છે, તો ભૂખ્યા રહેવાની ચિંતા બિલકુલ ન કરો. લંચ સહિત નિર્ધારિત ભોજન આ વ્યવસ્થાનો ભાગ છે.',
        },
        {
          id: 'separate-orders',
          audience: 'groom',
          question: 'જો હું હોટેલમાંથી અલગથી કંઈક ઓર્ડર કરું તો?',
          answer: 'લગ્નના ઉત્સવોનો ભાગ હોય તેવું ભોજન અમારા તરફથી છે. જો તમે તમારા માટે અલગથી કંઈક ઓર્ડર કરો છો — રૂમ સર્વિસ, પીણાં, અથવા હોટેલ મેનૂમાંથી બીજું કંઈ — તો કૃપા કરી તેની ચુકવણી સીધી હોટેલને કરો.',
        },
        {
          id: 'hotel-expenses',
          audience: 'groom',
          question: 'હોટેલનો કયો અંગત ખર્ચ મારે જાતે ચૂકવવો પડશે?',
          answer: 'તમારું રોકાણ અને અમે તમારી સાથે શેર કરેલી વ્યવસ્થાઓ અમારા તરફથી છે. અંગત ખર્ચ — વધારાની રૂમ સર્વિસ, મિનીબાર અથવા અંગત ખરીદી, લોન્ડ્રી, અથવા બીજી કોઈ અલગથી માંગેલી હોટેલ સેવા — સીધી હોટેલને ચૂકવવી પડશે.',
        },
        {
          id: 'room-issue',
          audience: 'groom',
          question: 'જો મારા રૂમમાં કોઈ સમસ્યા હોય તો મારે શું કરવું જોઈએ?',
          answer: 'રૂમને લગતી કોઈપણ બાબત માટે — હાઉસકીપિંગ, સુવિધાઓ, સમારકામ, ચાવી, અથવા બીજી કોઈ હોટેલ સેવા — કૃપા કરી સીધા હોટેલ રિસેપ્શનનો સંપર્ક કરો, જેમ તમે કોઈપણ હોટેલ રોકાણમાં કરો છો. હોટેલ ટીમ તમને સૌથી ઝડપથી મદદ કરી શકશે, અને તેનાથી અમને પણ તમારી સાથે ઉત્સવ માણવાનો પૂરો સમય મળશે.',
        },
      ],
    },
    {
      id: 'nearby',
      title: 'નજીકની જરૂરી ચીજો',
      items: [
        {
          id: 'rani-bagh',
          audience: 'groom',
          question: 'દવાઓ, ખરીદી કે રોજિંદી જરૂરી ચીજો માટે ક્યાં જવું?',
          answer: 'રાની બાગ માર્કેટ લગભગ 400 મીટર દૂર છે અને દવાઓ, અંગત જરૂરિયાતો, ખરીદી, અથવા રોકાણ દરમિયાન તમને જે પણ જોઈએ તેના માટે અનુકૂળ છે. થોડા અંતર માટે ઇ-રિક્ષા સરળતાથી મળી રહે છે.',
        },
      ],
    },
    {
      id: 'mehndi',
      title: 'મહેંદી',
      items: [
        {
          id: 'mehndi-when',
          question: 'મહેંદી ક્યારે છે?',
          answer: 'બુધવાર 20 જાન્યુઆરી 2027, સવારે 11 – બપોરે 2 વાગ્યા.',
        },
        {
          id: 'mehndi-rsvp',
          question: 'હું તમને કેવી રીતે જણાવું કે હું જોડાઈ રહ્યો/રહી છું?',
          answer: 'મહેંદી RSVP વિભાગનો ઉપયોગ કરો — તમારું નામ અને તમે જોડાઈ રહ્યા છો, જોડાઈ શકશો નહીં, કે હજુ નક્કી નથી તે જણાવો. તમે એક સાથે એકથી વધુ મહેમાન પણ ઉમેરી શકો છો.',
          link: 'mehndiRsvp',
        },
        {
          id: 'mehndi-not-sure',
          question: 'જો મને હજુ ખાતરી ન હોય કે હું આવી શકીશ કે નહીં?',
          answer: 'કોઈ વાંધો નહીં — હમણાં માટે "હજુ નક્કી નથી" પસંદ કરો, અને નક્કી થતાં જ અમને જણાવો.',
        },
      ],
    },
    {
      id: 'makeup',
      title: 'તૈયાર થવું અને મેકઅપ',
      items: [
        {
          id: 'makeup-arranged',
          question: 'શું અમારા માટે મેકઅપની વ્યવસ્થા કરવામાં આવી છે?',
          answer: 'સીધી રીતે નહીં — શોધવાનું સરળ બનાવવા અમે પિતમપુરાનાં થોડાં નજીકનાં સલૂનની ગાઇડ તૈયાર કરી છે, અથવા તમે તમારી મનપસંદ આર્ટિસ્ટ પણ બુક કરી શકો છો.',
          link: 'makeup',
        },
        {
          id: 'makeup-window',
          question: 'તૈયાર થવા માટેનો સમય ગાળો કયો છે?',
          answer: '20 અને 21 જાન્યુઆરી, બપોરે 3–5 વાગ્યા — આ સંપૂર્ણ બે-કલાકની સમય-મર્યાદા સલૂન જવા, મેકઅપ કરાવવા અને પાછા આવવા માટેની છે. કૃપા કરી સાંજે 5 વાગ્યા સુધીમાં અથવા તે પહેલાં હોટેલ પરત ફરો.',
        },
        {
          id: 'makeup-pay',
          question: 'સલૂન કે આર્ટિસ્ટની ચુકવણી કોણ કરે છે?',
          answer: 'તમે તમારા પસંદ કરેલા સલૂનનો સીધો સંપર્ક કરો, બુક કરો અને ચુકવણી કરો, અને હોટેલથી આવવા-જવાની વ્યવસ્થા જાતે કરો.',
        },
      ],
    },
    {
      id: 'wear',
      title: 'શું પહેરવું',
      items: [
        {
          id: 'dress-code',
          question: 'શું દરેક ઉત્સવ માટે અલગ ડ્રેસ કોડ છે?',
          answer: 'હા. મહેંદી માટે ફૂલોવાળા અને હળવા (પેસ્ટલ) રંગો, થોડી લીલી ઝલક સાથે. સગાઈ અને કૉકટેલ માટે જ્વેલ-ટોન કૉકટેલ ફોર્મલ — મહિલાઓ માટે ફક્ત ગાઉન, કોઈ સાડી, લહેંગા કે ભારતીય પોશાક નહીં. હળદી માટે ગુલાબી રંગોના સરળ, હળદી-અનુકૂળ કપડાં. લગ્ન માટે ભારતીય ફોર્મલ — આઇવરી, શેમ્પેઇન અને ગોલ્ડ રંગોમાં.',
        },
        {
          id: 'wear-more',
          question: 'હું વધુ વિગતો અને પ્રેરણા ક્યાં જોઈ શકું?',
          answer: 'થીમ્સ અને પોશાક પાના પર દરેક ઉત્સવની સંપૂર્ણ વાર્તા અને લુકના વિચારો છે.',
          link: 'themes',
        },
        {
          id: 'guest-guide',
          question: 'શું કોઈ ડાઉનલોડ કરી શકાય તેવી ગાઇડ છે?',
          answer: 'હા — ફૂટરમાં આપેલ ગેસ્ટ ગાઇડ PDF માં બધું એક જ જગ્યાએ છે.',
          link: 'guide',
        },
      ],
    },
    {
      id: 'weather',
      title: 'હવામાન અને પેકિંગ',
      items: [
        {
          id: 'weather-expect',
          question: 'હવામાન કેવું રહેશે?',
          answer: 'જાન્યુઆરીના અંતમાં દિલ્હીમાં કડકડતી શિયાળાની ઋતુ હોય છે. બપોર સામાન્ય રીતે તડકાવાળી અને સુખદ હોય છે, લગભગ 18–20°C. સવાર અને રાત ઠંડી હોય છે — સામાન્ય રીતે 6–8°C, અને ઠંડીની લહેરમાં તેનાથી પણ નીચે જઈ શકે છે — અને વહેલી સવારે ધુમ્મસ સામાન્ય છે. શિયાળાનો હળવો વરસાદ પણ શક્ય છે. મુસાફરીના થોડા દિવસ પહેલાં હવામાનની આગાહી જોઈ લેવી સારી રહેશે.',
        },
        {
          id: 'pack-clothes',
          question: 'ઠંડી માટે શું પેક કરવું?',
          answer: 'સ્તરોમાં કપડાં રાખો. ગરમ જેકેટ અથવા કોટ, શાલ અથવા સ્ટોલ, અને સવાર-સાંજ માટે થર્મલ અથવા ગરમ ઇનરવેર સાથે રાખો. એવા સ્તરો પસંદ કરો જે તમારા પોશાક સાથે શોભે: સાંજના કાર્યક્રમોમાં ગાઉન અથવા ભારતીય પોશાક પર શાલ, રેપ કે કેપ; શેરવાની અથવા સૂટ પર બ્લેઝર કે જેકેટ; અને સવારની હળદી માટે ગરમ કાર્ડિગન કે શાલ. મહેંદી (સવારે 11 થી બપોરે 2) દિવસના સૌથી ગરમ સમયમાં છે.',
        },
        {
          id: 'pack-essentials',
          question: 'દિલ્હીના શિયાળા માટે બીજું શું રાખવું?',
          answer: 'શિયાળાની હવા સૂકી હોય છે, તેથી સારું મૉઇશ્ચરાઇઝર, લિપ બામ અને સનસ્ક્રીન કામ આવશે. વહેલી સવાર માટે ગરમ મોજાં અને આરામદાયક બંધ શૂઝ, અને શિયાળાના ઝાપટા માટે નાની છત્રી.',
        },
        {
          id: 'fog-travel',
          audience: 'groom',
          question: 'શું ધુમ્મસને કારણે મારી ફ્લાઇટ કે ટ્રેન મોડી પડી શકે?',
          answer: 'પડી શકે — દિલ્હીમાં જાન્યુઆરીમાં ધુમ્મસ સામાન્ય છે, ખાસ કરીને વહેલી સવારે, અને ફ્લાઇટ તથા ટ્રેન ક્યારેક મોડી પડે છે. એરપોર્ટ કે સ્ટેશન જવા નીકળતા પહેલાં તમારી ફ્લાઇટ કે ટ્રેનની સ્થિતિ જોઈ લો, અને વિકલ્પ હોય તો સૌથી પહેલી ફ્લાઇટ કે ટ્રેનને બદલે પિકઅપ સમયના પાછલા ભાગમાં પહોંચવું વધુ સલામત રહે છે. પિકઅપ સમય 20 જાન્યુઆરીએ સવારે 6 થી 11 વાગ્યા છે; જો મોડું થવાથી તમે આ સમયની બહાર પહોંચો, તો કૃપા કરી હોટેલ સુધીની મુસાફરી જાતે ગોઠવો — અને યોજના બદલાય તો એ જ મોબાઇલ નંબરથી મુસાફરી વિગતો ફોર્મમાં આગમનની માહિતી અપડેટ કરો.',
          link: 'travelDetails',
        },
      ],
    },
    {
      id: 'good-to-know',
      title: 'જાણવા જેવું',
      items: [
        {
          id: 'languages',
          question: 'શું આ સાઇટ બીજી ભાષાઓમાં પણ ઉપલબ્ધ છે?',
          answer: 'હા — હેડરમાં આપેલ ભાષા સ્વિચરથી અંગ્રેજી, હિન્દી અને ગુજરાતી વચ્ચે બદલી શકો છો.',
        },
        {
          id: 'switch-side',
          question: 'લાગે છે હું ખોટા મહેમાન પાના પર છું — શું હું બદલી શકું?',
          answer: 'હા — સાક્ષીના મહેમાનો અને ડૉ. સહિલના મહેમાનો વચ્ચે જવા માટે હેડરમાં આપેલ સ્વિચ લિંકનો ઉપયોગ કરો.',
          link: 'switchAudience',
        },
        {
          id: 'contact',
          question: 'જો મારે હજુ પ્રશ્નો હોય તો હું કોનો સંપર્ક કરું?',
          answer: 'અશોક અને ચેતના હરિયાનો (ડૉ. સહિલના માતા-પિતા) સંપર્ક કરો — અહીં ન જણાવેલી કોઈપણ બાબતમાં મદદ કરવામાં તેમને આનંદ થશે.',
        },
      ],
    },
  ],
}
