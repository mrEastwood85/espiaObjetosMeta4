function loadPage(page){
$("#content").load("sections/"+page+".html")
}

$(document).on("click",".menu-item",function(){

const page=$(this).data("page")

loadPage(page)

})

/* abrir cerrar submenu */

$(document).on("click",".menu-toggle",function(){

$(this).next(".submenu").slideToggle(200)

})