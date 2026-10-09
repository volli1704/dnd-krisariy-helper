export interface ClassFeature {
  id: string;
  name: string;
  nameUk: string;
  level: number;
  source: string;
  actionType: 'action' | 'bonus' | 'reaction' | 'passive' | 'special';
  resetOn?: 'shortRest' | 'longRest' | 'none';
  summaryUk: string;
  descriptionUk: string;
  descriptionEn: string;
  isFavorite?: boolean;
  hasResource?: boolean;
  resourceMax?: number;
  resourceCurrent?: number;
}

export const FIGHTER_CLASS_FEATURES: ClassFeature[] = [
  {
    id: 'ft_fighting_style',
    name: 'Fighting Style',
    nameUk: 'Бойовий стиль (Fighting Style)',
    level: 1,
    source: 'Fighter 1 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Спеціалізація на певному стилі бою (Archery, Defense, Dueling, Great Weapon, Blind Fighting тощо).',
    descriptionUk: 'Ви обираєте один бойовий стиль як свою спеціалізацію:\n• Оборона (Defense): +1 до КД у будь-яких обладунках.\n• Дуелянт (Dueling): +2 до шкоди з одноручною зброєю.\n• Бій великою зброєю (Great Weapon): перекидання 1 та 2 на кістках шкоди дворучної зброї.\n• Стрільба (Archery): +2 до кидків атаки далекобійною зброєю.\n• Бій наосліп (Blind Fighting): сліпий зір (Blindsight) на 10 фт.\n• Перехоплення (Interception): реакцією зменшити шкоду по союзнику на 1d10 + PB.',
    descriptionEn: 'You adopt a particular style of fighting as your specialty (Archery, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting, Blind Fighting, Interception, etc.).'
  },
  {
    id: 'ft_second_wind',
    name: 'Second Wind',
    nameUk: 'Другий подих (Second Wind)',
    level: 1,
    source: 'Fighter 1 (PHB p.72)',
    actionType: 'bonus',
    resetOn: 'shortRest',
    summaryUk: 'Бонусна дія: відновити 1d10 + рівень воїна хітів. 1 використання на короткий/довгий відпочинок.',
    descriptionUk: 'У вас є обмежене джерело витривалості, з якого ви можете черпати сили, щоб захистити себе від шкоди. У свій хід ви можете використати бонусну дію (Bonus Action), щоб відновити кількість хітів, що дорівнює 1d10 + ваш рівень воїна.\n\nПісля використання цієї особливості ви повинні завершити короткий або довгий відпочинок, щоб використати її знову.',
    descriptionEn: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
    isFavorite: true,
    hasResource: true,
    resourceMax: 1,
    resourceCurrent: 1
  },
  {
    id: 'ft_action_surge',
    name: 'Action Surge',
    nameUk: 'Сплеск дій (Action Surge)',
    level: 2,
    source: 'Fighter 2 (PHB p.72)',
    actionType: 'special',
    resetOn: 'shortRest',
    summaryUk: 'Зробити одну додаткову дію (Action) у свій хід на додаток до звичайної.',
    descriptionUk: 'Ви можете вийти за межі звичайних можливостей на коротку мить. У свій хід ви можете здійснити одну додаткову дію (Action) на додаток до своєї звичайної дії та можливої бонусної дії.\n\nПісля використання цієї особливості ви повинні завершити короткий або довгий відпочинок, щоб використати її знову. Починаючи з 17-го рівня, ви можете використовувати цю особливість двічі між відпочинками, але не більше одного разу за один хід.',
    descriptionEn: 'You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action. Once used, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest.',
    isFavorite: true,
    hasResource: true,
    resourceMax: 1,
    resourceCurrent: 1
  },
  {
    id: 'ft_martial_archetype_unlock',
    name: 'Martial Archetype (Psi Warrior)',
    nameUk: 'Військовий архетип (Psi Warrior)',
    level: 3,
    source: 'Fighter 3 (TCoE p.42)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Вибір архетипу Psi Warrior. Навчання псіонічним силам розуму та телекінезу.',
    descriptionUk: 'На 3-му рівні ви обираєте архетип Psi Warrior, доповнюючи свої фізичні тренування силою власного розуму.',
    descriptionEn: 'At 3rd level, you choose an archetype that you emulate in your combat styles and abilities: Psi Warrior.'
  },
  {
    id: 'ft_asi_4',
    name: 'Ability Score Improvement (Feat)',
    nameUk: 'Збільшення характеристик / Риса (ASI)',
    level: 4,
    source: 'Fighter 4 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Збільшити одну характеристику на +2, дві на +1 або взяти рису (Feat).',
    descriptionUk: 'Ви можете збільшити значення однієї характеристики на ваш вибір на 2, або значення двох характеристик на ваш вибір на 1 (максимум 20). Або обрати рису (Feat).',
    descriptionEn: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1 (max 20), or take a feat.'
  },
  {
    id: 'ft_extra_attack_1',
    name: 'Extra Attack',
    nameUk: 'Додаткова атака (Extra Attack)',
    level: 5,
    source: 'Fighter 5 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Ви можете атакувати двічі (2 attacks) замість одного разу, коли обираєте дію Атака.',
    descriptionUk: 'Починаючи з 5-го рівня, ви можете атакувати двічі, замість одного разу, щоразу, коли ви здійснюєте дію Атака (Attack Action) у свій хід.',
    descriptionEn: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
    isFavorite: true
  },
  {
    id: 'ft_asi_6',
    name: 'Ability Score Improvement (Feat)',
    nameUk: 'Збільшення характеристик / Риса (ASI)',
    level: 6,
    source: 'Fighter 6 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Додаткове збільшення характеристик на 6 рівні воїна (+2 до однієї або +1/+1 або Feat).',
    descriptionUk: 'На 6-му рівні ви отримуєте додаткове покращення характеристик (+2 / +1+1) або рису.',
    descriptionEn: 'At 6th level, you can increase one ability score of your choice by 2, or two ability scores by 1, or take a feat.'
  },
  {
    id: 'ft_asi_8',
    name: 'Ability Score Improvement (Feat)',
    nameUk: 'Збільшення характеристик / Риса (ASI)',
    level: 8,
    source: 'Fighter 8 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Збільшення характеристик або риса на 8 рівні.',
    descriptionUk: 'Ви можете збільшити значення характеристики на 2 або двох на 1, або взяти рису.',
    descriptionEn: 'At 8th level, you can increase one ability score by 2, or two by 1, or take a feat.'
  },
  {
    id: 'ft_indomitable_1',
    name: 'Indomitable',
    nameUk: 'Непохитний (Indomitable)',
    level: 9,
    source: 'Fighter 9 (PHB p.72)',
    actionType: 'special',
    resetOn: 'longRest',
    summaryUk: 'Перекидання проваленого рятівного кидка. 1 використання (на 13 рівні: 2, на 17: 3).',
    descriptionUk: 'Починаючи з 9-го рівня, ви можете перекинути рятівний кидок, який ви провалили. Якщо ви це робите, ви зобов’язані використати новий результат.\n\nВи повинні завершити довгий відпочинок, перш ніж зможете використати цю особливість знову. Ви можете використовувати її двічі на 13-му рівні та тричі на 17-му рівні між довгими відпочинками.',
    descriptionEn: 'Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you cannot use this feature again until you finish a long rest. You can use this feature twice between long rests starting at 13th level and three times starting at 17th level.',
    hasResource: true,
    resourceMax: 1,
    resourceCurrent: 1
  },
  {
    id: 'ft_extra_attack_2',
    name: 'Extra Attack (2)',
    nameUk: 'Додаткова атака (3 атаки)',
    level: 11,
    source: 'Fighter 11 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Ви можете атакувати 3 рази в дії Атака.',
    descriptionUk: 'На 11-му рівні кількість атак у дії Атака зростає до трьох.',
    descriptionEn: 'At 11th level, the number of attacks you make when taking the Attack action increases to three.'
  },
  {
    id: 'ft_asi_12',
    name: 'Ability Score Improvement (Feat)',
    nameUk: 'Збільшення характеристик / Риса (ASI)',
    level: 12,
    source: 'Fighter 12 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Збільшення характеристик або риса на 12 рівні.',
    descriptionUk: 'Збільшення характеристик або риса.',
    descriptionEn: 'At 12th level, ability score improvement or feat.'
  },
  {
    id: 'ft_indomitable_2',
    name: 'Indomitable (2 uses)',
    nameUk: 'Непохитний (2 використання)',
    level: 13,
    source: 'Fighter 13 (PHB p.72)',
    actionType: 'special',
    resetOn: 'longRest',
    summaryUk: '2 перекидання рятівних кидків на довгий відпочинок.',
    descriptionUk: 'Тепер ви можете використовувати особливість Непохитний (Indomitable) двічі на довгий відпочинок.',
    descriptionEn: 'You can use Indomitable twice between long rests.'
  },
  {
    id: 'ft_asi_14',
    name: 'Ability Score Improvement (Feat)',
    nameUk: 'Збільшення характеристик / Риса (ASI)',
    level: 14,
    source: 'Fighter 14 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Збільшення характеристик або риса на 14 рівні.',
    descriptionUk: 'Збільшення характеристик або риса.',
    descriptionEn: 'At 14th level, ability score improvement or feat.'
  },
  {
    id: 'ft_asi_16',
    name: 'Ability Score Improvement (Feat)',
    nameUk: 'Збільшення характеристик / Риса (ASI)',
    level: 16,
    source: 'Fighter 16 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Збільшення характеристик або риса на 16 рівні.',
    descriptionUk: 'Збільшення характеристик або риса.',
    descriptionEn: 'At 16th level, ability score improvement or feat.'
  },
  {
    id: 'ft_action_surge_2',
    name: 'Action Surge (2 uses)',
    nameUk: 'Сплеск дій (2 використання)',
    level: 17,
    source: 'Fighter 17 (PHB p.72)',
    actionType: 'special',
    resetOn: 'shortRest',
    summaryUk: '2 сплески дій на короткий/довгий відпочинок (не більше 1 за хід).',
    descriptionUk: 'На 17-му рівні ви можете використовувати Сплеск дій (Action Surge) двічі між відпочинками.',
    descriptionEn: 'At 17th level, you can use Action Surge twice before finishing a short or long rest.'
  },
  {
    id: 'ft_indomitable_3',
    name: 'Indomitable (3 uses)',
    nameUk: 'Непохитний (3 використання)',
    level: 17,
    source: 'Fighter 17 (PHB p.72)',
    actionType: 'special',
    resetOn: 'longRest',
    summaryUk: '3 перекидання рятівних кидків на довгий відпочинок.',
    descriptionUk: 'Тепер ви можете використовувати Непохитний тричі між довгими відпочинками.',
    descriptionEn: 'You can use Indomitable three times between long rests.'
  },
  {
    id: 'ft_asi_19',
    name: 'Ability Score Improvement (Feat)',
    nameUk: 'Збільшення характеристик / Риса (ASI)',
    level: 19,
    source: 'Fighter 19 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Збільшення характеристик або риса на 19 рівні.',
    descriptionUk: 'Збільшення характеристик або риса.',
    descriptionEn: 'At 19th level, ability score improvement or feat.'
  },
  {
    id: 'ft_extra_attack_3',
    name: 'Extra Attack (3)',
    nameUk: 'Додаткова атака (4 атаки)',
    level: 20,
    source: 'Fighter 20 (PHB p.72)',
    actionType: 'passive',
    resetOn: 'none',
    summaryUk: 'Вершина майстерності воїна: 4 атаки під час кожної дії Атака!',
    descriptionUk: 'На 20-му рівні ви можете здійснювати чотири атаки щоразу, коли обираєте дію Атака у свій хід.',
    descriptionEn: 'At 20th level, you can make four attacks whenever you take the Attack action on your turn.',
    isFavorite: true
  }
];
