//== Class definition

var DatatableJsonRemoteDemo = function () {
	//== Private functions

	// basic demo
	var demo = function () {

		var datatable = $('.m_datatable').mDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: 'https://api-sweatrate.herokuapp.com/users',
				method: 'GET',
				pageSize: 10,
			},

			// layout definition
			layout: {
				theme: 'default', // datatable theme
				class: '', // custom wrapper class
				scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
				footer: false // display/hide footer
			},

			// column sorting
			sortable: true,

			pagination: true,

			search: {
				input: $('#generalSearch')
			},

			// columns definition
			columns: [{
				field: "SNo",
				title: "S.No",
				width: 50,
				sortable: false,
				selector: false,
				textAlign: 'center'
			}, {
				field: "UserName",
				title: "User Name"
			}, {
				field: "Email",
				title: "Email",
				template: function (row) {
					// callback function support for column rendering
					return row.ShipCountry + ' - ' + row.ShipCity;
				}
			}, {
				field: "Status",
				title: "Status",
				width: 110
			}, {
				field: "Deactivate",
				title: "Deactivate",
				responsive: {visible: 'lg'}
			}, {
				field: "DeleteUser",
				title: "Delete User",
				responsive: {visible: 'lg'}
			}, {
				field: "ResetPassword",
				title: "Reset Password",
				type: "date",
				format: "MM/DD/YYYY"
			}]
		});

		var query = datatable.getDataSourceQuery();

		$('#m_form_status').on('change', function () {
			datatable.search($(this).val(), 'Status');
		}).val(typeof query.Status !== 'undefined' ? query.Status : '');

		$('#m_form_type').on('change', function () {
			datatable.search($(this).val(), 'Type');
		}).val(typeof query.Type !== 'undefined' ? query.Type : '');

		$('#m_form_status, #m_form_type').selectpicker();

	};

	return {
		// public functions
		init: function () {
			demo();
		}
	};
}();

jQuery(document).ready(function () {
	DatatableJsonRemoteDemo.init();
});