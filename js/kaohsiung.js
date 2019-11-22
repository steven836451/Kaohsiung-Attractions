var alldata;
// function getData(){
//     var xhr = new XMLHttpRequest();
    
//     var url = 'js/kaohsiung.json';
//     xhr.open('get',url,true);
    
//     xhr.onload = function(){
//         if(xhr.readyState == 4){
//             if(xhr.status == 200){
//                 console.log(xhr)
//                 alldata = JSON.parse(xhr.responseText);
//             }
//         }
//     }
//     xhr.send(null);
//     console.log(alldata)
    
// }
// getData();


var dataArray=[];
function getData(){
    var url = ['https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97','https://data.kcg.gov.tw/api/action/datastore_search?offset=100&resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97','https://data.kcg.gov.tw//api/action/datastore_search?offset=200&resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97'];
    for (let i=0;i<url.length;i++){
        let xhr = new XMLHttpRequest();
        xhr.open('get',url[i],false); // 目前暫用false，未來謹記若要使用開放資料需用AJAX方式帶入!!
        xhr.onload = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    console.log(xhr);
                    dataArray.push(JSON.parse(xhr.responseText).result.records);
                }
            }
        }
        xhr.send(null);
    }
    
}

getData();
alldata = dataArray[0].concat(dataArray[1]).concat(dataArray[2]);


var dataLen = alldata.length; 
var allDistrict = document.querySelector('.allDistrict');
var allAttractions = document.querySelector('.allAttractions');
var hotBtn = document.querySelector('.hotBtn'); 
var district = '全部地區';
var pageList = document.querySelector('.pageList');
var allPage = document.querySelectorAll('.allPage');
var chooseData = [];
var newData = [];
var pageNum = '';
var currentPage = 1;








function updateDistrict(){
    var districtBox = [];
    for(i=0;i<dataLen;i++){
        if(districtBox.includes(alldata[i].Zone)){
            continue;
        }
        else{
            districtBox.push(alldata[i].Zone);
        }
    }

    for(j=0;j<districtBox.length;j++){
        var option = document.createElement('option');
        option.textContent = districtBox[j];
        allDistrict.appendChild(option);
    }
    
}

function updateAttraction(array){
        for(i=0;i<array.length;i++){
            
            var attractions = document.createElement('div');
            attractions.classList.add('attractions');

            var pic = document.createElement('div');
            pic.classList.add('pic');

            var introduction = document.createElement('div');
            introduction.classList.add('introduction');
            pic.style.backgroundImage = `url('${array[i].Picture1}')`;

            var name = document.createElement('h3');
            name.textContent = array[i].Name;

            var zone = document.createElement('h4')
            zone.textContent = array[i].Zone;

            //插入Opentime並確認opentime文字長度，避免破版
            var openTime = document.createElement('p');
            openTime.textContent = array[i].Opentime;
            openTime.classList.add('openTime');
            if(array[i].Opentime.length > 28){
                openTime.classList.add('p_overflow');
                openTime.setAttribute('data-overflow',array[i].Opentime);
            }

            //插入Add並確認add文字長度，避免破版
            var add = document.createElement('p');
            add.textContent = array[i].Add;
            add.classList.add('add');
            if(array[i].Add.length > 28){
                add.classList.add('p_overflow');
                add.setAttribute('data-overflow',array[i].Add);
            }

            //插入聯絡資訊
            var telephone = document.createElement('p');
            telephone.textContent = array[i].Tel;
            telephone.classList.add('telephone');

            //若為免費參觀則在右下角註記
            if(array[i].Ticketinfo == '免費參觀'){
                var ticketInfo = document.createElement('p');
                ticketInfo.textContent = array[i].Ticketinfo;
                ticketInfo.classList.add('ticketInfo');
                introduction.appendChild(ticketInfo);
            }
            

            //以增加子節點的方式來新增各景點
            pic.appendChild(name);
            pic.appendChild(zone);
            pic.setAttribute('data-num',i);

            introduction.appendChild(openTime);
            introduction.appendChild(add);
            introduction.appendChild(telephone);
            

            attractions.appendChild(pic);
            attractions.appendChild(introduction);
            
            allAttractions.appendChild(attractions);

        }
               
}
//更新newData二維陣列，以用來做分頁監聽
function updateNewData(array){
    //渲染分頁頁數
    renderPage(array);
    newData = [];
    for(i=0;i<array.length;i++){
        if( i % 8 === 0) {
            newData.push([]);
        }
        var pageNum = parseInt(i / 8);
        newData[pageNum].push(array[i]);
    }
    
}

updateDistrict();
updateNewData(alldata);
updateAttraction(newData[0]);
scrollTo({ top: 0, behavior: 'smooth' });



// 渲染所點擊的景點
function newDistrict(e){
    allAttractions.innerHTML = '';
    chooseData = [];
    district = e.target.value;
    document.querySelector('h2').textContent = district;
    
    if(district == '全部地區'){
        updateNewData(alldata);
        updateAttraction(newData[0]);
    }
    else{
        for(i=0;i<dataLen;i++){
            if(district == alldata[i].Zone){
                chooseData.push(alldata[i]);
            }
        }
        updateNewData(chooseData);
        updateAttraction(newData[0]);
    }
}

//渲染頁數
function renderPage(array){
    var divide = 8;
    currentPage = 1;
    pageList.innerHTML = '';
    
    if(array.length%divide == 0){
        pageNum = array.length/divide;
    }
    else{
        pageNum = parseInt(array.length/divide + 1);
    }
    

    //以增加節點方式插入頁碼(包含prev/next)
    var prev = document.createElement('span');
    prev.textContent = '< Prev';
    prev.classList.add('prev');
    pageList.appendChild(prev);

    
    for(i=1;i<pageNum+1;i++){
        var pages = document.createElement('span');
        pages.classList.add('allPage');
        pages.textContent = i;
        pageList.appendChild(pages);
    }

    var next = document.createElement('span');
    next.textContent = 'Next >';
    next.classList.add('next');
    pageList.appendChild(next);

    
    var allPage = document.querySelectorAll('.allPage');
    allPage[0].setAttribute('style','color:blue');
    
    //若頁數過大做處理
    if(pageNum > 21){
        for(i=21;i<pageNum;i++){
            allPage[i].classList.add('pageOverflow');
        }
    }
    
    if(currentPage == 1){
        prev.classList.add('disable');
    }
    if(currentPage == pageNum){
        next.classList.add('disable');
    }
    allPage[currentPage-1].classList.add('currentPage');
}

function newPage(e){
    var allPage = document.querySelectorAll('.allPage');
    var prevPage = document.querySelector('.prev');
    var nextPage = document.querySelector('.next');
    var num = parseInt(e.target.textContent);
    
    if(currentPage == 1 && e.target.textContent == '< Prev'){return};
    if(currentPage == pageNum && e.target.textContent == 'Next >'){return};
    

    if(e.target.nodeName !== 'SPAN'){return};
    if(num == currentPage){return};
    allPage[currentPage-1].classList.remove('currentPage');

    //清除先前新增的style
    allPage[currentPage-1].removeAttribute('style');
    

    
    //清空當前全部景點資訊
    allAttractions.innerHTML = '';
    if( e.target.textContent == '< Prev'){
        nextPage.classList.remove('disable');
        currentPage -= 1;
        updateAttraction(newData[currentPage-1]);
        allPage[currentPage-1].setAttribute('style','color:blue');
        if(currentPage == 1){
            prevPage.classList.add('disable');
        }
    }

    if( e.target.textContent == 'Next >'){
        prevPage.classList.remove('disable');
        currentPage += 1;
        updateAttraction(newData[currentPage-1]);
        allPage[currentPage-1].setAttribute('style','color:blue');
        if(currentPage == pageNum){
            nextPage.classList.add('disable');
        }
    }
    
    if(!isNaN(num)){
        
        if(num !== 1){
            prevPage.classList.remove('disable');
        }
        else if(num == 1){
            prevPage.classList.add('disable');
        }
        if(num == pageNum){
            nextPage.classList.add('disable');
        }
        else if(num !== pageNum){
            nextPage.classList.remove('disable');
        }
        updateAttraction(newData[num-1]);
        allPage[num-1].setAttribute('style','color:blue');
        currentPage = num;
    }

    if(pageNum>21){
        for(i=0;i<allPage.length;i++){
            allPage[i].classList.add('pageOverflow');
        }
        if(currentPage < 12){
            for(i=0;i<21;i++){
                allPage[i].classList.remove('pageOverflow');
            }
        }
        else if(currentPage > pageNum-10){
            for(i=pageNum-21;i<pageNum;i++){
                allPage[i].classList.remove('pageOverflow');
            }
        }
        else{
            for(i=currentPage-11;i<currentPage+10;i++){
                allPage[i].classList.remove('pageOverflow');
            }
        }
    }
    allPage[currentPage-1].classList.add('currentPage');
    scrollTo({ top: 500, behavior: 'smooth' });
}

function detail(e){
    if(e.target.classList != 'pic'){return}
    var popUp =document.querySelector('.popUp');
    var headName =document.querySelector('.headName');
    var close =document.querySelector('.close');
    var popPic =document.querySelector('.popPic');
    var popContent =document.querySelector('.popContent');
    var attractionNum = e.target.dataset.num;
    
    headName.innerHTML = '';
    popPic.innerHTML = '';
    popContent.innerHTML = '';

    popUp.classList.remove('popHidden');

    headName.textContent = newData[currentPage-1][attractionNum].Name;
    var img = document.createElement('img');
    img.src = `${newData[currentPage-1][attractionNum].Picture1}`;
    popPic.appendChild(img);
    popContent.textContent = newData[currentPage-1][attractionNum].Description;


    close.addEventListener('click',function(){
        popUp.classList.add('popHidden')
        
    },false)
}



allDistrict.addEventListener('change',newDistrict,false);
hotBtn.addEventListener('click',newDistrict,false);
pageList.addEventListener('click',newPage,false);
allAttractions.addEventListener('click',detail,false);
// 當頁面捲動超過至1000時，顯示goTop
window.addEventListener('scroll',function(){
    var goTop = document.querySelector('.goTop');
    if(window.scrollY < 1100){
        goTop.classList.add('hidden');
    }
    else{
        goTop.classList.remove('hidden');
    }
    goTop.addEventListener('click',function(){
        scrollTo({ top: 500, behavior: 'smooth' });
    },false)
})