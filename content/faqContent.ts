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
  // Omit to show on both guest pages. Travel & Arrival only exists on the
  // groom's side (bride's guests have no Travel Details form), and the
  // "when is it" question needs a different date range per audience since
  // bride's guests only attend the 20th and 21st, not the 22nd checkout.
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
// — nothing here introduces a fact (a venue name, a phone number, etc.)
// that isn't already established somewhere else.
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
          id: 'when-groom',
          audience: 'groom',
          question: 'When is the wedding?',
          answer: 'Wednesday 20 to Friday 22 January 2027, in Pitampura, Delhi — the 22nd is checkout, not a separate celebration.',
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
          question: 'Do I need to confirm my travel?',
          answer: 'Yes — please fill out the Travel Details form so we can arrange your pickup and stay.',
          link: 'travelDetails',
        },
        {
          id: 'who-books-travel',
          audience: 'groom',
          question: 'Do you book our tickets, or should we do that ourselves?',
          answer: 'Please go ahead and book whichever flight or train works best for you. The Travel Details form just helps us know your plans — your airport/station transfer and your stay here are both taken care of for you.',
        },
        {
          id: 'travel-deadline',
          audience: 'groom',
          question: 'What’s the deadline to submit my travel details?',
          answer: 'Tuesday, 20 October 2026.',
        },
        {
          id: 'arrival-date-time',
          audience: 'groom',
          question: 'What date and time should I plan to arrive?',
          answer: 'Please plan to arrive on Wednesday, 20 January 2027. Choose your arrival time on the form — options run from early morning through 2 pm, so we can plan your pickup around it.',
        },
        {
          id: 'not-booked-yet',
          audience: 'groom',
          question: 'I haven’t booked my travel yet — what do I enter?',
          answer: 'That’s completely fine, especially for trains. Give your best estimate for arrival time so we can plan around it, and leave the flight/train number blank until you’ve booked — you can always come back and update it.',
        },
        {
          id: 'train-not-open',
          audience: 'groom',
          question: 'Train tickets for my route aren’t open for booking yet — what should I do?',
          answer: 'Train bookings usually open only a couple of months before travel. Submit the form now with your best estimate, and once you’ve booked, just fill it out again with the same mobile number — it updates your existing details rather than creating a duplicate.',
        },
        {
          id: 'flight-booked-early',
          audience: 'groom',
          question: 'Can I add my flight details now?',
          answer: 'Yes — flights can usually be booked further in advance than trains, so feel free to add your flight number as soon as you’ve booked it.',
        },
        {
          id: 'id-upload',
          audience: 'groom',
          question: 'Why do I need to upload a photo of my ID?',
          answer: 'It’s used only to arrange your pickup and stay. Aadhar, Passport or Driving Licence all work, for yourself and anyone travelling with you.',
        },
        {
          id: 'different-day',
          audience: 'groom',
          question: 'What if I’m arriving on a different day — the 21st, or the wedding day itself?',
          answer: 'That’s completely fine — just let us know in the notes field on the Travel Details form, along with your flight or train details if you have them.',
        },
        {
          id: 'checkout',
          audience: 'groom',
          question: 'When is checkout?',
          answer: '11 am on Friday, 22 January.',
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
          answer: 'Reach out to Sakshi & Dr. Sahil directly, or whoever shared this site with you.',
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
          id: 'when-groom',
          audience: 'groom',
          question: 'शादी कब है?',
          answer: 'बुधवार 20 से शुक्रवार 22 जनवरी 2027 तक, पितमपुरा, दिल्ली में — 22 तारीख़ सिर्फ़ चेकआउट है, कोई अलग उत्सव नहीं।',
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
          question: 'क्या मुझे अपनी यात्रा की पुष्टि करनी होगी?',
          answer: 'हाँ — कृपया यात्रा विवरण फ़ॉर्म भरें ताकि हम आपकी पिकअप और ठहरने की व्यवस्था कर सकें।',
          link: 'travelDetails',
        },
        {
          id: 'who-books-travel',
          audience: 'groom',
          question: 'क्या आप हमारी टिकट बुक करेंगे, या हमें खुद बुक करनी होगी?',
          answer: 'जो भी फ़्लाइट या ट्रेन आपके लिए सही रहे, बेझिझक उसकी बुकिंग करें। यात्रा विवरण फ़ॉर्म बस हमें आपकी योजना बताने के लिए है — आपका एयरपोर्ट/स्टेशन ट्रांसफर और यहाँ ठहरना, दोनों की व्यवस्था हमारी तरफ़ से है।',
        },
        {
          id: 'travel-deadline',
          audience: 'groom',
          question: 'अपनी यात्रा जानकारी देने की आख़िरी तारीख़ क्या है?',
          answer: 'मंगलवार, 20 अक्टूबर 2026।',
        },
        {
          id: 'arrival-date-time',
          audience: 'groom',
          question: 'मुझे किस तारीख़ और समय पर पहुँचने की योजना बनानी चाहिए?',
          answer: 'कृपया बुधवार, 20 जनवरी 2027 को पहुँचने की योजना बनाएं। फ़ॉर्म पर अपना आगमन समय चुनें — विकल्प सुबह जल्दी से लेकर दोपहर 2 बजे तक हैं, ताकि हम उसी के अनुसार आपकी पिकअप की योजना बना सकें।',
        },
        {
          id: 'not-booked-yet',
          audience: 'groom',
          question: 'मैंने अभी तक अपनी यात्रा बुक नहीं की है — मैं क्या भरूं?',
          answer: 'यह बिल्कुल ठीक है, खासकर ट्रेन के लिए। अपने आगमन समय का अंदाज़ा बता दें ताकि हम उसी के अनुसार योजना बना सकें, और फ़्लाइट/ट्रेन नंबर खाली छोड़ दें जब तक आप बुकिंग नहीं कर लेते — आप इसे बाद में कभी भी अपडेट कर सकते हैं।',
        },
        {
          id: 'train-not-open',
          audience: 'groom',
          question: 'मेरे रूट के लिए ट्रेन टिकट अभी बुकिंग के लिए नहीं खुले हैं — मुझे क्या करना चाहिए?',
          answer: 'ट्रेन की बुकिंग आमतौर पर यात्रा से बस कुछ महीने पहले ही खुलती है। अभी अपने अंदाज़े के साथ फ़ॉर्म भर दें, और बुकिंग हो जाने के बाद उसी मोबाइल नंबर से फिर से फ़ॉर्म भर दें — इससे आपकी मौजूदा जानकारी अपडेट हो जाएगी, कोई नई एंट्री नहीं बनेगी।',
        },
        {
          id: 'flight-booked-early',
          audience: 'groom',
          question: 'क्या मैं अभी अपनी फ़्लाइट की जानकारी दे सकता/सकती हूँ?',
          answer: 'जी हाँ — फ़्लाइट आमतौर पर ट्रेन से पहले बुक की जा सकती है, तो बुकिंग होते ही बेझिझक अपना फ़्लाइट नंबर जोड़ दें।',
        },
        {
          id: 'id-upload',
          audience: 'groom',
          question: 'मुझे अपने पहचान पत्र की फोटो क्यों अपलोड करनी है?',
          answer: 'इसका उपयोग केवल आपकी पिकअप और ठहरने की व्यवस्था के लिए किया जाता है। आधार, पासपोर्ट या ड्राइविंग लाइसेंस — अपने और साथ आने वाले सभी के लिए — मान्य हैं।',
        },
        {
          id: 'different-day',
          audience: 'groom',
          question: 'अगर मैं किसी और दिन पहुँच रहा/रही हूँ — 21 तारीख़ को, या शादी वाले दिन ही — तो क्या करूं?',
          answer: 'यह बिल्कुल ठीक है — बस यात्रा विवरण फ़ॉर्म के नोट्स वाले हिस्से में हमें बता दें, साथ में अपनी फ़्लाइट या ट्रेन की जानकारी भी अगर आपके पास हो।',
        },
        {
          id: 'checkout',
          audience: 'groom',
          question: 'चेकआउट कब है?',
          answer: 'शुक्रवार, 22 जनवरी को सुबह 11 बजे।',
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
          answer: 'सीधे साक्षी और डॉ. सहिल से संपर्क करें, या जिसने भी आपके साथ यह साइट साझा की है।',
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
          id: 'when-groom',
          audience: 'groom',
          question: 'લગ્ન ક્યારે છે?',
          answer: 'બુધવાર 20 થી શુક્રવાર 22 જાન્યુઆરી 2027 સુધી, પિતમપુરા, દિલ્હીમાં — 22મી તારીખ ફક્ત ચેકઆઉટ છે, અલગ ઉત્સવ નથી.',
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
          question: 'શું મારે મારી મુસાફરીની પુષ્ટિ કરવાની જરૂર છે?',
          answer: 'હા — કૃપા કરી મુસાફરીની વિગતોનું ફોર્મ ભરો જેથી અમે તમારું પિકઅપ અને રોકાણ ગોઠવી શકીએ.',
          link: 'travelDetails',
        },
        {
          id: 'who-books-travel',
          audience: 'groom',
          question: 'શું તમે અમારી ટિકિટ બુક કરશો, કે અમારે જાતે બુક કરવાની રહેશે?',
          answer: 'તમારા માટે જે પણ ફ્લાઇટ કે ટ્રેન અનુકૂળ હોય તે બેધડક બુક કરો. મુસાફરીની વિગતોનું ફોર્મ ફક્ત અમને તમારી યોજના જણાવવા માટે છે — તમારું એરપોર્ટ/સ્ટેશન ટ્રાન્સફર અને અહીંનું રોકાણ, બંનેની વ્યવસ્થા અમારા તરફથી છે.',
        },
        {
          id: 'travel-deadline',
          audience: 'groom',
          question: 'મારી મુસાફરીની વિગતો શેર કરવાની છેલ્લી તારીખ કઈ છે?',
          answer: 'મંગળવાર, 20 ઓક્ટોબર 2026.',
        },
        {
          id: 'arrival-date-time',
          audience: 'groom',
          question: 'મારે કઈ તારીખ અને સમયે પહોંચવાનું આયોજન કરવું જોઈએ?',
          answer: 'કૃપા કરી બુધવાર, 20 જાન્યુઆરી 2027ના રોજ પહોંચવાનું આયોજન કરો. ફોર્મ પર તમારો આગમનનો સમય પસંદ કરો — વિકલ્પો વહેલી સવારથી બપોરે 2 વાગ્યા સુધીના છે, જેથી અમે તે મુજબ તમારું પિકઅપ ગોઠવી શકીએ.',
        },
        {
          id: 'not-booked-yet',
          audience: 'groom',
          question: 'મેં હજુ મારી મુસાફરી બુક નથી કરી — હું શું ભરું?',
          answer: 'એ બિલકુલ ઠીક છે, ખાસ કરીને ટ્રેન માટે. તમારા આગમન સમયનો અંદાજ જણાવો જેથી અમે તે મુજબ આયોજન કરી શકીએ, અને ફ્લાઇટ/ટ્રેન નંબર ત્યાં સુધી ખાલી રાખો જ્યાં સુધી તમે બુકિંગ ન કરો — તમે તેને પછી ગમે ત્યારે અપડેટ કરી શકો છો.',
        },
        {
          id: 'train-not-open',
          audience: 'groom',
          question: 'મારા રૂટ માટે ટ્રેન ટિકિટ હજુ બુકિંગ માટે ખુલી નથી — મારે શું કરવું જોઈએ?',
          answer: 'ટ્રેનની બુકિંગ સામાન્ય રીતે મુસાફરીના થોડા મહિના પહેલાં જ ખુલે છે. હમણાં તમારા અંદાજ સાથે ફોર્મ ભરો, અને બુકિંગ થઈ ગયા પછી એ જ મોબાઇલ નંબરથી ફરી ફોર્મ ભરો — તેનાથી તમારી હાલની વિગતો અપડેટ થશે, નવી એન્ટ્રી નહીં બને.',
        },
        {
          id: 'flight-booked-early',
          audience: 'groom',
          question: 'શું હું અત્યારે મારી ફ્લાઇટની વિગતો આપી શકું?',
          answer: 'હા — ફ્લાઇટ સામાન્ય રીતે ટ્રેન કરતાં વહેલી બુક કરી શકાય છે, તો બુકિંગ થતાં જ તમારો ફ્લાઇટ નંબર ઉમેરવામાં મુક્ત મન રાખો.',
        },
        {
          id: 'id-upload',
          audience: 'groom',
          question: 'મારે મારા ID નો ફોટો કેમ અપલોડ કરવો પડે છે?',
          answer: 'આનો ઉપયોગ ફક્ત તમારું પિકઅપ અને રોકાણ ગોઠવવા માટે થાય છે. આધાર, પાસપોર્ટ અથવા ડ્રાઇવિંગ લાઇસન્સ — તમારા માટે અને સાથે આવતા બધા માટે — ચાલશે.',
        },
        {
          id: 'different-day',
          audience: 'groom',
          question: 'જો હું કોઈ બીજા દિવસે આવી રહ્યો/રહી છું — 21મીએ, અથવા લગ્નના દિવસે જ — તો શું કરું?',
          answer: 'એ બિલકુલ ઠીક છે — ફક્ત મુસાફરીની વિગતોના ફોર્મમાં નોંધ વિભાગમાં અમને જણાવો, અને જો હોય તો તમારી ફ્લાઇટ કે ટ્રેનની વિગતો પણ સાથે જણાવો.',
        },
        {
          id: 'checkout',
          audience: 'groom',
          question: 'ચેકઆઉટ ક્યારે છે?',
          answer: 'શુક્રવાર, 22 જાન્યુઆરીએ સવારે 11 વાગ્યે.',
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
          answer: 'સીધો સાક્ષી અને ડૉ. સહિલનો સંપર્ક કરો, અથવા જેમણે પણ તમારી સાથે આ સાઇટ શેર કરી હોય તેમનો.',
        },
      ],
    },
  ],
}
