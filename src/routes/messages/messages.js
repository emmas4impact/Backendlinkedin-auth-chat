const MessageModel = require("./schema")
const SingleModel = require("./singleSchema")

const addMessage = async (message, sender, room) => {
  try {
    const newMessage = new MessageModel({ text: message, sender, room })
    const savedMessage = await newMessage.save()
    return savedMessage
  } catch (error) {
    console.log(error)
  }
}


const addSingleMessage = async (message, sender, receiver) => {
  try {
    const newMessage = new SingleModel({ text: message, sender, receiver })
    const singleMessage = await newMessage.save()
    return singleMessage
  } catch (error) {
    console.log(error)
  }
}


module.exports = {addMessage, addSingleMessage}
