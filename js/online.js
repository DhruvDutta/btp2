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
let oppo_name;
let deck={"X":[],"O":[],};
document.getElementById('createbtn').addEventListener('click',create_room);
document.getElementById('joinbtn').addEventListener('click',join_room);
function create_room(){
    let username = document.getElementById('username').value
    const roomListRef = ref(db, 'room/');
    const newRoomRef = push(roomListRef);
    curr_ref = newRoomRef.key
    user_mark = "X"
    oppo_mark = "O"
    Initiate_game()
    set(newRoomRef, {
        allow:true,
        turn:'X',
        x_user:username,
    });
    navigator.clipboard.writeText(curr_ref);
    document.getElementById('alert').innerHTML=alert_html;
    document.getElementById('roombox').classList.add("d-none")
}
function join_room(){
    let roomcode = document.getElementById('room_code').value
    let username = document.getElementById('username').value
    if(roomcode==''){
        document.getElementById('alert').innerHTML=error_html;
        return
    }
    get(child(ref(db),`room/`)).then((snapshot) => {
        if (snapshot.hasChild(roomcode)) {
            if(snapshot.child(roomcode).val().allow){
                
                curr_ref = roomcode
                user_mark = "O"
                oppo_mark = "X"
                Initiate_game()
                firebase.update(ref(db,`room/${roomcode}/`),{
                    allow:false,
                    o_user:username,
                })
                document.getElementById('roombox').classList.add("d-none")
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
    console.log('init...')
    var cells = document.getElementsByClassName("cell");
    for (var i = 0; i < cells.length; i++) {
        let index = cells.item(i).id
        cells.item(i).addEventListener('click',()=>{post(index)})
    }
    const commentsRef = ref(db, 'room/' + curr_ref);
    firebase.onChildAdded(commentsRef, (data) => {
        if(isNumeric(data.key)){
            if(parseInt(data.key)>0 && parseInt(data.key)<=9){
                document.getElementById(data.key).innerText = data.val();
                deck[data.val()].push(parseInt(data.key))
                win_check_fr()
            }
        }
        if(data.key == 'o_user' && user_mark!='O'){
            oppo_name = data.val()
            document.getElementById('alert').innerHTML = `<div class="alert alert-success alert-dismissible fade show" id="copyalert" role="alert">${data.val()} Joined!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        }
        if(data.key == 'x_user' && user_mark!='X'){
            oppo_name = data.val()
        }
    });
    
    window.onbeforeunload = (e)=>{
        get(child(ref(db),`room/${curr_ref}/`)).then((snapshot)=>{
            if(!snapshot.val().allow){
                firebase.update(ref(db,`room/${curr_ref}`),{
                    allow:true,
                })
            }else{
                firebase.update(ref(db,`room/`),{
                    [curr_ref]:null,
                })
            }
        })
    }
    firebase.onChildChanged(commentsRef,(data)=>{
        if(data.key =='allow' && data.val()==true){
            document.getElementById('alert').innerHTML = `<div class="alert alert-danger alert-dismissible fade show" id="copyalert" role="alert">${oppo_name} Left!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`    
        }
    })
}
function post(index){
    console.log("Index Clicked",index)
    get(child(ref(db),`room/${curr_ref}/`)).then((snapshot)=>{
        if(snapshot.val().turn == user_mark && !snapshot.hasChild(index)){
            document.getElementById(`${index}`).innerText = user_mark;
            firebase.update(ref(db,`room/${curr_ref}/`),{
                turn:oppo_mark,
                [index]:user_mark,
            })
        }else{
            alert('Opponent\'n Turn')
        }
    })
    
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function win_check_fr(){
    let win_condition=[[1,2,3],[4,5,6],[7,8,9],[1,5,9],[3,5,7],[1,4,7],[2,5,8],[3,6,9]]
    console.log("X:",deck["X"])
    console.log("O:",deck["O"])
    for(let i=0;i<win_condition.length;i++){
        if(win_condition[i].every(val=> deck["X"].includes(val))){
            document.getElementById('winbox').classList.remove('d-none');
            document.getElementById('wintext').innerText = 'X Wins!'
            return
        }else if(win_condition[i].every(val=> deck["O"].includes(val))){
            document.getElementById('winbox').classList.remove('d-none');
            document.getElementById('wintext').innerText = 'O Wins!'
            return
        }
    }
}

function reset(){
    var cells = document.getElementsByClassName("cell");
    for (var i = 0; i < cells.length; i++) {
        let index = cells.item(i).id
        cells.item(i).innerText =''
    }
    firebase.update(ref(db,`room/`),{
        [curr_ref]:null,
    })
    set(ref(db,`room/${curr_ref}/`),{
        allow:false,
        turn:'O',
    })
    deck={"X":[],"O":[],};
    document.getElementById('winbox').classList.add('d-none');
    document.getElementById('wintext').innerText = ''
}
document.getElementById('reset').addEventListener('click',reset);