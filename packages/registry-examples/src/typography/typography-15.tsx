import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
  TypographyTable,
  TypographyTd,
  TypographyTh,
  TypographyTr,
} from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <div dir="rtl">
      <TypographyH1>{'سجلات ضريبة النكتة'}</TypographyH1>
      <TypographyP>
        {
          'في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي كل يومه مستلقياً على عرشه. في يوم من الأيام، جاء إليه مستشاروه بمشكلة: المملكة تنفد منها الأموال.'
        }
      </TypographyP>
      <TypographyH2 className="mt-10">{'خطة الملك'}</TypographyH2>
      <TypographyP>
        {'فكر الملك ملياً وطويلاً، وأخيراً توصل إلى '}
        <a className="font-medium text-primary underline underline-offset-4" href="placeholder">
          {'خطة عبقرية'}
        </a>
        {': سيفرض ضريبة على النكت في المملكة.'}
      </TypographyP>
      <TypographyBlockquote>
        {'قال: "في النهاية، الجميع يستمتع بنكتة جيدة، لذا من العدل أن يدفعوا مقابل هذا الامتياز."'}
      </TypographyBlockquote>
      <TypographyH3 className="mt-8">{'ضريبة النكتة'}</TypographyH3>
      <TypographyP>{'لم يكن رعايا الملك سعداء. تذمروا واشتكوا، لكن الملك كان حازماً:'}</TypographyP>
      <TypographyList>
        <li>{'المستوى الأول من التورية: 5 قطع ذهبية'}</li>
        <li>{'المستوى الثاني من النكت: 10 قطع ذهبية'}</li>
        <li>{'المستوى الثالث من الطرائف: 20 قطعة ذهبية'}</li>
      </TypographyList>
      <TypographyP>
        {
          'نتيجة لذلك، توقف الناس عن رواية النكت، وسقطت المملكة في كآبة. لكن كان هناك شخص واحد رفض الاستسلام لحماقة الملك: مهرج البلاط الملكي اسمه نكتجي.'
        }
      </TypographyP>
      <TypographyH3 className="mt-8">{'ثورة نكتجي'}</TypographyH3>
      <TypographyP>
        {
          'بدأ نكتجي يتسلل إلى القلعة في منتصف الليل ويترك النكت في كل مكان: تحت وسادة الملك، في حسائه، وحتى في المرحاض الملكي. كان الملك غاضباً، لكنه لم يستطع إيقاف نكتجي.'
        }
      </TypographyP>
      <TypographyP>
        {
          'وفي يوم من الأيام، اكتشف الناس أن النكت التي تركها نكتجي كانت مضحكة لدرجة أنهم لم يستطيعوا إلا الضحك. وبمجرد أن بدأوا بالضحك، لم يتمكنوا من التوقف.'
        }
      </TypographyP>
      <TypographyH3 className="mt-8">{'ثورة الشعب'}</TypographyH3>
      <TypographyP>
        {
          'شعب المملكة، الذي شعر بالبهجة من الضحك، بدأ يروي النكت والطرائف مرة أخرى، وسرعان ما انضمت المملكة بأكملها إلى النكتة.'
        }
      </TypographyP>
      <TypographyTable>
        <thead>
          <TypographyTr>
            <TypographyTh>{'خزينة الملك'}</TypographyTh>
            <TypographyTh>{'سعادة الشعب'}</TypographyTh>
          </TypographyTr>
        </thead>
        <tbody>
          <TypographyTr>
            <TypographyTd>{'فارغة'}</TypographyTd>
            <TypographyTd>{'فائضة'}</TypographyTd>
          </TypographyTr>
          <TypographyTr>
            <TypographyTd>{'متواضعة'}</TypographyTd>
            <TypographyTd>{'راضية'}</TypographyTd>
          </TypographyTr>
          <TypographyTr>
            <TypographyTd>{'ممتلئة'}</TypographyTd>
            <TypographyTd>{'في قمة السعادة'}</TypographyTd>
          </TypographyTr>
        </tbody>
      </TypographyTable>
      <TypographyP>
        {
          'الملك، عندما رأى مدى سعادة رعاياه، أدرك خطأه وألغى ضريبة النكتة. أُعلن نكتجي بطلاً، وعاشت المملكة في سعادة إلى الأبد.'
        }
      </TypographyP>
      <TypographyP>
        {'العبرة من القصة: لا تستهن أبداً بقوة الضحكة الجيدة، واحذر دائماً من الأفكار السيئة.'}
      </TypographyP>
    </div>
  )
}
