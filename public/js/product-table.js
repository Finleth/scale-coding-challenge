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
                error: console.log
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
            this.finishEditProduct();

            this.currentEditProduct.row = $(event.target).closest('tr');
            this.currentEditProduct.id = this.currentEditProduct.row.data('product-id') >> 0;
            this.currentEditProduct.name = this.currentEditProduct.row.find('.product-name').text();
            this.currentEditProduct.description = this.currentEditProduct.row.find('.product-description').text();
            this.currentEditProduct.price = parseFloat(this.currentEditProduct.row.find('.product-price').text());

            this.currentEditProduct.row.find('.product-name').empty();
            this.currentEditProduct.row.find('.product-description').empty();
            this.currentEditProduct.row.find('.product-price-col').empty();
            this.currentEditProduct.row.find('.product-actions').empty();

            var name = $('<input>')
                .addClass('form-control')
                .val(this.currentEditProduct.name);

            var description = $('<input>')
                .addClass('form-control')
                .val(this.currentEditProduct.description);

            var priceContainer = $('<div></div>').addClass('input-group');
            var priceLabelContainer = $('<div></div>').addClass('input-group-prepend');
            var priceLabel = $('<div></div>').addClass('input-group-text').text('$');
            var price = $('<input>')
                .attr({
                    'type': 'number',
                    'min': 0
                })
                .addClass('form-control')
                .val(this.currentEditProduct.price);
        
            priceLabelContainer.append(priceLabel);
            priceContainer.append(priceLabelContainer, price);

            this.currentEditProduct.row.find('.product-name').append(name);
            this.currentEditProduct.row.find('.product-description').append(description);
            this.currentEditProduct.row.find('.product-price-col').append(priceContainer);
            this.currentEditProduct.row.find('.product-actions').append(this.saveAction, this.cancelAction);
        },


        saveProduct: function()
        {
            var self = this;
            var name = this.currentEditProduct.row.find('.product-name input').val();
            var description = this.currentEditProduct.row.find('.product-description input').val();
            var price = this.currentEditProduct.row.find('.product-price-col input').val();

            var ajaxOptions = {
                url: '/products/' + this.currentEditProduct.id,
                method: 'PUT',
                dataType: 'JSON',
                data: {
                    name: name,
                    description: description,
                    price: price
                },
                success: function(res)
                {
                    if (!res.error) {
                        self.currentEditProduct.name = name;
                        self.currentEditProduct.description = description;
                        self.currentEditProduct.price = price;

                        self.finishEditProduct();
                    }
                },
                error: console.log
            };

            $.ajax(ajaxOptions);
        },

        /**
         * Returns product table row to readonly
         * 
         * @return {void} 
         */
        finishEditProduct: function()
        {
            if (!this.currentEditProduct.row) {
                return;
            }

            this.currentEditProduct.row.find('.product-name').empty();
            this.currentEditProduct.row.find('.product-description').empty();
            this.currentEditProduct.row.find('.product-price-col').empty();
            this.currentEditProduct.row.find('.product-actions').empty();

            var price = $('<span></span>').addClass('product-price').text(this.currentEditProduct.price);

            this.currentEditProduct.row.find('.product-name').text(this.currentEditProduct.name);
            this.currentEditProduct.row.find('.product-description').text(this.currentEditProduct.description);
            this.currentEditProduct.row.find('.product-price-col').append('$', price);
            this.currentEditProduct.row.find('.product-actions').append(this.editAction, this.deleteAction);

            this.currentEditProduct.row = null;
            this.currentEditProduct.id = null;
            this.currentEditProduct.name = null;
            this.currentEditProduct.description = null;
            this.currentEditProduct.price = null;
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
            var name = $('<td></td>').addClass('product-name').text(rowData.name ? rowData.name : '-');
            var description = $('<td></td>').addClass('product-description').text(rowData.description ? rowData.description : '-');
            var priceSpan = $('<span></span>').addClass('product-price').text(rowData.price ? rowData.price : '-');
            var price = $('<td></td>').addClass('product-price-col').append('$', priceSpan);
            var action = $('<td></td>').addClass('product-actions').append(this.editAction, this.deleteAction);

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
            this.editAction = '<a href="#"><i class="fas fa-pencil-alt fa-fw edit-product"></i></a>';
            this.deleteAction = '<a href="#"><i class="fas fa-trash fa-fw delete-product"></i></a>';
            this.saveAction = '<a href="#"><i class="fas fa-save fa-fw save-product"></i></a>';
            this.cancelAction = '<a href="#"><i class="fas fa-times fa-fw cancel-product"></i></a>';
            this.currentEditProduct = {
                row: null, // jQuery wrapped <tr> row element
                id: null, // integer
                name: null, // string
                description: null, // string
                price: null // float/double
            };

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
            this.productTableBody.on('click', '.save-product', this.saveProduct.bind(this));
            this.productTableBody.on('click', '.cancel-product', this.finishEditProduct.bind(this));
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