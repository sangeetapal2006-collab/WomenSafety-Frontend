import React, { useState } from 'react';
import {
  FiShield,
  FiBookOpen,
  FiAlertTriangle,
  FiLock,
  FiSmartphone,
  FiMapPin,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

const SafetyResources = () => {
  const [openSection, setOpenSection] = useState(0);

  const sections = [
    {
      title: 'Physical & Travel Safety Best Practices',
      icon: FiShield,
      content: [
        'Always share your live journey tracking or ETA with a trusted family member or emergency contact when traveling late at night.',
        'Choose well-lit, populated primary streets rather than isolated shortcuts through dark alleys or unpatrolled parks.',
        'In public transit or ride-share cabs, verify the driver identity & vehicle registration plate against the app before boarding.',
        'Trust your intuition: If a situation or individual feels threatening, enter a public storefront, 24/7 pharmacy, or police station immediately.'
      ]
    },
    {
      title: 'Legal Rights & Statutory Protections (India Law Overview)',
      icon: FiBookOpen,
      content: [
        'Zero FIR: A woman has the right to file an FIR at ANY police station, regardless of where the incident took place. The police cannot refuse registration.',
        'Right to Virtual / Digital Complaint: Cyber harassment and extortion complaints can be filed directly online via national cybercrime reporting (1930 / cybercrime.gov.in).',
        'Right to Not Be Arrested at Night: As per Section 46 of CrPC / BNSS, a woman cannot be arrested before sunrise and after sunset except in exceptional circumstances with prior judicial magistrate orders.',
        'Right to Free Legal Aid: The Legal Services Authorities Act entitles all women to free legal representation in judicial proceedings regardless of financial income.'
      ]
    },
    {
      title: 'Digital Privacy & Cyber Safety Guidelines',
      icon: FiLock,
      content: [
        'Enable Two-Factor Authentication (2FA) across email, messaging apps, and social accounts.',
        'Regularly review app permissions on your smartphone; revoke location and microphone access for suspicious apps.',
        'Never share verification OTPs or passwords over phone calls or unfamiliar SMS links.',
        'If targeted by online blackmail or morphing crimes, preserve digital screenshots with timestamps and URL links as evidence before blocking the perpetrator.'
      ]
    },
    {
      title: 'De-escalation & Self-Defense Foundations',
      icon: FiAlertTriangle,
      content: [
        'Maintain a confident posture and awareness of your surroundings (avoid wearing noise-canceling headphones when walking isolated corridors).',
        'Create distance immediately: Shout commands firmly ("Stay Back!", "Help!") to draw immediate public attention and deter aggressors.',
        'Target vulnerable pressure points if physical defense is necessary: eyes, throat, groin, and shins.',
        'Carry legal personal defense alarms or pepper spray in easily accessible outer pockets rather than deep within a handbag.'
      ]
    }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}
        >
          <FiBookOpen size={16} /> EDUCATIONAL SAFETY REPOSITORY
        </div>
        <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Safety Guides & Legal Rights</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
          Crucial knowledge on personal defense, digital privacy, and statutory legal protections for women.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          const isOpen = openSection === idx;
          return (
            <div
              key={idx}
              className="card"
              style={{
                cursor: 'pointer',
                padding: '1.25rem 1.5rem',
                border: isOpen ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-color)'
              }}
              onClick={() => setOpenSection(isOpen ? null : idx)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      background: 'rgba(244, 63, 94, 0.15)',
                      color: 'var(--primary-500)',
                      padding: '10px',
                      borderRadius: '10px',
                      display: 'flex'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{sec.title}</h3>
                </div>

                <div>{isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}</div>
              </div>

              {isOpen && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  {sec.content.map((point, pIdx) => (
                    <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <FiCheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyResources;
