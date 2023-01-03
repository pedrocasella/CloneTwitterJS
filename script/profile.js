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

//set info
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'user/' + localStorage.getItem('worldbookuid'))).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val()
            const description = document.getElementById('description')
            const name = document.getElementById('your-name')
            const user = document.getElementById('your-user')
            document.getElementById('cape').style.backgroundImage = 'url(' + data.background + ')'
            document.getElementById('switch-picture').style.backgroundImage = 'url(' + data.profile_picture + ')'
            document.getElementById('switch-background').style.backgroundImage = 'url(' + data.background + ')'
            document.getElementById('switch-name-input').value = data.name
            document.getElementById('switch-user-input').value = data.username.replace('@', '')
            document.getElementById('switch-description-input').value = data.description
            description.innerHTML = data.description
            for(let i = 0; i <= document.querySelectorAll('#your-name').length; i++){
                if(data.verified == 'true'){
                    document.querySelectorAll('#your-name')[i].innerHTML = data.name + '<span class="verified-icon" id="verified-icon"></span>'
                    document.querySelectorAll('#your-user')[i].innerHTML = data.username
                }else{
                    document.querySelectorAll('#your-name')[i].innerHTML = data.name
                    document.querySelectorAll('#your-user')[i].innerHTML = data.username
                }
                
            }
            for(let i = 0; i <= document.querySelectorAll('#circle-user').length; i++){
                document.querySelectorAll('#circle-user')[i].style.backgroundImage = 'url(' + data.profile_picture + ')'
            }

        } else {
            window.location.replace("index.html")
        }
        }).catch((error) => {
        console.error(error);
        });

        //set profile picture
        get(child(dbRef, 'user/' + localStorage.getItem('worldbookuid'))).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                for(let i = 0; i <= document.querySelectorAll('#circle-user').length; i++){
                    document.querySelectorAll('#circle-user')[i].style.backgroundImage = 'url(' + data.profile_picture + ')'
                }
    
            } else {
                
            }
            }).catch((error) => {
            console.error(error);
            });

    //switch background
    function switchBackground(){
        if(document.getElementById('switch-background-input').files.length != 0){
            var imageFile = document.getElementById('switch-background-input').files[0]
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = ()=>{
                document.getElementById('switch-background').style.backgroundImage = 'url(' + reader.result + ')'
            }
        }
    }
    setInterval(switchBackground, 100*5)

    //switch picture
    function switchPicture(){
        if(document.getElementById('switch-picture-input').files.length != 0){
            var imageFile = document.getElementById('switch-picture-input').files[0]
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = ()=>{
                document.getElementById('switch-picture').style.backgroundImage = 'url(' + reader.result + ')'
            }
        }
    }
    setInterval(switchPicture, 100*5)

    //switch info
        //open options
        document.getElementById('edit-btn').addEventListener('click', ()=>{
            document.getElementById('edit-profile').style.display = 'block'
            document.getElementById('edit-blackfilter').style.display = 'block'
        })
        //close options
        document.getElementById('close-edit').addEventListener('click', ()=>{
            document.getElementById('edit-profile').style.display = 'none'
            document.getElementById('edit-blackfilter').style.display = 'none'
        })
    document.getElementById('switch-btn').addEventListener('click', ()=>{
        const picture = document.getElementById('switch-picture').style.backgroundImage.replaceAll('url(', '').replaceAll(')', '').replaceAll('"', '')
        const name = document.getElementById('switch-name-input').value
        const user = document.getElementById('switch-user-input').value
        const description = document.getElementById('switch-description-input').value
        const background = document.getElementById('switch-background').style.backgroundImage.replaceAll('url(', '').replaceAll(')', '').replaceAll('"', '')
        const db = getDatabase();
        //update profile
        update(ref(db, 'user/' + localStorage.getItem('worldbookuid')), {
            profile_picture: picture,
            name: name,
            username: '@' + user,
            description: description,
            background: background,
        })

        setTimeout(()=>{window.location.replace("profile.html")}, 1000*2)

        document.getElementById('post-loading').style.display = 'block'
        document.getElementById('display-post-loading').style.display = 'block'
        
    })
        

//redirects

 //redirect to home
 document.getElementById('home').addEventListener('click', ()=>{
    window.location.assign('timeline.html')
    localStorage.setItem('worldbookuid', localStorage.getItem('worldbookoriginaluid'))
    localStorage.setItem('worldbookstatusvisit', 'false')
 })

//loading
setInterval(()=>{
    if(document.getElementById('your-name').innerHTML != ''){
        document.getElementById('loading').style.display = 'none'
    }
}, 1000*2)

//visibility of edit profile and profile card

if(localStorage.getItem('worldbookstatusvisit') == 'true'){
    document.getElementById('edit-btn').style.display = 'none'
    document.getElementById('profile-card').style.display = 'none'
}else{
    document.getElementById('edit-btn').style.display = 'block'
    document.getElementById('profile-card').style.display = 'block'
}