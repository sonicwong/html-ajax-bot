function addFormBtn(item2search){
    console.log('---add form---');
    var item_found = false;
    var products = $('.item.is-today:not(.ended)');
    if(products.length == 0){
        console.log('no more product');
    }else{
        products.each(function() {
            var product_name = $( this ).find( ".title .valign-middle" ).html();
            var product_id = get_product_id($( this ).find( ".content > a" ).attr('href'));
            var form_html = get_form_html('',product_id);
            $( this ).prepend(form_html);

            if(
                item2search != 'all'
                && found_text(product_name, item2search)
                && !item_found
            ){
                item_found = true;
                $( "#buyform"+product_id ).submit();
                console.log('posting....');
            }
        });
        
        if(
            item2search != 'all'
            && item_found == false
        ){
            console.log('item ['+item2search+'] sold, please buy other.')
        }
    }
}

function found_text(str, str2search){
    str.toLowerCase();
    str2search.toLowerCase();
    return (str.indexOf(str2search) > -1);
}

function get_product_id(str) {
    return ( str == undefined ? '' : str.substr(str.search("id=")+3, str.length-1) );
}

function get_form_html(prefix,product_id){
    var user = {
        "name" : "Lee"
        ,"hkid" : "A1234"
        ,"email" : "lee@hotmail.com"
        ,"mobile" : "98765432"
    };
    
    return  '<form id="buyform'+prefix+product_id+'" action="order.php" method="post">'
            +'<input type="hidden" name="product_id" value="'+product_id+'">'
            +'<input type="hidden" name="name" value="'+user.name+'">'
            +'<input type="hidden" name="hkid" value="'+user.hkid+'">'
            +'<input type="hidden" name="email" value="'+user.email+'">'
            +'<input type="hidden" name="mobile" value="'+user.mobile+'">'
            +'<input type="submit" value="Submit">'
            +'</form>';
}

function loadList(){
    console.log('ajax loadList...');
    $.ajax({
        url: 'list.php',
        method: 'get',
        dataType: 'json',
        timeout: 3000
    })
    .fail(function(){
        console.log('error, retry in 0.5sec');
        setTimeout(function(){
            loadList();
        }, 500);
    })
    .done(function(response){
        var data = response.data;
        if(typeof data == 'string'){
            data = JSON.parse(window.atob(data));
            if(data.length == 0){
                console.log('no product, retry in 1sec');
                setTimeout(function(){
                    loadList();
                }, 1500);
            }else{
                search_list_json(data);
            }
        }else{
            console.log('not start, retry in 1sec');
            setTimeout(function(){
                loadList();
            }, 1500);
        }
    });
}

function search_list_json(json){
    console.log(json);
    $('.site-content').prepend('<div id="superform"></div><div style="clear:both; float:none;"></div>');
    $(json).each(function() {
            var product_name = this.name_1;
            var product_image = this.image;
            var product_id = this.id;
            var form_html = get_form_html('_',product_id);
            var css = (this.available > 0 ? '' : 'opacity: 0.3; ')
            
            $('#superform').append('<div style="'+css+' width:150px; height:180px; overflow:hidden; border:1px solid #000; float:left;"><img style="width:150px; height:auto" src="'+product_image+'"  />'+form_html+product_name+'</div>');

            if(
                found_text(product_name, 'iphone')
            ){
                console.log('posting...');
                $( "#buyform_"+product_id ).submit();
            }
    });
    console.log('=== search_list_json DONE ===');
}


if(window.location.href == 'https://aaa.com/product.html'){
    $('.site-header').prepend( '<a class="addformbtn_all">[ALL]</a></p>' );
    $('.addformbtn_all').on('click', function(){
        addFormBtn('all');
    });
    addFormBtn('all');
}
