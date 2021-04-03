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
            this.productTableAlert.hide();
            
            var ajaxOptions = {
                url: '/products',
                method: 'GET',
                data: {
                    limit: this.limitElement.val(),
                    page: (this.pageElement.val() >> 0) - 1,
                    sort: this.sortDirectionGroup.find('.active input').val() + this.sortElement.val()
                },
                error: function(err)
                {
                    self.alertMessage('Soemthing went wrong. Please try again.', 'danger', 'product-table');
                }
            };

            $.ajax(ajaxOptions).then(function(res) {
                if (!res.error) {
                    if (!res.data.length) {
                        self.alertMessage('No rows found!', 'warning', 'product-table');
                        return;
                    }
                    ajaxOptions.data.limit = 0;

                    $.ajax(ajaxOptions).then(function(res2) {
                        if (!res2.error) {
                            self.redrawProductTable(res.data);
                            self.updatePaginationInfo(self.limitElement.val() >> 0, self.pageElement.val() >> 0, res.data.length, res2.data.length)
                        } else {
                            self.alertMessage(res.error, 'warning', 'product-table');
                        }
                    });
                } else {
                    self.alertMessage(res.error, 'warning', 'product-table');
                }
            });
        },

        createProduct: function()
        {
            var self = this;
            var name = this.createProductName.val();
            var description = this.createProductDescription.val();
            var price = this.createProductPrice.val();
            var errors = [];

            if (name === '') {
                errors.push('Please enter a name.');
            }
            if (description === '') {
                errors.push('Please enter a description.');
            }
            if (price === '') {
                errors.push('Please enter a price.');
            }

            if (errors.length) {
                self.alertMessage(errors, 'danger', 'create-product');
                return;
            } else {
                this.createProductAlert.hide();
            }

            var ajaxOptions = {
                url: '/products',
                method: 'POST',
                dataType: 'JSON',
                data: {
                    name: name,
                    description: description,
                    price: price
                },
                success: function(res)
                {
                    if (!res.error) {
                        self.filterProducts();
                        self.createProductModal.modal('hide');

                        self.createProductName.val('');
                        self.createProductDescription.val('');
                        self.createProductPrice.val('');
                    } else {
                        self.alertMessage(res.error, 'danger', 'create-product');
                    }
                },
                error: function(err)
                {
                    self.alertMessage('Soemthing went wrong. Please try again.', 'danger', 'create-product');
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
            this.finishEditProduct();

            this.currentEditProduct.row = $(event.target).closest('tr');
            this.currentEditProduct.id = this.currentEditProduct.row.data('product-id') >> 0;
            this.currentEditProduct.name = this.currentEditProduct.row.find('.product-name').text();
            this.currentEditProduct.name = this.currentEditProduct.name !== '-' ? this.currentEditProduct.name : '';
            this.currentEditProduct.description = this.currentEditProduct.row.find('.product-description').text();
            this.currentEditProduct.description = this.currentEditProduct.description !== '-' ? this.currentEditProduct.description : '';
            this.currentEditProduct.price = this.currentEditProduct.row.find('.product-price').text();
            this.currentEditProduct.price = this.currentEditProduct.price !== '' ? parseFloat(this.currentEditProduct.price).toFixed(2) : '';

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

        /**
         * Updates a product using the values from the edited row
         * Calls PUT /products/<id>
         * 
         * @return {void}
         */
        saveProduct: function()
        {
            var self = this;
            var name = this.currentEditProduct.row.find('.product-name input').val();
            var description = this.currentEditProduct.row.find('.product-description input').val();
            var price = this.currentEditProduct.row.find('.product-price-col input').val();
            var errors = [];

            if (name === '') {
                errors.push('Please enter a name.');
            }
            if (description === '') {
                errors.push('Please enter a description.');
            }
            if (price === '') {
                errors.push('Please enter a price.');
            }

            if (errors.length) {
                self.alertMessage(errors, 'danger', 'product-table');
                return;
            } else {
                this.productTableAlert.hide();
            }

            price = parseFloat(price);

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
                        self.currentEditProduct.price = price.toFixed(2);

                        self.finishEditProduct();
                    } else {
                        self.alertMessage(res.error, 'danger', 'product-table');
                    }
                },
                error: function(err)
                {
                    self.alertMessage('Soemthing went wrong. Please try again.', 'danger', 'product-table');
                }
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

            var price = this.currentEditProduct.price ? ['$', $('<span></span>').addClass('product-price').text(this.currentEditProduct.price)] : '-';

            this.currentEditProduct.row.find('.product-name').text(this.currentEditProduct.name ? this.currentEditProduct.name : '-');
            this.currentEditProduct.row.find('.product-description').text(this.currentEditProduct.description ? this.currentEditProduct.description : '-');
            this.currentEditProduct.row.find('.product-price-col').append(price);
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
            var self = this;
            var ajaxOptions = {
                url: '/products/' + ($(event.target).closest('tr').data('product-id') >> 0),
                method: 'DELETE',
                dataType: 'JSON',
                success: function(res)
                {
                    if (!res.error) {
                        self.filterProducts();
                    } else {
                        self.alertMessage(res.error, 'danger', 'product-table');
                    }
                },
                error: function(err)
                {
                    self.alertMessage('Soemthing went wrong. Please try again.', 'danger', 'product-table');
                }
            };

            $.ajax(ajaxOptions);
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
            var priceSpan = rowData.price ? ['$', $('<span></span>').addClass('product-price').text(rowData.price.toFixed(2))] : '-';
            var price = $('<td></td>').addClass('product-price-col').append(priceSpan);
            var action = $('<td></td>').addClass('product-actions').append(this.editAction, this.deleteAction);

            row.append(id, name, description, price, action);

            this.productTableBody.append(row);
        },

        /**
         * Takes the current page/page size and total records and displays the
         * information in the pagination info
         * 
         * @param {integer} limit
         * @param {integer} page
         * @param {integer} records
         * @param {integer} total
         * 
         * @return {void}
         */
        updatePaginationInfo: function(limit, page, records, total)
        {
            var start = ((page - 1) * limit) + 1;
            var end = start + records - 1;
            this.productTablePagination.text(start + '-' + end);
            this.productTableTotal.text(total);
        },

        /**
         * Displays the supplied message as a warning alert
         * 
         * @param {string|array} message
         * @param {string} type
         * @param {string} selector
         * 
         * @return {void} 
         */
        alertMessage: function(message, type, location)
        {
            var alertType, messages, messageBody;

            if (Array.isArray(message)) {
                messages = message.map(function(text) {
                    return $('<li></li>').text(text);
                });

                messageBody = $('<ul></ul>').css('margin-bottom', '0').append(messages);
            } else {
                messageBody = message;
            }

            switch (type) {
                case 'danger':
                    alertType = 'alert-danger';
                    break;
                case 'warning':
                default:
                    alertType = 'alert-warning';
                    break;
            }

            switch (location) {
                case 'product-table':
                    this.productTableAlert
                        .removeClass('alert-warning alert-error')
                        .addClass(alertType)
                        .empty()
                        .append(messageBody)
                        .show();
                    break;
                case 'create-product':
                    this.createProductAlert
                        .removeClass('alert-warning alert-error')
                        .addClass(alertType)
                        .empty()
                        .append(messageBody)
                        .show();
                    break;
            }
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
            this.createProductModal = $('#create-product-modal');
            this.createProductName = $('#create-product-name');
            this.createProductDescription = $('#create-product-description');
            this.createProductPrice = $('#create-product-price');
            this.createProductElement = $('#create-product');
            this.productTableAlert = $('#product-table-alert');
            this.createProductAlert = $('#create-product-alert');
            this.productTablePagination = $('#product-table-pagination');
            this.productTableTotal = $('#product-table-total');
        },

        /**
         * Apply event handlers with binds
         * 
         * @return {void}
         */
        setEventHandlers: function()
        {
            this.filterElement.on('click', this.filterProducts.bind(this));
            this.createProductElement.on('click', this.createProduct.bind(this));

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