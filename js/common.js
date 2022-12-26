$(document).ready(function(){
    // 인풋 유효성 검사
    inputValidation()

    // submit 관련 클릭 이벤트
    submitClick();

    // 팝업 관련 클릭 이벤트
    popupClick();


    $('.certificationBox').length && mobileConfirm();
})

// 인풋 유효성 검사
function inputValidation(){
    $('[data-input="mobile"]').on('input' ,function(){
        errorTextClass($(this) , !/^01(\d{9,9})/.test($(this).val()))
        submitActive();
    })
    $('[data-input="password"]').on('input' ,function(){
        errorTextClass($(this) , !/[a-zA-Z0-9]{6,6}/.test($(this).val()))
        submitActive();
    })

    $('[data-input="mobileConfirm"]').on('input' ,function(){
        errorTextClass($(this) , !/\d{6,6}/.test($(this).val()))
        submitActive();
    })
    
    $('[data-input="password-re"]').on('input' ,function(){
        $(this).val() === $('[data-input="password"]').val() ? $(this).siblings('.errorText').addClass('active') : $(this).siblings('.errorText').removeClass('active')
        submitActive();
    })

    
}
function errorTextClass(selector , boolean){
    boolean ? selector.parent().siblings('.errorText').addClass('active') : selector.parent().siblings('.errorText').removeClass('active')
}

// 유효성 검사 통과하면 submit 색상
function submitActive(){
    let inputBool = [];

    // input 값이 입력되었는지 확인
    inputBool.push($('input[type="text"] , input[type="password"] , input[type="number"]').get().every((a)=>{
        return $(a).val() !== '';
    }))

    // 에러메세지가 있는지 없는지 확인
    inputBool.push(errorTextConfirm());
    
    // input 값 , 에러메세지가 둘 다 true인지 확인
    let result = inputBool.every((test)=>{
        return test === true
    })

    // input 값 , 에러메세지가 둘 다 true 면 submit 버튼에 active 클래스 추가
    result ? $('input[type="submit"]').addClass('active') : $('input[type="submit"]').removeClass('active');
}

// 에레메시지 확인
function errorTextConfirm(){
    return $('.errorText').get().every((a)=>{
        return !$(a).hasClass('active');
    })
}

// submit 클릭 이벤트
function submitClick(){
    let inputAttr = 'name';
    let testID = '01092931656';
    let testPW = '123456'
    let inputValue = [{}]
    $('input[type="submit"]').click(function(e){
        if(!$(this).hasClass('active')){ 
            e.preventDefault()
        };

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        // 인풋에서 받아 온 값
        $(this).parents('form').find('input:not([type="submit"])').each(function(i){
            if(!$(this).attr(inputAttr)) return;
            inputValue[i] = {
                selector : $(this),
                name : $(this).attr(inputAttr),
                value : $(this).val()
            };
        })
        
        $(this).attr('id') === 'signIn' && mobileAndPW('signIn');
        $(this).attr('id') === 'mobileChange' && mobileAndPW('mobileChange');

    })

    // 로그인 페이지 submit 클릭
    function mobileAndPW(pageName){
        // 값 판별
        inputValue.map((v)=>{
            v.name === 'userMobile' && (v.value !== testID && errorTextClass(v.selector , true));
            v.name === 'userPassword' && (v.value !== testPW && errorTextClass(v.selector , true));
        })

        // 값이 맞지 않으면 값이 맞지 않는 첫번째 input 포커스
        inputValue.find((v)=>{
            return v.selector.parent().siblings('.errorText').hasClass('active') && v.selector.focus();
        })

        // 에러 메세지가 없으면
        var result = errorTextConfirm();

        if($('input[type="submit"]').hasClass('active')){ 
            pageName === 'mobileChange' && $('.popupArea').fadeIn().css('display','flex')
        }

        // 페이지 이동
        if(result){
            pageName === 'signIn' && (location.href = '../index.html');
            pageName === 'mobileChange' && (location.href = 'newMobile.html');
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
    // form 태그 안에 있는 button 클릭 자동 새로고침 막기
    $('button').click((e)=>{
        e.preventDefault();
    })
    // 팝업 검은 배경
    $('.popupArea').click(function(){
        popupClose($(this))
    })
    // 팝업 내용 영역
    $('.popupArea > div').click(function(e){
        e.stopPropagation();
    })
    // 팝업 X 버튼
    $('.popupArea > div > button').click(function(){
        popupClose($(this).parents('.popupArea'))
    })

    function popupClose(selector){
        selector.fadeOut().css('display','flex');
    }
}

