import './messenger.css'
import TopBar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import io from "socket.io-client";
import _ from "lodash";
import { useHistory, useLocation } from 'react-router-dom'

export default function Messenger(props) {
  const { user } = useContext(AuthContext)
  const [conversation, setConversation] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [currentChat, setCurrentChat] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [allUsers, setAllUsers] = useState(null)
  const [receiveUser, setReceiveUser] = useState({})
  const scrollRef = useRef()
  const socket = useRef()
  const location = useLocation();


  useEffect(() => {
    socket.current = io("http://localhost:3001")
    socket.current.emit('addUser', user._id)
    socket.current.on('getUsers', users => {
      setOnlineUsers(users)
    })
    socket.current.on('getMessage', (data) => {
      setMessages(prev => [...prev, data])
    })
  }, [])

  useEffect(() => {
    const getUserNotOnline = async () => {
      let res = await axios.get('/users/all')
      setAllUsers(res.data)
      // let allUser = res.data.map(i => i._id)
      // let onlU = onlineUsers.map(o => o.userId)
      // let notOl = _.difference(allUser, onlU)
      // setNotOnlineUsers(notOl) ????
      // console.log('getUserNotOnline',notOl, onlU) ??
    }
    getUserNotOnline()
  }, [])

  useEffect(() => {
    const getConversations = async () => {
      const res = await axios.get('/conversations/' + user._id)
      setConversation(res.data)
    }
    getConversations()
  }, [user])

  useEffect(() => {
    const getMessages = async () => {
      const res = await axios.get('/messages/' + currentChat?._id)
      setMessages(res.data)
    }
    getMessages()
    if(currentChat) {
      const reiUser = currentChat.members.find(u => u!==user._id)
      const fetchUser = async () => {
        const res = await axios.get(`/users?userId=${reiUser}`);
        setReceiveUser(res.data)
      };
      fetchUser()
    }
  }, [currentChat])

  useEffect(() => {
    if(location.state) {
      const getConversations = async () => {
        const res = await axios.get(`/conversations/${location.state.idUserRC}/${user._id}`)
        // console.log('location', res.data[0])
        setCurrentChat(res.data[0])
      }
      getConversations()
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/messages', {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id
    })
    setMessages([...messages, res.data])
    setNewMessage('')
    const receiverId = currentChat.members.find(c => c !== user._id)
    socket.current.emit('sendMessage', {newMessage: res.data, idUser:receiverId })
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  }, [messages])

  return (
    <>
      <TopBar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input type="text" placeholder='Search for friends' className='chatMenuInput' />
            <br /> <br /> <div><strong>All Users</strong></div>
            {conversation.map(c => {
              return <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            })}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? <>
              <div className="chatBoxTop">
                <div className='chatBoxUser'>
                  <img className='userRCimg' src={receiveUser?.profilePicture} alt="" />
                  <h2 className='userRCname'>{receiveUser?.username}</h2>
                </div>
                {messages?.map(m => {
                  return <div ref={scrollRef} >
                    <Message avtRc={receiveUser.profilePicture} avt={user.profilePicture} own={m.sender === user._id} message={m} />
                  </div>
                })}
              </div>
              <div className="chatBoxBottom">
                <textarea className="chatMessageInput"
                  placeholder='write something....'
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                >
                </textarea>
                <button onClick={handleSubmit} className='chatSubmitButton'>Send</button>
              </div>
            </>
              : <span className='noConversationText'>Open a conversation to start a chat</span>}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <div className='onlUserText'><strong>Online Users</strong></div>
            {onlineUsers?.map(o => 
              <ChatOnline online={true} userId={o.userId} currentId={user._id} setCurrentChat={setCurrentChat} />
            )}
            {/* <br /><br /><strong>All Users</strong>
            {allUsers?.map(o => 
              <ChatOnline online={false} userId={o._id} currentId={user._id} setCurrentChat={setCurrentChat} />
            )} */}
          </div>
        </div>
      </div>
    </>
  )
}