<?php

namespace Application\Model;

class Product
{
    private $id;
    private $name;
    private $description;
    private $price;

    public function exchangeArray($data)
    {
        $this->id          = (!empty($data['id'])) ? (int) $data['id'] : null;
        $this->name        = (!empty($data['name'])) ? (string) $data['name'] : null;
        $this->description = (!empty($data['description'])) ? (string) $data['description'] : null;
        $this->price       = (!empty($data['price'])) ? (double) sprintf('%0.2f', $data['price']) : null;
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