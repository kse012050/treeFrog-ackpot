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

    })
    $('input[type="submit"]').click(function(e){
        !$(this).hasClass('active') && e.preventDefault();
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