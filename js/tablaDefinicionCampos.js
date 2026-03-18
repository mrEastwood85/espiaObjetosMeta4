function createTablaDefinicion(data){

	objTablaDefinicionCampos = new Tabulator("#tablaDefinicionCampos",{

		data:data,
		layout:"fitDataStretch",
		height:"425px",
		dataTree:true,
		dataTreeStartExpanded:false,
		dataTreeChildField:"campos",
		columns:[
		
			{field:"idTabla",title:"idTabla"},
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
		if (typeof jsonData === 'undefined'){
			showToast("El archivo JSON elegido no es correcto", "error");
			document.getElementById("fileInput").value = "";
		}else{
			createTablaDefinicion(jsonData)
		}
	}
	
	var file = e.target.files[0]; // Obtener el primer archivo
  
	if (!file) {
		showToast("No has seleccionado ningun archivo", "error");
		return; // Si no hay archivo, salir
	}
	
	if (!file.type.match('application/json*')) {
		showToast("Por favor, selecciona solo archivos de tipo JSON", "error");
		return; // Detener si no es json
	}
	
	readerTablaDefinicion.readAsText(file)

})

//Al hacer click en el boton de fichero borramos el contenido para permitir cargar el mismo fichero varias veces
document.getElementById("fileInputTablaDefinicion").addEventListener("click",function(e){
	document.getElementById("fileInputTablaDefinicion").value = "";
})
