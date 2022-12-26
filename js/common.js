$(document).ready(function(){
    // 인풋 유효성 검사
    inputValidation()

    submitClick();
})

// 인풋 유효성 검사
function inputValidation(){
    $('[data-input="mobile"]').on('input' ,function(){
        !/^01(\d{9,9})/.test($(this).val()) ? $(this).next().addClass('active') : $(this).next().removeClass('active')
        submitActive();
    })
    $('[data-input="password"]').on('input' ,function(){
        !/\d{6,6}/.test($(this).val()) ? $(this).next().addClass('active') : $(this).next().removeClass('active')
        submitActive();
    })
    
    $('[data-input="password-re"]').on('input' ,function(){
        $(this).val() === $('[data-input="password"]').val() ? $(this).next().addClass('active') : $(this).next().removeClass('active')
        submitActive();
    })
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
    result && $('input[type="submit"]').addClass('active');
}

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
        !$(this).hasClass('active') && e.preventDefault();

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        // 인풋에서 받아 온 값
        console.log($(this).parents('form').find('input:not([type="submit"])'));
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
            v.name === 'userMobile' && (v.value !== testID && v.selector.next('p.errorText').addClass('active'));
            v.name === 'userPassword' && (v.value !== testPW && v.selector.next('p.errorText').addClass('active'));
        })

        // 값이 맞지 않으면 값이 맞지 않는 첫번째 input 포커스
        inputValue.find((v)=>{
            return v.selector.next('p.errorText').hasClass('active') && v.selector.focus();
        })

        // 에러 메세지가 없으면
        var result = errorTextConfirm();

        // 페이지 이동
        if(result){
            pageName === 'signIn' && (location.href = '../index.html');
            pageName === 'mobileChange' ? (location.href = 'newMobile.html') : $('.popupArea').addClass('active');
        }
    }
}

