
var tipoTransferMutator = function(value, data, type, params, component){
    
	var valorRetornado
	
	switch (value){
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

var statusMutator = function(value, data, type, params, component){
    
	var valorRetornado = true;
	
	var comandoReg = data.comando;
	
	if (comandoReg.includes("No se puede generar el comando.")){
		valorRetornado = false;
	}
		
	return valorRetornado;
}

var componeComandoMutator = function(value, data, type, params, component){
	
	var idClassReg = data.idClass;
	var idObjetoReg = data.idObjeto;
	var valorObjetoReg = data.valorObjeto;
	var camposObjetoReg = data.camposObjeto;
	var tipoTransferReg = data.tipoTransfer;

	var valorRetornado = "";
	var semillaTransfer = 'Transfer "@idClassSustituir"."@valorObjetoSustituir" From Origin To Destination';
	var semillaReplace = 'Replace @idObjetoSustituir From Origin To Destination Where "@clausulaWhereSustituir"';
	var vClausulaWhere = "";
	var comillaSimple = "\'";
	
	//Dependiendo del tipo de transfer tenemos que formar un comando u otro
	switch (tipoTransferReg){
	case "TRANSFER":
		valorRetornado = semillaTransfer;
		
		//Sustituimos los comodines por los valores reales
		valorRetornado = valorRetornado.replace("@idClassSustituir",idClassReg);
		valorRetornado = valorRetornado.replace("@valorObjetoSustituir",valorObjetoReg);
		break;
		
	case "REPLACE":
		
		vArrayValoresObjeto = valorObjetoReg.split("|");	//Generamos el array de valores
		vArrayCamposObjeto = camposObjetoReg.split("|");	//Generamos el array de campos
		vExistenTodosLosCampos = true;
		vTextoCamposErroneos = "";
		
		//Tenemos que buscar si la tabla existe en la definicion de tabla/campo
		var vRowsCoincidenDefinicion = objTablaDefinicionCampos.searchRows("idTabla", "=", idObjetoReg);

		if (vRowsCoincidenDefinicion.length == 1){
			
			vArrayValoresObjeto.forEach(componeClausulaWhere);	//Llamamos a la funcion que genera el comando
		}else{
			//Si no esta o esta mas de una vez. Error
			if (vRowsCoincidenDefinicion.length == 0){valorRetornado = "No se puede generar el comando. No existe la tabla en la definicion.";}
			if (vRowsCoincidenDefinicion.length > 1){valorRetornado = "No se puede generar el comando. La tabla esta repetida en la definicion.";}
		}
		
		//Definimos la funcion que recorre el array y genera la clausula where
		function componeClausulaWhere(element, index, array){
		
			vRowDefinicionData = vRowsCoincidenDefinicion[0]._row.data;
			vCamposRowDefinicionData = vRowDefinicionData.campos;
			
			//Como los dos arrays siempre tienen el mismo numero de elementos y estan ordenados de la misma forma con recorrer uno y acceder a los dos es suficiente
			vIdCampoWhere = vArrayCamposObjeto[index];
			vValorWhere = vArrayValoresObjeto[index];
			
			//Ahora tenemos que buscar la columna en la definicion de tablas. Primero miramos si existe
			vExisteCampo = vCamposRowDefinicionData.some(u => u.idCampo === vIdCampoWhere)
			if (vExisteCampo){
				
				vObjetoCampoDefinicion = vCamposRowDefinicionData.find(u => u.idCampo === vIdCampoWhere);
				vIdTipoCampoDefinicion = vObjetoCampoDefinicion.idTipoCampo;
				
				//A partir del primer campo hay que añadir los "and" a la sentencia where 
				if (index > 0){
					vClausulaWhere = vClausulaWhere + " and "
				}
				
				//Segun el tipo de campo tenemos que poner el valor de una forma u otra
				if (['int', 'float', 'double', 'numeric'].includes(vIdTipoCampoDefinicion)){
					//Si es numero ponemos el valor sin mas
					vClausulaWhere = vClausulaWhere + vIdCampoWhere + " = " + vValorWhere;
				}else{
					//Si es fecha lo ponemos con su formato de tipo fecha
					if (['datetime'].includes(vIdTipoCampoDefinicion)){
						vClausulaWhere = vClausulaWhere + vIdCampoWhere + " = {d " + comillaSimple + vValorWhere + comillaSimple + "}";
					}else{	
						//En el resto de casos lo tratamos como si fuera cadena y lo ponemos entre comillas
						vClausulaWhere = vClausulaWhere + vIdCampoWhere + " = " + comillaSimple + vValorWhere + comillaSimple;
					}
				}
				
			}else{
				//Si no existe el campo lo mostramos como error
				vExistenTodosLosCampos = false;
				vTextoCamposErroneos = vTextoCamposErroneos + "No existe el campo @idCampoSustituir en la definicion de la tabla. ";
				vTextoCamposErroneos = vTextoCamposErroneos.replace("@idCampoSustituir",vIdCampoWhere);
			}
			
			//Si existen todos los campos pintamos el comando
			if (vExistenTodosLosCampos){
				valorRetornado = semillaReplace;
				//Sustituimos los comodines por los valores reales
				valorRetornado = valorRetornado.replace("@idObjetoSustituir",idObjetoReg);
				valorRetornado = valorRetornado.replace("@clausulaWhereSustituir",vClausulaWhere);
			}else{
				//Si no pintamos los campos que no hemos encontrado
				valorRetornado = "No se puede generar el comando. @textoErrorSustituir";
				valorRetornado = valorRetornado.replace("@textoErrorSustituir",vTextoCamposErroneos);
			}
		}

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
		movableColumns: true,
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
			{field:"comando",title:"comando",mutator:componeComandoMutator,visible:true},
			{field:"status",title:"estado",mutator:statusMutator,formatter:"tickCross",frozen:true}
		]
	});
	
	objTableObjetosModificados.on("tableBuilt", function(){
		objTableObjetosModificados.moveColumn("status", "tipoTransfer", false);
	});
	
}

/* cargar JSON */
document.getElementById("fileInput").addEventListener("change",function(e){

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
		document.getElementById("fileInput").value = "";
	}else{
	
		const reader=new FileReader()
		reader.onload=function(event){
			const json=JSON.parse(event.target.result)
			jsonData=json.objetosModificados
			
			if (typeof jsonData === 'undefined'){
				showToast("El archivo elegido no es correcto", "error");
				document.getElementById("fileInput").value = "";
			}else{
				createTableObjetosModificados(jsonData);
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
	const vArrayDatosExportar = objTableObjetosModificados.searchData("status", "=", true);		//Exportaremos solo los que tienen status = ok
	
	let vTextoExportar = "";
	let vComando = "";
	let vSeparador = "\\";
	let vSaltoLinea = "\r\n";
	
	function componeTextoExportar(element, index, array){
		
		//Obtenemos el comando y lo vamos concatenando en la variable con el texto que volcaremos al fichero
		vComando = element.comando;
		vTextoExportar = vTextoExportar + vComando + vSeparador + vSaltoLinea;
	}
	
	//Componemos el texto
	vArrayDatosExportar.forEach(componeTextoExportar);
	
	var vRowsComandoErroneo = objTableObjetosModificados.searchRows("status", "=", false);
	if (vRowsComandoErroneo.length > 0){
		showToast("Los comandos erroneos no se han exportado", "warning");
	}
	
	return;
	//Generamos el archivo
	const blob=new Blob([vTextoExportar],{type:"text/plain;charset=utf-8"});
	const a=document.createElement("a")
	a.href=URL.createObjectURL(blob)
	a.download="objetosModificados"+fechaIsoString+".txt";	//Añadimos al nombre del archivo la fecha del sistema
	a.click()
	showToast("Ha finalizado la generacion de comandos", "success");
}


function filtrarTexto(textoFiltro,objetoMostrar,objetoOcultar){
	
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
	
	document.getElementById("buscadorObjetosModificados").value = textoFiltro;
	
	//pasamos a minusculas para que el buscador encuentra mayusc y minusc
	textoFiltro = textoFiltro.toLowerCase();
	
	objTableObjetosModificados.setFilter(function(data){

		return Object.values(data).some(v=>

			String(v).toLowerCase().includes(textoFiltro)
		)
	})
	
};