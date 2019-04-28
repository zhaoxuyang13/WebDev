package com.backend.bookstore.service;

import com.backend.bookstore.entity.Beans.DatePairBean;
import com.backend.bookstore.entity.Order;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.entity.OrderWithItems;
import com.backend.bookstore.mapper.OrderMapper;
import com.sun.org.apache.xpath.internal.operations.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class OrderService {
    @Autowired
    OrderMapper orderMapper;
    public void insertNewOrder(Order order){
         orderMapper.insertNewOrder(order);
    }

    public void insertNewOrderItem(OrderItem orderItem){
        orderMapper.insertNewOrderItem(orderItem);
    }

    public List<OrderItem> SelectOrderItemsByOrderID(int orderID){
        return orderMapper.SelectOrderItemsByOrderID(orderID);
    }
    public List<Order> SelectOrderByUser(int userID){
        return orderMapper.SelectOrderByUser(userID);
    }
    public List<OrderWithItems> SelectOrderWithItemsByUser(int userID){
        List<Order> orders = orderMapper.SelectOrderByUser(userID);
        if(orders == null) return null;
        List<OrderWithItems> orderWithItems = new ArrayList<>();
        for(Order order : orders){
            List<OrderItem> items = orderMapper.SelectOrderItemsByOrderID(order.getOrderID());
            if(items != null) {
                orderWithItems.add(
                        new OrderWithItems(order, items)
                );
            }
        }
        return orderWithItems;
    }
    public List<Order> SelectAllOrders(){
        return orderMapper.SelectAllOrders();
    }
    public List<OrderWithItems> SelectAllOrderWithItems(){
        List<Order> orders = orderMapper.SelectAllOrders();
        if(orders == null) return null;
        List<OrderWithItems> orderWithItems = new ArrayList<>();
        for(Order order : orders){
            List<OrderItem> items = orderMapper.SelectOrderItemsByOrderID(order.getOrderID());
            if(items != null) {
                orderWithItems.add(
                        new OrderWithItems(order, items)
                );
             }
        }
        return orderWithItems;
    }

    public List<OrderWithItems> SelectByTimeRange(int userID, DatePairBean datePairBean){
        List<Order> orders=orderMapper.SelectByTimeRange(userID,datePairBean.getStartTime(),datePairBean.getEndTime());
        if(orders == null) return null;
        List<OrderWithItems> orderWithItems = new ArrayList<>();
        for(Order order : orders){
            List<OrderItem> items = orderMapper.SelectOrderItemsByOrderID(order.getOrderID());
            if(items != null) {
                orderWithItems.add(
                        new OrderWithItems(order, items)
                );
            }
        }
        return orderWithItems;
    }
}
