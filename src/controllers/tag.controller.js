import { Posts } from "../models/index.js";


export async function GetAllTags(req,res,next) {
    try {
        const tagsFromQues = await Posts.find({}).select('tags');
        const tagsArray = tagsFromQues.map((t) => t.tags).flat()

        let result = [];
        tagsArray.forEach((tag) => {
            const found = result.find((r) => r.tagName === tag)

            if (!found) {
                result.push({ tagName: tag, count: 1 })
            } else {
                result[result.indexOf(found)].count++
            }
        })
        const finalResult =  result.sort((a, b) => b.count - a.count)
        return res.json(finalResult)

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
}