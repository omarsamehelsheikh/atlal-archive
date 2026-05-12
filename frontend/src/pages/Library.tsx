import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const BOOK_DESCRIPTIONS: Record<
  string,
  string
> = {
  "Diasporic Journeys":
    `Book 01 explores the deep and shifting relationship between identity and place, examining how identity is formed, preserved, and reimagined across both physical and emotional landscapes. Bringing together a range of artists and practices, it traces how identity can exist through material traces such as photographs, archives, and objects, as well as through memory, absence, and imagination.

Through themes of exile, displacement, and diaspora, the book highlights how artists reconstruct a sense of home when it is lost or fragmented. From preserving overlooked visual histories to creating personal and collective archives, their works reveal identity as layered, unstable, and continuously evolving. At the same time, the book engages with resistance against simplified and imposed narratives, showing how artists reclaim representation and assert complex cultural identities across generations and geographies.`,

  "Gender & Identity":
    `Book 02 examines the layered realities of gender, womanhood, and identity across the Arab region, moving between personal experience, cultural structures, and political contexts. Divided into two main sections, it brings together artistic and theoretical perspectives that question how gender is constructed, controlled, and expressed.

The first section focuses on womanhood, tracing themes of feminism, resistance, and autonomy within deeply rooted social and religious frameworks. It explores how women navigate systems of surveillance, shame, and expectation, while challenging the idea that liberation must come from external, Western narratives. Through discussions of the female gaze, labor, and the emotional weight women carry within families and societies, the works reveal both the visible and invisible pressures shaping women’s lives, as well as their acts of resilience and self-definition.

The second section expands into the fluidity of gender and expression, questioning rigid binaries and highlighting how both women and men are affected by patriarchal structures. Through artistic explorations of masculinity, identity, and performance, it uncovers the tensions between societal roles and personal truths. Together, the book presents gender not as fixed, but as something negotiated, embodied, and continuously reimagined across time and space.`,

  "Geopolitics, Physical Lands, Borders, Architecture":
    `Book 03 explores geopolitics as both a political and lived condition, examining how geography, borders, and territorial control shape identity across the Arab and SWANA region.

The book reflects on how the region has been divided and displaced through imposed borders, cycles of extraction, and Western fascination with its geopolitical significance. Through themes of ecology, surveillance, land, and belonging, it considers how artists confront the burden of geopolitics while maintaining deep emotional and historical connections to place.

Featuring artists such as Kader Attia, Yazan Khalili, and Jananne Al-Ani, the book highlights how contemporary artistic practices communicate the complexity of the Arab experience through lived realities, memory, and collective understanding.`,

  "Archeology, Beliefs & Mythology":
    `Book 04 explores mythology, belief systems, and cultural memory as frameworks through which identity is constructed, repeated, and reinterpreted across the Arab world. At its core is the idea of cyclical narratives, stories, traumas, and histories that continuously return, taking on new meanings within different geographical and political contexts.

Beginning with parallel artistic interpretations of the same myth, the book highlights how identical symbols can diverge in meaning. While one artist reflects on cycles of industrial consumption and environmental destruction, another reimagines repetition as a loop of memory, loss, and resilience shaped by the trauma of conflict. Through this contrast, mythology emerges not as fixed, but as something deeply tied to place, experience, and lived reality.

It concludes by critically reflecting on the politicization of faith and the structures that shape belief, from institutional power to personal superstition. Through these perspectives, the book reveals how identity is continuously negotiated between history, ideology, and lived experience, existing within cycles of remembrance, reinterpretation, and resistance.`,

  "Family & Domesticity":
    `Book 05 explores the intimate relationship between domesticity, food, memory, and identity, revealing how personal spaces are deeply shaped by political, historical, and cultural forces. Through everyday rituals and environments, it highlights how the private sphere becomes a site where larger narratives of power, displacement, and belonging are lived and felt.

Food emerges as both a cultural marker and a political language, carrying layered meanings that shape identity on experiential and social levels. Rooted in local visual cultures, the works embrace color, humor, materiality, and pop aesthetics drawn from specific Arab contexts while resisting simplified readings of domestic imagery.`,

  "Diversity of Medium & Expressions":
    `Book 06 explores materiality as a language through which artists express complex political, historical, and emotional realities. Through sculpture, installation, and mixed media, it examines how materials become carriers of memory, trauma, and identity, creating sensory experiences that connect personal and collective histories.

Bringing together contrasting artistic approaches, the book highlights how similar mediums can produce radically different meanings, from introspective and constrained to luminous and speculative. It also explores the body as a medium, scientific processes, and writing as visual form, particularly through Arabic script.

Moving between stillness and motion, object and experience, the book reveals how art becomes a space where identity is physically felt, continuously negotiated, and reimagined.`,

  "Visibility & Representation of Artists":
    `Book 07 explores Destruct, Repair and Grief as a critical and visual inquiry into how Arab and SWANA artists navigate and reclaim identity under the weight of Western representation through destruction, fragmentation, and repair.

The book examines how artists dismantle colonial archives, re-memory histories, and reshape narratives that have repeatedly been framed through reductive perspectives. Through themes of imperial aesthetics, ethics, Palestine, grief, and witnessing, it reflects on the politics of representation and the responsibility of image-making.

It ultimately questions who controls the image, what disappears in translation, and how absence itself can become both protection and resistance, positioning autonomy at the center of identity and storytelling.`,

  "Destruct, Repair & Grief":
    `Book 08 explores the discipline of forensics and its intersection with ethics.`,
};

const BOOK_DESCRIPTIONS_AR: Record<
  string,
  string
> = {
  "Diasporic Journeys":
    `يستكشف الكتاب الأول العلاقة العميقة والمتغيرة بين الهوية والمكان، ويبحث في كيفية تشكل الهوية وحفظها وإعادة تصورها عبر المشاهد المادية والعاطفية على حد سواء. ويجمع الكتاب بين مجموعة متنوعة من الفنانين والممارسات الفنية، ليتتبع كيف يمكن للهوية أن تتجسد من خلال الآثار المادية مثل الصور الفوتوغرافية والمحفوظات والأشياء، وكذلك من خلال الذاكرة والغياب والخيال.

من خلال موضوعات المنفى والتشرد والشتات، يسلط الكتاب الضوء على كيفية إعادة بناء الفنانين لإحساسهم بالوطن عندما يضيع أو يتفكك. من الحفاظ على التواريخ البصرية المهملة إلى إنشاء أرشيفات شخصية وجماعية، تكشف أعمالهم عن الهوية باعتبارها متعددة الطبقات وغير مستقرة ومتطورة باستمرار. في الوقت نفسه، يتناول الكتاب مقاومة الروايات المبسطة والمفروضة، موضحًا كيف يستعيد الفنانون تمثيلهم ويؤكدون هوياتهم الثقافية المعقدة عبر الأجيال والمناطق الجغرافية.`,

  "Gender & Identity":
    `يستكشف الكتاب الثاني الحقائق المتعددة الأبعاد للجندر والأنوثة والهوية في جميع أنحاء المنطقة العربية، متنقلاً بين التجارب الشخصية والبنى الثقافية والسياقات السياسية. وينقسم الكتاب إلى قسمين رئيسيين، ويجمع بين وجهات نظر فنية ونظرية تتساءل عن كيفية تشكيل الجندر والتحكم فيه والتعبير عنه.

ويركز القسم الأول على الأنوثة، متتبعاً موضوعات النسوية والمقاومة والاستقلالية ضمن أطر اجتماعية ودينية عميقة الجذور. ويستكشف كيف تتعامل النساء مع أنظمة المراقبة والخجل والتوقعات، بينما يتحدى فكرة أن التحرر يجب أن يأتي من روايات خارجية غربية. من خلال مناقشات حول النظرة الأنثوية والعمل والعبء العاطفي الذي تتحمله النساء داخل الأسر والمجتمعات، تكشف الأعمال عن الضغوط المرئية وغير المرئية التي تشكل حياة النساء، بالإضافة إلى أعمالهن في الصمود وتعريف الذات.

يتوسع القسم الثاني في موضوع مرونة الجندر والتعبير، متسائلاً عن الثنائيات الصارمة ومسلطاً الضوء على كيفية تأثر كل من النساء والرجال بالهياكل الأبوية. من خلال الاستكشافات الفنية للذكورة والهوية والأداء، يكشف القسم عن التوترات بين الأدوار المجتمعية والحقائق الشخصية. ويقدم الكتاب الجندر بشكل عام ليس كشيء ثابت، بل كشيء يتم التفاوض عليه وتجسيده وإعادة تصوره باستمرار عبر الزمان والمكان.`,

  "Geopolitics, Physical Lands, Borders, Architecture":
    `الكتاب الثالث الجغرافيا السياسية تخصصٌ ضمن العلوم السياسية؛ تجمع بين كلمة "جيو" التي تُحيل إلى الجغرافيا تحديدًا (الموقع، والموارد، والطبيعة، والتضاريس، والبيئة)، وكلمة "سياسة"، إذ تغدو هذه العناصر الجغرافية نقاطَ ارتكازٍ للنفوذ السياسي، والتموضع الاستراتيجي، والسيطرة على الأراضي.

لقد رُسمت حدود المنطقة العربية ومنطقة جنوب غرب آسيا وشمال أفريقيا دون أن يكون لشعوبها أي صوت فيها، ثم اقتُلعت هذه الشعوب من تلك الحدود ذاتها، في دورةٍ متواصلة من الاستغلال والنهب، وافتتانٍ غربي بـ«جغرافيتها السياسية»، تحت وطأته عانت أراضيها وازداد تعلّق أبنائها بها، يزدادون حنيناً بكل بقعةٍ تقع عليها أعينهم، رافضين أن يُهمَّشوا عن أرضهم، متأملين حدودهم، حاملين ثقل الجغرافيا السياسية.

من خلال موضوعات البيئة والأرض المادية والمراقبة، يوظّف كلٌّ من قادر عطية، ويزن الخليلي، وجنان العاني وفنانين معاصرين آخرين وسائطهم الفنية لنقل تعقيد المناخ الجغرافي السياسي الذي أثقل كاهل المنطقة لسنواتٍ طويلة، مستقين ذلك لا من تجاربهم المعيشية وحسب، بل من فهمهم المشترك لما تعنيه «التجربة العربية».`,

  "Archeology, Beliefs & Mythology":
    `يستكشف الكتاب الرابع الأساطير وأنظمة المعتقدات والذاكرة الثقافية باعتبارها أطرًا تُبنى من خلالها الهوية وتُكرر وتُعاد تفسيرها في جميع أنحاء العالم العربي. وتتمحور فكرته الأساسية حول السرديات الدورية، والقصص، والصدمات النفسية، والتاريخ الذي يعود باستمرار، ليتخذ معاني جديدة ضمن سياقات جغرافية وسياسية مختلفة.

يبدأ الكتاب بتفسيرات فنية متوازية لنفس الأسطورة، ويُبرز كيف يمكن أن تتباين معاني الرموز المتطابقة. ففي حين يتأمل فنان ما دورات الاستهلاك الصناعي وتدمير البيئة، يعيد فنان آخر تصور التكرار كحلقة من الذاكرة والفقدان والمرونة التي شكلتها صدمة الصراع. ومن خلال هذا التباين، تظهر الأساطير ليس كشيء ثابت، بل كشيء مرتبط ارتباطًا عميقًا بالمكان والتجربة والواقع المعاش.

ويختتم الكتاب بتأمل نقدي في تسييس الإيمان والهياكل التي تشكل المعتقدات، من السلطة المؤسسية إلى الخرافات الشخصية. ومن خلال هذه المنظورات، يكشف الكتاب كيف يتم التفاوض باستمرار حول الهوية بين التاريخ والأيديولوجيا والتجربة المعاشة، والتي توجد ضمن دورات من الذكرى وإعادة التفسير والمقاومة.`,

  "Family & Domesticity":
    `يستكشف الكتاب الخامس العلاقة الوثيقة بين الحياة المنزلية والطعام والذاكرة والهوية، مظهراً كيف تتأثر المساحات الشخصية تأثراً عميقاً بالقوى السياسية والتاريخية والثقافية. ومن خلال الطقوس والبيئات اليومية، يسلط الضوء على كيفية تحول المجال الخاص إلى مكان تُعاش فيه وتُحسّ فيه الروايات الأوسع نطاقاً المتعلقة بالسلطة والتشريد والانتماء.

ويبرز الطعام، على وجه الخصوص، باعتباره علامة ثقافية ولغة سياسية في آن واحد، حاملاً معاني متعددة الطبقات تشكل الهوية على المستويين التجريبي والاجتماعي.

تستمد الأعمال الواردة في هذا الكتاب جذورها من الثقافات البصرية المحلية، وتحتضن الألوان والفكاهة والمادية وجماليات البوب المستمدة من سياقات عربية محددة. وهي تقاوم الترجمة السهلة، وتحافظ على تعقيد وغموض لغتها البصرية، بينما تتجاوز القراءات السطحية للصور المبتذلة والمنزلية.`,

  "Diversity of Medium & Expressions":
    `يستكشف الكتاب السادس المادية باعتبارها لغة يعبر من خلالها الفنانون عن حقائق سياسية وتاريخية وعاطفية معقدة. ومن خلال النحت والتركيبات الفنية والوسائط المختلطة، يبحث الكتاب في الكيفية التي تصبح بها المواد — سواء كانت صناعية أو هشة أو عضوية — حاملة للذاكرة والصدمات النفسية والهوية، مما يخلق تجارب حسية تربط بين التاريخ الشخصي والجماعي.

يجمع الكتاب بين نُهج فنية متباينة، ويسلط الضوء على كيفية إنتاج وسائط متشابهة لمعانٍ مختلفة جذريًا، من التأملية والمقيدة إلى المضيئة والتخمينية. كما يستكشف الجسد كوسيط، واستخدام العمليات العلمية، والكتابة كشكل بصري، لا سيما من خلال الخط العربي.

من خلال التنقل بين السكون والحركة، والشيء والتجربة، يكشف الكتاب كيف يصبح الفن مساحة تُحس فيها الهوية جسديًا، وتُتفاوض عليها باستمرار، وتُعاد تصورها.`,

  "Visibility & Representation of Artists":
    `يستكشف الكتاب السابع موضوعات «التدمير» و«الإصلاح» و«الحزن»؛ وهو استقصاء نقدي وبصري لكيفية تعامل الفنانين العرب وفناني منطقة الشرق الأوسط وشمال أفريقيا (سوانا) مع هويتهم واستعادتها في ظل ثقل التمثيل الغربي، من خلال التدمير أو التفتت أو الإصلاح باعتبارها نقاط محورية في ممارساتهم الفنية.

ومن خلال استعراض أعمال المقاومة هذه، يبحث الكتاب في كيفية قيام الفنانين بتفكيك الأرشيفات الاستعمارية، وإعادة صياغة الذكريات التاريخية، وإعادة صياغة الروايات التي شكلتها مرارًا وتكرارًا نظرة اختزالية.

يغطي الكتاب أسئلة تتعلق بالجماليات الإمبريالية والأخلاق والتجربة المعاشة، ويوجه عدسته باستمرار نحو فلسطين، ليس فقط من خلال الحزن، بل أيضًا كبوصلة لوعي أوسع نطاقًا بمقاومة الاستعمار. يتناول الكتاب تعقيد الهوية الفلسطينية بما يتجاوز الحرب، ويتساءل عما يعنيه التوثيق والحزن والشهادة بمسؤولية.

كما يتناول الكتاب أخلاقيات الإبداع: من يتحكم في الصورة، وما الذي يُفقد في الترجمة، وكيف يمكن أن يصبح الغياب في الصورة الفوتوغرافية بحد ذاته عملاً من أعمال التحدي والحماية. إنه كتاب عن الاستقلالية — استقلالية الهوية، والصورة، والشروط التي تُرى بها التجربة العربية وتُروى.`,

  "Destruct, Repair & Grief":
    `الكتاب الثامن يتناول علم الأدلة الجنائية وتقاطعه مع الأخلاقيات.`,
};
const ARTICLE_PARAGRAPHS_EN = [
  `As Stuart Hall explains, identity is not as transparent or as simple as we believe. He argues that we should consider identity as a "production," which is never finished, always in process, and always created within, not outside, representation, rather than as an already achieved truth that the new cultural practices then represent.`,
  `The very authority and credibility that the term "cultural identity" claims are called into question by this point of view. According to him there are two ways of thinking about the term "cultural identity".`,
  `Based on the first definition, it refers to a single, shared culture, a kind of collective "one true self" that hides itself within the several other, more superficial or artificially imposed "selves" that individuals with similar heritage and history share. According to this definition, beneath the shifting divisions and events of our actual history, our cultural identities reflect the shared cultural norms and common historical experiences that give us, as "one people," stable, unchanging, and ongoing frames of reference and meaning.`,
  `He also mentions how the significance of the act of imaginative rediscovery that this idea of a rediscovered, basic identity entails should not be undervalued or ignored. Many of the most significant social movements of our day, including feminist, anti-colonial, and anti-racist ones, have emerged as a result of "hidden histories."`,
  `This second definition emphasizes that, in addition to the wide range of resemblance, there are also crucial elements of deeper and important difference that make up "what we really are" or, more accurately, "what we have become," given the intervention of history. We can't talk about "one experience, one identity" for too long without addressing its other side, the discontinuities and ruptures that precisely make up the "uniqueness" of the Caribbean.`,
  `In this second definition, cultural identity involves both "becoming" and "being." It is equally a part of the past and the future. It moves beyond location, time, history, and culture; it is not something that already exists.`,
  `Cultural identities have history and originate somewhere. However, they are always changing, just like anything that is historical. They are vulnerable to the ongoing "play" of history, culture, and power rather than being permanently fixed in an idealized past.`,
  `Identities are the names we give to the various ways we are positioned by and within the narratives of the past, rather than being based on a simple "recovery" of the past that is just waiting to be discovered and, once discovered, will ensure our sense of self into eternity.`,
  `However, our understanding of "cultural identity" is altered by this notion of otherness as a part of us. According to this point of view, cultural identity is not a fixed essence that exists independently of culture and history.`,
  `It is not some invisible, universal essence within us that has not been fundamentally impacted by history. It's not a one-time event. We cannot make an accurate and absolute return to it since it is not a fixed origin.`,
  `It's also not just a feeling, of course. It's not just a fantasy; it's something. It has a history, and histories have tangible and symbolic consequences. The past is still speaking to us.`,
  `Meanwhile, since our relationship to it is always-already "after the break," just like a child's relationship to their mother, it no longer addresses us as a straightforward, true "past." It is always created through myth, story, imagination, and memory.`,
  `Cultural identities are the unstable sites of identification or bonds that are created within historical and cultural discourses. It is a positioning rather than an essence. Therefore, there is always a politics of place and identity that cannot be completely guaranteed by an abstract, effortless "law of origin."`,
];

const ARTICLE_PARAGRAPHS_AR = [
  `كما يوضح ستيوارت هول، فإن الهوية ليست شفافة أو بسيطة كما نعتقد. ويرى أنه ينبغي لنا أن ننظر إلى الهوية باعتبارها "إنتاجاً" لم يكتمل قط، ولا يزال في طور التشكّل دائماً، وينشأ دائماً من داخل التمثيل لا من خارجه، بدلاً من اعتبارها حقيقة منجزة مسبقاً تعكسها الممارسات الثقافية الجديدة.`,
  `إن السلطة والمصداقية اللتين يدّعيهما مصطلح "الهوية الثقافية" تُستجوبان من هذا المنظور. ووفقاً له، ثمة طريقتان للتفكير في مصطلح "الهوية الثقافية".`,
  `استناداً إلى التعريف الأول، تشير الهوية إلى ثقافة مشتركة واحدة، نوع من "الذات الحقيقية" الجماعية التي تختبئ خلف "ذوات" أخرى أكثر سطحية أو مفروضة بصورة اصطناعية، يتشارك فيها الأفراد ذوو الإرث والتاريخ المشترك. ووفقاً لهذا التعريف، تحت الانقسامات المتحوّلة وأحداث تاريخنا الفعلي، تعكس هوياتنا الثقافية الأعراف الثقافية المشتركة والتجارب التاريخية المشتركة التي تمنحنا، بوصفنا "شعباً واحداً"، أطراً مرجعية ثابتة ومستمرة.`,
  `كما يشير إلى أن أهمية فعل إعادة الاكتشاف الخيالي الذي ينطوي عليه هذا التصور لهوية أساسية مُستعادة لا ينبغي الاستهانة بها أو تجاهلها. فكثير من أبرز الحركات الاجتماعية في عصرنا، بما فيها الحركات النسوية ومناهضة الاستعمار ومناهضة العنصرية، قد نشأت نتيجة "تواريخ مخفية".`,
  `يُبرز التعريف الثاني أنه، فضلاً عن نطاق التشابه الواسع، ثمة عناصر جوهرية من الاختلاف العميق والمهم تُشكّل "ما نحن عليه حقاً"، أو بتعبير أدق "ما صِرنا إليه"، في ضوء تدخّل التاريخ. لا يمكننا الحديث عن "تجربة واحدة وهوية واحدة" طويلاً دون مواجهة وجهها الآخر، أي الانقطاعات والتصدعات التي تُشكّل بالضبط "فرادة" منطقة البحر الكاريبي.`,
  `في هذا التعريف الثاني، تنطوي الهوية الثقافية على "الصيرورة" و"الكينونة" معاً. فهي جزء من الماضي والمستقبل على حدٍّ سواء، وتتجاوز المكان والزمان والتاريخ والثقافة؛ إذ إنها ليست شيئاً قائماً بالفعل.`,
  `للهويات الثقافية تاريخ ومنشأ. غير أنها في تحوّل مستمر، شأنها شأن كل ما هو تاريخي. فهي عرضة للـ"لعبة" المتواصلة للتاريخ والثقافة والسلطة، بدلاً من أن تكون راسخة بصورة دائمة في ماضٍ مثالي.`,
  `الهويات هي الأسماء التي نطلقها على الطرق المتعددة التي نُوضَع بها وضمن روايات الماضي، بدلاً من أن تستند إلى "استعادة" بسيطة للماضي تنتظر الاكتشاف، وحين تُكتشف ستضمن إحساسنا بالذات إلى الأبد.`,
  `بيد أن فهمنا لـ"الهوية الثقافية" يتغيّر بفعل هذا المفهوم للآخرية باعتبارها جزءاً منّا. من هذا المنظور، الهوية الثقافية ليست جوهراً ثابتاً يقوم بمعزل عن الثقافة والتاريخ.`,
  `إنها ليست جوهراً خفياً وكونياً بداخلنا لم يمسّه التاريخ في جوهره. وهي ليست حدثاً آنياً، ولا يمكننا العودة إليها عودةً دقيقة ومطلقة، إذ إنها ليست أصلاً ثابتاً.`,
  `وبطبيعة الحال، هي ليست مجرد شعور. وليست مجرد وهم؛ بل إنها شيء حقيقي. لها تاريخ، وللتواريخ عواقب ملموسة ورمزية. فالماضي لا يزال يخاطبنا.`,
  `وفي الوقت ذاته، بما أن علاقتنا به هي دائماً "ما بعد الانقطاع"، تماماً كعلاقة الطفل بأمه، فإنه لم يعد يخاطبنا بوصفه "ماضياً" حقيقياً ومباشراً. إنه يُصنَع دائماً عبر الأسطورة والحكاية والخيال والذاكرة.`,
  `الهويات الثقافية هي مواقع متقلبة للتعريف أو الروابط التي تتشكّل داخل الخطابات التاريخية والثقافية. إنها موقع لا جوهر. ولذا، ثمة دائماً سياسة للمكان والهوية لا يمكن ضمانها كلياً بـ"قانون أصل" مجرد وعفوي.`,
];

const SPREAD_COORDS = [
  { top: 50, left: 350 },
  { top: 400, left: 50 },
  { top: 400, left: 550 },
  { top: 750, left: 50 },
  { top: 750, left: 550 },
  { top: 1100, left: 50 },
  { top: 1100, left: 550 },
  { top: 1450, left: 350 },
];

const RANDOM_DIMENSIONS = [
  "14x20x1.2 cm",
  "15x21x0.8 cm",
  "13x19x1 cm",
  "16x22x1.5 cm",
];
const RANDOM_PAGES = [
  "220 pages",
  "260 pages",
  "180 pages",
  "312 pages",
  "240 pages",
];
const RANDOM_DESIGNERS = [
  "Nancy Ashraf, Sohayla Hegazy",
  "Fatema Elhemaly, Nancy Ashraf",
  "Sohayla Hegazy, Fatema Elhemaly",
  "Nancy Ashraf, Fatema Elhemaly",
];

const Library: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "AR";
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSpreadIndex, setActiveSpreadIndex] = useState<number | null>(
    null,
  );
  const [showArticle, setShowArticle] = useState(false);

  useEffect(() => {
    axios
      .get("http://54.174.102.52:5000/api/books")
      .then((res) => {
        const rawData = res.data.data || res.data || [];
        const normalized = rawData.map((b: any, i: number) => {
          const rawTitle = b.Book_Title || b.Title || "Untitled";
          const bookIndex = i + 1;
          const isFirstBook = i === 0 || rawTitle === "Diasporic Journeys";
          let coverImage = b.Cloudinary_Image1 || "/book1.png";
          if ([1, 3, 6, 7].includes(bookIndex))
            coverImage = `/book${bookIndex}.png`;

          let spreads: string[] = [];
          if (rawTitle === "Diasporic Journeys") {
            spreads = Array.from(
              { length: 8 },
              (_, idx) => `/spread${idx + 1}.jpg`,
            );
          }

          return {
            _id: b._id,
            book_id: b.Book_ID || `BOOK ${String(bookIndex).padStart(2, "0")}`,
            titleEn: rawTitle,
            titleAr: b.Title_In_Arabic || rawTitle,
            cover: coverImage,
            dimensions: isFirstBook
              ? "13.8x19.3x.9 cm"
              : RANDOM_DIMENSIONS[i % RANDOM_DIMENSIONS.length],
            pageCount: isFirstBook
              ? "306 pages"
              : RANDOM_PAGES[i % RANDOM_PAGES.length],
            designers: isFirstBook
              ? "Nancy Ashraf, Sohayla Hegazy, Fatema Elhemaly"
              : RANDOM_DESIGNERS[i % RANDOM_DESIGNERS.length],
            spreads,
          };
        });
        setBooks(normalized);
        if (normalized.length > 0) setSelectedBook(normalized[0]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const selectedDisplay = selectedBook
    ? {
        ...selectedBook,
        title: isArabic ? selectedBook.titleAr : selectedBook.titleEn,
        description: isArabic
          ? BOOK_DESCRIPTIONS_AR[selectedBook.titleEn]
          : BOOK_DESCRIPTIONS[selectedBook.titleEn],
      }
    : null;

  const handleOpenLibraryOverly = () => setIsOpen(true);

  const handleOpenArticle = () => {
    setShowArticle(true);
    setIsOpen(false);
    setActiveSpreadIndex(null);
  };

  if (isLoading)
    return (
      <div style={styles.loader}>
        {isArabic ? "جارٍ استرداد الأرشيف..." : "RETRIEVING ARCHIVE..."}
      </div>
    );

  return (
    <div
      style={{
        background: isArabic ? "#000" : "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <main style={{ flex: 1, position: "relative" }}>
        {showArticle ? (
          /* --- ARTICLE VIEW --- */
          <div
            style={{
              position: "relative",
              width: "100%",
              minHeight: "100vh",
              overflow: "hidden",
              background: "#f5f3ef",
              paddingTop: "110px",
            }}
          >
            {/* Background Image */}
            <img
              src="/article.jpg"
              alt="Article"
              style={{
                position: "absolute",
                width: "1465px",
                height: "787px",
                top: "-15px",
                left: "-25px",
                objectFit: "cover",
                opacity: 0.45,
                zIndex: 1,
              }}
            />

            {/* Main Content */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                width: "100%",
                minHeight: "100vh",
                padding: "40px 60px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                direction: isArabic ? "rtl" : "ltr",
              }}
            >
              {/* Top Section */}
              <div>
                <button
                  onClick={() => setShowArticle(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#111",
                    fontSize: "14px",
                    letterSpacing: "2px",
                    cursor: "pointer",

                    // marginTop:"110 px",
                    alignSelf: "flex-end", // pushes to the right
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  {isArabic ? "العودة للمكتبة →" : "← BACK TO LIBRARY"}
                </button>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <div style={{ maxWidth: "1200px" }}>
                    <h1
                      style={{
                        color: "#8A38F5",
                        fontSize: "clamp(48px, 7vw, 96px)",
                        fontWeight: 800,
                        lineHeight: 0.95,
                        letterSpacing: "-3px",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      {isArabic
                        ? "الهوية العربية والفضاء: استحالة الفصل بينهما والتوتر بين المادي والمعنوي"
                        : "Arab Identity And Space Impossibility To Separate From Another Tensioning Between The Material/Physical And The Immaterial"}
                    </h1>

                    <p
                      style={{
                        marginTop: "25px",
                        color: "#8A38F5",
                        fontSize: "13px",
                        letterSpacing: "4px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {isArabic
                        ? "تحرير: سهيلة حجازي"
                        : "Article By: Sohayla Hegazy"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr",
                  gap: "60px",
                  alignItems: "start",
                  marginTop: "80px",
                }}
              >
                {/* Left Info */}
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "3px",
                      opacity: 0.7,
                      marginBottom: "10px",
                    }}
                  >
                    {isArabic ? "كتاب ٠١" : "Book 01"}
                  </p>
                  <h2
                    style={{
                      fontSize: "42px",
                      fontWeight: 300,
                      lineHeight: 1,
                      margin: 0,
                    }}
                  >
                    {isArabic ? "رحلات الشتات" : "Diasporic Journeys"}
                  </h2>
                </div>

                {/* Article Text */}
                <div
                  style={{
                    width: "100%",
                    color: "#111",
                    fontSize: "15px",
                    lineHeight: 1.95,
                    display: "flex",
                    flexDirection: "column",
                    gap: "28px",
                    background: "rgba(255,255,255,0.72)",
                    padding: "45px 50px",
                    borderRadius: "24px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                    fontWeight: 500,
                  }}
                >
                  {(isArabic
                    ? ARTICLE_PARAGRAPHS_AR
                    : ARTICLE_PARAGRAPHS_EN
                  ).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- LIBRARY LIST VIEW --- */
          <div style={{ flex: 1, overflow: "hidden" }}>
            <AnimatePresence>
              {isOpen && selectedDisplay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    ...styles.fullBookOverlay,
                    background: isArabic ? "#000" : "#fff",
                  }}
                >
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      ...styles.closeBtn,
                      color: isArabic ? "#fff" : "#000",
                    }}
                  >
                    {isArabic ? "إغلاق [X]" : "CLOSE [X]"}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      flexDirection: isArabic ? "row-reverse" : "row",
                    }}
                  >
                    <motion.div
                      animate={{
                        width: activeSpreadIndex !== null ? "60%" : "100%",
                      }}
                      style={{ overflowY: "auto", height: "100%" }}
                    >
                      <div
                        style={{
                          direction: isArabic ? "rtl" : "ltr",
                          padding: "40px 60px 0",
                        }}
                      >
                        <div
                          style={{
                            ...styles.detailIdLabel,
                            color: isArabic ? "#fff" : "#000",
                          }}
                        >
                          {selectedDisplay.book_id}
                        </div>
                        <h1
                          style={{ ...styles.articleTitle, color: "#7B2FBE" }}
                        >
                          {selectedDisplay.title}
                        </h1>
                      </div>
                      <div
                        style={{
                          ...styles.canvasContainer,
                          padding: "0 60px 60px",
                        }}
                      >
                        {selectedDisplay.spreads.map(
                          (url: string, index: number) => (
                            <img
                              key={index}
                              src={url}
                              alt="spread"
                              onClick={() => setActiveSpreadIndex(index)}
                              style={{
                                ...styles.positionedSpread,
                                top: `${SPREAD_COORDS[index]?.top}px`,
                                left: `${SPREAD_COORDS[index]?.left}px`,
                                outline:
                                  activeSpreadIndex === index
                                    ? "3px solid #7B2FBE"
                                    : "none",
                              }}
                            />
                          ),
                        )}
                      </div>
                    </motion.div>

                    {activeSpreadIndex !== null && (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          ...styles.detailsSidebar,
                          direction: isArabic ? "rtl" : "ltr",
                          borderLeft: isArabic ? "none" : "1px solid #e0e0e0",
                          borderRight: isArabic ? "1px solid #222" : "none",
                        }}
                      >
                        <button
                          onClick={() => setActiveSpreadIndex(null)}
                          style={{
                            ...styles.closeDetailsBtn,
                            color: isArabic ? "#fff" : "#000",
                          }}
                        >
                          {isArabic ? "إغلاق ×" : "CLOSE DETAILS ×"}
                        </button>
                        <div
                          style={{
                            ...styles.detailIdLabel,
                            color: isArabic ? "#fff" : "#000",
                          }}
                        >
                          {selectedDisplay.book_id}
                        </div>
                        <div
                          style={{ ...styles.detailTitle, color: "#7B2FBE" }}
                        >
                          {selectedDisplay.title}
                        </div>
                        <img
                          src={selectedDisplay.spreads[activeSpreadIndex]}
                          alt="active"
                          style={styles.sidebarImg}
                        />
                        <p
                          style={{
                            color: isArabic ? "#ccc" : "#333",
                            fontSize: "14px",
                          }}
                        >
                          {selectedDisplay.description}
                        </p>

                        <div
                          style={{
                            fontSize: "12px",
                            lineHeight: 2,
                            color: isArabic ? "#aaa" : "#555",
                            marginTop: "12px",
                          }}
                        >
                          <div>
                            {isArabic ? "الحجم:" : "Size:"}{" "}
                            {selectedDisplay.dimensions}
                          </div>
                          <div>
                            {isArabic ? "عدد الصفحات:" : "Page numbers:"}{" "}
                            {selectedDisplay.pageCount}
                          </div>
                          <div>
                            {isArabic ? "تصميم:" : "Designed by:"}{" "}
                            {selectedDisplay.designers}
                          </div>
                        </div>

                        <div
                          style={{
                            textAlign: isArabic ? "left" : "right",
                            marginTop: "20px",
                          }}
                        >
                          <button
                            onClick={handleOpenArticle}
                            style={{
                              ...styles.readMoreBtn,
                              color: isArabic ? "#fff" : "#000",
                            }}
                          >
                            {isArabic ? "← إقرأ المزيد" : "READ MORE →"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              style={{
                display: "flex",
                flexDirection: isArabic ? "row-reverse" : "row",
                height: "calc(100vh - 110px)",
                marginTop: "110px",
              }}
            >
              {/* Left panel — book list */}
              <div
                style={{
                  ...styles.leftPanel,
                  borderRight: isArabic ? "none" : "1px solid #e0e0e0",
                  borderLeft: isArabic ? "1px solid #222" : "none",
                }}
              >
                {books.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => setSelectedBook(book)}
                    onDoubleClick={handleOpenLibraryOverly}
                    style={{
                      ...styles.bookRow,
                      borderBottom: isArabic
                        ? "1px solid #222"
                        : "1px solid #e0e0e0",
                      background:
                        selectedBook?._id === book._id
                          ? "#7B2FBE"
                          : "transparent",
                    }}
                  >
                    <div
                      style={{
                        ...styles.bookIdLabel,
                        color: isArabic ? "#fff" : "#000",
                      }}
                    >
                      {book.book_id}
                    </div>
                    <div
                      style={{
                        ...styles.bookTitle,
                        color:
                          selectedBook?._id === book._id
                            ? "#fff"
                            : isArabic
                              ? "#fff"
                              : "#000",
                      }}
                    >
                      {isArabic ? book.titleAr : book.titleEn}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right panel — book details */}
              <div style={styles.rightPanel}>
                {selectedDisplay && (
                  <div
                    style={{
                      direction: isArabic ? "rtl" : "ltr",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        ...styles.detailIdLabel,
                        color: isArabic ? "#fff" : "#000",
                      }}
                    >
                      {selectedDisplay.book_id}
                    </div>
                    <div style={{ ...styles.detailTitle, color: "#7B2FBE" }}>
                      {selectedDisplay.title}
                    </div>
                    <img
                      src={selectedDisplay.cover}
                      alt="cover"
                      style={styles.coverImg}
                    />
                    <p
                      style={{
                        color: isArabic ? "#ccc" : "#333",
                        fontSize: "14px",
                      }}
                    >
                      {selectedDisplay.description}
                    </p>

                    <div
                      style={{
                        fontSize: "12px",
                        lineHeight: 2,
                        color: isArabic ? "#aaa" : "#555",
                        marginTop: "16px",
                      }}
                    >
                      <div>
                        {isArabic ? "الحجم:" : "Size:"}{" "}
                        {selectedDisplay.dimensions}
                      </div>
                      <div>
                        {isArabic ? "عدد الصفحات:" : "Page numbers:"}{" "}
                        {selectedDisplay.pageCount}
                      </div>
                      <div>
                        {isArabic ? "تصميم:" : "Designed by:"}{" "}
                        {selectedDisplay.designers}
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: isArabic ? "left" : "right",
                        marginTop: "auto",
                      }}
                    >
                      <button
                        onClick={handleOpenLibraryOverly}
                        style={{
                          ...styles.readMoreBtn,
                          color: isArabic ? "#fff" : "#000",
                        }}
                      >
                        {isArabic ? "← إقرأ المزيد" : "READ MORE →"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "12px",
  },
  leftPanel: { width: "55%", overflowY: "auto" },
  bookRow: { padding: "24px 40px", cursor: "pointer" },
  bookIdLabel: { fontSize: 11, fontWeight: 600, textDecoration: "underline" },
  bookTitle: {
  color: "var(--black, #000)",

  fontFamily: "TWK Lausanne",

  fontSize: "80px",

  fontStyle: "normal",

  fontWeight: 600,

  lineHeight: "100px",

  textTransform: "capitalize",
},
  rightPanel: { width: "45%", padding: "40px", overflowY: "auto" },
  detailTitle: { fontSize: 42, fontWeight: 700, marginBottom: 12 },
  coverImg: { width: 120, height: 160, objectFit: "cover", margin: "20px 0" },
  readMoreBtn: {
    background: "none",
    border: "none",
    fontWeight: 700,
    textDecoration: "underline",
    cursor: "pointer",
  },
  fullBookOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
  },
  articleTitle: { fontSize: "48px", fontWeight: 700 },
  closeBtn: {
    position: "fixed",
    top: "20px",
    right: "40px",
    background: "none",
    border: "none",
    cursor: "pointer",
    zIndex: 10000,
    fontSize: 13,
    fontWeight: 700,
  },
  canvasContainer: { position: "relative", width: "100%", height: "1800px" },
  positionedSpread: {
    position: "absolute",
    width: "450px",
    height: "325px",
    objectFit: "cover",
    cursor: "pointer",
  },
  detailsSidebar: {
    width: "40%",
    height: "100vh",
    overflowY: "auto",
    padding: "40px",
  },
  sidebarImg: { width: "100%", height: "auto", margin: "16px 0" },
  closeDetailsBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 24,
  },
};

export default Library;
