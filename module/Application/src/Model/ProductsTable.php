<?php

namespace Application\Model;

use Zend\Db\TableGateway\TableGateway;
use Zend\Db\Sql\Select;

class ProductsTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * Select, filter, and sort a list of products
     * 
     * @param integer $limit
     * @param integer $page
     * @param string  $sort
     * @param string  $sortDirection
     * 
     * @return array  $rows
     */
    public function getProducts(
        int    $limit = 25,
        int    $page = 0,
        string $sort = 'id',
        string $sortDirection = 'ASC'
    ) {
        switch ($sort) {
            case 'id':
            case 'name':
            case 'description':
            case 'price':
                $sortDirection = in_array($sortDirection, ['ASC', 'DESC']) ? $sortDirection : 'ASC';
                $order = $sort . ' ' . $sortDirection;
                break;
            default:
                return false;
        }

        $select = $this->tableGateway->getSql()->select();

        $select->order($order);
        $select->limit($limit);
        $select->offset($page);

        $rowset = $this->tableGateway->selectWith($select);

        $rows = [];
        foreach ($rowset as $row) {
            $rows[] = $row->toArray();
        }

        return $rows;
    }
}