let curr_mode = 'on';
let game_running = false
let game_mode = (mode)=>{
    if(mode!=curr_mode && !game_running){
        if(mode =='ol'){
            document.getElementById('online').classList.add("text-dark","bg-light")
            document.getElementById('computer').classList.remove("text-dark","bg-light")
            console.log('Mode:online')
            curr_mode = 'ol'
        }else if(mode=='co') {
            document.getElementById('computer').classList.add("text-dark","bg-light")
            document.getElementById('online').classList.remove("text-dark","bg-light")
            console.log('Mode:Computer')
            var cells = document.getElementsByClassName("cell");
            for (var i = 0; i < cells.length; i++) {
                cells.item(i).setAttribute('onclick','type(this.id);')
            }
            curr_mode = 'co'
        }
    }
    if(game_running){
        let quit = confirm('Do you want to quit the game!')
        if(quit){
            game_running = false
            game_mode(mode)
        }
    }
    console.log(curr_mode)
}
let allow=true;
let turn =0;
let last;
let first;
win_condition=[[1,2,3],[4,5,6],[7,8,9],[1,5,9],[3,5,7],[1,4,7],[2,5,8],[3,6,9]]
potato_turns=[];
user_turns=[];
let t;
let win;
let win_point;
let corns = [1,3,7,9];
let fc = [2,4,6,8];
let gif;
function type(index){
    if(allow && checkempty(index) && curr_mode=='co'){
        document.getElementById(index).innerText = 'X';
        allow=false;
        turn+=1;
        //t.setText(turn);
        user_turns.push(parseInt(index));
        potato()
    }
}
function potato(){
    if(turn==5){
        setTimeout(function(){
            alert('draw')
        },700)
    }
    if(turn==1){
        if(user_turns[0]==5){
            corner()
        }else if(corns.includes(parseInt(user_turns[0]))){
            mid()
            
        }else{
            mid();
        }
    }else if(turn>=2){
        if(win_check()){
            setTimeout(function(){
                //win.alpha=1;
                document.getElementById(win_point).innerText = "0";
                potato_turns.push(win_point);
                allow=true
                win_check()
            },700)
        }else if(turn==2 && fc.includes(user_turns[1])){
            //console.log('trick')
            if(checkempty(10-user_turns[0])){
                setTimeout(function(){
                    document.getElementById(10-user_turns[0]).innerText = '0';
                    allow=true;
                    potato_turns.push(10-user_turns[0])
                },700)
                
            }else{
                if(corners_full()){
                    facecenter();
                }else{
                    corner();
                }
            }
        }
        else{
            //console.log('wincheck false')
            opposite();
        }
    }
    //setTimeout(function(){
    //    console.log(potato_turns)
    //},720);
}



function opposite(){
    let oppo =10-user_turns[user_turns.length-1];
    if(checkempty(oppo)){
        setTimeout(function(){
            document.getElementById(oppo).innerText = '0';
            allow=true;
            potato_turns.push(oppo);
            //console.log('opposite')
        },700)
    }else{
        if(oppocorns() || corners_full()){
            facecenter();
        }else{
            corner();
        }
    }
}
function mid(){
    setTimeout(function(){
        if(checkempty(5)){
            document.getElementById(5).innerText = '0';
            allow=true;
            potato_turns.push(5)
        }
        
    },700)
}
function corner(){

    let r = Math.floor(Math.random()*4);
    if(checkempty(corns[r])){
        setTimeout(function(){
            document.getElementById(corns[r]).innerText = '0';
            allow=true;
            potato_turns.push(corns[r]);
            //console.log('corner')
        },700)
    }else{
        corner();
    }
}
function facecenter(){
    let r = Math.floor(Math.random()*4);
    if(checkempty(fc[r])){
        setTimeout(function(){
            document.getElementById(fc[r]).innerText = '0';
            allow=true;
            potato_turns.push(fc[r]);
            //console.log('facecenter')
        },700)
    }else{
        if(turn<5){
            facecenter();
        }
    }
}
function checkempty(index){
    if(document.getElementById(index).innerText==''){
        return true
    }else{
        return false
    }
}

function win_check(){
    //potato_turns,win_condition
    for(let j=0;j<8;j++){
        
        let point = [false,false,false];
        if(potato_turns.includes(parseInt(win_condition[j][0]))){
            point[0]=true
            //console.log(potato_turns,' includes: ',win_condition[j][0])
        }
        if(potato_turns.includes(parseInt(win_condition[j][1]))){
            point[1]=true
            //console.log(potato_turns,' includes: ',win_condition[j][1])
        }
        if(potato_turns.includes(parseInt(win_condition[j][2]))){
            point[2]=true
            //console.log(potato_turns,' includes: ',win_condition[j][2])

        }
        let count=0;
        for(k=0;k<3;k++){
            if(point[k]==true){
                count+=1;
            }
        }
        if(count==3){
            //document.write("game Over")
            setTimeout(function(){
                alert('You Lost')
            },700)
            allow=false
        }
        if(count==2){
            if(checkempty(win_condition[j][point.indexOf(false)])){
                //console.log('win-check')
                win_point=win_condition[j][point.indexOf(false)];
                return true
            }
            //console.log(win_condition[j],potato_turns,point)
        }
    }
    for(let j=0;j<8;j++){
        let point = [false,false,false];
        if(user_turns.includes(parseInt(win_condition[j][0]))){
            point[0]=true
            //console.log(user_turns,' includes: ',win_condition[j][0])
        }
        if(user_turns.includes(parseInt(win_condition[j][1]))){
            point[1]=true
            //console.log(user_turns,' includes: ',win_condition[j][1])
        }
        if(user_turns.includes(parseInt(win_condition[j][2]))){
            point[2]=true
            //console.log(user_turns,' includes: ',win_condition[j][2])

        }
        let count=0;
        for(k=0;k<3;k++){
            if(point[k]==true){
                count+=1;
            }
        }
        //console.log('count '+count)
        if(count==3){
            alert('You Win!')
        }
        if(count==2){
            if(checkempty(win_condition[j][point.indexOf(false)])){
                //console.log('loose-check')
                win_point=win_condition[j][point.indexOf(false)];
                return true
            }
            //console.log(win_condition[j],potato_turns,point)
        }
    }
    //console.log('false_aya_frse')
    return false
    
}

function corners_full(){
    if(document.getElementById(1).innerText!='' && document.getElementById(3).innerText!='' && document.getElementById(7).innerText!='' && document.getElementById(9).innerText!=''){
        //console.log('corners Full');
        return true
    }
    return false
}
function fc_full(){
    if(document.getElementById(2).innerText!='' && document.getElementById(4).innerText!='' && document.getElementById(6).innerText!='' && document.getElementById(8).innerText!=''){
        //console.log('corners Full');
        return true
    }
    return false
}
function oppocorns(){
    if(document.getElementById(1).innerText=='X' && document.getElementById(9).innerText=='X'){
        //console.log('oppocorns 1 9')
        return true
    }else if(document.getElementById(3).innerText=='X' && document.getElementById(7).innerText=='X'){
        //console.log('oppocorns 3 7')
        return true
    }else{
        //console.log('oppocorns False')
        return false
    }
}
function rndmpos(){
    let random_pos=Math.ceil(Math.random()*9);
    setTimeout(function(){
        if(checkempty(random_pos)){
            document.getElementById(random_pos).innerText = '0';
            allow=true;
            potato_turns.push(random_pos)
        }else{
            rndmpos();
        }
        
    },700)
}