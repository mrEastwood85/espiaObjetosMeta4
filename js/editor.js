let table

$(document).on("change","#fileInput",function(e){

const file=e.target.files[0]

const reader=new FileReader()

reader.onload=function(event){

const json=JSON.parse(event.target.result)

const data=json.tablasEscanear

table=new Tabulator("#table",{

data:data,

layout:"fitColumns",

height:"500px",

columns:[
{title:"idClass",field:"idClass",editor:"input",headerFilter:"input"},
{title:"idRealObject",field:"idRealObject",editor:"input",headerFilter:"input"},
{title:"idPkField",field:"idPkField",editor:"input",headerFilter:"input"},
{title:"tipoTransfer",field:"tipoTransfer",editor:"input",headerFilter:"input"},
{title:"idRealObjectLectura",field:"idRealObjectLectura",editor:"input",headerFilter:"input"}
]

})

}

reader.readAsText(file)

})