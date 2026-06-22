const Worker = require("../models/worker");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

exports.careerAssistant = async (req, res) => {

    try {

        const {
            phone,
            question
        } = req.body;

        const worker =
            await Worker.findOne({ phone });

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }


        const model =
            genAI.getGenerativeModel({
                model: "gemini-2.5-flash"
            });
        const prompt = `
You are a career advisor for daily wage workers in India.

Worker Skills:
${worker.skills?.join(", ")}

Experience:
${worker.experience || 0} years

Location:
${worker.location}

Question:
${question}

Rules:
1. Use very simple English.
2. Give maximum 5 points.
3. Keep answer under 100 words.
4. Use bullet points.
5. Give practical advice only.
6. Suggest ways to earn more money when relevant.
7. Suggest useful skills to learn when relevant.
8. Avoid technical terms.
9. Make the advice suitable for workers using a mobile phone.

Answer:
`;
        const result =
            await model.generateContent(prompt);

        const answer =
            result.response.text();

        res.json({
            success: true,
            answer
        });

    } catch (error) {
        console.log("CHATBOT ERROR:", error);

        res.status(500).json({
            message: error.message
        });


    }
};