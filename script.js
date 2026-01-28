
let yaerElements = [];
let monthElements = [];
let streamElements = [];

yearColumnTemp = document.querySelector('.yearColumn')
chatElementTemp = document.querySelector('.chatElement');

function Init(){
    //詳細のやつ消す
    selectDetails.style.display = 'none';
    details.style.display = 'none';

    //dateの整理
    let years = streamData['years'];
    let thumbnailPath = script.dataset.permission == 'public'? 'thumbnails':'thumbnails_member'

    for(let year of years){
        //年リストの作成
        //console.log(`${year}年:`)

        let yearElement = document.createElement('li');
        yearElement.className ='yearColumn';
        let yearH2 = document.createElement('h2');
        yearH2.textContent = `${year}年`;
        yearH2.className = 'yearText';
        yearElement.appendChild(yearH2);
        let yearUl = document.createElement('ul');
        yearElement.appendChild(yearUl);
        streamList.appendChild(yearElement);

        //月リストの作成
        yearMonths = streamData['months'].filter(month => month[1] == year);
        for(let yearMonth of yearMonths){
            yearMonthId = yearMonth[0];
            yearMonthValue = Number(yearMonth[2]);  

            //console.log(` ${yearMonthValue}月`)
            
            let monthElement = document.createElement('li');
            monthElement.className = 'monthColumn';
            let monthH3 = document.createElement('h3');
            monthH3.textContent = `${yearMonthValue}月`;
            monthH3.className = 'monthText';
            monthElement.appendChild(monthH3);
            let monthUl = document.createElement('ul');
            monthElement.appendChild(monthUl)
            yearUl.appendChild(monthElement);

            //月リストに日リストと動画を追加
            monthVideos = streamData['videos'].filter(video => video[1] == yearMonthId);
            beforeDate = ''
            let dayElement;
            let dayUl;
            for(let monthVideo of monthVideos){
                monthVideoId = monthVideo[0];
                monthVideoMonthId = monthVideo[1];
                monthVideoDay = Number(monthVideo[2]);
                monthVideoTitleText = monthVideo[3];
                monthVideoThumExt = monthVideo[4];
                monthVideoIsLive = monthVideo[5];

                if(beforeDate != monthVideoDay){
                    beforeDate = monthVideoDay;
                    //console.log(`  ${monthVideoDay}日`)

                    dayElement = document.createElement('li');
                    dayElement.className = 'dayColumn';
                    dayUl = document.createElement('ul');
                    dayElement.appendChild(dayUl);
                    
                    monthUl.appendChild(dayElement)
                }

                let videoElement = document.createElement('li');
                videoElement.className = 'videoElement';
                videoElement.dataset.id = monthVideoId;

                //関数をセット
                videoElement.onclick = showDetails;

                //サムネイル
                let monthVideoThumDiv = document.createElement('div');
                monthVideoThumDiv.className = 'thumbnail';
                let monthVideoThumbnail = document.createElement('img');
                monthVideoThumbnail.setAttribute('src', `./${thumbnailPath}/${monthVideoId}${monthVideoThumExt}`)
                monthVideoThumDiv.appendChild(monthVideoThumbnail);
                videoElement.appendChild(monthVideoThumDiv);

                //動画説明
                let monthVideoDescription = document.createElement('div');
                monthVideoDescription.className = 'videoDescription';
                //タイトル
                let monthVideoTitleDiv = document.createElement('div');
                monthVideoTitleDiv.className = 'videoTitle';
                let monthVideoTitle = document.createElement('h4');
                monthVideoTitle.textContent = monthVideoTitleText;
                monthVideoTitleDiv.appendChild(monthVideoTitle);
                monthVideoDescription.appendChild(monthVideoTitleDiv);
                //日付と動画種別
                let monthVideoDetails = document.createElement('div');
                monthVideoDetails.className = 'videoDetails';
                let monthVideoDate = document.createElement('p');
                monthVideoDate.textContent = `${year}/${yearMonthValue}/${monthVideoDay}`;
                let monthVideoType = document.createElement('p');
                monthVideoType.textContent = monthVideoIsLive=='premirer'? 'プレミア公開':monthVideoIsLive? '配信':'動画';
                monthVideoDetails.appendChild(monthVideoDate);
                monthVideoDetails.appendChild(monthVideoType);
                monthVideoDescription.appendChild(monthVideoDetails);
                videoElement.appendChild(monthVideoDescription);
                dayUl.appendChild(videoElement)
            }
        }
    }
}

function joinMessage(message, element){
    for(let mes of message){
        let span = document.createElement('span');
        span.className = 'chatMessageText';

        if(mes[0] == 'text'){
            span.textContent = mes[1];
        }
        else if(mes[0] == 'emoji'){
            let img = document.createElement('img');
            let emojiUrl = ''
            if(mes[1] == 'custom'){
                emojiUrl = './customEmoji/'+mes[2];
            }
            else if(mes[1] == 'normal'){
                emojiUrl = mes[2];
            }
            img.setAttribute('src', emojiUrl);
            img.className = 'emoji';
            span.appendChild(img);
        }

        element.appendChild(span);
    }
}

function showDetails(){
    liveChatList.style.display = 'block';
    //テンプレート以外空にする
    while(1 < liveChatList.childElementCount){
        liveChatList.removeChild(liveChatList.lastChild);
    }

    let videoId = this.dataset.id;

    let liveChatDataList = streamData.chats.filter(chat => chat[1] == videoId);
    //selectDetails.style.display = 'block';
    details.style.display = 'block';

    //各チャットの要素を追加
    let count = 0
    for(let liveChat of liveChatDataList){
        let liveChatElement = chatElementTemp.cloneNode(true);
        liveChatElement.style.display = 'block';
        
        //要素の整理
        let chatType = liveChat[2];
        let authorId = liveChat[3];
        let authorBadge = liveChat[5]
        let message = liveChat[6];
        let timestamp = liveChat[7];
        //ユーザーの情報
        let chatAuthor = streamData.users.find(user => user[0] == authorId);
        let authorName = chatAuthor[2];
        let authorIconUrl = chatAuthor[3];

        if(chatType != 'gifted'){
            //アイコン
            let iconDiv = liveChatElement.querySelector('.chatLeftContent');
            let iconImage = document.createElement('img');
            iconImage.setAttribute('src', authorIconUrl);
            iconImage.className = 'channelIcon';
            iconDiv.appendChild(iconImage)

            //バッジ
            if(authorBadge){
                liveChatElement.classList.add('membersChat');
                let img = document.createElement('img');
                img.className = 'badge';
                img.src = `./badges/${authorBadge}`;
                liveChatElement.querySelector('.chatAuthorBadge').appendChild(img);
            }
        }

        //コメ主
        let authorDiv = liveChatElement.querySelector('.chatAuthor');
        authorDiv.textContent = authorName;

        //チャット内容
        if(chatType == 'text'){
            console.log(`${count} text ${timestamp} ${authorName}${authorBadge?'📛':''}`);

            //タイムスタンプ
            let timestampDiv = liveChatElement.querySelector('.chatTimestamp');
            timestampDiv.textContent = timestamp;
            //メッセージ
            joinMessage(message, liveChatElement.querySelector('.chatFirstContent'));
        }
        else if(chatType == 'member' || chatType == 'memberMile'){
            console.log(`${count} ${chatType} ${timestamp} ${authorName}${authorBadge?'📛':''}`);
            liveChatElement.classList.add(chatType+'Renderer');

            liveChatElement.querySelector('.chatTimestamp').style.display = 'none';
            
            let headerSubText = liveChat[8];
            let headerPrimaryText = liveChat[9];
            if(headerPrimaryText){
                joinMessage(headerPrimaryText, liveChatElement.querySelector('.chatSecondContent'))
                liveChatElement.querySelector('.chatThirdContent').textContent = headerSubText;
            }
            else{
                joinMessage(headerSubText, liveChatElement.querySelector('.chatThirdContent'))
            }

            if(message){
                joinMessage(message, liveChatElement.querySelector('.liveChatBottomContent'));
            }
            else{
                liveChatElement.querySelector('.liveChatBottomContent').style.display = 'none';
            }
        }

        liveChatList.appendChild(liveChatElement);
        count++
    }

    liveChatList.scrollIntoView()
    liveChatList.scrollTop = 0;
}

Init();