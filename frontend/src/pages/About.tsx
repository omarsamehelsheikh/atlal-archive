import React from 'react';
import { motion, Variants } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

// Animation variant for "Swipe Up" reveal
const sectionVariants: Variants = {
  offscreen: { y: 100, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.4, duration: 1 }
  }
};

const About: React.FC = () => {
  const { language } = useLanguage();

  const t = {
    who: language === 'ENG' ? 'WHO WE ARE' : 'من نحن',
    mission: language === 'ENG' ? 'MISSION' : 'مهمتنا',
    vision: language === 'ENG' ? 'VISION' : 'رؤيتنا',
    values: language === 'ENG' ? 'VALUES' : 'قيمنا',
    team: language === 'ENG' ? 'TEAM' : 'فريق العمل',
    supervised: language === 'ENG' ? 'SUPERVISED BY' : 'بإشراف',
    accounts: language === 'ENG' ? 'ACCOUNTS' : 'الحسابات',
    lorem: "Lorem ipsum dolor sit amet consectetur. Nec diam fusce sit et est. Amet ut quis arcu etiam donec leo non molestie amet. Sed consequat faucibus quis rhoncus. Sagittis egestas in sit quis sed dis eros in. Vivamus lorem quam pharetra varius etiam ultrices sollicitudin."
  };

  return (
    <div style={{ background: '#ECECEC', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section style={styles.fullPage}>
        <motion.div 
          initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.8 }}
          variants={sectionVariants}
          style={{
            ...styles.heroText,
            fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris'
          }}
        >
          {t.who}
        </motion.div>
        <div style={{
            ...styles.paragraphContainer,
            fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris',
            textAlign: language === 'ENG' ? 'justify' : 'right' as any
        }}>
          {t.lorem}
        </div>
      </section>

      {/* --- MISSION, VISION, VALUES --- */}
      <ScrollSection title={t.mission} content={t.lorem} color="#D9D9D9" />
      <ScrollSection title={t.vision} content={t.lorem} color="#D9D9D9" />
      <ScrollSection title={t.values} content={t.lorem} color="#D9D9D9" />

      {/* --- TEAM SECTION --- */}
      <section style={{ ...styles.fullPage, background: 'white' }}>
        <motion.div initial="offscreen" whileInView="onscreen" variants={sectionVariants} 
          style={{...styles.heroText, fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris'}}>
          {t.team}
        </motion.div>
        <div style={styles.teamList}>
          {[1, 2, 3].map((num) => (
            <TeamRow key={num} name={`NAME ${num}`} label={t.accounts} />
          ))}
        </div>
      </section>

      {/* --- SUPERVISED BY --- */}
      <section style={{ ...styles.fullPage, background: 'black', color: 'white' }}>
         <div style={{...styles.heroText, color: 'white', fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris'}}>
            {t.supervised}
         </div>
         <TeamRow name="NAME 1" label={t.accounts} dark />
         <TeamRow name="NAME 2" label={t.accounts} dark />
      </section>
    </div>
  );
};

// Helper component for content sections
const ScrollSection = ({ title, content, color }: { title: string; content: string; color: string }) => {
  const { language } = useLanguage();
  return (
    <motion.section 
      initial="offscreen" whileInView="onscreen" viewport={{ once: false, amount: 0.5 }}
      style={{ ...styles.fullPage, background: color }}
    >
      <div style={{...styles.sectionContainer, flexDirection: language === 'ENG' ? 'row' : 'row-reverse'}}>
        <motion.h2 variants={sectionVariants} style={{
            ...styles.sectionTitle,
            fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris',
            textAlign: language === 'ENG' ? 'left' : 'right' as any
        }}>
            {title}
        </motion.h2>
        <motion.p variants={sectionVariants} style={{
            ...styles.paragraphContainer,
            fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris',
            textAlign: language === 'ENG' ? 'justify' : 'right' as any
        }}>
          {content}
        </motion.p>
      </div>
    </motion.section>
  );
};

// Helper component for Team Rows
const TeamRow = ({ name, label, dark }: { name: string; label: string; dark?: boolean }) => {
    const { language } = useLanguage();
    return (
        <div style={{ ...styles.teamRow, borderColor: dark ? 'white' : 'black', flexDirection: language === 'ENG' ? 'row' : 'row-reverse' }}>
            <span style={{...styles.accountLabel, color: dark ? 'white' : 'black'}}>{label}</span>
            <span style={{...styles.teamName, color: dark ? 'white' : 'black', fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris'}}>{name}</span>
            <span style={{...styles.accountLabel, color: dark ? 'white' : 'black'}}>{label}</span>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
  fullPage: {
    width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    padding: '100px 50px', borderBottom: '1px solid #000'
  },
  heroText: { fontSize: '188px', fontWeight: '500', textAlign: 'center', lineHeight: '0.9', marginBottom: '50px' },
  sectionTitle: { fontSize: '128px', fontWeight: '500', width: '40%' },
  sectionContainer: { display: 'flex', width: '100%', maxWidth: '1400px', justifyContent: 'space-between', alignItems: 'center', gap: '40px' },
  paragraphContainer: { width: '772px', fontSize: '24px', textTransform: 'uppercase' },
  teamList: { width: '100%', marginTop: '50px' },
  teamRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '20px 0', borderTop: '1px solid black' },
  teamName: { fontSize: '150px', fontWeight: '500' },
  accountLabel: { fontSize: '24px', fontFamily: 'Helvetica Neue', letterSpacing: '1.6px' }
};

export default About;