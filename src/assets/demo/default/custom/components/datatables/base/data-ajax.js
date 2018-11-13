//== Class definition

var DatatableRemoteAjaxDemo = function () {
  //== Private functions

  // basic demo
  var demo = function () {

    var datatable = $('.m_datatable').mDatatable({
      // datasource definition
    data: {
                type: 'remote',
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: 'https://keenthemes.com',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
                            'Content-Type': 'application/json'
                        },
                        map: function (raw) {
                            console.log(raw);
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false,
                footer: false
            },

            // column sorting
            sortable: true,

            pagination: true,

            toolbar: {
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        // page size select
                        pageSizeSelect: [10, 20, 30, 50, 100],
                    },
                },
            },

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [
                
                {
                    field: '',
                    title: 'S.No',
                    sortable: false, // disable sort for this column
                    width: 40,
                    selector: false,
                    textAlign: 'center',
                    template: function (row, index, datatable) {
                        return index + 1;
                    },
                },
                {
                    field: 'first_name',
                    title: 'First Name',
                    filterable: true,
                    sortable: true,
                    width: 150,
                },
                {
                    field: 'email',
                    title: 'Email',
                    filterable: true,
                    sortable: true,
                },
                {
                    field: 'is_active',
                    title: 'Status',
                    width: 100,
                    filterable: true,
                    sortable: true,
                    template: function (row) {
                        var dropup = (row.is_active) == true ? 'Active' : 'Deactive';
                        if (dropup == 'Active') {
                            return '<span class="m-badge m-badge--success m-badge--wide">' + dropup + '</span>';
                        }
                        else if (dropup == 'Deactive') {
                            return '<span class="m-badge m-badge--danger m-badge--wide">' + dropup + '</span>';
                        }
                    }

                },
                {
                    field: 'Deactivate',
                    width: 170,
                    title: 'Deactivate',
                    sortable: false,
                    overflow: 'visible',
                    template: function (row, index, datatable) {
                        var checkStatus = (row.is_active) == true ? 'Active' : 'Deactive';
                        if (checkStatus == "Active") {
                            return '\<span class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_active="' + row.is_active + '" checked="checked" name="" class="listUsersActivate" /><span></span></label></span>';
                        }
                        else if (checkStatus == "Deactive") {
                            return '\<span class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_active="' + row.is_active + '" name="" class="listUsersActivate" /><span></span></label></span>';
                        }
                    },
                },
                {
                    field: 'Actions',
                    width: 170,
                    title: 'Actions',
                    sortable: false,
                    overflow: 'visible',

                    template: function (row, index, datatable) {
                        return '\<a data-id="' + row.id + '" data-email="'+ row.email +'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-reset" title="Reset Password"><i class="la la-refresh"></i></a>\
                        <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details"><i class="la la-edit"></i></a>\
                        <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                        ';
                    },
                }],
    });




    var query = datatable.getDataSourceQuery();

    $('#m_form_status').on('change', function () {
      datatable.search($(this).val().toLowerCase(), 'Status');
    });

    $('#m_form_type').on('change', function () {
      datatable.search($(this).val().toLowerCase(), 'Type');
    });

    $('#m_form_status, #m_form_type').selectpicker();

  };


  return {
    // public functions
    init: function () {
      demo();
    },
  };
}();



jQuery(document).ready(function () {
  DatatableRemoteAjaxDemo.init();
});


