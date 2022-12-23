$(document).ready(function(){
    $('[data-input="mobile"]').on('input' ,function(){
        !/^01(\d{9,9})/.test($(this).val()) ? $(this).next().addClass('active') : $(this).next().removeClass('active')
        submitActive();
    })
    $('[data-input="password"]').on('input' ,function(){
        !/\d{6,6}/.test($(this).val()) ? $(this).next().addClass('active') : $(this).next().removeClass('active')
        submitActive();
    })
    function submitActive(){
        $('input[type="submit"]').click(function(e){
            !$(this).hasClass('active') && e.preventDefault();
        })
        console.log($('p').get());
        let a = $('p').get().every((a)=>{
            return !$(a).hasClass('active');
        })
        console.log(a);
        let inputBool = [];
        $('input[type="text"] , input[type="password"] , input[type="number"]').each(function(){
            if(inputBool[0] === false) return;
            if($(this).val() === "" && inputBool[0]){
                inputBool[0] = false;
                return;
            }
            inputBool[0] = true;
        })
        $('.errorText').each(function(){
            if(inputBool[1] === false) return;
            if($(this).hasClass('active')){
                inputBool[1] = false;
                return;
            }
            inputBool[1] = true;
        })
        let result = inputBool.every((test)=>{
            return test === true
        })
        if(result){
            $('input[type="submit"]').addClass('active');
        }
    }
   
})