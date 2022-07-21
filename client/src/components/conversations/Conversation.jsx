import axios from 'axios'
import { useEffect, useState } from 'react'
import './conversation.css'

export default function Conversation({conversation, currentUser}) {
  const [user, setUser] = useState({})

  useEffect(() => {
    const conversationId = conversation.members.find(c => c!== currentUser._id)
    const getUser = async () => {
      const res = await axios.get('/users?userId=' + conversationId)
      setUser(res.data)
    }
    getUser()
  }, [conversation])
  
  return (
    <div className="conversation">
      {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSwese3WMdVTlYe-5ZjU5S8L_gJXpTUKZa5g&usqp=CAU" alt="" className="conversationImg" /> */}
      <img src={user.profilePicture} alt="" className="conversationImg" />
      <span className="conversationName">{user.username}</span>
    </div>
  )
}