
import { Posts, User } from "../models/index.js"
import { questionValidator, upvoteIt, downvoteIt, quesRep, paginateResults } from "../utility/index.js"
import { FindUser } from "./index.js"

// Post_a_Question .
export async function AddPost(req, res, next) {
  const { title, body, tags } = req.body
  const user = req.user

  const { errors, valid } = questionValidator(title, body, tags)

  if (!valid) {
    return res.json({ "message": `${errors}` })
  }

  try {
    if (user) {
      const existingUser = await FindUser(user._id)


      const newPost = new Posts({
        title: title,
        body: body,
        tags: tags,
        author: existingUser._id
      })

      const SavePost = await newPost.save()
      const populatedQues = await SavePost
        .populate('author', 'name')
      // .execPopulate()

      existingUser.posts.push({ postsId: SavePost._id })
      await existingUser.save();

      return res.json(populatedQues)

    }

  } catch (error) {
    console.log(error);
  }



}

// Get_Post_By_Id .
export async function PostById(req, res, next) {
  const quesId = req.params.id;

  try {
    const post = await Posts.findById(quesId)
      .populate('author', 'name')
      .populate('comments.author', 'name')  // dont know workng or not
      .populate('answers.author', 'name') // dont know workng or not
      .populate('answers.comments.author', 'name'); // dont know workng or not

    if (!post) {
      return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` });
    }

    post.views++;
    const savedPost = await post.save();

    return res.json(savedPost);
  } catch (error) {
    return res.json(error);
  }
}

// Get_all_posts .
// export async function GetAllPost(req, res, next) {
//   const AllPosts = await Posts.find()

//   if (Posts !== null) {
//     return res.json(AllPosts)
//   }

//   return res.json({ "message": "Posts Not avilable" })

// }

// Delete_Post_by_Id .
export async function DeletePostById(req, res, next) {
  const quesId = req.params.id;
  const user = req.user

  try {
    if (user) {
      const existingUser = await FindUser(user._id)
      const post = await Posts.findById(quesId)

      if (!post) {
        return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
      }

      if (
        post.author.toString() !== existingUser._id.toString()
      ) {
        return res.json({ "message": "Access is denied" })
      }

      await Posts.findByIdAndDelete(quesId)
      return res.json({ "message": `Post of Id : ${quesId} Removed` })


    } else {
      return res.json({ "message": "Access is denied" })
    }
  } catch (error) {
    return res.json(error)
  }
}

// Edit_Post_by_Id .
export async function EditPostById(req, res, next) {
  // const quesId = req.params.id;
  const user = req.user
  const { title, body, tags, quesId } = req.body


  try {
    if (user) {
      const existingUser = await FindUser(user._id)
      const post = await Posts.findById(quesId)

      if (!post) {
        return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
      }

      if (
        post.author.toString() !== existingUser._id.toString()
      ) {
        return res.json({ "message": "Access is denied" })
      }

      const { errors, valid } = questionValidator(title, body, tags)
      if (!valid) {
        return res.json({ "message": `${errors}` })
      }

      const updatedQuesObj = {
        title: title,
        body: body,
        tags: tags,
        updatedAt: Date.now()
      }

      const updatedQues = await Posts.findByIdAndUpdate(quesId, updatedQuesObj, { new: true })
        .populate('author', 'name')
        .populate('comments.author', 'name')  // dont know workng or not
        .populate('answers.author', 'name') // dont know workng or not
        .populate('answers.comments.author', 'name'); // dont know workng or not

      return res.json(updatedQues)

    } else {
      return res.json({ "message": "Access is denied" })
    }
  } catch (error) {
    return res.json(error)
  }

}

// Vote_Question
export async function VoteQuestion(req, res, next) {
  const user = req.user;
  const { quesId, voteType } = req.body;

  try {
    const existingUser = await FindUser(user._id);
    const post = await Posts.findById(quesId);
    console.log("post", post);
    console.log("existingUser", existingUser);

    if (!post) {
      return res.json({ message: `Question with ID: ${quesId} does not exist in DB` });
    }

    if (post.author.toString() === existingUser._id.toString()) {
      return res.json({ message: "You can't vote for your own post." });
    }

    let votedQues;
    if (voteType === 'upvote') {
      votedQues = upvoteIt(post, existingUser);
    } else {
      votedQues = downvoteIt(post, existingUser);
    }

    votedQues.hotAlgo =
      Math.log(Math.max(Math.abs(votedQues.points), 1)) +
      Math.log(Math.max(votedQues.views * 2, 1)) +
      votedQues.createdAt / 4500;

    // console.log("votedQues.hotAlgo", votedQues.hotAlgo);

    const updatedQues = await Posts.findByIdAndUpdate(quesId, votedQues, { new: true })
      .populate('author', 'name')
      .populate('comments.author', 'name')
      .populate('answers.author', 'name')
      .populate('answers.comments.author', 'name');


    return res.json(updatedQues);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


// Get_all_posts .
export async function GetAllPost(req, res, next) {
  const { sortBy, filterByTag, filterBySearch, page, limit } = req.query;

  const pageInt = Number(page);
  const limitInt = Number(limit);

  let sortQuery;
  switch (sortBy) {
    case 'votes':
      sortQuery = { points: -1 };
      break;
    case 'views':
      sortQuery = { views: -1 };
      break;
    case 'newest':
      sortQuery = { createdAt: -1 };
      break;
    case 'oldest':
      sortQuery = { createdAt: 1 };
      break;
    default:
      sortQuery = { hotAlgo: -1 };
  }

  let findQuery = {};
  if (filterByTag) {
    findQuery = { tags: { $all: [filterByTag] } };
  } else if (filterBySearch) {
    findQuery = {
      $or: [
        {
          title: {
            $regex: filterBySearch,
            $options: 'i',
          },
        },
        {
          body: {
            $regex: filterBySearch,
            $options: 'i',
          },
        },
      ],
    };
    
  }




  try {
    const postCount = await Posts.countDocuments(findQuery);
    const paginated = paginateResults(pageInt, limitInt, postCount);
    const posts = await Posts.find(findQuery)
      .sort(sortQuery)
      .limit(limitInt)
      // .skip(paginated.startIndex);

    // console.log('Posts.find() query:', {
    //   findQuery,
    //   sortQuery,
    //   limit: limitInt,
    //   skip: paginated.startIndex,
    // });


    const paginatedPosts = {
      previous: paginated.results.previous,
      posts,
      next: paginated.results.next,
    };
    console.log(paginatedPosts);
    return res.json(paginatedPosts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
