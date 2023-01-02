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
    attrName === 'mobile' && (boolean = !/^01(\d{9,9})/.test($(selector).val()));
    attrName === 'password' && (boolean = !/[a-zA-Z0-9]{6,6}/.test($(selector).val()));
    // attrName === 'mobileConfirm' && (errorMessage = !/^01(\d{9,9})/.test($(this).val()));
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
    boolean ? errorSeletor.addClass('active') : errorSeletor.removeClass('active');
}

// 유효성 검사 통과하면 submit 색상
function submitActive(){
    let inputBoolean = $('[required]').get().every((a)=>{
        const boolean = inputValidation(a)
        return boolean == false;
    })
    
    // 에러메세지가 있는지 없는지 확인
    let errorBoolean = errorTextConfirm();

    // input 값 , 에러메세지가 둘 다 true 면 submit 버튼에 active 클래스 추가
    if(inputBoolean && errorBoolean){
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
    let inputValue = [{}]
    $('input[type="submit"]').click(function(e){
        if(!$(this).hasClass('active')){ 
            e.preventDefault()
            $('[required]').each(function(){
                const boolean = inputValidation($(this));
                errorMessageActive($(this) , boolean);
            })
            $('[required]').get().find((v)=>{
                return $(v).parent().siblings('.errorText').hasClass('active') && $(v).focus();
            })
            return;
        };

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        // 인풋에서 받아 온 값
        $(this).closest('form').find('[required]').each(function(i){
            if(!$(this).attr(inputAttr)) return;
            inputValue[i] = {
                selector : $(this),
                name : $(this).attr(inputAttr),
                value : $(this).val(),
                errorSelector : $(this).parent().siblings('.errorText')
            };
        })
        
        $(this).attr('id') === 'signIn' && mobileAndPW('signIn');
        // $(this).attr('id') === 'mobileChange' && mobileAndPW('mobileChange');

        // 값이 맞지 않으면 값이 맞지 않는 첫번째 input 포커스
        inputValue.find((v)=>{
            return v.errorSelector.hasClass('active') && v.selector.focus();
        })

    })

    // 로그인 페이지 submit 클릭
    function mobileAndPW(pageName){
        let testID = '01092931656';
        let testPW = '123456'
        // 값 판별
        inputValue.map((v)=>{
            v.name === 'userMobile' && (v.value !== testID && errorMessageActive(v.selector , true));
            if(v.name === 'userPassword') {
                if(v.value !== testPW){
                    errorMessageActive(v.selector , true);
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
}

// 핸드폰 번호 인증번호 전송
function mobileConfirm(){
    console.log('asd');
    $('.sendConfirm').click(function(){
        console.log($(this));
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

