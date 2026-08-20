'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'MR' | 'HI';

interface Translations {
  [key: string]: {
    EN: string;
    MR: string;
    HI: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav.search_placeholder': {
    EN: 'Search doctors, plumbers...',
    MR: 'डॉक्टर्स, प्लंबर्स शोधा...',
    HI: 'डॉक्टर, प्लंबर खोजें...'
  },
  'nav.blood_donors': {
    EN: 'Blood Donors 🩸',
    MR: 'रक्तदाते 🩸',
    HI: 'रक्तदाता 🩸'
  },
  'nav.advertise': {
    EN: 'Advertise',
    MR: 'जाहिरात करा',
    HI: 'विज्ञापन दें'
  },
  'nav.jobs': {
    EN: 'Jobs',
    MR: 'नोकरी',
    HI: 'नौकरी'
  },
  'nav.find_job': {
    EN: 'Find a Job',
    MR: 'नोकरी शोधा',
    HI: 'नौकरी खोजें'
  },
  'nav.find_job_sub': {
    EN: 'Mujhe Job Chahiye',
    MR: 'मला नोकरी हवी आहे',
    HI: 'मुझे नौकरी चाहिए'
  },
  'nav.post_job': {
    EN: 'Post a Job',
    MR: 'नोकरी पोस्ट करा',
    HI: 'नौकरी पोस्ट करें'
  },
  'nav.post_job_sub': {
    EN: 'Mujhe Job Deni Hai',
    MR: 'मला नोकरी द्यायची आहे',
    HI: 'मुझे नौकरी देनी है'
  },
  'nav.free_listing': {
    EN: 'Free Listing',
    MR: 'मोफत नोंदणी',
    HI: 'मुफ़्त लिस्टिंग'
  },
  'nav.help': {
    EN: 'Help',
    MR: 'मदत',
    HI: 'मदद'
  },
  'nav.login': {
    EN: 'Login',
    MR: 'लॉगिन करा',
    HI: 'लॉगिन करें'
  },
  
  // Hero Section
  'hero.title_start': {
    EN: 'Find the Best Local',
    MR: 'सर्वोत्कृष्ट स्थानिक',
    HI: 'सबसे अच्छे स्थानीय'
  },
  'hero.title_end': {
    EN: 'in Boisar',
    MR: 'बोईसरमध्ये शोधा',
    HI: 'बोईसर में खोजें'
  },
  'hero.subtitle': {
    EN: 'Your ultimate local directory. Discover trusted businesses, shops, and daily services with verified ratings, fast.',
    MR: 'तुमची हक्काची स्थानिक डिरेक्टरी. विश्वासार्ह दुकाने, व्यावसायिक आणि दैनंदिन सेवा त्वरित शोधा.',
    HI: 'आपकी बेहतरीन स्थानीय डायरेक्टरी। विश्वसनीय दुकानें, व्यवसाय और दैनिक सेवाएं तुरंत खोजें।'
  },
  'hero.search_button': {
    EN: 'Search',
    MR: 'शोधा',
    HI: 'खोजें'
  },
  'hero.explore_categories': {
    EN: 'Or explore categories:',
    MR: 'किंवा श्रेणीनुसार शोधा:',
    HI: 'या श्रेणी के अनुसार खोजें:'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const triggerGoogleTranslate = (lang: Language) => {
    if (typeof window === 'undefined') return;

    const langMap: Record<Language, string> = {
      EN: 'en',
      HI: 'hi',
      MR: 'mr'
    };

    const targetLang = langMap[lang] || 'en';

    // Set googtrans cookie for full DOM translation across path & domain
    document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    if (window.location.hostname !== 'localhost') {
      document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=/en/${targetLang}; path=/; domain=.${window.location.hostname};`;
    }

    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = targetLang;
      combo.dispatchEvent(new Event('change'));
    }

    // Reload page to let Google Translate script parse 100% of DOM text nodes (shops, cards, buttons, titles)
    window.location.reload();
  };

  useEffect(() => {
    // Load saved language on mount
    const saved = localStorage.getItem('majh_boisar_lang') as Language;
    if (saved === 'EN' || saved === 'MR' || saved === 'HI') {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('majh_boisar_lang', lang);
    triggerGoogleTranslate(lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
      {/* Hidden Google Translate container (using opacity & overflow so engine processes full page DOM) */}
      <div
        id="google_translate_element"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          opacity: 0,
          pointerEvents: 'none',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          zIndex: -999
        }}
      />
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
