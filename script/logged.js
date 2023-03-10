import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, child, get, update, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

 const firebaseConfig = {
   apiKey: "AIzaSyAea1-bn0zIZGSF9210vuj8net_gB-w5C0",
   authDomain: "worldbook-ge.firebaseapp.com",
   projectId: "worldbook-ge",
   storageBucket: "worldbook-ge.appspot.com",
   messagingSenderId: "982640966867",
   appId: "1:982640966867:web:88929513336d1f58b86826",
   databaseURL: "https://worldbook-ge-default-rtdb.firebaseio.com/",
 };

 const app = initializeApp(firebaseConfig);
 const database = getDatabase(app);

//Visit other profile
localStorage.setItem('worldbookstatusvisit', 'false')
localStorage.setItem('worldbookoriginaluid', localStorage.getItem('worldbookuid'))
localStorage.setItem('worldbookuid', localStorage.getItem('worldbookoriginaluid'))
document.getElementById('users-list').addEventListener('click', (e)=>{
    const visitId = e.target.id.replace('user-box', '').replace('circleUser', '')
    localStorage.setItem('worldbookuid', visitId)
    localStorage.setItem('worldbookstatusvisit', 'true')
    window.location.assign('profile.html')
})

//request data

    //set name and username of user
    function setName(data){
        for(let i = 0; i<= document.querySelectorAll('#your-name').length; i++){
            if(data.verified == 'true'){
                document.querySelectorAll('#your-name')[i].innerHTML = data.name + '<span class="verified-icon" id="verified-icon"></span>'
                document.querySelectorAll('#your-user')[i].innerHTML = data.username
            }else{
                document.querySelectorAll('#your-name')[i].innerHTML = data.name
                document.querySelectorAll('#your-user')[i].innerHTML = data.username
            }
            
        }        
    }
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'user/' + localStorage.getItem('worldbookuid'))).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val()
            setName(data)
        } else {
            window.location.replace("index.html")
        }
        }).catch((error) => {
        console.error(error);
        });

    

//Post
        //load timeline posts
        const db = getDatabase();
       /* onValue(ref(db, 'global_posts/'), (snapshot) => {
            const data = snapshot.val();
            snapshot.forEach((childSnapshot)=>{
                const key = childSnapshot.key
                const data = childSnapshot.val()
                const postArea = document.getElementById('posted-area')
                postArea.innerHTML += '<div class="user-post" id="' + data.uid_post + '"><ul class="ul-post"><li class="circle-user"></li><li><ul class="ul-user"><li class="your-name">' + data.name + '</li><li class="your-user">' + data.username + '</li></ul></li></ul><p class="text-posted" id="text-posted">' + data.text + '</p><center><img src="'+ data.image +'" alt="imagem" class="img-posted" id="img-posted"></center>'

              })
          });*/
          get(child(dbRef, 'global_posts/')).then((snapshot) => {
            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot)=>{
                const key = childSnapshot.key
                const data = childSnapshot.val()
                const postArea = document.getElementById('posted-area')
                postArea.innerHTML += '<div class="user-post" id="' + data.uid_post + '"><ul class="ul-post"><li class="circle-user" id="' + 'circleUser' + data.uid_post + '"></li><li><ul class="ul-user"><li class="your-name">' + data.name + '</li><li class="your-user">' + data.username + '</li></ul></li></ul><p class="text-posted" id="text-posted">' + data.text + '</p><center><img src="'+ data.image +'" alt="imagem" class="img-posted" id="img-posted"></center><hr><div class="time-post" id="time-post"><span>'+ data.time +'</span></div>'
                get(child(dbRef, 'user/' + data.uid_post)).then((snapshot) => {
                  const data = snapshot.val()
                  for(let i = 0; i <= document.querySelectorAll('#circleUser' + data.uid).length; i++){
                    document.querySelectorAll('#circleUser' + data.uid)[i].style.backgroundImage = 'url(' + data.profile_picture + ')'
                  }
                  }).catch((error) => {
                    console.error(error);
                  });
                 })
                }
          }).catch((error) => {
            console.error(error);
          });

          //loading local profile picture 
          get(child(dbRef, 'user/' + localStorage.getItem('worldbookuid') + '/')).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                for(let i = 0; i <= document.querySelectorAll('#circle-user').length; i++){
                    document.querySelectorAll('#circle-user')[i].style.backgroundImage = 'url(' + data.profile_picture + ')'
                }
              
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

          
    //post image
    function getImage(){
        if(document.getElementById('up-post-picture').files.length != 0){
            var imageFile = document.getElementById('up-post-picture').files[0]
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = ()=>{
                if(document.getElementById('preview-image').style.backgroundImage != ''){
                    document.getElementById('preview-image').style.display = 'block'

                }
                document.getElementById('preview-image').style.backgroundImage = 'url(' + reader.result + ')'
            }
        }
    }
    setInterval(getImage, 100*5)

    //image visibility

    setTimeout(()=>{
        const images = document.querySelectorAll('#img-posted')
        for(let i = 0; i <= images.length; i++){
            if(images[i].src.indexOf('data') == -1){
                images[i].style.display = 'none'
            }
        }
        console.clear()
    }, 1000*11)
         
//post

document.getElementById('post-btn').addEventListener('click', ()=>{
    const text = document.getElementById('post-text').value
    const name = document.getElementById('your-name').innerText
    const username = document.getElementById('your-user').innerText
    const imageUrl = document.getElementById('preview-image').style.backgroundImage.replaceAll('url(', '').replaceAll(')', '').replaceAll('"', '')
    
    //hour of post
    const time = new Date()
    const day = time.getDate()
    const month = time.getUTCMonth() + 1
    const year = time.getFullYear()
    const hour = time.getHours()
    const minutes = time.getMinutes()

    if(text != ''){
        //set post in your profile
        const db = getDatabase();
        const postRef = ref(db, 'user/' + localStorage.getItem('worldbookuid') + '/post')
        const pushPost = push(postRef)
        set(pushPost, {
            profile_picture: '',
            uid_post: localStorage.getItem('worldbookuid'),
            name: name,
            username: username,
            text: text,
            image: imageUrl,
            time: hour + ':' + minutes + ' - ' + day + '/' + month + '/' + year,
            description: '',                
        })
            //document.getElementById('posted-area').innerHTML = ''
        //set post in timeline
        const postTimelineRef = ref(db, 'global_posts/')
        const pushPostTimeline = push(postTimelineRef)
        set(pushPostTimeline, {
            profile_picture: '',
            uid_post: localStorage.getItem('worldbookuid'),
            name: name,
            username: username,
            text: text,
            image: imageUrl,
            time: hour + ':' + minutes + ' - ' + day + '/' + month + '/' + year,
            description: '',                  
        })

        document.getElementById('post-loading').style.display = 'block'
        document.getElementById('display-post-loading').style.display = 'block'
        setTimeout(()=>{location.reload()}, 1000*5) 
    } 
})

//Loading Users List

    get(child(dbRef, 'user/')).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot)=>{
                const data = childSnapshot.val()
                const userList = document.getElementById('users-list')
                if(data.verified == 'true'){
                    userList.innerHTML += '<li class="user-box" id="user-box' + data.uid + '"><ul class="elements-box" id="' + data.uid + '"><li id="' + data.uid + '"><div class="circle-user" id="circleUser' + data.uid + '" style="background-image: url(' + data.profile_picture + ')"></div></li><li id="' + data.uid + '"><ul class="user-name-box" id="' + data.uid + '"><li class="name-user" id="' + data.uid + '">' + data.name + '<span class="verified-icon" id="' + data.uid + '"></span>'+ '</li><li class="username" id="' + data.uid + '">' + data.username  + '</li><li class="description" id="' + data.uid + '">' + data.description + '</li></ul></li></ul></li>'
                }else{
                    userList.innerHTML += '<li class="user-box" id="user-box' + data.uid + '"><ul class="elements-box" id="' + data.uid + '"><li id="' + data.uid + '"><div class="circle-user" id="circleUser' + data.uid + '" style="background-image: url(' + data.profile_picture + ')"></div></li><li id="' + data.uid + '"><ul class="user-name-box" id="' + data.uid + '"><li class="name-user" id="' + data.uid + '">' + data.name + '</li><li class="username" id="' + data.uid + '">' + data.username + '</li><li class="description" id="' + data.uid + '" >' + data.description + '</li></ul></li></ul></li>'
                }
                
            })
        } else {
        console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

//loading
setInterval(()=>{
    if(document.getElementById('your-name').innerHTML != ''){
        document.getElementById('loading').style.display = 'none'
    }
}, 1000*2)

//redirects

    //redirect to profile
    document.getElementById('profile').addEventListener('click', ()=>{
        window.location.replace('profile.html')
    })

    //open search
    document.getElementById('search').addEventListener('click', ()=>{
        document.getElementById('right-aside').style.display = 'block'
        document.getElementById('timeline').style.display = 'none'
    })

    //close search
    document.getElementById('close-search').addEventListener('click', ()=>{
        document.getElementById('right-aside').style.display = 'none'
        document.getElementById('timeline').style.display = 'block'
    })