
var statusDetalleMutator = function(value, data, type, params, component){
    
	var valorRetornado = true;
	
	var comandoReg = data.comandoDetalle;
	
	if (comandoReg.includes("No se puede generar el comando.")){
		valorRetornado = false;
	}
		
	return valorRetornado;
}

var componeComandoDetalleMutator = function(value, data, type, params, component){
	
	var idClassReg = data.idClassDetalle;
	var idObjetoReg = data.idObjetoDetalle;
	var idItemReg = data.idItemDetalle;
	var usuarioReg = data.usuarioDetalle;
	var fechaReg = data.fechaDetalle;
	
	var valorRetornado = "";
	var semillaTransfer = 'Transfer "Item"."@valorItemSustituir" Of "@valorObjetoSustituir" From Origin To Destination';
		
	valorRetornado = semillaTransfer;
	//Sustituimos los comodines por los valores reales
	valorRetornado = valorRetornado.replace("@valorItemSustituir",idItemReg);
	valorRetornado = valorRetornado.replace("@valorObjetoSustituir",idObjetoReg);
		
    return valorRetornado;
}

function createTableItemsModificados(data){

	objTableItemsModificados = new Tabulator("#tablaItemsModificados",{

		data:data,
		layout:"fitDataTable",
		height:"425px",
		selectable:10000000,
		movableColumns: true,
		columns:[
			
			{field:"idClassDetalle",title:"idClassDetalle"},
			{field:"idObjetoDetalle",title:"idObjetoDetalle"},
			{field:"idItemDetalle",title:"idItemDetalle"},
			{field:"usuarioDetalle",title:"usuarioDetalle",width:100},
			{field:"fechaDetalle",title:"fechaDetalle",sorter:"date",sorterParams:{format:"yyyy-MM-dd"},formatter:"datetime",width:100, 
				formatterParams:{
				inputFormat:"yyyy-MM-dd",
				outputFormat:"dd/MM/yyyy",
				invalidPlaceholder:"(invalid date)"}
			},
			{field:"comandoDetalle",title:"comandoDetalle",mutator:componeComandoDetalleMutator,visible:true},
			{field:"statusDetalle",title:"estado",mutator:statusDetalleMutator,formatter:"tickCross",frozen:true}
		]
	});
	
	objTableItemsModificados.on("tableBuilt", function(){
		objTableItemsModificados.moveColumn("statusDetalle", "idClassDetalle", false);
	});
	
}

/* cargar JSON */
document.getElementById("fileInputTablaItemsModificados").addEventListener("change",function(e){

	//Comprobamos si han cargado primero la definicion de tablas	
	vIsLoad = false;
	if (typeof objTablaDefinicionCampos !== 'undefined' && objTablaDefinicionCampos !== null){
		//si existe miramos que tenga datos
		vNumRegTablaDefinicion = objTablaDefinicionCampos.getData().length;
		
		if (vNumRegTablaDefinicion > 0){
			vIsLoad = true;
		}
	}

	if (!vIsLoad){
		showToast("Primero debes cargar la definicion de las tablas", "error");
		document.getElementById("fileInputTablaItemsModificados").value = "";
	}else{
	
		const reader=new FileReader()
		reader.onload=function(event){
			const json=JSON.parse(event.target.result)
			jsonData=json.detalleItems
			
			if (typeof jsonData === 'undefined'){
				showToast("El archivo elegido no es correcto", "error");
				document.getElementById("fileInputTablaItemsModificados").value = "";
			}else{
				createTableItemsModificados(jsonData);
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
	
		reader.readAsText(file);
	}

})

//Al hacer click en el boton de fichero borramos el contenido para permitir cargar el mismo fichero varias veces
document.getElementById("fileInputTablaItemsModificados").addEventListener("click",function(e){
	document.getElementById("fileInputTablaItemsModificados").value = "";
})

/* buscador buscadorObjetosModificados */
document.getElementById("buscadorItemsModificados").addEventListener("keyup",function(){

	const value=this.value.toLowerCase()

	objTableItemsModificados.setFilter(function(data){

		return Object.values(data).some(v=>

			String(v).toLowerCase().includes(value)
		)
	})
})

/* exportar */
function generarComandosItems(){
	
	const fechaIsoString = new Date().toISOString();
	const vArrayDatosExportar = objTableItemsModificados.searchData("statusDetalle", "=", true);		//Exportaremos solo los que tienen status = ok
	
	let vTextoExportar = "";
	let vComando = "";
	let vSeparador = "\\";
	let vSaltoLinea = "\r\n";
	
	function componeTextoExportar(element, index, array){
		
		//Obtenemos el comando y lo vamos concatenando en la variable con el texto que volcaremos al fichero
		vComando = element.comandoDetalle;
		vTextoExportar = vTextoExportar + vComando + vSeparador + vSaltoLinea;
	}
	
	//Componemos el texto
	vArrayDatosExportar.forEach(componeTextoExportar);
	
	var vRowsComandoErroneo = objTableItemsModificados.searchRows("status", "=", false);
	if (vRowsComandoErroneo.length > 0){
		showToast("Los comandos erroneos no se han exportado", "warning");
	}
	
	//Generamos el archivo
	const blob=new Blob([vTextoExportar],{type:"text/plain;charset=utf-8"});
	const a=document.createElement("a")
	a.href=URL.createObjectURL(blob)
	a.download="itemsModificados"+fechaIsoString+".txt";	//Añadimos al nombre del archivo la fecha del sistema
	a.click()
	showToast("Ha finalizado la generacion de comandos", "success");
}


function filtrarTextoItems(textoFiltro,objetoMostrar,objetoOcultar){
	
	if (textoFiltro == 'errorComando'){
		textoFiltro = "No se puede generar el comando."
	}
	
	if (objetoMostrar != ''){
		document.getElementById(objetoMostrar).classList.add("display-block");
		document.getElementById(objetoMostrar).classList.remove("display-none");
	}
	if (objetoOcultar != ''){
		document.getElementById(objetoOcultar).classList.remove("display-block");
		document.getElementById(objetoOcultar).classList.add("display-none");
	}
	
	document.getElementById("buscadorItemsModificados").value = textoFiltro;
	
	//pasamos a minusculas para que el buscador encuentra mayusc y minusc
	textoFiltro = textoFiltro.toLowerCase();
	
	objTableItemsModificados.setFilter(function(data){

		return Object.values(data).some(v=>

			String(v).toLowerCase().includes(textoFiltro)
		)
	})
	
};