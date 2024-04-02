"use strict";

const addCardBtnOpen = document.querySelector(".add-card");
const addCardBtnClose = document.querySelector(".close");
const cardInput = document.querySelector(".input-container");
const cardContainer = document.querySelector(".card-container");

const addCard = document.querySelector(".add-details");

// Load existing cards from local storage
document.addEventListener("DOMContentLoaded", () => {
  const savedCards = JSON.parse(localStorage.getItem("youtubeCards")) || [];
  savedCards.forEach(card => {
    cardMaker(card.title, card.img, card.channelName, card.views, card.date, card.duration, card.videoId);
  });
});

addCard.addEventListener("click", () => {
  const videoLink = document.getElementById("video-link").value;
  if (videoLink) {
    const videoId = extractVideoId(videoLink);
    if (videoId) {
      fetchYouTubeVideoInfo(videoId);
    } else {
      alert("Invalid YouTube link!");
    }
  } else {
    alert("Please enter a YouTube link!");
  }
});

function extractVideoId(url) {
  const regex = /[?&]v=([^?&]+)/;
  const match = url.match(regex);
  console.log(match);
  return match && match[1];
}

function fetchYouTubeVideoInfo(videoId) {
  console.log('Fetching video info for video ID:', videoId);
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBY17lGcF84MMs2nDkiSQqnjSrZ4FotEvU`)
    .then(response => {
      console.log('Response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Data:', data);
      const videoData = data.items[0].snippet;
      const title = videoData.title;
      const channelName = videoData.channelTitle;
      const imgUrl = videoData.thumbnails.default.url;
      const views = "N/A"; // YouTube API doesn't provide view count directly
      const releaseDate = new Date(videoData.publishedAt).getTime();
      const currDate = new Date().getTime();
      const releaseDateString = timeGone(currDate, releaseDate);
      const duration = "N/A"; // Unfortunately, YouTube API doesn't provide video duration in the free version

      cardMaker(title, imgUrl, channelName, views, releaseDateString, duration, videoId);

      // Save card data to local storage
      const cardData = {
        title,
        img: imgUrl,
        channelName,
        views,
        date: releaseDateString,
        duration,
        videoId
      };
      saveCardData(cardData);
    })
    .catch(error => console.error('Error fetching YouTube video info:', error));
}

function saveCardData(cardData) {
  const savedCards = JSON.parse(localStorage.getItem("youtubeCards")) || [];
  savedCards.push(cardData);
  localStorage.setItem("youtubeCards", JSON.stringify(savedCards));
}

function cardMaker(title, img, channelName, views, date, duration, videoId) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="card-link">
      <div class="card-img">
        <img src="${img}" alt="thumbnail">
        <div class="video-time">
          <span class="time">${duration ? duration : "N/A"}</span>
        </div>
      </div>
  
      <div class="card-text">
        <h3 class="title">${title}</h3>
  
        <div class="channel-name">
          <span>${channelName}</span> <i class="fa-solid fa-check"></i>
        </div>
  
        <div class="video-details">
          <div class="views">
            <span class="view-number">${views}</span>
            <span>views</span>
          </div>
  
          <div class="dot"></div>
  
          <div class="video-date">${date}</div>
        </div>
      </div>
    </a>
  `;

  cardContainer.appendChild(card);
}

function timeGone(currDate, uploadDate) {
  const timeElapsed = Math.floor((currDate - uploadDate) / 1000 / 60 / 60);

  if (timeElapsed > 24) {
    const days = timeElapsed / 24;

    if (Math.floor(days / 365) >= 1) {
      return `${Math.floor(days / 365)} years ago`;
    } else {
      if (days < 31) {
        return `${Math.floor(days)} days ago`;
      } else {
        return `${Math.floor(days / 30)} months ago`;
      }
    }
  } else if (timeElapsed >= 1) {
    return `${timeElapsed} hours ago`;
  } else {
    const minutes = Math.floor((currDate - uploadDate) / 1000 / 60);
    return `${minutes} minutes ago`;
  }
}

// card open and close

addCardBtnOpen.addEventListener("click", () => {
  cardInput.style.display = "flex";
  setTimeout(() => {
    cardInput.style.left = "50%";
  }, 20);
});

addCardBtnClose.addEventListener("click", () => {
  cardInput.style.left = "250%";
  setTimeout(() => {
    cardInput.style.display = "none";
  }, 300);
});
