import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';

const Manifesto: React.FC = () => {
  const { language } = useLanguage();

  // Helper to get translated content
  const content = {
    title: language === 'ENG' ? 'Our\nValues' : 'قيمنا',
    v1: language === 'ENG' 
      ? 'We understand that the term “Arab” has negative and historically inaccurate roots, and is used against the SWANA region in a negative lens. But we reclaim and use this word as a term of shared solidarity, and struggle.'
      : 'نحن ندرك أن مصطلح "عربي" له جذور سلبية وغير دقيقة تاريخياً، ويستخدم ضد منطقة السوانا من منظور سلبي. لكننا نستعيد هذه الكلمة ونستخدمها كمصطلح للتضامن المشترك والنضال.',
    v2: language === 'ENG'
      ? 'We Acknowledge that ‘diaspora’ is not a singular condition but a spectrum that includes exile, displacement, migration, ect, which is experienced due to different circumstances.'
      : 'نحن نقر بأن "الشتات" ليس حالة واحدة بل هو طيف يشمل النفي، والتهجير، والهجرة، وما إلى ذلك، والذي يتم عيشه نتيجة لظروف مختلفة.',
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#DBDBD5', paddingBottom: '150px' }}>
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div style={{ position: 'relative', height: '450px', width: '100%', overflow: 'hidden' }}>
        {/* Grey Rectangle - Fixed Position at 80px from left */}
        <div style={{ width: 471, height: 139, left: 80, top: 111, position: 'absolute', background: '#757575', zIndex: 1 }} />
        
        {/* Blue Square - Fixed Position at 80px from left */}
        <div style={{ width: 76, height: 137, left: 80, top: 296, position: 'absolute', background: '#9DDFF0', zIndex: 1 }} />

        {/* Dynamic Title: Mirroring logic to cover the grey box in both languages */}
        <div style={{ 
          top: 67, 
          position: 'absolute', 
          color: 'black', 
          fontSize: '188px', 
          zIndex: 2, 
          lineHeight: '0.9',
          whiteSpace: 'pre-line',
          // Mirroring logic:
          left: language === 'ENG' ? 80 : 'auto', 
          // 80 (left offset) + 471 (grey box width) = 551. 
          // We align the right edge of the Arabic text to that same point.
          right: language === 'AR' ? 'calc(100% - 551px)' : 'auto', 
          fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris',
          textAlign: language === 'ENG' ? 'left' : 'right',
          fontWeight: '500', 
          textTransform: 'uppercase'
        }}>
          {content.title}
        </div>
      </div>

      {/* --- VALUES GRID SECTION --- */}
      <div style={styles.gridContainer}>
        <ValueItem number={language === 'ENG' ? "01" : "٠١"} text={content.v1} />
        <ValueItem number={language === 'ENG' ? "02" : "٠٢"} text={content.v2} />
        <ValueItem number={language === 'ENG' ? "03" : "٠٣"} text={content.v2} />
        <ValueItem number={language === 'ENG' ? "04" : "٠٤"} text={content.v1} />
        <ValueItem number={language === 'ENG' ? "05" : "٠٥"} text={content.v1} />
        <ValueItem number={language === 'ENG' ? "06" : "٠٦"} text={content.v1} />
      </div>

      {/* --- FOOTER --- */}
      <div style={styles.footer}>
        <div style={{ 
          top: 86, 
          position: 'absolute', 
          color: 'black', 
          fontSize: 11, 
          fontFamily: 'Inter', 
          fontWeight: '500', 
          letterSpacing: 0.55,
          left: language === 'ENG' ? 143 : 'auto', 
          right: language === 'AR' ? 143 : 'auto'
        }}>
          atlalcompendium@gmail.com
        </div>
        <div style={{ 
          width: 32, 
          height: 32, 
          top: 75, 
          position: 'absolute', 
          background: 'black',
          left: language === 'ENG' ? 353 : 'auto', 
          right: language === 'AR' ? 353 : 'auto'
        }} />
      </div>
    </div>
  );
};

const ValueItem = ({ number, text }: { number: string, text: string }) => {
  const { language } = useLanguage();
  return (
    <div style={{
      ...styles.itemWrapper, 
      flexDirection: language === 'ENG' ? 'row' : 'row-reverse'
    }}>
      <div style={{
        ...styles.number, 
        fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris'
      }}>
        {number}
      </div>
      <div style={{
        ...styles.valueText, 
        fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris',
        textAlign: language === 'ENG' ? 'left' : 'right'
      }}>
        {text}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'max-content max-content', 
    justifyContent: 'center', 
    columnGap: '80px', 
    rowGap: '100px',
    padding: '0 50px',
    marginTop: '80px'
  },
  itemWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px', 
    maxWidth: '650px'
  },
  number: {
    fontSize: '180px',
    fontWeight: '500',
    lineHeight: '0.7',
    color: 'black'
  },
  valueText: {
    fontSize: '20px',
    fontStyle: 'italic',
    fontWeight: '400',
    textTransform: 'uppercase',
    lineHeight: '1.2',
    color: 'black',
    marginTop: '30px'
  },
  footer: {
    width: '100%', height: 146, position: 'relative', marginTop: '150px', background: 'white'
  }
};

export default Manifesto;