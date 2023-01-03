 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
 import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
 import { getDatabase, ref, set, child, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
 const auth = getAuth(app);
 const provider = new GoogleAuthProvider();
 const database = getDatabase(app);
 
 //login
    document.getElementById('logIn-btn').addEventListener('click', ()=>{
        const auth = getAuth();
        signInWithRedirect(auth, provider);
    })

    //get data
    setTimeout(()=>{
        const auth = getAuth();
        getRedirectResult(auth)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            const user = result.user;
            console.log(user)
            //create and sigin user
            function userSection(){
                const dbRef = ref(getDatabase());
                get(child(dbRef, 'user/' + user.uid)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    localStorage.setItem('worldbookuid', user.uid)
                    localStorage.setItem('worldbookoriginaluid', user.uid)
                    window.location.replace("timeline.html")
                } else {
                    document.getElementById('sign-up').style.display = 'block'
                    localStorage.setItem('worldbookuid', user.uid)
                    const db = getDatabase();
                    set(ref(db, 'user/' + user.uid), {
                        description: 'Bem vindo ao WorldBook',
                        profile_picture: '',
                        uid: user.uid,
                        name: user.displayName,
                        username: '@' + user.displayName.replace(' ', '_'),
                        email: user.email,
                        verified: 'false',
                        background: '',
                    })
                    
                }
                }).catch((error) => {
                console.error(error);
                });
            }
            setTimeout(userSection, 1000*1)


            
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }, 1000*3)

//update data in login

setInterval(()=>{
    const firstName = document.getElementById('select-first-name').value
    const lastName = document.getElementById('select-last-name').value
    const username = document.getElementById('select-user').value
    const description = document.getElementById('description-user').value

    if(firstName == '' || lastName == '' || username == '' || description == ''){
        document.getElementById('update-btn').style.opacity = '.6'
        document.getElementById('update-btn').style.cursor = 'default'
    }else{
        document.getElementById('update-btn').style.opacity = '1'
        document.getElementById('update-btn').style.cursor = 'pointer'
    }
    

    

}, 100*5)

    //image upload
    function getImage(){
        if(document.getElementById('select-picture').files.length != 0){
            var imageFile = document.getElementById('select-picture').files[0]
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = ()=>{
                if(document.getElementById('profile-picture').style.backgroundImage != ''){
                    document.getElementById('profile-picture').style.display = 'block'

                }
                document.getElementById('profile-picture').style.backgroundImage = 'url(' + reader.result + ')'
            }
        }
    }
    setInterval(getImage, 100*5)

document.getElementById('update-btn').addEventListener('click', ()=>{

    const firstName = document.getElementById('select-first-name').value
    const lastName = document.getElementById('select-last-name').value
    const username = document.getElementById('select-user').value
    const description = document.getElementById('description-user').value

    if(firstName != '' && lastName != '' && username != ''){
        const db = getDatabase();
        update(ref(db, 'user/' + localStorage.getItem('worldbookuid')), {
            profile_picture: document.getElementById('profile-picture').style.backgroundImage.replaceAll('url(', '').replaceAll(')', '').replaceAll('"', ''),
            name: firstName + ' ' + lastName,
            username: '@' + username.replace(' ', '_'),
            description: description,
        })
        setTimeout(()=>{window.location.replace("timeline.html")}, 1000*2)
    }
})

document.getElementById('skip-btn').addEventListener('click', ()=>{
    window.location.assign("timeline.html")
    
})