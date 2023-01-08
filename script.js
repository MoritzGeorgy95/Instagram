//script variables
let storyContainer = document.getElementById("story-container");
let storyImage = document.getElementById("open-story-image");
let profileImage = document.getElementsByClassName("story-profile")[0];
let profileUsername = document.getElementsByClassName("story-username")[0];
let postContainer = document.getElementById("post-container");
let contentRight = document.getElementsByClassName("content-right")[0];
counter = 0;
let username = "mo.georgy";

//render functions

//render everything onload
function init() {
  renderStories();
  renderPosts();
}

//render stories
function renderStories() {
  // Loop through the JSON array
  for (let i = 0; i < profiles.length; i++) {
    // Get the current object
    let user = profiles[i];

    storyContainer.innerHTML += storyHTML(user, i);
  }
}

//render posts
function renderPosts() {
  if (localStorage.length > 0) {
    posts = JSON.parse(localStorage.getItem("posts"));
    getLocalStorage();
  } else {
    getLocalStorage();
  }
}

// template functions
function storyHTML(param, index) {
  return /*html*/ `
    <div class="flex-column-standard margin-top-1 margin-bottom-1 story-wrapper">
        <img src="${param.image}" class="img-big margin-left-1 gradient-border pointer static" onclick="showStory(${index}); removeBorder(${index})">
        <p class="text-center">${param.name}</p>
    </div>
    
    `;
}

function postHTML(i) {
  return /*html*/ `
    <div class="flex-column post margin-top-1 margin-bottom-1">
        <div class="flex-row margin-left-1 vertical-align margin-bottom-1 margin-top-1">
            <img src="${posts[i].profileImage}" class="img-small">
            <div class="flex-column story-header">
                <h4 class="margin-0">${posts[i].name}</h4>
                <p class="margin-0">${posts[i].location}</p>
            </div>
        </div>
        <img src="${posts[i].image}" class="post-image">
        <div class="flex-row margin-top-1 vertical-align">
            <i class="bi margin-left-1 post-icon likebutton" onclick="giveRemoveLike(${i})"></i>
            <i class="bi bi-chat margin-left-1 post-icon" onclick="addComment(i)"></i>
            <i class="bi bi-send post-icon margin-left-1"></i>
        </div>
        <b><p class="margin-left-1 sidebar-heading">Gefällt ${posts[i].likes} Mal</p></b>
        <div class="comment-container" class="margin-left-1 margin-bottom-1"></div>
        <div class="flex-row-between">
            <div class="margin-left-1">😊</div>
            <input type="tex" class="commentInput" placeholder="Kommentieren ...">
            <b><p class="margin-0 blue margin-right-1 pointer" onclick="postComment(${i})">Posten</p></b>
        </div>
    </div>
`;
}

function commentHTML(i, j) {
  return /*html*/ `
        <div class="flex-row comment-fonts">
            <b><p class="margin-0 margin-left-1">${posts[i].comments[j].name}</p></b>
            <p class="margin-0 gray margin-left-1 margin-bottom-1">${posts[i].comments[j].comment}</p>
        </div>
       
      `;
}

//get local storage
function getLocalStorage() {
  postContainer.innerHTML = "";
  for (let i = 0; i < posts.length; i++) {
    postContainer.innerHTML += postHTML(i);
    let likebutton = document.getElementsByClassName("likebutton")[i];
    if (posts[i].liked == "no") {
      likebutton.classList.add("bi-heart");
    } else {
      likebutton.classList.add("bi-heart-fill");
      likebutton.classList.add("red");
    }
    let commentContainer =
      document.getElementsByClassName("comment-container")[i];
    for (let j = 0; j < posts[i].comments.length; j++) {
      commentContainer.innerHTML += commentHTML(i, j);
    }
  }
}

//post comment
function postComment(i) {
  let userInput = document.getElementsByClassName("commentInput")[i].value;
  const comment = { name: "mo.georgy", comment: userInput };
  posts[i].comments.push(comment);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}

//give like
function giveRemoveLike(i) {
  let likeButton = document.getElementsByClassName("likebutton")[i];
  let likes = +posts[i].likes;
  if (posts[i].liked == "no") {
    likes++;
    posts[i].likes = likes;
    posts[i].liked = "yes";
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  } else {
    likes--;
    posts[i].likes = likes;
    posts[i].liked = "no";
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}

//follow user
function follow(i) {
  let followText = document.getElementsByClassName("follow")[i];
  followText.innerHTML = "Gefolgt";
  followText.style.color = "black";
}

// render suggestions (content-right)
function renderSuggestions() {
  for (let i = 9; i < profiles.length; i++) {
    contentRight.innerHTML += /*html*/ `
        <div class="flex-row vertical-align margin-left-1 margin-top-1">
               <img src="${profiles[i].image}" class="img-small margin-right-1">
               <div class="flex-column">
                 <b><p class="margin-0 sidebar-p">${profiles[i].name}</p></b>
                 <p class="margin-0 blue pointer follow" onclick="follow(${
                   i - 9
                 })">Folgen</p>
               </div>
             </div>
        `;
  }
}

//layout functionality functions
function scrollStoriesRight() {
  storyContainer.scrollBy({
    top: 0,
    left: 250,
    behavior: "smooth",
  });
}

function scrollStoriesLeft() {
  storyContainer.scrollBy({
    top: 0,
    left: -250,
    behavior: "smooth",
  });
}

//show stories after clicking on thumbnail and background overlay
function showStory(i) {
  storyImage.src = profiles[i].storyIMG;
  document.getElementsByClassName("overlay")[0].classList.remove("d-none");
  document.body.style.overflow = "hidden";
  profileImage.src = profiles[i].image;
  profileUsername.innerHTML = profiles[i].name;
  counter = i;
}

//remove border from clicked stories
function removeBorder(i) {
  let storyBorder = document.getElementsByClassName("static")[i];
  storyBorder.classList.remove("gradient-border");
}

// close image and go back to onload layout
function hideOverlay() {
  document.getElementsByClassName("overlay")[0].classList.add("d-none");
  document.body.style.overflow = "visible";
}

////show next story in story queue
function nextStory() {
  counter++;
  storyImage.src = profiles[counter].storyIMG;
  profileImage.src = profiles[counter].image;
  profileUsername.innerHTML = profiles[counter].name;
}
//show previous story in story queue
function previousStory() {
  counter--;
  storyImage.src = profiles[counter].storyIMG;
  profileImage.src = profiles[counter].image;
  profileUsername.innerHTML = profiles[counter].name;
}
