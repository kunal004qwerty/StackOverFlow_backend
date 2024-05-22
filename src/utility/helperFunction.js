export function paginateResults(page, limit, docCount){
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    if (endIndex < docCount) {
        results.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit,
        };
    }

    return {
        startIndex,
        endIndex,
        results,
    };
};

export function upvoteIt(quesAns, user) {
    if (
        quesAns.upvotedBy.includes(user._id.toString())
    ) {
        quesAns.upvotedBy = quesAns.upvotedBy.filter(
            (u) => u.toString() !== user._id.toString()
        )
    } else {
        quesAns.upvotedBy.push(user._id)
        quesAns.downvotedBy = quesAns.downvotedBy.filter(
            (d) => d.toString() !== user._id.toString()
        )
    }
    quesAns.points = quesAns.upvotedBy.length - quesAns.downvotedBy.length
    return quesAns
}

export function downvoteIt(quesAns, user) {
    if (
        quesAns.downvotedBy.includes(user._id.toString())
    ) {
        quesAns.downvotedBy = quesAns.downvotedBy.filter(
            (d) => d.toString() !== user._id.toString()
        )
    } else {
        quesAns.downvotedBy.push(user._id)
        quesAns.upvotedBy = quesAns.upvotedBy.filter(
            (u) => u.toString() !== user._id.toString()
        )
    }

    quesAns.points = quesAns.upvotedBy.length - quesAns.downvotedBy.length
    return quesAns
}

export function quesRep(question, author) {
    const calculatedRep =
        question.upvotedBy.length * 10 - question.downvotedBy.length * 2;

    if (Array.isArray(author.answers)) {
        author.posts = author.posts.map((q) =>
            q.postsId && q.postsId.equals(question._id) ? { postsId: q.postsId, rep: calculatedRep } : q
        );
    }

    return author;
};

export function ansRep(answer, author) {
    const calculatedRep =
        answer.upvotedBy.length * 10 - answer.downvotedBy.length * 2;

    if (Array.isArray(author.answers)) {
        // Update the reputation for the matching answer
        author.answers = author.answers.map((a) =>
            a.ansId && a.ansId.equals(answer._id) ? { ansId: a.ansId, rep: calculatedRep } : a
        );
    }

    return author;
};