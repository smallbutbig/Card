/** -----屏蔽右键点击----- **/
if (window.Event)
    document.captureEvents(Event.MOUSEUP);

function nocontextmenu() {
    event.cancelBubble = true
    event.returnValue = false;
    return false;
}

function norightclick(e) {
    if (window.Event) {
        if (e.which == 2 || e.which == 3)
            return false;
    } else
    if (event.button == 2 || event.button == 3) {
        event.cancelBubble = true
        event.returnValue = false;
        return false;
    }
}
document.oncontextmenu = nocontextmenu;
document.onmousedown = norightclick;
/** -----屏蔽右键点击----- **/


var status = 0; // 游戏状态 0.未开始 1.游戏中 2.失败 3.获胜

var hs = 0; // 是否使用颜色 0.否 1.是
var num = 2; // 牌副数

var allArr = []

var gameArr = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
]

function restart() {
    begin()
}

function begin() {
    if (status == 1) {
        return false;
    }
    status = 1;
    // 初始化总牌堆
    var strip = num*4
    for (i=0;i<strip;i++) {
        for (j=0;j<13;j++) {
            allArr.push((i+1)+'-'+(j+1))
        }
    }

    // 初始化发牌
    var s = num*2*13+num;
    for (i=0;i<s;i++) {
        initPK(i%10)
    }

    // 初始化页面渲染
    htmlRendering();

    // 显示发牌按钮
    document.getElementById("fapai").style.display = "inline"
}

function initPK(place, addhtml = false) {
    var gameLen = gameArr.length;
    if (!(place >= 0 && place < gameLen)) {
        return false;
    }
    var len = allArr.length
    var rand = parseInt(Math.random() * len);
    var pk = allArr[rand];
    allArr.splice(rand,1);
    gameArr[place].push(pk);

    if (addhtml) {
        var mainDiv = document.getElementById('main')
        var mainDivChild = mainDiv.children; // 获取子元素
        if (!mainDivChild[place]) {
            return false;
        }
        var newNum = pk.split("-")[1];
        var newhtml = `
            <div class="children open" style="top:`+((gameArr[place].length-1)*25-1)+`px;z-index:`+((gameArr[place].length-1)+1)+`;"  onmousedown="downC(event, this, `+place+`, `+(newNum)+`)" onmouseup="upC(event)">
                <a class="pai">`+getPKHtml(newNum)+`<br>♠</a>
                <a class="but pai">`+getPKHtml(newNum)+`<br>♠</a>
            </div>
        `;
        mainDivChild[place].innerHTML = mainDivChild[place].innerHTML+newhtml
    }
}

/**
 * 初始化页面渲染
 */
function htmlRendering() {
    var html = '';
    for (i=0;i<gameArr.length;i++) {
        html += '<div class="parent">';
        for (j=0;j<gameArr[i].length;j++) {
            var k = gameArr[i][j].split("-")[1];
            if (j+1 == gameArr[i].length) {
                html += `
                    <div class="children open" style="top:`+(j*25-1)+`px;z-index:`+(j+1)+`;"  onmousedown="downC(event, this, `+i+`, `+k+`)" onmouseup="upC(event)">
                        <a class="pai">`+getPKHtml(k)+`<br>♠</a>
                        <a class="but pai">`+getPKHtml(k)+`<br>♠</a>
                    </div>
                `;
            } else {
                html += `
                    <div class="children back" style="top:`+(j*25-1)+`px;z-index:`+(j+1)+`;">
                    </div>
                `;
            }
        }
        html += '</div>';
    }
    document.getElementById("main").innerHTML = html
}

function getPKHtml(pk) {
    if (pk == 1) {
        pk = 'A';
    }
    if (pk == 11) {
        pk = 'J';
    }
    if (pk == 12) {
        pk = 'Q';
    }
    if (pk == 13) {
        pk = 'K';
    }
    return pk;
}

/**
 * 手动选择发牌
 */
function licensing() {
    if (allArr.length == 0) {
        alert('没牌了');
    }
    var s = 10;
    if (allArr.length < 10) {
        s = allArr.length;
    }
    for (i=0;i<s;i++) {
        initPK(i%10, true)
    }
}