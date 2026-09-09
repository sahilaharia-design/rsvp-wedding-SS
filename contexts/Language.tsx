'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Lang = 'en' | 'hi' | 'gu'

export const strings = {
  en: {
    saveTheDate:       'Confirm Travel',
    tapToOpen:         'Tap to open',
    inviteHeading:     'Help Us Take Care of You',
    eventDates:        'Wed 20 – Fri 22 January 2027',
    inviteBody1:       'To arrange your airport pickup and hotel room, we just need your travel details and a quick photo ID from you.',
    inviteBody2:       'Please share these with us by',
    deadline:          '31 October 2026',
    travelHeading:     'Plan Your Travel to Delhi',
    travelBody1:       'January is a busy travel season in India, so we encourage you to book your tickets early — whether you\'re flying, taking the train, or driving in. We can\'t wait to welcome you here!',
    travelBody2:       'From the moment you arrive, everything is taken care of. Your stay and transport to each celebration between the 20th and 22nd are all arranged — so you can simply relax and enjoy the festivities with us.',
    fullName:          'Full Name',
    mobile:            'Mobile Number',
    byFlight:          'By Flight',
    byTrain:           'By Train',
    byRoad:            'By Road',
    sending:           'Sending…',
    weddingOf:         'Wedding of Sakshi & Dr. Sahil',
    confirmTravelBtn:  'Confirm Travel Details',
    // Travel & ID confirmation
    travelConfirmEyebrow: 'Please Confirm',
    travelConfirmHeading: 'Confirm Your Travel & Stay',
    travelConfirmIntro:   'So we can lock in your airport pickup and hotel room, please share your arrival details and a photo of your ID.',
    arrivalModeLabel:  'How are you arriving?',
    arrivalDate:       'Arrival Date',
    arrivalTime:       'Arrival Time',
    travelNumber:      'Flight / Train Number',
    departureDate:     'Departure Date',
    idUploadLabel:     'Upload ID Proof',
    idUploadHint:      'Aadhar, Passport, or Driving Licence — for yourself and anyone travelling with you. Used only to confirm your pickup and room.',
    notesLabel:        'Anything else we should know?',
    travelConfirmBtn:  'Confirm Travel Details',
    travelSuccessHeading: 'All Set.',
    travelSuccessBody: 'We\'ve received your travel details.\nWe\'ll confirm your pickup and room shortly.',
    chooseFiles:       'Choose Files',
    uploadingLabel:    'Uploading…',
    optionalTag:       '(optional)',
    travelDetailsError: 'Couldn\'t reach the server. Please check your connection and try again.',
  },
  hi: {
    saveTheDate:       'यात्रा की पुष्टि करें',
    tapToOpen:         'खोलने के लिए टैप करें',
    inviteHeading:     'हमें आपका ख्याल रखने दें',
    eventDates:        'बुध 20 – शुक्र 22 जनवरी 2027',
    inviteBody1:       'आपकी एयरपोर्ट पिकअप और होटल रूम की व्यवस्था करने के लिए, हमें बस आपकी यात्रा जानकारी और एक पहचान पत्र की फोटो चाहिए।',
    inviteBody2:       'कृपया इन्हें हमें इस तारीख तक साझा करें',
    deadline:          '31 अक्टूबर 2026',
    travelHeading:     'दिल्ली कैसे पहुँचें',
    travelBody1:       'जनवरी में भारत में यात्रा का व्यस्त मौसम होता है, इसलिए हम आपको जल्दी टिकट बुक करने की सलाह देते हैं — हवाई जहाज़ से, ट्रेन से, या सड़क से। हम आपका स्वागत करने के लिए बेताब हैं!',
    travelBody2:       'दिल्ली पहुँचते ही सब कुछ तैयार मिलेगा। 20 से 22 जनवरी के बीच हर उत्सव के लिए आपके रहने और आने-जाने का पूरा इंतज़ाम है — बस आराम से आइए और जश्न का हिस्सा बनिए।',
    fullName:          'पूरा नाम',
    mobile:            'मोबाइल नंबर',
    byFlight:          'हवाई जहाज़ से',
    byTrain:           'ट्रेन से',
    byRoad:            'सड़क से',
    sending:           'भेजा जा रहा है…',
    weddingOf:         'साक्षी और डॉ. सहिल का विवाह',
    confirmTravelBtn:  'यात्रा विवरण की पुष्टि करें',
    // Travel & ID confirmation
    travelConfirmEyebrow: 'कृपया पुष्टि करें',
    travelConfirmHeading: 'अपनी यात्रा और ठहरने की पुष्टि करें',
    travelConfirmIntro:   'आपकी एयरपोर्ट पिकअप और होटल रूम पक्का करने के लिए, कृपया अपनी यात्रा जानकारी और पहचान पत्र की एक फोटो साझा करें।',
    arrivalModeLabel:  'आप कैसे पहुँच रहे हैं?',
    arrivalDate:       'आगमन की तारीख',
    arrivalTime:       'आगमन का समय',
    travelNumber:      'फ़्लाइट / ट्रेन नंबर',
    departureDate:     'प्रस्थान की तारीख',
    idUploadLabel:     'पहचान पत्र अपलोड करें',
    idUploadHint:      'आधार, पासपोर्ट, या ड्राइविंग लाइसेंस — अपने और साथ आने वाले सभी के लिए। केवल पिकअप और कमरे की पुष्टि के लिए उपयोग किया जाएगा।',
    notesLabel:        'कुछ और बताना चाहेंगे?',
    travelConfirmBtn:  'यात्रा विवरण की पुष्टि करें',
    travelSuccessHeading: 'हो गया।',
    travelSuccessBody: 'हमें आपकी यात्रा जानकारी मिल गई है।\nहम जल्द ही आपकी पिकअप और कमरे की पुष्टि करेंगे।',
    chooseFiles:       'फ़ाइलें चुनें',
    uploadingLabel:    'अपलोड हो रहा है…',
    optionalTag:       '(वैकल्पिक)',
    travelDetailsError: 'सर्वर तक नहीं पहुँच सके। कृपया अपना कनेक्शन जाँचें और फिर से प्रयास करें।',
  },
  gu: {
    saveTheDate:       'મુસાફરીની પુષ્ટિ કરો',
    tapToOpen:         'ખોલવા ટૅપ કરો',
    inviteHeading:     'અમને તમારી કાળજી લેવા દો',
    eventDates:        'બુધ 20 – શુક્ર 22 જાન્યુઆરી 2027',
    inviteBody1:       'તમારું એરપોર્ટ પિકઅપ અને હોટેલ રૂમ ગોઠવવા માટે, અમને ફક્ત તમારી મુસાફરીની વિગતો અને એક ID ફોટો જોઈએ છે.',
    inviteBody2:       'કૃપા કરી આ અમને આ તારીખ સુધી શેર કરો',
    deadline:          '31 ઓક્ટોબર 2026',
    travelHeading:     'દિલ્હી કેવી રીતે પહોંચશો',
    travelBody1:       'જાન્યુઆરી ભારતમાં પ્રવાસ માટે વ્યસ્ત સિઝન છે, તેથી ટિકિટ વહેલી બૂક કરવા અમે પ્રોત્સાહિત કરીએ છીએ — વિમાનથી, ટ્રેનથી કે સડક માર્ગે. તમારું સ્વાગત કરવા અમે આતુર છીએ!',
    travelBody2:       'દિલ્હી પહોંચ્યા ક્ષણથી, બધું ગોઠવેલ છે. 20 થી 22 જાન્યુઆરી વચ્ચે દરેક ઉત્સવ માટે રહેવા અને ટ્રાન્સ્પોર્ટની સંપૂર્ણ વ્યવસ્થા છે — ફક્ત આરામ કરો અને ઉત્સવ માણો.',
    fullName:          'પૂરું નામ',
    mobile:            'મોબાઈલ નંબર',
    byFlight:          'વિમાનથી',
    byTrain:           'ટ્રેનથી',
    byRoad:            'રસ્તા દ્વારા',
    sending:           'મોકલાઈ રહ્યું છે…',
    weddingOf:         'સાક્ષી અને ડૉ. સહિલના લગ્ન',
    confirmTravelBtn:  'મુસાફરીની વિગતોની પુષ્ટિ કરો',
    // Travel & ID confirmation
    travelConfirmEyebrow: 'કૃપા કરી પુષ્ટિ કરો',
    travelConfirmHeading: 'તમારી મુસાફરી અને રોકાણની પુષ્ટિ કરો',
    travelConfirmIntro:   'તમારું એરપોર્ટ પિકઅપ અને હોટેલ રૂમ પાક્કું કરવા, કૃપા કરી તમારી મુસાફરીની વિગતો અને ID નો ફોટો શેર કરો.',
    arrivalModeLabel:  'તમે કઈ રીતે પહોંચી રહ્યા છો?',
    arrivalDate:       'આગમનની તારીખ',
    arrivalTime:       'આગમનનો સમય',
    travelNumber:      'ફ્લાઇટ / ટ્રેન નંબર',
    departureDate:     'પ્રસ્થાનની તારીખ',
    idUploadLabel:     'ID પુરાવો અપલોડ કરો',
    idUploadHint:      'આધાર, પાસપોર્ટ, અથવા ડ્રાઇવિંગ લાઇસન્સ — તમારા માટે અને સાથે આવતા બધા માટે. ફક્ત પિકઅપ અને રૂમની પુષ્ટિ માટે ઉપયોગમાં લેવાશે.',
    notesLabel:        'બીજું કંઈ જણાવવું છે?',
    travelConfirmBtn:  'મુસાફરીની વિગતોની પુષ્ટિ કરો',
    travelSuccessHeading: 'થઈ ગયું.',
    travelSuccessBody: 'અમને તમારી મુસાફરીની વિગતો મળી ગઈ છે.\nઅમે ટૂંક સમયમાં તમારું પિકઅપ અને રૂમ કન્ફર્મ કરીશું.',
    chooseFiles:       'ફાઇલો પસંદ કરો',
    uploadingLabel:    'અપલોડ થઈ રહ્યું છે…',
    optionalTag:       '(વૈકલ્પિક)',
    travelDetailsError: 'સર્વર સુધી પહોંચી શકાયું નહીં. કૃપા કરી તમારું કનેક્શન તપાસો અને ફરી પ્રયાસ કરો.',
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
