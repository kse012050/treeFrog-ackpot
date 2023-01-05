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

    $('.livingPage').length && livingEvent();

    // 핸드폰 인증
    $('.certificationBox').length && mobileConfirm();

    // 이름 닉네임 버튼
    !!$('[data-input="nickName"] , [data-input="name"]').length && nameNickname();
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
    $('.tabBtn li button').click(function(){
        $(this).parent().addClass('active').siblings().removeClass('active');
        const tabName = $(this).attr('data-tab');
        if(tabName === 'all'){
            $(`[data-tab="contentArea"] [data-tab]`).stop().fadeIn();
        }else{
            $(`[data-tab="contentArea"] [data-tab]`).hide();
            $(`[data-tab="contentArea"] [data-tab="${tabName}"]`).stop().fadeIn();
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
    attrName === 'confirm' && (boolean = /^\d{6,6}/.test($(selector).val()));
    attrName === 'checkbox' && (boolean = $(selector).is(':checked'));
    attrName === 'name' && (boolean = /^[가-힣]{2,4}$/.test($(selector).val()));
    // 닉네임 중복 확인
    if(attrName === 'nickName') {
        // boolean   false 중복O ,  true 중복X
        if($(selector).val() === '테스트' || $(selector).val() === ''){
            boolean = false;
        }else{
            boolean = true;
        }
    };
    return boolean;
}

function inputInput(){
    $('[data-input]').on('input' , function(){
        const boolean = inputValidation($(this))
        errorMessageActive($(this) , boolean);
        submitActive();

        if(!!$(this).attr('data-boolean')){
            let buttonSelector = $(this).parent().siblings('button');
            boolean ? buttonSelector.addClass('active') : buttonSelector.removeClass('active');
        }
    })

    // 동의
    $('.agreeArea').length && inputCheckbox();
}

// 동의
function inputCheckbox(){
    // 체크 박스  전체 동의
    $('#allAgree').click(function(){
        if($(this).is(':checked')){
            $('input[type="checkbox"]').prop('checked', true)
        }else{
            $('input[type="checkbox"]').prop('checked', false)
        }
        submitActive();
    })

    // 체크 박스 개별
    $('[type="checkbox"]').not('#allAgree').on('input',function(){
        let agreeCheck = $('[type="checkbox"]').not('#allAgree').get().every((c)=>{
            return $(c).is(':checked');
        });
        if(agreeCheck){
            $('#allAgree').prop('checked', true)
        }else{
            $('#allAgree').prop('checked', false)
        }
    })
}

function errorMessageActive(selector , boolean){
    const errorSeletor = selector.parent().siblings('.errorText');
    boolean ? errorSeletor.removeClass('active') : errorSeletor.addClass('active');
}

// 유효성 검사 통과하면 submit 색상
function submitActive(){
    // 필수항목 입력 값 유효성 검사
    let inputBoolean = $('[required]').get().every((a)=>{
        let boolean = inputValidation(a)
        return boolean === true;
    })
    
    // 에러메세지가 있는지 없는지 확인
    let errorBoolean = !errorTextConfirm();


    // 인증이 완료 되었는 지 확인
    if(!!$('[data-boolean]').length){
        let confirmChack = $('[data-boolean]').get().find(function(b){
            return JSON.parse($(b).attr('data-boolean'));
        })
        if(!confirmChack){
            return
        }
    }

    // input 값 , 에러메세지가 둘 다 true 면 submit 버튼에 active 클래스 추가
    if(inputBoolean && !errorBoolean){
        $('input[type="submit"]').addClass('active')
    }else{
        $('input[type="submit"]').removeClass('active');
    }
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
                return $(v).parent().siblings('.errorText').hasClass('active') && $(v).focus();
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
        $(this).closest('form').find('input').not('[required]').not('[type="submit"]').each(function(i){
            if(!$(this).attr(inputAttr)) return;
            inputValue.push( {
                selector : $(this),
                name : $(this).attr(inputAttr),
                value : $(this).attr('type') !== 'checkbox' ? $(this).val() : $(this).is(':checked'),
                errorSelector : $(this).parent().siblings('.errorText')
            });
            // inputValue[(inputValue.length - 1) + i].value = $(this).attr('type') !== 'checkbox' ? $(this).val() : $(this).is(':checked')
        })

        console.log(inputValue);
        // 최종 resultValue 값
        inputValue.map((v)=>{
            resultValue[v.name] = v.value
        })
        console.log(resultValue);
        // e.preventDefault();
        
        $(this).attr('id') === 'signIn' && mobileAndPW('signIn' , e);
        $(this).attr('id') === 'mobileChange' && mobileAndPW('mobileChange' , e);

        $(this).attr('id') === 'mobileConfirm' && mobileConfirm();
        $(this).attr('id') === 'passwordChange' && passwordChange(e);
        $(this).attr('id') === 'firstSingUp' && firstSingUp();

        // 값이 맞지 않으면 값이 맞지 않는 첫번째 input 포커스
        inputValue.find((v)=>{
            return v.errorSelector.hasClass('active') && v.selector.focus();
        })

    })

    // 로그인 , 휴대폰 전화번호 변동 페이지 submit 클릭
    function mobileAndPW(pageName , e){
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

    // 신규 전화번호 인증 , 회원가입 페이지 submit 클릭
    function mobileConfirm(){
        console.log('신규 전화번호 인증');
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
    function firstSingUp(){
        console.log('최초 회원가입');
    }
}

// 핸드폰 번호 인증번호 전송
function mobileConfirm(){
    $('input[data-input="mobile"]').on('input',function(){
        if($('[data-btn="sendConfirm"]').html() === '재전송'){
            console.log(1);
            $('[data-btn="sendConfirm"]').html('인증번호 전송');
            $('.certificationBox').removeClass('active');
            clearInterval(timer)
        }
    })
    let timer;
    // 인증번호 전송 버튼 클릭
    $('[data-btn="sendConfirm"]').click(function(){
        if($('input[type="submit"]').hasClass('active')){return}
        let minute = 3;
        let seconds = 0;
        let time = minute + ':' + (seconds >= 10 ? seconds : '0' + seconds)
        let mobileSeletor = $(this).prev().find('[data-input="mobile"]')
        let confirmBoxSelector = $('.certificationBox');
        if(!inputValidation(mobileSeletor)){
            mobileSeletor.focus();
            errorMessageActive(mobileSeletor , inputValidation(mobileSeletor))
        }else{
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
        submitActive();
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
            $(this).removeClass('active')
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
            $(this).removeClass('active')
        }else{
            nickNameSelector.focus();
        }
    })
}

function popupClick(){
    // body 클릭시 서브 팝업 닫기
    $('body').click(function(){
        $('[class|="popup"]').hasClass('active') && popupClose($('[class|="popup"]'));

        $('[class|="popup"]').removeClass('active');
    })
    // form 태그 안에 있는 button 클릭 자동 새로고침 막기
    $('button').click(function(e){
        e.stopPropagation();
        const attrName = $(this).attr('data-popup');
        e.preventDefault();
        attrName === 'next' ? 
            $(this).next().fadeIn().css('display','flex').addClass('active') :
            $(`.popup-${attrName}`).fadeIn().addClass('active');

        attrName === 'share' && $(`.popup-${attrName} .errorText`).removeClass('active')
    })
    // 팝업 검은 배경
    $('.popupArea').click(function(){
        popupClose($(this))
    })
    // 팝업 내용 영역
    $('.popupArea > div').click(function(e){
        e.stopPropagation();
    })
    $('[class|="popup"]').click(function(e){
        e.stopPropagation();
    })
    // 팝업 X 버튼
    $('[data-popup="close"]').click(function(){
        popupClose($(this).closest('[class*="popup"]'))
    })
   

    function popupClose(selector){ 
        selector.stop().fadeOut();
    }
}



function livingEvent(){

    // 채팅 스크롤 최하단으로 내리기
    $('.livingPage .contentArea section .chattingArea').scrollTop($('.livingPage .contentArea section .chattingArea > .scrollHeight').innerHeight())
    // 채팅 스크롤에 따라 상단 타이틀 영역 blur 처리
    $('.livingPage .contentArea section .chattingArea').scroll(function(){
        ($(this).scrollTop() > 0 && !$('.livingPage .contentArea section .noticeArea').hasClass('active')) ?
            $('.livingPage .contentArea section .titleArea').addClass('blur') :
            $('.livingPage .contentArea section .titleArea').removeClass('blur') ;
    })

    // 좌우 메뉴 열기 / 접기
    $('.livingPage :is(.leftAside , .rightAside) > button').click(function(){
        $(this).parent().toggleClass('active');
    })

    // 채팅 공지사항 열기
    $('[data-notice="open"]').click(function(){
        $('.noticeArea').addClass('active');
        $('.livingPage .contentArea section .titleArea').removeClass('blur')
    })
    // 채팅 공지사항 닫기
    $('[data-notice="close"]').click(function(){
        $('.noticeArea').removeClass('active');
        $('.livingPage .contentArea section .chattingArea').scrollTop() > 0 ?
            $('.livingPage .contentArea section .titleArea').addClass('blur') :
            $('.livingPage .contentArea section .titleArea').removeClass('blur');
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
}