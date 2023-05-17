import axios from 'axios'
import { useContext } from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext' 
import './conversationsHomepage.css'

export default function ConversationsHomepage(props) {
  const { user } = useContext(AuthContext)
  const [userFriend, setUserFriend] = useState([])
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      let res = await axios.get('/users/all')
      if(props.searchValue) {
        setUserFriend(res.data.filter(u => {
          return u._id !== user._id && u.username.toLowerCase().includes(props.searchValue.toLowerCase())
        }))
        // setUserFriend(userFriend.filter(u => u.username.includes(props.searchValue.toLowerCase())))
      } else {
        setUserFriend(res.data.filter(u => u._id !== user._id))
      }
      // console.log(userFriend);
    }
    getUser()
  }, [props.searchValue])

  const handleChatBox = (id) => {
    history.push({
      pathname: "/messenger",
      state: {idUserRC: id},
    });
  }
  
  return (
    <>
      {userFriend?.map(item => {
        return <div onClick={() => handleChatBox(item._id)} className="conversation">
                  {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSwese3WMdVTlYe-5ZjU5S8L_gJXpTUKZa5g&usqp=CAU" alt="" className="conversationImg" /> */}
                  <img src={item.profilePicture} alt="" className="conversationImg" />
                  <span className="conversationName">{item.username}</span>
                </div>
      })}
    </>
  )
}