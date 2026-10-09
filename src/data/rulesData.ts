import type { RuleEntry } from '../types/rules';

export const RULES_DATABASE: RuleEntry[] = [
  // --- CONDITIONS ---
  {
    id: 'cond_blinded',
    name: 'Blinded',
    nameUk: 'Засліплений (Blinded)',
    category: 'condition',
    shortSummary: 'Cannot see; fails sight checks; attack rolls against have advantage, own attacks have disadvantage.',
    shortSummaryUk: 'Не бачить; автоматично провалює перевірки на зір; атаки по істоті мають перевагу, її атаки — перешкоду.',
    bullets: [
      'A blinded creature can’t see and automatically fails any ability check that requires sight.',
      'Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.'
    ],
    bulletsUk: [
      'Засліплена істота нічого не бачить і автоматично провалює будь-яку перевірку характеристик, що вимагає зору.',
      'Кидки атаки проти істоти мають перевагу (Advantage), а власні кидки атаки істоти мають перешкоду (Disadvantage).'
    ],
    tags: ['condition', 'combat', 'vision'],
    source: '5e.tools / PHB p.290'
  },
  {
    id: 'cond_charmed',
    name: 'Charmed',
    nameUk: 'Зачарований (Charmed)',
    category: 'condition',
    shortSummary: 'Cannot attack charmer; charmer has advantage on social ability checks.',
    shortSummaryUk: 'Не може атакувати чарівника; чарівник має перевагу в соціальних перевірках проти істоти.',
    bullets: [
      'A charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects.',
      'The charmer has advantage on any ability check to interact socially with the creature.'
    ],
    bulletsUk: [
      'Зачарована істота не може атакувати того, хто її зачарував, або цілити в нього шкідливими здібностями/магією.',
      'Той, хто зачарував, має перевагу на будь-які перевірки характеристик для соціальної взаємодії з цією істотою.'
    ],
    tags: ['condition', 'social', 'mind'],
    source: '5e.tools / PHB p.290'
  },
  {
    id: 'cond_deafened',
    name: 'Deafened',
    nameUk: 'Оглухлий (Deafened)',
    category: 'condition',
    shortSummary: 'Cannot hear; automatically fails any ability check that requires hearing.',
    shortSummaryUk: 'Не чує; автоматично провалює перевірки на слух.',
    bullets: [
      'A deafened creature can’t hear and automatically fails any ability check that requires hearing.'
    ],
    bulletsUk: [
      'Оглухла істота нічого не чує і автоматично провалює будь-які перевірки, що вимагають слуху.'
    ],
    tags: ['condition', 'sensory'],
    source: '5e.tools / PHB p.290'
  },
  {
    id: 'cond_frightened',
    name: 'Frightened',
    nameUk: 'Зляканий (Frightened)',
    category: 'condition',
    shortSummary: 'Disadvantage on ability checks and attacks while source is in sight; cannot willingly move closer.',
    shortSummaryUk: 'Перешкода на атаки та перевірки поки джерело страху видно; не може добровільно наблизитись до нього.',
    bullets: [
      'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
      'The creature can’t willingly move closer to the source of its fear.'
    ],
    bulletsUk: [
      'Злякана істота має перешкоду на кидки атаки та перевірки характеристик, доки джерело її страху знаходиться в полі зору.',
      'Істота не може добровільно рухатися ближче до джерела свого страху.'
    ],
    tags: ['condition', 'fear', 'movement'],
    source: '5e.tools / PHB p.290'
  },
  {
    id: 'cond_grappled',
    name: 'Grappled',
    nameUk: 'Захоплений (Grappled)',
    category: 'condition',
    shortSummary: 'Speed 0; condition ends if grappler is incapacitated or moved away.',
    shortSummaryUk: 'Швидкість стає 0; стан знімається, якщо схопившого знерухомили або відкинули.',
    bullets: [
      'A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.',
      'The condition ends if the grappler is incapacitated.',
      'The condition ends if an effect removes the grappled creature from the reach of the grappler (e.g. Thunderwave).'
    ],
    bulletsUk: [
      'Швидкість захопленої істоти стає рівною 0, і вона не отримує користі від будь-яких бонусів до швидкості.',
      'Стан припиняється, якщо той, хто схопив, стає недієздатним (incapacitated).',
      'Стан припиняється, якщо ефект переміщує істоту за межі досяжності того, хто схопив (наприклад, поштовх або заклинання).'
    ],
    tags: ['condition', 'movement', 'athletics'],
    source: '5e.tools / PHB p.290'
  },
  {
    id: 'cond_incapacitated',
    name: 'Incapacitated',
    nameUk: 'Недієздатний (Incapacitated)',
    category: 'condition',
    shortSummary: 'Cannot take actions or reactions.',
    shortSummaryUk: 'Не може робити дії (Actions) та реакції (Reactions).',
    bullets: [
      'An incapacitated creature can’t take actions or reactions.',
      'Concentration on spells is immediately broken.'
    ],
    bulletsUk: [
      'Недієздатна істота не може здійснювати дії або реакції.',
      'Концентрація на заклинаннях миттєво зривається.'
    ],
    tags: ['condition', 'action economy'],
    source: '5e.tools / PHB p.290'
  },
  {
    id: 'cond_invisible',
    name: 'Invisible',
    nameUk: 'Невидимий (Invisible)',
    category: 'condition',
    shortSummary: 'Impossible to see without special senses; heavily obscured; attacks have advantage, attacks against have disadvantage.',
    shortSummaryUk: 'Неможливо побачити без спецзіру; атаки істоти мають перевагу, атаки по ній — перешкоду.',
    bullets: [
      'An invisible creature is impossible to see without the aid of magic or a special sense. Location can still be detected by noise/tracks.',
      'Attack rolls against the creature have disadvantage, and the creature’s attack rolls have advantage.'
    ],
    bulletsUk: [
      'Невидиму істоту неможливо побачити без магії чи спеціального чуття. Місцезнаходження все ще можна виявити за шумом чи слідами.',
      'Кидки атаки проти невидимої істоти здійснюються з перешкодою, а її власні кидки атаки — з перевагою.'
    ],
    tags: ['condition', 'stealth', 'magic'],
    source: '5e.tools / PHB p.291'
  },
  {
    id: 'cond_paralyzed',
    name: 'Paralyzed',
    nameUk: 'Паралізований (Paralyzed)',
    category: 'condition',
    shortSummary: 'Incapacitated, cannot move/speak; auto-fails Str/Dex saves; attacks against have advantage; melee attacks within 5ft are auto-crits.',
    shortSummaryUk: 'Недієздатний, не рухається; провал ряткидків СИЛ/СПР; атаки по істоті з перевагою; будь-яка атака в упор (5 фт) — автокрит!',
    bullets: [
      'A paralyzed creature is incapacitated and can’t move or speak.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.',
      'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.'
    ],
    bulletsUk: [
      'Паралізована істота недієздатна і не може рухатися або говорити.',
      'Істота автоматично провалює рятівні кидки за Силою та Спритністю.',
      'Кидки атаки проти істоти мають перевагу.',
      'Будь-яке влучання атакою по паралізованій істоті є критичним ударом (Critical Hit), якщо нападник знаходиться в межах 5 футів.'
    ],
    tags: ['condition', 'crit', 'combat'],
    source: '5e.tools / PHB p.291'
  },
  {
    id: 'cond_poisoned',
    name: 'Poisoned',
    nameUk: 'Отруєний (Poisoned)',
    category: 'condition',
    shortSummary: 'Disadvantage on attack rolls and ability checks.',
    shortSummaryUk: 'Перешкода (Disadvantage) на всі кидки атаки та перевірки характеристик.',
    bullets: [
      'A poisoned creature has disadvantage on attack rolls and ability checks.'
    ],
    bulletsUk: [
      'Отруєна істота здійснює всі кидки атаки та перевірки характеристик із перешкодою.'
    ],
    tags: ['condition', 'debuff'],
    source: '5e.tools / PHB p.292'
  },
  {
    id: 'cond_prone',
    name: 'Prone',
    nameUk: 'Збитий з ніг (Prone)',
    category: 'condition',
    shortSummary: 'Can only crawl (costs extra movement); standing costs half speed; disadvantage on own attacks; attacks within 5ft have advantage, ranged have disadvantage.',
    shortSummaryUk: 'Повзання; підйом коштує половину швидкості; атаки істоти з перешкодою; атаки по ній з 5 фт мають перевагу, а здалеку — перешкоду.',
    bullets: [
      'A prone creature’s only movement option is to crawl, unless it stands up (costs half its speed).',
      'The creature has disadvantage on attack rolls.',
      'An attack roll against the creature has advantage if the attacker is within 5 feet; otherwise, the attack roll has disadvantage.'
    ],
    bulletsUk: [
      'Єдиний спосіб руху лежачи — повзти (коштує вдвічі більше руху), доки істота не встане (коштує половину повної швидкості).',
      'Істота має перешкоду на власні кидки атаки.',
      'Кидок атаки проти істоти має перевагу, якщо нападник у межах 5 футів; якщо далі — нападник має перешкоду.'
    ],
    tags: ['condition', 'movement', 'tactics'],
    source: '5e.tools / PHB p.292'
  },
  {
    id: 'cond_restrained',
    name: 'Restrained',
    nameUk: 'Обплутаний (Restrained)',
    category: 'condition',
    shortSummary: 'Speed 0; disadvantage on own attacks and Dex saves; attacks against have advantage.',
    shortSummaryUk: 'Швидкість 0; перешкода на свої атаки та ряткидки СПР; атаки по істоті мають перевагу.',
    bullets: [
      'A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to speed.',
      'Attack rolls against the creature have advantage, and creature’s attacks have disadvantage.',
      'The creature has disadvantage on Dexterity saving throws.'
    ],
    bulletsUk: [
      'Швидкість стає 0 і не може бути збільшена.',
      'Атаки проти обплутаної істоти мають перевагу, а її власні атаки — перешкоду.',
      'Істота має перешкоду на рятівні кидки за Спритністю.'
    ],
    tags: ['condition', 'movement', 'debuff'],
    source: '5e.tools / PHB p.292'
  },
  {
    id: 'cond_stunned',
    name: 'Stunned',
    nameUk: 'Приголомшений (Stunned)',
    category: 'condition',
    shortSummary: 'Incapacitated, can only falter; auto-fails Str/Dex saves; attacks against have advantage.',
    shortSummaryUk: 'Недієздатний, ледве рухається і белькоче; провал ряткидків СИЛ/СПР; атаки по істоті мають перевагу.',
    bullets: [
      'A stunned creature is incapacitated, can’t move, and can speak only falteringly.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.'
    ],
    bulletsUk: [
      'Приголомшена істота недієздатна, не може рухатися і говорить лише нескладно.',
      'Автоматично провалює рятівні кидки Сили та Спритності.',
      'Кидки атаки проти неї здійснюються з перевагою.'
    ],
    tags: ['condition', 'control'],
    source: '5e.tools / PHB p.292'
  },
  {
    id: 'cond_unconscious',
    name: 'Unconscious',
    nameUk: 'Непритомний (Unconscious)',
    category: 'condition',
    shortSummary: 'Incapacitated, drops held items, falls prone; auto-fails Str/Dex saves; attacks have advantage; hits within 5ft are auto-crits.',
    shortSummaryUk: 'Недієздатний, кидає речі, падає ниць; провал СИЛ/СПР; атаки по ній з перевагою; влучання з 5 фт — автокрит!',
    bullets: [
      'An unconscious creature is incapacitated, can’t move or speak, and is unaware of its surroundings.',
      'Drops whatever it’s holding and falls prone.',
      'Automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against have advantage. Hits within 5 feet are automatic critical hits.'
    ],
    bulletsUk: [
      'Непритомна істота недієздатна, не може рухатися, говорити та не усвідомлює оточення.',
      'Випускає з рук усе, що тримала, і падає на землю (Prone).',
      'Автоматично провалює ряткидки за Силою та Спритністю.',
      'Атаки проти неї мають перевагу. Будь-яке влучання з 5 футів — автоматичний критичний удар.'
    ],
    tags: ['condition', 'hp 0', 'critical'],
    source: '5e.tools / PHB p.292'
  },

  // --- COMBAT ACTIONS ---
  {
    id: 'act_attack',
    name: 'Attack',
    nameUk: 'Атака (Attack)',
    category: 'action',
    shortSummary: 'Make one or more melee/ranged weapon attacks (depending on Extra Attack feature).',
    shortSummaryUk: 'Здійснити одну або декілька рукопашних/далекобійних атак зброєю.',
    bullets: [
      'Make one melee or ranged attack with a weapon or unarmed strike.',
      'Characters with Extra Attack can make multiple attacks as part of this single action.'
    ],
    bulletsUk: [
      'Здійснення однієї рукопашної чи далекобійної атаки зброєю або беззбройного удару.',
      'Персонажі з особливістю "Додаткова атака" (Extra Attack) можуть бити двічі чи більше в межах однієї дії.'
    ],
    tags: ['action', 'combat'],
    source: '5e.tools / PHB p.192'
  },
  {
    id: 'act_cast_spell',
    name: 'Cast a Spell',
    nameUk: 'Створення заклинання (Cast a Spell)',
    category: 'action',
    shortSummary: 'Cast a cantrip or leveled spell with a casting time of 1 Action.',
    shortSummaryUk: 'Накласти чари або замовляння з часом накладання 1 дія.',
    bullets: [
      'Follows spell components: Verbal (V), Somatic (S), Material (M).',
      'Bonus Action Spell Rule: If you cast a spell as a bonus action, you can only cast a cantrip with a casting time of 1 action on the same turn.'
    ],
    bulletsUk: [
      'Вимагає компонентів: Вербальний (V), Соматичний (S), Матеріальний (M).',
      'Правило бонусного заклинання: якщо ви чаклуєте заклинання бонусною дією, у цей же хід основною дією можна створити тільки замовляння (Cantrip) з часом 1 дія.'
    ],
    tags: ['action', 'magic', 'spells'],
    source: '5e.tools / PHB p.192'
  },
  {
    id: 'act_dash',
    name: 'Dash',
    nameUk: 'Ривок (Dash)',
    category: 'action',
    shortSummary: 'Gain extra movement for the current turn equal to your speed.',
    shortSummaryUk: 'Отримати додатковий рух на поточний хід, що дорівнює вашій швидкості.',
    bullets: [
      'Gives extra movement for the current turn equal to your speed (after applying any modifiers).',
      'With speed 30 ft, Dash allows moving 60 ft total.'
    ],
    bulletsUk: [
      'Дає додатковий рух на цей хід, рівний вашій поточній швидкості (з урахуванням модифікаторів).',
      'При швидкості 30 фт дія Ривок дозволяє переміститися на 60 фт за хід.'
    ],
    tags: ['action', 'movement'],
    source: '5e.tools / PHB p.192'
  },
  {
    id: 'act_disengage',
    name: 'Disengage',
    nameUk: 'Вихід з бою (Disengage)',
    category: 'action',
    shortSummary: 'Your movement does not provoke opportunity attacks for the rest of the turn.',
    shortSummaryUk: 'Ваше переміщення не провокує атак при нагоді (Opportunity Attacks) до кінця ходу.',
    bullets: [
      'Taking the Disengage action prevents all movement from provoking opportunity attacks until the end of your turn.'
    ],
    bulletsUk: [
      'Використання цієї дії дозволяє вільно пересуватися повз ворогів без провокування атак при нагоді до кінця вашого ходу.'
    ],
    tags: ['action', 'tactics', 'movement'],
    source: '5e.tools / PHB p.192'
  },
  {
    id: 'act_dodge',
    name: 'Dodge',
    nameUk: 'Ухилення (Dodge)',
    category: 'action',
    shortSummary: 'Attacks against you have disadvantage if you can see attacker; advantage on Dex saves.',
    shortSummaryUk: 'Атаки по вас мають перешкоду (якщо ви бачите нападника); перевага на ваші ряткидки СПР.',
    bullets: [
      'Until start of your next turn: any attack roll made against you has disadvantage if you can see the attacker.',
      'You make Dexterity saving throws with advantage.',
      'Benefit is lost if you are incapacitated or your speed drops to 0.'
    ],
    bulletsUk: [
      'До початку вашого наступного ходу всі кидки атаки проти вас мають перешкоду (якщо ви бачите ворога).',
      'Ви здійснюєте рятівні кидки за Спритністю з перевагою.',
      'Ефект втрачається, якщо ви стали недієздатними або швидкість стала 0.'
    ],
    tags: ['action', 'defense'],
    source: '5e.tools / PHB p.192'
  },
  {
    id: 'act_help',
    name: 'Help',
    nameUk: 'Допомога (Help)',
    category: 'action',
    shortSummary: 'Give advantage to an ally on an ability check or on their next attack roll within 5ft.',
    shortSummaryUk: 'Дати союзнику перевагу на перевірку навички або на наступну атаку по ворогу в межах 5 фт.',
    bullets: [
      'Give advantage to an ally on their next ability check before the start of your next turn.',
      'Feint / distract an enemy within 5 ft: your ally gains advantage on their next attack roll against that target.'
    ],
    bulletsUk: [
      'Надає союзнику перевагу на наступну перевірку характеристики до початку вашого наступного ходу.',
      'Відволікання ворога в межах 5 фт: союзник отримує перевагу на перший кидок атаки по цій цілі.'
    ],
    tags: ['action', 'teamwork'],
    source: '5e.tools / PHB p.192'
  },
  {
    id: 'act_hide',
    name: 'Hide',
    nameUk: 'Сховатися (Hide)',
    category: 'action',
    shortSummary: 'Make a Dexterity (Stealth) check to become unseen and unheard.',
    shortSummaryUk: 'Зробити перевірку Спритності (Потайність), щоб стати непомітним.',
    bullets: [
      'Requires being heavily obscured or behind total cover.',
      'Stealth roll is contested by passive perception of enemies.'
    ],
    bulletsUk: [
      'Вимагає наявності укриття або сильної затемненості (не можна ховатися просто перед очима ворога).',
      'Результат перевірки Спритності (Потайність) порівнюється з пасивною уважністю ворогів.'
    ],
    tags: ['action', 'stealth'],
    source: '5e.tools / PHB p.192'
  },
  {
    id: 'act_ready',
    name: 'Ready',
    nameUk: 'Підготовка дії (Ready)',
    category: 'action',
    shortSummary: 'Prepare an action triggered by a specific perceivable circumstance using your Reaction.',
    shortSummaryUk: 'Підготувати дію за певною умовою-тригером; спрацьовує за допомогою Реакції.',
    bullets: [
      'Specify the trigger and the action to take.',
      'Uses your Reaction when trigger occurs.',
      'Readying a spell requires casting it immediately and holding concentration until the trigger.'
    ],
    bulletsUk: [
      'Ви вказуєте чіткий тригер і дію, яку здійсните.',
      'Коли тригер спрацьовує, ви витрачаєте свою Реакцію (Reaction).',
      'Підготовка заклинання: ви витрачаєте чарунку одразу і підтримуєте концентрацію до моменту тригера.'
    ],
    tags: ['action', 'tactics', 'reaction'],
    source: '5e.tools / PHB p.193'
  },

  // --- RESTING & ENVIRONMENT ---
  {
    id: 'rule_short_rest',
    name: 'Short Rest',
    nameUk: 'Короткий відпочинок (Short Rest)',
    category: 'resting',
    shortSummary: 'At least 1 hour of downtime; spend Hit Dice + CON mod to regain HP; recovers specific class resources.',
    shortSummaryUk: 'Мінімум 1 година спокою; витрата Кісток Здоров’я (Hit Dice) + CON для лікування; відновлює окремі ресурси.',
    bullets: [
      'Period of downtime, at least 1 hour long, during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds.',
      'Spend 1 or more Hit Dice. For each die, roll it, add CON modifier, and regain that many hit points.',
      'Resets Warlock spell slots, Fighter Action Surge/Second Wind, Monk Ki points, Bardic Inspiration (Font of Insp.), etc.'
    ],
    bulletsUk: [
      'Період спокою щонайменше 1 годину (читання, їжа, перев’язування ран).',
      'Можна витратити одну або декілька Кісток Здоров’я (Hit Dice). За кожну кидається дайс + модифікатор Тілобудови (CON) для відновлення HP.',
      'Відновлює чарунки чаклуна, Вторий дихання/Сплеск дій воїна, очки Ці ченця тощо.'
    ],
    tags: ['resting', 'hp', 'recovery'],
    source: '5e.tools / PHB p.186'
  },
  {
    id: 'rule_long_rest',
    name: 'Long Rest',
    nameUk: 'Довгий відпочинок (Long Rest)',
    category: 'resting',
    shortSummary: '8 hours of rest (at least 6 hours sleep); restores all HP, resets all spell slots, recovers half total Hit Dice.',
    shortSummaryUk: '8 годин відпочинку (мінімум 6 сну); повне відновлення HP, усіх чарунок і половини Кісток Здоров’я.',
    bullets: [
      'Period of extended downtime, at least 8 hours long (6h sleep, 2h light activity).',
      'Regain all lost hit points and reset temporary hit points.',
      'Regain spent Hit Dice up to a number equal to half of the character’s total number of them (minimum of 1).',
      'Regains all expended spell slots and abilities.',
      'A character cannot benefit from more than one Long Rest in a 24-hour period.'
    ],
    bulletsUk: [
      'Період відпочинку щонайменше 8 годин (не менше 6 годин сну).',
      'Повністю відновлює всі втрачені хіти (HP) та очищує тимчасові HP.',
      'Відновлює витрачені Кістки Здоров’я до половини від їх максимальної кількості (мінімум 1).',
      'Відновлює всі слоти заклинань та щоденні ресурси.',
      'Можна отримати переваги Довгого відпочинку не частіше одного разу на 24 години.'
    ],
    tags: ['resting', 'hp', 'spells'],
    source: '5e.tools / PHB p.186'
  },
  {
    id: 'rule_cover',
    name: 'Cover Rules',
    nameUk: 'Правила укриття (Cover)',
    category: 'combat',
    shortSummary: 'Half Cover (+2 AC/Dex save), Three-Quarters Cover (+5 AC/Dex save), Total Cover (cannot be targeted directly).',
    shortSummaryUk: 'Половинне (+2 до КД/СПР), 3/4 укриття (+5 до КД/СПР), Повне укриття (неможливо напряму поцілити).',
    bullets: [
      'Half Cover: +2 bonus to AC and Dexterity saving throws (low wall, large furniture, another creature).',
      'Three-Quarters Cover: +5 bonus to AC and Dexterity saving throws (portcullis, arrow slit, thick tree trunk).',
      'Total Cover: A target with total cover can’t be targeted directly by an attack or a spell.'
    ],
    bulletsUk: [
      'Половинне укриття (Half): +2 до Класу Обладунку (AC) та рятівних кидків Спритності.',
      'Три чверті (3/4): +5 до AC та рятівних кидків Спритності.',
      'Повне укриття (Total): не може бути прямою ціллю атак або спрямованих заклинань.'
    ],
    tags: ['cover', 'ac', 'combat'],
    source: '5e.tools / PHB p.196'
  },

  // --- GLOSSARY TERMS ---
  {
    id: 'term_advantage',
    name: 'Advantage & Disadvantage',
    nameUk: 'Перевага та Перешкода (Advantage / Disadvantage)',
    category: 'glossary',
    shortSummary: 'Roll 2d20 and take higher (Advantage) or lower (Disadvantage). They cancel each other out.',
    shortSummaryUk: 'Кидається 2d20: береться вищий (Перевага) або нижчий (Перешкода). Вони взаємно анулюються.',
    bullets: [
      'Advantage: Roll two d20s and take the higher result.',
      'Disadvantage: Roll two d20s and take the lower result.',
      'If multiple circumstances grant advantage and disadvantage, they do not stack; they simply cancel each other out completely.'
    ],
    bulletsUk: [
      'Перевага: киньте 2d20 та оберіть більше число.',
      'Перешкода: киньте 2d20 та оберіть менше число.',
      'Якщо діє і перевага, і перешкода (навіть 5 переваг і 1 перешкода), вони взаємно компенсуються — робиться звичайний 1d20.'
    ],
    tags: ['glossary', 'd20', 'core'],
    source: '5e.tools / PHB p.173'
  },
  {
    id: 'term_concentration',
    name: 'Concentration',
    nameUk: 'Концентрація (Concentration)',
    category: 'magic',
    shortSummary: 'Hold 1 spell at a time; taking damage triggers CON save (DC 10 or half damage taken, whichever higher).',
    shortSummaryUk: 'Тільки 1 заклинання одночасно; при отриманні шкоди — ряткидок Тілобудови (Складність 10 або половина шкоди).',
    bullets: [
      'You can only concentrate on one spell at a time.',
      'Taking damage requires a Constitution saving throw to maintain concentration: DC = 10 or half the damage taken (whichever is higher).',
      'Being incapacitated or killed ends concentration immediately.'
    ],
    bulletsUk: [
      'Одночасно можна підтримувати концентрацію тільки на одному заклинанні.',
      'При отриманні шкоди робиться рятівний кидок Тілобудови (CON): складність = 10 або половина отриманої шкоди (що більше).',
      'Недієздатність (incapacitated) або смерть миттєво припиняють концентрацію.'
    ],
    tags: ['magic', 'spells', 'concentration'],
    source: '5e.tools / PHB p.203'
  },
  {
    id: 'term_attunement',
    name: 'Attunement',
    nameUk: 'Налаштування на предмети (Attunement)',
    category: 'glossary',
    shortSummary: 'Max 3 attuned magic items simultaneously; requires a short rest to attune.',
    shortSummaryUk: 'Максимум 3 магічні предмети з налаштуванням одночасно; потребує короткого відпочинку для прив’язки.',
    bullets: [
      'A creature can be attuned to no more than 3 magic items at a time.',
      'Attuning requires a short rest spent focused on the item.'
    ],
    bulletsUk: [
      'Персонаж може бути одночасно налаштований максимум на 3 магічні предмети.',
      'Процес налаштування вимагає короткого відпочинку в контакті з предметом.'
    ],
    tags: ['glossary', 'items', 'magic'],
    source: '5e.tools / DMG p.136'
  },
  {
    id: 'term_flurry',
    name: 'Flurry (Шквал ударів)',
    nameUk: 'Шквал ударів (Flurry)',
    category: 'glossary',
    shortSummary: 'Special rapid dual-wielding attack technique for Krysarii: deliver rapid strikes with Battleaxe & Warhammer.',
    shortSummaryUk: 'Особливий бойовий талант Крисарія: швидка нищівна серія ударів сокирою та молотом двома руками.',
    bullets: [
      'Allows executing fluid, rapid double-strikes when wielding Battleaxe and Warhammer simultaneously.',
      'Synergizes with Extra Attack and Action Surge to unleash a devastating barrage of slashing and bludgeoning damage.',
      'Enables maximizing pressure in close-quarters combat while alternating damage types against resistant foes.'
    ],
    bulletsUk: [
      'Дозволяє здійснювати блискавичні подвійні удари при одночасному володінні Бойовою сокирою (Battleaxe) та Бойовим молотом (Warhammer).',
      'Ідеально синергує з Додатковою атакою (Extra Attack) та Сплеском дій (Action Surge), наносячи комбіновану рублячу та дроблячу шкоду.',
      'Дозволяє гнучко адаптувати тип шкоди залежно від стійкостей та вразливостей супротивника в ближньому бою.'
    ],
    tags: ['glossary', 'flurry', 'combat', 'krysarii', 'talent'],
    source: 'Krysarii Custom Mechanics / 5e.tools'
  }
];
