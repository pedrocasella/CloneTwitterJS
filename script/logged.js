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


//request data


    //set name and username of user
    function setName(data){
        for(let i = 0; i<= document.querySelectorAll('#your-name').length; i++){
            document.querySelectorAll('#your-name')[i].innerHTML = data.name
            document.querySelectorAll('#your-user')[i].innerHTML = data.username
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
        onValue(ref(db, 'user/global_posts'), (snapshot) => {
            const data = snapshot.val();
            snapshot.forEach((childSnapshot)=>{
                const key = childSnapshot.key
                const data = childSnapshot.val()
                const postArea = document.getElementById('posted-area')
                postArea.innerHTML += '<div class="user-post" id="' + data.uid_post + '"><ul class="ul-post"><li class="circle-user"></li><li><ul class="ul-user"><li class="your-name">' + data.name + '</li><li class="your-user">' + data.username + '</li></ul></li></ul><p class="text-posted" id="text-posted">' + data.text + '</p><center><img src="'+ data.image +'" alt="imagem" class="img-posted" id="img-posted"></center>'

              })
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

    setInterval(()=>{
        const images = document.querySelectorAll('#img-posted')
        for(let i = 0; i <= images.length; i++){
            if(images[i].src.indexOf('data') == -1){
                images[i].style.display = 'none'
            }
        }
        console.clear()
    }, 1000*11)
         
document.getElementById('post-btn').addEventListener('click', ()=>{
    const text = document.getElementById('post-text').value
    const name = document.getElementById('your-name').innerText
    const username = document.getElementById('your-user').innerText
    const imageUrl = document.getElementById('preview-image').style.backgroundImage.replaceAll('url(', '').replaceAll(')', '').replaceAll('"', '')
    


    if(text != ''){
        //set post in your profile
        const db = getDatabase();
        const postRef = ref(db, 'user/' + localStorage.getItem('worldbookuid') + '/post')
        const pushPost = push(postRef)
        set(pushPost, {
            uid_post: localStorage.getItem('worldbookuid'),
            name: name,
            username: username,
            text: text,
            image: imageUrl,                
        })
        document.getElementById('posted-area').innerHTML = ''
        //set post in timeline
        const postTimelineRef = ref(db, 'user/global_posts')
        const pushPostTimeline = push(postTimelineRef)
        set(pushPostTimeline, {
            uid_post: localStorage.getItem('worldbookuid'),
            name: name,
            username: username,
            text: text,
            image: imageUrl,                  
        })

        setTimeout(()=>{location.reload()}, 1000*5) 
    } 
})

//loading
setInterval(()=>{
    if(document.getElementById('your-name').innerHTML != ''){
        document.getElementById('loading').style.display = 'none'
    }
}, 100*5)
