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
    eventDates:        'Wed 20 – Fri 22 January 2027',
    inviteBody1:       'This celebration is for the people closest to our hearts. Your presence will mean the world to us — we\'d love to know if you\'ll be joining.',
    inviteBody2:       'To help us make all the necessary arrangements for your stay, kindly confirm by',
    deadline:          '25 July 2026',
    rsvpDeadlineLabel: 'RSVP by',
    arrangementNote:   'To help us make all the necessary arrangements for your stay, kindly confirm your attendance.',
    travelHeading:     'Plan Your Travel to Delhi',
    travelBody1:       'January is a busy travel season in India, so we encourage you to book your tickets early — whether you\'re flying, taking the train, or driving in. We can\'t wait to welcome you here!',
    travelBody2:       'From the moment you arrive, everything is taken care of. Your stay and transport to each celebration between the 20th and 22nd are all arranged — so you can simply relax and enjoy the festivities with us.',
    travelFootnote:    'Check-in: 20 Jan · Checkout: 22 Jan',
    confirmPresence:   'Confirm Your\nPresence',
    respondBy:         'Kindly respond by 25 July 2026',
    fullName:          'Full Name',
    mobile:            'Mobile Number',
    attending:         'Will you be attending?',
    yesAttend:         'Yes, I\'ll be there',
    noAttend:          'Unable to attend',
    guestCount:        'How many guests are you bringing?',
    guestNames:        'Guest Names',
    guestLabel:        'Guest',
    justMe:            'Just me',
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
    weddingOf:         'Wedding of Sakshi & Dr. Sahil',
    familyNamesLabel:  'Please add names of your family members attending',
    confirmAttend:     'Confirm Attendance →',
  },
  hi: {
    saveTheDate:       'तारीख याद रखें',
    tapToOpen:         'खोलने के लिए टैप करें',
    tapToContinue:     'जारी रखने के लिए टैप करें',
    celebrationOf:     'विवाह उत्सव',
    inviteHeading:     'हम आपको आमंत्रित करते हैं',
    eventDates:        'बुध 20 – शुक्र 22 जनवरी 2027',
    inviteBody1:       'यह उत्सव हमारे दिल के सबसे करीबी लोगों के लिए है। आपकी उपस्थिति हमारे लिए बहुत मायने रखती है — हम जानना चाहते हैं कि आप आएंगे।',
    inviteBody2:       'आपके प्रवास की सभी ज़रूरी व्यवस्थाएं करने के लिए, कृपया इस तारीख तक पुष्टि करें',
    deadline:          '25 जुलाई 2026',
    rsvpDeadlineLabel: 'RSVP तक',
    arrangementNote:   'आपके प्रवास की सभी ज़रूरी व्यवस्थाएं करने के लिए, कृपया अपनी उपस्थिति की पुष्टि करें।',
    travelHeading:     'दिल्ली कैसे पहुँचें',
    travelBody1:       'जनवरी में भारत में यात्रा का व्यस्त मौसम होता है, इसलिए हम आपको जल्दी टिकट बुक करने की सलाह देते हैं — हवाई जहाज़ से, ट्रेन से, या सड़क से। हम आपका स्वागत करने के लिए बेताब हैं!',
    travelBody2:       'दिल्ली पहुँचते ही सब कुछ तैयार मिलेगा। 20 से 22 जनवरी के बीच हर उत्सव के लिए आपके रहने और आने-जाने का पूरा इंतज़ाम है — बस आराम से आइए और जश्न का हिस्सा बनिए।',
    travelFootnote:    'चेक-इन: 20 जनवरी · चेक-आउट: 22 जनवरी',
    confirmPresence:   'अपनी उपस्थिति\nसुनिश्चित करें',
    respondBy:         'कृपया 25 जुलाई 2026 तक सूचित करें',
    fullName:          'पूरा नाम',
    mobile:            'मोबाइल नंबर',
    attending:         'क्या आप शामिल होंगे?',
    yesAttend:         'हाँ, मैं आऊँगा/आऊँगी',
    noAttend:          'आने में असमर्थ हूँ',
    guestCount:        'आप कितने मेहमान ला रहे हैं?',
    guestNames:        'मेहमानों के नाम',
    guestLabel:        'मेहमान',
    justMe:            'सिर्फ मैं',
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
    weddingOf:         'साक्षी और डॉ. सहिल का विवाह',
    familyNamesLabel:  'कृपया साथ आने वाले परिवार के सदस्यों के नाम लिखें',
    confirmAttend:     'उपस्थिति की पुष्टि करें →',
  },
  gu: {
    saveTheDate:       'તારીખ યાદ રાખો',
    tapToOpen:         'ખોલવા ટૅપ કરો',
    tapToContinue:     'ચાલુ રાખવા ટૅપ કરો',
    celebrationOf:     'લગ્ન ઉત્સવ',
    inviteHeading:     'તમને અમારા ઉત્સવમાં આમંત્રણ',
    eventDates:        'બુધ 20 – શુક્ર 22 જાન્યુઆરી 2027',
    inviteBody1:       'આ ઉત્સવ અમારા હૃદયની સૌથી નજીકના લોકો માટે છે. તમારી હાજરી અમારા માટે ખૂબ મહત્ત્વ ધરાવે છે — અમે જાણવા ઇચ્છીએ છીએ કે તમે આવશો.',
    inviteBody2:       'તમારા પ્રવાસ માટે જરૂરી તમામ વ્યવસ્થા કરવા, કૃપા કરી આ તારીખ સુધી પુષ્ટિ કરો',
    deadline:          '25 જુલાઈ 2026',
    rsvpDeadlineLabel: 'RSVP સુધી',
    arrangementNote:   'તમારા પ્રવાસ માટે જરૂરી તમામ વ્યવસ્થા કરવા, કૃપા કરી તમારી હાજરીની પુષ્ટિ કરો.',
    travelHeading:     'દિલ્હી કેવી રીતે પહોંચશો',
    travelBody1:       'જાન્યુઆરી ભારતમાં પ્રવાસ માટે વ્યસ્ત સિઝન છે, તેથી ટિકિટ વહેલી બૂક કરવા અમે પ્રોત્સાહિત કરીએ છીએ — વિમાનથી, ટ્રેનથી કે સડક માર્ગે. તમારું સ્વાગત કરવા અમે આતુર છીએ!',
    travelBody2:       'દિલ્હી પહોંચ્યા ક્ષણથી, બધું ગોઠવેલ છે. 20 થી 22 જાન્યુઆરી વચ્ચે દરેક ઉત્સવ માટે રહેવા અને ટ્રાન્સ્પોર્ટની સંપૂર્ણ વ્યવસ્થા છે — ફક્ત આરામ કરો અને ઉત્સવ માણો.',
    travelFootnote:    'ચેક-ઇન: ૨૦ જાન · ચેક-આઉટ: ૨૨ જાન',
    confirmPresence:   'તમારી હાજરી\nનિશ્ચિત કરો',
    respondBy:         'કૃપા ૨૫ જુલાઈ ૨૦૨૬ સુધી જણાવો',
    fullName:          'પૂરું નામ',
    mobile:            'મોબાઈલ નંબર',
    attending:         'શું તમે ઉપસ્થિત રહેશો?',
    yesAttend:         'હા, હું આવીશ',
    noAttend:          'આવી નહીં શકું',
    guestCount:        'તમે કેટલા મહેમાન લાવો છો?',
    guestNames:        'મહેમાનોના નામ',
    guestLabel:        'મહેમાન',
    justMe:            'ફક્ત હું',
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
    weddingOf:         'સાક્ષી અને ડૉ. સહિલના લગ્ન',
    familyNamesLabel:  'કૃપા કરી સાથે આવતા પરિવારના સભ્યોના નામ લખો',
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
