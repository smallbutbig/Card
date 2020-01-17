var div = [];
var eX = 0;
var eY = 0;
var move = 0;

var dX = [];
var dY = [];

var def_z_index = [];

var selectDivId = -1;
var selectDivNum = -1;

/**
 * 初始化移动
 */
function moveInitialization() {
    move = 0
    selectDivId = -1
    eX = 0;
    eY = 0;

    dX = [];
    dY = [];

    div = []
}

function downC(e, d, id, rn) {
    if (e.button != 0 || move == 1) {
        return false
    }
    // 左键按下
    if (!checkCanMove(d, id)) { // 判断是否可以移动
        return false
    }
    removeTishiClass()

    move = 1
    // 将元素放入移动组
    div.push(d);
    var cloned = d;
    var p = 0;
    while((cloned = cloned.nextElementSibling) != null){div.push(cloned);} p++;

    selectDivId = id
    selectDivNum = rn
    eX = e.clientX;
    eY = e.clientY;

    def_z_index = div[0].style.zIndex
    for(i=0;i<div.length;i++) {
        div[i].style.zIndex = 1000+i

        dX.push(div[i].offsetLeft)
        dY.push(div[i].offsetTop)
    }
}

function checkCanMove(d, id) {
    if (!hasClass(d, 'open')) {
        return false;
    }
    var p = 0;
    while((d = d.previousElementSibling) != null) p++;
    var can = true
    for (i=p+1;i<gameArr[id].length;i++) {
        var thisRealNum = gameArr[id][i-1].split("-")[1];
        var nextRealNum = gameArr[id][i].split("-")[1];
        if ((thisRealNum-1) != nextRealNum) {
            can = false;
        }
    }
    return can
}

window.onmousemove = function(e) {
    if (move != 1 || div.length == 0) {
        return false
    }
    var meX = e.clientX;
    var meY = e.clientY;


    for(i=0;i<this.div.length;i++) {
        var mdX = meX - (eX - dX[i]);
        var mdY = meY - (eY - dY[i]);
        div[i].style.left = mdX+'px';
        div[i].style.top = mdY+'px';
    }
}

function upC(e) {
    if (e.button != 0) {
        return false
    }
    var reduction = true // 是否还原

    if (selectDivId != -1) {
        // 置放检测
        var mainDiv = document.getElementById('main')
        var mainDivChild = mainDiv.children; // 获取子元素
        var selectX = mainDivChild[selectDivId].offsetLeft + mainDivChild[selectDivId].children[mainDivChild[selectDivId].children.length-div.length].offsetLeft;
        var selectY = mainDivChild[selectDivId].offsetTop + mainDivChild[selectDivId].children[mainDivChild[selectDivId].children.length-div.length].offsetTop;
        for (i=0;i<mainDivChild.length;i++) {
            if (i != selectDivId) {
                // 计算距离
                var thisC = mainDivChild[i].children[mainDivChild[i].children.length-1]
                var thisX = mainDivChild[i].offsetLeft + (thisC ? thisC.offsetLeft : 0);
                var thisY = mainDivChild[i].offsetTop + (thisC ? thisC.offsetTop : 0);
                if (selectX - thisX > -18 && selectX - thisX < 18 && selectY - thisY < 55 && selectY - thisY > 0) {
                    // 距离正确，判断置放成败
                    reduction = checkPlace(i)
                    break;
                }
            }
        }
    }

    // 还原
    if (reduction) {
        for(i=0;i<div.length;i++) {
            div[i].style.left = dX[i]+'px';
            div[i].style.top = dY[i]+'px';
            div[i].style.zIndex = parseInt(def_z_index)+i
        }
    
        moveInitialization();
    }
}

/**
 * 判断是否可以成功移动
 * @param {int} place 
 */
function checkPlace(place) {
    // selectDivId -> place
    if (gameArr[place].length == 0) {
        // 直接移动
        successMove(place);
        return false
    }
    var placeNum = gameArr[place][gameArr[place].length - 1].split("-")[1];
    
    if ((selectDivNum + 1) != placeNum) {
        return true;
    }

    // 成功移动
    successMove(place, true);
}

function successMove(place, check=false) {
    var mainDiv = document.getElementById('main')
    var mainDivChild = mainDiv.children; // 获取子元素
    var newhtml = '';
    // 更新html
    for (i=0;i<div.length;i++) {
        var newhtml = newhtml+`
            <div class="children open" style="top:`+((mainDivChild[place].children.length)*25 + i*25 - 1)+`px;z-index:`+((mainDivChild[place].children.length)+1+i)+`;"  onmousedown="downC(event, this, `+place+`, `+(selectDivNum-i)+`)" onmouseup="upC(event)">
                <a class="pai">`+getPKHtml(selectDivNum-i)+`<br>♠</a>
                <a class="but pai">`+getPKHtml(selectDivNum-i)+`<br>♠</a>
            </div>
        `;
    }
    mainDivChild[place].innerHTML = mainDivChild[place].innerHTML+newhtml
    if (div[0].previousElementSibling) {
        removeClass(div[0].previousElementSibling, 'back')
        addClass(div[0].previousElementSibling, 'open')
        var openRealNum = gameArr[selectDivId][gameArr[selectDivId].length-div.length-1].split("-")[1]
        div[0].previousElementSibling.setAttribute('onmousedown', 'downC(event, this, '+selectDivId+', '+openRealNum+')')
        div[0].previousElementSibling.setAttribute('onmouseup', 'upC(event)')
        div[0].previousElementSibling.innerHTML = `
            <a class="pai">`+getPKHtml(openRealNum)+`<br>♠</a>
            <a class="but pai">`+getPKHtml(openRealNum)+`<br>♠</a>
        `
    }
    for(i=0;i<div.length;i++) {
        div[i].remove()
        gameArr[place].push(gameArr[selectDivId][gameArr[selectDivId].length-div.length+i]);
    }
    // 更新操作数组
    gameArr[selectDivId].splice(gameArr[selectDivId].length-div.length, div.length);
    moveInitialization()

    // 回收扑克判断
    if (check) {
        checkRecovery(place)
    }
}

function checkRecovery(place) {
    var checkDiv = document.getElementById('main').children[place].children;
    var checkPlace = -1;
    for (i=0;i<checkDiv.length;i++) {
        if (hasClass(checkDiv[i], 'open')) {
            checkPlace = i;
            break;
        }
    }
    if (checkPlace >= 0) {
        recoveryPk(place, checkPlace)
    }
}

function recoveryPk(place, s) {
    var checkArr = gameArr[place]
    if (checkArr.length - s < 13) {
        return false
    }
    var pk = 1;
    for (i=0;i<12;i++) {
        if (checkArr[s+i+1].split("-")[1] && checkArr[s+i].split("-")[1]-1 == checkArr[s+i+1].split("-")[1]) {
            pk++;
        } else {
            break;
        }
    }
    if (pk == 13) {
        var checkDiv = document.getElementById('main').children[place].children;
        for (i=s+13;i>s;i--) {
            checkDiv[i-1].remove();
        }
        gameArr[place].splice(s, 13);
        checkWin();
    } else {
        recoveryPk(place, s+pk);
    }
}

/**
 * 胜利判断
 */
function checkWin() {
    var len = 0;
    for(i=0;i<gameArr.length;i++) {
        len += gameArr[i].length;
    }
    if (len + allArr.length <= 0) {
        alert('胜利');
        status = 3;
        document.getElementById("restart").style.display = "inline"
    }
}

/**
 * 提示
 */
function tishi() {
    removeTishiClass();
    var allChild = document.getElementById('main').children
    var moveA = [];
    var moveB = [];
    var hasMove = 0;
    run:
    for (x=0;x<allChild.length;x++) {
        var thisChild = allChild[x].children
        for (y=0;y<thisChild.length;y++) {
            if (checkCanMove(thisChild[y], x)) {
                for (z=0;z<gameArr.length;z++) {
                    if (z==x){
                        continue;
                    }
                    if (gameArr[z].length == 0) {
                        hasMove = 1;
                        moveA = [x, y];
                        moveB = [z, -1];
                        break run;
                    }
                    if ((parseInt(gameArr[x][y].split("-")[1]) + 1) == gameArr[z][gameArr[z].length-1].split("-")[1]) {
                        hasMove = 1;
                        moveA = [x, y];
                        moveB = [z, gameArr[z].length-1];
                        break run;
                    }
                }
                break;
            }
        }
    }
    if (hasMove == 1) {
        addClass(allChild[moveA[0]].children[moveA[1]], 'tishi')
        if (moveB[1] == -1) {
            addClass(allChild[moveB[0]], 'kongtishi')
        } else {
            addClass(allChild[moveB[0]].children[moveB[1]], 'tishi')
        }
        return false;
    }
    alert('无路可走');
}

function removeTishiClass(){
    var tishiDiv = document.getElementsByClassName("tishi");
    for(i=tishiDiv.length-1;i>=0;i--) {
        removeClass(tishiDiv[i],'tishi');
    }
    var kongDIv = document.getElementsByClassName("kongtishi");
    for(i=kongDIv.length-1;i>=0;i--) {
        removeClass(kongDIv[i],'kongtishi');
    }
}