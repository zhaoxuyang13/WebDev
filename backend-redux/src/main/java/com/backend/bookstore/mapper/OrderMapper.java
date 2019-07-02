package com.backend.bookstore.mapper;

import com.backend.bookstore.entity.Order;
import com.backend.bookstore.entity.OrderItem;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderMapper {
    void insertNewOrder(Order order);
    void insertNewOrderItem(OrderItem orderItem);
    List<OrderItem> SelectOrderItemsByOrderID(int orderID);
    List<Order> SelectOrderByUser(int userID);
    List<Order> SelectAllOrders();
    List<Order> SelectByTimeRange(int userID,long startTime,long endTime);
    List<Order> SelectAllByTimeRange(long startTime,long endTime);
}
