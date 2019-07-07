import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

const createSocket = (topicId) => {
  let channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", resp => {
      renderComments(resp.comments)
     })
    .receive("error", resp => { console.log("Unable to join", resp) })


  channel.on(`comments:${topicId}:new`, renderComment);

  let button = document.querySelector('button');
  let textArea = document.querySelector('textarea');

  button.addEventListener('click', function(){
    channel.push("comment:add", {content: textArea.value})
  })
};

function renderComments(comments) {
  if (comments.length <= 0) {
    return false;
  }
  const renderedComments = comments.map(comment => {
    return commentTemplate(comment);
  });
  document.querySelector('.collection').innerHTML = renderedComments.join('');
}

function renderComment(event) {
  const renderedComment = commentTemplate(event.comment);

  document.querySelector('.collection').innerHTML += renderedComment;
}

function commentTemplate(comment) {
  return `
    <li class="collection-item">
      ${comment.content}
    </li>
  `;
}

window.createSocket = createSocket;