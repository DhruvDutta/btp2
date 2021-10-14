import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
import * as firebase from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyCTGhPhTaSL88TdHhAWcj3Ct2OMFRGviVU",
    authDomain: "beatthepotatov2.firebaseapp.com",
    databaseURL: "https://beatthepotatov2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "beatthepotatov2",
    storageBucket: "beatthepotatov2.appspot.com",
    messagingSenderId: "1051671577545",
    appId: "1:1051671577545:web:f932b11580b021c8e21e18",
    measurementId: "G-YF6YZWSZ6F"
};
// Initialize Firebase
const app =initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = firebase.getDatabase();
const set = firebase.set
const get = firebase.get
const ref = firebase.ref
const push = firebase.push
const child = firebase.child
const alert_html =`<div class="alert alert-info alert-dismissible fade show" id="copyalert" role="alert">Room Code Copied To Clipboard!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
const error_html =`<div class="alert alert-warning alert-dismissible fade show" id="copyalert" role="alert">Room Unavailable<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
let curr_ref;
let user_mark;
let oppo_mark;
document.getElementById('createbtn').addEventListener('click',create_room);
document.getElementById('joinbtn').addEventListener('click',join_room);
function create_room(){
    const roomListRef = ref(db, 'room/');
    const newRoomRef = push(roomListRef);
    curr_ref = newRoomRef
    user_mark = "X"
    oppo_mark = "O"
    Initiate_game()
    set(newRoomRef, {
        allow:true,
        turn:'X'
    });
    navigator.clipboard.writeText(curr_ref.key);
    document.getElementById('alert').innerHTML=alert_html;
    document.getElementById('roombox').classList.add("d-none")
}
function join_room(){
    let roomcode = document.getElementById('room_code').value
    if(roomcode==''){
        document.getElementById('alert').innerHTML=error_html;
        return
    }
    get(child(ref(db),`room/`)).then((snapshot) => {
        if (snapshot.hasChild(roomcode)) {
            if(snapshot.child(roomcode).val().allow){
                firebase.update(ref(db,`room/${roomcode}/`),{
                    allow:false
                })
                curr_ref = roomcode
                user_mark = "O"
                oppo_mark = "X"
                Initiate_game()
            }else{
                document.getElementById('alert').innerHTML=error_html;
                return    
            }
        } else {
            document.getElementById('alert').innerHTML=error_html;
            return
        }
    })
}
function Initiate_game(){
    var cells = document.getElementsByClassName("cell");
    for (var i = 0; i < cells.length; i++) {
        let index = cells.item(i).id
        cells.item(i).addEventListener('click',()=>{post(index)})
    }
}
function post(index){
    console.log(index)
    get(child(ref(db),`room/${curr_ref.key}/`)).then((snapshot)=>{
        if(snapshot.val().turn == user_mark){
            document.getElementById(`${index}`).innerText = user_mark;
            firebase.update(ref(db,`room/${curr_ref.key}/`),{
                turn:oppo_mark,
            })
        }else{
            alert('Opponent\'n Turn')
        }
    })
    win_check()
    
}