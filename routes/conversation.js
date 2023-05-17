const router = require('express').Router()
const Conversation = require('../models/Conversation')


// new conv

router.post('/', async (req, res) => {
  const newConversation = await new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  })
  await newConversation.save()

  try {
    res.status(200).json(newConversation)
  } catch (error) {
    res.status(500).json(err)
  }
})

// get conv of a user
router.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in:[req.params.userId] }
    })
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json(err)
  }
})

// get conv of 2 user
router.get('/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $all:[req.params.firstUserId, req.params.secondUserId] }
    })
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json(err)
  }
})

// post conv of 2 user
router.post('/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const newConversation = await new Conversation({
      members: [req.params.firstUserId, req.params.secondUserId]
    })
    await newConversation.save()

    try {
      res.status(200).json(newConversation)
    } catch (error) {
      res.status(500).json(err)
    }
  } catch (error) {
    res.status(500).json(err)
  }
})


module.exports = router