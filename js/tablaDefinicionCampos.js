function createTablaDefinicion(data){

	objTablaDefinicionCampos = new Tabulator("#tablaDefinicionCampos",{

		data:data,
		layout:"fitDataStretch",
		height:"425px",
		dataTree:true,
		dataTreeStartExpanded:false,
		dataTreeChildField:"campos",
		columns:[
		
			{field:"idTabla",title:"idTabla",headerFilter:true},
			{field:"idTipoCampo",title:"idTipoCampo"},
			{field:"idCampo",title:"idCampo"}
		]
		
	});
	
}

/* cargar JSON tabla definicion*/
document.getElementById("fileInputTablaDefinicion").addEventListener("change",function(e){
	
	const readerTablaDefinicion=new FileReader()
	readerTablaDefinicion.onload=function(event){
		const json=JSON.parse(event.target.result)
		jsonData=json.tablas
		createTablaDefinicion(jsonData)
	}
	
	readerTablaDefinicion.readAsText(e.target.files[0])

})

//Al hacer click en el boton de fichero borramos el contenido para permitir cargar el mismo fichero varias veces
document.getElementById("fileInputTablaDefinicion").addEventListener("click",function(e){
	document.getElementById("fileInputTablaDefinicion").value = "";
})
