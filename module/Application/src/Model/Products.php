<?php

namespace Application\Model;

class Products
{
    private $id;
    private $name;
    private $description;
    private $price;

    public function exchangeArray($data)
    {
        $this->id          = (!empty($data['id'])) ? (int) $data['id'] : null;
        $this->name        = (!empty($data['name'])) ? $data['name'] : null;
        $this->description = (!empty($data['description'])) ? $data['description'] : null;
        $this->price       = (!empty($data['price'])) ? (float) sprintf('%0.2f', $data['price']) : 0.00;
    }

    public function toArray()
    {
        $data['id'] = $this->id;
        $data['name'] = $this->name;
        $data['description'] = $this->description;
        $data['price'] = $this->price;

        return $data;
    }
}