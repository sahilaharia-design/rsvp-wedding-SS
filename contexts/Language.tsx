'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Lang = 'en' | 'hi' | 'gu'

export const strings = {
  en: {
    saveTheDate:       'Save the Date',
    tapToOpen:         'Tap to open',
    tapToContinue:     'Tap to continue',
    celebrationOf:     'The Wedding Celebration of',
    inviteHeading:     'You Are Invited to Celebrate With Us',
    inviteBody1:       'Sakshi and Dr. Sahil will be celebrating their wedding in Pitampura, Delhi across three extraordinary days — 20th, 21st, and 22nd January 2027.',
    inviteBody2:       'Please confirm your presence by',
    deadline:          '18 June 2026',
    travelHeading:     'Plan Your Travel to Delhi',
    travelBody1:       'Whether you\'re flying in, taking a train, or driving — January is peak travel season across India. Book your tickets and accommodation well in advance to avoid any last-minute hassle.',
    travelBody2:       'Once you reach Delhi, we will take care of everything — transport to the venue, and accommodation throughout the celebrations.',
    travelFootnote:    'Check-in: 20 Jan · Checkout: 22 Jan',
    confirmPresence:   'Confirm Your\nPresence',
    respondBy:         'Kindly respond by 18 June 2026',
    fullName:          'Full Name',
    mobile:            'Mobile Number',
    attending:         'Will you be attending?',
    yesAttend:         'Yes, I\'ll be there',
    noAttend:          'Unable to attend',
    guestCount:        'How many guests are you bringing?',
    guestCountNote:    'Enter 0 if attending alone',
    guestNames:        'Guest Names',
    guestLabel:        'Guest',
    travelMode:        'How are you travelling to Delhi?',
    byFlight:          'By Flight',
    byTrain:           'By Train',
    byRoad:            'By Road',
    confirmBtn:        'Confirm Attendance',
    sending:           'Sending…',
    responseReceived:  'Response Received',
    thankYou:          'Thank you.',
    thankYouBody:      'Your response has been received.\nWe\'re looking forward to celebrating together.',
    withLove:          'With love, Sakshi & Sahil',
    alreadyReceived:   'Already received.',
    alreadyBody:       'We already have your response on file.\nThank you — see you in Pitampura, Delhi.',
    confirmAttend:     'Confirm Attendance →',
  },
  hi: {
    saveTheDate:       'तारीख याद रखें',
    tapToOpen:         'खोलने के लिए टैप करें',
    tapToContinue:     'जारी रखने के लिए टैप करें',
    celebrationOf:     'विवाह उत्सव',
    inviteHeading:     'हम आपको आमंत्रित करते हैं',
    inviteBody1:       'साक्षी और डॉ. सहिल का विवाह उत्सव पीतमपुरा, दिल्ली में तीन खास दिनों — 20, 21 और 22 जनवरी 2027 — को मनाया जाएगा।',
    inviteBody2:       'कृपया अपनी उपस्थिति की पुष्टि करें',
    deadline:          '18 जून 2026 तक',
    travelHeading:     'दिल्ली कैसे पहुँचें',
    travelBody1:       'जनवरी में यात्रा की अधिक भीड़ रहती है — हवाई जहाज, ट्रेन या सड़क, जिससे भी आएं, टिकट और होटल पहले से बुक कर लें।',
    travelBody2:       'दिल्ली पहुँचने के बाद सब हमारी ज़िम्मेदारी — वेन्यू तक आना-जाना और रहने की व्यवस्था हम करेंगे।',
    travelFootnote:    'चेक-इन: 20 जनवरी · चेक-आउट: 22 जनवरी',
    confirmPresence:   'अपनी उपस्थिति\nसुनिश्चित करें',
    respondBy:         'कृपया 18 जून 2026 तक सूचित करें',
    fullName:          'पूरा नाम',
    mobile:            'मोबाइल नंबर',
    attending:         'क्या आप शामिल होंगे?',
    yesAttend:         'हाँ, मैं आऊँगा/आऊँगी',
    noAttend:          'आने में असमर्थ हूँ',
    guestCount:        'आप कितने मेहमान ला रहे हैं?',
    guestCountNote:    '0 दर्ज करें यदि अकेले आ रहे हैं',
    guestNames:        'मेहमानों के नाम',
    guestLabel:        'मेहमान',
    travelMode:        'आप दिल्ली कैसे आ रहे हैं?',
    byFlight:          'हवाई जहाज़ से',
    byTrain:           'ट्रेन से',
    byRoad:            'सड़क से',
    confirmBtn:        'उपस्थिति की पुष्टि करें',
    sending:           'भेजा जा रहा है…',
    responseReceived:  'प्रतिक्रिया प्राप्त हुई',
    thankYou:          'धन्यवाद।',
    thankYouBody:      'आपकी प्रतिक्रिया मिल गई है।\nहम आपके साथ जश्न मनाने के लिए उत्सुक हैं।',
    withLove:          'साक्षी और सहिल की ओर से',
    alreadyReceived:   'पहले से प्राप्त।',
    alreadyBody:       'आपकी प्रतिक्रिया पहले से दर्ज है।\nधन्यवाद — दिल्ली में मिलेंगे।',
    confirmAttend:     'उपस्थिति की पुष्टि करें →',
  },
  gu: {
    saveTheDate:       'તારીખ યાદ રાખો',
    tapToOpen:         'ખોલવા ટૅપ કરો',
    tapToContinue:     'ચાલુ રાખવા ટૅપ કરો',
    celebrationOf:     'લગ્ન ઉત્સવ',
    inviteHeading:     'તમને અમારા ઉત્સવમાં આમંત્રણ',
    inviteBody1:       'સાક્ષી અને ડૉ. સહિલના લગ્ન પીતામ્પુરા, દિલ્હીમાં ત્રણ ખાસ દિવસો — ૨૦, ૨૧ અને ૨૨ જાન્યુઆરી ૨૦૨૭ — ઊજવવામાં આવશે।',
    inviteBody2:       'કૃપા કરી તમારી હાજરી નિશ્ચિત કરો',
    deadline:          '૧૮ જૂન ૨૦૨૬ સુધીમાં',
    travelHeading:     'દિલ્હી કેવી રીતે પહોંચશો',
    travelBody1:       'જાન્યુઆરી ભારતભરમાં પ્રવાસ માટે વ્યસ્ત સમય છે — વિમાન, ટ્રેન કે રસ્તા, ગમે ત્યાંથી આવો, ટિકિટ અગાઉથી બૂક કરી લો।',
    travelBody2:       'દિલ્હી પહોંચ્યા પછી બધી જ જવાબદારી અમારી — વેન્યૂ સુધી આવ-જા અને રહેવાની સગવડ અમે કરીશું।',
    travelFootnote:    'ચેક-ઇન: ૨૦ જાન · ચેક-આઉટ: ૨૨ જાન',
    confirmPresence:   'તમારી હાજરી\nનિશ્ચિત કરો',
    respondBy:         'કૃપા ૧૮ જૂન ૨૦૨૬ સુધી જણાવો',
    fullName:          'પૂરું નામ',
    mobile:            'મોબાઈલ નંબર',
    attending:         'શું તમે ઉપસ્થિત રહેશો?',
    yesAttend:         'હા, હું આવીશ',
    noAttend:          'આવી નહીં શકું',
    guestCount:        'તમે કેટલા મહેમાન લાવો છો?',
    guestCountNote:    '0 દાખલ કરો જો એકલા આવો',
    guestNames:        'મહેમાનોના નામ',
    guestLabel:        'મહેમાન',
    travelMode:        'તમે દિલ્હી કઈ રીતે આવો છો?',
    byFlight:          'વિમાનથી',
    byTrain:           'ટ્રેનથી',
    byRoad:            'રસ્તા દ્વારા',
    confirmBtn:        'હાજરીની પુષ્ટિ કરો',
    sending:           'મોકલાઈ રહ્યું છે…',
    responseReceived:  'પ્રતિભાવ મળ્યો',
    thankYou:          'ધન્યવાદ।',
    thankYouBody:      'તમારો પ્રતિભાવ મળ્યો.\nઅમે તમારી સાથે ઉજવણી કરવા આતુર છીએ।',
    withLove:          'સાક્ષી અને સહિલ તરફથી',
    alreadyReceived:   'પહેલેથી મળ્યો.',
    alreadyBody:       'તમારો પ્રતિભાવ નોંધ્યો છે.\nઆભાર — દિલ્હીમાં મળીશું।',
    confirmAttend:     'હાજરીની પુષ્ટિ કરો →',
  },
}

type Strings = typeof strings.en
const LanguageContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: Strings
}>({ lang: 'en', setLang: () => {}, t: strings.en })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: strings[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
