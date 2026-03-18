
var objTableObjetosModificados
var objTablaDefinicionCampos
var jsonData=[]


/* eliminar fila */
function deleteRow(argTable){

	const rows=argTable.getSelectedRows()
	if(rows.length===0){
		showToast("No has seleccionado ninguna fila", "error");
		return
	}
	
	for (let i = 0; i < rows.length; i++){
		rows[i].delete();
	}
}

/* vaciar tabla */
function clearTable(argTable){
	argTable.clearData()
}

function mostrarAlertaTabla(argTable,texto){
	argTable.alert(texto);
}

function mostrarAlertaTabla(argTable){
	argTable.clearAlert();
}