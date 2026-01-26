
let yaerElements = [];
let monthElements = [];
let streamElements = [];

yearColumnTemp = document.querySelector('.yearColumn')

function Init(){
    //dateの整理
    let years = streamData['years'];

    for(let year of years){
        //年リストの作成
        console.log(`${year}年:`)

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

            console.log(` ${yearMonthValue}月`)
            
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
                    dayElement = document.createElement('li');
                    dayElement.className = 'dayColumn';
                    dayUl = document.createElement('ul');
                    dayElement.appendChild(dayUl);
                    
                    monthUl.appendChild(dayElement)
                }

                console.log(`  ${monthVideoDay}日`)

                let videoElement = document.createElement('li');
                videoElement.className = 'videoElement';
                videoElement.dataset.id = monthVideoId;
                //サムネイル
                let monthVideoThumDiv = document.createElement('div');
                monthVideoThumDiv.className = 'thumbnail';
                let monthVideoThumbnail = document.createElement('img');
                monthVideoThumbnail.setAttribute('src', `./thumbnails/${monthVideoId}${monthVideoThumExt}`)
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

function showDetails(videoId){
    console.log(videoId)
}

Init();