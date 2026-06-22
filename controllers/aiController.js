const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("API Key:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const generateJobDescription = async (req, res) => {
    try {
        const {
            title,
            skill,
            location,
            wage
        } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
Generate a professional job description.

Job Title: ${title}
Skill: ${skill}
Location: ${location}
Wage: ${wage}

Rules:
1. Return only a single paragraph.
2. Do not include Job Title.
3. Do not include Location.
4. Do not include Wage.
5. Do not use markdown.
6. Do not use bullet points.
7. Keep it under 120 words.
8. Suitable for Daily Wage Connect workers.
`;

        const result = await model.generateContent(prompt);

        const description =
            result.response.text();

        res.json({
            success: true,
            description
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "AI generation failed"
        });
    }
};


const generateWorkerProfile = async (req, res) => {
    try {

        const {
            skill,
            experience
        } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
Generate a professional worker profile summary.

Skill: ${skill}
Experience: ${experience}

Rules:
1. Return only one paragraph.
2. Maximum 100 words.
3. Professional and trustworthy.
4. Suitable for Daily Wage Connect workers.
`;

        const result =
            await model.generateContent(prompt);

        const profile =
            result.response.text();

        res.json({
            success: true,
            profile
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Profile generation failed"
        });

    }
};

const skillGapAdvisor = async (req, res) => {

    try {

        const {
            skill,
            experience
        } = req.body;

        const model =
            genAI.getGenerativeModel({
                model: "gemini-2.5-flash"
            });

        const prompt = `
You are a career advisor for daily wage workers.

Skill: ${skill}
Experience: ${experience}

Suggest:
1. New skills to learn
2. Certifications if useful
3. Ways to increase earnings

Return maximum 5 points.
Keep answers simple.
`;

        const result =
            await model.generateContent(prompt);

        const advice =
            result.response.text();

        res.json({
            success: true,
            advice
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Skill advice generation failed"
        });

    }
};


module.exports = {
    generateJobDescription,
     generateWorkerProfile,
      skillGapAdvisor
};
