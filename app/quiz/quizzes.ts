// 心理測驗資料（內容為原創，僅供娛樂）

export type Option = { text: string; type?: string; score?: number };
export type Question = { q: string; options: Option[] };
export type Result = {
  key: string; // type 模式：對應選項的 type；score 模式：用 min/max 判斷
  min?: number;
  max?: number;
  emoji: string;
  title: string;
  description: string;
  traits: string[];
  advice: string;
};

export type Quiz = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  soft: string;
  mode: "type" | "score";
  questions: Question[];
  results: Result[];
};

export const QUIZZES: Quiz[] = [
  {
    id: "animal",
    emoji: "🐾",
    title: "你是哪一種動物性格？",
    subtitle: "從日常小選擇，看出你內心住著哪隻動物",
    color: "#e5642a",
    soft: "#fde8d6",
    mode: "type",
    questions: [
      {
        q: "週末最理想的安排是？",
        options: [
          { text: "在家耍廢追劇", type: "cat" },
          { text: "約朋友出去玩", type: "dog" },
          { text: "去書店或看展", type: "owl" },
          { text: "去海邊或戶外運動", type: "dolphin" },
        ],
      },
      {
        q: "朋友找你訴苦，你通常會？",
        options: [
          { text: "安靜陪著，不多說什麼", type: "cat" },
          { text: "熱情安慰，給個擁抱", type: "dog" },
          { text: "幫他分析問題、找出解法", type: "owl" },
          { text: "帶他去做點開心的事轉換心情", type: "dolphin" },
        ],
      },
      {
        q: "走進一個全是陌生人的派對，你會？",
        options: [
          { text: "找個角落觀察大家", type: "cat" },
          { text: "主動跟人打招呼", type: "dog" },
          { text: "找一兩個聊得來的人深聊", type: "owl" },
          { text: "哪裡熱鬧就往哪裡去", type: "dolphin" },
        ],
      },
      {
        q: "計畫突然改變時，你的反應是？",
        options: [
          { text: "有點不爽，但會自己默默調整", type: "cat" },
          { text: "沒關係，大家開心就好", type: "dog" },
          { text: "先想想新的安排合不合理", type: "owl" },
          { text: "太好了，有新鮮事！", type: "dolphin" },
        ],
      },
      {
        q: "你最喜歡一天中的哪個時段？",
        options: [
          { text: "午後慵懶的陽光", type: "cat" },
          { text: "熱鬧的晚餐時間", type: "dog" },
          { text: "安靜的深夜", type: "owl" },
          { text: "清爽的早晨", type: "dolphin" },
        ],
      },
      {
        q: "別人最常怎麼形容你？",
        options: [
          { text: "有點酷、很有個性", type: "cat" },
          { text: "溫暖、很好相處", type: "dog" },
          { text: "聰明、想得很多", type: "owl" },
          { text: "活潑、充滿能量", type: "dolphin" },
        ],
      },
    ],
    results: [
      {
        key: "cat",
        emoji: "🐱",
        title: "獨立優雅的貓",
        description: "你重視自己的步調與空間，不輕易隨波逐流。看似冷淡，其實對在乎的人非常細膩，只是習慣用自己的方式表達關心。",
        traits: ["獨立", "有主見", "觀察力敏銳"],
        advice: "偶爾主動說出你的感受，身邊的人會更懂你。",
      },
      {
        key: "dog",
        emoji: "🐶",
        title: "溫暖忠誠的狗",
        description: "你熱情真誠，是朋友圈裡的開心果和最可靠的後盾。你總是願意付出，讓身邊的人感到被重視。",
        traits: ["熱情", "重感情", "值得信賴"],
        advice: "照顧別人的同時，也記得留點時間照顧自己。",
      },
      {
        key: "owl",
        emoji: "🦉",
        title: "睿智沉穩的貓頭鷹",
        description: "你思考縝密、喜歡探究事物的本質。遇到問題時總能冷靜分析，是大家遇到難題時第一個想到的人。",
        traits: ["理性", "好奇心強", "沉穩"],
        advice: "不必每件事都想透再行動，有時跟著直覺走也很好。",
      },
      {
        key: "dolphin",
        emoji: "🐬",
        title: "聰明活潑的海豚",
        description: "你充滿好奇心與行動力，喜歡新鮮感，也很會帶動氣氛。你的樂觀常常感染身邊的每一個人。",
        traits: ["樂觀", "適應力強", "行動派"],
        advice: "熱情之外，試著把一件事堅持到底，會收穫更多成就感。",
      },
    ],
  },
  {
    id: "stress",
    emoji: "🌡️",
    title: "你的壓力指數有多高？",
    subtitle: "檢查一下最近的身心狀態，給自己一點關心",
    color: "#5b8fb9",
    soft: "#dceaf5",
    mode: "score",
    questions: [
      {
        q: "最近的睡眠狀況如何？",
        options: [
          { text: "一覺到天亮", score: 0 },
          { text: "偶爾睡不太好", score: 1 },
          { text: "常常翻來覆去", score: 2 },
          { text: "幾乎每天都失眠", score: 3 },
        ],
      },
      {
        q: "早上醒來的第一個念頭是？",
        options: [
          { text: "新的一天，不錯！", score: 0 },
          { text: "再睡五分鐘就好…", score: 1 },
          { text: "今天好多事要做", score: 2 },
          { text: "好不想面對今天", score: 3 },
        ],
      },
      {
        q: "最近多常覺得煩躁？",
        options: [
          { text: "很少", score: 0 },
          { text: "偶爾", score: 1 },
          { text: "常常", score: 2 },
          { text: "幾乎每天", score: 3 },
        ],
      },
      {
        q: "有空閒時間時，你會？",
        options: [
          { text: "好好放鬆享受", score: 0 },
          { text: "放鬆但有點罪惡感", score: 1 },
          { text: "忍不住想到工作或課業", score: 2 },
          { text: "根本沒有空閒時間", score: 3 },
        ],
      },
      {
        q: "最近的胃口如何？",
        options: [
          { text: "跟平常一樣", score: 0 },
          { text: "稍微變好或變差", score: 1 },
          { text: "常常暴飲暴食或吃不下", score: 2 },
          { text: "完全沒心思注意吃什麼", score: 3 },
        ],
      },
      {
        q: "想到下週的行程，你覺得？",
        options: [
          { text: "很期待", score: 0 },
          { text: "還好", score: 1 },
          { text: "有點焦慮", score: 2 },
          { text: "想直接逃走", score: 3 },
        ],
      },
    ],
    results: [
      {
        key: "low",
        min: 0,
        max: 4,
        emoji: "🌿",
        title: "輕鬆自在・低壓力",
        description: "你的身心狀態很穩定，懂得在生活中找到平衡。繼續保持現在的節奏，好好享受每一天。",
        traits: ["心情穩定", "作息規律", "懂得放鬆"],
        advice: "把讓你放鬆的小習慣記下來，忙碌時就能派上用場。",
      },
      {
        key: "mild",
        min: 5,
        max: 9,
        emoji: "☁️",
        title: "有點累了・輕度壓力",
        description: "生活中有些小壓力在累積，但大致還在可控範圍。適時休息一下，別讓小事堆成大事。",
        traits: ["偶爾疲憊", "事情有點多", "還撐得住"],
        advice: "每天留 15 分鐘給自己，散步、聽音樂或發呆都好。",
      },
      {
        key: "medium",
        min: 10,
        max: 13,
        emoji: "🌧️",
        title: "需要喘口氣・中度壓力",
        description: "最近的壓力已經影響到你的睡眠和心情了。你一直很努力，現在是時候放慢腳步、好好照顧自己。",
        traits: ["容易緊繃", "睡不太好", "心累"],
        advice: "試著把待辦事項分成小步驟，也找信任的人聊聊。",
      },
      {
        key: "high",
        min: 14,
        max: 18,
        emoji: "⛈️",
        title: "警報響起・高壓力",
        description: "你承受了很多，身體和心理都在發出訊號。請記得，休息不是偷懶，而是為了走更長的路。",
        traits: ["長期緊繃", "身心俱疲", "需要支持"],
        advice: "請優先安排休息；若這種感覺持續很久，建議找專業人士聊聊。",
      },
    ],
  },
  {
    id: "love",
    emoji: "💌",
    title: "你的戀愛類型是？",
    subtitle: "看看你在感情裡最在乎的是什麼",
    color: "#e0607e",
    soft: "#fce1e7",
    mode: "type",
    questions: [
      {
        q: "你心中理想的約會是？",
        options: [
          { text: "燭光晚餐配夜景", type: "romantic" },
          { text: "在家一起煮飯", type: "guardian" },
          { text: "說走就走的小旅行", type: "free" },
          { text: "一起去看有興趣的展覽", type: "rational" },
        ],
      },
      {
        q: "對方忘記了紀念日，你會？",
        options: [
          { text: "有點受傷，希望對方記得", type: "romantic" },
          { text: "沒關係，下次我來提醒", type: "guardian" },
          { text: "不在意，每天都可以是紀念日", type: "free" },
          { text: "跟他討論以後怎麼避免", type: "rational" },
        ],
      },
      {
        q: "吵架之後，你通常會？",
        options: [
          { text: "需要對方哄一下", type: "romantic" },
          { text: "先主動和好", type: "guardian" },
          { text: "各自冷靜，過了就算了", type: "free" },
          { text: "把問題講清楚才甘心", type: "rational" },
        ],
      },
      {
        q: "哪一句話最能打動你？",
        options: [
          { text: "「我好想你」", type: "romantic" },
          { text: "「有我在」", type: "guardian" },
          { text: "「做你自己就好」", type: "free" },
          { text: "「我懂你的意思」", type: "rational" },
        ],
      },
      {
        q: "你覺得感情中最重要的是？",
        options: [
          { text: "浪漫與心動", type: "romantic" },
          { text: "陪伴與照顧", type: "guardian" },
          { text: "信任與空間", type: "free" },
          { text: "溝通與共識", type: "rational" },
        ],
      },
    ],
    results: [
      {
        key: "romantic",
        emoji: "💘",
        title: "浪漫派",
        description: "你相信愛情裡的心動與儀式感，願意為對方準備驚喜，也期待被同樣用心地對待。",
        traits: ["感性", "重視儀式感", "全心投入"],
        advice: "把期待說出口，對方才知道怎麼讓你開心。",
      },
      {
        key: "guardian",
        emoji: "🛡️",
        title: "守護型",
        description: "你用行動表達愛，默默照顧對方的生活細節，是讓人很有安全感的伴侶。",
        traits: ["體貼", "可靠", "細心"],
        advice: "別總是遷就，你的需求也同樣重要。",
      },
      {
        key: "free",
        emoji: "🕊️",
        title: "自由型",
        description: "你重視彼此的獨立與空間，相信好的感情是兩個完整的人一起前進，而不是互相綑綁。",
        traits: ["獨立", "隨和", "信任對方"],
        advice: "偶爾多一點主動的關心，會讓對方更安心。",
      },
      {
        key: "rational",
        emoji: "🧩",
        title: "理性型",
        description: "你重視溝通與相處的默契，喜歡把事情說清楚，一起找到兩人都舒服的相處方式。",
        traits: ["坦率", "重視溝通", "成熟穩定"],
        advice: "有時候對方需要的不是解法，而是一個擁抱。",
      },
    ],
  },
  {
    id: "work",
    emoji: "💼",
    title: "你的工作風格是？",
    subtitle: "找出你在團隊中最發光的角色",
    color: "#c48a14",
    soft: "#fbf0cf",
    mode: "type",
    questions: [
      {
        q: "接到一個新專案，你的第一步是？",
        options: [
          { text: "召集大家、分配任務", type: "leader" },
          { text: "先排出時程與細節", type: "planner" },
          { text: "先發想各種點子", type: "creator" },
          { text: "先了解每個人的想法", type: "harmonizer" },
        ],
      },
      {
        q: "開會時，你通常是？",
        options: [
          { text: "推動結論的人", type: "leader" },
          { text: "整理重點的人", type: "planner" },
          { text: "丟出新想法的人", type: "creator" },
          { text: "緩和氣氛的人", type: "harmonizer" },
        ],
      },
      {
        q: "截止日快到了，你會？",
        options: [
          { text: "果斷砍掉不重要的部分", type: "leader" },
          { text: "照計畫一步步完成", type: "planner" },
          { text: "壓力越大靈感越多", type: "creator" },
          { text: "找大家一起分工衝刺", type: "harmonizer" },
        ],
      },
      {
        q: "最讓你有成就感的是？",
        options: [
          { text: "帶領團隊達成目標", type: "leader" },
          { text: "事情完美照計畫完成", type: "planner" },
          { text: "自己的想法被實現", type: "creator" },
          { text: "大家合作得很愉快", type: "harmonizer" },
        ],
      },
      {
        q: "你最受不了哪種同事？",
        options: [
          { text: "優柔寡斷的人", type: "leader" },
          { text: "丟三落四的人", type: "planner" },
          { text: "一成不變的人", type: "creator" },
          { text: "只顧自己的人", type: "harmonizer" },
        ],
      },
    ],
    results: [
      {
        key: "leader",
        emoji: "🦁",
        title: "果斷的領導者",
        description: "你有方向感也有魄力，能在混亂中做出決定，帶著團隊往前衝。",
        traits: ["果斷", "有目標感", "抗壓性高"],
        advice: "多聽聽不同意見，團隊會更願意跟著你走。",
      },
      {
        key: "planner",
        emoji: "📋",
        title: "縝密的規劃師",
        description: "你注重細節、做事有條理，是讓專案穩穩落地的關鍵人物。",
        traits: ["細心", "有條理", "可靠"],
        advice: "計畫趕不上變化時，給自己一點彈性。",
      },
      {
        key: "creator",
        emoji: "💡",
        title: "靈感滿滿的創意家",
        description: "你腦中總有新點子，擅長從不同角度看問題，替團隊帶來新鮮的可能。",
        traits: ["有創意", "好奇", "勇於嘗試"],
        advice: "找個擅長執行的夥伴，讓好點子真正實現。",
      },
      {
        key: "harmonizer",
        emoji: "🤝",
        title: "溫暖的協調者",
        description: "你善於傾聽與溝通，能讓不同想法的人好好合作，是團隊裡的黏著劑。",
        traits: ["善解人意", "溝通力強", "重視團隊"],
        advice: "勇敢表達自己的立場，你的意見同樣有價值。",
      },
    ],
  },
  {
    id: "social",
    emoji: "🔋",
    title: "你的社交電量有多少？",
    subtitle: "測測你是靠獨處充電，還是靠人群發電",
    color: "#4f9a6b",
    soft: "#dff0e3",
    mode: "score",
    questions: [
      {
        q: "連續三天都有聚會，你會？",
        options: [
          { text: "光想就累", score: 0 },
          { text: "只去一場", score: 1 },
          { text: "挑兩場去", score: 2 },
          { text: "全部都要去！", score: 3 },
        ],
      },
      {
        q: "一個人吃飯，你覺得？",
        options: [
          { text: "超自在", score: 0 },
          { text: "還不錯", score: 1 },
          { text: "有點無聊", score: 2 },
          { text: "一定要找人陪", score: 3 },
        ],
      },
      {
        q: "接到不認識的號碼打來，你會？",
        options: [
          { text: "讓它響完", score: 0 },
          { text: "猶豫一下才接", score: 1 },
          { text: "直接接起來", score: 2 },
          { text: "接起來還能聊很久", score: 3 },
        ],
      },
      {
        q: "理想的放假方式是？",
        options: [
          { text: "關在家誰都不見", score: 0 },
          { text: "和一兩個好友小聚", score: 1 },
          { text: "參加朋友辦的活動", score: 2 },
          { text: "自己辦一場派對", score: 3 },
        ],
      },
      {
        q: "聚會結束回到家，你的感覺是？",
        options: [
          { text: "終於可以休息了", score: 0 },
          { text: "開心但有點累", score: 1 },
          { text: "很充實", score: 2 },
          { text: "還想再續攤", score: 3 },
        ],
      },
    ],
    results: [
      {
        key: "recharge",
        min: 0,
        max: 3,
        emoji: "🪫",
        title: "獨處充電型",
        description: "你的能量來自安靜的獨處時光。社交對你來說很耗電，但也因此你特別珍惜真正契合的關係。",
        traits: ["喜歡安靜", "深度思考", "重質不重量"],
        advice: "不用勉強自己合群，找到舒服的社交節奏就好。",
      },
      {
        key: "calm",
        min: 4,
        max: 7,
        emoji: "🔋",
        title: "穩定省電型",
        description: "你喜歡小而溫暖的聚會，和熟悉的人在一起最自在。社交和獨處之間，你拿捏得剛剛好。",
        traits: ["溫和", "重視熟人", "懂得拿捏"],
        advice: "偶爾嘗試新的場合，也許會遇到意外的好朋友。",
      },
      {
        key: "active",
        min: 8,
        max: 11,
        emoji: "⚡",
        title: "活力滿格型",
        description: "你享受和人互動，也能適時獨處。在團體中很自然地發光，是聚會裡的好夥伴。",
        traits: ["開朗", "好相處", "能量充足"],
        advice: "行程排滿之餘，記得留一點空白給自己。",
      },
      {
        key: "generator",
        min: 12,
        max: 15,
        emoji: "🎉",
        title: "社交發電機",
        description: "人群就是你的充電站！你熱愛熱鬧、擅長破冰，身邊總是圍繞著朋友和笑聲。",
        traits: ["外向", "熱情", "人緣超好"],
        advice: "熱鬧之後，也試著聽聽自己內心的聲音。",
      },
    ],
  },
];
