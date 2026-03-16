let table
let jsonData=[]

const columns=[

	{id:"idClass",title:"idClass"},
	{id:"idRealObject",title:"idRealObject"},
	{id:"idPkField",title:"idPkField"},
	{id:"tipoTransfer",title:"tipoTransfer"},
	{id:"idRealObjectLectura",title:"idRealObjectLectura"}

]

function createTable(){

	table = new Tabulator("#table",{
		ajaxURL:"/configuracion/tablasEscanear.json",
		layout:"fitColumns",
		addRowPos:"top",
		height:"500px",
		pagination:false,
		paginationSize:8,
		selectable:1,
		movableColumns:false,
		columns:columns.map(c=>({
			title:c.title,
			field:c.id,
			editor:"input",
			headerFilter:"input"
		}))
	})

}

/* buscador global */



/* añadir fila */

function addRow(){

	table.addRow({

		idClass:"",
		idRealObject:"",
		idPkField:"",
		tipoTransfer:"",
		idRealObjectLectura:""

	})

}

/* eliminar fila */

function deleteRow(){

	const rows=table.getSelectedRows()

	if(rows.length===0){
		alert("Selecciona una fila")
		return
	}

	rows[0].delete()

}

/* exportar */

function exportJSON(){

	const data=table.getData()
	const finalJSON=data

	const blob=new Blob(
		[JSON.stringify(finalJSON,null,2)],
		{type:"application/json"}
	)

	const a=document.createElement("a")

	a.href=URL.createObjectURL(blob)
	a.download="tablasEscanearDownload.json"
	a.click()

}


$(document).ready(function(){

	const buscador = document.querySelector("globalSearch");
	buscador.addEventListener("keyup",function(){

		const value=this.value.toLowerCase()

		table.setFilter(function(data){

			return Object.values(data).some(v=>
				String(v).toLowerCase().includes(value)
			)

		})

	})
	
	
	createTable();
})
