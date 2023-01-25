import { tweetsData2 } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
const tweetInput = document.getElementById("tweet-input");
let tweetsData = tweetsData2;
const feedOuter = document.querySelector(".feed-outer");
document.addEventListener("click", getTrgetClick);

let leadsFromLocalStorage = JSON.parse(localStorage.getItem("tweetsData1"));
if (leadsFromLocalStorage) {
  tweetsData = leadsFromLocalStorage;
}

renderFeeds(tweetsData);

function getTrgetClick(e) {
  console.log(e);

  if (e.target.dataset.like) {
    likeClick(e.target.dataset.like);
  } else if (e.target.dataset.share) {
    shareClick(e.target.dataset.share);
  } else if (e.target.dataset.comment) {
    replyTweet(e.target.dataset.comment);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtn(e.target.id);
  } else if (e.target.dataset.feed) {
    deleteTweet(e.target.dataset.feed);
  }
}

function likeClick(tweetId) {
  const likeObj = tweetsData.filter((tweet) => {
    return tweet.uuid === tweetId;
  })[0];
  if (likeObj.isLiked) {
    likeObj.likes--;
  } else {
    likeObj.likes++;
  }
  likeObj.isLiked = !likeObj.isLiked;
  localStorage.setItem("tweetsData1", JSON.stringify(tweetsData));
  renderFeeds(tweetsData);
}

function shareClick(tweetId) {
  const shareObj = tweetsData.filter((tweet) => {
    return tweet.uuid === tweetId;
  })[0];
  if (shareObj.isRetweeted) {
    shareObj.retweets--;
  } else {
    shareObj.retweets++;
  }

  shareObj.isRetweeted = !shareObj.isRetweeted;
  console.log(tweetsData);
  localStorage.setItem("tweetsData1", JSON.stringify(tweetsData));
  renderFeeds(tweetsData);
}
// function commentClick(replyId) {
//   document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
// }

function replyTweet(replyId) {
  document.getElementById(`reply-modal-${replyId}`).classList.remove("hidden");
  document
    .getElementById(`reply-modal-close-btn-${replyId}`)
    .addEventListener("click", () => {
      document.getElementById(`reply-modal-${replyId}`).classList.add("hidden");
    });
  document
    .getElementById(`reply-tweet-btn-${replyId}`)
    .addEventListener("click", () => {
      let repVal = document.getElementById(
        `reply-tweet-input-${replyId}`
      ).value;
      console.log(repVal);
      tweetsData.forEach((tweet) => {
        if (tweet.uuid === replyId) {
          tweet.replies.unshift({
            handle: `@Ankita`,
            profilePic: `https://via.placeholder.com/48.png/09f/#9299e8
      
          C/O https://placeholder.com/`,

            tweetText: repVal,
          });
        }
      });
      localStorage.setItem("tweetsData1", JSON.stringify(tweetsData));
      renderFeeds(tweetsData);
    });
}
function handleTweetBtn(tweetId) {
  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Ankita`,
      profilePic: `https://via.placeholder.com/48.png/09f/#9299e8

    C/O https://placeholder.com/`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
  }
  tweetInput.value = "";
  renderFeeds(tweetsData);
}

function deleteTweet(id) {
  console.log(id);
  const getDsta = tweetsData.filter(function (t) {
    return t.uuid !== id;
  });
  tweetsData = getDsta;

  renderFeeds(tweetsData);
}

function renderFeeds(feeds) {
  let html = "";

  for (let i = 0; i < feeds.length; i++) {
    let heartClass = "";

    if (feeds[i].isLiked) {
      heartClass = "red";
    }

    let retweetClass = "";
    if (feeds[i].isRetweeted) {
      retweetClass = "green";
    }

    let replies = "";

    if (feeds[i].replies) {
      feeds[i].replies.forEach((reply) => {
        replies += `<div class="tweet-inner feed-replies" >
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>`;
      });
    }
    html += `<div class="feed" id="delete"  >
    <img src="${feeds[i].profilePic}" class="feed-img" alt="" />

<div class="feed-text" id="delete" >
  <h4 class="handle"  data-feed="${feeds[i].uuid}">${feeds[i].handle}</h4>
  <p class="tweet-text" >
  ${feeds[i].tweetText}
  </p>
  <div class="icon-section">
    <div class="icon-sec-inner">
      <i class="fa-regular fa-heart ${heartClass}" data-like="${feeds[i].uuid}"></i>
      <p>${feeds[i].likes}</p>
    </div>
    <div class="icon-sec-inner">
      <i class="fa-solid fa-retweet ${retweetClass}"  data-share="${feeds[i].uuid}"></i>
      <p>${feeds[i].retweets}</p>
    </div>
    <div class="icon-sec-inner">
      <i class="fa-regular fa-comment" data-comment="${feeds[i].uuid}"></i>
      <p>${feeds[i].replies.length}</p>
    </div>
  </div>
  </div>

  
</div>
<div class=" " id="replies-${feeds[i].uuid}">
  
${replies}

<div class="reply-modal hidden" id="reply-modal-${feeds[i].uuid}">
  <button class="reply-modal-close-btn" id="reply-modal-close-btn-${feeds[i].uuid}">X</button>
  <img
  src="https://via.placeholder.com/48.png/09f/#9299e8
C/O https://placeholder.com/" class="profile-pic"
/>
<textarea placeholder="Tweet your reply" id="reply-tweet-input-${feeds[i].uuid}"></textarea>
<button id="reply-tweet-btn-${feeds[i].uuid}">Reply</button>
</div>
</div>
`;
  }

  document.getElementById("feed").innerHTML = html;
}
