
var objTableObjetosModificados
var objTablaDefinicionCampos
var jsonData=[]


/* eliminar fila */
function deleteRow(argTable){

	const rows=argTable.getSelectedRows()
	if(rows.length===0){
		alert("Selecciona una fila")
		return
	}
	
	for (let i = 0; i < rows.length; i++) {
		rows[i].delete();
	}
}

/* vaciar tabla */
function clearTable(argTable){
	
	argTable.clearData()
}