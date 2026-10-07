// Service to call Google Gemini API for live sermon generation on any Bible verse
// Strictly prompts for natural, authentic, pastoral Vietnamese (không dịch máy gượng gạo)

export async function generateSermonStudy({
  apiKey,
  verseReference,
  audienceMode = 'sermon', // 'sermon' | 'youth' | 'smallGroup'
  lessonLength = 'medium', // 'short' | 'medium' | 'long'
  customFocus = '',
  selectedModel = 'gemini-2.5-flash'
}) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Vui lòng cung cấp Gemini API Key để tạo bài giảng cho câu Kinh Thánh mới.');
  }

  const audienceModeDescriptions = {
    sermon: {
      vi: 'Bài Giảng Chúa Nhật Cho Toàn Thể Hội Thánh (Văn phong mục vụ trang trọng, sâu nhiệm thần học, ấm áp khích lệ, kêu gọi ăn năn và biến đổi)',
      en: 'Sunday Congregational Sermon (Expository, pastoral depth, clear homiletic structure, congregational exhortation)'
    },
    youth: {
      vi: 'Ban Giới Trẻ / Thanh Niên (Văn phong trẻ trung, hiện đại, chạm đúng nỗi đau đời sống số, áp lực học tập/sự nghiệp/peer pressure/overthinking, dùng hình ảnh công nghệ và đời sống số)',
      en: 'Youth & Young Adults Ministry (Relatable, conversational, directly addressing digital culture, burnout, comparison, mental health, and career anxiety)'
    },
    smallGroup: {
      vi: 'Nhóm Nhỏ / Tế Bào / Gia Đình (Văn phong đối thoại ấm cúng, tương tác cao, khơi mở chia sẻ chân thật, câu hỏi thảo luận sâu sắc, gắn kết tình thân chi thể)',
      en: 'Small Group / Cell Group Bible Study (Interactive, relational, vulnerable discovery questions, mutual encouragement, practical community action steps)'
    }
  };

  const lengthDescriptions = {
    short: {
      en: 'Short Duration (~15 minutes): Fast-paced, concise, laser-focused on 1 punchy big idea with 1 memorable illustration and 1 immediate action takeaway. Pacing: 2m hook, 8m scripture/truth, 3m parable, 2m prayer.',
      vi: 'Thời lượng ngắn (~15 phút): Tĩnh nguyện / Chapel ngắn. Cô đọng, tập trung vào 1 tư tưởng cốt lõi, 1 minh họa súc tích và 1 cam kết hành động.'
    },
    medium: {
      en: 'Standard Duration (30–45 minutes): Comprehensive 3-point sermon or standard cell group study. Full exegesis, 2 relatable illustrations, robust pedagogical framework.',
      vi: 'Thời lượng tiêu chuẩn (30–45 phút): Bài giảng Chúa Nhật tiêu chuẩn hoặc học Kinh Thánh nhóm nhỏ. 3 điểm then chốt, 2 câu chuyện ngụ ngôn đời sống.'
    },
    long: {
      en: 'Deep Dive Duration (60+ minutes): In-depth theological masterclass / retreat workshop. Verse-by-verse historical-grammatical exegesis, Greek/Hebrew root words, cross-references, deep pastoral parables, and extended breakout questions.',
      vi: 'Thời lượng chuyên sâu (Trên 1 giờ): Học viện Kinh Thánh / Hội thảo bồi linh. Phân tích ngữ cảnh lịch sử sâu, giải kinh từ gốc Hy Lạp/Hê-bơ-rơ, so sánh đối chiếu kinh văn, câu hỏi đào sâu bàn tròn.'
    }
  };

  const modeInfo = audienceModeDescriptions[audienceMode] || audienceModeDescriptions.sermon;
  const lengthInfo = lengthDescriptions[lessonLength] || lengthDescriptions.medium;

  const systemPrompt = `
You are an expert biblical theologian, homiletics professor, and seasoned Vietnamese pastor with deep cultural mastery.
You are generating a complete sermon preparation package and study guide for Christian pastors and ministers for the passage: "${verseReference}".

Target Audience Setting: ${modeInfo.en} / ${modeInfo.vi}
Target Lesson Duration: ${lengthInfo.en} / ${lengthInfo.vi}
${customFocus ? `Custom Pastor's Focus/Theme: ${customFocus}` : ''}

CRITICAL LINGUISTIC REQUIREMENT FOR VIETNAMESE:
- The Vietnamese content MUST sound like it was conceived natively in conversational, natural, warm pastoral Vietnamese by a caring Vietnamese pastor who lives among the people.
- It MUST NOT sound like it was translated or transliterated from English ("tuyệt đối tránh văn phong dịch thuật gượng gạo, từ ngữ tây hóa, hoặc câu cú vô cảm của máy dịch").
- Use rich, natural evangelical expressions common in Vietnamese churches (e.g., "thân ái trong Đấng Christ", "bồi linh", "dâng phó", "trăn trở", "thao thức", "chạm vào lòng", "bình an thật", "neo chặt linh hồn", "đồng cỏ xanh tươi", "ơn phước dư dật").
- For parables/illustrations, use vivid, culturally resonant metaphors from daily life that touch hearts deeply.

You must return a valid JSON object strictly adhering to this schema:
{
  "referenceVi": "Vietnamese reference (e.g. Phi-líp 4:6-7)",
  "referenceEn": "English reference (e.g. Philippians 4:6-7)",
  "category": "anxiety | grace | trials | purpose | love | mission",
  "categoryLabelVi": "Tên chủ đề tiếng Việt",
  "categoryLabelEn": "English Category Label",
  "translations": {
    "vi": {
      "BTT": "Văn bản câu Kinh Thánh theo Bản Truyền Thống 1925",
      "NVB": "Văn bản câu Kinh Thánh theo Bản Dịch Mới",
      "BPT": "Văn bản câu Kinh Thánh theo Bản Phổ Thông",
      "BD2011": "Văn bản câu Kinh Thánh theo Bản Dịch 2011"
    },
    "en": {
      "NIV": "English text NIV",
      "ESV": "English text ESV",
      "KJV": "English text KJV"
    }
  },
  "context": {
    "vi": "Bối cảnh lịch sử, tác giả, hoàn cảnh sáng tác và bối cảnh thần học (2-3 câu súc tích bằng tiếng Việt tự nhiên)",
    "en": "Historical, authorial, and theological context (2-3 concise sentences in English)"
  },
  "studyPackage": {
    "titleVi": "Tiêu đề bài giảng / bài học gợi ý (tiếng Việt gợi cảm, dễ nhớ)",
    "titleEn": "Sermon / Study title in English",
    "themeVi": "Chủ đề cốt lõi (1 câu đúc kết)",
    "themeEn": "Core overarching theme (1 sentence)",
    "keyPoints": [
      {
        "pointVi": "1. Tiêu đề điểm then chốt thứ nhất",
        "pointEn": "1. First key point title in English",
        "exegesisVi": "Giải nghĩa thần học, ngữ pháp nguyên bản Hy Lạp/Hê-bơ-rơ nếu có, giải thích ý nghĩa tâm linh sâu xa bằng tiếng Việt tự nhiên",
        "exegesisEn": "Theological exegesis and linguistic nuance in English",
        "applicationVi": "Áp dụng thực tế ngay vào đời sống",
        "applicationEn": "Concrete real-world personal application"
      },
      {
        "pointVi": "2. Tiêu đề điểm then chốt thứ hai",
        "pointEn": "2. Second key point title in English",
        "exegesisVi": "Giải nghĩa chi tiết điểm thứ hai",
        "exegesisEn": "Detailed exegesis of the second point",
        "applicationVi": "Áp dụng thực tế điểm thứ hai",
        "applicationEn": "Concrete application of second point"
      },
      {
        "pointVi": "3. Tiêu đề điểm then chốt thứ ba",
        "pointEn": "3. Third key point title in English",
        "exegesisVi": "Giải nghĩa chi tiết điểm thứ ba",
        "exegesisEn": "Detailed exegesis of the third point",
        "applicationVi": "Áp dụng thực tế điểm thứ ba",
        "applicationEn": "Concrete application of third point"
      }
    ],
    "teachingPlan": {
      "hook": {
        "stepVi": "Hook / Mở Đề Thu Hút",
        "stepEn": "Hook / Attention grabber",
        "descriptionVi": "Mô tả chi tiết cách mở đầu buổi giảng",
        "descriptionEn": "Detailed description of opening hook"
      },
      "book": {
        "stepVi": "Book / Khám Phá Bản Văn",
        "stepEn": "Book / Scripture Discovery",
        "descriptionVi": "Mô tả cách trình bày bản văn Kinh Thánh rõ ràng, sáng tỏ",
        "descriptionEn": "Detailed walk-through of the scripture text"
      },
      "look": {
        "stepVi": "Look / Soi Chiếu Tấm Lòng",
        "stepEn": "Look / Heart Diagnostic",
        "descriptionVi": "Mô tả cách giúp tín hữu tự soi gương tấm lòng mình",
        "descriptionEn": "Detailed heart examination and introspection"
      },
      "took": {
        "stepVi": "Took / Hành Động Tuần Này",
        "stepEn": "Took / Weekly Life Assignment",
        "descriptionVi": "Hành động cụ thể, có thể đo lường trong tuần tới",
        "descriptionEn": "Specific, actionable takeaways for the upcoming week"
      },
      "timeline": [
        { "time": "00 - 05m", "actionVi": "Mở đề & câu chuyện dẫn nhập", "actionEn": "Introduction & hook" },
        { "time": "05 - 20m", "actionVi": "Giải nghĩa các điểm then chốt", "actionEn": "Exegesis of key points" },
        { "time": "20 - 30m", "actionVi": "Minh họa ngụ ngôn & ứng dụng", "actionEn": "Parable illustration & application" },
        { "time": "30 - 35m", "actionVi": "Kêu gọi & cầu nguyện dâng hiến", "actionEn": "Altar response & closing prayer" }
      ],
      "discussionQuestions": [
        {
          "qVi": "Câu hỏi thảo luận quan sát / cảm nhận (tiếng Việt gần gũi)",
          "qEn": "Observation / feeling discussion question in English"
        },
        {
          "qVi": "Câu hỏi đào sâu ý nghĩa thuộc linh",
          "qEn": "Interpretation / spiritual meaning question"
        },
        {
          "qVi": "Câu hỏi cam kết hành động thực tiễn trong tuần",
          "qEn": "Action commitment question for daily life"
        }
      ]
    },
    "parables": [
      {
        "titleVi": "Minh Họa 1: Tiêu đề truyện ngụ ngôn / minh họa đời sống",
        "titleEn": "Illustration 1: Title in English",
        "storyVi": "Nội dung câu chuyện được viết bằng tiếng Việt truyền cảm, giàu hình ảnh, xúc động và tự nhiên (3-4 đoạn)",
        "storyEn": "Full illustration written warmly in engaging English (3-4 paragraphs)",
        "pastoralBridgeVi": "Lời đúc kết chuyển ý mục sư nói trên bục giảng",
        "pastoralBridgeEn": "Pastoral bridge connecting illustration to verse"
      },
      {
        "titleVi": "Minh Họa 2: Tiêu đề minh họa thứ hai",
        "titleEn": "Illustration 2: Title in English",
        "storyVi": "Nội dung câu chuyện minh họa thứ hai bằng tiếng Việt tự nhiên",
        "storyEn": "Second illustration in English",
        "pastoralBridgeVi": "Lời nối của mục sư",
        "pastoralBridgeEn": "Pastoral bridge"
      }
    ]
  }
}

Respond ONLY with valid JSON.
`;

  const models = [selectedModel, 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            topP: 0.95,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || `API error (${response.status}: ${response.statusText})`;
        lastError = new Error(message);
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Không nhận được nội dung từ Gemini API.');
      }

      let cleanedJson = rawText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleanedJson);
      
      return {
        id: `ai-${Date.now()}`,
        isAiGenerated: true,
        referenceVi: parsed.referenceVi || verseReference,
        referenceEn: parsed.referenceEn || verseReference,
        category: parsed.category || 'purpose',
        categoryLabelVi: parsed.categoryLabelVi || 'Bài Giảng Đặc Biệt',
        categoryLabelEn: parsed.categoryLabelEn || 'Special Study',
        translations: parsed.translations || {},
        context: parsed.context || { vi: '', en: '' },
        modes: {
          [audienceMode]: parsed.studyPackage
        },
        rawStudyPackage: parsed.studyPackage
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Không thể kết nối đến Gemini API. Vui lòng kiểm tra lại API Key và kết nối mạng.');
}
