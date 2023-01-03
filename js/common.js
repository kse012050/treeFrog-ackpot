$(document).ready(function(){
    // 메인페이지 슬라이더
    $('.mainPage').length && mainSlider();

    // 메인 페이지를 제외한 나머지 페이지 탭 공통
    !$('.mainPage').length && tabClick();

    // 인풋 유효성 검사
    inputInput()

    // submit 관련 클릭 이벤트
    submitClick();

    // 팝업 관련 클릭 이벤트
    popupClick();

    
    
    $('.certificationBox').length && mobileConfirm();
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

// 인풋 유효성 검사
function inputValidation(selector){
    const attrName = $(selector).attr('data-input');
    let boolean;
    attrName === 'mobile' && (boolean = /^01(\d{9,9})/.test($(selector).val()));
    attrName === 'password' && (boolean = /[a-zA-Z0-9]{6,6}/.test($(selector).val()));
    attrName === 'password-re' && (boolean = $(selector).val() === $('[data-input="password"]').val());
    attrName === 'confirm' && (boolean = /^\d{6,6}/.test($(selector).val()));
    return boolean;
}

function inputInput(){
    $('[data-input]').on('input' , function(){
        const boolean = inputValidation($(this))
        errorMessageActive($(this) , boolean);
        submitActive();
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
    // console.log(!!$('[data-boolean]').length);
    if(!!$('[data-boolean]').length){
        let test = $('[data-boolean]').get().find(function(b){
            console.log($(b));
            console.log($(b).attr('data-boolean'));
            return JSON.parse($(b).attr('data-boolean'));
        })
        console.log(test);
        if(!test){
            return
        }
       /*  if(!JSON.parse($('[data-input="confirm"]').attr('data-confirm'))){
            console.log(JSON.parse($('[data-input="confirm"]').attr('data-confirm')));
            return
        } */
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
    $('input[type="submit"]').click(function(e){
        inputValue = []
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
        


        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        // 인풋에서 받아 온 필수 값
        $(this).closest('form').find('[required]').each(function(i){
            if(!$(this).attr(inputAttr)) return;
            inputValue[i] = {
                selector : $(this),
                name : $(this).attr(inputAttr),
                value : $(this).val(),
                errorSelector : $(this).parent().siblings('.errorText')
            };
        })

        // 인풋에서 받아 온 필수가 아닌 값
        $(this).closest('form').find('input').not('[required]').not('[type="submit"]').each(function(i){
            if(!$(this).attr(inputAttr)) return;
            inputValue.push( {
                selector : $(this),
                name : $(this).attr(inputAttr),
                // value : $(this).attr('type') !== 'checkbox' ? $(this).val() : $(this).is(':checked'),
                errorSelector : $(this).parent().siblings('.errorText')
            });
            inputValue[(inputValue.length - 1) + i].value = $(this).attr('type') !== 'checkbox' ? $(this).val() : $(this).is(':checked')
        })

        console.log($(this).closest('form').find('input'));
        console.log(inputValue);
        
        $(this).attr('id') === 'signIn' && mobileAndPW('signIn');
        // $(this).attr('id') === 'mobileChange' && mobileAndPW('mobileChange');

        $(this).attr('id') === 'mobileConfirm' && mobileConfirm();
        $(this).attr('id') === 'passwordChange' && passwordChange();

        // 값이 맞지 않으면 값이 맞지 않는 첫번째 input 포커스
        inputValue.find((v)=>{
            return v.errorSelector.hasClass('active') && v.selector.focus();
        })

    })

    // 로그인 , 휴대폰 전화번호 변동 페이지 submit 클릭
    function mobileAndPW(pageName){
        let testID = '01092931656';
        let testPW = '123456'
        let IDCheck;
        let PWCheck;
        // 값 판별
        inputValue.map((v)=>{
            v.name === 'userMobile' && (IDCheck = v.value !== testID);
            if(v.name === 'userPassword') {
                if(v.value !== testPW){
                    errorMessageActive(v.selector , false);
                    v.selector.val('');
                }
            };
        })

        

        // 에러 메세지가 없으면  
        var result = errorTextConfirm();

        if($('input[type="submit"]').hasClass('active')){ 
            pageName === 'mobileChange' && $('.popupArea').fadeIn().css('display','flex')
        }

        // 페이지 이동
        if(result){
            // pageName === 'signIn' && (location.href = '../index.html');
            // pageName === 'mobileChange' && (location.href = 'newMobile.html');
        }else{
            $('input[type="submit"').removeClass('active');
        }
    }

    // 신규 전화번호 인증 , 회원가입 페이지 submit 클릭
    function mobileConfirm(){
        console.log('신규 전화번호 인증');
    }

    // 간편 비밀번호 변경 페이지 submit클릭
    function passwordChange(){
        console.log('간편 비밀번호 변경');
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
        // 인증번호가 ex> 123456 이면
        if(confirmSeletor.val() === '123456'){
            // 속성 값을 변경하여 인증되었는 지 확인
            confirmSeletor.attr('data-boolean' , 'true');
            clearInterval(timer)
        }else{
            confirmSeletor.focus();
            erroeMessageSelector.addClass('active');
        }
        submitActive();
    })
}

function popupClick(){
    $('body:has([class*="popup"].active)').click(function(){
        console.log($('[class*="popup"]').hasClass('active'));
        $('[class|="popup"]').hasClass('active') && popupClose($('[class*="popup"]'))
    })
    // form 태그 안에 있는 button 클릭 자동 새로고침 막기
    $('button').click(function(e){
        e.stopPropagation();
        const attrName = $(this).attr('data-popup');
        e.preventDefault();
        attrName === 'next' ? 
            $(this).next().fadeIn().css('display','flex').addClass('active') :
            $(`.popup-${attrName}`).fadeIn().addClass('active');
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

