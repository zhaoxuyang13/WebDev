package com.backend.bookstore.mapper;

import com.backend.bookstore.entity.BookData;
import com.backend.bookstore.entity.Order;
import com.backend.bookstore.entity.OrderItem;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderMapper {
    int insertNewOrder(Order order);
    int insertNewOrderItem(OrderItem orderItem);
}
