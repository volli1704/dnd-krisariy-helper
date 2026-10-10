import type { Character } from '../types/character';

export const DEFAULT_CHARACTER: Character = {
  id: 'char_krysarii_01',
  name: 'Крисарій (Krysarii)',
  class: 'Воїн (Fighter)',
  subclass: 'Псі-Воїн (Psi Warrior)',
  level: 8,
  race: 'Людина (Human)',
  background: 'Найманець / Мандрівник (Mercenary)',
  alignment: 'Нейтральний (N)',
  experience: 34000,

  hp: {
    current: 85,
    max: 85,
    temp: 0
  },
  armorClass: 15, // Chain Shirt (13 + Dex +2) or dual wielder bonus
  initiativeBonus: 2,
  speed: 30,
  proficiencyBonus: 3, // Level 8 PB = +3
  hitDice: {
    current: 8,
    total: 8,
    dieType: 'd10'
  },
  deathSaves: {
    successes: 0,
    failures: 0
  },

  abilities: {
    STR: { name: 'STR', fullName: 'Strength', fullNameUk: 'Сила', score: 18, proficientSave: true },
    DEX: { name: 'DEX', fullName: 'Dexterity', fullNameUk: 'Спритність', score: 14, proficientSave: false },
    CON: { name: 'CON', fullName: 'Constitution', fullNameUk: 'Тілобудова', score: 16, proficientSave: true },
    INT: { name: 'INT', fullName: 'Intelligence', fullNameUk: 'Інтелект (Psi)', score: 16, proficientSave: false },
    WIS: { name: 'WIS', fullName: 'Wisdom', fullNameUk: 'Мудрість', score: 12, proficientSave: false },
    CHA: { name: 'CHA', fullName: 'Charisma', fullNameUk: 'Харизма', score: 10, proficientSave: false }
  },

  skills: [
    { id: 'acrobatics', name: 'Acrobatics', nameUk: 'Акробатика', ability: 'DEX', proficiencyLevel: 'none' },
    { id: 'animal_handling', name: 'Animal Handling', nameUk: 'Поводження з тваринами', ability: 'WIS', proficiencyLevel: 'none' },
    { id: 'arcana', name: 'Arcana', nameUk: 'Магія (Arcana)', ability: 'INT', proficiencyLevel: 'proficient' },
    { id: 'athletics', name: 'Athletics', nameUk: 'Атлетика', ability: 'STR', proficiencyLevel: 'proficient' },
    { id: 'deception', name: 'Deception', nameUk: 'Обман', ability: 'CHA', proficiencyLevel: 'none' },
    { id: 'history', name: 'History', nameUk: 'Історія', ability: 'INT', proficiencyLevel: 'none' },
    { id: 'insight', name: 'Insight', nameUk: 'Проникливість', ability: 'WIS', proficiencyLevel: 'none' },
    { id: 'intimidation', name: 'Intimidation', nameUk: 'Залякування', ability: 'CHA', proficiencyLevel: 'proficient' },
    { id: 'investigation', name: 'Investigation', nameUk: 'Розслідування', ability: 'INT', proficiencyLevel: 'proficient' },
    { id: 'medicine', name: 'Medicine', nameUk: 'Медицина', ability: 'WIS', proficiencyLevel: 'none' },
    { id: 'nature', name: 'Nature', nameUk: 'Природа', ability: 'INT', proficiencyLevel: 'none' },
    { id: 'perception', name: 'Perception', nameUk: 'Уважність', ability: 'WIS', proficiencyLevel: 'proficient' },
    { id: 'performance', name: 'Performance', nameUk: 'Виступ (Флейта)', ability: 'CHA', proficiencyLevel: 'proficient' },
    { id: 'persuasion', name: 'Persuasion', nameUk: 'Переконання', ability: 'CHA', proficiencyLevel: 'none' },
    { id: 'religion', name: 'Religion', nameUk: 'Релігія', ability: 'INT', proficiencyLevel: 'none' },
    { id: 'sleight_of_hand', name: 'Sleight of Hand', nameUk: 'Спритність рук', ability: 'DEX', proficiencyLevel: 'none' },
    { id: 'stealth', name: 'Stealth', nameUk: 'Потайність', ability: 'DEX', proficiencyLevel: 'none' },
    { id: 'survival', name: 'Survival', nameUk: 'Виживання', ability: 'WIS', proficiencyLevel: 'proficient' }
  ],

  specialMechanicName: 'Псіонічні сили (Psi Warrior Mechanics)',
  specialMechanicDescription: 'Особлива псіонічна енергія та шквал ударів (Flurry).',
  specialResources: [
    {
      id: 'res_second_wind',
      name: 'Другий подих (Second Wind)',
      description: 'Бонусна дія: відновити 1d10 + 8 хітів.',
      current: 1,
      max: 1,
      resetOn: 'shortRest',
      color: '#10b981'
    },
    {
      id: 'res_action_surge',
      name: 'Сплеск дій (Action Surge)',
      description: 'Зробити одну додаткову дію (Action) у свій хід.',
      current: 1,
      max: 1,
      resetOn: 'shortRest',
      color: '#f59e0b'
    }
  ],

  specialMechanics: [
    {
      id: 'mech_flurry',
      title: 'Шквал ударів (Flurry)',
      description: 'Особливий бойовий бонус на здійснення серії швидких нищівних ударів двома зброями (Battleaxe + Warhammer).',
      type: 'active',
      active: true,
      effectSummary: 'Швидкі подвійні атаки'
    }
  ],

  attacks: [
    {
      id: 'atk_battleaxe',
      name: 'Бойова сокира (Battleaxe) — Головна рука',
      type: 'melee',
      toHitBonus: 7, // +4 STR, +3 PB
      damage: '1d8 + 4',
      damageType: 'Рубляча (Slashing)',
      range: '5 фт',
      notes: 'Універсальна (1d8/1d10). Бій двома зброями.'
    },
    {
      id: 'atk_warhammer',
      name: 'Бойовий молот (Warhammer) — Друга рука',
      type: 'melee',
      toHitBonus: 7, // +4 STR, +3 PB
      damage: '1d8 + 4',
      damageType: 'Дробляча (Bludgeoning)',
      range: '5 фт',
      notes: 'Універсальна (1d8/1d10). Бій двома зброями.'
    }
  ],

  spellcastingAbility: 'INT',
  spellSaveDC: 14, // 8 + 3 PB + 3 INT
  spellAttackBonus: 6,
  spellSlots: {},
  spells: [],

  activeConditions: [],
  favoriteFeatureIds: ['ft_flurry', 'ft_second_wind', 'ft_action_surge', 'ft_extra_attack_1'],

  inventory: [
    {
      id: 'item_1',
      name: 'Бойова сокира (Battleaxe)',
      category: 'weapon',
      quantity: 1,
      weight: 4,
      cost: '10 gp',
      rarity: 'common',
      equipped: true,
      description: 'Гостра бойова сокира в правій руці.',
      properties: ['Versatile (1d8/1d10)']
    },
    {
      id: 'item_2',
      name: 'Бойовий молот (Warhammer)',
      category: 'weapon',
      quantity: 1,
      weight: 2,
      cost: '15 gp',
      rarity: 'common',
      equipped: true,
      description: 'Важкий бойовий молот у лівій руці.',
      properties: ['Versatile (1d8/1d10)']
    },
    {
      id: 'item_3',
      name: 'Кольчужна сорочка (Medium Chain Shirt)',
      category: 'armor',
      quantity: 1,
      weight: 20,
      cost: '50 gp',
      rarity: 'common',
      equipped: true,
      description: 'Середній обладунок: 13 + мод. Спритності (макс. +2). Не дає перешкоди на потайність.',
      properties: ['Medium Armor', 'AC 13+Dex(max 2)']
    },
    {
      id: 'item_4',
      name: 'Особливі піхви з тримачем для факела (Scabbard with Torch mount)',
      category: 'adventuring',
      quantity: 1,
      weight: 2,
      rarity: 'common',
      equipped: true,
      description: 'Кастомні надійні ножни/піхви з спеціальним кріпленням, куди можна вставити запалений або запасний факел.',
      properties: ['Special Mount']
    },
    {
      id: 'item_5',
      name: 'Набір для розпалювання вогню (Firekit / Tinderbox)',
      category: 'adventuring',
      quantity: 1,
      weight: 1,
      cost: '5 sp',
      rarity: 'common',
      description: 'Трутниця, кресало та кремінь для швидкого розведення вогню.',
      properties: ['Tool']
    },
    {
      id: 'item_6',
      name: 'Прядивна мотузка (Rope, 50 ft)',
      category: 'adventuring',
      quantity: 1,
      weight: 10,
      cost: '1 gp',
      rarity: 'common',
      description: 'Міцна 50-футова мотузка (15 метрів).',
      properties: ['Adventuring Gear']
    },
    {
      id: 'item_7',
      name: 'Флейта (Flute)',
      category: 'adventuring',
      quantity: 1,
      weight: 1,
      cost: '2 gp',
      rarity: 'common',
      description: 'Музичний інструмент з тонким виразним звучанням.',
      properties: ['Musical Instrument']
    },
    {
      id: 'item_8',
      name: 'Мисливський капкан (Hunting Trap)',
      category: 'adventuring',
      quantity: 1,
      weight: 25,
      cost: '5 gp',
      rarity: 'common',
      description: 'Затискає ногу істоти (DC 13 DEX save), завдає 1d4 колючої шкоди та знерухомлює до перевірки DC 13 STR.',
      properties: ['Trap']
    },
    {
      id: 'item_9',
      name: 'Факел (Torch)',
      category: 'adventuring',
      quantity: 3,
      weight: 1,
      cost: '1 cp',
      rarity: 'common',
      description: 'Горить 1 годину, освітлює яскравим світлом на 20 фт і тьмяним ще на 20 фт.',
      properties: ['Light Source']
    }
  ],

  currency: {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 30,
    pp: 0
  },

  proficiencies: {
    armor: ['Усі обладунки (All Armor)', 'Щити (Shields)'],
    weapons: ['Проста зброя (Simple Weapons)', 'Військова зброя (Martial Weapons)'],
    tools: ['Флейта (Flute)', 'Набір гравця в кості'],
    savingThrows: ['Strength (Сила)', 'Constitution (Тілобудова)']
  },
  languages: ['Загальна (Common)', 'Гном’яча (Gnomish)'],
  senses: {
    passivePerception: 14,
    passiveInvestigation: 16,
    passiveInsight: 11,
    darkvision: 0
  },
  notes: 'Крисарій — 8-й рівень, Псі-воїн людина. Володіє шквалом ударів (Flurry), носить бойову сокиру та молот в обох руках.',
  notesList: [
    {
      id: 'note_1',
      title: 'Передісторія та клятва найманця',
      content: 'Крисарій — загартований у боях воїн, що пробудив у собі силу псіоніки. Його мета — знайти сліди зниклого загону та розкрити таємницю кристалів пам’яті.',
      category: 'general',
      createdAt: 1773120000000,
      isPinned: true
    },
    {
      id: 'note_2',
      title: 'Чутки: Північні катакомби',
      content: 'Трактирник згадував, що в старих катакомбах під містом чути гуркіт магічних механізмів. Можливо, там заховано древній артефакт.',
      category: 'quest',
      createdAt: 1773206400000,
      isPinned: false
    }
  ]
};



