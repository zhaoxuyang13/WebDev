package com.backend.bookstore.service;

import com.backend.bookstore.entity.Order;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.mapper.OrderMapper;
import com.sun.org.apache.xpath.internal.operations.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class OrderService {
    @Autowired
    OrderMapper orderMapper;
    public int insertNewOrder(Order order){
       return orderMapper.insertNewOrder(order);
    }

    public int insertNewOrderItem(OrderItem orderItem){
        return orderMapper.insertNewOrderItem(orderItem);
    }
}
