export default function Demo() {
  return (
    <div dir="rtl">
      <div>
        <h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl">{'سجلات ضريبة النكتة'}</h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {
            'في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي كل يومه مستلقياً على عرشه. في يوم من الأيام، جاء إليه مستشاروه بمشكلة: المملكة تنفد منها الأموال.'
          }
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight transition-colors first:mt-0">
          {'خطة الملك'}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {'فكر الملك ملياً وطويلاً، وأخيراً توصل إلى '}
          <a className="font-medium text-primary underline underline-offset-4" href="placeholder">
            {'خطة عبقرية'}
          </a>
          {': سيفرض ضريبة على النكت في المملكة.'}
        </p>

        <blockquote className="mt-6 border-r-2 pr-6 italic">
          {'قال: "في النهاية، الجميع يستمتع بنكتة جيدة، لذا من العدل أن يدفعوا مقابل هذا الامتياز."'}
        </blockquote>

        <h3 className="mt-8 scroll-m-20 font-semibold text-2xl tracking-tight">{'ضريبة النكتة'}</h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {'لم يكن رعايا الملك سعداء. تذمروا واشتكوا، لكن الملك كان حازماً:'}
        </p>
        <ul className="my-6 mr-6 list-disc [&>li]:mt-2">
          <li>{'المستوى الأول من التورية: 5 قطع ذهبية'}</li>
          <li>{'المستوى الثاني من النكت: 10 قطع ذهبية'}</li>
          <li>{'المستوى الثالث من الطرائف: 20 قطعة ذهبية'}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {
            'نتيجة لذلك، توقف الناس عن رواية النكت، وسقطت المملكة في كآبة. لكن كان هناك شخص واحد رفض الاستسلام لحماقة الملك: مهرج البلاط الملكي اسمه نكتجي.'
          }
        </p>

        <h3 className="mt-8 scroll-m-20 font-semibold text-2xl tracking-tight">{'ثورة نكتجي'}</h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {
            'بدأ نكتجي يتسلل إلى القلعة في منتصف الليل ويترك النكت في كل مكان: تحت وسادة الملك، في حسائه، وحتى في المرحاض الملكي. كان الملك غاضباً، لكنه لم يستطع إيقاف نكتجي.'
          }
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {
            'وفي يوم من الأيام، اكتشف الناس أن النكت التي تركها نكتجي كانت مضحكة لدرجة أنهم لم يستطيعوا إلا الضحك. وبمجرد أن بدأوا بالضحك، لم يتمكنوا من التوقف.'
          }
        </p>

        <h3 className="mt-8 scroll-m-20 font-semibold text-2xl tracking-tight">{'ثورة الشعب'}</h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {
            'شعب المملكة، الذي شعر بالبهجة من الضحك، بدأ يروي النكت والطرائف مرة أخرى، وسرعان ما انضمت المملكة بأكملها إلى النكتة.'
          }
        </p>

        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-right font-bold [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'خزينة الملك'}
                </th>
                <th className="border px-4 py-2 text-right font-bold [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'سعادة الشعب'}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-right [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'فارغة'}
                </td>
                <td className="border px-4 py-2 text-right [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'فائضة'}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-right [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'متواضعة'}
                </td>
                <td className="border px-4 py-2 text-right [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'راضية'}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-right [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'ممتلئة'}
                </td>
                <td className="border px-4 py-2 text-right [&[align=center]]:text-center [&[align=left]]:text-left">
                  {'في قمة السعادة'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {
            'الملك، عندما رأى مدى سعادة رعاياه، أدرك خطأه وألغى ضريبة النكتة. أُعلن نكتجي بطلاً، وعاشت المملكة في سعادة إلى الأبد.'
          }
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {'العبرة من القصة: لا تستهن أبداً بقوة الضحكة الجيدة، واحذر دائماً من الأفكار السيئة.'}
        </p>
      </div>
    </div>
  )
}
