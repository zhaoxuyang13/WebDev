package com.backend.bookstore.service;

import com.backend.bookstore.entity.Beans.DatePairBean;
import com.backend.bookstore.entity.Order;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.entity.OrderWithItems;
import com.backend.bookstore.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public interface OrderService {
    void insertNewOrder(Order order);

    void insertNewOrderItem(OrderItem orderItem);
    List<OrderItem> SelectOrderItemsByOrderID(int orderID);
    List<Order> SelectOrderByUser(int userID);
    List<OrderWithItems> SelectOrderWithItemsByUser(int userID);
    List<Order> SelectAllOrders();
    List<OrderWithItems> SelectAllOrderWithItems();

    List<OrderWithItems> SelectByTimeRange(int userID, DatePairBean datePairBean);
    List<OrderWithItems> SelectAllByTimeRange(DatePairBean datePairBean);
}
