$(document).ready(function(){
    // 메인페이지 슬라이더
    $('.mainPage').length && mainSlider();

    // 메인 페이지를 제외한 나머지 페이지 탭 공통
    tabClick();

    // 인풋 유효성 검사
    inputInput()

    // submit 관련 클릭 이벤트
    submitClick();

    // 팝업 관련 클릭 이벤트
    popupClick();

    // 리딩방
    $('.readingPage').length && readingEvent();

    // 핸드폰 인증
    $('.certificationBox').length && mobileConfirm();

    // 이름 닉네임 버튼
    !!$('[data-input="nickName"] , [data-input="name"]').length && nameNickname();

    // 전문가 추가 / 변경 신청
    $('.expertBox').length && expertEvent()

    // 셋팅 프로필
    $('.profilePage').length && profileEvent();
    // 셋팅 알람
    $('.alramPage').length && alremEvent();
    // 셋팅 돈풍선 충전 내역
    $('.historyPage').length && moneyHistory()
    // 셋팅 간편 결제 정보
    $('.paymentPage').length && paymentEvent()
    // 셋팅 로그인
    $('.loginPage').length && settingLoginEvent();
})

function mainSlider(){
    var openSwiper = new Swiper(".slideBox .openSwiper", {
        spaceBetween: 10,
        slidesPerView: 1,
        grid: {
            rows: 2,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
    var eventSwiper = new Swiper(".slideBox .eventSwiper", {
        spaceBetween: 16,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    })
    let sliderContent = []
    $('.slideBox .openSwiper .swiper-slide').each(function(i){
        sliderContent[i] = {
            content : $(this),
            attrName : $(this).attr('data-tab')
        }
    })
    $('.slideBox .tabBtn li button').click(function(){
        $(this).parent().addClass('active').siblings().removeClass('active');
        const tabName = $(this).attr('data-tab');
        $(`[data-tab="contentArea"] [data-tab]`).remove();
        if(tabName === 'all'){
            sliderContent.map((t)=>{
                $(`[data-tab="contentArea"] .swiper-wrapper`).append(t.content);
            })
        }else{
            sliderContent.map((t)=>{
                t.attrName === tabName && $(`[data-tab="contentArea"] .swiper-wrapper`).append(t.content);
            })
        }
        openSwiper.update();
    })
}

function tabClick(){
    $('.tabBtn li button , .tabBtn-collect li button').click(function(){
        $(this).parent().addClass('active').siblings().removeClass('active');
        let dataTabName = 'data-tab';
        let tabName = $(this).attr(dataTabName);
        if(!tabName){
            dataTabName = 'data-tab2';
            tabName = $(this).attr('data-tab2');
        }
        if(!tabName){
            dataTabName = 'data-tab3';
            tabName = $(this).attr('data-tab3');
        }
        if(!tabName){
            dataTabName = 'data-tab4';
            tabName = $(this).attr('data-tab4');
        }

        if(tabName === 'all'){
            $(`[${dataTabName}="contentArea"] [${dataTabName}]`).stop().fadeIn();
        }else{
            $(`[${dataTabName}="contentArea"] [${dataTabName}]`).hide();
            tabName !== 'collect' ?
                $(`[${dataTabName}="contentArea"] [${dataTabName}="${tabName}"]`).stop().fadeIn() :
                $(`[${dataTabName}="contentArea"] [${dataTabName}="${tabName}"]`).stop().fadeIn().css('display','flex');
        }
    })

    
}

// input 유효성 검사
function inputValidation(selector){
    const attrName = $(selector).attr('data-input');
    let boolean;
    attrName === 'mobile' && (boolean = /^01(\d{9,9})/.test($(selector).val()));
    attrName === 'password' && (boolean = /[a-zA-Z0-9]{6,6}/.test($(selector).val()));
    attrName === 'password-re' && (boolean = $(selector).val() === $('[data-input="password"]').val());
    if(attrName === 'oldPassword'){
        // 셋팅 로그인 간편 비밀번호 - 기존 비밀번호
        boolean = $(selector).val() === '123456'
    }
    attrName === 'confirm' && (boolean = /^\d{6,6}/.test($(selector).val()));
    attrName === 'checkbox' && (boolean = $(selector).is(':checked'));
    attrName === 'name' && (boolean = /^[가-힣]{2,4}$/.test($(selector).val()));
    // 닉네임 중복 확인
    if(attrName === 'nickName') {
        let nickNameCheck = $(selector).val() === '테스트';
        
        // nickNameCheck true 중복X , false 중복O
        if(nickNameCheck || $(selector).val() === ''){
            boolean = false;
        }else{
            boolean = true;
        }
    };
    attrName === 'charge' && (boolean = $(selector).val() !== '');
    attrName === 'yearMonthDay' && (boolean = $(selector).val() !== '');
    attrName === 'moneyCount' && (boolean = (Number(selector.val()) <= Number($('#checkCount').html())));
    return boolean;
}

// input 입력 했을 때
function inputInput(){
    $('[data-input]').on('input' , function(){
        const boolean = inputValidation($(this))
        errorMessageActive($(this) , boolean);
        submitActive($(this).closest('form'));
        if(!!$(this).attr('data-boolean')){
            let buttonSelector = $(this).parent().siblings('button');
            boolean ? buttonSelector.addClass('active') : buttonSelector.removeClass('active');
        }
    })

    // 동의
    $('[id*="all"]').length && inputCheckbox();
}

// 동의
function inputCheckbox(){
    // 체크 박스  전체 동의
    $('[id*="all"]').on('input',function(){
        if($(this).is(':checked')){
            $('input[type="checkbox"]').prop('checked', true)
        }else{
            $('input[type="checkbox"]').prop('checked', false)
        }
        submitActive($(this).closest('form'));
    })

    // 체크 박스 개별
    $('[type="checkbox"]').not('[id*="all"]').on('input',function(){
        let agreeCheck = $('[type="checkbox"]').not('[id*="all"]').get().every((c)=>{
            return $(c).is(':checked');
        });
        if(agreeCheck){
            $('[id*="all"]').prop('checked', true)
        }else{
            $('[id*="all"]').prop('checked', false)
        }
        submitActive($(this).closest('form'));
    })
}


// 유효성 검사 통과하면 submit 색상
function submitActive(selector){
    // 필수항목 입력 값 유효성 검사
    let inputBoolean = selector.find('[required]').get().every((a)=>{
        let boolean = inputValidation(a)
        return boolean === true;
    })
    // 에러메세지가 있는지 없는지 확인
    let errorBoolean = !errorTextConfirm();
    
    
    // 인증이 완료 되었는 지 확인
    if(!!selector.find('[data-boolean]').length){
        let confirmChack = $('[data-boolean]').get().every(function(b){
            return JSON.parse($(b).attr('data-boolean'));
        })
        if(!confirmChack){
            return
        }
    } 

    // 셋팅 알람 , 셋팅 로그인 페이지 초기값 변경값 비교
    if(!!selector.find('[data-checked]').length){
        let alramChack = selector.find('[data-checked]').get().every(function(c){
            return JSON.parse($(c).attr('data-checked')) === $(c).is(':checked');
        })
        alramChack ? 
            inputBoolean = false : 
            inputBoolean = true;
    }

    // 전문가 검색
    if(!!selector.find('[data-expert]').length){
        let expertChack = selector.find('[data-expert]').get().every(function(c){
            return JSON.parse($(c).attr('data-expert'));
        })
        expertChack ? 
            inputBoolean = true :
            inputBoolean = false;
    }

    // input 값 , 에러메세지가 둘 다 true 면 submit 버튼에 active 클래스 추가
    if(inputBoolean && !errorBoolean){
        selector.find('input[type="submit"]').addClass('active')
    }else{
        selector.find('input[type="submit"]').removeClass('active');
    }
}

// 에러메세지 추가 / 제거
function errorMessageActive(selector , boolean){
    const errorSeletor = selector.parent().siblings('.errorText');
    (boolean) ? 
        errorSeletor.removeClass('active') : 
        errorSeletor.addClass('active');

    (selector.attr('data-input') === 'nickName' && !selector.val()) &&
        errorSeletor.removeClass('active')
}

// 에레메시지 확인
function errorTextConfirm(){
    return $('.errorText').get().every((a)=>{
        return !$(a).hasClass('active');
    })
}

// submit 클릭 이벤트
function submitClick(){
    let inputAttr = 'id';
    let inputValue = []
    let resultValue = {}
    $('input[type="submit"]').click(function(e){
        inputValue = []
        resultValue = {}
        if(!$(this).hasClass('active')){ 
            e.preventDefault();
            // input 값이 잘 못 되었다면
            $('[required]').each(function(){
                const boolean = inputValidation($(this));
                errorMessageActive($(this) , boolean);
            })
            let invalidInput = $('[required]').get().find((v)=>{
                return $(v).parent().siblings('.errorText').hasClass('active') || !$(v).val();
            })
            if(invalidInput){
                invalidInput.focus();
            }
            return
        };
        

        // 인풋에서 받아 온 필수 값
        $(this).closest('form').find('[required]').each(function(i){
            if(!$(this).attr(inputAttr)) return;
            inputValue[i] = {
                selector : $(this),
                name : $(this).attr(inputAttr),
                // value : $(this).val(),
                value : $(this).attr('type') !== 'checkbox' ? $(this).val() : $(this).is(':checked'),
                errorSelector : $(this).parent().siblings('.errorText')
            };
        })

        // 인풋에서 받아 온 필수가 아닌 값
        $(this).closest('form').find('input').not('[required]').not('[type="submit"]').not('[type="radio"]').each(function(i){
            if(!$(this).attr(inputAttr)) return;
            inputValue.push( {
                selector : $(this),
                name : $(this).attr(inputAttr),
                value : $(this).attr('type') !== 'checkbox' ? $(this).val() : $(this).is(':checked'),
                errorSelector : $(this).parent().siblings('.errorText')
            });
            // inputValue[(inputValue.length - 1) + i].value = $(this).attr('type') !== 'checkbox' ? $(this).val() : $(this).is(':checked')
        })

        $(this).closest('form').find('textarea').each(function(){
            inputValue.push( {
                selector : $(this),
                name : $(this).attr(inputAttr),
                value : $(this).val()
            });
        })

        // 전문가 검색
        if($('.expertBox').length){
            $(this).closest('form').find('[type="radio"]:checked').each(function(){
                inputValue.push( {
                    selector : $(this),
                    name : $(this).attr('name'),
                    value : $(this).attr('id')
                });
            })
        }

        // 최종 resultValue 값
        inputValue.map((v)=>{
            resultValue[v.name] = v.value
        })
        // e.preventDefault();
        console.log(resultValue);
        
        // 로그인 관련 
        $(this).attr('id') === 'signIn' && mobileAndPW('signIn' , e);
        $(this).attr('id') === 'mobileChange' && mobileAndPW('mobileChange' , e);

        $(this).attr('id') === 'newMobile' && mobileConfirm('newMobile' , e);
        $(this).attr('id') === 'firstSignIn' && mobileConfirm('firstSignIn' , e);
        $(this).attr('id') === 'guestSignIn' && mobileConfirm('guestSignIn' , e);

        $(this).attr('id') === 'passwordChange' && passwordChange(e);
        $(this).attr('id') === 'firstSingUp' && firstSingUp(e);
        $(this).attr('id') === 'guestSingUp' && guestSingUp(e);
        
        
        $(this).attr('id') === 'readingGift' && readingGift(e);
        $(this).attr('id') === 'profile' && settingProfile(e);
        $(this).attr('id') === 'alram' && settingAlram(e);
        $(this).attr('id') === 'chargeSubmit' && settingHistory_charge(e);
        $(this).attr('id') === 'expert' && settingExpert(e);
        $(this).attr('id') === 'loginSetting' && settingLogin_setting(e);
        $(this).attr('id') === 'loginPassword' && settingLogin_password(e);
        $(this).attr('id') === 'historyCharge' && settingHistory_search('historyCharge' , e);
        $(this).attr('id') === 'historyGift' && settingHistory_search('historyGift' , e);
        $(this).attr('id') === 'historyUse' && settingHistory_search('historyUse' , e);

    })

    // 로그인 , 휴대폰 전화번호 변동 페이지 submit 클릭
    function mobileAndPW(pageName , e){
        pageName === 'signIn' && console.log('로그인');
        pageName === 'mobileChange' && console.log('휴대폰 전화번호 변동');

        console.log(resultValue);
        // resultValue : 최종 값
        // resultValue.userMobile : 전화번호
        // resultValue.userPassword : 비밀번호
        // resultValue.autoSignIn : 자동로그인 (boolean)
        let IDCheck;
        let PWCheck;
        
        
        // 테스트용 나중에 삭제
        let testID = '01092931656';
        let testPW = '123456'
        resultValue.userMobile === testID ? (IDCheck = true) : (IDCheck = false);
        resultValue.userPassword === testPW ? (PWCheck = true) : (PWCheck = false);

        // 아이디가 없으면
        if(!IDCheck){
            inputValue.map((v)=>{
                v.name === 'userMobile' && (v.selector.focus() , v.errorSelector.addClass('active'));
                v.name === 'userPassword' && v.selector.val('')
            })
        }
        // 아이디가 있고 비밀번호가 틀리면
        if(IDCheck && !PWCheck){
            inputValue.map((v)=>{
                if(v.name === 'userPassword'){
                    v.selector.focus();
                    v.selector.val('');
                    v.errorSelector.addClass('active');
                }
            })
        }


        // 에러 메세지가 없으면  
        var result = errorTextConfirm();

        
        // 값이 맞으면
        if(result){
            // 폼으로 데이터 전송 시 삭제
            e.preventDefault();
            pageName === 'signIn' && (location.href = '../index.html');
            pageName === 'mobileChange' && (location.href = 'newMobile.html');
            // 폼으로 데이터 전송 시 삭제 fin
        }else{
            pageName === 'mobileChange' && $('.popupArea').fadeIn().css('display','flex')
            $('input[type="submit"').removeClass('active');
            e.preventDefault();
        }
    }

    // 신규 전화번호 인증 , 회원가입 (게스트 , 최초) 페이지 submit 클릭
    function mobileConfirm(pageName , e){
        pageName === 'newMobile' && console.log('신규 휴대폰 인증');
        pageName === 'firstSignIn' && console.log('최초 회원가입 휴대폰 인증');
        pageName === 'guestSignIn' && console.log('게스트 회원가입 휴대폰 인증');

        console.log(resultValue);
        // resultValue : 최종 값
        // resultValue.mobile : 전화번호
        // resultValue.confirm : 인증번호 (여기까지 왔다면 인증 완료)

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
        pageName === 'newMobile' && (location.href = 'mobileChange.html');
        pageName === 'firstSignIn' && (location.href = 'singUp.html');
        pageName === 'guestSignIn' && (location.href = 'singUp.html');
    }

    // 간편 비밀번호 변경 페이지 submit클릭
    function passwordChange(e){
        console.log('간편 비밀번호 변경');
        // resultValue : 최종 값
        // resultValue.mobile : 전화번호
        // resultValue.userPassword : 비밀번호
        // resultValue.password-re : 비밀번호 확인
        // resultValue.confirm : 인증번호 (여기까지 왔다면 인증 완료)

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
        location.href = '../index.html'
        // 폼으로 데이터 전송 시 삭제 fin
    }

    // 최초 회원가입 페이지
    function firstSingUp(e){
        console.log('최초 회원가입');
        // resultValue : 최종 값
        // resultValue.userPassword : 비밀번호
        // resultValue.password-re : 비밀번호 확인
        // resultValue.allAgree : 전체 동의 ( boolean )
        // resultValue.termsOfService : 서비스 이용 약관 동의 ( boolean )
        // resultValue.collectionAndUse : 개인정보 수집 및 이용 동의 ( boolean )
        // resultValue.providedByThirdParties : 개인정보 제3자 제공 ( boolean )
        // resultValue.marketingReception : 마케팅 정보 수신 동의 ( boolean )

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
        location.href = '../../index.html'
    }

    // 게스트 회원가입 페이지
    function guestSingUp(e){
        console.log('게스트 회원가입');
        // resultValue : 최종 값
        // resultValue.userPassword : 비밀번호
        // resultValue.password-re : 비밀번호 확인
        // resultValue.userName : 사용자 이름 (여기까지 왔다면 확인 완료)
        // resultValue.userNicName : 사용자 닉네임 (여기까지 왔다면 중복 확인 완료)
        // resultValue.allAgree : 전체 동의 ( boolean )
        // resultValue.termsOfService : 서비스 이용 약관 동의 ( boolean )
        // resultValue.collectionAndUse : 개인정보 수집 및 이용 동의 ( boolean )
        // resultValue.providedByThirdParties : 개인정보 제3자 제공 ( boolean )
        // resultValue.marketingReception : 마케팅 정보 수신 동의 ( boolean )

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
        location.href = '../../index.html'
    }

    // 리딩방 돈풍선 선물
    function readingGift(e){
        console.log('리딩방 돈풍선 선물');
        // resultValue : 최종 값
        // resultValue.search2 : 전문가 이름
        // resultValue.moneyGift : 돈풍선 갯수 (string)
        // resultValue.moneyMessage : 선물 메세지

        
        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
    }

    // 셋팅 프로필
    function settingProfile(e){
        console.log('셋팅 프로필');
        // resultValue : 최종 값
        // resultValue.userNickName : 닉네임
        // resultValue.userMessage : 메세지

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        $('.confirmPopup').fadeIn().css('display' , 'flex')
    }

    // 셋팅 알림
    function settingAlram(e){
        console.log('셋팅 알람');
        // resultValue : 최종 값
        // resultValue.allSet : 전체 설정 ( boolean )
        // resultValue.readingNotice : 리빙방 알림 ( boolean )
        // resultValue.readingSignals : 리딩방 매수 / 매도 신호 ( boolean )
        // resultValue.receivePush : 푸시 수신 ( boolean )
        // resultValue.receiveText : 문자 수신 ( boolean )

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        $('.confirmPopup').fadeIn().css('display','flex');
        $('input[type="submit"]').removeClass('active');
        alremEvent();
    }

    // 셋팅 돈풍선 충전 내역 - 충전
    function settingHistory_charge(e){
        console.log('셋팅 돈풍선 충전 내역 - 충전');
        // resultValue : 최종 값
        // resultValue.charge : 충전금액 ( string )
        // resultValue.paymentAgree : 결제 및 약관 동의 ( boolean )
        

         // 폼으로 데이터 전송 시 삭제
         e.preventDefault();
    }

    // 전문가 추가 / 변경 신청
    function settingExpert(e){
        console.log('전문가 추가 / 변경 신청');
        // resultValue : 최종 값
        // resultValue.search : 전문가 이름
        // resultValue.furtherChange : 전문가 추가 / 변경
        //                      expertFurther 추가
        //                      expertChange 변경
        // resultValue.reason : 사유
        //                      reason01 수익률이 좋지 못해서
        //                      reason02 리딩 스타일이 마음에 들지 않아서
        //                      reason03 다른 서버도 체험해보고 싶어서
        //                      reason04 기타
        // resultValue.userMessage : 메세지

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
    }

    // 셋팅 로그인 - 설정
    function settingLogin_setting(e){
        console.log('셋팅 로그인 - 설정');
        // resultValue : 최종 값
        // resultValue.autoLogin : 자동로그인 ( boolean )

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        settingLoginEvent();
        $('input[type="submit"]').removeClass('active');
    }

    // 셋팅 로그인 - 간편 비밀번호 변경
    function settingLogin_password(e){
        console.log('셋팅 로그인 - 간편 비밀번호 변경');
        // resultValue : 최종 값
        // resultValue.oldPassword : 기존 비밀번호
        // resultValue.newPassword : 새 비밀번호
        // resultValue.password-re : 새 비밀번호 확인

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
        $('.confirmPopup').fadeIn().css('display','flex');
    }

    function settingHistory_search(pageName , e){
        pageName === 'historyCharge' && console.log('셋팅 내역페이지 - 돈풍선 충전 내역');
        pageName === 'historyGift' && console.log('셋팅 내역페이지 - 선물한 돈풍선 내역');
        pageName === 'historyUse' && console.log('셋팅 내역페이지 - 돈풍선 사용 내역');
        // resultValue : 최종 값
        // resultValue.charge-start
        // resultValue.gift-start
        // resultValue.use-start : 검색 시작 날짜
        // resultValue.charge-end 
        // resultValue.gift-end 
        // resultValue.use-end : 검색 종료 날짜

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();
    }
}

// 핸드폰 번호 인증번호 전송
function mobileConfirm(){
    $('input[data-input="mobile"]').on('input',function(){
        inputValidation($(this)) ? 
            $('[data-btn="sendConfirm"]').addClass('active') : 
            $('[data-btn="sendConfirm"]').removeClass('active');

        if($('[data-btn="sendConfirm"]').html() === '재전송'){
            $('[data-btn="sendConfirm"]').html('인증번호 전송');
            $('.certificationBox').removeClass('active');
            clearInterval(timer)
        }
    })
    let timer;
    // 인증번호 전송 버튼 클릭
    $('[data-btn="sendConfirm"]').click(function(){
        if($('input[type="submit"]').hasClass('active')){return}
        $(this).removeClass('active');
        let minute = 3;
        let seconds = 0;
        let time = minute + ':' + (seconds >= 10 ? seconds : '0' + seconds)
        let mobileSeletor = $(this).prev().find('[data-input="mobile"]')
        let confirmBoxSelector = $('.certificationBox');
        if(!inputValidation(mobileSeletor)){
            mobileSeletor.focus();
            errorMessageActive(mobileSeletor , inputValidation(mobileSeletor))
        }else{
            // * 인증번호 보내는 코드 넣는 곳


            clearInterval(timer)
            $(this).html('재전송')
            confirmBoxSelector.addClass('active');
            confirmBoxSelector.find('time').html(time)
            confirmBoxSelector.find('[data-input="confirm"]').val('').focus();
            confirmBoxSelector.find('[data-input="confirm"]').attr('data-confirm' , 'false');
            timer = setInterval(() => {
                if(!!minute || !!seconds){
                    if(!seconds){
                        minute--;
                        seconds = 59;
                    }else{
                        seconds--;
                    }
                }else{
                    // 타이머 종료 시점
                    clearInterval(timer)
                    confirmBoxSelector.removeClass('active');
                }
                time = minute + ':' + (seconds >= 10 ? seconds : '0' + seconds)
                confirmBoxSelector.find('time').html(time)
            }, 1000);
        }
        
    })

    // 인증하기 버튼 클릭
    $('[data-btn="confirm"]').click(function(){
        let confirmSeletor = $(this).prev().find('[data-input="confirm"]')
        let erroeMessageSelector = $(this).next('.errorText');
        let confirmChack;

        // * 인증번호가 맞는 지 확인하는 코드 넣는 곳
        // 인증번호가 ex> 123456 이면
        confirmChack = confirmSeletor.val() === '123456'

        // confirmChack가 true면 인증번호가 맞고 ,
        // confirmChack가 false면 인증번호가 틀리다
        if(confirmChack){
            // 속성 값을 변경하여 인증되었는 지 확인
            confirmSeletor.attr('data-boolean' , 'true');
            $(this).removeClass('active')
            clearInterval(timer)
        }else{
            confirmSeletor.focus();
            erroeMessageSelector.addClass('active');
        }
        submitActive($(this).closest('form'));
    })
}

// 이름 , 닉네임
function nameNickname(){
    $('[data-btn="name"]').click(function(){
        let attrName = $(this).attr('data-btn');
        let nameSelector = $(this).prev().find('[data-input="'+attrName+'"]');
        let boolean = inputValidation(nameSelector)
        if(boolean){
            nameSelector.attr('data-boolean' , 'true');
            $(this).removeClass('active');
            submitActive($(this).closest('form'));
        }else{
            nameSelector.focus();
        }
    })
    $('[data-btn="nickName"]').click(function(){
        let attrName = $(this).attr('data-btn');
        let nickNameSelector = $(this).prev().find('[data-input="'+attrName+'"]');
        let boolean = inputValidation(nickNameSelector)
        let doubleCheck = true;
        if(boolean && doubleCheck){
            nickNameSelector.attr('data-boolean' , 'true');
            $(this).removeClass('active');
            submitActive($(this).closest('form'));
        }else{
            nickNameSelector.focus();
        }
    })
}

// 팝업 클릭
function popupClick(){
    // body 클릭시 서브 팝업 닫기
    $('body').click(function(){
        $('[class|="popup"]').hasClass('active') && popupClose($('[class|="popup"]'));

        $('[class|="popup"]').removeClass('active');
    })
    
    $('button').click(function(e){
        // form 태그 안에 있는 button 클릭 자동 새로고침 막기
        e.stopPropagation();
        e.preventDefault();
        const attrName = $(this).attr('data-popup');
        let popupSelector;
        if(attrName === 'next'){ 
            popupSelector = $(this).next()
            popupSelector.fadeIn().css('display','flex').addClass('active')
        }else{
            popupSelector = $(`.popup-${attrName}`);
            popupSelector.fadeIn().addClass('active')
        }


        attrName === 'share' && $(`.popup-${attrName} .errorText`).removeClass('active')
    })
    // 팝업 검은 배경
    $('.popupArea').mousedown(function(){
        popupClose($(this))
    })
    // 팝업 내용 영역
    $(':is(.popupArea , .confirmPopup) > div').mousedown(function(e){
        e.stopPropagation();
    })
    $('[class|="popup"]').click(function(e){
        e.stopPropagation();
    })
    // 팝업 X 버튼
    $('[data-popup="close"]').click(function(){
        popupClose($('[class*="popup"]'))
    })

    // 컨펌 팝업 배경 , 확인 버튼
    $('.confirmPopup , [data-confirm="close"]').mousedown(function(){
        confirmClose()
    })
    

    function popupClose(selector){ 
        selector.stop().fadeOut();
    }

    function confirmClose(){
        popupClose($('.confirmPopup'))
        if($('.profilePage').length){
            popupClose($('[class*="popup"]'));
        }
    }
}

// 리빙방 전용 이벤트
function readingEvent(){

    // 채팅 스크롤 최하단으로 내리기
    chattingScrollBottom()
    function chattingScrollBottom(){
        $('.chattingArea').scrollTop($('.scrollHeight').innerHeight())
    }
    $('[data-popup="next"]').click(function(){
        let nextSelector = $(this).next();
        nextSelector.find('.chattingArea').scrollTop() == 0 &&
        nextSelector.find('.chattingArea').scrollTop(nextSelector.find('.scrollHeight').innerHeight());
    })
    // 채팅 스크롤에 따라 상단 타이틀 영역 blur 처리
    $('.readingPage .contentArea section .chattingArea').scroll(function(){
        ($(this).scrollTop() > 0 && !$('.readingPage .contentArea section .noticeArea').hasClass('active')) ?
            $('.readingPage .contentArea section .titleArea').addClass('blur') :
            $('.readingPage .contentArea section .titleArea').removeClass('blur') ;
    })

    // 좌우 메뉴 열기 / 접기
    $('.readingPage :is(.leftAside , .rightAside) > button').click(function(){
        $(this).parent().toggleClass('active');
    })

    // 채팅 메세지
    $("#test").on('keydown keyup', function (key) {
        // 엔터 치면
        if(key.keyCode == 13 && !key.shiftKey){
            console.log($(this).val());
        }
        // 자동 세로 줄
        $(this).height(1).height( $(this).prop('scrollHeight') );	
        chattingScrollBottom()
      });

    // 채팅 공지사항 열기
    $('[data-notice="open"]').click(function(){
        $('.noticeArea').addClass('active');
        $('.readingPage .contentArea section .titleArea').removeClass('blur')
    })
    // 채팅 공지사항 닫기
    $('[data-notice="close"]').click(function(){
        $('.noticeArea').removeClass('active');
        $('.readingPage .contentArea section .chattingArea').scrollTop() > 0 ?
            $('.readingPage .contentArea section .titleArea').addClass('blur') :
            $('.readingPage .contentArea section .titleArea').removeClass('blur');
    })

    // 참여 인원 드랍박스
    $('[data-btn="drop"]').click(function(){
        $(this).next().stop().slideToggle()
    })

    // 링크 복사
    $('[data-btn="copyLink"]').click(function(){
        var link = $(this).prev().html();
		copyClip(link);
        $(this).parent().siblings('.errorText').addClass('active');
    })
    function copyClip(url){
		var $temp = $('<input>');
		$('body').append($temp);
		$temp.val(url).select();
		document.execCommand('copy');
		$temp.remove();
	}

    // 게시판 분류 클릭시 상세 제거
    $('.tabBtn li button[data-tab2]').click(function(){
        $('.detailBox').hide();
    })

    // 게시판 - 게시글 , 공지사항 클릭시 상세 제거
    $('[data-tab2="contentArea"] .content-board > .scrollBox-board ul li a').click(function(e){
        e.preventDefault();
        $('.detailBox').stop().fadeIn();
    })
    
    // 게시판 - 게시글 , 공지사항 - 상세 하단 버튼 - 목록
    $('[data-tab2="contentArea"] .detail-btnArea [data-btn="listPost"]').click(function(){
        $('.detailBox').stop().fadeOut();

        let title = '목록 클릭 글'
        let time = '목록 클릭글 시간'
        let expertName = '전문가 이름'
        let content = '글 내용'
        // boardDetail(title , time , expertName , content);
    })
    // 게시판 - 게시글 , 공지사항 - 상세 하단 버튼 - 이전글
    $('[data-tab2="contentArea"] .detail-btnArea [data-btn="prevPost"]').click(function(){
        let title = '이전글'
        let time = '이전글 시간'
        let expertName = '전문가 이름'
        let content = '글 내용'
        boardDetail(title , time , expertName , content);
    })
    // 게시판 - 게시글 , 공지사항 - 상세 하단 버튼 - 다음글
    $('[data-tab2="contentArea"] .detail-btnArea [data-btn="nextPost"]').click(function(){
        let title = '다음글'
        let time = '다음글 시간'
        let expertName = '전문가 이름'
        let content = '글 내용'
        boardDetail(title , time , expertName , content);
    })
    
    function boardDetail(title , time , expertName , content){
        $('.detailBox .detail-title p').html(title);
        $('.detailBox .detail-title small').html(`<time>${time}</time>${expertName}`);
        $('.detailBox .scrollBox .detail-content').html(content);
    }

    // 게시판 - 게시글 , 공지사항 - 모아보기
    $('.tabBtn-collect li button').click(function(){
        $('[data-tab3="contentArea"] > div .tabContent-collect > ul li').removeClass('active');
        $('[data-tab3="contentArea"] .downloadArea *').hide();
    })
    $('[data-tab3="contentArea"] > div .tabContent-collect > ul li').click(function(){
        $(this).toggleClass('active')
        let activeLength = $(this).closest('.tabContent-collect').find('li.active').length;
        if(!activeLength){
            $('[data-tab3="contentArea"] .downloadArea *').hide();
        }else{
            $('[data-tab3="contentArea"] .downloadArea *').show();
            $('[data-tab3="contentArea"] .downloadArea').find('p').html(activeLength)
        }
    })
    $('.downloadArea [data-type="delete"]').click(function(){
        alert('누르면 어떻게 되는거지..?')
    })
    $('.downloadArea [data-type="download"]').click(function(){
        alert('다운로드 버튼')
    })

    // 매수 / 매도 내역 버튼
   
    

}

// 셋팅 프로필 전용 이벤트
function profileEvent(){
    $('.popupArea , .confirmPopup , [data-confirm="close"]').mousedown(function(){
        $('form').find('input[type="text"] ,textarea').val('');
        $('form').find('[type="submit"]').removeClass('active');
    })
}

// 셋팅 알람 전용 이벤트
function alremEvent(){
    $('input[type="checkbox"]').each(function(){
        $(this).is(':checked') ? $(this).attr('data-checked' , 'true') : $(this).attr('data-checked' , 'false');
    })
}

// 셋팅 돈풍선 충전 내역
function moneyHistory(){
    // 충전 
    $('input[name="chargeCount"]').on('input',function(){
        if(!$(this).val()){
            paymentPrice('')
            $('input[type="number"]').prop('readonly' , false).val('').focus();
        }else{
            $('input[type="number"]').prop('readonly' , true).val($(this).val())
            paymentPrice($(this).val());
        }

        submitActive($(this).closest('form'));
    })

    $('input[type="number"]').on('input',function(){
        paymentPrice($(this).val())
    })

    function paymentPrice(price){
        price = String(Number(price) * 1000);
        $('#paymentPrice').html(price.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    }

    $('#chargeSubmit').click(function(){
        !$(this).hasClass('active') && $('.confirmPopup').fadeIn().css('display','flex')
    })

    $('[data-popup="next"]').click(function(){
        $('.popupArea form :is(input[type="radio"] , input[type="checkbox"])').prop('checked' , false)
        $('.popupArea form input[type="number"]').val('');
        $('.popupArea form input[type="submit"]').removeClass('active');
        $('#paymentPrice').html('');
    })

    // 달력
    $('body').click(function(e){
        ($(e.target).closest('.calenderArea').length || $(e.target).hasClass('dycalendar-prev-next-btn')) || $('.calenderArea').remove();
        $(e.target).hasClass('dycalendar-prev-next-btn') && calenderAreaClick();
        $(e.target).hasClass('dycalendar-prev-next-btn') && calenderPrevNextBtn();
        $(e.target).hasClass('dycalendar-prev-next-btn') && calenderUnClick();

        
    })


    $('.calenderBox button').click(function(e){
        $('.calenderArea').remove();
        if(!$(this).closest('.calenderBox').find('[data-calender="start"]').attr('data-selectday')){
            $(this).closest('.calenderBox').find('[data-calender="start"]').after('<div class="calenderArea"></div>')
        }else{
            $(this).after('<div class="calenderArea"></div>')
        }
        let calenderAPI = {
            target : '.calenderArea',
            type : 'month',
            prevnextbutton : 'show',
            highlighttargetdate:true,
        };
        if(!!$(this).attr('data-selectday')){
            calenderAPI.year = Number($(this).attr('data-selectyear'));
            calenderAPI.month =  Number($(this).attr('data-selectmonth')) - 1;
            calenderAPI.date = Number($(this).attr('data-selectday'));
        }

        
        dycalendar.draw(calenderAPI)
        if($(this).attr('data-calender') === 'start'){
        }else{
            calenderUnClick()
        }
        calenderAreaClick();
        calenderPrevNextBtn();
    });
    
    function calenderAreaClick(){
        $('.calenderArea .dycalendar-body tr td').off('click');
        $('.calenderArea .dycalendar-body tr td').click(function(){
            $('.calenderArea td').removeClass('dycalendar-target-date')
            $(this).addClass('dycalendar-target-date')

            let year = $(this).closest('.dycalendar-month-container').find('[data-userYear]').html();
            let month = $(this).closest('.dycalendar-month-container').find('[data-userMonth]').html();
            let day = $(this).html();
            
            $(this).closest('.calenderArea').siblings('button').addClass('active');
            $(this).closest('.calenderArea').siblings('button').attr('data-selectyear' , year)
            $(this).closest('.calenderArea').siblings('button').attr('data-selectmonth' , month)
            $(this).closest('.calenderArea').siblings('button').attr('data-selectday' , day)
            month = month.length === 1 ? '0' + month : month;
            day = (day.length === 1) ? '0' + day : day;
            $(this).closest('.calenderArea').siblings('button').html(year+'-'+month+'-'+day)
            $(this).closest('.calenderArea').siblings('[type="date"]').val(year+'-'+month+'-'+day)

            submitActive($(this).closest('form'));
            $('.calenderArea').remove();
        })
        calenderPrevNextBtn();
    }

    function calenderPrevNextBtn(){
        let date = new Date();
        let newDate = {
            day : date.getDate(),
            month : date.getMonth() + 1,
            year : date.getFullYear(),
        }
        let selectMonth = $('.calenderArea [data-usermonth]').html();
        let selectYear = $('.calenderArea [data-useryear]').html();

        if(newDate.year == selectYear && newDate.month == selectMonth){
            $('.calenderArea .next-btn').remove()
            $('.calenderArea').addClass('today')
        }else{
            $('.calenderArea').removeClass('today')
        }
        
        if(newDate.year >= selectYear && newDate.month == selectMonth){
            $('.calenderArea td').each(function(){
                Number(newDate.day) < Number($(this).html()) && $(this).addClass('unClick');
            })
        }

    }

    function calenderUnClick(){
        let startCalender = $('.calenderArea').closest('.calenderBox').find('[data-calender="start"]');
        let selectMonth = startCalender.attr('data-selectmonth')
        let selectYear = startCalender.attr('data-selectyear')
        let calenderMonth = $('.calenderArea [data-usermonth]').html();
        let calenderYear = $('.calenderArea [data-useryear]').html();
        if(selectYear >= calenderYear && selectMonth == calenderMonth){
            $('.calenderArea .prev-btn').remove()
        }
        if(calenderYear == selectYear && selectMonth == calenderMonth){
            $('.dycalendar-body td').each(function(){
                Number(startCalender.attr('data-selectday')) > Number( $(this).html()) && $(this).addClass('unClick')
            })
        }
    }
}

// 셋팅 간편 결제 정보
function paymentEvent(){
    var paymentSwiper = new Swiper(".paymentPage .slideBox .swiper", {
        slidesPerView: 3,
        spaceBetween: 16,
        freeMode: true,
        slidesPerView: "auto",
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    $('[data-btn="card"]').click(function(){
        // 카드 추가 코드
        const addCard = '<div class="swiper-slide cardBox">' +
            '<p>신한카드</p>' +
            '<strong>0000-****-****-0000</strong>' +
            '<button data-btn="delete">삭제</button>' +
            '</div>';
        $('.paymentPage .slideBox .swiper-wrapper').prepend(addCard);
        paymentSwiper.update();

        // 카드삭제버튼 
        $('[data-btn="delete"]').off('click');
        cardDelete();

        // 패딩 변경
        addPadding();
    })
    
    cardDelete()
    // 카드삭제버튼 
    function cardDelete(){
        $('[data-btn="delete"]').on('click',function(){
            $(this).closest('.swiper-slide').remove();
            paymentSwiper.update();

            // 패딩 변경
            addPadding();
        })
    }

    function addPadding(){
        $('.paymentPage .slideBox .swiper-slide').length >= 4 ? 
            $('.paymentPage section').addClass('addPadding') :
            $('.paymentPage section').removeClass('addPadding');
    }
}

// 셋팅 전문가 추가 / 변경 신청
function expertEvent(){
    // 전문가 리스트
    let expertList = [
        "이효중",
        "강윤석",
        "김진아",
        "성지윤",
        "이서연",
        "이정현",
        "이준희",
        "장혜령",
        "최혜나",
        "김성은",
    ]
    let searchArray = []
    let suggestion = '';
    $('#search , #search2').on('input',function(){
        $('.searchArea .scrollBox').html('');
        suggestion ='';
        let searchValue = $(this).val();
        let searchResultBox = $(this).closest('.searchArea').find('.scrollBox');
        searchArray = expertList.filter((data)=>{
            return data.includes(searchValue)
        })
        searchArray = searchArray.map((data)=>{
            return data = '<button>'+ data +'</button>'
        })
        !!searchValue ? searchResultBox.addClass('active') : searchResultBox.removeClass('active');
        
        
        // 추천 전문가
        suggestion += '<div><b>추천전문가</b>'
        expertList.map((data)=>{
            suggestion += '<button>'+ data +'</button>';
        })
        suggestion += '</div>';
        (!!searchValue && !searchArray.length) ?
            searchResultBox.append('<p>검색한 전문가가 없습니다.</p>' + suggestion) :
            searchResultBox.append(searchArray);


        $('.searchArea .scrollBox button').off('click');
        expertListClick();

        expertBoolean($(this));
        

    })

    

    function expertListClick(){
        $('.searchArea .scrollBox button').click(function(e){
            e.preventDefault();
            // $('#search').val($(this).html())
            $(this).closest('.searchArea').find('[type="text"]').val($(this).html())
            expertBoolean($(this).closest('.searchArea').find('[type="text"]'));
        })
    }

    function expertBoolean(selector){
        let boolean = expertList.find(function(e){
            return e === selector.val();
        })
        boolean = !!boolean;
        boolean ? 
            selector.attr('data-expert' , 'true') :
            selector.attr('data-expert' , 'false');

        submitActive(selector.closest('form'));
    }
}

// 셋팅 로그인 설정
function settingLoginEvent(){
    $('input[type="checkbox"]').each(function(){
        $(this).is(':checked') ? $(this).attr('data-checked' , 'true') : $(this).attr('data-checked' , 'false');
    })
    $('input[type="checkbox"]').on('input',function(){
        submitActive($(this).closest('form'))
    })

    $('[data-popup="password"]').click(function(){
        $('.popup-password').find('input').not('[type="submit"]').val('');
        $('.popup-password').find('.errorText , [type="submit"]').removeClass('active');
    })

    $('.confirmPopup , [data-confirm="close"]').mousedown(function(){
        $('.confirmPopup , .popupArea').fadeOut();
    })
}