
var tipoTransferMutator = function(value, data, type, params, component){
    
	var valorRetornado
	
	switch (value) {
	case "R":
		valorRetornado = "REPLACE";
		break;
	case "L":
		valorRetornado = "TRANSFER";
		break;
	case "T":
		valorRetornado = "TRANSFER";
		break;
	default:
		valorRetornado = "sinTipo";
		break;
	}
    return valorRetornado;
}

var componeComandoMutator = function(value, data, type, params, component){
	
	var idClassReg = data.idClass
	var idObjetoReg = data.idObjeto
	var valorObjetoReg = data.valorObjeto
	var camposObjetoReg = data.camposObjeto
	var tipoTransferReg = data.tipoTransfer

	var valorRetornado = "";
	var semillaTransfer = 'Transfer "@idClassSustituir"."@valorObjetoSustituir" From Origin To Destination';
	var semillaReplace = 'Replace @idObjetoSustituir From Origin To Destination Where "@clausulaWhereSustituir"';
	var vClausulaWhere = "";
	var comillaSimple = "\'"
	
	//Dependiendo del tipo de transfer tenemos que formar un comando u otro
	switch (tipoTransferReg) {
	case "TRANSFER":
		valorRetornado = semillaTransfer;
		
		//Sustituimos los comodines por los valores reales
		valorRetornado = valorRetornado.replace("@idClassSustituir",idClassReg);
		valorRetornado = valorRetornado.replace("@valorObjetoSustituir",valorObjetoReg);
		break;
		
	case "REPLACE":
	
		//Definimos la funcion que recorre el array y genera la clausula where
		function componeClausulaWhere(element, index, array) {
		
			//Como los dos arrays siempre tienen el mismo numero de elementos y estan ordenados de la misma forma con recorrer uno y acceder a los dos es suficiente
			vIdCampoWhere = vArrayCamposObjeto[index];
			vValorWhere = vArrayValoresObjeto[index];
			
			if (index > 0){
				vClausulaWhere = vClausulaWhere + " and "
			}
			vClausulaWhere = vClausulaWhere + vIdCampoWhere + " = " + comillaSimple + vValorWhere + comillaSimple;
			
		}
		
		valorRetornado = semillaReplace;
		vArrayValoresObjeto = valorObjetoReg.split("|");	//Generamos el array de valores
		vArrayCamposObjeto = camposObjetoReg.split("|");	//Generamos el array de campos
		
		vArrayValoresObjeto.forEach(componeClausulaWhere);
		
		//Sustituimos los comodines por los valores reales
		valorRetornado = valorRetornado.replace("@idObjetoSustituir",idObjetoReg);
		valorRetornado = valorRetornado.replace("@clausulaWhereSustituir",vClausulaWhere);
		
		break;
	default:
		valorRetornado = "sinComando";
		break;
	}
		
    return valorRetornado;
}

function createTableObjetosModificados(data){

	objTableObjetosModificados = new Tabulator("#tablaObjetosModificados",{

		data:data,
		layout:"fitDataStretch",
		height:"425px",
		selectable:10000000,
		columns:[
		
			{field:"tipoTransfer",title:"tipo",mutator:tipoTransferMutator,width:100},
			{field:"usuario",title:"usuario",width:100},
			{field:"fecha",title:"fecha",sorter:"date",sorterParams:{format:"yyyy-MM-dd"},formatter:"datetime",width:100, 
				formatterParams:{
				inputFormat:"yyyy-MM-dd",
				outputFormat:"dd/MM/yyyy",
				invalidPlaceholder:"(invalid date)"}
			},
			{field:"idClass",title:"idClass"},
			{field:"idObjeto",title:"idObjeto"},
			{field:"valorObjeto",title:"valorObjeto"},
			{field:"camposObjeto",title:"camposObjeto",visible:false},
			{field:"comando",title:"comando",mutator:componeComandoMutator,visible:true}
		]
	});
}

/* cargar JSON */
document.getElementById("fileInput").addEventListener("change",function(e){

	//Comprobamos si han cargado primero la definicion de tablas	
	vIsLoad = false;
	if (typeof objTablaDefinicionCampos !== 'undefined' && objTablaDefinicionCampos !== null) {
		//si existe miramos que tenga datos
		vNumRegTablaDefinicion = objTablaDefinicionCampos.getData().length;
		
		if (vNumRegTablaDefinicion > 0){
			vIsLoad = true;
		}
	}

	if (!vIsLoad){
		alert("Primero debes cargar la definicion de las tablas");
		document.getElementById("fileInput").value = "";
	}else{
	
		const reader=new FileReader()
		reader.onload=function(event){
			const json=JSON.parse(event.target.result)
			jsonData=json.objetosModificados
			createTableObjetosModificados(jsonData)
		}
		
		var nombreFichero = e.target.files[0].name;
		
		reader.readAsText(e.target.files[0])
	}

})

//Al hacer click en el boton de fichero borramos el contenido para permitir cargar el mismo fichero varias veces
document.getElementById("fileInput").addEventListener("click",function(e){
	document.getElementById("fileInput").value = "";
})

/* buscador buscadorObjetosModificados */
document.getElementById("buscadorObjetosModificados").addEventListener("keyup",function(){

	const value=this.value.toLowerCase()

	objTableObjetosModificados.setFilter(function(data){

		return Object.values(data).some(v=>

			String(v).toLowerCase().includes(value)
		)
	})
})

/* añadir fila */
function addRow(){

	objTableObjetosModificados.addRow({
		idClass:"",
		idRealObject:"",
		idPkField:"",
		tipoTransfer:"",
		idRealObjectLectura:""
	})

}

/* exportar */
function generarComandos(){
	
	const fechaIsoString = new Date().toISOString();
	const vArrayDatosTabla=objTableObjetosModificados.getData()
	
	let vTextoExportar = "";
	let vComando = "";
	let vSeparador = "\\";
	let vSaltoLinea = "\r\n";
	
	function componeTextoExportar(element, index, array) {
		
		//Obtenemos el comando y lo vamos concatenando en la variable con el texto que volcaremos al fichero
		vComando = element.comando;
		vTextoExportar = vTextoExportar + vComando + vSeparador + vSaltoLinea;
				
	}
	
	//Componemos el texto
	vArrayDatosTabla.forEach(componeTextoExportar);
	
	//Generamos el archivo
	const blob=new Blob([vTextoExportar],{type:"text/plain;charset=utf-8"});
	const a=document.createElement("a")
	a.href=URL.createObjectURL(blob)
	a.download="objetosModificados"+fechaIsoString+".txt";	//Añadimos al nombre del archivo la fecha del sistema
	a.click()
}
