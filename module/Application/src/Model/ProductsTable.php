<?php

namespace Application\Model;

use Zend\Db\TableGateway\TableGateway;

class ProductsTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function getProducts() {
        $rowset = $this->tableGateway->select();
        $rows = [];

        foreach ($rowset as $row) {
            $rows[] = $row->toArray();
        }

        return $rows;
    }
}