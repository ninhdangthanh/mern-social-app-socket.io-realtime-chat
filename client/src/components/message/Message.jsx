import './message.css'
import {format} from 'timeago.js'

export default function Message({avtRc, message, own, avt }) {
  return (
    <div className={own ? "message own" : 'm'}>
      <div className="messageTop">
        <img src={own ? avt : avtRc} alt=""
          className="messageImg" />
        <p>{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}