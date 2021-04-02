"use strict"

$(document).ready(function(){
    var productTableModule = {
        
        /**
         * Reads the filter values and calls the GET /products endpoint with
         * those values. Redraws the table with the returned products
         * 
         * @return {void}
         */
        filterProducts: function()
        {
            var self = this;
            var ajaxOptions = {
                url: '/products',
                method: 'GET',
                data: {
                    limit: this.limitElement.val(),
                    page: (this.pageElement.val() >> 0) - 1,
                    sort: this.sortDirectionGroup.find('.active input').val() + this.sortElement.val()
                },
                success: function(res)
                {
                    if (!res.error) {
                        self.redrawProductTable(res.data);
                    }
                },
                error: function(err)
                {
                    console.log(err);
                }
            };

            $.ajax(ajaxOptions);
        },

        /**
         * Updates a product table row with inline editing and save/cancel buttons
         * 
         * @param {object} event
         * 
         * @return {void}
         */
        editProduct: function(event)
        {
            console.log($(event.target).closest('tr').data('product-id') >> 0);
        },

        /**
         * Deletes a product and update the product table
         * 
         * @param {object} event
         * 
         * @return {void} 
         */
        deleteProduct: function(event)
        {
            console.log($(event.target).closest('tr').data('product-id') >> 0);

            this.filterProducts();
        },

        /**
         * Takes an array of products, clears the old data, and adds the
         * new rows to the table body
         * 
         * @param {array} rows
         * 
         * @return {void}
         */
        redrawProductTable: function(rows)
        {
            var self = this;
            if (!rows.length) {
                console.log('No rows found!');
                return;
            }

            this.productTableBody.empty();

            rows.forEach(function(row) {
                self.drawProductRow(row);
            });
        },

        /**
         * Takes a product object and creates/appends a jQuery row
         * with the row's data
         * 
         * @param {object} row
         * 
         * @return {void}
         */
        drawProductRow: function(rowData)
        {
            var row = $('<tr></tr>').data('product-id', rowData.id);
            var id = $('<td></td>').text(rowData.id ? rowData.id : '-');
            var name = $('<td></td>').text(rowData.name ? rowData.name : '-');
            var description = $('<td></td>').text(rowData.description ? rowData.description : '-');
            var price = $('<td></td>').text(rowData.price ? '$' + rowData.price : '-');
            var action = $('<td></td>').append(this.editIcon, this.deleteIcon);

            row.append(id, name, description, price, action);

            this.productTableBody.append(row);
        },

        /**
         * Set references to product table elements wrapped in jQuery
         * 
         * @return {void}
         */
        setVars: function()
        {
            this.editIcon = '<a href="#"><i class="fas fa-pencil-alt fa-fw edit-product"></i></a>';
            this.deleteIcon = '<a href="#"><i class="fas fa-trash fa-fw delete-product"></i></a>';

            this.limitElement = $('#product-table-limit');
            this.pageElement = $('#product-table-page');
            this.sortElement = $('#product-table-sort');
            this.sortDirectionGroup = $('#product-table-sort-direction');
            this.filterElement = $('#product-table-filter');
            this.productTableBody = $('#product-table-body');
        },

        /**
         * Apply event handlers with binds
         * 
         * @return {void}
         */
        setEventHandlers: function()
        {
            this.filterElement.on('click', this.filterProducts.bind(this));

            // delegated event handlers
            this.productTableBody.on('click', '.edit-product', this.editProduct.bind(this));
            this.productTableBody.on('click', '.delete-product', this.deleteProduct.bind(this));
        },

        /**
         * Call the setup methods
         * 
         * @return {void}
         */
        init: function()
        {
            this.setVars();
            this.setEventHandlers();
        }
    };

    productTableModule.init();
});