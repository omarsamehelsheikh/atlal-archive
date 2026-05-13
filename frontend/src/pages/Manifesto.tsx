import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';

const Manifesto: React.FC = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';


  const ACCENT_PURPLE = "#8A38F5";
  const bgPath = "/image-background-for-about-page.png";

  // Helper to convert numbers to Arabic numerals
  const getArabicNumber = (n: number) => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return n.toString().split('').map(digit => arabicDigits[parseInt(digit)]).join('').padStart(2, '٠');
  };

  const MANIFESTO_CONTENT = [
    {
      id: 1,
      en: "We understand that the term “Arab” has negative and historically inaccurate roots, and is used against the SWANA region in a negative lens. But we reclaim and use this word as a term of shared solidarity, and struggle.",
      ar: "نحن ندرك أن مصطلح 'عربي' له جذور سلبية وغير دقيقة تاريخياً، ويستخدم ضد منطقة جنوب غرب آسيا وشمال أفريقيا من منظور سلبي. لكننا نستعيد هذه الكلمة ونستخدمها كمصطلح للتضامن المشترك والنضال.",
      top: 164, left: 36, dark: false
    },
    {
      id: 2,
      en: "We Acknowledge that ‘diaspora’ is not a singular condition but a spectrum that includes exile, displacement, migration, ect, which is experienced due to different circumstances.",
      ar: "نحن نقر بأن 'الشتات' ليس حالة واحدة بل هو طيف يشمل المنفى، والتهجير، والهجرة، وما إلى ذلك، وهو ما يتم تجربته نتيجة لظروف مختلفة.",
      top: 440, left: 450, dark: true
    },
    {
      id: 3,
      en: "We reject the coalescence of the SWANA region into one singular category to make it easier for the west to digest by trivializing and simplifying our unique cultures, histories and struggles into one mass.",
      ar: "نحن نرفض دمج منطقة جنوب غرب آسيا وشمال أفريقيا في فئة واحدة لتسهيل استيعابها من قبل الغرب من خلال تسخيف وتبسيط ثقافاتنا وتاريخنا ونضالاتنا الفريدة في كتلة واحدة.",
      top: 716, left: 35, dark: true
    },
    {
      id: 4,
      en: "We reject the term “Arab Art” due to our rejection of the coalescence of the SWANA region, as well as our belief that this term is also a constructed label shaped by colonial, and orientalist powers to oppress and ignore SWANA region's diversity and history by simplifying our existence under a colonial lens.",
      ar: "نحن نرفض مصطلح 'الفن العربي' بسبب رفضنا لدمج منطقة جنوب غرب آسيا وشمال أفريقيا، فضلاً عن إيماننا بأن هذا المصطلح هو أيضاً تسمية مستحدثة شكلتها القوى الاستعمارية والاستشراقية لقمع وتجاهل تنوع وتاريخ المنطقة.",
      top: 716, left: 865, dark: false
    },
    {
      id: 5,
      en: "We reject the western gaze entirely, and the idea of it being used as a lens to view our art, history, or expressions for it to be validated or understood.",
      ar: "نحن نرفض النظرة الغربية تماماً، وفكرة استخدامها كعدسة لمشاهدة فننا أو تاريخنا أو تعبيراتنا من أجل التحقق من صحتها أو فهمها.",
      top: 992, left: 450, dark: true
    },
    {
      id: 6,
      en: "We reject any practice that romanticizes, or sanitizes our existence, whether it is our politics, opinions, or art.",
      ar: "نحن نرفض أي ممارسة تضفي طابعاً رومانسياً أو تعقم وجودنا، سواء كان ذلك في سياستنا أو آرائنا أو فننا.",
      top: 1268, left: 36, dark: false
    },
    {
      id: 7,
      en: "We embrace our design practices that highlight our Arab identities, and put our heritage on the forefront.",
      ar: "نحن نتبنى ممارساتنا التصميمية التي تسلط الضوء على هوياتنا العربية، وتضع تراثنا في المقدمة.",
      top: 1268, left: 865, dark: true
    },
    {
      id: 8,
      en: "We commit to decentralizing our west through our narratives, and putting forward the beliefs, aims, and experiences of Arabs through their unfiltered words and expressions.",
      ar: "نحن نلتزم باللامركزية عن الغرب من خلال سردياتنا، وتقديم معتقدات وأهداف وتجارب العرب من خلال كلماتهم وتعبيراتهم غير المنقحة.",
      top: 1544, left: 450, dark: false
    },
    {
      id: 9,
      en: "We aim to maintain integrity and respect in our approach to the different diasporas, ensuring there is no erasing, trivializing or downplaying experiences or painting diaspora as an extreme that it is not.",
      ar: "نحن نهدف إلى الحفاظ على النزاهة والاحترام في نهجنا تجاه الشتات المختلف، مع ضمان عدم محو أو تسخيف التجارب.",
      top: 1820, left: 36, dark: true
    },
    {
      id: 10,
      en: "We commit to maintain an ethical curation process that preserves context, refuses romanticization or tokenization, and ensures that we honor each artist as a distinct, unique, creative voice.",
      ar: "نحن نلتزم بالحفاظ على عملية تقييم فني أخلاقية تحفظ السياق، وترفض الرومانسية، وتضمن تكريم كل فنان كصوت إبداعي متميز وفريد.",
      top: 1820, left: 865, dark: false
    }
  ];

  return (
    <div style={{
      ...styles.mainContainer,
      backgroundColor: isEng ? '#FFFFFF' : '#000'
    }}>
      <Navbar />

      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundImage: `url("${bgPath}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: isEng ? 0.12 : 0.05,
        pointerEvents: "none",
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '2300px' }}>
        {MANIFESTO_CONTENT.map((box) => (
          <div 
            key={box.id}
            style={{
              ...styles.box,
              top: box.top,
              left: isEng ? box.left : 'auto',
              right: !isEng ? box.left : 'auto',
              backgroundColor: box.dark ? '#000' : '#FFF',
              color: box.dark ? '#FFF' : '#000',
              borderColor: box.dark ? ACCENT_PURPLE : (isEng ? '#000' : '#FFF'),
              direction: isEng ? 'ltr' : 'rtl'
            }}
          >
           <div style={{
  ...styles.numberContainer,

  color: ACCENT_PURPLE,

  background:
    box.dark
      ? "#FFF"
      : "#000",
}}>
              {isEng ? box.id.toString().padStart(2, '0') : getArabicNumber(box.id)}
            </div>

            <div style={{
  ...styles.boxText,

  color:
    box.dark
      ? '#FFF'
      : '#000',

  fontFamily:
    isEng
      ? 'TWK Lausanne'
      : '29L TIdris',

  textAlign:
    isEng
      ? 'left'
      : 'right'
}}>
              {isEng ? box.en : box.ar}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  mainContainer: {
    width: '100%',
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden'
  },
  box: {
    position: 'absolute',
    width: '380px',
    height: '260px',
    padding: '25px',
    border: '1.5px solid',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  },
numberContainer: {
  width: '52px',

  height: '48px',

  background: 'var(--white, #FFF)',

  display: 'flex',

  alignItems: 'center',

  justifyContent: 'center',

  fontSize: '37px',

fontFamily: '"Edition Numerical Unlicensed"',

fontStyle: 'normal',

fontWeight: 400,

lineHeight: '99px',

textTransform: 'capitalize',

  marginBottom: '15px',

  color: 'var(--Accent-color, #8A38F5)',

  border: 'none',

  boxSizing: 'border-box',
},
  boxText: {
  

  fontFamily:
    '"TWK Lausanne"',

  fontSize: '20px',

  fontStyle: 'normal',

  fontWeight: 200,

  lineHeight: '28px',

  overflow: 'hidden',
},
};

export default Manifesto;