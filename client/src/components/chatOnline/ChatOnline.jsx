import axios from 'axios'
import { useEffect, useState } from 'react'
import './chatOnline.css'


export default function ChatOnline({online, userId, currentId, setCurrentChat }) {
  const [user, setUser] = useState(null)
  const [conversation, setConversation] = useState(null)

  useEffect(() => {
    const getAllUsers = async () => {
      if(userId !== currentId) {
        const res = await axios.get('/users?userId=' + userId)
        setUser(res.data)
      }
    }
    const getConversation = async () => {
      const res = await axios.get(`/conversations/${userId}/${currentId}`)
      setConversation(res.data)
    }
    getAllUsers()
    getConversation()
  }, [])


  return (
    <div className="chatOnline" onClick={() => {console.log('conversation', conversation);setCurrentChat(conversation[0])}}>
      {user ? 
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            {/* <img className='chatOnlineImg' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1pTpB4_qTItFL1PqGUSqKnVRbvoe3lb9fAg&usqp=CAU" alt="" /> */}
            <img className='chatOnlineImg' src={user.profilePicture} />
            {online ? 
            <div className="chatOnlineBadge"></div> : <></>
            }
          </div>
          <span className="chatOnlineName">{user.username}</span>
        </div>
      : <></>
      }
    </div>
  )
}