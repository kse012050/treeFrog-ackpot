$(document).ready(function(){
    // 인풋 유효성 검사
    inputValidation()
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
    $('input[type="submit"]').click(function(e){
        !$(this).hasClass('active') && e.preventDefault();

        // 폼으로 데이터 전송 시 삭제
        e.preventDefault();

        let inputAttr = 'name';
        var testID = '01092931656';
        var testPW = '123456'

        // 인풋에서 받아 온 값
        var inputValue = {}
        $(this).parents('form').find('input:not([type="submit"])').each(function(){
            if(!$(this).attr(inputAttr)) return;
            inputValue[$(this).attr(inputAttr)] = $(this).val();
        })

        // 로그인 페이지
        $('#signIn').click(function(){
            inputValue.userMobile !== testID && $(`input[${inputAttr}="userMobile"]`).focus().next('p.errorText').addClass('active');
        })

    })
}

// 유효성 검사 통과하면 submit 색상
function submitActive(){
    let inputBool = [];
    inputBool.push($('input[type="text"] , input[type="password"] , input[type="number"]').get().every((a)=>{
        return $(a).val() !== '';
    }))
    inputBool.push($('.errorText').get().every((a)=>{
        return !$(a).hasClass('active');
    }))
    let result = inputBool.every((test)=>{
        return test === true
    })
    if(result){
        $('input[type="submit"]').addClass('active');
    }
}